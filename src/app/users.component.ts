import {Component} from '@angular/core';

import {UserService} from "./user.component/user.service";
import {Meta} from "./meta";
import {User} from "./user.component/user";

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
})
export class UsersComponent {
    title = 'Users';
    errorMessage: string;
    users: User[];
    meta: Meta[];
    selectedUser: User;

    constructor(private userService: UserService) {
    }

    getUsers() {
        this.userService.getUsers().subscribe(
            response => {
                this.users = response;
                console.log(response);
                //this.meta = response;
            },
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit(): void {
        this.getUsers();
    }

    onSelect(user: User): void {
        this.selectedUser = user;
    }
}
