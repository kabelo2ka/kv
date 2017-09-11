import {Component, OnInit, ViewChild} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth/authService";
import {AppService} from "../app.service";
import {Subscription} from "rxjs";
import {NotificationsService} from "angular2-notifications/dist";

@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.css'],
    providers: [NotificationsService]
})
export class ShareComponent implements OnInit {
    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
    private subscription: Subscription;
    signingIn: Subscription;
    public is_modal_shown = false;

    errors: any;

    constructor(private appService: AppService) {
        this.errors = {
            error: null,
            email: null,
            password: null,
        };
    }

    ngOnInit() {
        this.subscription = this.appService.share_modal$.subscribe(
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

}
