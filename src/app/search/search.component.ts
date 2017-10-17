import {Component, OnDestroy, OnInit, ViewChild, ElementRef} from "@angular/core";
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
    @ViewChild('searchInput') searchInputEl: ElementRef;
    mobile_search_visible = false;

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
        this.appService.mobile_search_visible$.subscribe((res:boolean) => {
            this.mobile_search_visible = res;
            if(res) {
                this.focusInput();
            }
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
        const url = '/songs/' + e.item.slug;
        this.router.navigate([url]);
        this.mobileSearch(false);
        // console.log('Selected value: ', e);
    }

    // @todo: Fix this - Must auto focus when the user clicks the search button
    focusInput() {
        this.searchInputEl.nativeElement.focus();
    }


    ngOnDestroy() {

    }

}
