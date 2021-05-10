import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GmapComponent } from './view/gmap/gmap.component';

@NgModule({
  declarations: [
    AppComponent,
    GmapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyDPwMsQS3LMhE2sX5fIKp4yMBWbBQh7x8Q', //1
      // apiKey:'AIzaSyCmkGT-2rPU9nfIRajokaiYXPm7SIMk11A', //ref1
      apiKey:'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI', //ref2
      libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
