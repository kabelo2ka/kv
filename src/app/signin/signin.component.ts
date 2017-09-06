import {Component, OnInit, ViewChild} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth/authService";
import {AppService} from "../app.service";
import {Subscription} from "rxjs";
import {NotificationsService} from "angular2-notifications/dist";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
    providers: [NotificationsService]
})
export class SigninComponent implements OnInit {
    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
    private subscription: Subscription;
    signingIn: Subscription;
    public is_modal_shown = false;

    errors: any;

    constructor(private authService: AuthService,
                private appService: AppService,
                private notificationService: NotificationsService,) {
        this.errors = {
            error: null,
            email: null,
            password: null,
        };
    }

    ngOnInit() {
        this.subscription = this.appService.sign_in_modal$.subscribe(
            (res) => this.is_modal_shown = res
        );
    }

    public showModal(): void {
        this.is_modal_shown = true;
    }

    public hideModal(): void {
        this.autoShownModal.hide();
    }

    public onHidden(): void {
        this.is_modal_shown = false;
    }

    onSignIn(form: NgForm) {
        this.signingIn = this.authService.signIn(form.value.email, form.value.password).subscribe(
            () => {
                this.autoShownModal.hide();
                this.notificationService.success('Hello :-)', 'You are logged in.');
            },
            errors => {
                this.errors = errors.json();
                this.signingIn = null;
            },
            () => this.signingIn = null
        );
    }

}
