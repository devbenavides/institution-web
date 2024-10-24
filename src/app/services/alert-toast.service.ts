import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertToastService {

  constructor(private toastr:ToastrService) { }

  success(message:String,title:String=''){
    this.toastr.success(`${message}`, `${title}`, {
      timeOut: 2000,
      closeButton: true,
      positionClass: 'toast-bottom-right'
    });
  }
  error(message:String,title:String=''){
    this.toastr.error(`${message}`, `${title}`, {
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-bottom-right'
    });
  }
  warning(message:String,title:String=''){
    this.toastr.warning(`${message}`, `${title}`, {
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-bottom-right'
    });
  }
  information(message:String,title:String=''){
    this.toastr.info(`${message}`, `${title}`, {
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-bottom-right'
    });
  }
}
