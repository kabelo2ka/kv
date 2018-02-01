import {Component, Input, OnInit} from '@angular/core';
import {AudioService} from "../audio/audio.service";

@Component({
    selector: 'app-audio-visualization',
    template: `
        <span class="kv_music_bars" [ngStyle]="{'width':width, 'height':height}">
            <span class="kv_music_bar" *ngFor="let bar of music_bars"
                  [ngStyle]="{'height': bar.height}"
                  [ngClass]="bar.className"></span>
        </span>
    `,
    styleUrls: ['./audio-visualization.component.css'],
})

export class AudioVisualizationComponent implements OnInit {
    @Input() width: string = '20px';
    @Input() height: string = '14px';

    music_bars: any;
    audio_visualisation;
    animation;
    audioStatus: number = this.audioService.AUDIO_STOPPED;

    constructor(private audioService: AudioService,) {
        this.music_bars = [
            {
                height: '0%',
                className: 'bg-primary'
            },
            {
                height: '0%',
                className: 'bg-info'
            },
            {
                height: '0%',
                className: 'bg-success'
            },
            {
                height: '0%',
                className: 'bg-warning'
            },
            {
                height: '0%',
                className: 'bg-danger'
            }
        ];
    }

    ngOnInit() {
        this.startAudioVisualization();
        // Subscribe to audio status
        this.audioService.status$.subscribe((status: number) => {
            this.audioStatus = status;
            if (this.isPlaying()) {
                this.startAudioVisualization();
            } else if (this.isPaused()) {
                this.pauseAudioVisualisation();
            } else {
                this.stopAudioVisualisation();
            }
        });
    }

    startAudioVisualization() {
        let count = this.music_bars.length;
        this.animation = setInterval(() => {
            for (let i = 0; i < count; i++) {
                let number = Math.floor((Math.random() * 100) + 1);
                this.music_bars[i].height = number + '%';
            }
        }, 200);
    }

    pauseAudioVisualisation() {
        clearInterval(this.animation);
        this.audio_visualisation = 1;
    }

    stopAudioVisualisation() {
        clearInterval(this.animation);
        for (let i = 0; i < this.music_bars.length; i++) {
            this.music_bars[i].height = 2 + '%';
        }
        this.audio_visualisation = 0;
    }

    isPlaying() {
        return this.audioStatus === this.audioService.AUDIO_PLAYING;
    }

    isPaused() {
        return this.audioStatus === this.audioService.AUDIO_PAUSED;
    }
}
