import {Component, OnInit, EventEmitter, } from "@angular/core";
import {Music, Song} from "../data-model";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import {FormGroup, FormControl} from "@angular/forms";

import { TabsetComponent } from 'ngx-bootstrap';

@Component({
    selector: 'songs-upload',
    templateUrl: './song.create.component.html',
    styleUrls: ['./song.create.component.css'],
})


export class SongCreateComponent implements OnInit{

    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;

    musicFormGroup: FormGroup;

    albums: any[];


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


    constructor(

    ){
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    ngOnInit(): void{
        this.musicFormGroup = new FormGroup({
            name: new FormControl()
        });
    }



    onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') { // when all files added in queue
            // Auto upload files when added
            this.startUpload();
        } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
            // add file to array when added
            console.log('Added to queue', output.file);
            this.files[0] = output.file;
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
            // update current data in files array for uploading file
            /*const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
            this.files[index] = output.file;*/
        } else if (output.type === 'removed') {
            // remove file from array when removed
            this.files = this.files.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'dragOver') {
            this.dragOver = true;
        } else if (output.type === 'dragOut') {
            this.dragOver = false;
        } else if (output.type === 'drop') {
            this.dragOver = false;
        }
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id: id });
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }

    startUpload(): void {
        const event: UploadInput = {
            type: 'uploadFile',
            url: 'http://www.kasivibe.com/api/v1/upload',
            method: 'POST',
            data: { foo: 'bar' },
            file: this.files[0]
            //concurrency: this.formData.concurrency
        };

        this.uploadInput.emit(event);
    }


}
