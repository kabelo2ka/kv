import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AuthModule} from "./auth/auth.module";

import {routing} from "./app.routing";
import {JwtHelper} from "angular2-jwt";
// import {AlertModule, ModalModule, TabsModule} from 'ng2-bootstrap';
import {
    AccordionModule,
    AlertModule,
    BsDropdownModule,
    ModalModule,
    TabsModule,
    TooltipModule,
    TypeaheadModule
} from "ngx-bootstrap";
import {SlimScrollModule} from "ng2-slimscroll";
import {BusyModule} from "angular2-busy";
import {NgUploaderModule} from "ngx-uploader";

import {AppComponent} from "./app.component";
import {AppService} from "./app.service";
import {UserService} from "./user.component/user.service";
import {UserProfileComponent} from "./user.component/user-profile.component";
import {SettingsComponent} from "./settings.component/settings.component";
import {AuthService} from "./auth/authService";
import {HeaderComponent} from "./header/header.component";
import {LeftSidebarComponent} from "./sidebar.left/sidebar.left.component";
import {RightSidebarComponent} from "./sidebar.right/sidebar.right.component";
import {FooterComponent} from "./footer/footer.component";
import {HomeComponent} from "./home/home.component";
import {UsersComponent} from "./users.component";
import {SongsComponent} from "./songs.component/songs.component";
import {SongCreateComponent} from "./song.create.component/song.create.component";
import {AudioComponent} from "./audio/audio.component";
import {AudioVisualizationComponent} from "./audio-visualization.component/audio-visualization.component";
import {AudioService} from "./audio/audio.service";
import {FileUploadComponent} from "./file-upload.component";
import {ArtistService} from "./artists.component/artist.service";
import {ArtistsComponent} from "./artists.component/artists.component";
import {GenresComponent} from "./genres/genres.component";
import {AlbumsComponent} from "./albums/albums.component";
import {AlbumService} from "./albums/album.service.component";
import {ArtistShowComponent} from "./artist-show/artist-show.component";
import {AlbumShowComponent} from "./album-show/album-show.component";
import {SignupComponent} from "./signup/signup.component";
import {SigninComponent} from "./signin/signin.component";
import {SongEditComponent} from "./song-edit/song-edit.component";
import {SongService} from "./songs.component/song.service";
import {AudioAPIWrapper} from "./audio/audio-api-wrapper";
import {TestsComponent} from "./tests/tests.component";
import {SongComponent} from "./song/song.component";
import {CommentsComponent} from "./comments/comments.component";
import {SocketService} from "./socket.service";
import {AuthGuard} from "./auth-guard.service";


@NgModule({
    declarations: [
        AppComponent,
        UserProfileComponent,
        SettingsComponent,
        HeaderComponent,
        LeftSidebarComponent,
        RightSidebarComponent,
        FooterComponent,
        AudioComponent,
        AudioVisualizationComponent,
        HomeComponent,
        SongsComponent,
        SongCreateComponent,
        UsersComponent,
        FileUploadComponent,
        ArtistsComponent,
        GenresComponent,
        AlbumsComponent,
        ArtistShowComponent,
        AlbumShowComponent,
        SignupComponent,
        SigninComponent,
        SongEditComponent,
        TestsComponent,
        SongComponent,
        CommentsComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BusyModule/*.forRoot(
         new BusyConfig({
         //message: 'Don\'t panic!',
         backdrop: true,
         //template: '<div>{{message}}</div>',
         delay: 0,
         minDuration: 0,
         wrapperClass: 'my-class'
         })
         )*/,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TypeaheadModule.forRoot(),
        BsDropdownModule.forRoot(),
        AccordionModule.forRoot(),
        TooltipModule.forRoot(),
        ReactiveFormsModule,
        SlimScrollModule,
        NgUploaderModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        AuthModule,
    ],
    providers: [
        AppService,
        AuthGuard,
        SocketService,
        UserService,
        AuthService,
        JwtHelper,
        AudioService,
        AudioAPIWrapper,
        SongService,
        AlbumService,
        ArtistService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
