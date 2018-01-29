import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {AudioService} from "../audio/audio.service";

@Component({
    selector: 'app-audio-visualization',
    template: `
        <span #music_bars_cont class="kv_music_bars" style="width: 20px;height: 14px;">
            <span class="kv_music_bar bg-primary"></span>
            <span class="kv_music_bar bg-info"></span>
            <span class="kv_music_bar bg-success"></span>
            <span class="kv_music_bar bg-warning"></span>
            <span class="kv_music_bar bg-danger"></span>
        </span>
    `,
    styleUrls: ['./audio-visualization.component.css'],
})

export class AudioVisualizationComponent implements OnInit, OnChanges {
    @Input() status;

    @ViewChild('music_bars_cont') music_bars_cont;
    music_bars: any = [];
    audio_visualisation;
    animation;
    audioStatus: number = this.audioService.AUDIO_STOPPED;

    constructor(private audioService: AudioService,) {
    }

    ngOnInit() {
        this.music_bars = this.music_bars_cont.nativeElement.children;
        this.startAudioVisualization();
        // Subscribe to audio status
        this.audioService.status$.subscribe((status: number) => {
            this.audioStatus = status;
        });
    }

    ngOnChanges() {
        if (this.isPlaying()) {
            this.startAudioVisualization();
        } else if (this.isPaused()) {
            this.pauseAudioVisualisation();
        } else {
            this.stopAudioVisualisation();
        }
    }

    startAudioVisualization() {
        let count = this.music_bars.length;
        this.animation = setInterval(() => {
            for (let i = 0; i < count; i++) {
                let number = Math.floor((Math.random() * 100) + 1);
                this.music_bars[i].style.height = number + '%';
            }
        }, 300);
    }

    pauseAudioVisualisation() {
        clearInterval(this.animation);
        this.audio_visualisation = 1;
    }

    stopAudioVisualisation() {
        this.animation = clearInterval(this.animation);
        for (let i = 0; i < this.music_bars.length; i++) {
            this.music_bars[i].style.height = 2 + '%';
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
