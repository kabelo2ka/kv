import {Component, OnInit, ElementRef, Renderer, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";

import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from "rxjs";
import {AuthService} from "../auth/authService";
import {AlbumService} from "../albums/album.service.component";


@Component({
    templateUrl: './song.create.component.html',
    //template: '<h1>{{title}}</h1><h2>{{hero}} details!</h2>',
    styleUrls: ['./song.create.component.css'],
    providers: []
})

export class SongCreateComponent implements OnInit {

    selected: string;
    albums: any[] = [];

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

    @ViewChild('fileInput') el: ElementRef;

    audio_file: any = "";

    constructor(private http: Http,
                private authService: AuthService,
                private albumService: AlbumService
    ) {}

    ngOnInit() {
        this.getUserAlbums();
    }

    onSongUpload(form: NgForm) {
        let audio_file: File = this.el.nativeElement.files[0];
        let formData: FormData = new FormData();
        formData.append('file', audio_file);
        formData.append('name', form.value.name); // Song title
        formData.append('album_id', form.value.album_id);
        formData.append('genre_id', form.value.genre_id);
        formData.append('lyrics', form.value.lyrics);
        if (form.value.album_id === 'create')
            formData.append('album_name', form.value.album_name);

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        let options = new RequestOptions({headers: headers});
        this.http.post('http://www.kasivibe.com/api/v1/song?token=' + this.authService.getToken(), formData, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error))
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            )

    }

    getUserAlbums() {
        this.albumService.getUserAlbums(null).subscribe(
            res => {
                this.albums = res.data;

                console.log(this.albums);
            }
        );
    }


    setAudioFile(event) {
        this.audio_file = event;
    }


}
