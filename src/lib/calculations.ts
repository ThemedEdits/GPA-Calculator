import { Subject, Semester, CalculationResult, CGPAResult } from './types';

export function calculateSemesterGPA(subjects: Subject[]): CalculationResult {
  if (!subjects || subjects.length === 0) {
    return { gpa: 0, totalCredits: 0, totalQualityPoints: 0, totalSubjects: 0 };
  }

  let totalCredits = 0;
  let totalQualityPoints = 0;
  let validSubjectsCount = 0;

  subjects.forEach(subject => {
    // Only calculate if valid numeric marks and credit hours are provided
    if (typeof subject.marks === 'number' && typeof subject.creditHours === 'number' && subject.marks >= 0 && subject.marks <= 100 && subject.creditHours > 0) {
      totalCredits += subject.creditHours;
      totalQualityPoints += subject.qualityPoints;
      validSubjectsCount++;
    }
  });

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    gpa: parseFloat(gpa.toFixed(2)),
    totalCredits,
    totalQualityPoints: parseFloat(totalQualityPoints.toFixed(2)),
    totalSubjects: validSubjectsCount
  };
}

export function calculateOverallCGPA(semesters: Semester[]): CGPAResult {
  if (!semesters || semesters.length === 0) {
    return { cgpa: 0, totalCredits: 0, totalSubjects: 0, totalSemesters: 0 };
  }

  let totalCredits = 0;
  let totalQualityPoints = 0;
  let totalSubjects = 0;

  semesters.forEach(semester => {
    semester.subjects.forEach(subject => {
      if (typeof subject.marks === 'number' && typeof subject.creditHours === 'number' && subject.marks >= 0 && subject.marks <= 100 && subject.creditHours > 0) {
        totalCredits += subject.creditHours;
        totalQualityPoints += subject.qualityPoints;
        totalSubjects++;
      }
    });
  });

  const cgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    cgpa: parseFloat(cgpa.toFixed(2)),
    totalCredits,
    totalSubjects,
    totalSemesters: semesters.length
  };
}
