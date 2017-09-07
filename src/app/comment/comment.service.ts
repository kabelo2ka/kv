import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";

import "rxjs/add/operator/toPromise";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {AuthService} from "../auth/authService";


@Injectable()
export class CommentService {

    private headers = new Headers({
        'Content-Type': 'application/json',
    });

    // URL to web api
    COMMENTS_URL = '//kasivibe.com/api/v1/comments';

    constructor(private http: Http,
                public authHttp: AuthHttp,
                private authService: AuthService) {
    }

    getComments(song_id) {
        return this.http.get('//kasivibe.com/api/v1/songs/' + song_id + '/comments')
            .map(this.extractData)
            .catch(this.handleError);
    }

    addComment(comment, song_id) {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp
            .post('//kasivibe.com/api/v1/songs/' + song_id + '/comments' + '?token=' + this.authService.getToken(), comment, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteComment(id: number) {
        const options = new RequestOptions({headers: this.headers});
        return this.http.delete(this.COMMENTS_URL + '/' + id, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
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
