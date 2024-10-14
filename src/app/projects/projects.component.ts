import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectsApiService } from './projects-api.service'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { MatDialog } from '@angular/material/dialog';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { MessageService } from 'primeng/api';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [MessageService]
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  projectForm: FormGroup;
  editingProjectId: number | null = null;
  displayDeleteDialog: boolean = false;
  projectToDeleteId: number | null = null;

  constructor(private projectsApiService: ProjectsApiService, private fb: FormBuilder, private router: Router, private dialog: MatDialog, private messageService: MessageService) {

    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: this.fb.group({
        name: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectsApiService.getProjects().subscribe(
      (response) => {
        this.projects = response;
        
      },
      (error) => {
        console.error('Error al obtener los datos de proyectos', error);
      }
    );
  }


  onSubmit(): void {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;

      if (this.editingProjectId) {

        this.projectsApiService.updateProjects(this.editingProjectId, projectData).subscribe(
          (updatedProject) => {
            const index = this.projects.findIndex(project => project.id === this.editingProjectId);
            if (index !== -1) {
              this.projects[index] = updatedProject;
            }
            this.resetForm();
          },
          (error) => {
            console.error('Error al actualizar el proyecto', error);
          }
        );
      } else {

//los nuevos IDs generados estan siendo siempre los mismos, debido a que la api asi devuelve la informacion
//es de mala practica generar los ids directamente desde la aplicacion y no desde la logica de la api
//por esta razon decidi dejar que los nuevos proyectos y tareas se generen con los IDs repetidos, por practicidad
//cabe recalcar que esto se deberia mejorar desde la api para un ambiente productivo.
//se entiende que debido a que la api es publica, debe tener restricciones.

        this.projectsApiService.createProjects(projectData).subscribe(
          (newProject) => {
            console.log('Created project from API:', newProject);
            this.projects.push(newProject);
            this.resetForm();
          },
          (error) => {
            console.error('Error al crear el proyecto', error);
          }
        );
      }
    }
  }

  editProject(project: any): void {
    this.editingProjectId = project.id;
    console.log(this.editingProjectId)
    console.log(project.id)
    this.projectForm.patchValue({
      name: project.name,
      email: project.email,
      company: {
        name: project.company.name
      }
    });
  }

  confirmDeleteProject(projectId: number): void {
    const dialogRef = this.dialog.open(ModalDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProject(projectId);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Proyecto eliminado',
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelado',
          detail: 'Eliminación cancelada',
        });
      }
    });
  }

  deleteProject(projectId: number): void {
    this.projectsApiService.deleteProjects(projectId).subscribe(
      () => {
        this.projects = this.projects.filter(project => project.id !== projectId);
      },
      (error) => {
        console.error('Error al eliminar el proyecto', error);
      }
    );
  }

  redirectionTasks(projectId: number): void {
    this.router.navigate(['/tasks', projectId])
  }

  resetForm(): void {
    this.projectForm.reset();
    this.editingProjectId = null;
  }
}
