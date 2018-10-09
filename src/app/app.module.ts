import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgExtrasModule } from 'projects/ng-extras/src/public_api';
import { AppComponent } from './app.component';
import { XtForComponent } from './xt-for/xt-for.component';

@NgModule({
   declarations : [
      AppComponent,
      XtForComponent
   ],
   imports      : [
      BrowserModule,
      NgExtrasModule
   ],
   providers    : [],
   bootstrap    : [AppComponent]
})
export class AppModule {
}
