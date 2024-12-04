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

export interface SurveyFieldChoice {
    id: number;
    label: string;
    formFieldId: number;
}

export interface SurveyField {
    id: number;
    label: string;
    fieldType: SurveyFieldType;
    required: boolean;
    choices: SurveyFieldChoice[];
    order: number;
    maximalNumberOfChoices: number;
    minValue: number;
    maxValue: number;
}

export interface SurveyFieldWithAnswer extends SurveyField {
    answers: {
        id: number;
        value: boolean | string[] | number;
        valueText: string;
    }[];
}

export enum SurveyFieldType {
    SELECT = "SL",
    TEXT = "TX",
    TEXTAREA = "TA",
    CHECKBOX = "CB",
    NUMBER = 'NB',
}

export interface Survey extends SurveyPreview {
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

export interface Answer {
    questionId: string;
    value: boolean | string[] | string | number;
}

export interface SurveyWithAnswer extends Survey {
    fields: SurveyFieldWithAnswer[];
}