import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  serviceURL :string;

  httpClient = inject(HttpClient);
  constructor() { this.serviceURL = "http://localhost:3000/tasks";}
  addTask(task:string):Observable<any> {
    return this.httpClient.post(this.serviceURL,{title:task}).pipe(catchError(this.handleError));
  }
  deleteTask(id:number):Observable<any>  {  
    return this.httpClient.delete(this.serviceURL +  `/${id}`).pipe(catchError(this.handleError));
  }
  getAllTasks():Observable<any> {
    return this.httpClient.get(this.serviceURL).pipe(catchError(this.handleError));
  }
  updateTask(id:number,updetails:object):Observable<any>{
    return this.httpClient.patch(this.serviceURL + `/${id}`,updetails).pipe(catchError(this.handleError));
  }
  private handleError(error:HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.error('An error occurred:' ,error.error.message);
    }else{
      console.error(`Backend returned code ${error.status},` + `body was: ${error.error}`)
    }
    return throwError('Something Bad Happened; Please try again Later')
  }
}


