import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {AlbumService} from "../albums/album.service.component";
import {ActivatedRoute, Params} from "@angular/router";
import {AudioService} from "../audio/audio.service";
import {AppService} from "../app.service";

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
                private appService: AppService
    ){ }

    ngOnInit() {
    let id = 1;
        this.activatedRoute.params.subscribe((params: Params) => {
            let album_id = params['id'];
            this.loading = this.albumService.getAlbum(album_id).subscribe(
                res => this.album = res.data
            )
        });
    }

    playSong(song: any){
        this.audioService.setActiveSong(song);
        this.appService.setRightPanelVisible(true);
    }

}
