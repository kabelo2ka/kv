import {Component, OnInit} from "@angular/core";
import {SocketService} from "../socket.service";
import {NotificationService} from "./notification.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    loading;
    connection;
    notifications = [];
    notifications_count = 0;


    constructor(private socketService: SocketService,
                private notificationService: NotificationService,
                private router: Router) {
    }

    ngOnInit() {
        // Subscribe to notifications channel
        this.connection = this.socketService.getNotifications().subscribe((res: any) => {
            this.notifications.unshift(res);
            this.notifications_count++;
            console.log(res);
        });
        this.getNotifications();
    }

    getNotifications() {
        this.loading = this.notificationService.getNotifications().subscribe((res: any) => {
            this.notifications = res.data;
            this.notifications_count = this.notifications.length;
        });
    }

    clearNotificationsCount() {
        this.notifications_count = 0;
    }

    setNotificationAsRead(id, url) {
        this.notificationService.setNotificationAsRead(id).subscribe((res: any) => {
            console.log('Marked as read');
        });
        this.router.navigate([url]);
    }

}
