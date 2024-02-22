import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../interfaces/producto.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: [
  ]
})
export class ProductosComponent implements OnInit {

  public productos: Producto[] = [
    {nombre: 'manzana', cantidad: 1000, precio: 50000},
    {nombre: 'kiwy',    cantidad: 550,  precio: 73000},
    {nombre: 'limon',   cantidad: 4450, precio: 62000},
  ];

  constructor( 
    private productosService: ProductosService,
    private router: Router,
    ) {}

  ngOnInit(): void {

    // this.obtenerProductos();
  }

  obtenerProductos() {
    this.productosService.getProductos()
      .subscribe( ( productos ) => {
        this.productos = productos;
      });
  }

  eliminarProducto( id:string ) {
    this.productosService.deleteProducto(id)
      .subscribe( resp => {
        // TODO: mostrar mensaje de que se elimino
        console.log('Producto borrado', resp);
        // Refrescamos pantalla redireccionando a la misma página
        this.router.navigate(['/productos/listar']);        
      });
  }
}
