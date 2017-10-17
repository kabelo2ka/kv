import {Component, OnInit} from '@angular/core';
import {Album} from '../albums/album';
import {AlbumService} from '../albums/album.service.component';
import {Subscription} from 'rxjs/Subscription';
import {NotificationsService} from 'angular2-notifications/dist';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AppService} from "../app.service";

@Component({
    selector: 'app-album-edit',
    templateUrl: './album-edit.component.html',
    styleUrls: ['./album-edit.component.css']
})
export class AlbumEditComponent implements OnInit {
    loading: Subscription;
    albumForm: FormGroup;
    fileString = '';
    previewImageUrl = '';
    savingAlbum: Subscription;
    deletingAlbum: Subscription;
    old_album: Album;
    album: Album;
    errors: any;

    constructor(
        private notificationService: NotificationsService,
        private activatedRoute: ActivatedRoute,
        private albumService: AlbumService,
        private appService: AppService,
        private router: Router,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.activatedRoute.params.subscribe((params: Params) => {
            const slug = params['slug'];
            this.loading = this.albumService.getAlbum(slug).subscribe(
                (res: any) => {
                    this.album = res.data;
                    this.old_album = res.data;
                    this.previewImageUrl = res.data.image;
                    this.albumForm.controls['name'].setValue(this.album.name);
                    this.albumForm.controls['active'].setValue(this.album.active);
                }
            );
        });
    }

    buildForm() {
        this.albumForm = this.fb.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            'imageData': [null],
            'active': [false, Validators.required],
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


    removeImageFile() {
        const c = confirm('Are you sure you want to remove this picture?');
        if (c === true) {
            console.log(this.albumForm.value);
            this.previewImageUrl = '';
            this.albumForm.controls['imageData'].reset(null);
            console.log('image removed',this.albumForm.value);
        }
    }

    saveAlbum() {
        this.savingAlbum = this.albumService.updateAlbum(this.album.slug, this.albumForm.value).subscribe(
            (res: any) => {
                this.appService.showToastNotification('', 'Album updated.', 'SUCCESS');
                this.router.navigate(['/albums', this.album.slug]);
            },
            errors => {
                this.errors = errors.json();
                this.savingAlbum = null;
            },
            () => this.savingAlbum = null
        );
    }

    deleteAlbum() {
        const c = confirm('Are you sure you want to delete this album?\n\nAll songs in this album will also be deleted.');
        if (c === true) {
            this.deletingAlbum = this.albumService.deleteAlbum(this.album.slug).subscribe(
                (res: any) => {
                    this.appService.showToastNotification('', 'Album deleted.', 'SUCCESS');
                    this.router.navigate(['/albums']);
                },
                () => {
                    this.deletingAlbum = null;
                },
                () => this.deletingAlbum = null
            );
        }
    }

}
