export interface IFormValues {
    name: string,
    email: string,
    gender: string,
    dob: string,
    hobby: string,
    designation: string,
    phoneno: string
}
export interface IPagination{
    pageNo: number,
    pageSize:number,
    totalPage:number,
}

export interface IEmployeeQuery extends IPagination{
    SearchText :string | undefined,
    sortOrder: SortOrder,
    sortColumn: string,
}

export enum SortOrder{
    ASC= "asc",
    DESC="desc",
}