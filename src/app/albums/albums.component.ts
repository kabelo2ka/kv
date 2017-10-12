import { Component, OnInit } from '@angular/core';
import {AlbumService} from "./album.service.component";
import {Subscription} from "rxjs";
import {Album} from "./album";

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})

export class AlbumsComponent implements OnInit {
    loading: Subscription;
    albums: Album[];

    constructor(private albumService: AlbumService) { }

    ngOnInit() {
        this.loading = this.albumService.getAlbums(null).subscribe(
            (res: any) => {
                this.albums = res.data;
            }

        );
    }


}
