import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StudentsComponent } from './pages/student/students/students.component';
import { FormStudentComponent } from './pages/student/form-student/form-student.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'add',title:'estudiante', component:StudentsComponent},
    {path:'student',
        children:[
            {path:'',title:'lista de estudiantes',component:StudentsComponent},
            {path:'add',title:'agregar estudiante',component:FormStudentComponent},
            {path:'edit',title:'editar estudiante',component:FormStudentComponent},
        ]
    },
    {path:'**',redirectTo:'', pathMatch:'full'},
];
