import { Service } from '@angular/core';

@Service()
export class ListService {
    todos = <Array<todo>> [
        {
            userId:1,
            _id:"1",
            title:"car wash",
            completed:false
        },
        {
            userId:1,
            _id:"2",
            title:"car paint",
            completed:false
        },
        {
            userId:1,
            _id:"3",
            title:"car repair",
            completed:false
        },
        {
            userId:1,
            _id:"4",
            title:"grocery",
            completed:true
        },
    ]
}
