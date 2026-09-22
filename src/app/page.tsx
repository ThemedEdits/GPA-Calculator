import MainCalculator from "@/components/calculator/MainCalculator";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Semester GPA Calculator
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Add your subjects to instantly calculate your GPA. 
          Log in to save this semester to your academic record and track your overall CGPA.
        </p>
      </div>

      <MainCalculator />
    </div>
  );
}
