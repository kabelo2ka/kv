import {Component, OnInit} from "@angular/core";
import * as io from "socket.io-client";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

import * as jsmediatags from "jsmediatags";

@Component({
    selector: 'app-tests',
    templateUrl: './tests.component.html',
    styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {



    constructor(private http: Http) {

    }

    ngOnInit() {

    }

    getMeta(event) {
        const file = event.target.files[0];
        console.log(file);
        jsmediatags.read(file, {
            onSuccess: tag => {
                alert('success');
                console.log(tag);
            },
            onError: error => {
                alert('error');
                console.log(error);
            }
        });
    }

}
