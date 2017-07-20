import {Component, OnInit} from "@angular/core";


import {SongService} from "./song.service";
import {Song} from "./song";
import {Meta} from "../meta";
import {AudioService} from "../audio/audio.service";
import {AppService} from "../app.service";

import {Observable, Subscription} from "rxjs";
import {AudioAPIWrapper} from "../audio/audio-api-wrapper";
import * as io from "socket.io-client";

@Component({
    templateUrl: './songs.component.html',
    styleUrls: ['./songs.component.css'],
    // providers: [SongService]
})


export class SongsComponent implements OnInit {
    isPlaying: boolean = false;
    is_paused: boolean = false;
    has_ended: boolean = false;
    loading_song: boolean = true;

    errorMessage: string;
    loading: Subscription;
    songs: Song[] = [];
    meta: Meta[];

    activeSong: Song;
    playingSong: Song;

    socket: any;
    SOCKET_URL = 'http://www.kasivibe.com:3000';

    constructor(private songService: SongService,
                private audioService: AudioService,
                private appService: AppService,
                private audioApiWrapper: AudioAPIWrapper) {
    }

    ngOnInit(): void {
        this.getSongs();
        this.songService.like_song_btn$.subscribe(
            songId => {
                let songToModify = this.songs.find(song => song.id === songId);
                if (songToModify) {
                    songToModify.likes_count = songToModify.is_liked
                        ? songToModify.likes_count - 1
                        : songToModify.likes_count + 1;
                    songToModify.is_liked = !songToModify.is_liked;
                }
            }
        );
        this.audioService.active_song_selected$.subscribe(
            song => {
                let songToModify = this.songs.find(song => song.id === song.id);
                if (songToModify) {
                    this.activeSong = song;
                }
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
        this.audioApiWrapper.bindAudioEvent('loadedmetadata').subscribe(
            () => this.loading_song = false
        );
        this.audioApiWrapper.bindAudioEvent('play').subscribe(
            () => {
                this.is_paused = false;
                //this.loading_song = false;
            }
        );
        this.audioApiWrapper.bindAudioEvent('pause').subscribe(
            () => this.is_paused = true
        );
        this.audioApiWrapper.bindAudioEvent('ended').subscribe(
            () => this.is_paused = false
        );
        this.socket = io(this.SOCKET_URL).connect();
        Observable.fromEvent(this.socket, 'songs:App\\Events\\UserPlayedSong').subscribe(
            (res: any) => {
                let songToModify = this.songs.find(song => song.id === res.song_id);
                if (songToModify) {
                    songToModify.plays_count += 1;
                }
            }
        );
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    getSongs() {
        this.loading = this.songService.getSongs(null).subscribe(
            (res: any) => {
                this.songs = res.data;
                //this.meta = res.meta;
            },
            error => this.errorMessage = <any>error
        );
    }


    playSong(song: any) {
        this.loading_song = true;
        this.is_paused = true;
        this.setActiveSong(song);
        this.isPlayingSong(song);
        this.audioService.setStatus('play');
        this.appService.setRightPanelVisible(true);
    }

    pauseSong() {
        this.audioService.setStatus('pause');
        this.audioApiWrapper.pause();
    }

    isActiveSong(song: Song) {
        return (this.activeSong) && this.activeSong.id === song.id;
    }

    setActiveSong(song) {
        this.audioService.setActiveSong(song);
    }

    isPlayingSong(song: Song) {
        return (this.playingSong) && this.playingSong.id === song.id;
    }

}
