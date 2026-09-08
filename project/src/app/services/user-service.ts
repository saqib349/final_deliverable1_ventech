import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class UserService {
    http = inject(HttpClient)

    getUsers(){
        return this.http.get<{data:Admin_users[]}>("http://localhost:8000/admin/user/getUsers")
    }
}
