import {Component, OnInit, ViewChild} from "@angular/core";
import {Song} from "../songs.component/song";
import {Subscription} from "rxjs";
import {SongService} from "../songs.component/song.service";
import {ActivatedRoute, Params} from "@angular/router";
import {User} from "../user.component/user";
import {AuthService} from "../auth/authService";
import {AudioService} from "../audio/audio.service";
import {AudioAPIWrapper} from "../audio/audio-api-wrapper";
import {SocketService} from "../socket.service";

class Res {
    data: any;
    meta?: any;
}

@Component({
    selector: 'app-song',
    templateUrl: './song.component.html',
    styleUrls: ['./song.component.css']
})

export class SongComponent implements OnInit {
    @ViewChild('comments') comments;
    commentBody: string = '';

    loading: Subscription;
    song: Song;
    connection;
    unseenComments: any = [];
    unseenCommentsCount: number = 0;
    user: User;
    private loading_song: boolean;

    is_paused: boolean = false;
    isPlaying: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private songService: SongService,
        private socketService: SocketService,
        private authService: AuthService,
        private audioService: AudioService,
        private audioApiWrapper: AudioAPIWrapper
    )
    {}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            // Load Song
            this.getSong(id);
        });

        this.authService.user$.subscribe(
            res => this.user = res
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
        this.connection = this.socketService.getComments().subscribe(res => {
            this.unseenComments.unshift((<any>Object).assign({}, res));
            this.unseenCommentsCount++;
            console.log(res);
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

    getSong(id: number){
        this.loading = this.songService.getSong(id).subscribe(
            (res:Res) => this.song = res.data
        );
    }

    onComment(){
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

    ngOnDestroy() {
        this.connection.unsubscribe();
    }

}
