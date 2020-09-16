import { Component } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  databaseObj: SQLiteObject;

  cedula_model: string = "";
  nombres_model: string = "";
  apellidos_model: string = "";
  fecha_contrato_model: string = "";
  salario_model: number = 0;
  discapacidad_model: string = "";
  horario_model: string = "";
  row_data: any = [];
  readonly database_name: string = "supermercado.db";
  readonly table_name: string = "empleados";

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
  CREATE TABLE IF NOT EXISTS ${this.table_name}  (cedula varchar(255) PRIMARY KEY, nombres varchar(255), apellidos varchar(255), 
  fecha_contrato varchar(255), salario integer, discapacidad varchar(255), horario varchar(255))
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
      INSERT INTO ${this.table_name} (cedula, nombres, apellidos, fecha_contrato, salario, discapacidad, horario) VALUES ('${this.cedula_model}' , 
      '${this.nombres_model}', '${this.apellidos_model}', '${this.fecha_contrato_model}', '${this.salario_model}', '${this.discapacidad_model}', 
      '${this.horario_model}')
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
    this.fecha_contrato_model = item.fecha_contrato;
    this.salario_model = item.salario;
    this.discapacidad_model = item.discapacidad;
    this.horario_model = item.horario;
  }
  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
    UPDATE ${this.table_name}
    SET nombres = '${this.nombres_model}', apellidos ='${this.apellidos_model}', fecha_contrato = '${this.fecha_contrato_model}', salario = '${this.salario_model}', 
    discapacidad = '${this.discapacidad_model}', horario = '${this.horario_model}'
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
}
