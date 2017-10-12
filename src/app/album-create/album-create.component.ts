import {Component, OnInit} from '@angular/core';
import {AlbumService} from "../albums/album.service.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {NotificationsService} from "angular2-notifications/dist";

@Component({
    selector: 'app-album-create',
    templateUrl: './album-create.component.html',
    styleUrls: ['./album-create.component.css']
})
export class AlbumCreateComponent implements OnInit {
    fileInput;
    albumForm: FormGroup;

    constructor(
        private albumService: AlbumService,
        private notificationService: NotificationsService,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.albumForm = this.fb.group({
            'name': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            'file': [null],
            'active': [true, Validators.required],
        });
    }

    fileChange($event) {
        if ($event.target.files) {
            console.log();
            this.albumForm.get('file').setValue($event.target.files[0])
        }
    }


    createAlbum() {
        console.log(this.albumForm.value);
        /*this.albumService.createAlbum(this.albumForm.value).subscribe( (res: any) => {
            this.notificationService.success('Yipppie!', 'File Uploaded.');
        });*/
    }


}
