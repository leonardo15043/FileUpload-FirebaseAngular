import { Component, OnInit } from '@angular/core';
import { CargaImagenesService } from '../../services/carga-imagenes.service';
import { FileItemsModule } from '../../models/file-items.module';


@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent implements OnInit {

  archivos: FileItemsModule[] = [];
  estaSobreElemento = false;

  constructor(
    public _cargaImagenes: CargaImagenesService
  ) {
    console.log( this.archivos );

  }

  ngOnInit() {

  }

  cargarImagenes() {
    this._cargaImagenes.cargarImagenesFirebase( this.archivos );
  }

  limpiarArchivos() {
    this.archivos = [];
  }

}
