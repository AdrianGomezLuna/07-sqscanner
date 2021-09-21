import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[] = [];

  constructor() { }

  guardarRegistro( format: string, text: string) {

    const nuevoRegistro = new Registro(format,text);
    this.registros.unshift(nuevoRegistro);
  }
}
