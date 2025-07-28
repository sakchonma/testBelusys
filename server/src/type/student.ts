export interface ISudentList {
    page?: number,
    limit?: number,
    studentid?: string,
    name?: string,
    gradelevelid?: string,
}

export interface ISudentCreate {
    prefixid?: number,
    firstname: string,
    lastname: string,
    genderid?: number,
    birthdate?: Date,
    gradelevelid?: number,
}

export interface IStudentUpdate {
    studentid: number;
    prefixid?: number;
    firstname: string;
    lastname: string;
    genderid?: number;
    birthdate?: Date;
    gradelevelid?: number;
}