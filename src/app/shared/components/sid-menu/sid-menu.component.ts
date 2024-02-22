import { Component } from '@angular/core';

interface Menu {
  title: string;
  route: string;
}

@Component({
  selector: 'shared-sid-menu',
  templateUrl: './sid-menu.component.html',
  styles: [
  ]
})
export class SidMenuComponent {

  public reactiveMenu: Menu[] = [
    { title: 'Básicos', route:'./reactive/basic' },
    { title: 'Dinámicos', route:'./reactive/dynamic' },
    { title: 'Switches', route:'./reactive/switches' },
  ];

  public authMenu: Menu[] = [
    { title: 'Registro', route:'./auth/sign-up' },
  ];

  public crudMenu: Menu[] = [
    { title: 'Crud', route:'./productos/listar' },
  ];

}
