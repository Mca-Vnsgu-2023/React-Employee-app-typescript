import { IEmployeeQuery, IFormValues } from "../Components/Employee/types";
import { environments } from "../environments"
import apiAxios from "./apiAxios"
import { endPoints } from "./endpoints"

const getAllEmployees=(qry:IEmployeeQuery)=>{
    return apiAxios.get(environments.baseUrl + endPoints.Employee.getAll , qry);
}

const getByIdEmployee=(id:number)=>{
    return apiAxios.get(environments.baseUrl + endPoints.Employee.getById.replace('{0}',id.toString()));
}

const addEmployee=(data:any)=>{
    return apiAxios.post(environments.baseUrl + endPoints.Employee.add,data);
}

const updateEmployee=(id:number,data:any)=>{
    return apiAxios.put(environments.baseUrl + endPoints.Employee.update.replace('{0}',id.toString()),data);
}

const deleteEmployee=(id:number)=>{
    return apiAxios.empdelete(environments.baseUrl + endPoints.Employee.delete.replace('{0}',id.toString()));
}

const EmployeeService={
    getAllEmployees,
    getByIdEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee
}
export default EmployeeService