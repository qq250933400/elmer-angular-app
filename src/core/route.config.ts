import { Routes } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { LoginComponent } from '../app/login/login.component';
import { AppComponents, AppModules } from '../app/components/index';
import { ErrorComponent } from '../app/error/error.component';
import { appRouters, appDeclaretions } from '../app/index';
import { RegisterModule } from '../app/register/register.module';
export const ComponentDeclarations = [
    HomeComponent,
    LoginComponent,
    ErrorComponent,
    ...appDeclaretions,
    ...AppComponents
];

export const ModuleImports = [
    // AppModules
    RegisterModule
];

export const ConfigRouters: Routes = [
    { path: '', redirectTo: '/prc/start', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    ...appRouters,
    { path: '**', component: ErrorComponent }
];

