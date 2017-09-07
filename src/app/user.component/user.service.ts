import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";

import "rxjs/add/operator/toPromise";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import {User} from "./user";
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../auth/authService";


@Injectable()
export class UserService {

    USER_URL = '//kasivibe.com/api/v1/users';

    private headers = new Headers({
        'Content-Type': 'application/json',
    });
    private usersUrl = '//kasivibe/api/v1/users?fields=id,username,email';
    // URL to web api

    constructor(private http: Http,
                public authHttp: AuthHttp,
                public authService: AuthService,) {
    }

    getUsers(): Observable<User[]> {
        const options = new RequestOptions({headers: this.headers});
        return this.http.get(this.usersUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserById(id) {
        return this.http.get(this.USER_URL + '/' + id, {
            headers: new Headers({
                'X-Requested-With': 'XMLHttpRequest'
            })
        });
    }

    updateUser(user) {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.patch(this.USER_URL, user, options)
            .map((res: Response) => {
                const body = res.json();
                // Update "authUser" local storage
                this.authService.saveAuthUserToLocalStorage(body.data);
                return body.data || {};
            }).catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        return body.data || {};
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

