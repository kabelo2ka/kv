import {Component, OnDestroy, OnInit} from "@angular/core";

import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth/authService";
import {Subscription} from "rxjs/Subscription";
import {AppService} from "../app.service";
import {User} from "../user.component/user";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnInit, OnDestroy {

    login_modal;

    public is_sign_in_modal_shown = false;
    public is_sign_up_modal_shown = false;
    left_mobile_menu_visible = false;


    is_logged_in = false;

    subscription: Subscription;

    confirmationEmailSent = false;

    user: User;

    constructor(public authService: AuthService,
                private route: ActivatedRoute,
                private router: Router,
                private appService: AppService,) {
        // this.is_logged_in = this.authService.loggedIn();
    }

    ngOnInit(): void {

        // Get from cache (local storage) before reloading user data | can delete
        if (this.authService.loggedIn()) {
            this.user = this.authService.getAuthUser();
        }

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


    }

    mobileMenu(visible: boolean) {
        this.appService.setLeftMobileMenuVisible(visible);
    }

    gotoSettingsPage() {
        this.router.navigate(['/settings']);
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

    sendConfirmationEmail() {
        this.authService.sendConfirmationEmail().subscribe(
            () => this.confirmationEmailSent = true
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    };

}
