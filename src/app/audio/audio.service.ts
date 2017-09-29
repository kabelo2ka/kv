import {Injectable} from '@angular/core';
import {Song} from '../songs.component/song';

import {Subject} from 'rxjs/Subject';
import {AudioAPIWrapper} from './audio-api-wrapper';
import {UserPreferencesService} from "../UserPreferences/user-preferences.service";
import {Observable} from "rxjs";


@Injectable()
export class AudioService {

    AUDIO_LOADING = 0;
    AUDIO_PLAYING = 1;
    AUDIO_PAUSED = 2;
    AUDIO_STOPPED = 3;
    AUDIO_ENDED = 4;

    private loadedAudio: Song;

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
            this.setStatus(this.AUDIO_STOPPED);
            this.setStatus(this.AUDIO_ENDED);
        });
    }

    playSong(song: Song) {

        if (this.loadedAudio && this.loadedAudio.id === song.id) {
            this.audioApiWrapper.play();
        }else {
            // Set Active Song
            this.setSong(song);
            this.audioApiWrapper.load(song.url);
            this.setStatus(this.AUDIO_LOADING);
            this.loadedAudio = song;
        }
    }


    /**
     * Set active song
     * @param song
     */
    protected setSong(song: Song) {
        this.currentSong.next(song);
    }

    /**
     * Set Audio Status
     * @param status pause | play | stop | loading
     */
    protected setStatus(status: number) {
        this.status.next(status);
    }


    protected setSettings() {
        let settings = {
            "volume": "5.6",
            "notify": true,
            "repeatMode": "NO_REPEAT",
            "showInfoPanel": false,
            "artistsViewMode": "thumbnails",
            "albumsViewMode": "thumbnails",
        }
    }







}
