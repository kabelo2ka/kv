import {Component, ElementRef, OnChanges, OnInit, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

import {Http} from "@angular/http";
import {AuthService} from "../auth/authService";
import {AlbumService} from "../albums/album.service.component";
import {Song} from "../songs.component/song";
import {SongService} from "../songs.component/song.service";
import {Music} from "../providers/Music";


@Component({
    selector: 'songs-upload',
    templateUrl: './song.create.component.html',
    styleUrls: ['./song.create.component.css'],
})


export class SongCreateComponent implements OnInit, OnChanges {
    music: Music;

    musicForm: FormGroup;
    nameChangeLog: string[] = [];


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
                private albumService: AlbumService,
                private songService: SongService,
                private fb: FormBuilder) {
        this.createForm();
        this.logNameChange();
    }

    ngOnInit() {
        this.getUserAlbums();
    }

    createForm() {
        this.musicForm = this.fb.group({
            album_id: 'create',
            album_name: '', // Only when album_id=create
            songs: this.fb.array([]),
        });
    }

    ngOnChanges() {
        this.musicForm.reset({
            album_id: this.music.album_id,
            album_name: this.music.album_name,
        });
        this.setSongs(this.music.songs);
    }

    get songs(): FormArray {
        return this.musicForm.get('songs') as FormArray;
    }

    setSongs(songs: Song[]) {
        const songFGs = songs.map(song => this.fb.group(song));
        const songFormArray = this.fb.array(songFGs);
        this.musicForm.setControl('songsss', songFormArray);
    }

    addSong() {
        this.songs.push(this.fb.group(new Song))
    }

    onSubmit() {
        this.music = this.prepareSaveMusic();
        this.songService.saveMusic();//.subscribe(/* error handling */);
        this.ngOnChanges();
    }


    prepareSaveMusic(): Music {
        const formModel = this.musicForm.value;

        // deep copy of form model songs
        const songsDeepCopy: Song[] = formModel.musicForm.map(
            (song: Song) => Object.assign({}, song)
        );

        // return new `Music` object containing a combination of original music value(s)
        // and deep copies of changed form model values
        const saveMusic: Music = {
            album_id: this.music.album_id,
            album_name: this.music.album_name,
            // songs: formModel.songs // <-- bad!
            songs: songsDeepCopy,
        };
        return saveMusic;
    }

    revert() {
        this.ngOnChanges();
    }

    logNameChange() {
        const nameControl = this.musicForm.get('album_id');
        nameControl.valueChanges.forEach(
            (value: string) => this.nameChangeLog.push(value)
        );
    }


    /*onSongUpload(form: NgForm) {
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

     }*/

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
