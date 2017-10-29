import { RegisterComponent } from './register/register.component';
import { StartComponent } from '../app/start/start.component';
import { LangComponent as clsLangComponent } from '../core/lang.component';
import { StatusComponent } from './status/status.component';
import { FinishComponent } from './finish/finish.component';
import { NewsComponent } from './news/news.component';

export const LangComponent = clsLangComponent;

export const appRouters = [
    { path: 'prc/start', component: StartComponent },
    { path: 'prc/register', component: RegisterComponent },
    { path: 'prc/status', component: StatusComponent },
    { path: 'prc/finish', component: FinishComponent },
    { path: 'prc/news', component: NewsComponent }
];

export const appDeclaretions = [
    StartComponent,
    RegisterComponent,
    StatusComponent,
    FinishComponent,
    NewsComponent
];
