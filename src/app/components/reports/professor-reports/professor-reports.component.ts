import { Component, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map, Observable, OperatorFunction, Subject } from 'rxjs';
import { EntriesService } from 'src/app/services/entries.service';
import { ReportsService } from 'src/app/services/reports.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AssetsService } from 'src/app/services/assets.service';
import { formatDate } from '@angular/common';

// Tipado de objetos para la busqueda en el elemento dropdown
type Professor = { id: string; name: string }
type Course = { code: string; name: string; group: string; professor: Professor};
type ProfessorRegistry = { id: string; name: string; date: Date; course: string; lab: string }

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-professor-reports',
  templateUrl: './professor-reports.component.html',
  styleUrls: ['./professor-reports.component.css', './professor-reports.component.scss']
})
export class ProfessorReportsComponent {

  public selectedLab?: string;
  public selectedCourse?: Course;
  public professorId?: string;
  private labs: string[] = [];
  private courses: Course[] = [];
  public filteredLabs: string[] = [];
  public filteredCourses: Course[] = [];
  public rangeDates: Date[] = [];
  public professorReports: ProfessorRegistry[] = [];
  private reports: any[] = [];
  private user: any;

  // Blob de las imagenes para los reportes
  private reportSheetBlob: any;
  private uachLogoBlob: any;
  private fingLogoBlob: any;

  // Referencia a la alerta
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;
  private _message = new Subject<string>();
  errorMessage: string = '';

  constructor(@Inject(LOCALE_ID) private locale: string, private assetsService: AssetsService, private reportsService: ReportsService, private entriesService: EntriesService) {
    (pdfMake as any).fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    };
    this.loadImages();
  }

  ngOnInit(): void {
    // Tomamos el usuario actual
    this.user = localStorage.getItem('user');
    if (this.user) {
      this.user = JSON.parse(this.user);
    }
    // Obtiene los laboratorios por medio de una petición
    this.reportsService.getLabs().subscribe(
      (res) => {
        res.forEach((element: any) => {
          if (element.name) {
            this.labs.push(String(element.name));
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
    // Obtiene los cursos/clases por medio de una petición
    this.entriesService.getCourses().subscribe(
      (res) => {
        this.courses = res;
      },
      (err) => {
        console.log(err);
      }
    );
    // Tiempo de duración y mensaje de la alerta
		this._message.subscribe((message) => (this.errorMessage = message));
		this._message.pipe(debounceTime(4000)).subscribe(() => {
			if (this.selfClosingAlert) {
				this.selfClosingAlert.close();
			}
		});
  }

  // Filtra los laboratorios según lo ingresado por el usuario
  filterLab(event: any) {
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.labs.length; i++) {
      let lab = this.labs[i];
      if (lab.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(lab);
      }
    }

    this.filteredLabs = filtered;
  }

  // Filtra los cursos según lo ingresado por el usuario
  filterCourse(event: any) {
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.courses.length; i++) {
      let course = this.courses[i];
      if (course.name.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(course);
      }
    }

    this.filteredCourses = filtered;
  }

  // Obtiene los reportes de los estudiantes segun los filtros proporcionados
  getProfessorReports() {
    if(!this.selectedLab && !this.selectedCourse && !this.professorId) {
      this._message.next(`Porfavor seleccione por lo menos un campo incluyendo el rango de fechas`);
    } else if(this.rangeDates.length == 0) {
      this._message.next(`Porfavor seleccione una fecha o rango de fechas`);
    } else {
      // Sumo un dia a la fecha final para que incluya el ultimo dia
      const endDate = new Date(this.rangeDates[1].getDate() + 1);
      const parameters = {
        lab: this.selectedLab,
        professor: this.professorId,
        courseCode: this.selectedCourse?.code,
        courseGroup: this.selectedCourse?.group,
        startDate: this.rangeDates[0].toISOString(),
        endDate: endDate.toISOString()
      };
      this.reportsService.getProfessorReport(parameters).subscribe(
        (res) => {
          this.professorReports = res;
          this.reports = [];
          this.professorReports.forEach((element: any) => {
            this.reports.push([element.professor._id, element.professor.name, element.lab, element.course.name, formatDate(element.date, 'mediumDate', this.locale, 'UTC -6')]);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  // Genera el PDF con la información del reporte
  generatePdfReport() {
    // Configuración del documento
    const docDefinition: any = {
      pageSize: 'LETTER',
      pageMargins: [40, 170, 40, 80],
      background: (currentPage: number, pageSize: any) => {
        return [
          {
            image: this.reportSheetBlob,
            height: pageSize.height,
            width: pageSize.width,
          },
          { text: 'Bitácora de Asistencia de Alumnos', style: 'header', absolutePosition: { x: pageSize / 2, y: 48 } },
          { text: `Laboratorio: ${this.user.user.lab}`, style: 'text', absolutePosition: { x: pageSize / 2, y: 64 } },
          { text: `Jefe de Laboratorio: ${this.user.user.name}`, style: 'text', absolutePosition: { x: pageSize / 2, y: 77 } },
          // // { text: 'Parámetros', bold: true,, margin: [120, 2, 0, 0] },
          { text: this.selectedLab || 'Todos los laboratorios', style: 'text', absolutePosition: { x: pageSize / 2, y: 90 } },
          { text: this.selectedCourse?.name || 'Todos los cursos', style: 'text', absolutePosition: { x: pageSize / 2, y: 103 } },
          { text: this.professorId || 'Todos los profesores', style: 'text', absolutePosition: { x: pageSize / 2, y: 116 } },
          { text: `Del ${formatDate(this.rangeDates[0], 'shortDate', this.locale, 'UTC -6')} al ${formatDate(this.rangeDates[1], 'shortDate', this.locale, 'UTC -6')}`, style: 'text', absolutePosition: { x: pageSize / 2, y: 129 } },
          {
            image: this.fingLogoBlob,
            height: 90,
            width: 90,
            absolutePosition: { x: pageSize.width - 120, y: 45 },
          }
        ];
      },
      content: [
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [{ text: 'No. Empleado', style: 'tableHeader' }, { text: 'Nombre', style: 'tableHeader' }, { text: 'Laboratorio', style: 'tableHeader' }, { text: 'Clase', style: 'tableHeader' }, { text: 'Fecha', style: 'tableHeader' }],
              ...this.reports
            ]
          }
        }
      ],
      defaultStyle: {
        fontSize: 11,
        alignment: 'start',
        color: '#444444',
      },
      styles: {
        header: {
          bold: true,
          fontSize: 12,
          color: 'black',
          alignment: 'center',
        },
        tableHeader: {
          color: 'black',
        },
        text: {
          alignment: 'center',
        }
      },
    };
    // Creamos el PDF
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }

  // Convertimos las imagenes que utilizaremos en blobs
  async loadImages() {
    this.uachLogoBlob = await this.assetsService.getAssetAsBlob('assets/images/uach_logo.png');
    this.fingLogoBlob = await this.assetsService.getAssetAsBlob('assets/images/fing_logo.png');
    this.reportSheetBlob = await this.assetsService.getAssetAsBlob('assets/images/report_sheet.png');
  }
}
