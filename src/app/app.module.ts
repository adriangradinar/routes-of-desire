import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { MissingComponent } from './missing/missing.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiService } from './api.service';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTableModule, MatIconModule, MatToolbarModule, MatButtonModule} from '@angular/material';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MissingComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    LeafletModule.forRoot(),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox_access_token
    })
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
