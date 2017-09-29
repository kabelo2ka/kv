import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Song} from '../../songs.component/song';
import {AudioAPIWrapper} from '../../audio/audio-api-wrapper';
import {AudioService} from '../../audio/audio.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-play-button',
    templateUrl: './play-button.component.html',
    styleUrls: ['./play-button.component.css'],
})
export class PlayButtonComponent implements OnInit {
    @Input() song: Song;

    @Output() onStatus: EventEmitter<any> = new EventEmitter<any>();

    audioStatus: number = this.audioService.AUDIO_STOPPED;
    selected = false;

    subscription: Subscription;

    constructor(
        private audioService: AudioService,
        private audioApiWrapper: AudioAPIWrapper
    ) {}

    ngOnInit() {
        this.audioService.currentSong$.subscribe( (song: Song) => {
            // If @input song is not set, set currentSong as @input song - For main Audio Player
            if(!this.song){
                this.song = song;
                this.audioService.status$.subscribe( (status: number) => {
                    this.audioStatus = status;
                    this.onStatus.emit(status);
                });
            }else{
                if (song.id === this.song.id) {
                    this.selected = true;
                    // Get audio status play | pause | stop
                    this.audioService.status$.takeWhile(() => this.selected).subscribe( (status: number) => {
                        this.audioStatus = status;
                        this.onStatus.emit(status);
                    });
                }else {
                    this.reset();
                }
            }
        });
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
        this.audioApiWrapper.pause();
    }

    private reset() {
        if (this.selected ) {
            this.selected = false;
            this.audioStatus = undefined;
        }
    }

}
