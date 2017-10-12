import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {AlbumService} from '../albums/album.service.component';
import {ActivatedRoute, Params} from '@angular/router';
import {AudioService} from '../audio/audio.service';
import {AppService} from '../app.service';

@Component({
    selector: 'app-album-show',
    templateUrl: './album-show.component.html',
    styleUrls: ['./album-show.component.css']
})
export class AlbumShowComponent implements OnInit {
    loading: Subscription;
    album;

    constructor(private albumService: AlbumService,
                private activatedRoute: ActivatedRoute,
                private audioService: AudioService,
                private appService: AppService,
                private title: Title,) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            const album_slug = params['slug'];
            this.loading = this.albumService.getAlbum(album_slug).subscribe(
                (res: any) => {
                    this.album = res.data;
                    this.title.setTitle(this.album.name + ' - Kasivibe');

                    // Play first song in album if "play" query string equals "true"
                    if (this.album.songs[0]) {
                        this.activatedRoute.queryParams.subscribe((params: Params) => {
                            if (params['play'] === 'true') {
                                this.audioService.playSong(this.album.songs[0]);
                            }
                        });
                    }
                }
            );
        });

    }

}
