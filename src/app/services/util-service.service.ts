import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, EMPTY, catchError, map } from 'rxjs';
import { Component, EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {

  constructor(
    private snackBar: MatSnackBar,
    private http : HttpClient,
    private router : Router,
    public overlay : Overlay,
    public dialog : MatDialog,) { }

  showMessage(msg : string, isErro: boolean = false) : void { 
    this.snackBar.open(msg, 'X' , { 
      duration : 3000,
      horizontalPosition: "right",
      verticalPosition : "top",
      panelClass : isErro ? ['msg-error'] : ['msg-sucess']
    })

  }

  erroHandler(e: any) : Observable<any>{
    let mensagem = e.error;
    this.showMessage(e.error, true )
    return EMPTY 
  }

  convertToBase64(txt : string) : string {
    return btoa(txt);
  }

  convertBase64toText(txt: string) : string {
    return atob(txt);

  }

}
