export enum Role {
  CITIZEN = 'CITIZEN',
  OFFICIAL = 'OFFICIAL',
  ADMIN = 'ADMIN'
}

export enum AppStatus {
  SUBMITTED = 'SUBMITTED',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CLARIFICATION = 'CLARIFICATION'
}

export interface ServiceType {
  id: string;
  nameEn: string;
  nameMr: string; // Marathi name
  description: string;
}

export interface Application {
  id: string;
  serviceId: string;
  applicantName: string;
  submissionDate: string;
  status: AppStatus;
  slaDaysRemaining: number;
  documents: string[];
  remark?: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  department?: string;
}

export type Language = 'en' | 'mr';

export interface StatData {
  name: string;
  value: number;
}