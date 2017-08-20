import {Component, OnDestroy, OnInit} from "@angular/core";
import {AppService} from "../app.service";
import {Observable} from "rxjs";
import {TypeaheadMatch} from "ngx-bootstrap";
import {SongService} from "../songs.component/song.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    mobile_search_visible: boolean = false;

    public typeheadModel: string;
    public typeaheadLoading: boolean;
    public typeaheadNoResults: boolean;
    public dataSource: Observable<any>;

    constructor(private appService: AppService,
                private songService: SongService,
                private router: Router,) {
        this.dataSource = Observable.create((observer: any) => {
            // Runs on every search
            this.songService.searchSongs(this.typeheadModel).subscribe((result: any) => {
                observer.next(result.data);
            });
        });
    }

    ngOnInit() {
        // Mobile Search
        this.appService.mobile_search_visible$.subscribe(res => {
            this.mobile_search_visible = res;
        });
    }

    mobileSearch(visible: boolean) {
        this.mobile_search_visible = visible;
        this.appService.setMobileSearchVisible(visible);
    }

    public changeTypeaheadLoading(e: boolean): void {
        this.typeaheadLoading = e;
    }

    public changeTypeaheadNoResults(e: boolean): void {
        this.typeaheadNoResults = e;
    }

    public typeaheadOnSelect(e: TypeaheadMatch): void {
        let url = '/songs/' + e.item.id;
        this.router.navigate([url]);
        //console.log('Selected value: ', e);
    }


    ngOnDestroy() {

    }

}
