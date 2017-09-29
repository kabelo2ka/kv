import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Song} from '../../songs.component/song';
import {AudioService} from '../../audio/audio.service';
import {AudioAPIWrapper} from '../../audio/audio-api-wrapper';

@Component({
    selector: 'app-song-item',
    templateUrl: './song-item.component.html',
    styleUrls: ['./song-item.component.css'],
})
export class SongItemComponent implements OnInit {
    @Input() song: Song;

    @Output() onSetActiveSongId: EventEmitter<any> = new EventEmitter<any>();

    isActiveSong = false;
    audioStatus: number;

    constructor(
        protected audioService: AudioService,
    ) {}

    ngOnInit() {
        this.audioService.currentSong$.subscribe((song: Song) => {
            this.isActiveSong = song.id === this.song.id;
        });
    }

    setAudioStatus(status: number) {
        this.audioStatus = status;
    }

    isLoading() {
        return this.audioStatus === this.audioService.AUDIO_LOADING;
    }

    isPlaying() {
        return this.audioStatus === this.audioService.AUDIO_PLAYING;
    }

}
