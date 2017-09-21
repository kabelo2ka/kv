import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Song} from "../songs.component/song";
import {Subscription} from "rxjs";
import {SongService} from "../songs.component/song.service";
import {ActivatedRoute, Params} from "@angular/router";
import {User} from "../user.component/user";
import {AuthService} from "../auth/authService";
import {AudioService} from "../audio/audio.service";
import {AudioAPIWrapper} from "../audio/audio-api-wrapper";
import {SocketService} from "../socket.service";
import {AppService} from "../app.service";

class Res {
    data: any;
    meta?: any;
}

@Component({
    selector: 'app-song',
    templateUrl: './song.component.html',
    styleUrls: ['./song.component.css']
})

export class SongComponent implements OnInit, OnDestroy {
    @ViewChild('comments') comments;
    commentBody = '';

    loading: Subscription;
    song: Song;
    connection;
    unseenComments: any = [];
    unseenCommentsCount = 0;
    user: User;
    private loading_song: boolean;

    // Song status
    is_paused = false;
    isPlaying = false;

    constructor(private activatedRoute: ActivatedRoute,
                private songService: SongService,
                private socketService: SocketService,
                private authService: AuthService,
                private appService: AppService,
                private audioService: AudioService,
                private audioApiWrapper: AudioAPIWrapper,) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            const slug = params['slug'];
            // Load Song
            this.getSong(slug);
        });

        // Get authenticated user
        this.authService.user$.subscribe(
            user => {
                this.user = user;
            }
        );

        // Get audio status play | pause | stop
        this.audioService.status$.subscribe(
            status => {
                if (status === 'play') {
                    this.isPlaying = true;
                } else if (status === 'pause') {
                    this.isPlaying = false;
                } else if (status === 'stop') {
                    this.isPlaying = false;
                }
            }
        );
        // Subscribe to song comments channel
        this.connection = this.socketService.getComments().subscribe((res: any) => {
            // this.unseenComments.unshift((<any>Object).assign({}, res));
            this.song.comments.unshift(res.comment);
            this.unseenCommentsCount++;
            console.log(res.comment[0]);
        });
        this.audioApiWrapper.bindAudioEvent('canplaythrough').subscribe(
            () => this.loading_song = false
        );
        this.audioApiWrapper.bindAudioEvent('play').subscribe(
            () => {
                this.is_paused = false;
                this.loading_song = false;
            }
        );
        this.audioApiWrapper.bindAudioEvent('pause').subscribe(
            () => this.is_paused = true
        );
        this.audioApiWrapper.bindAudioEvent('ended').subscribe(
            () => this.is_paused = false
        );
    }

    getSong(slug: string) {
        this.loading = this.songService.getSong(slug).subscribe(
            (res: Res) => this.song = res.data
        );
    }

    loggedIn() {
        return this.authService.loggedIn();
    }

    onComment() {
        this.comments.onComment(this.commentBody, this.user).subscribe(
            () => {
                this.commentBody = '';
            }
        );
    }

    playSong() {
        this.loading_song = true;
        this.audioService.setActiveSong(this.song);
        this.audioService.setStatus('play');
    }

    pauseSong() {
        this.audioService.setStatus('pause');
        this.audioApiWrapper.pause();
    }

    likeSong() {
        this.songService.likeSong(this.song.id).subscribe(
            (res: any) => {
                if (res.data === 'Liked') {
                    this.song.likes_count += 1;
                    this.song.is_liked = true;
                } else {
                    this.song.likes_count -= 1;
                    this.song.is_liked = false;
                }
            }
        );
    }

    public showShareModal(): void {
        this.appService.showShareModal(true);
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }

}
