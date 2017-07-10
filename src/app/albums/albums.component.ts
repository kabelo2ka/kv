import { Component, OnInit } from '@angular/core';
import {AlbumService} from "./album.service.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})

export class AlbumsComponent implements OnInit {
    loading: Subscription;
    albums: any[] = [];

    constructor(private albumService: AlbumService) { }

    ngOnInit() {
        this.loading = this.albumService.getAlbums(null).subscribe(
            res => {
                this.albums = res.data;
            }

        );
    }


}
