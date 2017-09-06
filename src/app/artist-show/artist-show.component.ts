import {Component, OnInit} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {ArtistService} from "../artists.component/artist.service";
import {ActivatedRoute, Params} from "@angular/router";
import {AudioService} from "../audio/audio.service";
import {AppService} from "../app.service";
import {AuthService} from "../auth/authService";

@Component({
    selector: 'app-artist-show',
    templateUrl: './artist-show.component.html',
    styleUrls: ['./artist-show.component.css']
})
export class ArtistShowComponent implements OnInit {
    loading: Subscription;
    artist: any;
    auth_user: any;

    constructor(private artistService: ArtistService,
                private activatedRoute: ActivatedRoute,
                private audioService: AudioService,
                private authService: AuthService,
                private appService: AppService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            const id = params['id'];
            // Load artists
            this.loading = this.artistService.getArtist(id).subscribe(
                (res: any) => this.artist = res.data
            );
        });
        // Get and set authenticated user
        this.authService.user$.subscribe(
            user => this.auth_user = user
        );
    }

    /*
     * Play song
     */
    playSong(song: any) {
        this.audioService.setStatus('play');
        this.audioService.setActiveSong(song);
        this.appService.setRightPanelVisible(true);
    }

}
