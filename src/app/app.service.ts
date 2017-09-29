import {Injectable} from "@angular/core";

import {Subject}    from 'rxjs/Subject';
import {UserPreferencesService} from "./UserPreferences/user-preferences.service";


@Injectable()
export class AppService {

    // Observable string sources
    private left_mobile_menu_visible = new Subject<boolean>();
    private mobile_search_visible = new Subject<boolean>();
    private right_panel_visible = new Subject<boolean>();
    private sign_in_modal = new Subject<boolean>();
    private sign_up_modal = new Subject<boolean>();
    private share_modal = new Subject<boolean>();

    // Observable string streams
    left_mobile_menu_visible$ = this.left_mobile_menu_visible.asObservable();
    mobile_search_visible$ = this.mobile_search_visible.asObservable();
    right_panel_visible$ = this.right_panel_visible.asObservable();
    sign_in_modal$ = this.sign_in_modal.asObservable();
    sign_up_modal$ = this.sign_up_modal.asObservable();
    share_modal$ = this.share_modal.asObservable();


    setLeftMobileMenuVisible(visible: boolean) {
        this.left_mobile_menu_visible.next(visible);
    }
    setMobileSearchVisible(visible: boolean) {
        this.mobile_search_visible.next(visible);
    }

    // Service message commands
    setRightPanelVisible(visible: boolean) {
        this.right_panel_visible.next(visible);
    }

    showSignInModal(visible: boolean) {
        this.sign_in_modal.next(visible);
    }

    showSignUpModal(visible: boolean) {
        this.sign_up_modal.next(visible);
    }

    showShareModal(visible: boolean) {
        this.share_modal.next(visible);
    }

}