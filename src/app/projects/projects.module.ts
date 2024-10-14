import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';

const routes = [
    {path:'', component: ProjectsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes), ProjectsComponent],
    exports: [RouterModule]
})
export class ProjectsModule {}
