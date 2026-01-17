import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './pages/user/user.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full'},
    { path: 'users', component: UserComponent },
    { path: '**', redirectTo: 'users'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

