import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[] = [];

  constructor(private storage: Storage) {
    this.init();
    this.storage.get('registros').then(registros => {
      this.registros = registros || [];
    });
  }

  async init() {
    await this.storage.create();
  }

  guardarRegistro( format: string, text: string) {

    const nuevoRegistro = new Registro(format,text);
    this.registros.unshift(nuevoRegistro);
    this.storage.set('registros',this.registros);
  }
}
