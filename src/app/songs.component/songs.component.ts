import {Component, OnInit} from '@angular/core';


import {SongService} from './song.service';
import {Song} from './song';
import {Meta} from '../meta';

import {Observable, Subscription} from 'rxjs';
import * as io from 'socket.io-client';

@Component({
    templateUrl: './songs.component.html',
    styleUrls: ['./songs.component.css'],
    // providers: [SongService]
})


export class SongsComponent implements OnInit {

    errorMessage: string;
    loading: Subscription;

    songs: Song[] = [];
    meta: Meta[];

    activeSongId: number;

    socket: any;
    SOCKET_URL = '//kasivibe.com:3000';

    constructor(
        private songService: SongService,
    ) {}

    ngOnInit(): void {
        this.getSongs();
        this.songService.like_song_btn$.subscribe(
            songId => {
                const songToModify = this.songs.find(song => song.id === songId);
                if (songToModify) {
                    songToModify.likes_count = songToModify.is_liked
                        ? songToModify.likes_count - 1
                        : songToModify.likes_count + 1;
                    songToModify.is_liked = !songToModify.is_liked;
                }
            }
        );
        /*this.audioService.active_song_selected$.subscribe(
            song => {
                const songToModify = this.songs.find(_song => _song.id === song.id);
                if (songToModify) {
                    this.activeSong = song;
                }
            }
        );*/
        this.socket = io(this.SOCKET_URL).connect();
        Observable.fromEvent(this.socket, 'songs:App\\Events\\UserPlayedSong').subscribe(
            (res: any) => {
                const songToModify = this.songs.find(song => song.id === res.song_id);
                if (songToModify) {
                    songToModify.plays_count += 1;
                }
            }
        );
    }

    getSongs() {
        this.loading = this.songService.getSongs(null).subscribe(
            (res: any) => {
                this.songs = res.data;
            },
            error => this.errorMessage = <any>error
        );
    }

    setActiveSongId(songId: number) {
        this.activeSongId = songId;
    }


}
