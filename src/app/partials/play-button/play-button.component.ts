import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Song} from "../../songs.component/song";
import {AudioAPIWrapper} from "../../audio/audio-api-wrapper";
import {AudioService} from "../../audio/audio.service";

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

    loadingSong = false;
    isPaused = false;
    isPlaying = false;


    constructor(
        private audioService: AudioService,
        private audioApiWrapper: AudioAPIWrapper
    ) {}

    ngOnInit() {
        // Get audio status play | pause | stop
        this.audioService.status$.subscribe(status => {
            if (status === 'play') {
                this.isPlaying = true;
            } else if (status === 'pause') {
                this.isPlaying = false;
            } else if (status === 'stop') {
                this.isPlaying = false;
            }
        });
        this.audioApiWrapper.bindAudioEvent('loadedmetadata').subscribe(() => this.loadingSong = false);
        this.audioApiWrapper.bindAudioEvent('play').subscribe(() => {
            this.isPaused = false;
        });
        this.audioApiWrapper.bindAudioEvent('pause').subscribe(() => this.isPaused = true);
        this.audioApiWrapper.bindAudioEvent('ended').subscribe(() => this.isPaused = false);
    }


    playSong() {
        this.loadingSong = true;
        this.audioService.setActiveSong(this.song);
        this.audioService.setStatus('play');
    }

    pauseSong() {
        this.audioService.setStatus('pause');
        this.audioApiWrapper.pause();
    }



}
