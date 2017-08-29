import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Observable} from "rxjs";

@Injectable()
export class NotificationService {

    NOTIFICATIONS_URL = "http://www.kasivibe.com/api/v1/notifications";

    constructor(private authHttp: AuthHttp,) {
    }

    getNotifications() {
        return this.authHttp.get(this.NOTIFICATIONS_URL)
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}