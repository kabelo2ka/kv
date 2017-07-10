import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from '@angular/router';

import {UserService} from "./user.service";


@Component({
    templateUrl: './user-profile.component.html',

})


export class UserProfileComponent implements OnInit {

    user: any;

    constructor(private activatedRoute: ActivatedRoute,
                private userService: UserService) {
    }

    getUserById(id: number) {
        this.userService.getUserById(id).subscribe(
            user => this.user = user.json()
        );
    }

    editUser(form) {

    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let userId = params['id'];
            //console.log(userId);
            this.getUserById(userId);
        });
    }

}