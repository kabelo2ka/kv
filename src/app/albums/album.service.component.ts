import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {Observable} from "rxjs";
import {AuthService} from "../auth/authService";


@Injectable()

export class AlbumService {

    ALBUMS_URL = "http://www.kasivibe.com/api/v1/albums";
    USER_ALBUMS_URL = "http://www.kasivibe.com/api/v1/user/albums";

    constructor(private http: Http, private authService: AuthService) {
    }

    getUserAlbums(query) {
        query = (query && query.trim() != '' || query !== undefined) ? '&query=' + query : '';
        return this.http.get(this.USER_ALBUMS_URL + '?token=' + this.authService.getToken() + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAlbums(query) {
        query = (query && query.trim() != '' || query !== undefined) ? '?query=' + query : '';
        return this.http.get(this.ALBUMS_URL + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAlbum(id: number) {
        return this.http.get(this.ALBUMS_URL + '/' + id)
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
