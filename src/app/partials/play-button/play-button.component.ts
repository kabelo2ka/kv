import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Song} from '../../songs.component/song';
import {AudioService} from '../../audio/audio.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-play-button',
    templateUrl: './play-button.component.html',
    styleUrls: ['./play-button.component.css'],
})
export class PlayButtonComponent implements OnInit, OnChanges {
    @Input() song: Song;

    @Output() onStatus: EventEmitter<number> = new EventEmitter<number>();
    @Output() onActive: EventEmitter<boolean> = new EventEmitter<boolean>();

    audioStatus: number = this.audioService.AUDIO_STOPPED;
    selected = false;

    subscription: Subscription;

    constructor(private audioService: AudioService,) {
    }

    ngOnInit() {
        this.audioService.currentSong$.subscribe((song: Song) => {
            // If @input song is not set, set currentSong as @input song - For main Audio Player
            if (!this.song) {
                this.song = song;
                this.audioService.status$.subscribe((status: number) => {
                    this.audioStatus = status;
                    this.onStatus.emit(status);
                });
            } else {
                if (this.song.id === song.id) {

                    this.selected = true;
                    this.onActive.emit(this.selected);
                    // Get audio status play | pause | stop
                    this.audioService.status$.takeWhile(() => this.selected).subscribe((status: number) => {
                        this.audioStatus = status;
                        this.onStatus.emit(status);
                    });
                } else {
                    this.reset();
                }
            }

        });

        // Check if this song is playing
        const currentSong = this.audioService.loadedSong;
        if (this.song && currentSong && this.song.id === currentSong.id) {
            this.audioStatus = this.audioService.loadedSongStatus;
            this.onStatus.emit(this.audioStatus);
            this.selected = true;
            this.onActive.emit(this.selected);
            // Subscribe to audio status
            this.audioService.status$.takeWhile(() => this.selected).subscribe((status: number) => {
                this.audioStatus = status;
                this.onStatus.emit(status);
            });
        }

    }

    ngOnChanges() {


    }

    isLoading() {
        return this.audioStatus === this.audioService.AUDIO_LOADING;
    }

    isPlaying() {
        return this.audioStatus === this.audioService.AUDIO_PLAYING;
    }

    isPaused() {
        return this.audioStatus === this.audioService.AUDIO_PAUSED;
    }

    isStopped() {
        return this.audioStatus === this.audioService.AUDIO_STOPPED;
    }

    hasEnded() {
        return this.audioStatus === this.audioService.AUDIO_ENDED;
    }


    playSong() {
        this.audioService.playSong(this.song);
    }

    pauseSong() {
        this.audioService.pauseSong();
    }

    private reset() {
        if (this.selected) {
            this.selected = false;
            this.onActive.emit(this.selected);
            this.audioStatus = this.audioService.AUDIO_STOPPED;
        }
    }

}
