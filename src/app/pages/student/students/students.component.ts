import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { IStudent } from '../../../models/student.model';
import { GlobalService } from '../../../services/global.service';
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormStudentComponent } from '../form-student/form-student.component';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { AlertToastService } from '../../../services/alert-toast.service';
import { FormsModule } from '@angular/forms';
import { grades, Grades } from '../../../constants/grade.constants';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'devda-students',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatButton,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    CurrencyPipe,
    MatSortModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['idStudent', 'typeId', 'numberId', 'age', 'firstName', 'lastName', 'grade', 'options']
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  dataSource: any = new MatTableDataSource<IStudent>([])
  grades: Grades[] = grades

  studentList: IStudent[] = []
  private _api = inject(GlobalService)
  private _route = inject(Router)
  private _toast = inject(AlertToastService)


  constructor(private dialog: MatDialog) { }
  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    console.log('Iniciando')
    this._api.getAllStudent().subscribe((data: IStudent[]) => {
      this.studentList = data

      this.dataSource.data = this.studentList
    })
  }


  openForm(id: number = 0) {
    const dialogRef = this.dialog.open(FormStudentComponent, {
      height: '600px',
      width: '750px',
      data: id
    })

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit()
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByAge(startAge: any, endAge: any) {
    var ageA: number = 0
    var ageB: number = 0
    if (!startAge || !endAge) {
      this._toast.error('Ingrese las edades')
      this.ngOnInit()
      return
    }

    if (Number(startAge) > Number(endAge)) {
      ageA = Number(endAge)
      ageB = Number(startAge)
    } else {
      ageA = Number(startAge)
      ageB = Number(endAge)
    }

    console.log(`edad 1 ${startAge} edad2 ${endAge}`);
    const filterRes = this._api.getByAges(ageA, ageB).subscribe({
      next: (res: IStudent[]) => {
        console.log(res);
        this.studentList = res

        this.dataSource.data = this.studentList
      },
      error: (error) => {

      }
    })
  }

  filterByGrade(grade: any) {
    const filterRes = this._api.getByGrade(Number(grade)).subscribe({
      next: (res: IStudent[]) => {
        console.log(res);
        this.studentList = res

        this.dataSource.data = this.studentList
      },
      error: (error) => {

      }
    })
  }

  onDelete(student: IStudent) {
    const dialogRef = this.dialog.open(DialogConfirmComponent,
      {
        data: {
          ref: 'el estudiante',
          info: student.firstName
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._api.deleteByIdStudent(student.idStudent).subscribe(
          {
            next: (res) => {
              if (res) {
                this._toast.success('Estudiante eliminado')
                this.ngOnInit()
              }
            },
            error: (error) => {
              this._toast.error(`Error al eliminar al estudiante ${student.numberId}`)

            }
          }
        )
      }
    })
  }

}
