import {Component, OnInit} from '@angular/core';

import {Router, ActivatedRoute, Params} from '@angular/router';


import {NgForm} from "@angular/forms";
import {AuthService} from "../auth/authService";
import {Subscription} from "rxjs/Subscription";
import {AppService} from "../app.service";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    //template: '<h1>{{title}}</h1><h2>{{hero}} details!</h2>',
    styleUrls: ['./header.component.css'],
    providers: []
})

export class HeaderComponent implements OnInit {

    login_modal;

    public is_sign_in_modal_shown: boolean = false;
    public is_sign_up_modal_shown: boolean = false;
    left_mobile_menu_visible: boolean = false;
    mobile_search_visible: boolean = false;

    is_logged_in: boolean = false;

    subscription: Subscription;

    user: any;

    constructor(private authService: AuthService,
                private route: ActivatedRoute,
                private router: Router,
                private appService: AppService,) {
        //this.is_logged_in = this.authService.loggedIn();
    }

    ngOnInit(): void {

        this.authService.is_logged_in$.subscribe(
            is_logged_in => {
                this.is_logged_in = is_logged_in;
                // Hide login modal
                this.login_modal ? this.login_modal.hide() : '';
            }
        );

        this.authService.user$.subscribe(
            user => {
                this.user = user;
            }
        );

        // Mobile Search
        this.appService.mobile_search_visible$.subscribe(res => {
            this.mobile_search_visible = res;
        });

    }

    mobileMenu(visible: boolean){
        this.appService.setLeftMobileMenuVisible(visible);
    }

    mobileSearch(visible: boolean){
        this.mobile_search_visible = visible;
        this.appService.setMobileSearchVisible(visible);
    }

    gotoUserEditProfilePage() {
        this.router.navigate(['/users/edit']);
    }

    public showSignInModal(): void {
        this.appService.showSignInModal(true);
    }

    public showSignUpModal(): void {
        this.appService.showSignUpModal(true);
    }

    OnLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    };

}
