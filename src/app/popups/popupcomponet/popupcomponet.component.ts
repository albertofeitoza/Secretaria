import { Component, Input, OnInit } from '@angular/core';
import { UtilServiceService } from 'src/app/services/util-service.service';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popupcomponet',
  templateUrl: './popupcomponet.component.html',
  styleUrls: ['./popupcomponet.component.css']
})
export class PopupcomponetComponent implements OnInit {

  @Input() componente: Component


  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public facingMode: string = 'environment';
  public messages: any[] = [];
  largura = 640;
  altura = 480;
  

  public webcamImage: WebcamImage
  mensagemCamera = "";

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(private serviceUtil: UtilServiceService,
    private dialogRef: MatDialogRef<PopupcomponetComponent>
  ) {

  }

  ngOnInit() {
    this.IniciarComponente()
    this.readAvailableVideoInputs();
    this.mensagemCamera = this.dialogRef._containerInstance._config.data.mensagem;
  }

  IniciarComponente() {
    const query = window.matchMedia("(max-width: 450px)");
    if(query.matches){
        this.largura = 200;
        this.altura = 300;
    }
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.messages.push(error);
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      this.addMessage('User denied camera access');
    }
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.dialogRef.close(this.webcamImage);
  }

  public cameraWasSwitched(deviceId: string): void {
    this.addMessage('Active device: ' + deviceId);
    this.deviceId = deviceId;
    this.readAvailableVideoInputs();
  }

  addMessage(message: any): void {
    console.log(message);
    this.messages.unshift(message);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }

    return result;
  }

  private readAvailableVideoInputs() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }



}
