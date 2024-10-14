import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent, canActivate:[authGuard]},
    {path: 'login', component: LoginComponent},
    {
        path: 'projects', 
        loadChildren:() => import('./projects/projects.module').then(m => m.ProjectsModule), 
        canActivate:[authGuard]
    },
    {    
        path: 'tasks/:projectId', 
        loadChildren:() => import('./tasks/tasks.module').then(x => x.TasksModule), 
        canActivate:[authGuard]
    },
    {path: '**', redirectTo: '/login'}
];