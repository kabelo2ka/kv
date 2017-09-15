import {Component} from '@angular/core';
import {AuthService} from "../auth/authService";
import {Subscription} from "rxjs/Subscription";


@Component({
    templateUrl: './home.component.html',
    //template: '<h1>{{title}}</h1><h2>{{hero}} details!</h2>',
    styleUrls: ['./home.component.css'],
    providers: []
})

export class HomeComponent {

    user: any = {};
    is_logged_in: boolean = false;

    subscription: Subscription;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.is_logged_in$.subscribe(
            is_logged_in => {
                this.is_logged_in = is_logged_in;
            }
        );
        this.authService.user$.subscribe(
            user => {
                this.user = user;
            }
        );
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }

}
