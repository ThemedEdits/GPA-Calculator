export interface GradeInfo {
  grade: string;
  gradePoint: number;
}

export function getGradeInfoFromMarks(marks: number): GradeInfo {
  if (marks >= 90 && marks <= 100) return { grade: 'A+', gradePoint: 4.0 };
  if (marks >= 80 && marks < 90) return { grade: 'A', gradePoint: 4.0 };
  if (marks >= 70 && marks < 80) return { grade: 'B+', gradePoint: 3.5 };
  if (marks >= 60 && marks < 70) return { grade: 'B', gradePoint: 3.0 };
  if (marks >= 55 && marks < 60) return { grade: 'C+', gradePoint: 2.5 };
  if (marks >= 50 && marks < 55) return { grade: 'C', gradePoint: 2.0 };
  if (marks >= 0 && marks < 50) return { grade: 'F', gradePoint: 0.0 };
  
  // Default fallback for invalid marks
  return { grade: '-', gradePoint: 0.0 };
}

export function calculateSubjectQualityPoints(gradePoint: number, creditHours: number): number {
  return parseFloat((gradePoint * creditHours).toFixed(2));
}

export const GRADING_SCALE = [
  { min: 90, max: 100, grade: 'A+', points: 4.0, description: 'Distinction' },
  { min: 80, max: 89.99, grade: 'A', points: 4.0, description: '' },
  { min: 70, max: 79.99, grade: 'B+', points: 3.5, description: '' },
  { min: 60, max: 69.99, grade: 'B', points: 3.0, description: '' },
  { min: 55, max: 59.99, grade: 'C+', points: 2.5, description: 'Minimum degree-awarding CGPA' },
  { min: 50, max: 54.99, grade: 'C', points: 2.0, description: '' },
  { min: 0, max: 49.99, grade: 'F', points: 0.0, description: 'Fail' }
];
