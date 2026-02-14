import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SUBJECTS = [
  { code: "CS3001", name: "Data Structures & Algorithms", marks: 87 },
  { code: "CS3002", name: "Operating Systems", marks: 72 },
  { code: "CS3003", name: "Database Management Systems", marks: 91 },
  { code: "CS3004", name: "Computer Networks", marks: 68 },
  { code: "CS3005", name: "Software Engineering", marks: 79 },
  { code: "MA2001", name: "Discrete Mathematics", marks: 85 },
];

const StudentDashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].code);
  const navigate = useNavigate();

  const selected = SUBJECTS.find((s) => s.code === selectedSubject)!;

  const handleAction = (action: string) => {
    toast.info(`Loading ${action} for ${selected.name}...`, {
      duration: 2000,
    });
  };

  const handleLogout = () => {
    toast.dismiss();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Welcome, Aryan{" "}
            <span className="font-mono text-sm text-muted-foreground">(Roll: 230547)</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
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
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleAction("Evaluated Answer Sheet")}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                View Evaluated Answer Sheet
              </button>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Selected: <span className="font-mono text-primary">{selected.code}</span> — {selected.name}
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
                    </tr>
                  </thead>
                  <tbody>
                    {SUBJECTS.map((s, i) => (
                      <tr
                        key={s.code}
                        className={`border-b border-border last:border-0 ${
                          i % 2 === 1 ? "bg-muted/30" : ""
                        }`}
                      >
                        <td className="px-5 py-3 font-mono text-sm font-medium text-primary">
                          {s.code}
                        </td>
                        <td className="px-5 py-3 text-foreground">{s.name}</td>
                        <td className="px-5 py-3 text-right font-mono font-semibold text-foreground">
                          {s.marks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Buttons */}
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
