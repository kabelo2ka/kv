import {Injectable} from '@angular/core';
import {Song} from '../songs.component/song';

import {Subject} from 'rxjs/Subject';
import {AudioAPIWrapper} from './audio-api-wrapper';
import {UserPreferencesService} from "../user-preferences/user-preferences.service";
import {Observable} from "rxjs";


@Injectable()
export class AudioService {

    static readonly CURRENT_SONG_KEY = 'kv.local::currentSong';

    AUDIO_LOADING = 0;
    AUDIO_PLAYING = 1;
    AUDIO_PAUSED = 2;
    AUDIO_STOPPED = 3;
    AUDIO_ENDED = 4;

    loadedSong: Song;
    loadedSongStatus = 3;

    // Observable string sources
    private currentSong = new Subject<Song>();
    private status = new Subject<number>(); // pause | play | stop | loading

    // Observable string streams
    currentSong$ = this.currentSong.asObservable();
    status$ = this.status.asObservable();

    constructor(
        private audioApiWrapper: AudioAPIWrapper,
        private userPreferencesService: UserPreferencesService,
    ) {
        this.audioApiWrapper.bindAudioEvent('loadedmetadata').subscribe(() => {
            this.audioApiWrapper.play();
        });
        this.audioApiWrapper.bindAudioEvent('play').subscribe(() => this.setStatus(this.AUDIO_PLAYING));
        this.audioApiWrapper.bindAudioEvent('pause').subscribe(() =>  this.setStatus(this.AUDIO_PAUSED));
        this.audioApiWrapper.bindAudioEvent('ended').subscribe(() =>  {
            // If  REPEAT_ONE is set, repeat song
            if(this.userPreferencesService.getPreference(UserPreferencesService.REPEAT_MODE) ===  'REPEAT_ONE') {
                this.audioApiWrapper.play();
            }
            this.setStatus(this.AUDIO_STOPPED);
            this.setStatus(this.AUDIO_ENDED);
        });

    }

    playSong(song: Song) {

        if (this.loadedSong && this.loadedSong.id === song.id) {
            this.audioApiWrapper.play();
        }else {
            // Set Active Song
            this.setSong(song);
            this.audioApiWrapper.load(song.url);
            this.setStatus(this.AUDIO_LOADING);
            this.loadedSong = song;
            localStorage.setItem(AudioService.CURRENT_SONG_KEY, JSON.stringify(song));
        }
    }

    pauseSong() {
        this.audioApiWrapper.pause();
        this.setStatus(this.AUDIO_PAUSED)
    }


    /**
     * Set active song
     * @param song
     */
    setSong(song: Song) {
        this.currentSong.next(song);
    }

    /**
     * Set Audio Status
     * @param status pause | play | stop | loading
     */
    setStatus(status: number) {
        this.loadedSongStatus = status;
        this.status.next(status);
    }







}
