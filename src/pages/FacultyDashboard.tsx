import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SCRIPTS = [
  { roll: "230501", subject: "CS3001", date: "2025-12-10", status: "pending" },
  { roll: "230512", subject: "CS3002", date: "2025-12-11", status: "pending" },
  { roll: "230523", subject: "CS3003", date: "2025-12-10", status: "graded" },
  { roll: "230534", subject: "CS3001", date: "2025-12-12", status: "pending" },
  { roll: "230545", subject: "CS3004", date: "2025-12-11", status: "graded" },
  { roll: "230547", subject: "CS3002", date: "2025-12-12", status: "pending" },
  { roll: "230558", subject: "CS3005", date: "2025-12-10", status: "graded" },
  { roll: "230569", subject: "CS3003", date: "2025-12-11", status: "pending" },
];

const FacultyDashboard = () => {
  const [publishResults, setPublishResults] = useState(false);
  const navigate = useNavigate();

  const assigned = SCRIPTS.length;
  const graded = SCRIPTS.filter((s) => s.status === "graded").length;
  const pending = assigned - graded;

  const handleEvaluate = (roll: string, subject: string) => {
    toast.loading(`Opening evaluation for Roll ${roll} — ${subject}...`, {
      duration: 2000,
    });
  };

  const handleBulkUpload = () => {
    toast.loading("Preparing bulk upload interface...", { duration: 2000 });
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handlePublishToggle = () => {
    setPublishResults(!publishResults);
    toast.success(
      !publishResults
        ? "Results will be published to the Student Portal"
        : "Results unpublished from the Student Portal"
    );
  };

  const stats = [
    { label: "Scripts Assigned", value: assigned, color: "text-primary", icon: "📋" },
    { label: "Graded", value: graded, color: "text-success", icon: "✅" },
    { label: "Pending", value: pending, color: "text-warning", icon: "⏳" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Faculty Dashboard</h1>
          <p className="text-sm text-muted-foreground">Examination Grading Portal</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <span className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left: Grading Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Grading Queue
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SCRIPTS.map((s, i) => (
                    <tr
                      key={`${s.roll}-${s.subject}`}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 1 ? "bg-muted/30" : ""
                      }`}
                    >
                      <td className="px-5 py-3 font-mono font-medium text-foreground">
                        {s.roll}
                      </td>
                      <td className="px-5 py-3 font-mono text-primary">{s.subject}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.date}</td>
                      <td className="px-5 py-3 text-right">
                        {s.status === "pending" ? (
                          <button
                            onClick={() => handleEvaluate(s.roll, s.subject)}
                            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            Evaluate
                          </button>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                            Graded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Control Sidebar */}
          <div className="space-y-4">
            {/* Key Management */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Key Management
              </h3>
              <button
                onClick={handleBulkUpload}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Bulk Upload Answer Key
              </button>
            </div>

            {/* System Control */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                System Control
              </h3>
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground leading-snug max-w-[180px]">
                  Publish Results to Student Portal
                </label>
                <button
                  onClick={handlePublishToggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    publishResults ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-foreground shadow-lg transform transition duration-200 ease-in-out ${
                      publishResults ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
