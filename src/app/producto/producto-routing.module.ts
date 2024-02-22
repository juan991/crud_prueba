import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoComponent } from './producto/producto.component';
import { ProductosComponent } from './productos/productos.component';

const routes: Routes = [
  {
    path: '',  // productos/...
    children: [
      // Mostrar/Eliminar
      {path: 'listar', component: ProductosComponent},
      // Agregar/Editar
      {path: 'nuevo', component: ProductoComponent},
      {path: 'editar/:id', component: ProductoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
