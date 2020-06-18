import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRootComponent } from './search-root/search-root.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [SearchRootComponent],
  imports: [
      CommonModule,
      RouterModule.forChild([
          { path: '', component: SearchRootComponent }
      ])
  ]
})
export class SearchModuleModule { }
