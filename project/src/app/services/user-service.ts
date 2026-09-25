import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class UserService {
    http = inject(HttpClient)

    getUsers(){
        return this.http.get<{data:Admin_users[]}>("https://final-deliverable1-ventech-o7q6.vercel.app/admin/users")
    }
    deleteUser(_id:string){
        return this.http.delete<{data:Admin_users}>(`https://final-deliverable1-ventech-o7q6.vercel.app/admin/users/${_id}`)
    }
    updateUser(user:Admin_users){
        return this.http.patch<{data:Admin_users}>(`https://final-deliverable1-ventech-o7q6.vercel.app/admin/users/${user._id}`,user)
    }
    getUserById(_id:string | null){
        return this.http.get<{data:Admin_users}>(`https://final-deliverable1-ventech-o7q6.vercel.app/admin/users/${_id}`)
    }
    addUser(user:Admin_users){
        return this.http.post<{data:Admin_users}>("https://final-deliverable1-ventech-o7q6.vercel.app/admin/users",user)
    }

}
