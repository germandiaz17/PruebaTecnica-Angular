import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient, private confirmationService: ConfirmationService) {}

  getProjects(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
  }

  createProjects(projects:any): Observable<any> {
    return this.http.post<any>(this.apiUrl, projects)
  }

  updateProjects(id:number, projects:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, projects)
  }

  deleteProjects(id:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }
}
