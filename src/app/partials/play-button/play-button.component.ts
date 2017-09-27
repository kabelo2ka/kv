import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Song} from '../../songs.component/song';
import {AudioAPIWrapper} from '../../audio/audio-api-wrapper';
import {AudioService} from '../../audio/audio.service';
import {Subject} from 'rxjs';


@Component({
    selector: 'app-play-button',
    templateUrl: './play-button.component.html',
    styleUrls: ['./play-button.component.css']
})
export class PlayButtonComponent implements OnInit {
    @Input() song: Song;

    @Output() onLoading: EventEmitter<any> = new EventEmitter<any>();
    @Output() onPaused: EventEmitter<any> = new EventEmitter<any>();
    @Output() onPlaying: EventEmitter<any> = new EventEmitter<any>();

    audio_status: number;
    selected = false;


    constructor(
        private audioService: AudioService,
        private audioApiWrapper: AudioAPIWrapper
    ) {}

    ngOnInit() {
        this.audioService.currentSong$.subscribe( (song: Song) => {
            if (song.id === this.song.id) {
                this.selected = true;
                // Get audio status play | pause | stop
                // @todo unsubscribe from this(playing states) if not current song
                this.audioService.status$
                    .subscribe( (status: number) => {
                    this.audio_status = status;
                    console.log('audio status: ', status);
                });
            }
        });
    }

    isLoading() {
        return this.audio_status === this.audioService.AUDIO_LOADING;
    }

    isPlaying() {
        return this.audio_status === this.audioService.AUDIO_PLAYING;
    }

    isPaused() {
        return this.audio_status === this.audioService.AUDIO_PAUSED;
    }

    isStopped() {
        return this.audio_status === this.audioService.AUDIO_STOPPED;
    }

    hasEnded() {
        return this.audio_status === this.audioService.AUDIO_ENDED;
    }


    playSong() {
        this.audioService.playSong(this.song);
    }

    pauseSong() {
        this.audioApiWrapper.pause();
    }

}
