import {Component, ElementRef, EventEmitter, OnChanges, OnInit, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

import {UploadOutput, UploadInput, UploadFile, humanizeBytes} from 'ngx-uploader';

import {Http} from "@angular/http";
import {AuthService} from "../auth/authService";
import {AlbumService} from "../albums/album.service.component";
//import {Song} from "../songs.component/song";
import {SongService} from "../songs.component/song.service";
import {Music, Song} from "../data-model";


@Component({
    selector: 'songs-upload',
    templateUrl: './song.create.component.html',
    styleUrls: ['./song.create.component.css'],
})


export class SongCreateComponentBk implements OnInit, OnChanges {
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


    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;


    constructor(private http: Http,
                private authService: AuthService,
                private albumService: AlbumService,
                private songService: SongService,
                private fb: FormBuilder) {
        this.createForm();
        this.logNameChange();

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    ngOnInit() {
        this.getUserAlbums();
        // @todo troubleshoot validate album_name when album_id=create
        this.musicForm.get('album_id').valueChanges.subscribe(
            value => {
                if (value == 'create') {
                    this.musicForm.get('album_name').setValidators([Validators.required]);
                } else {
                    this.musicForm.get('album_name').clearValidators();
                }
                this.musicForm.get('album_name').updateValueAndValidity();
            }
        );
    }

    createForm() {
        this.musicForm = this.fb.group({
            album_id: ['create', Validators.required],
            album_name: ['', Validators.required], // Only when album_id=create
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
        this.musicForm.setControl('songs', songFormArray);
    }

    addSong() {
        const songGroup = {
            name: ['', Validators.required],
            genre_id: ['', Validators.required],
            file_name: ['', Validators.required],
            lyrics: ''
        };
        this.songs.push(this.fb.group(songGroup))
    }

    removeSong(index: number) {
        this.songs.removeAt(index);
        //@todo remove audio file from upload queue
        this.files = this.files.filter(file => file.fileIndex !== index);
    }

    onSubmit() {
        this.music = this.prepareSaveMusic();
        this.songService.saveMusic(this.music);//.subscribe(/* error handling */);
        this.ngOnChanges();
    }


    prepareSaveMusic(): Music {
        const formModel = this.musicForm.value;

        // deep copy of form model songs
        const songsDeepCopy: Song[] = formModel.songs.map(
            (song: Song) => (<any>Object).assign({}, song)
        );

        // return new `Music` object containing a combination of original music value(s)
        // and deep copies of changed form model values
        const saveMusic: Music = {
            album_id: formModel.album_id,
            album_name: formModel.album_name,
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

    getUserAlbums() {
        this.albumService.getUserAlbums().subscribe(
            (res: any) => {
                this.albums = res.data;

                console.log(this.albums);
            }
        );
    }


    setAudioFile(event) {
        this.audio_file = event;
    }


    startUpload(): void {  // manually start uploading
        const event: UploadInput = {
            type: 'uploadAll',
            url: '/upload',
            method: 'POST',
            data: {foo: 'bar'},
            concurrency: 1 // set sequential uploading of files with concurrency 1
        };
        this.uploadInput.emit(event);
    }

    onUploadOutput(output: UploadOutput): void {
        console.log(output); // lets output to see what's going on in the console

        if (output.type === 'allAddedToQueue') { // when all files added in queue
            // uncomment this if you want to auto upload files when added
            // const event: UploadInput = {
            //   type: 'uploadAll',
            //   url: '/upload',
            //   method: 'POST',
            //   data: { foo: 'bar' },
            //   concurrency: 0
            // };
            // this.uploadInput.emit(event);
        } else if (output.type === 'addedToQueue') {
            this.files.push(output.file); // add file to array when added
        } else if (output.type === 'uploading') {
            // update current data in files array for uploading file
            const index = this.files.findIndex(file => file.id === output.file.id);
            this.files[index] = output.file;
            this.musicForm.get('file_name').setValue(output.file.id);
        } else if (output.type === 'removed') {
            // remove file from array when removed
            this.files = this.files.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'dragOver') { // drag over event
            this.dragOver = true;
        } else if (output.type === 'dragOut') { // drag out event
            this.dragOver = false;
        } else if (output.type === 'drop') { // on drop event
            this.dragOver = false;
        }
    }













}
