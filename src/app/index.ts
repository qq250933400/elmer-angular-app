import { RegisterComponent } from './register/register.component';
import { StartComponent } from '../app/start/start.component';
import { LangComponent as clsLangComponent } from '../core/lang.component';
import { StatusComponent } from './status/status.component';
import { FinishComponent } from './finish/finish.component';
import { NewsComponent } from './news/news.component';
import { DetailComponent } from './detail/detail.component';
import { LoginComponent } from './login/login.component';
//************Services************* */
import { NewsService } from './news/news.service';

export const LangComponent = clsLangComponent;

export const appRouters = [
    { path: 'prc/start', component: StartComponent },
    { path: 'prc/register', component: RegisterComponent },
    { path: 'prc/status', component: StatusComponent },
    { path: 'prc/finish', component: FinishComponent },
    { path: 'prc/news/:type', component: NewsComponent },
    { path: 'prc/news/:type/:search', component: NewsComponent },
    { path: 'prc/news', component: NewsComponent },
    { path: 'prc/detail', component: DetailComponent },
    { path: 'prc/detail/:detailID', component: DetailComponent },
    { path: "prc/login", component: LoginComponent }
];

export const appDeclaretions = [
    StartComponent,
    RegisterComponent,
    StatusComponent,
    FinishComponent,
    NewsComponent,
    DetailComponent
];

export const AppServices = [
    NewsService
];
