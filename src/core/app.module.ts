import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule }    from '@angular/http';

import ConfigRouters, { AppDeclarations } from './route.config';
import { AppComponent } from './app.component';

import { AppService } from '../services/app.service';
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot([
            ...ConfigRouters
        ])
    ],
    declarations: [
        AppComponent,
        ...AppDeclarations
    ],
    providers: [
        AppService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

}
