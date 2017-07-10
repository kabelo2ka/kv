import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {FooterComponent} from "./footer/footer.component";
import {AudioService} from "./audio/audio.service";

import {AuthService} from "./auth/authService";
import {AppService} from "./app.service";

import {ISlimScrollOptions} from 'ng2-slimscroll';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [],
    //directives: [ROUTER_DIRECTIVES],
})


export class AppComponent implements OnInit {

    opts: ISlimScrollOptions;

    right_sidebar_visible: boolean = false;
    left_mobile_menu_visible: boolean = false;
    mobile_search_visible: boolean = false;

    login_modal;
    public is_sign_in_modal_shown: boolean = false;
    public is_sign_up_modal_shown: boolean = false;
    is_logged_in: boolean = false;

    constructor(public authService: AuthService, private appService: AppService) {
    }

    ngOnInit(): void {

        if (this.authService.getToken()) {
            // When the app starts up, there might be a valid
            // token in local storage. If there is, we should
            // schedule an initial token refresh for when the
            // token expires
            this.authService.startupTokenRefresh();
            // logged in so return true
            this.authService.isAuthenticated().subscribe((result) => {
                console.log('authenticated');
            });
        }

        this.authService.is_logged_in$.subscribe(
            is_logged_in => {
                this.is_logged_in = is_logged_in;
                // Hide login modal
                this.login_modal ? this.login_modal.hide() : '';
            }
        );

        // Right Panel
        this.appService.right_panel_visible$.subscribe(res => {
            this.right_sidebar_visible = res;
        });

        // Mobile Menu - Right
        this.appService.left_mobile_menu_visible$.subscribe(res => {
            this.left_mobile_menu_visible = res;
        });
        this.appService.mobile_search_visible$.subscribe(res => {
            this.mobile_search_visible = res;
        });

        this.opts = {
            barBackground: '#212121',
            gridBackground: '#D9D9D9',
            barBorderRadius: '0',
            barWidth: '8',
            gridWidth: '8',
            barMargin: '0',
            gridOpacity: '0',
            barOpacity: '1',
            gridBorderRadius: '0',
            gridMargin: '0',
        }
    }

    mobileMenu(visible: boolean){
        this.appService.setLeftMobileMenuVisible(visible);
    }

    mobileSearch(visible: boolean){
        this.appService.setMobileSearchVisible(visible);
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


}
