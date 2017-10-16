import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {AuthHttp} from 'angular2-jwt';


@Injectable()
export class AlbumService {

    ALBUMS_URL = '//kasivibe.com/api/v1/albums';
    USER_URL = '//kasivibe.com/api/v1/users';
    USER_ALBUMS_URL = '//kasivibe.com/api/v1/user/albums';

    private headers = new Headers({
        'Content-Type': 'application/json',
    });

    constructor(private http: Http, private authHttp: AuthHttp) {
    }

    getUserAlbums() {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.get(this.USER_ALBUMS_URL, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAlbums(query?) {
        query = (query && query.trim() !== '' || query !== undefined) ? '?query=' + query : '';
        return this.http.get(this.ALBUMS_URL + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAuthAlbums(query?: string) {
        query = (query && query.trim() !== '' || query !== undefined) ? '?query=' + query : '';
        return this.authHttp.get(this.USER_URL + '/albums' + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAlbum(slug: string) {
        return this.http.get(this.ALBUMS_URL + '/' + slug)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createAlbum(album) {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.post(this.ALBUMS_URL, album, options)
            .map(this.extractData);
    }

    updateAlbum(slug: string, album) {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.patch(this.ALBUMS_URL + '/' + slug, album, options)
            .map(this.extractData);
    }

    deleteAlbum(slug) {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.delete(this.ALBUMS_URL + '/' + slug, options)
            .map(this.extractData);
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
