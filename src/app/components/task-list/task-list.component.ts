import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { PageTitleComponent } from '../page-title/page-title.component';
import { StateService } from '../../services/state.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

export interface Task {
  id: number;
  title: string;
  important: boolean;
  completed: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  notyf = new Notyf();
  markImp: boolean = true;
  markComplete: boolean = false;
  newTask!: string;
  errMsg: string = '';
  initialTaskList!: any[];
  taskList: Task[] = [];
  stateService = inject(StateService);
  httpService = inject(HttpService);

  ngOnInit(){
    this.load_data();
  }

  load_data() {
    this.stateService.searchSubject.subscribe((value) => {
      if (value) {
        this.taskList = this.initialTaskList.filter((task) =>
          task.title.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.taskList = this.initialTaskList;
      }
      
    });
    this.getAllTasks();
  }

  addTask() {
    try {
      this.httpService.addTask(this.newTask).subscribe(() => {
        this.newTask = '';
        // window.location.reload();
        this.load_data();
        this.notyf.success('Task added Successfully!');
      });
    } catch (error) {
      console.error('Error occurred while adding task:', error);
    }
  }
  getAllTasks() {
    try {
      this.httpService.getAllTasks().subscribe((result: any) => {
        this.initialTaskList = this.taskList = result;
        // console.log(this.initialTaskList)
      });
    } catch (error) {
      this.errMsg = 'Error occurred while fetching task:' + error;
    }
  }
  markImportant(id: number, task: Task) {
    try {
      task.important = !task.important;
      console.log(task.important);
      this.httpService
        .updateTask(id, { important: task.important })
        .subscribe(() => {
          if (task.important) {
            this.notyf.success('Marked As Important');
          } else {
            this.notyf.success('Unmarked as Important');
          }
          this.load_data();
        });
    } catch (error) {
      this.notyf.error('Something went wrong!');
    }
  }
  markCompleted(id: number, task: Task) {
    try {
      task.completed = !task.completed;
      this.httpService
        .updateTask(id, { completed: task.completed })
        .subscribe(() => {
          if (task.completed) {
            this.notyf.success('Marked As Completed');
          } else {
            this.notyf.success('Unmarked as Completed');
          }
          this.load_data();
        });
    } catch (error) {
      this.notyf.error('Something went wrong');
    }
  }
  deleteTask(id: number, task: Task) {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.httpService.deleteTask(id).subscribe(()=> {
            const index = this.taskList.findIndex(task => task.id === id);
            if(index !== -1){
              this.taskList.splice(index,1);
              console.log(this.taskList);
            }
          }); 
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          } 
        });
      }
  catch (error) {
    console.error('Error occurred while deleting task:', error);
  }
}

  search(searchTerm: any) {
    try {
      // console.log(searchTerm);
      this.load_data();
    } catch (error) {
      this.errMsg = 'No results';
    }
  }
}

