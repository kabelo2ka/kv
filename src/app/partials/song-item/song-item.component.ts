import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Song} from "../../songs.component/song";
import {AudioService} from "../../audio/audio.service";
import {AppService} from "../../app.service";
import {AudioAPIWrapper} from "../../audio/audio-api-wrapper";
import {SongService} from "../../songs.component/song.service";

@Component({
    selector: 'app-song-item',
    templateUrl: './song-item.component.html',
    styleUrls: ['./song-item.component.css']
})
export class SongItemComponent implements OnInit {
    @Input() song: Song;

    @Output() onSetActiveSongId: EventEmitter<any> = new EventEmitter<any>();

    isActiveSong = false;
    loadingSong = false;
    isPaused = false;
    isPlaying = false;


    constructor(private songService: SongService,
                private audioService: AudioService,
                private appService: AppService,
                private audioApiWrapper: AudioAPIWrapper) {
    }

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
        this.audioService.active_song_selected$.subscribe((song: Song) => {
            this.isActiveSong = song.id === this.song.id;
        });
        this.audioApiWrapper.bindAudioEvent('loadedmetadata').subscribe(() => this.loadingSong = false);
        this.audioApiWrapper.bindAudioEvent('play').subscribe(() => {
            this.isPaused = false;
        });
        this.audioApiWrapper.bindAudioEvent('pause').subscribe(() => this.isPaused = true);
        this.audioApiWrapper.bindAudioEvent('ended').subscribe(() => this.isPaused = false);
    }

    playSong(song: any) {
        this.loadingSong = true;
        this.isPaused = true;
        this.setActiveSong(song);
        this.audioService.setStatus('play');
        this.appService.setRightPanelVisible(true);
    }

    pauseSong() {
        this.audioService.setStatus('pause');
        this.audioApiWrapper.pause();
    }

    setActiveSong(song) {
        this.audioService.setActiveSong(song);
        this.onSetActiveSongId.emit(song.id);
    }


}
