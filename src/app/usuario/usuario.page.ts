import { Component, OnInit } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage {
  databaseObj: SQLiteObject;

  id_model: string = "";
  nick_model: string = "";
  clave_model: string = "";
  permiso_model: string = "";
  row_data: any = [];
  readonly database_name: string = "supermercado.db";
  readonly table_name: string = "usuarios_1";
  image : string = "";

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;
  constructor(private platform: Platform, private sqlite: SQLite, private camera: Camera) { 
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
  CREATE TABLE IF NOT EXISTS ${this.table_name}  (id varchar(255) PRIMARY KEY, nick varchar(255), clave varchar(255), 
  permiso varchar(255), imagen varchar)
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
    if (!this.id_model.length) {
      alert("Enter CI");
      return;
    }

    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_name} (id, nick, clave, permiso, imagen) VALUES ('${this.id_model}' , 
      '${this.nick_model}', '${this.clave_model}', '${this.permiso_model}', '${this.image}')
    `, [])
      .then(() => {
        alert('Usuario Creado!');
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
      DELETE FROM ${this.table_name} WHERE id = '${item.id}'
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

    this.id_model = item.id;
    this.nick_model = item.nick;
    this.clave_model = item.clave;
    this.permiso_model = item.permiso;
    this.image = item.imagen;
  }
  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
    UPDATE ${this.table_name}
    SET nick = '${this.nick_model}', clave ='${this.clave_model}', permiso = '${this.permiso_model}', imagen = '${this.image}'
    WHERE id = '${this.to_update_item.id}'`, [])
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
