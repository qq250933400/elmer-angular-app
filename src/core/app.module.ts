import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentDeclarations, ConfigRouters, ModuleImports } from './route.config';
import { AppComponent } from './app.component';

import { AppService } from '../services/app.service';
import { AppServices } from '../app/index';
import { PrcClass } from '../interface/index';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpModule,
        ...ModuleImports,
        RouterModule.forRoot(ConfigRouters)
    ],
    declarations: [
        AppComponent,
        ...ComponentDeclarations
    ],
    providers: [
        AppService,
        ...AppServices,
        ...PrcClass,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
    constructor() {
        const local = window.location.hash;
        const sessionStorage = window.sessionStorage;
        const saveLocal = sessionStorage.getItem('local');
        if (/\/en$/.test(local)) {
            sessionStorage.setItem("local", 'en');
        } else if (/\/zh$/.test(local)) {
            sessionStorage.setItem("local", 'zh');
        } else {
            if (saveLocal === undefined || saveLocal === null) {
                sessionStorage.setItem('local', 'zh');
            }
        }
        window.onerror = function(err){
            console.log(err);
            alert(err);
        }
    }
}
