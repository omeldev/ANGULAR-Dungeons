import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {AppComponent} from "./app/app.component";

platformBrowserDynamic().bootstrapModule(AppModule).then(r => console.log(r));
