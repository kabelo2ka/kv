import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/authService";
import {User} from "../user.component/user";


@Component({
    selector: 'left-sidebar',
    templateUrl: './sidebar.left.component.html',
    //template: '<h1>{{title}}</h1><h2>{{hero}} details!</h2>',
    styleUrls: ['./sidebar.left.component.css'],
    providers: [],
})

export class LeftSidebarComponent implements OnInit {

    user: User;

    constructor(public authService: AuthService) {
    }

    ngOnInit() {
        // Get from cache (local storage) before reloading user data | can delete
        if (this.authService.loggedIn()) {
            this.user = this.authService.getAuthUser();
        }
    }

}
