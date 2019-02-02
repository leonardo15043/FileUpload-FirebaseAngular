import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FileItemsModule } from '../models/file-items.module';


@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor(
    private db: AngularFirestore
    ) { }

    cargarImagenesFirebase( imagenes: FileItemsModule[] ) {

       const storageRef = firebase.storage().ref();

       for ( const item of imagenes) {

        item.estaSubiendo = true;
        if ( item.progreso >= 100 ) {
            continue;
        }

        const referenciaImagen = storageRef.child( `${ this.CARPETA_IMAGENES }/${ item.nombreArchivo }` );
        const uploadTask: firebase.storage.UploadTask = referenciaImagen.put( item.archivo );

        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED ,
              ( snapshot: firebase.storage.UploadTaskSnapshot ) =>
                           item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100 ,
              ( error ) => console.error('Error al subir', error),
              () => {
                referenciaImagen.getDownloadURL().then(
                    ( urlImagen ) => {
                        console.log('Imagen cargada correctamente');
                        item.url = urlImagen;
                        item.estaSubiendo = false;
                        this.guardarImagen({
                            nombre: item.nombreArchivo,
                            url: item.url
                        });
                    },
                    ( error ) => console.log('No existe la URL')
                );
            });

       }
    }

    private guardarImagen( imagen: { nombre: string , url: any } ) {
      this.db.collection(`/${ this.CARPETA_IMAGENES }`)
          .add( imagen );
    }

}
