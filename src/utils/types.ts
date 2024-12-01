export enum Roles {
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
    role: Roles;
}

export interface SurveyField {
    id: number;
    label: string;
    fieldType: SurveyFieldType;
    required: boolean;
    choices: string[];
    order: number;
    maximalNumberOfChoices: number;
}

export enum SurveyFieldType {
    SELECT = "select",
    TITLE = "title",
    DESCRIPTION = "description",
    IMAGE = "image",
}

export interface Survey extends SurveyPreview {
    id: number;
    title: string;
    description: string;
    isPublic: boolean;
    organizationId: number;
    organization: Omit<Organization, "users">;
    fields: SurveyField[];
}

export interface Organization {
    id: number;
    name: string;
    users: Omit<User, "accessToken">[];
}

export interface SurveyPreview {
    id: number;
    title: string;
    description: string;
    isPublic: boolean;
    organizationId: number;
    organization: Omit<Organization, "users">,
}

export interface CreationSurvey {
    title: string;
    description: string;
    organizationId: number;
}