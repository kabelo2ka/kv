import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';

import 'rxjs/add/operator/toPromise';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Meta} from "../meta";
import {AuthService} from "../auth/authService";


@Injectable()
export class GenreService {

    private headers = new Headers({
        'Content-Type': 'application/json',
    });
    private GENRE_URL = 'http://www.kasivibe.com/api/v1/genre';
    // URL to web api

    // @todo: Get genres from server
    genres = [
        {
            'id': 1,
            'name': 'Hip hop'
        },
        {
            'id': 2,
            'name': 'RnB'
        },
        {
            'id': 3,
            'name': 'House'
        },
        {
            'id': 4,
            'name': 'Kwaito'
        },
        {
            'id': 5,
            'name': 'Gospel'
        }
    ];

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
    getGenres(query: string) {
        query = (query && query.trim() != '' || query !== undefined) ? '?query=' + query : '';
        return this.authHttp.get(this.GENRE_URL + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getGenre(id: number) {
        return this.http.get(this.GENRE_URL + '/' + id)
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
