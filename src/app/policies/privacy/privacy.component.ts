import {Component, OnInit} from "@angular/core";
import {PolicyService} from "../policy.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-policies-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.css'],
    providers: [PolicyService]
})
export class PrivacyComponent implements OnInit {

    loading: Subscription;
    html = '';

    constructor(private policyService: PolicyService) {
    }

    ngOnInit() {
        this.loading = this.policyService.getPrivacy().subscribe((res: any) => this.html = res.data.html);
    }

}
