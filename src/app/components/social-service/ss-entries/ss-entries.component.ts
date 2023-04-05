import { Component, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { EntriesService } from 'src/app/services/entries.service';

// Tipado de objeto para la busqueda de alumnos registrados
type RegisteredStudent = { registryId: string; studentId: string; name: string; date: string; time: string; }
type AlertMessage = { message: string; type: string }


@Component({
  selector: 'app-ss-entries',
  templateUrl: './ss-entries.component.html',
  styleUrls: ['./ss-entries.component.css', './ss-entries.component.scss']
})
export class SsEntriesComponent {
  public studentId?: string;
  private requestInProgress: boolean = false;
  public registeredStudents: Array<RegisteredStudent> = [];
  public currentCourse: any;
  private user: any;
  public c_User: any;

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;
  private _message = new Subject<string>();
  alertMessage: AlertMessage = {
    message: '',
    type: ''
  };

  constructor(private entriesService: EntriesService) { }

  ngOnInit(): void {
    this.c_User = localStorage.getItem('user');
    if (this.c_User) {
      this.c_User = JSON.parse(this.c_User);
    }
    // Tomamos el objeto del curso actual
    this.currentCourse = localStorage.getItem('currentCourse');
    this.currentCourse = JSON.parse(this.currentCourse);
    // Almacenamos los alumnos que ya se han registrado al curso
    let registered: any = localStorage.getItem('SS-register');
    registered = JSON.parse(registered);
    if(registered) {
      this.registeredStudents = registered;
    }
    // Tomamos el usuario actual
    this.user = localStorage.getItem('user');
    if (this.user) {
      this.user = JSON.parse(this.user);
    }
    // Tiempo de duración y mensaje de la alerta
		this._message.subscribe((message) => (this.alertMessage.message = message));
		this._message.pipe(debounceTime(4000)).subscribe(() => {
			if (this.selfClosingAlert) {
				this.selfClosingAlert.close();
			}
		});
  }
  
  // Revisión que la matrícula se haya ingresado, para posteriormente guardar la matrícula en el almacenamiento local dentro de un arreglo
  registerStudentEntry() {
    // Revisamos que se haya ingresado una matrícula
    if(!this.studentId) {
      this._message.next(`Porfavor ingrese la matrícula del alumno`);
      this.alertMessage.type = 'danger';
      return;
    }

    // Eliminamos los números 4400 de la matrícula escaneada
    if(this.studentId.endsWith('4400') && this.studentId.startsWith('A')) {
      this.studentId = this.studentId.substr(1, 6);
    }

    // Revisa si el alumno ya se ha registrado
    let registered = false;
    this.registeredStudents.forEach((element: RegisteredStudent) => {
      if(element.studentId == this.studentId) {
        registered = true;
      }
    });
    if(registered) {
      this._message.next(`Este alumno ya ha sido registrado`);
      this.alertMessage.type = 'danger';
      this.studentId = '';
      return;
    }

    // Revisa si existe una petición en curso
    if(this.requestInProgress) {
      this._message.next(`Porfavor espere a que termine de ser registrada la entrada anterior`);
      this.alertMessage.type = 'warning';
      return;
    }

    // Indicamos que se ha iniciado una petición
    this.requestInProgress = true;
    this.entriesService.getCourse(this.currentCourse._id).subscribe(
      (res) => {
        // Creamos el objeto de la entrada
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const actualdate = `${year}-${month}-${day}`;

        const hour = date.getHours();
        const minute = date.getMinutes();
        const actualtime = `${hour}:${minute}`;

        console.log(actualdate)
        console.log(actualtime)

        const entry = {
          date: actualdate,
          time: actualtime,
          course: res,
          student: this.studentId,
          lab: this.user.user.lab
        }
        
        // Registramos la nueva entrada
        this.entriesService.registerSSEntry(entry).subscribe(
          (res) => {
            // Revisamos si existe alumno en la base de datos con dicha matrícula
            if(res.status == 400) {
              this._message.next(`No se tiene alumno registrado con esta matrícula`);
              this.alertMessage.type = 'danger';
              this.studentId = '';
            } else {
              this._message.next(`Alumno registrado correctamente`);
              this.alertMessage.type = 'success';
              this.registeredStudents = [...this.registeredStudents, {
                registryId: res._id,
                studentId: res.student._id,
                name: res.student.name,
                date: res.date,
                time: res.time
              }];
              localStorage.setItem('SS-register', JSON.stringify(this.registeredStudents));
              this.studentId = '';
            }
            // Indicamos que ha terminado la petición
            this.requestInProgress = false;
          },
          (err) => {
            // Indicamos que ha terminado la petición
            this.requestInProgress = false;
            console.log(err);
          }
        );
      },
      (err) => {
        // Indicamos que ha terminado la petición
        this.requestInProgress = false;
        console.log(err);
      }
    );
  }

  deleteRegistry(registryId: string) {
    // Elimiamos el registro de la base de datos
    this.entriesService.deleteStudentEntry(registryId).subscribe(
      (res) => {
        this._message.next(`Registro eliminado correctamente`);
        this.alertMessage.type = 'info';
        // Obtenemos el indice del elemento eliminado con el id del estudiante
        let index = this.registeredStudents.findIndex((element: RegisteredStudent) => element.studentId == res.student);
        // Eliminamos el elemento del arreglo
        this.registeredStudents.splice(index, 1);
        this.registeredStudents = [...this.registeredStudents];
        localStorage.setItem('SS-register', JSON.stringify(this.registeredStudents));
      },
      (err) => {
        this._message.next(`No se pudo eliminar el registro debido a un error en el servidor`);
        console.log(err);
      }
    )
  }
}