import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { ViewportComponent } from './body/viewport/viewport.component';
import { NotificationService } from './notification-service/notification-service';
import { SceneGraphService } from './scene-graph-service/scene-graph-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycapsComponent } from './body/viewport/keycaps/keycaps.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    ViewportComponent,
    KeycapsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    NotificationService,
    SceneGraphService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
