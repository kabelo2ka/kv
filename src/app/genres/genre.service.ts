import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";

import "rxjs/add/operator/toPromise";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {AuthService} from "../auth/authService";


@Injectable()
export class GenreService {

    private headers = new Headers({
        'Content-Type': 'application/json',
    });
    private GENRE_URL = '//kasivibe.com/api/v1/genres';
    // URL to web api

    constructor(private http: Http,
                public authHttp: AuthHttp,
                private authService: AuthService) {
    }

    /**
     *
     *
     * @param query Search Query
     * @returns {Observable<Song[]>}
     */
    getGenres(query?: string) {
        query = (query && query.trim() !== '' || query !== undefined) ? '?query=' + query : '';
        return this.http.get(this.GENRE_URL + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getGenre(id: number) {
        return this.http.get(this.GENRE_URL + '/' + id)
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
