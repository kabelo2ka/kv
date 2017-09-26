import {Component} from "@angular/core";
import {AudioService} from "./audio.service";
import {AppService} from "../app.service";

import {Subscription} from "rxjs/Subscription";
import {SongService} from "../songs.component/song.service";
import {AudioAPIWrapper} from "./audio-api-wrapper";
import {Song} from "../songs.component/song";


@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.css'],
})

export class AudioComponent {
    song: Song;
    songCopy: any;
    src = "";

    audio_progress_time: string = '00:00';
    audio_progress_played: number = 0;
    audio_buffered_value: number = 0;
    audio_seek_value: number = 0;
    audio_volume_value: number = 80;
    mute: boolean = false;
    info_panel_visible: boolean = false;
    isPlaying = false;

    subscription: Subscription;

    constructor(private audioService: AudioService,
                private audioApiWrapper: AudioAPIWrapper,
                private songService: SongService,
                private appService: AppService) {

    }

    ngOnInit() {
        // Get active Song - song that will be played
        this.audioService.$currentSong.subscribe(
            currentSong => {
                this.songCopy = this.song;
                this.song = currentSong;
            }
        );

        // Get audio status play | pause | stop
        this.audioService.status$.subscribe( (status:number) => {
            if(status === this.audioService.AUDIO_PLAYING){
                this.isPlaying = true;
            }else if(status === this.audioService.AUDIO_PAUSED){
                this.isPlaying = false;
            }else if(status === this.audioService.AUDIO_STOPPED){
                this.isPlaying = false;
            }
        });

        // Calculate Progress played
        this.audioApiWrapper.bindAudioEvent('timeupdate').subscribe(
            () => {
                let current_time = this.audioApiWrapper._audio.currentTime;
                if (current_time > 0) {
                    let seek_value = (current_time / this.audioApiWrapper._audio.duration) * 100;
                    this.audio_seek_value = this.audio_progress_played = seek_value;
                    this.formatTime(Math.floor(current_time));
                }
            }
        );

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
            () => this.stop()
        );

        // Calculate Buffered/Loaded percentage
        setInterval(() => {
            let audioElem = this.audioApiWrapper._audio;
            let buffered = audioElem.buffered;
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
    hideInfoPanel() {
        this.info_panel_visible = !this.info_panel_visible;
        this.appService.setRightPanelVisible(this.info_panel_visible);
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
        this.isPlaying = false;
    }

    /*
     * Stop song
     */
    stop() {
        this.audioApiWrapper.stop();
    }

    //@todo load previous song on playlist
    previousTrack(): void {
        /** If first track, then do nothing. */
        /** Else go back to previous element in track's array. */
    }

    //@todo load next song on playlist
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
        this.audioApiWrapper._audio.volume = val / 100;
    }

    /*
     * Toggle mute
     */
    setMute():void {
        this.mute = ! this.mute;
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };


}
