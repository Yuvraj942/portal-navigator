import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getStudentResults, areResultsPublished } from "@/services/evaluationService";
import { RecheckStatus, StudentResult } from "@/types/evaluation";

const recheckConfig: Record<RecheckStatus, { label: string; className: string }> = {
  "not-submitted": {
    label: "Not Submitted",
    className: "bg-muted/50 text-muted-foreground",
  },
  "under-review": {
    label: "Under Review",
    className: "bg-warning/10 text-warning",
  },
  updated: {
    label: "Updated",
    className: "bg-primary/10 text-primary",
  },
  unchanged: {
    label: "Marks Unchanged",
    className: "bg-destructive/10 text-destructive",
  },
};

const ROLL_NO = "230547";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const published = areResultsPublished();

  useEffect(() => {
    const data = getStudentResults(ROLL_NO);
    setResults(data);
    if (data.length > 0) setSelectedCode(data[0].subjectCode);
  }, []);

  const selected = results.find((r) => r.subjectCode === selectedCode);

  const handleViewAnswerSheet = () => {
    if (!selectedCode) return;
    navigate(`/evaluation/${selectedCode.toLowerCase()}?role=student&roll=${ROLL_NO}`);
  };

  const handleAction = (action: string) => {
    toast.info(`Loading ${action}...`, { duration: 2000 });
  };

  const handleLogout = () => {
    toast.dismiss();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Welcome, Aryan{" "}
            <span className="font-mono text-sm text-muted-foreground">(Roll: {ROLL_NO})</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 max-w-6xl mx-auto">
          {/* Left: Resource Panel */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Exam Services
              </h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Select Subject
                </label>
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  {results.map((r) => (
                    <option key={r.subjectCode} value={r.subjectCode}>
                      {r.subjectCode} — {r.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleViewAnswerSheet}
                disabled={!published && selected?.marks === null}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Evaluated Answer Sheet
              </button>

              {!published && (
                <p className="text-xs text-warning">Results have not been published yet.</p>
              )}

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Selected: <span className="font-mono text-primary">{selectedCode}</span>
                  {selected && ` — ${selected.subjectName}`}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Academic Record */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Academic Record
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Subject Code
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Subject Name
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Marks
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Recheck Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => {
                      const cfg = recheckConfig[r.recheckStatus];
                      return (
                        <tr
                          key={r.subjectCode}
                          className={`border-b border-border last:border-0 ${
                            i % 2 === 1 ? "bg-muted/30" : ""
                          }`}
                        >
                          <td className="px-5 py-3 font-mono text-sm font-medium text-primary">
                            {r.subjectCode}
                          </td>
                          <td className="px-5 py-3 text-foreground">{r.subjectName}</td>
                          <td className="px-5 py-3 text-right font-mono font-semibold text-foreground">
                            {published && r.marks !== null ? r.marks : "—"}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span
                              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${cfg.className}`}
                            >
                              {cfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAction("Question Paper")}
                className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Download Question Paper
              </button>
              <button
                onClick={() => handleAction("Answer Key")}
                className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Download Answer Key
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
