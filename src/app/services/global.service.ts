import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IStudent } from '../models/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _http = inject(HttpClient)
  private urlBase:string ='http://127.0.0.1:8081/api/v1';

  getAllStudent():Observable<IStudent[]>{
    return this._http.get<IStudent[]>(`${this.urlBase}/student/all`);
  }

  addStudent(student:IStudent):Observable<IStudent>{
    return this._http.post<IStudent>(`${this.urlBase}/student`,student);
  }

  updateStudent(student:IStudent):Observable<IStudent>{
    return this._http.put<IStudent>(`${this.urlBase}/student/${student.idStudent}`,student)
  }
  
  deleteByIdStudent(id: number):Observable<any>{
    return this._http.delete<any>(`${this.urlBase}/student/${id}`);
  }
}
