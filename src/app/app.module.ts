import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SearchModuleModule} from "./search-module/search-module.module";
import {MatSelectModule} from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';

const modules = [
    BrowserModule,
    AppRoutingModule,
    SearchModuleModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatFormFieldModule
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
      ...modules
  ],
    exports: [
        ...modules
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
