import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidMenuComponent } from './components/sid-menu/sid-menu.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SidMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,  // Necesario para que funcione el [routerLink]
  ],
  exports: [
    SidMenuComponent  // Exportar obligatoriamente
  ]
})
export class SharedModule { }
