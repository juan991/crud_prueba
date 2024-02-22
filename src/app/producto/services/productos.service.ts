import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  // Inyectamos el HttpClient para poder usar los metodos http
  constructor( private http: HttpClient ) { }

  // la funcion retorna un observable que emite un arreglo de tipo "Producto"
  getProductos():Observable<Producto[]> {  

    // El método get() regresa el arreglo de tipo "Producto"
    return this.http.get<Producto[]>(`http://url/endpoint`);

  }

  getProductoById( id: string ):Observable<Producto|undefined> {
    return this.http.get<Producto>(`http://url/endpoint/${ id }`)
      // Manejo de errores (la url o el id no existe o el servidor está caído)
      .pipe(
        // capturamos el error y el metodo of() lo transforma en un Observable que emite un valor undefined
        catchError( error => of(undefined) )
      );
  }

  // Al agregar un nuevo producto, la response será el nuevo producto
  addProducto( producto: Producto ): Observable<Producto> {
    return this.http.post<Producto>(`http://url/endpoint`, producto)
  }

  // Con patch actualizamos solo las propiedades que enviamos (no pisamos todo el registro en la BBDD)
  updateProducto( producto: Producto ): Observable<Producto> {
    // Validamos que exista el id
    if(!producto.nombre) throw Error('el id del producto es requerido')
    return this.http.patch<Producto>(`http://url/endpoint/${ producto.nombre }`, producto)
  }

  deleteProducto( id: string ): Observable<boolean> {
    return this.http.delete(`http://url/endpoint/${ id }`)
      .pipe(
        catchError( err => of( false ) ),  // Si algo sale mal emitimos un false
        map( response => true )  // Si la response es status 200, emitimos un true (pisamos la respuesta) 
      )

  }

}
