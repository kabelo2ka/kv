import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth/authService";
import {AppService} from "../app.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
    private subscription: Subscription;
    public is_modal_shown: boolean = false;

    errors: any;

    constructor(private authService: AuthService, private appService: AppService) {
        this.errors = {
            error: null,
            username: null,
            email: null,
            password: null,
        };
    }

    ngOnInit() {
        this.subscription = this.appService.sign_up_modal$.subscribe(
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

    onSignUp(form: NgForm) {
        this.authService.signUp(form.value.username, form.value.email, form.value.password).subscribe(
            () => {
                //console.log(res);
                this.autoShownModal.hide();
            },
            errors => this.errors = errors.json()
        )
    }

}
