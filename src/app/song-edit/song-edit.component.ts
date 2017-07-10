import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {ArtistService} from "../artists.component/artist.service";
import {AuthService} from "../auth/authService";
import {SongService} from "../songs.component/song.service";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-song-edit',
    templateUrl: './song-edit.component.html',
    styleUrls: ['./song-edit.component.css'],
    providers: [SongService]
})
export class SongEditComponent implements OnInit {
    loading: Subscription;
    songUploadForm;
    old_song: any;
    song: any;
    audio_file: any = "";
    genres = [
        {
            'id': 1,
            'name': 'Hip hop'
        },
        {
            'id': 2,
            'name': 'RnB'
        },
        {
            'id': 3,
            'name': 'House'
        },
        {
            'id': 4,
            'name': 'Kwaito'
        },
        {
            'id': 5,
            'name': 'Gospel'
        }
    ];
    albums: any;

    constructor(
        private songService: SongService,
        private activatedRoute: ActivatedRoute,
    ){}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let $id = params['id'];
            this.loading = this.songService.getSong($id).subscribe(
                (res) => {
                    this.song = res.data;
                    this.old_song = res.data;
                }
            )
        });
    }

    onSongSave(form: NgForm){

    }

}
