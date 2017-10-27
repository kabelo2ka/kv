import {Component, OnInit} from "@angular/core";
import {PolicyService} from "../policy.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-policies-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.css'],
    providers: [PolicyService]
})
export class TermsComponent implements OnInit {

    loading: Subscription;
    html = '';

    constructor(private policyService: PolicyService) {
    }

    ngOnInit() {
        this.loading = this.policyService.getTerms().subscribe( (res: any) => this.html = res.data.html);
    }

}
