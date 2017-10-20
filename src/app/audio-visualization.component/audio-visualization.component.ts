import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {AudioService} from "../audio/audio.service";
import {AudioAPIWrapper} from "../audio/audio-api-wrapper";

@Component({
    selector: 'app-audio-visualization',
    template: `
        <span #music_bars_cont class="kv_music_bars" style="width: 20px;height: 14px;">
            <span class="kv_music_bar bg-primary" style="height: 40%"></span>
            <span class="kv_music_bar bg-info" style="height: 60%"></span>
            <span class="kv_music_bar bg-success" style="height: 90%"></span>
            <span class="kv_music_bar bg-warning" style="height: 50%"></span>
            <span class="kv_music_bar bg-danger" style="height: 10%"></span>
        </span>
    `,
    styleUrls: ['./audio-visualization.component.css'],
})

export class AudioVisualizationComponent implements OnInit {
    @Input() status;

    @ViewChild('music_bars_cont') music_bars_cont;
    music_bars: any = [];
    audio_visualisation;
    animation;

    constructor(
        private audioApiWrapper: AudioAPIWrapper
    ) {}

    ngOnInit() {
        this.music_bars = this.music_bars_cont.nativeElement.children;
        this.audioApiWrapper.bindAudioEvent('play').subscribe(
            ()=> this.startAudioVisualization()
        );
        this.audioApiWrapper.bindAudioEvent('pause').subscribe(
            ()=> this.pauseAudioVisualisation()
        );
        this.audioApiWrapper.bindAudioEvent('ended').subscribe(
            ()=>{
                this.stopAudioVisualisation()
            }
        );
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


}
