import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksApiService } from './tasks-api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { MessageService } from 'primeng/api';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  providers: [MessageService]
})
export class TasksComponent {
  tasks: any[] = [];
  projectId: number | null = null;
  tasksForm: FormGroup;
  editingTasksId: number | null = null

  constructor(private tasksApiService: TasksApiService, private route: ActivatedRoute, private fb: FormBuilder, private dialog: MatDialog, private messageService: MessageService) {
  this.tasksForm = this.fb.group({
    title: ['', Validators.required],
    completed:[false]
  })

  }

  ngOnInit():void {
    this.route.paramMap.subscribe(params => {
      this.projectId = +params.get('projectId')!
      this.loadTasks();
    })
  }

  loadTasks(): void {
    if(this.projectId) {
      this.tasksApiService.getTasksAssociateProject(this.projectId).subscribe(
        (response) => {
          this.tasks = response
        },
        (error) => {
          console.error("Se ha producido un error al obtener las tareas", error)
        }
      )
    }
  }

  onSubmit(): void {
    if (this.tasksForm.valid) {
      const taskData = this.tasksForm.value;

      if (this.editingTasksId) {
        this.tasksApiService.updateTasks(this.editingTasksId, taskData).subscribe(
          (updatedTasks) => {
            const index = this.tasks.findIndex(task => task.id === this.editingTasksId);
            console.log(index)
            if (index !== -1) {
              this.tasks[index] = updatedTasks;
            }
            this.resetForm();
          },
          (error) => {
            console.error('Error al actualizar la tarea', error);
          }
        );
      } else {

        this.tasksApiService.createTasks(taskData).subscribe(
          (newTask) => {
            this.tasks.push(newTask);
            this.resetForm();
          },
          (error) => {
            console.error('Error al crear la tarea', error);
          }
        );
      }
    }
  }

  editasks(tasks: any): void {
    this.editingTasksId = tasks.id;
    // console.log(this.editingTasksId)
    // console.log(tasks.id)
    this.tasksForm.patchValue({
      title: tasks.title,
      completed: tasks.completed
    });
  }

  confirmDeleteTasks(projectId: number): void {
    const dialogRef = this.dialog.open(ModalDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTasks(projectId);
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

  deleteTasks(taskId: number): void {
    this.tasksApiService.deleteTasks(taskId).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      },
      (error) => {
        console.error('Error al eliminar la tarea', error);
      }
    );
  }

  resetForm(): void {
    this.tasksForm.reset();
    this.editingTasksId = null;
  }
}
