import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  gotoEmpleados(){
    return this.router.navigateByUrl('home');
  }
  gotoClientes(){
    return this.router.navigateByUrl('cliente');
  }
  gotoProductos(){
    return this.router.navigateByUrl('producto');
  }
  gotoUsuarios(){
    return this.router.navigateByUrl('usuario');
  }
  gotoProveedores(){
    return this.router.navigateByUrl('proveedor');
  } 
}
