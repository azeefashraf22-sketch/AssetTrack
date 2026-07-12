import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar from "../components/Sidebar";
import { logActivity } from "../firebase/activityLogger";

function Issues() {
    const [issues, setIssues] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setIssues(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, []);

    const handleStatusChange = async (issueId, newStatus, assetId, issueTitle) => {
        try {
            await updateDoc(doc(db, "issues", issueId), { status: newStatus });
            await logActivity(assetId, `Issue "${issueTitle}" status "${newStatus}" ho gaya`, "Technician");
        } catch (err) {
            console.log(err.message);
        }
    };
    const handleAddNote = async () => {
        if (!selectedIssue || !noteText.trim()) return;
        setUpdating(true);
        try {
            await updateDoc(doc(db, "issues", selectedIssue.id), {
                technicianNotes: noteText,
            });
            await logActivity(selectedIssue.assetId, `Note add hua issue "${selectedIssue.title}" mein`, "Technician");
            setSelectedIssue(null);
            setNoteText("");
        } catch (err) {
            console.log(err.message);
        }
        setUpdating(false);
    };

    const filteredIssues = issues.filter((issue) => {
        const matchesSearch =
            issue.title?.toLowerCase().includes(search.toLowerCase()) ||
            issue.assetName?.toLowerCase().includes(search.toLowerCase()) ||
            issue.assetCode?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 min-h-screen bg-slate-50 p-6 sm:p-8">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-slate-900">Issues</h1>
                    <p className="text-slate-500 text-sm">Manage reported issues</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="relative w-full md:w-1/3">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, asset name, code..."
                            className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                    {filteredIssues.map((issue) => (
                        <div key={issue.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <h3 className="font-bold text-slate-900">{issue.title}</h3>
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${issue.priority === "High"
                                                ? "bg-red-50 text-red-600"
                                                : issue.priority === "Medium"
                                                    ? "bg-orange-50 text-orange-600"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {issue.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-1.5">
                                        🏷️ {issue.assetName} ({issue.assetCode})
                                    </p>
                                    <p className="text-sm text-slate-600 mb-2 leading-relaxed">{issue.description}</p>
                                    {issue.reporterName && (
                                        <p className="text-xs text-slate-400">Reported by: {issue.reporterName}</p>
                                    )}
                                    {issue.evidenceURL && (
                                        <a
                                            href={issue.evidenceURL}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-amber-600 font-medium hover:text-amber-700 hover:underline inline-block mt-1"
                                        >
                                            📎 View Evidence
                                        </a>
                                    )}
                                    {issue.technicianNotes && (
                                        <div className="bg-amber-50 text-amber-700 text-xs p-2.5 rounded-xl mt-2 font-medium">
                                            📝 {issue.technicianNotes}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 md:items-end">
                                    <select
                                        value={issue.status}
                                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                        className={`text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 ${issue.status === "resolved"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : issue.status === "in-progress"
                                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                                : "bg-amber-50 text-amber-600 border-amber-100"
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>

                                    <button
                                        onClick={() => {
                                            setSelectedIssue(issue);
                                            setNoteText(issue.technicianNotes || "");
                                        }}
                                        className="text-xs text-slate-500 font-medium hover:text-amber-600 transition"
                                    >
                                        + Add Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredIssues.length === 0 && (
                        <p className="text-slate-400 text-center py-12 text-sm">No issues found.</p>
                    )}
                </div>

                {/* Add Note Modal */}
                {selectedIssue && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                            <h3 className="font-bold text-slate-900 mb-4">Technician Note — {selectedIssue.title}</h3>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows="4"
                                placeholder="Write a work note..."
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition mb-4 resize-none"
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => {
                                        setSelectedIssue(null);
                                        setNoteText("");
                                    }}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddNote}
                                    disabled={updating}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {updating && (
                                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    )}
                                    {updating ? "Saving..." : "Save Note"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Issues;