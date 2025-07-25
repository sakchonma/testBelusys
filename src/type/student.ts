export interface ISudentList {
    page?: number,
    limit?: number,
    studentid?: String,
    name?: String,
    gradelevelid?: String,
}

export interface ISudentCreate {
    prefixid?: number,
    firstname?: String,
    lastname?: String,
    genderid?: number,
    birthdate?: Date,
    gradelevelid?: number,
}

export interface IStudentUpdate {
    studentid: number;
    prefixid?: number;
    firstname?: string;
    lastname?: string;
    genderid?: number;
    birthdate?: Date;
    gradelevelid?: number;
}