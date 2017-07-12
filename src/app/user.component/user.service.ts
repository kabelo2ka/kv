import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {User} from './user';
import {Meta} from "../meta";


@Injectable()
export class UserService {

    USER_PROFILE_URL = 'http://www.kasivibe.com/api/v1/users';

    private headers = new Headers({
        'Content-Type': 'application/json',
    });
    private usersUrl = 'http://kasivibe/api/v1/users?fields=id,username,email';
    // URL to web api

    constructor(private http: Http) {
    }

    getUsers(): Observable<User[]> {
        let options = new RequestOptions({headers: this.headers});
        return this.http.get(this.usersUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserById(id) {
        return this.http.get(this.USER_PROFILE_URL + '/' + id, {
            headers: new Headers({
                'X-Requested-With': 'XMLHttpRequest'
            })
        })
    }

    addUser(user): Observable<User> {
        let options = new RequestOptions({headers: this.headers});

        return this.http.post(this.usersUrl, user, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
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

