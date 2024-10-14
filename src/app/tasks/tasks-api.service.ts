import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos'
  constructor(private http: HttpClient) { }

  getTasksAssociateProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${projectId}`)
  }

  createTasks(tasks:any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tasks)
  }

  updateTasks(id:number, tasks:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tasks)
  }

  deleteTasks(id:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }
}
