import { GRADING_SCALE } from "@/lib/grading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function GradeScalePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Grading Scale
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Reference for the standard grading system used in calculations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Reference Table</CardTitle>
          <CardDescription>Minimum degree-awarding CGPA is 2.50 (C+)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] text-sm">
                  <th className="pb-3 px-4 font-medium">Marks %</th>
                  <th className="pb-3 px-4 font-medium">Grade</th>
                  <th className="pb-3 px-4 font-medium">Grade Point</th>
                  <th className="pb-3 px-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-primary)]">
                {GRADING_SCALE.map((scale, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-elevated)] transition-colors"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      {scale.min} - {scale.max === 100 ? '100' : Math.floor(scale.max)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-sm font-semibold ${
                        scale.grade === 'F' ? 'bg-[var(--danger)]/10 text-[var(--danger)]' : 'bg-[var(--success)]/10 text-[var(--success)]'
                      }`}>
                        {scale.grade}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium">{scale.points.toFixed(1)}</td>
                    <td className="py-4 px-4 text-sm text-[var(--text-secondary)]">{scale.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
