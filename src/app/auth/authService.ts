import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import { tokenNotExpired, AuthHttp, JwtHelper } from 'angular2-jwt';
import {Observable, Subject} from "rxjs";
import 'rxjs/Rx';


@Injectable()
export class AuthService {


    USER_SIGN_UP_URL = "http://www.kasivibe.com/api/v1/user";
    USER_SIGN_IN_URL = "http://www.kasivibe.com/api/v1/user/authenticate";
    AUTHORIZE_URL = "http://www.kasivibe.com/api/v1/user/authorize";
    REFRESH_TOCKEN_URL = "http://www.kasivibe.com/api/v1/user/token/refresh";


    // Observable string sources
    private is_logged_in = new Subject<boolean>();
    private user = new Subject<any>();
    // Observable string streams
    is_logged_in$ = this.is_logged_in.asObservable();
    user$ = this.user.asObservable();

    constructor(private http: Http, private authHttp: AuthHttp, private jwtHelper: JwtHelper) {}

    signUp(username:string, email:string, password:string){
        return this.http.post(this.USER_SIGN_UP_URL, {
            username: username,
            email: email,
            password: password,
        }, {
            headers: new Headers({
                'X-Requested-With': 'XMLHttpRequest'
            })
        });
    }

    signIn(email:string, password:string){
        return this.http.post(this.USER_SIGN_IN_URL, {
            email: email,
            password: password,
        }, {
            headers: new Headers({
                'X-Requested-With': 'XMLHttpRequest'
            })
        }).map(
            (response: Response) => {
                this.is_logged_in.next(true);
                this.user.next(response.json().user);
                // Schedule a token refresh
                this.scheduleRefresh();
                const token = response.json().token;
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                return {token: token, decoded: JSON.parse(window.atob(base64))}
            }
        ).do(
            tokenData => {
                localStorage.setItem('token', tokenData.token);
                localStorage.setItem('refresh_token', tokenData.token);
            }

        );
    }

    isAuthenticated(){
        return this.http.get(this.AUTHORIZE_URL + '?token=' + this.getToken(),{
            headers: new Headers({
                'X-Requested-With': 'XMLHttpRequest'
            })
        }).map(
            (response: Response) => { //Fix this response block
                if(response.json().status === 401){

                }
                //console.log(response.status);
                this.user.next(response.json().user);
                this.is_logged_in.next(true); //Check this line
            }
        ).catch(this.handleError);
    }

    getToken(){
        return localStorage.getItem('token');
    }

    isLoggedIn(){
        return this.is_logged_in;
    }

    loggedIn() {
        return tokenNotExpired();
    }

    getUser(){
        return this.user;
    }

    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        this.is_logged_in.next(false);
        // Unschedule the token refresh
        this.unscheduleRefresh();
    }

    private handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        //console.error(errMsg);
        return Observable.throw(errMsg);
    }





    refreshSubscription: any;
    public scheduleRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        let source = this.authHttp.tokenStream.flatMap(
            token => {
                // The delay to generate in this case is the difference
                // between the expiry time and the issued at time
                let jwtIat = this.jwtHelper.decodeToken(token).iat;
                let jwtExp = this.jwtHelper.decodeToken(token).exp;
                let iat = new Date(0);
                let exp = new Date(0);

                let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

                return Observable.interval(delay);
            });

        this.refreshSubscription = source.subscribe(() => {
            this.getNewJwt();
        });
    }

    public startupTokenRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        if (this.loggedIn()) {
            let source = this.authHttp.tokenStream.flatMap(
                token => {
                    // Get the expiry time to generate
                    // a delay in milliseconds
                    let now: number = new Date().valueOf();
                    let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
                    let exp: Date = new Date(0);
                    exp.setUTCSeconds(jwtExp);
                    let delay: number = exp.valueOf() - now;

                    // Use the delay in a timer to
                    // run the refresh at the proper time
                    return Observable.timer(delay);
                });

            // Once the delay time from above is
            // reached, get a new JWT and schedule
            // additional refreshes
            source.subscribe(() => {
                this.getNewJwt();
                this.scheduleRefresh();
            });
        }
    }

    public unscheduleRefresh() {
        // Unsubscribe from the refresh
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    public getNewJwt() {
        // Get a new JWT from Auth0 using the refresh token saved
        // in local storage
        return this.http.post(this.REFRESH_TOCKEN_URL, {
            refresh_token: localStorage.getItem('refresh_token'),
        }).map(
            (res: any) => {
                localStorage.setItem('token', res.json().data);
            }
        ).catch(this.handleError);
    }





}