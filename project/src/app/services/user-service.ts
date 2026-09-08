import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class UserService {
    http = inject(HttpClient)

    getUsers(){
        return this.http.get<{data:Admin_users[]}>("https://final-deliverable1-ventech-o7q6.vercel.app/admin/user/getUsers")
    }
}
