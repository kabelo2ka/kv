import {Component, OnInit} from "@angular/core";
import {SocketService} from "../socket.service";
import {NotificationService} from "./notification.service";

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    loading;
    connection;
    notifications = [];

    constructor(private socketService: SocketService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        // Subscribe to notifications channel
        this.connection = this.socketService.getNotifications().subscribe((res: any) => {
            this.notifications.unshift(res);
            console.log(res);
        });
        this.getNotifications();
    }

    getNotifications() {
        this.loading = this.notificationService.getNotifications().subscribe((res: any) => {
            this.notifications = res.data;
        });
    }


}
