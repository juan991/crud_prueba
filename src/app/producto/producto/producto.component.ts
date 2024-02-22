import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

import { ProductosService } from '../services/productos.service';
import { Producto } from '../interfaces/producto.interface';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styles: [
  ]
})
export class ProductoComponent implements OnInit {

  // Bandera para el titulo y botones
  public actualizar: boolean = false;
  
  // public producto?: Producto;  // El signo "?" es porque al principio esta variable no tiene valor (opcional)

  // Formulario de Producto
  public productoForm = new FormGroup({
    // id      : new FormControl(''),
    nombre  : new FormControl<string>(''),
    cantidad: new FormControl<number>(0),
    precio  : new FormControl<number>(0),
  });

  constructor(
    private productosService: ProductosService,
    private activatedRoute  : ActivatedRoute,  // Para obtener los parametros del routerLink
    private router          : Router,  // Para redireccionar en caso de error
  ) {}

  // Getter para parsear los valores del formulario al tipo definido en la interface (en este caso tipo "Producto")
  // Esto es necesario porque al definir el formulario no puedo darle la forma de la interface
  get currentProducto(): Producto {
    const product = this.productoForm.value as Producto;  // El "as" parsea el objeto 
    return product;
  } 

  ngOnInit(): void {
    
    // Validamos que el id (el indice en este caso) sea -1
    // Tambíen se valida por el url edit/new. TODO: chequear como funciona (componentes, rutas, etc) 
    if (this.router.url.includes("nuevo")) return;

    // Si llegamos acá, es porque vamos a actualizar un registro, entonces modificamos la bandera
    this.actualizar = true;

    this.activatedRoute.params
      .pipe(
        // Para poder visulizar un loading podemos usar delay(), de rxjs
        // delay(3000), -3 segundos de demora-
        // Desestructura el id que llega del objeto params
        switchMap( ({ id }) => this.productosService.getProductoById(id)),
      )
      .subscribe( producto => {
        // Si llega null, redireccionamos a la página anterior
        if (!producto) return this.router.navigate(['/productos/listar']);
        
        // Si todo sale bien asignamos la response al objeto del formulario
        this.productoForm.reset(producto); 
        console.log(producto);

        return; // Si no colocamos el return explota :v 
      });
  }

  // Método para enviar el formulario al backend 
  // (los datos los tiene el objeto formulario, por eso no pedimos nada por parámetro)
  onSubmit():void {
    console.log({
      formIsValid: this.productoForm.valid,  // Hacemos referencia al objeto del formulario 
      value: this.productoForm.value
    });

    // 1er paso: Validamos que el formulario sea válido
    if (this.productoForm.invalid) return;  // Si es inválido frenamos la ejecucion del método 
    
    // Llamados a los métodos de los servicios, según corresponda
    if (this.actualizar) {
      let productoActualizado = this.currentProducto
      this.productosService.updateProducto(productoActualizado)
        .subscribe( resp => {
          // Mensaje de aviso
          this.mostrarMensaje('producto actualizado correctamente');
          // Redirección
          this.router.navigate(['/productos/listar']); 
        });
      
      return;
    }

    if (!this.actualizar) {
      let productoNuevo = this.currentProducto
      this.productosService.updateProducto(productoNuevo)
        .subscribe( resp => {
          // Mensaje de aviso
          this.mostrarMensaje('producto agregado correctamente');
          // Redirección
          this.router.navigate(['/productos/listar']); 
        });
      
      return;
    }
  }  

  // Mostrar mensaje con SweetAlert o Snackbar
  mostrarMensaje( mensaje: string ):void {
    // TODO: implementar Sweetalert
    console.log('paso por mostrarMensaje(), mensaje', mensaje);
    
  }

}
