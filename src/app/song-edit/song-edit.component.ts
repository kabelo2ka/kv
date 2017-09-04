import {Component, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {SongService} from "../songs.component/song.service";
import {NotificationsService} from "angular2-notifications/dist";
import {Genre} from "../genres/genre";
import {GenreService} from "../genres/genre.service";

@Component({
    selector: 'app-song-edit',
    templateUrl: './song-edit.component.html',
    styleUrls: ['./song-edit.component.css'],
    providers: [SongService]
})
export class SongEditComponent implements OnInit {
    loading: Subscription;
    savingSong: Subscription;
    songUploadForm;
    old_song: any;
    song: any;
    genres: Genre[];
    albums: any;

    constructor(
        private songService: SongService,
        private genreService: GenreService,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationsService,
    ){}

    ngOnInit() {
        this.genreService.getGenres(null).subscribe(
            (res: any) => this.genres = res.data
        );
        this.activatedRoute.params.subscribe((params: Params) => {
            let $id = params['id'];
            this.loading = this.songService.getSong($id).subscribe(
                (res: any) => {
                    this.song = res.data;
                    this.old_song = res.data;
                }
            )
        });
    }

    onSongSave(){
        this.savingSong = this.songService.updateSong(this.song).subscribe(
            (res: any) => this.notificationService.success('Success', 'Song updated!'),
            error => this.notificationService.error('Success', error),
            () => this.savingSong = null
        );
    }


}
