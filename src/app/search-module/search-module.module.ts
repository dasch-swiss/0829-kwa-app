import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRootComponent } from './search-root/search-root.component';
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {MatSelectModule} from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {GravsearchServiceService} from "../services/gravsearch-service.service";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const modules = [
    MatSelectModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
];

@NgModule({
  declarations: [ SearchRootComponent ],
    imports: [
        [
            CommonModule,
            RouterModule.forChild([
                {path: '', component: SearchRootComponent}
            ])
        ].concat(modules),
        MatDividerModule
    ],
    exports: [
        ...modules
    ],
    providers: [
        GravsearchServiceService
    ]
})
export class SearchModuleModule { }
