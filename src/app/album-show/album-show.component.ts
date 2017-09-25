import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AlbumService} from '../albums/album.service.component';
import {ActivatedRoute, Params} from '@angular/router';
import {AudioService} from '../audio/audio.service';
import {AppService} from '../app.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-album-show',
  templateUrl: './album-show.component.html',
  styleUrls: ['./album-show.component.css']
})
export class AlbumShowComponent implements OnInit {
    loading: Subscription;
    album;
    playingSong;

    constructor(private albumService: AlbumService,
                private activatedRoute: ActivatedRoute,
                private audioService: AudioService,
                private appService: AppService,
                private title: Title,
    ) {}

    ngOnInit() {
    const id = 1;
        this.activatedRoute.params.subscribe((params: Params) => {
            const album_slug = params['slug'];
            this.loading = this.albumService.getAlbum(album_slug).subscribe(
                res => {
                    this.album = res.data;
                    this.title.setTitle( this.album.name + ' - Kasivibe');
                }
            );
        });
    }

    playSong(song: any) {
        this.audioService.setActiveSong(song);
        this.appService.setRightPanelVisible(true);
    }

}
