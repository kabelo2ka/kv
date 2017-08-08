import {Component, OnInit} from "@angular/core";

import {UserService} from "./user.service";
import {AuthService} from "../auth/authService";


@Component({
    templateUrl: './user-edit-profile.component.html',

})


export class UserEditProfileComponent implements OnInit {

    user: any;

    constructor(private authService: AuthService,
                private userService: UserService) {
    }

    ngOnInit() {
        /*this.user = this.authService.getAuthUser().subscribe(
            user => this.user = user
        );*/
        // Get Logged in user
        this.user = this.authService.getAuthUser();
    }

    saveUser(form) {

    }

}