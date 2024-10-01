import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { loadMercadoPago } from '@mercadopago/sdk-js';
// const mp = new MercadoPago("YOUR_PUBLIC_KEY");
// TODO: chequear si debo colocar que algunas propiedades son opcionales

interface evento {
  empresa_productora: string;
  direccion:          string;
  titulo:             string;
  descripcion:        string;
  fecha_realizacion:  string;
  entradas_totales:   number;
  tipo_entrada:       tipoEntrada[];
};
interface tipoEntrada {
  descripcion: string;
  precio: number;
  stock: number;
  cantidadSeleccionadas: number;  // si funciona, quito esta propiedad
};

interface carritoEntrada {
  descripcion: string;
  precio: number;
  stock: number;
  cantidadSeleccionadas: number;
  costoParcial: number;
};

interface venta {
  importe: number;
  descripcion: string;
  fecha_venta: string;
  evento: string;
  entradas: entrada[];
};
interface entrada {
  precio: number;  // Creo que aca deberia ir una relacion de tipo de entrada o dejar el precio y agregar la descripcion
  usuario_comprador: string;
  nombre_propietario: string;
  dni_propietario: string;
  habilitada: boolean;
  enReventa: boolean;
  revendida: boolean;
};

@Component({
  templateUrl: './switches-page.component.html',
  styles: [
  ]
})
export class SwitchesPageComponent {
  // implements OnInit
  // Esta clase se va a encargar de las ventas de entradas
  // Necesitamos saber a que evento corresponde

  public evento: evento; // pantalla evento seleccionado

  public entradas: tipoEntrada[] = [];  // pantalla evento seleccionado/pantalla de seleccion de cantidad de entradas
  
  public calculoEntradas: any[] = [];  // pantalla evento seleccionado/pantalla de seleccion de cantidad de entradas

  public cardForm: any;
  public mp: any;

  // Objeto formulario de cantidad de entradas, quizas deba ser un FormArray
  public formularioEntradas: FormGroup = this.fb.group({
    cantidad     : [ '', [ Validators.required, Validators.minLength(3) ] ],  // 3 parámetros: valor por defecto, validaciones síncronas, validaciones asíncronas
    price    : [ 0, [ Validators.required, Validators.min(0) ] ],
    inStorage: [ 0, [Validators.required, Validators.min(0)] ],
  });

  constructor( private fb: FormBuilder ) {

    // Traer el evento por id desde el servicio "EventosService" 
    this.evento = {
      empresa_productora:'',
      direccion:'',
      titulo:'',
      descripcion:'',
      fecha_realizacion:'',
      entradas_totales: 10000,
      tipo_entrada: [
        {
          descripcion:'general',
          precio: 50,
          stock: 5000,  // si esta propiedad esta en 0, debo usar un ngIf para que no se muestre la opcion o diga que ya no hay existencias
          cantidadSeleccionadas: 0, // -1,
        },
        {
          descripcion:'vip',
          precio: 100,
          stock: 5000, 
          cantidadSeleccionadas: 0,
        },
      ],
    };

    // pantalla evento seleccionado/pantalla de seleccion de cantidad de entradas
    this.entradas = [ ... this.evento.tipo_entrada ]; // al ser una lista no se si esta bien romper la referencia asi
    
    // Le asignamos los valores
    this.calculoEntradas = [... this.entradas];
    console.log(this.entradas);
    console.log(this.calculoEntradas);
    this.agregarPropiedad();
    
    // public key: TEST-21b3740e-12fe-4b3c-b63f-d2ec8a3eb8d6
    // access token: TEST-7689123035898490-092519-a60132b772c8f3a3048a63a56fc4e1ca-1127095496
    // tarjetas de prueba: 
    // numero: 5031 7557 3453 0604
    // codigo de seguridad: 123
    // fecha de caducidad 11/25
    // Para hacer la pruebas debo cerrar sesion en mercadopago
    /* loadMercadoPago().then(() => {
      // Configura el formulario de tarjeta
      this.cardForm = new CardForm({
        amount: 100.0, // Monto a pagar
        // Otras configuraciones opcionales
      });

      // Monta el formulario en el contenedor
      this.cardForm.mount('#card-container');
    }); */

  }

  /* async ngOnInit(): Promise<void> {
    await loadMercadoPago();
    if (window.mp) {
      this.mp = new window.mp("YOUR_PUBLIC_KEY", {
        locale: "en-US",
      });
    }
  } */

  agregarPropiedad() {
    // Agregamos las propiedades del tipo "carritoEntrada"
    this.calculoEntradas.map(entrada => {
      entrada.cantidadSeleccionadas = 0;
      entrada.costoParcial = 0;
    })
  }

  // Control de mensajes de error, este metodo se invoca en el *ngIf de las etiquetas de error
  /* noEsCampoValido( campo: any ): boolean | null {
    // Condición: el campo presenta errores y ademas fue "tocado"
    return this.formularioEntradas.controls[ campo ].errors && 
      this.formularioEntradas.controls[campo].touched;
  } */

  // Control del mensaje de error (que corresponda segun el caso)
  getCampoError( campo: string ): string | null {
    
    // Si no existe el campo
    if (!this.formularioEntradas.controls[campo] ) return null;

    const errors = this.formularioEntradas.controls[campo].errors || {};

    // El bucle devuelve un arreglo con todas las llaves del objeto errors
    for ( const key of Object.keys(errors) ) {
      switch( key ){
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo ${ errors['minlength'].requiredLength } caracteres`;
      }
    }
    return null;
  }

  // Este metodo hace de "submit"
  guardarCambios() {
    if ( this.formularioEntradas.invalid ) return;
    
    console.log(this.formularioEntradas.value);
  }
  // Pantalla anterior: Muestra el evento en cuestión y cuando hacemos click en "Comprar entradas"
  // nos redirecciona a esta pantalla, donde podemos elegir por cada tipo de entradas, la cantidad a comprar 
  
  // 1) Necesito un input de tipo number por cada tipo de entrada disponible (si no hay existencias de stock, no aparece) 
  // Con esto elegimos la cantidad de entradas.
  
  // 2) Cuando confirmamos la intencion de compra, se envia una solicitud al back para que valide las existencias de stock y
  // en caso de haber entradas disponibles, las descuente temporalmente del stock correspondiente para "reservarlas"  
  // hasta que ocurra alguno de estos 2 posibles eventos: 
  //      a) Se confirman la venta y el pago
  //      b) Se cancela la compra (en este caso el stock vuelve a sumar las entradas que se encontraban temporalmente reservadas)
  //      Nota: Se puede cancelar de 2 formas: el usuario cancela manualmente la compra o se pasa el tiempo preestablecido 
  //            para mantener la reserva temporal de las entradas (10 minutos aprox ???)


  // Este método reemplaza al formulario "formularioEntradas" (que es el cuenta la cantidad de entradas solicitadas)
  public sumatoriaEntradas: any[] = [];

  calcularEntradas(indice: number, suma: boolean = true) {  // , entrada: any
    if ( this.cantidadEntradasTotalesSeleccionadas > 9  && suma ) {
      console.log("superaste el limite de entradas: ", this.cantidadEntradasTotalesSeleccionadas);
      return; // No esta bien puesto
    }
    if (this.calculoEntradas[indice]) {
      
      // Si no tiene valor, lo seteamos en 0
      if( this.calculoEntradas[indice].cantidadSeleccionadas == -1 ) {  // Esto esta mal

        this.calculoEntradas[indice].cantidadSeleccionadas = 0;
        
      } else {
        // Si el parámetro "suma" es true, sumamos
        if( suma ) {
    
          this.calculoEntradas[indice].cantidadSeleccionadas += 1;
          this.calcularCostoParcial(indice);
        } else { // Como es false, restamos 
    
          if( this.calculoEntradas[indice].cantidadSeleccionadas == 0 ) {  // validamos que no este en 0 porque no admitimos número negativos
            this.calcularCostoParcial(indice);
            return;
          }
          this.calculoEntradas[indice].cantidadSeleccionadas -= 1;
          this.calcularCostoParcial(indice);
        }
      }
    } else {
      return;
    }
  }


  // Hacer un contador que lleve el total de entradas (sin discriminar) para asi validar el maximo
  calcularCostoParcial( indice: number ) {  // Por tipo de entrada
    this.calculoEntradas[indice].costoParcial =  this.calculoEntradas[indice].cantidadSeleccionadas * this.calculoEntradas[indice].precio
    console.log("calculo del costo: ", this.calculoEntradas);
    this.calcularCostoTotal();
  }

  public costoTotal: number = 0;
  public cantidadEntradasTotalesSeleccionadas: number = 0;

  calcularCostoTotal() {  // suma: boolean Por todas las entradas
    /* if (suma) {
      this.calculoEntradas.map( entrada => {
        entrada.costoParcial += this.costoTotal;
      });
    } else {
      this.calculoEntradas.map( entrada => {
        entrada.costoParcial -= this.costoTotal;
      });
    } */
    let entradas = [... this.calculoEntradas];
    let costo = 0;
    let cantidadTotalDeEntradas = 0; // Para no superar un limite establecido previamente 
    entradas.map( entrada => {
      costo += entrada.costoParcial;
      cantidadTotalDeEntradas += entrada.cantidadSeleccionadas;
    });
    this.costoTotal = costo;
    this.cantidadEntradasTotalesSeleccionadas = cantidadTotalDeEntradas;
  }

  confirmarSeleccion() {
    // Crear el arreglo de entradas como lo necesita el DTO para chequear existencias y "reservarlas" temporalmente
    // Deberia redirigir al componente de "Pagos" (donde se implementa la integración de MercadoPago)
  }

}
