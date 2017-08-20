import {Component, OnInit} from "@angular/core";
import {SocketService} from "../socket.service";

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    connection;
    notifications = [];

    constructor(private socketService: SocketService,) {
    }

    ngOnInit() {
        // Subscribe to notifications channel
        this.connection = this.socketService.getNotifications().subscribe((res: any) => {
            this.notifications.unshift(res);
            console.log(res);
        });
    }

}
