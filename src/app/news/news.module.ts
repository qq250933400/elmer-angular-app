import { NgModule } from '@angular/core'
import { NewsService } from './news.service';

@NgModule({
    providers:[
        NewsService
    ]
})
export class NewsModule{
    title: "from module";
}
