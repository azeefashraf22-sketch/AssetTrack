import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { logActivity } from "../firebase/activityLogger";

function AssetPublicPage() {
    const { assetCode } = useParams();
    const [asset, setAsset] = useState(null);
    const [issues, setIssues] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [reporterName, setReporterName] = useState("");
    const [evidenceURL, setEvidenceURL] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchAsset = async () => {
            const q = query(collection(db, "assets"), where("assetCode", "==", assetCode));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                setAsset({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
            }
            setLoading(false);
        };
        fetchAsset();
    }, [assetCode]);

    useEffect(() => {
        if (!asset) return;
        const q = query(
            collection(db, "issues"),
            where("assetId", "==", asset.id),
            orderBy("createdAt", "desc")
        );
        const unsub = onSnapshot(q, (snapshot) => {
            setIssues(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, [asset]);

    useEffect(() => {
        if (!asset) return;
        const q = query(
            collection(db, "activityLogs"),
            where("assetId", "==", asset.id),
            orderBy("timestamp", "desc")
        );
        const unsub = onSnapshot(q, (snapshot) => {
            setActivityLogs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, [asset]);

    const handleReportIssue = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDoc(collection(db, "issues"), {
                assetId: asset.id,
                assetCode: asset.assetCode,
                assetName: asset.name,
                title,
                description,
                priority,
                reporterName: reporterName || "Anonymous",
                evidenceURL,
                status: "pending",
                technicianNotes: "",
                createdAt: serverTimestamp(),
            });

            await logActivity(asset.id, `Issue report hua: "${title}"`, reporterName || "Anonymous");

            setTitle("");
            setDescription("");
            setPriority("Low");
            setReporterName("");
            setEvidenceURL("");
            setShowForm(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        } catch (err) {
            console.log(err.message);
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                    Loading...
                </div>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-red-500 text-sm font-medium">Asset not found. Please check the code.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <h1 className="text-lg font-bold text-slate-900">MaintainIQ</h1>
                    </div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Asset Public Page</p>
                </div>

                {success && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm p-3 rounded-xl mb-4 text-center font-medium">
                        ✅ Issue reported successfully! A technician will look into it soon.
                    </div>
                )}

                {/* Asset Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{asset.name}</h2>
                            <p className="text-sm text-slate-400 font-mono">{asset.assetCode}</p>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${asset.status === "active"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-amber-50 text-amber-600"
                                }`}
                        >
                            {asset.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4 bg-slate-50 rounded-xl p-3">
                        <p><span className="text-slate-400">Category:</span> <span className="text-slate-700 font-medium">{asset.category}</span></p>
                        <p><span className="text-slate-400">Location:</span> <span className="text-slate-700 font-medium">{asset.location}</span></p>
                    </div>

                    {asset.description && (
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{asset.description}</p>
                    )}

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-[0.99] transition"
                    >
                        {showForm ? "Cancel" : "⚠️ Report an Issue"}
                    </button>
                </div>

                {/* Report Issue Form */}
                {showForm && (
                    <form
                        onSubmit={handleReportIssue}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 space-y-4"
                    >
                        <h3 className="font-bold text-slate-900 mb-1">Report Issue</h3>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={reporterName}
                                onChange={(e) => setReporterName(e.target.value)}
                                placeholder="Optional"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Issue Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Screen is not working"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Description *
                            </label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the issue in detail"
                                rows="3"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Evidence Image Link (Optional)
                            </label>
                            <input
                                type="url"
                                value={evidenceURL}
                                onChange={(e) => setEvidenceURL(e.target.value)}
                                placeholder="https://imgbb.com/... or any image link"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting && (
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {submitting ? "Submitting..." : "Submit Issue"}
                        </button>
                    </form>
                )}

                {/* Asset History / Issues */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Asset History / Issues</h3>
                    <div className="space-y-3">
                        {issues.length === 0 && (
                            <p className="text-slate-400 text-sm text-center py-6">
                                No issues have been reported yet.
                            </p>
                        )}
                        {issues.map((issue) => (
                            <div key={issue.id} className="border-b border-slate-50 last:border-0 pb-3">
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{issue.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{issue.description}</p>
                                        {issue.reporterName && (
                                            <p className="text-xs text-slate-400 mt-1">Reported by: {issue.reporterName}</p>
                                        )}
                                        {issue.technicianNotes && (
                                            <p className="text-xs text-amber-600 mt-1">📝 {issue.technicianNotes}</p>
                                        )}
                                    </div>
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${issue.status === "resolved"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : issue.status === "in-progress"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-amber-50 text-amber-600"
                                            }`}
                                    >
                                        {issue.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
                    <h3 className="font-bold text-slate-900 mb-4">Activity Timeline</h3>
                    <div className="space-y-4">
                        {activityLogs.length === 0 && (
                            <p className="text-slate-400 text-sm text-center py-6">
                                No activity has been recorded yet.
                            </p>
                        )}
                        {activityLogs.map((log, index) => (
                            <div key={log.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1"></div>
                                    {index !== activityLogs.length - 1 && (
                                        <div className="w-px flex-1 bg-slate-200 my-1"></div>
                                    )}
                                </div>
                                <div className="pb-3">
                                    <p className="text-sm text-slate-700">{log.action}</p>
                                    <p className="text-xs text-slate-400">
                                        by {log.performedBy} •{" "}
                                        {log.timestamp?.toDate
                                            ? log.timestamp.toDate().toLocaleString()
                                            : "Just now"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link to="/dashboard" className="text-amber-600 text-sm font-medium hover:text-amber-700 hover:underline">
                        ← MaintainIQ dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AssetPublicPage;