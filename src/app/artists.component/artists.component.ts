import {Component, OnInit} from '@angular/core';
import {ArtistService} from "./artist.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
    loading: Subscription;
    artists: any;

    constructor(private artistService: ArtistService) {
    }

    ngOnInit() {
        this.loading = this.artistService.getArtists(null).subscribe(
            res => {
                this.artists = res.data;
            }
        )
    }

}

