import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'app-notification-toast',
    template: '<simple-notifications [options]="options"></simple-notifications>',
    styleUrls: ['./notification-toast.component.css']
})
export class NotificationToastComponent implements OnInit {

    public options = {
        position: ["top", "right"],
        timeOut: 5000,
        showProgressBar: false,
    };

    constructor() {
    }

    ngOnInit() {
    }

}
