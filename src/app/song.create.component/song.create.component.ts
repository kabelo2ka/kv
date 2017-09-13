import {Component, EventEmitter, OnChanges, OnInit} from "@angular/core";
import {humanizeBytes, UploadFile, UploadInput, UploadOutput} from "ngx-uploader";
import {GenreService} from "../genres/genre.service";
import {Genre} from "../genres/genre";
import {SongService} from "../songs.component/song.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlbumService} from "../albums/album.service.component";
import {AuthService} from "../auth/authService";
import {NotificationsService} from "angular2-notifications/dist";
import {Album} from "../albums/album";
import {AppService} from "../app.service";

@Component({
    selector: 'app-songs-upload',
    templateUrl: './song.create.component.html',
    styleUrls: ['./song.create.component.css'],
    providers: [NotificationsService]
})


export class SongCreateComponent implements OnInit, OnChanges {

    songForm: FormGroup;

    file: UploadFile;
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;

    albums: Album[];
    genres: Genre[];


    constructor(private genreService: GenreService,
                private notificationService: NotificationsService,
                private songService: SongService,
                private albumService: AlbumService,
                private authService: AuthService,
                private appService: AppService,
                private fb: FormBuilder,) {
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    ngOnInit(): void {
        this.genreService.getGenres(null).subscribe(
            (res: any) => this.genres = res.data
        );
        this.albumService.getUserAlbums().subscribe(
            (res: any) => this.albums = res.data
        );
        this.buildForm();
        this.songForm.get('album_id').valueChanges.subscribe(
            value => {
                if (value === 'create') {
                    this.songForm.get('album_name').setValidators(Validators.compose(
                        [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
                    ));
                } else {
                    this.songForm.get('album_name').clearValidators();
                }
                this.songForm.get('album_name').updateValueAndValidity();
            }
        );
    }

    ngOnChanges(): void {
        if (this.file.progress.data.percentage === 100) {
            this.songForm.controls['album_id'].setValue('test');
        }
    }

    onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') { // when all files added in queue
            // Auto upload files when added
            if( ! this.authService.loggedIn()){
                // @todo subscribe to login modal, so if the user logs in, startUpload
                this.appService.showSignInModal(true);
                this.authService.is_logged_in$.subscribe(
                    // If user is logged in, start uploading
                    (is_logged_in:boolean) => {
                        if(is_logged_in){
                            this.startUpload()
                        }
                    },
                        error => console.log(error)
                    );
            }else{
                this.startUpload();
            }
        } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
            // add file to array when added
            if (!this.songForm.controls['name'].value) {
                this.songForm.controls['name'].setValue(output.file.name);
            }
            //console.log('Added to queue', output.file);
            this.file = output.file;
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
            // update current data in files array for uploading file
            /*const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
             this.files[index] = output.file;*/
        } else if (output.type === 'removed') {
            // remove file from array when removed
            this.file = undefined;
        } else if (output.type === 'dragOver') {
            this.dragOver = true;
        } else if (output.type === 'dragOut') {
            this.dragOver = false;
        } else if (output.type === 'drop') {
            this.dragOver = false;
        } else if (output.type === 'done') {
            this.songForm.controls['file_name'].setValue(output.file.response.filename);
        }
    }

    startUpload(): void {
        const event: UploadInput = {
            type: 'uploadFile',
            url: '//kasivibe.com/api/v1/songs/upload',
            headers: {'Authorization': 'Bearer ' + this.authService.getToken()},
            method: 'POST',
            data: {foo: 'bar'},
            file: this.file
            // concurrency: this.formData.concurrency
        };
        this.uploadInput.emit(event);
    }

    buildForm() {
        this.songForm = this.fb.group({
            'file_name': [null, Validators.required],
            'name': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            'genre_id': ['', Validators.required],
            'album_id': ['', Validators.required],
            'album_name': [null],
            'lyrics': [null],
            'downloadable': [false, Validators.required],
            'commentable': [true, Validators.required],
            'private': [false, Validators.required],
        });
    }

    createSong() {
        this.songService.createSong(this.songForm.value).subscribe(
            (res: any) => {
                this.notificationService.success('Yipppie!', 'File Uploaded.');
            }
        );
    }

    resetFrom() {
        const c = confirm('Are you sure you want to stop your upload? Any unsaved changes will be lost.');
        if (c === true) {
            this.songForm.reset();
            this.uploadInput.emit({type: 'remove', id: this.file.id});
            this.uploadInput.emit({type: 'cancel', id: this.file.id});
        }
    }

}
