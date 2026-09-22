export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: number;
}

export interface Subject {
  id: string;
  name?: string;
  marks: number;
  grade: string;
  gradePoint: number;
  creditHours: number;
  qualityPoints: number;
}

export interface Semester {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  subjects: Subject[];
}

export interface CalculationResult {
  gpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  totalSubjects: number;
}

export interface CGPAResult {
  cgpa: number;
  totalCredits: number;
  totalSubjects: number;
  totalSemesters: number;
}
