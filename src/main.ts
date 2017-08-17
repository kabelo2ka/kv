import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

import {AppModule} from "./app/app.module";
import {environment} from "./environments/environment";

import "angular2-notifications";

if (environment.production) {
  enableProdMode();
}

//noinspection TypeScriptValidateTypes
platformBrowserDynamic().bootstrapModule(AppModule);
