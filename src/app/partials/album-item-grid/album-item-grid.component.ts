import {Component, OnInit, Input} from '@angular/core';
import {Album} from '../../albums/album';
import {User} from '../../user.component/user';
import {AuthService} from '../../auth/authService';

@Component({
    selector: 'app-album-item-grid',
    templateUrl: './album-item-grid.component.html',
    styleUrls: ['./album-item-grid.component.css']
})
export class AlbumItemGridComponent implements OnInit {
    @Input() album: Album;
    @Input() owner: User;

    isLoggedIn = false;

    constructor(private authService: AuthService, ) {
    }

    ngOnInit() {
        this.authService.is_logged_in$.subscribe((res: boolean) => this.isLoggedIn = res);
    }

    isOwner() {
        return (this.authService.loggedIn() || this.isLoggedIn)
            && (this.album && this.album.user_id === this.authService.getAuthUser().id);
    }
}
