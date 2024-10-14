import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TasksComponent } from './tasks.component';

const routes = [
    {path:'', component: TasksComponent }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
})
export class TasksModule {}
