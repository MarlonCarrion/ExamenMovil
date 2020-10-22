import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage{

  databaseObj: SQLiteObject;

  cedula_model: string = "";
  nombres_model: string = "";
  apellidos_model: string = "";
  fecha_model: string = "";
  direccion_model: string="";
  telefono_model: string = "";
  correo_model: string = "";
  row_data: any = [];
  readonly database_name: string = "cliente.db";
  readonly table_name: string = "cliente_1";

  image: string = "";

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;
  constructor(private platform: Platform, private sqlite: SQLite,private camera: Camera) { 
    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    });
  }
  //Create the database 
  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        alert('Base de datos creada!!');
      })
      .catch(e => {
        alert("error" + JSON.stringify(e))
      });
  }
  // Create table empleados
  createTable() {
    this.databaseObj.executeSql(`
  CREATE TABLE IF NOT EXISTS ${this.table_name}  (cedula varchar(255) PRIMARY KEY, nombres varchar(255), apellidos varchar(255), 
  direccion varchar(255), telefono varchar(255), correo varchar(255), fecha varchar(255), imagen varchar)
  `, [])
      .then(() => {
        alert('Tabla creada');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }
  //Insertar usuario en la tabla usuario
  insertUser() {
    // Value should not be empty
    // Miss implement order to other inputs
    if (!this.cedula_model.length) {
      alert("Enter CI");
      return;
    }

    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_name} (cedula, nombres, apellidos, direccion, telefono, correo, fecha, imagen) VALUES ('${this.cedula_model}' , 
      '${this.nombres_model}', '${this.apellidos_model}', '${this.direccion_model}', '${this.telefono_model}', '${this.correo_model}', 
      '${this.fecha_model}', '${this.image}')
    `, [])
      .then(() => {
        alert('Cliente Creado!');
        this.getUsuario();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }
  getUsuario() {
    this.databaseObj.executeSql(`SELECT * FROM ${this.table_name}`, [])
      .then((res) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }
  deleteRow(item) {
    this.databaseObj.executeSql(`
      DELETE FROM ${this.table_name} WHERE cedula = '${item.cedula}'
    `
      , [])
      .then((res) => {
        alert("Row Deleted!");
        this.getUsuario();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }
  enableUpdate(item) {
    this.updateActive = true;
    this.to_update_item = item;

    this.cedula_model = item.cedula;
    this.nombres_model = item.nombres;
    this.apellidos_model = item.apellidos;
    this.direccion_model = item.direccion;
    this.telefono_model = item.telefono;
    this.correo_model = item.correo;
    this.fecha_model = item.fecha;
    this.image = item.imagen;
  }
  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
    UPDATE ${this.table_name}
    SET nombres = '${this.nombres_model}', apellidos ='${this.apellidos_model}', direccion = '${this.direccion_model}', telefono = '${this.telefono_model}', 
    correo = '${this.correo_model}', fecha = '${this.fecha_model}', imagen = '${this.image}'
    WHERE cedula = '${this.to_update_item.cedula}'`, [])
      .then(() => {
        alert('Row Updated!');
        this.updateActive = false;
        this.getUsuario();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }
  getPicture() {
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options)
      .then(imageData => {
        this.image = `data:image/jpeg;base64,${imageData}`;
             
      })
      .catch(error => {
        console.error(error);
      });
  }

}
