import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[] = [];

  constructor(private storage: Storage,
              private navController: NavController,
              private inAppBrowser: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) {
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

    console.log(nuevoRegistro);

    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro(registro: Registro) {
    this.navController.navigateForward('/tabs/tab2');

    switch(registro.type) {
      case 'http':
        this.inAppBrowser.create(registro.text, '_system');
        break;
      case 'geo':
        this.navController.navigateForward(`/tabs/tab2/mapa/${ registro.text}`);
        break;
    }
  }

  enviarCorreo() {

    const arregloTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arregloTemp.push( titulos);
    this.registros.forEach( registro => {
      const linea = `${registro.type}, ${registro.format}, ${registro.create}, ${registro.text.replace(',',' ')}\n`;

      arregloTemp.push(linea);
    });

    this.crearArchivoFisico(arregloTemp.join(''));

  }

  crearArchivoFisico(text: string) {
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
    .then( existe => {
      console.log('Existe archivo?' , existe);
      return this.escribirArchivo( text);
    })
    .catch(err => this.file.createFile( this.file.dataDirectory, 'registros.csv', false)
        .then(creado => this.escribirArchivo( text ))
        .catch(err2 => console.log('NO se pudo crear el archivo', err2 )));
  }

  async escribirArchivo(texto: string) {
    await this.file.writeExistingFile(this.file.dataDirectory,'registro.csv', texto);

    const archivo = `${this.file.dataDirectory}registros.csv`;

    const email = {
      to: '',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de Scans',
      body: 'Aquí tienes los backup de sus escaneos de App -> <strong>QRscanner</strong> ',
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
