import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { HomeModule } from './home.module';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    title = 'app';
    constructor(private appService: AppService) {

    }
    ngOnInit(): void {
    }
}
