import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Meta} from "../meta";


@Injectable()
export class ArtistService {

    ARTISTS_URL = 'http://www.kasivibe.com/api/v1/artists';

    constructor(private http: Http,) {
    }

    getArtists($query) {
        $query = '?query=' + $query || '';
        return this.http.get(this.ARTISTS_URL + $query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getArtist(id: number) {
        return this.http.get(this.ARTISTS_URL + '/' + id)
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