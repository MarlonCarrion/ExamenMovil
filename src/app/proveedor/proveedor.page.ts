import { Component, OnInit } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.page.html',
  styleUrls: ['./proveedor.page.scss'],
})
export class ProveedorPage {
  databaseObj: SQLiteObject;

  ruc_model: string = "";
  nombre_model: string = "";
  legal_model: string = "";
  direccion_model: string = "";
  telefono_model: string="";
  credito_model:number;
  row_data: any = [];
  readonly database_name: string = "supermercado.db";
  readonly table_name: string = "proveedores";

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;
  constructor(private platform: Platform, private sqlite: SQLite) { 
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
  CREATE TABLE IF NOT EXISTS ${this.table_name}  (ruc varchar(255) PRIMARY KEY, nombre varchar(255), legal varchar(255), 
  direccion varchar(255), telefono varchar(255), credito integer)
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
    if (!this.ruc_model.length) {
      alert("Enter CI");
      return;
    }

    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_name} (ruc, nombre, legal, direccion, telefono, credito) VALUES ('${this.ruc_model}' , 
      '${this.nombre_model}', '${this.legal_model}', '${this.direccion_model}', '${this.telefono_model}', '${this.credito_model}')
    `, [])
      .then(() => {
        alert('Proveedor Creado!');
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
      DELETE FROM ${this.table_name} WHERE ruc = '${item.ruc}'
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

    this.ruc_model = item.ruc;
    this.nombre_model = item.nombre;
    this.legal_model = item.legal;
    this.direccion_model = item.direccion;
    this.telefono_model = item.telefono;
    this.credito_model = item.credito;
  }
  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
    UPDATE ${this.table_name}
    SET nombre = '${this.nombre_model}', legal ='${this.legal_model}', direccion = '${this.direccion_model}', telefono = '${this.telefono_model}', 
    credito = '${this.credito_model}'
    WHERE ruc = '${this.to_update_item.ruc}'`, [])
      .then(() => {
        alert('Row Updated!');
        this.updateActive = false;
        this.getUsuario();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }
}
