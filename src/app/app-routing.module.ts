import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatabaseComponent } from './components/database/database.component';
import { FileUploadComponent } from './components/database/file-upload/file-upload.component';
import { UsersComponent } from './components/database/users/users.component';
import { CourseEntriesComponent } from './components/entries/course-entries/course-entries.component';
import { CustomCourseEntriesComponent } from './components/entries/custom-course-entries/custom-course-entries.component';
import { EntriesComponent } from './components/entries/entries.component';
import { StudentEntriesComponent } from './components/entries/student-entries/student-entries.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { LoginComponent } from './components/login/login.component';
import { ProfessorReportsComponent } from './components/reports/professor-reports/professor-reports.component';
import { ReportsComponent } from './components/reports/reports.component';
import { StudentReportsComponent } from './components/reports/student-reports/student-reports.component';
import { MainComponent } from './layout/main/main.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { MainPageComponent } from './components/social-service/main-page/main-page.component';
import { SocialServiceReportsComponent } from './components/reports/social-service-reports/social-service-reports.component';
import { AssistanshipsReportsComponent } from './components/reports/assistanships-reports/assistanships-reports.component';
import { AssistanshipsMainPageComponent } from './components/assistanships/as-main-page/as-main-page.component';
import { EquipmentComponent } from './components/inventory/equipment/equipment.component';
import { LoansComponent } from './components/inventory/loans/loans.component';
import { RecordsComponent } from './components/inventory/records/records.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', component: MainComponent, children: [
    { path: 'entries', component: EntriesComponent, canActivate: [AuthGuard], children: [
      { path: 'course-entries', component: CourseEntriesComponent },
      { path: 'custom-course-entries', component: CustomCourseEntriesComponent },
      { path: 'student-entries', component: StudentEntriesComponent }
    ] },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard, RoleGuard], children: [
      { path: 'student-reports', component: StudentReportsComponent },
      { path: 'professor-reports', component: ProfessorReportsComponent },
      { path: 'social-service-reports', component: SocialServiceReportsComponent },
      { path: 'assistanships-reports', component: AssistanshipsReportsComponent}
    ] },
    { path: 'database', component: DatabaseComponent, canActivate: [AuthGuard, RoleGuard], children: [
      { path: 'file-upload', component: FileUploadComponent },
      { path: 'users', component: UsersComponent }
    ] },
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard, RoleGuard], children:[
      { path: 'equipment', component: EquipmentComponent},
      { path: 'loans', component: LoansComponent},
      { path: 'records', component: RecordsComponent}
    ]},
    { path: 'social-service', component: MainPageComponent, canActivate: [AuthGuard, RoleGuard]},
    { path: 'assistanships', component: AssistanshipsMainPageComponent, canActivate: [AuthGuard, RoleGuard]}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
