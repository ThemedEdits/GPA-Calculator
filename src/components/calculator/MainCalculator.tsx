"use client";

import { useState, useMemo } from "react";
import { Plus, Save, Trash2, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Modal } from "../ui/Modal";
import { TransitionLink as Link, usePageTransition } from "@/components/ui/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { useToastStore } from "@/hooks/useToast";
import { Subject, Semester } from "@/lib/types";
import { calculateSemesterGPA } from "@/lib/calculations";
import { calculateSubjectQualityPoints, getGradeInfoFromMarks } from "@/lib/grading";
import { saveSemester } from "@/lib/database";

export default function MainCalculator() {
  const { user } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const { navigate } = usePageTransition();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [semesterName, setSemesterName] = useState("");
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '', marks: '', grade: '-', gradePoint: 0, creditHours: 3, qualityPoints: 0 },
    { id: '2', name: '', marks: '', grade: '-', gradePoint: 0, creditHours: 3, qualityPoints: 0 },
    { id: '3', name: '', marks: '', grade: '-', gradePoint: 0, creditHours: 3, qualityPoints: 0 },
  ]);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: Date.now().toString(), name: '', marks: '', grade: '-', gradePoint: 0, creditHours: 3, qualityPoints: 0 }
    ]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(subject => {
      if (subject.id !== id) return subject;

      let parsedValue: any = value;
      if (field === 'marks' || field === 'creditHours') {
        parsedValue = value === '' ? '' : Number(value);
      }

      const updatedSubject = { ...subject, [field]: parsedValue };

      if (field === 'marks' || field === 'creditHours') {
        const marks = field === 'marks' ? parsedValue : subject.marks;
        const credits = field === 'creditHours' ? parsedValue : subject.creditHours;
        
        if (marks !== '' && credits !== '' && marks >= 0 && marks <= 100) {
          const { grade, gradePoint } = getGradeInfoFromMarks(marks);
          updatedSubject.grade = grade;
          updatedSubject.gradePoint = gradePoint;
          updatedSubject.qualityPoints = calculateSubjectQualityPoints(gradePoint, credits);
        } else {
          updatedSubject.grade = '-';
          updatedSubject.gradePoint = 0;
          updatedSubject.qualityPoints = 0;
        }
      }

      return updatedSubject;
    }));
  };

  const handleReset = () => {
    setSubjects([
      { id: Date.now().toString(), name: '', marks: '', grade: '-', gradePoint: 0, creditHours: 3, qualityPoints: 0 }
    ]);
  };

  const handleSaveInit = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Check if any valid subjects exist
    const hasValidSubjects = subjects.some(s => typeof s.marks === 'number' && typeof s.creditHours === 'number' && s.grade !== '-');
    if (!hasValidSubjects) {
      addToast("Please enter valid marks and credit hours for at least one subject.", "error");
      return;
    }

    setIsNameModalOpen(true);
  };

  const executeSave = async () => {
    if (!user) return;
    if (!semesterName.trim()) {
      addToast("Semester name is required", "error");
      return;
    }

    setIsSaving(true);
    try {
      const validSubjects = subjects.filter(s => s.grade !== '-');
      
      const newSemester: Semester = {
        id: Date.now().toString(),
        name: semesterName.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        subjects: validSubjects
      };

      await saveSemester(user.uid, newSemester);
      addToast("Semester saved successfully!", "success");
      setIsNameModalOpen(false);
      
      // Navigate to dashboard after saving
      navigate("/dashboard");
    } catch (error) {
      addToast("Failed to save semester. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const result = useMemo(() => calculateSemesterGPA(subjects), [subjects]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* LEFT: Subject Inputs */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Subjects</h2>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-[var(--text-secondary)]">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <Card key={subject.id} className="overflow-hidden transition-all hover:border-[var(--accent)]">
              <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center relative">
                
                <div className="absolute top-4 right-4 md:hidden">
                  <Button variant="ghost" size="icon" onClick={() => removeSubject(subject.id)} className="text-[var(--text-muted)] hover:text-[var(--danger)] -mr-2 -mt-2">
                     <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="w-full md:flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <Input 
                      label="Subject Name (Optional)" 
                      placeholder={`Subject ${index + 1}`}
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-4">
                    <Input 
                      label="Marks (0-100)" 
                      type="number"
                      min="0"
                      max="100"
                      value={subject.marks}
                      onChange={(e) => updateSubject(subject.id, 'marks', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-1 gap-4">
                    <Input 
                      label="Credits" 
                      type="number"
                      min="1"
                      step="0.5"
                      value={subject.creditHours}
                      onChange={(e) => updateSubject(subject.id, 'creditHours', e.target.value)}
                    />
                  </div>
                  
                  {/* Results for this row */}
                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-6 bg-[var(--surface-elevated)] p-3 rounded-[var(--radius-sm)] md:bg-transparent md:p-0 mt-2 md:mt-0">
                    <div className="text-center md:text-right">
                      <div className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Grade</div>
                      <div className={`text-lg font-bold ${subject.grade === 'F' ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                        {subject.grade}
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Points</div>
                      <div className="text-lg font-bold text-[var(--text-primary)]">
                        {subject.qualityPoints.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSubject(subject.id)}
                    className="text-[var(--text-muted)] hover:text-[var(--danger)] mt-6"
                    disabled={subjects.length === 1}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-4 border-dashed py-6 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
          onClick={addSubject}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* RIGHT: Results Card */}
      <div className="lg:sticky lg:top-24">
        <Card className="border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10">
          <CardHeader className="pb-4 bg-[var(--surface-elevated)] border-b border-[var(--border)] rounded-t-[var(--radius-lg)]">
            <CardTitle>Semester Results</CardTitle>
            <CardDescription>Live GPA calculation</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-widest mb-2">
                Semester GPA
              </div>
              <div className="text-6xl font-black text-[var(--accent)] tracking-tighter">
                {result.gpa.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--surface-elevated)] p-4 rounded-[var(--radius-md)] text-center">
                <div className="text-2xl font-bold text-[var(--text-primary)]">{result.totalCredits}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">Total Credits</div>
              </div>
              <div className="bg-[var(--surface-elevated)] p-4 rounded-[var(--radius-md)] text-center">
                <div className="text-2xl font-bold text-[var(--text-primary)]">{result.totalSubjects}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">Valid Subjects</div>
              </div>
            </div>
            
            <div className="bg-[var(--surface-elevated)] p-4 rounded-[var(--radius-md)] flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">Total Quality Points</span>
              <span className="font-bold text-[var(--text-primary)]">{result.totalQualityPoints.toFixed(2)}</span>
            </div>

            <Button className="w-full text-base py-6 shadow-md" onClick={handleSaveInit} isLoading={isSaving}>
              <Save className="w-5 h-5 mr-2" />
              Save Semester
            </Button>
            
          </CardContent>
        </Card>
      </div>

      {/* Auth Prompt Modal */}
      <Modal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        title="Account Required"
        description="Create an account to save your academic records and track your overall CGPA across semesters."
      >
        <div className="flex flex-col gap-3 mt-4">
          <Link href="/login" className="w-full" onClick={() => setIsAuthModalOpen(false)}>
            <Button variant="outline" className="w-full">Log In</Button>
          </Link>
          <Link href="/signup" className="w-full" onClick={() => setIsAuthModalOpen(false)}>
            <Button variant="primary" className="w-full">Create Account</Button>
          </Link>
          <Button variant="ghost" onClick={() => setIsAuthModalOpen(false)} className="mt-2 text-[var(--text-secondary)]">
            Continue Calculating
          </Button>
        </div>
      </Modal>

      {/* Save Semester Name Modal */}
      <Modal
        isOpen={isNameModalOpen}
        onClose={() => !isSaving && setIsNameModalOpen(false)}
        title="Save Semester"
        description="Give this semester a name (e.g. Fall 2025, Semester 1)"
      >
        <div className="flex flex-col gap-4 mt-4">
          <Input 
            autoFocus
            label="Semester Name" 
            placeholder="e.g. Fall 2025" 
            value={semesterName} 
            onChange={(e) => setSemesterName(e.target.value)} 
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => setIsNameModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={executeSave} isLoading={isSaving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
