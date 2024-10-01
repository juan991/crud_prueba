import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './dynamic-page.component.html',
  styles: [
  ]
})
export class DynamicPageComponent {

  public myForm: FormGroup = this.fb.group({
    name: [ '', [ Validators.required, Validators.minLength(3) ] ],
    favouriteGames: this.fb.array([
      ['Metal Gear', Validators.required],
      ['Death Stranding', Validators.required],
    ])
  }); 

  constructor( private fb: FormBuilder ) {}

  // getter del arreglo resultante del controlador "favouriteGames"
  get favouriteGames() {
    return this.myForm.get('favouriteGames') as FormArray;
  }

  onSubmit(): void {

    if( this.myForm.invalid ) {
      this.myForm.markAllAsTouched(); // Al quedar todos los campos como tocados, aparecen los errores
      return;
    }
  }

}
