import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { MainComponent } from './component/main/main.component';
import { SoutComponent } from './component/side-nav/side-nav/sout/sout.component';
import { ShirtsComponent } from './component/side-nav/side-nav/shirts/shirts.component';
import { GauniComponent } from './component/side-nav/side-nav/gauni/gauni.component';
import { TrousersComponent } from './component/side-nav/side-nav/trousers/trousers.component';
import { LoginComponent } from './component/login/login.component';
import { BodyMeasurementsComponent } from './component/body-measurement/body-measurement.component';



export const routes: Routes = [
  //  { path: '', component:CalenderComponent},
  //  {path: 'work', component:WorkComponent }

  { path: '', component: HomeComponent },
  { component: RegisterComponent, path: 'register' },
  { component: LoginComponent, path: 'login' },
  { path: 'main', component: MainComponent },
  { path: 'sout', component: SoutComponent },
  { path: 'shirts', component: ShirtsComponent },
  { path: 'gauni', component: GauniComponent },
  { path: 'trousers', component: TrousersComponent },
  { path: 'body-measurements', component: BodyMeasurementsComponent },


];
