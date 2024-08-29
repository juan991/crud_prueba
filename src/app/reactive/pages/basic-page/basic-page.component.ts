import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const rtx5090 = {
  name: 'RTX 5090',
  price: 5000,
  inStorage: 200,
};

@Component({
  templateUrl: './basic-page.component.html',
  styles: [
  ]
})
export class BasicPageComponent implements OnInit {

  // Objeto formulario
  public myForm: FormGroup = this.fb.group({
    name     : [ '', [ Validators.required, Validators.minLength(3) ] ],  // 3 parámetros: valor por defecto, validaciones síncronas, validaciones asíncronas
    price    : [ 0, [ Validators.required, Validators.min(0) ] ],
    inStorage: [ 0, [Validators.required, Validators.min(0)] ],
  }); 
  
  constructor( private fb: FormBuilder ) {}

  ngOnInit(): void {
    // aL cargar el componente, carga los valores establecidos en la constante rtx5090
    this.myForm.reset( rtx5090 );
  }

  // Control de mensajes de error, este metodo se invoca en el *ngIf de las etiquetas de error
  noEsCampoValido( campo: any ): boolean | null {
    // Condición: el campo presenta errores y ademas fue "tocado"
    return this.myForm.controls[ campo ].errors && 
      this.myForm.controls[campo].touched;
  }

  // Control del mensaje de error (que corresponda segun el caso)
  getCampoError( campo: string ): string | null {
    
    // Si no existe el campo
    if (!this.myForm.controls[campo] ) return null;

    const errors = this.myForm.controls[campo].errors || {};

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

  // Metodo que realiza en submit
  onSave() {
    
    if ( this.myForm.invalid ) return;
    
    console.log(this.myForm.value);
    
    // Reestablecer valores del formulario (despúes de un submit)
    this.myForm.reset({
      price: 2500,
      inStorage: 6,
    });

  }
}
