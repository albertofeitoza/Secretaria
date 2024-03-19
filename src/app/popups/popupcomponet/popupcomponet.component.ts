import { Component, Input, OnInit } from '@angular/core';
import { UtilServiceService } from 'src/app/services/util-service.service';

@Component({
  selector: 'app-popupcomponet',
  templateUrl: './popupcomponet.component.html',
  styleUrls: ['./popupcomponet.component.css']
})
export class PopupcomponetComponent implements OnInit {

@Input() componente : Component

constructor(private serviceUtil : UtilServiceService){

}

ngOnInit() {
  this.IniciarComponente()
}

IniciarComponente(){

}


}
