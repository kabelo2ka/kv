import {Component, OnInit} from "@angular/core";

import {UserService} from "../user.component/user.service";
import {AuthService} from "../auth/authService";


@Component({
    templateUrl: './settings.component.html',

})


export class SettingsComponent implements OnInit {

    user: any;

    constructor(private authService: AuthService,
                private userService: UserService) {
    }

    ngOnInit() {
        // Get Logged in user
        this.user = this.authService.getAuthUser();
    }

    saveUser() {
        this.userService.updateUser(this.user).subscribe((res: any) => {

        });
    }

}