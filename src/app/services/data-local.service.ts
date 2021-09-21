import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[] = [];

  constructor(private storage: Storage,
              private navController: NavController,
              private inAppBrowser: InAppBrowser) {
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

    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro(registro: Registro) {
    this.navController.navigateForward('/tabs/tab2');

    switch(registro.type) {
      case 'http':
        this.inAppBrowser.create(registro.text, '_system');
        break;
    }
  }
}
