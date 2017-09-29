import {Component, OnDestroy, OnInit} from '@angular/core';
import {AudioService} from './audio.service';
import {AppService} from '../app.service';

import {Subscription} from 'rxjs/Subscription';
import {SongService} from '../songs.component/song.service';
import {AudioAPIWrapper} from './audio-api-wrapper';
import {Song} from '../songs.component/song';
import {UserPreferencesService} from "../UserPreferences/user-preferences.service";


@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.css'],
})

export class AudioComponent implements OnInit, OnDestroy {
    song: Song;
    songCopy: any;
    src = '';

    audioStatus: number;

    audio_progress_time = '00:00';
    audio_progress_played = 0;
    audio_buffered_value = 0;
    audio_seek_value = 0;
    audio_volume_value = 80;
    repeatMode: 'REPEAT_ONE'|'NO_REPEAT'|'REPEAT_ALL';
    muted = false;
    info_panel_visible = false;

    subscription: Subscription;

    constructor(private audioService: AudioService,
                private audioApiWrapper: AudioAPIWrapper,
                private songService: SongService,
                private appService: AppService,
                private userPreferencesService: UserPreferencesService
    ) {
        this.muted = this.userPreferencesService.getPreference(UserPreferencesService.MUTED);
        if(this.muted){
            this.audio_volume_value=0;
        }else{
            this.audio_volume_value = this.userPreferencesService.getPreference(UserPreferencesService.VOLUME);
        }
        this.repeatMode = this.userPreferencesService.getPreference(UserPreferencesService.REPEAT_MODE);
        /*const rightPanelPref = this.userPreferencesService.getPreference(UserPreferencesService.SHOW_INFO_PANEL);
        this.info_panel_visible = rightPanelPref;
        this.appService.setRightPanelVisible(rightPanelPref);*/
    }

    ngOnInit() {
        // Get active Song - song that will be played
        this.audioService.currentSong$.subscribe( currentSong => {
            this.songCopy = this.song;
            this.song = currentSong;
        });

        // Get audio status play | pause | stop
        this.audioService.status$.subscribe( (status: number) => {
            this.audioStatus = status;
            if( this.isLoading() ){
                this.reset();
            }
        });

        // Calculate Progress played
        this.audioApiWrapper.bindAudioEvent('timeupdate').subscribe( () => {
            const current_time = this.audioApiWrapper._audio.currentTime;
            if (current_time > 0) {
                const seek_value = (current_time / this.audioApiWrapper._audio.duration) * 100;
                this.audio_seek_value = this.audio_progress_played = seek_value;
                this.formatTime(Math.floor(current_time));
            }
        });

        // Calculate audio Volume
        this.audioApiWrapper.bindAudioEvent('volumechange').subscribe(
            () => this.audio_volume_value = this.audioApiWrapper._audio.volume * 100
        );

        // Post play to server after 5 seconds
        this.audioApiWrapper.bindAudioEvent('play').subscribe(
            () => setTimeout(() => this.songService.postPlay(this.song.id).subscribe(), 5000)
        );

        // Stop song when song ends (Resets song's duration)
        this.audioApiWrapper.bindAudioEvent('ended').subscribe(
            () => {
                this.stop();
                // @todo If  REPEAT_ONE is set repeat song -- Fix below if statement
                if(this.userPreferencesService.getPreference(UserPreferencesService.REPEAT_MODE) ===  'REPEAT_ONE'){
                    this.audioApiWrapper.play();
                }
            }
        );

        // Calculate Buffered/Loaded percentage
        setInterval(() => {
            const audioElem = this.audioApiWrapper._audio;
            const buffered = audioElem.buffered;
            let loaded;
            if (buffered.length) {
                loaded = 100 * buffered.end(0) / audioElem.duration;
                this.audio_buffered_value = loaded.toFixed(2);
            }
        }, 50);

        // Check if right panel is closed or opened
        this.appService.right_panel_visible$.subscribe(
            res => this.info_panel_visible = res
        );
    }

    /*
     * Like song
     */
    likeSong(id) {
        this.songService.likeSong(id);
    }

    /*
     * Toggle info bar / right panel's visibility
     */
    toggleInfoPanel() {
        this.info_panel_visible = !this.info_panel_visible;
        this.appService.setRightPanelVisible(this.info_panel_visible);
        this.userPreferencesService.setPreference(UserPreferencesService.SHOW_INFO_PANEL, this.info_panel_visible);
    }

    /**
     *  Set repeat mode
     */
    toggleRepeatMode() {
        if (this.repeatMode === 'NO_REPEAT') {
            this.repeatMode = 'REPEAT_ONE';
        }else if (this.repeatMode === 'REPEAT_ONE') {
            this.repeatMode = 'REPEAT_ALL';
        }else {
            this.repeatMode = 'NO_REPEAT';
        }
        this.userPreferencesService.setPreference(UserPreferencesService.REPEAT_MODE, this.repeatMode);
    }

    /*
     * Play song
     */
    play() {
        this.audioService.playSong(this.song);
    }

    /*
     * Pause song
     */
    pause() {
        this.audioApiWrapper.pause();
    }

    /*
     * Stop song
     */
    stop() {
        this.audioApiWrapper.stop();
    }

    // @todo load previous song on playlist
    previousTrack(): void {
        /** If first track, then do nothing. */
        /** Else go back to previous element in track's array. */
    }

    // @todo load next song on playlist
    nextTrack(): void {
        /** If last track, then do nothing. */
        /** Else, go to the next element in track's array. */
    }

    /*
     * Set seek value
     */
    setSeek(val): void {
        this.audioApiWrapper._audio.currentTime = (val / 100) * this.audioApiWrapper._audio.duration;
    }

    /*
     * Set volume value
     */
    setVolume(val): void {
        if(this.muted){
            this.toggleMute();
        }
        this.audioApiWrapper._audio.volume = val / 100;
        this.userPreferencesService.setPreference('volume', val);
    }

    /*
     * Toggle muted
     */
    toggleMute(): void {
        this.muted = !this.muted;
        this.userPreferencesService.setPreference(UserPreferencesService.MUTED, this.muted);
        if(this.muted){
            this.audio_volume_value = 0;
            this.audioApiWrapper._audio.volume = 0;
        }else{
            this.audio_volume_value = this.userPreferencesService.getPreference(UserPreferencesService.VOLUME);
            this.audioApiWrapper._audio.volume = this.audio_volume_value / 100;
        }
    }

    /*
     * Format audio progress (minutes:seconds)
     */
    formatTime(seconds) {
        let minutes: any = Math.floor(seconds / 60);
        let secs: any = Math.floor(seconds % 60);
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (secs < 10) {
            secs = '0' + secs;
        }
        this.audio_progress_time = minutes + ':' + secs;
    }

    isLoading() {
        return this.audioStatus === this.audioService.AUDIO_LOADING;
    }

    isPlaying() {
        return this.audioStatus === this.audioService.AUDIO_PLAYING;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };


    reset(){
        this.audio_progress_time = '00:00';
        this.audio_progress_played = 0;
        this.audio_buffered_value = 0;
        this.audio_seek_value = 0;
    }

}
