"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TransitionLink as Link, usePageTransition } from "@/components/ui/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { getSemesters, deleteSemester } from "@/lib/database";
import { calculateOverallCGPA, calculateSemesterGPA } from "@/lib/calculations";
import { Semester, CGPAResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToastStore } from "@/hooks/useToast";
import { BookOpen, Calendar, GraduationCap, Plus, Trash2, ChevronRight, Activity } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { addToast } = useToastStore();
  
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [cgpaResult, setCgpaResult] = useState<CGPAResult | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  
  const { navigate } = usePageTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, isLoading, navigate]);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const data = await getSemesters(user.uid);
      // Sort by created at descending
      data.sort((a, b) => b.createdAt - a.createdAt);
      setSemesters(data);
      setCgpaResult(calculateOverallCGPA(data));
    } catch (error) {
      addToast("Failed to load your records.", "error");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !semesterToDelete) return;
    
    try {
      await deleteSemester(user.uid, semesterToDelete);
      addToast("Semester deleted successfully", "success");
      setSemesterToDelete(null);
      fetchData();
    } catch (error) {
      addToast("Failed to delete semester", "error");
    }
  };

  if (isLoading || loadingData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl animate-pulse">
        <div className="h-10 bg-[var(--surface-elevated)] w-64 rounded-[var(--radius-md)] mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-[var(--surface-elevated)] rounded-[var(--radius-lg)]"></div>)}
        </div>
        <div className="h-64 bg-[var(--surface-elevated)] rounded-[var(--radius-lg)] mb-8"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Your Academic Dashboard</h1>
          <p className="text-[var(--text-secondary)]">Welcome back. Here is your overall progress.</p>
        </div>
        <Link href="/">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Semester
          </Button>
        </Link>
      </div>

      {semesters.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          <CardContent className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[var(--surface-elevated)] rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No academic records yet</h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md">
              Create your first semester to start tracking your CGPA and view your academic history here.
            </p>
            <Link href="/">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Calculate & Save Semester
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Card className="border-t-4 border-t-[var(--accent)]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Overall CGPA</p>
                    <h3 className="text-4xl font-black text-[var(--accent)]">{cgpaResult?.cgpa.toFixed(2)}</h3>
                  </div>
                  <GraduationCap className="w-8 h-8 text-[var(--accent)] opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Total Credits</p>
                    <h3 className="text-3xl font-bold text-[var(--text-primary)]">{cgpaResult?.totalCredits}</h3>
                  </div>
                  <Activity className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Total Subjects</p>
                    <h3 className="text-3xl font-bold text-[var(--text-primary)]">{cgpaResult?.totalSubjects}</h3>
                  </div>
                  <BookOpen className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Semesters</p>
                    <h3 className="text-3xl font-bold text-[var(--text-primary)]">{cgpaResult?.totalSemesters}</h3>
                  </div>
                  <Calendar className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Semester History */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Semester History</h2>
            
            <div className="grid gap-4">
              {semesters.map((semester) => {
                const result = calculateSemesterGPA(semester.subjects);
                
                return (
                  <Card key={semester.id} className="overflow-hidden transition-all hover:border-[var(--border)] group">
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{semester.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                          <span>{result.totalSubjects} Subjects</span>
                          <span>•</span>
                          <span>{result.totalCredits} Credits</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-6 mt-4 sm:mt-0">
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mb-1">Semester GPA</div>
                          <div className="text-2xl font-bold text-[var(--text-primary)]">{result.gpa.toFixed(2)}</div>
                        </div>
                        
                        <div className="h-10 w-px bg-[var(--border)] hidden sm:block"></div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                            onClick={() => setSemesterToDelete(semester.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                          
                          {/* Note: In a complete implementation, this would link to an edit page */}
                          {/* <Link href={`/semesters/${semester.id}`}>
                            <Button variant="ghost" size="icon" className="text-[var(--text-secondary)]">
                              <ChevronRight className="w-5 h-5" />
                            </Button>
                          </Link> */}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={!!semesterToDelete}
        onClose={() => setSemesterToDelete(null)}
        title="Delete Semester?"
        description="This will permanently remove all subjects and GPA data associated with this semester."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setSemesterToDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Semester</Button>
        </div>
      </Modal>

    </div>
  );
}
