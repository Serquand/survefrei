enum RolesEnum {
    STUDENT = "student",
    ADMIN = 'admin',
    TEACHER = "teacher"
}

export interface User {
    firstName: string;
    lastName: string;
    accessToken: string;
    email: string;
    id: number;
    role: RolesEnum;
}