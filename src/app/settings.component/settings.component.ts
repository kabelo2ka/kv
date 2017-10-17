import {Component, OnInit} from "@angular/core";

import {UserService} from "../user.component/user.service";
import {AuthService} from "../auth/authService";
import {NotificationsService} from "angular2-notifications/dist";
import {Subscription} from "rxjs";


@Component({
    templateUrl: './settings.component.html',

})


export class SettingsComponent implements OnInit {
    savingProfile: Subscription;

    user: any;

    constructor(private authService: AuthService,
                private userService: UserService,
                private notificationService: NotificationsService) {
    }

    ngOnInit() {
        // Get Logged in user
        this.user = this.authService.getAuthUser();
    }

    saveUser() {
        this.savingProfile = this.userService.updateUser(this.user).subscribe(
            (res: any) => this.notificationService.success('Success', 'Profile updated!'),
            (error) => {
                this.notificationService.error('Error', error);
                this.savingProfile = null;
            },
            () => this.savingProfile = null
        );
    }

}