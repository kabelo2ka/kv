import {Component, OnInit, ViewChild} from '@angular/core';
import {AudioService} from "../audio/audio.service";
import {forEach} from "@angular/router/src/utils/collection";
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
    providers: []
})

export class AudioVisualizationComponent implements OnInit {
    @ViewChild('music_bars_cont') music_bars_cont;
    music_bars: any = [];
    audio_visualisation;
    animation;
    constructor(private audioService: AudioService,private audioApiWrapper: AudioAPIWrapper) {
    }

    ngOnInit() {
        this.music_bars = this.music_bars_cont.nativeElement.children;
        /*this.audioService.status$.subscribe(
            status => {
                if(status === 'play'){
                    this.startAudioVisualization();
                }else if(status === 'pause'){
                    this.pauseAudioVisualisation();
                }else if(status === 'stop'){
                    this.stopAudioVisualisation();
                }
            }
        );*/
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
        this.audio_visualisation = 0;
    }

    stopAudioVisualisation() {
        this.animation = clearInterval(this.audio_visualisation);
        for (let i = 0; i < this.music_bars.length; i++) {
            this.music_bars[i].style.height = 2 + '%';
        }
        this.audio_visualisation = 0;
    }


}
