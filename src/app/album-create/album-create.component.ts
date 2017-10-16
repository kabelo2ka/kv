import {Component, OnInit} from '@angular/core';
import {AlbumService} from '../albums/album.service.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications/dist';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-album-create',
    templateUrl: './album-create.component.html',
    styleUrls: ['./album-create.component.css']
})
export class AlbumCreateComponent implements OnInit {
    fileInput;
    previewImageUrl = '';
    albumForm: FormGroup;
    errors: any;
    savingAlbum: Subscription;
    fileString: string;

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
            'name': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            'imageData': [null],
            'active': [true, Validators.required],
        });
    }

    fileChange($event) {
        if ($event.target.files.length) {
            const reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString($event.target.files[0]);
        }
    }

    protected _handleReaderLoaded(readerEvt) {
        const binaryString = readerEvt.target.result;
        this.fileString = btoa(binaryString);  // Converting binary string data
        this.albumForm.controls['imageData'].setValue(this.fileString);
        this.previewImageUrl = 'data:image/jpeg;base64,' + this.fileString;
    }

    createAlbum() {
        this.savingAlbum = this.albumService.createAlbum(this.albumForm.value).subscribe((res: any) => {
                this.notificationService.success('Yipppie!', 'Album created.');
            },
            errors => {
                this.errors = errors.json();
                this.savingAlbum = null;
            },
            () => this.savingAlbum = null
        );
    }


}
