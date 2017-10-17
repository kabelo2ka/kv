import {Component, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SongService} from "../songs.component/song.service";
import {Genre} from "../genres/genre";
import {GenreService} from "../genres/genre.service";
import {AppService} from "../app.service";
import {AlbumService} from "../albums/album.service.component";

@Component({
    selector: 'app-song-edit',
    templateUrl: './song-edit.component.html',
    styleUrls: ['./song-edit.component.css'],
})
export class SongEditComponent implements OnInit {
    loading: Subscription;
    savingSong: Subscription;
    deletingSong: Subscription;
    songUploadForm;
    old_song: any;
    song: any;
    genres: Genre[];
    albums: any;

    constructor(private songService: SongService,
                private genreService: GenreService,
                private albumService: AlbumService,
                private appService: AppService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
    ) {
    }

    ngOnInit() {
        this.genreService.getGenres(null).subscribe(
            (res: any) => this.genres = res.data
        );
        this.albumService.getAuthAlbums().subscribe(
            (res: any) => this.albums = res.data
        );
        this.activatedRoute.params.subscribe((params: Params) => {
            const slug = params['slug'];
            this.loading = this.songService.getSong(slug).subscribe(
                (res: any) => {
                    this.song = res.data;
                    this.old_song = res.data;
                }
            );
        });
    }

    onSongSave() {
        this.savingSong = this.songService.updateSong(this.song).subscribe(
            (res: any) => {
                this.appService.showToastNotification('', 'Song updated.', 'SUCCESS');
                this.router.navigate(['/albums', this.song.album.slug]);
            },
            error => this.appService.showToastNotification('', error, 'ERROR'),
            () => this.savingSong = null
        );
    }

    deleteSong(){
        const c = confirm('Are you sure you want to delete this song?');
        if(c === true) {
            this.deletingSong = this.songService.deleteSong(this.song.slug).subscribe(
                (res: any) => {
                    this.appService.showToastNotification('', 'Song deleted.', 'SUCCESS');
                    this.router.navigate(['/songs']);
                },
                () => {
                    this.deletingSong = null;
                },
                () => this.deletingSong = null
            );
        }
    }


}
