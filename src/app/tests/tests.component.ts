import {Component, OnInit} from "@angular/core";
import * as io from "socket.io-client";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

import * as jsmediatags from "jsmediatags";

declare var System: any;

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
        let file = event.target.files[0];
        console.log(file);
        /*jsmediatags.read(file, {
            onSuccess: tag => {
                console.log(tag);
                alert('sts');
            },
            onError: error => {
                alert('error');
                console.log(error);
            }
        });*/
        System.import('jsmediatags').then(jsmediatags => {
            new jsmediatags.Reader(file)
                .setTagsToRead(["title", "artist"])
                .read({
                    onSuccess: function(tag) {
                        console.log(tag);
                    },
                    onError: function(error) {
                        console.log(':(', error.type, error.info);
                    }
                });
        });
    }

}
