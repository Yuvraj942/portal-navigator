import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  getScript,
  saveMarks,
  submitGrievance,
  acceptGrievance,
  rejectGrievance,
} from "@/services/evaluationService";
import { MarksRow, SUBJECT_MAP, createEmptyMarks, computeTotal } from "@/types/evaluation";

const PAGES = [1, 2, 3, 4, 5, 6, 7, 8];

const EvaluationViewer = () => {
  const { subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";
  const mode = searchParams.get("mode") || "graded";
  const rollNo = searchParams.get("roll") || "230547";
  const navigate = useNavigate();

  const isFaculty = role === "faculty";
  const isFresh = mode === "fresh";
  const hasGrievance = mode === "grievance";

  const subjectCode = subjectId?.toUpperCase() || "N/A";
  const subjectName = SUBJECT_MAP[subjectId?.toLowerCase() || ""] || "Unknown Subject";

  const [activePage, setActivePage] = useState(1);
  const [marks, setMarks] = useState<MarksRow[]>(createEmptyMarks());
  const [grievanceText, setGrievanceText] = useState("");
  const [scriptGrievance, setScriptGrievance] = useState<{ text: string; date: string } | null>(null);

  useEffect(() => {
    const script = getScript(rollNo, subjectId || "");
    if (script) {
      setMarks(script.marks);
      if (script.hasGrievance && script.grievanceText) {
        setScriptGrievance({ text: script.grievanceText, date: script.grievanceDate || "" });
      }
    }
  }, [rollNo, subjectId]);

  const handleBack = () => {
    navigate(isFaculty ? "/dashboard/faculty" : "/dashboard/student");
  };

  const handlePrev = () => setActivePage((p) => Math.max(1, p - 1));
  const handleNext = () => setActivePage((p) => Math.min(PAGES.length, p + 1));

  const handleMarkChange = (qIndex: number, part: string, value: string) => {
    const sanitized = value.replace(/[^0-9-]/g, "");
    setMarks((prev) => {
      const updated = prev.map((r) => ({ ...r, parts: { ...r.parts } }));
      updated[qIndex].parts[part] = sanitized;
      return updated;
    });
  };

  const handleSaveMarks = () => {
    saveMarks(rollNo, subjectId || "", marks);
    toast.success("Marks saved successfully.", { duration: 2500 });
  };

  const handleSubmitGrievance = () => {
    if (!grievanceText.trim()) {
      toast.error("Please enter your grievance details.");
      return;
    }
    submitGrievance(rollNo, subjectId || "", grievanceText);
    toast.success("Grievance submitted for re-evaluation.", { duration: 2500 });
    setGrievanceText("");
  };

  const handleAcceptGrievance = () => {
    acceptGrievance(rollNo, subjectId || "", marks);
    toast.success("Grievance accepted. Marks updated.", { duration: 2500 });
    setScriptGrievance(null);
  };

  const handleRejectGrievance = () => {
    rejectGrievance(rollNo, subjectId || "");
    toast.info("Grievance rejected. Student notified.", { duration: 2500 });
    setScriptGrievance(null);
  };

  const totalMarks = computeTotal(marks);
  const modeLabel = isFresh ? "New Evaluation" : hasGrievance ? "Grievance Review" : "Graded";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Evaluation Viewer</h1>
            <p className="text-xs text-muted-foreground">
              <span className="font-mono text-primary">{subjectCode}</span> — {subjectName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
            isFresh ? "bg-warning/10 text-warning" : hasGrievance ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
          }`}>
            {modeLabel}
          </span>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {isFaculty ? "Faculty Mode" : "Student Mode"}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left: Answer Sheet */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col bg-card/50">
              <div className="border-b border-border px-4 py-2 flex items-center gap-1 overflow-x-auto shrink-0">
                <span className="text-xs text-muted-foreground mr-2 shrink-0">Pages:</span>
                {PAGES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePage(p)}
                    className={`shrink-0 w-8 h-8 rounded-md text-xs font-mono font-semibold transition-colors ${
                      activePage === p
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex-1 relative flex items-center justify-center p-6">
                <button
                  onClick={handlePrev}
                  disabled={activePage === 1}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-16 rounded-lg bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-30 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="w-full max-w-md aspect-[3/4] rounded-lg border border-border bg-background/60 flex flex-col items-center justify-center shadow-xl shadow-black/20">
                  <div className="space-y-4 text-center px-8">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Answer Sheet — Page {activePage}</p>
                      <p className="text-xs text-muted-foreground mt-1">Scanned exam paper for {subjectCode}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Student: Roll {rollNo}</p>
                    </div>
                    <div className="pt-4 space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-2 rounded-full bg-border/50"
                          style={{ width: `${60 + Math.random() * 40}%`, marginLeft: "auto", marginRight: "auto" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={activePage === PAGES.length}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-16 rounded-lg bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-30 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="border-t border-border px-4 py-2 text-center shrink-0">
                <span className="text-xs text-muted-foreground font-mono">Page {activePage} of {PAGES.length}</span>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: Scoring & Grievance */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="border-b border-border px-5 py-4 shrink-0">
                <h2 className="text-sm font-semibold text-foreground">
                  Roll No: <span className="font-mono text-primary">{rollNo}</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Subject: <span className="font-mono text-primary">{subjectCode}</span> — {subjectName}
                </p>
              </div>

              {/* Marks Grid */}
              <div className="px-5 py-4 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Marks Breakdown</h3>
                  {isFaculty && (
                    <button
                      onClick={handleSaveMarks}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Save Marks
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-card">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground border-b border-r border-border">Q</th>
                        {["a", "b", "c", "d", "e"].map((col) => (
                          <th key={col} className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground border-b border-r border-border last:border-r-0 uppercase">{col}</th>
                        ))}
                        <th className="px-3 py-2 text-center text-xs font-semibold text-primary border-b border-border">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map((row, i) => {
                        const rowTotal = Object.values(row.parts).reduce(
                          (s, v) => s + (v === "-" || v === "" ? 0 : parseInt(v) || 0), 0
                        );
                        return (
                          <tr key={row.q} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                            <td className="px-3 py-2 font-mono font-semibold text-foreground border-r border-border">{row.q}</td>
                            {(["a", "b", "c", "d", "e"] as const).map((col) => (
                              <td key={col} className="px-1 py-1 text-center border-r border-border last:border-r-0">
                                {isFaculty ? (
                                  <input
                                    type="text"
                                    value={row.parts[col]}
                                    onChange={(e) => handleMarkChange(i, col, e.target.value)}
                                    className="w-full text-center font-mono text-sm bg-background border border-border rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                                  />
                                ) : (
                                  <span className={`font-mono ${row.parts[col] === "-" ? "text-muted-foreground/50" : "text-foreground"}`}>
                                    {row.parts[col]}
                                  </span>
                                )}
                              </td>
                            ))}
                            <td className="px-3 py-2 text-center font-mono font-semibold text-primary">{rowTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-card border-t border-border">
                        <td colSpan={6} className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border">Grand Total</td>
                        <td className="px-3 py-2 text-center font-mono text-lg font-bold text-primary">{totalMarks}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="border-t border-border mx-5" />

              {/* Grievance Section */}
              <div className="px-5 py-4 flex-1 flex flex-col">
                {role === "student" ? (
                  <div className="space-y-3 flex flex-col flex-1">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Recheck Request</h3>
                    <textarea
                      value={grievanceText}
                      onChange={(e) => setGrievanceText(e.target.value)}
                      placeholder="Describe your concern regarding the evaluation. Reference specific questions and sub-parts..."
                      className="flex-1 min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                    />
                    <button
                      onClick={handleSubmitGrievance}
                      className="w-full rounded-lg bg-warning px-4 py-2.5 text-sm font-semibold text-warning-foreground hover:bg-warning/90 transition-colors"
                    >
                      Submit for Re-evaluation
                    </button>
                  </div>
                ) : hasGrievance && scriptGrievance ? (
                  <div className="space-y-4 flex flex-col flex-1">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Student Grievance</h3>
                    <div className="rounded-lg border border-border bg-background/50 p-4 flex-1">
                      <p className="text-sm text-foreground leading-relaxed">{scriptGrievance.text}</p>
                      <p className="text-xs text-muted-foreground mt-3 font-mono">Submitted: {scriptGrievance.date}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAcceptGrievance}
                        className="flex-1 rounded-lg bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground hover:bg-success/90 transition-colors"
                      >
                        Accept & Update Marks
                      </button>
                      <button
                        onClick={handleRejectGrievance}
                        className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        Reject Grievance
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-sm text-muted-foreground">
                      {isFresh ? "Evaluate the answer sheet and save marks above." : "No grievance filed for this answer sheet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default EvaluationViewer;
