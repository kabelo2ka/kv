import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";


@Injectable()
export class PolicyService {

    TERMS_URL = '//kasivibe.com/api/v1/policies/terms';
    PRIVACY_URL = '//kasivibe.com/api/v1/policies/privacy';

    constructor(
      private http: Http
    ) {};

    getTerms() {
        return this.http.get(this.TERMS_URL)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPrivacy() {
        return this.http.get(this.PRIVACY_URL)
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