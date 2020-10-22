import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage{
  databaseObj: SQLiteObject;

  codigo_model: string = "";
  nombre_model: string = "";
  descripcion_model: string = "";
  costo_model: number;
  precio_model: number;
  stock_model: string = "";
  fecha_model: string = "";
  row_data: any = [];
  readonly database_name: string = "supermercado.db";
  readonly table_name: string = "productos";


  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;
  constructor(private platform: Platform, private sqlite: SQLite) { 
    this.platform.ready().then(() => {
      this.createDB();
      this.createTable();
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
  CREATE TABLE IF NOT EXISTS ${this.table_name}  (codigo varchar(255) PRIMARY KEY, nombre varchar(255), descripcion varchar(255), 
  costo integer, precio integer, stock integer, fecha varchar(255))
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
    if (!this.codigo_model.length) {
      alert("Enter CI");
      return;
    }

    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_name} (codigo, nombre, descripcion, costo, precio, stock, fecha) VALUES ('${this.codigo_model}' , 
      '${this.nombre_model}', '${this.descripcion_model}', '${this.costo_model}', '${this.precio_model}', '${this.stock_model}', 
      '${this.fecha_model}')
    `, [])
      .then(() => {
        alert('Producto Creado!');
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
      DELETE FROM ${this.table_name} WHERE codigo = '${item.codigo}'
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

    this.codigo_model = item.codigo;
    this.nombre_model = item.nombre;
    this.descripcion_model = item.descripcion;
    this.costo_model = item.costo;
    this.precio_model = item.precio;
    this.stock_model = item.stock;
    this.fecha_model = item.fecha;
  }
  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
    UPDATE ${this.table_name}
    SET nombre = '${this.nombre_model}', descripcion ='${this.descripcion_model}', costo = '${this.costo_model}', precio = '${this.precio_model}', 
    stock = '${this.stock_model}', fecha = '${this.fecha_model}'
    WHERE codigo = '${this.to_update_item.codigo}'`, [])
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
