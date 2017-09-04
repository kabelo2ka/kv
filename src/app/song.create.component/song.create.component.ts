import {Component, EventEmitter, OnInit} from "@angular/core";
import {humanizeBytes, UploadFile, UploadInput, UploadOutput} from "ngx-uploader";
import {GenreService} from "../genres/genre.service";
import {Genre} from "../genres/genre";
import {SongService} from "../songs.component/song.service";

@Component({
    selector: 'songs-upload',
    templateUrl: './song.create.component.html',
    styleUrls: ['./song.create.component.css'],
})


export class SongCreateComponent implements OnInit{

    file: UploadFile;
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;

    song: any;

    albums: any[];


    genres: Genre[];


    constructor(private songService: SongService,
                private genreService: GenreService,
    ){
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
        this.song = {
            name: '',
            genre_id: 0,
        };
    }

    ngOnInit(): void{
        this.genreService.getGenres(null).subscribe(
            (res: any) => this.genres = res.data
        );
    }

    onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') { // when all files added in queue
            // Auto upload files when added
            this.startUpload();
        } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
            // add file to array when added
            console.log('Added to queue', output.file);
            this.file = output.file;
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
            // update current data in files array for uploading file
            /*const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
            this.files[index] = output.file;*/
        } else if (output.type === 'removed') {
            // remove file from array when removed
            this.file = null;
        } else if (output.type === 'dragOver') {
            this.dragOver = true;
        } else if (output.type === 'dragOut') {
            this.dragOver = false;
        } else if (output.type === 'drop') {
            this.dragOver = false;
        }
    }

    startUpload(): void {
        const event: UploadInput = {
            type: 'uploadFile',
            url: 'http://www.kasivibe.com/api/v1/songs/upload',
            method: 'POST',
            data: { foo: 'bar' },
            file: this.file
            //concurrency: this.formData.concurrency
        };
        this.uploadInput.emit(event);
        this.song.file_name = this.file.response.filename;
    }

    createSong() {
        this.songService.createSong(this.song).subscribe(
            (res: any) => console.log(res)
        );
    }

}
