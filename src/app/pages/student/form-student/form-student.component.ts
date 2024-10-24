import { Component, inject, Inject, OnInit, Type } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IStudent } from '../../../models/student.model';
import { GlobalService } from '../../../services/global.service';
import { AlertToastService } from '../../../services/alert-toast.service';
import { typesId,TypesId } from '../../../constants/type-id.constants';
import { grades, Grades } from '../../../constants/grade.constants';





@Component({
  selector: 'devda-form-student',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogTitle,
    MatDialogClose
  ],
  templateUrl: './form-student.component.html',
  styleUrl: './form-student.component.css'
})
export class FormStudentComponent implements OnInit{
  typesId : TypesId[] = typesId
  grades: Grades[]=grades  

  form!:FormGroup
  student!:IStudent

  private _api = inject(GlobalService)
  private _toast = inject(AlertToastService)

  constructor(
    private fb:FormBuilder,
    public dialogRef : MatDialogRef<FormStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data:number
  ){
    this.form = this.fb.group(
      {
        idStudent:[0],
        typeId:['',[Validators.required]],
        numberId:['',[Validators.required]],
        firstName:['',[Validators.required]],
        lastName:['',[Validators.required]],
        dateBirth:['',[Validators.required]],
        age:[''],
        currentGrade:['',[Validators.required]],
        email:['',[Validators.required,Validators.email]],
        landlinePhone:[''],
        cellPhoneNumber :['',[Validators.required]],
      }
    )
  }

  get f():{[key:string]:AbstractControl}{
    return this.form.controls
  }

  parseDate(date:string | null):Date | null{
    if(date){
      const [year,month,day]=date.split('-').map(Number)
      return new Date(year,month-1,day)
    }
    return null
  }

  formatDateToDisplay(date: Date): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1); // Meses 1-indexados
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Formato dd/MM/yyyy
  }

  onDateChange(event:any){
    const selectedDate = event.value; // Obtenemos la fecha seleccionada
    this.form.patchValue({
      dateBirth: selectedDate // Asignamos la fecha al formulario
    });
  }

  ngOnInit(){
      if(this.data != 0){
        this._api.getByIdStudent(this.data).subscribe({
          next:(res:IStudent)=>{
            this.form.setValue({
              idStudent:res.idStudent,
              typeId:res.typeId,
              numberId:res.numberId,
              firstName:res.firstName,
              lastName:res.lastName,
              dateBirth:this.parseDate(res.dateBirth),
              age:res.age,
              currentGrade:res.currentGrade,
              email:res.email,
              landlinePhone:res.landlinePhone,
              cellPhoneNumber:res.cellPhoneNumber,
            })
          }
        })
      }
  }

  onSubmit(){
    if (this.form.valid) {
      this.student = this.form.value
      this.student.dateBirth = this.formatDate(this.form.value.dateBirth)      
      
      if(this.student.idStudent == 0 || null){
        this._api.addStudent(this.student).subscribe(
          {
            next:(res:IStudent)=>{
              if (res.idStudent>0) {
                this._toast.success('Estudiate agregado')
                this.closedDialog()
                this.onReset()
                
              }
            },
            error:(error)=>{
              console.log('Error de conexion')
            }
          }
        )
      }else{
        this._api.updateStudent(this.student).subscribe((res:IStudent)=>{
          if(res){
            this._toast.success('Estudiante actualizado');            
            this.closedDialog()
            this.onReset()
          }else{
            this._toast.error('Estudiante  NO actualizado');

          }
        })
      }
    }
  }

  

  closedDialog(){
    this.dialogRef.close()
  }
  onReset() {
    this.form.reset();
  }

  formatDate(date:Date):string{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
  }

}
