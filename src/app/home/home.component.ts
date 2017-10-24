import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/authService';
import {Subscription} from 'rxjs/Subscription';
import {SongService} from '../songs.component/song.service';
import {Song} from '../songs.component/song';


@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: []
})

export class HomeComponent implements OnInit, OnDestroy{

    user: any = {};
    is_logged_in = false;

    subscription: Subscription;
    loadingTrendingSongs: Subscription;
    trendingSongs: Song[];
    activeSongId: number;

    constructor(
        public authService: AuthService,
        private songService: SongService,
    ) {}

    ngOnInit(): void {
        this.authService.is_logged_in$.subscribe(
            is_logged_in => {
                this.is_logged_in = is_logged_in;
            }
        );
        this.authService.user$.subscribe(
            user => {
                this.user = user;
            }
        );
        this.getTrendingSongs();
    }

    getTrendingSongs() {
        this.loadingTrendingSongs = this.songService.getTrendingSongs(3).subscribe(
            (res: any) => {
                this.trendingSongs = res.data;
            },
        );
    }

    setActiveSongId(songId: number){
        this.activeSongId = songId;
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }

}
