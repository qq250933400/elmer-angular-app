import { HomeComponent } from '../app/home/home.component';
import { LoginComponent } from '../app/login/login.component';
export const AppDeclarations = [
    HomeComponent,
    LoginComponent
];

export default [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent }
];
