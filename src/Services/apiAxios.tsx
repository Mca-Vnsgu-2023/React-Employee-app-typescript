import axios from "axios";
import { IEmployeeQuery } from "../Components/Employee/types";

const get =(url:string,option?:IEmployeeQuery)=>{
    if(option)
    {
        return axios.get(url ,{params:option})
        
    }
    return axios.get(url)
}
const getById=(url:string)=>{
    return axios.get(url)
}

const post=(url:string,data:any)=>{
    return axios.post(url,data)
}

const put=(url:string,data:any)=>{
    return axios.put(url,data)
}
const empdelete=(url:string)=>{
    return axios.delete(url)
}
const apiAxios={
    get,
    getById,
    post,
    put,
   empdelete
}

export default apiAxios