import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import * as io from "socket.io-client";


@Injectable()
export class SocketService {

    private SOCKET_URL = 'http://www.kasivibe.com:3000';
    private socket;

    /**
     * Get Comments
     *
     * @returns {Observable}
     */
    getComments() {
        return new Observable(observer => {
            this.socket = io(this.SOCKET_URL);
            this.socket.on('songs:App\\Events\\UserCommented', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
    }

}