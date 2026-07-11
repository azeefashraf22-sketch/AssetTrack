import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Incorrect email or password.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-300/50 overflow-hidden">

                {/* Left side */}
                <div className="hidden md:flex flex-col justify-between w-1/2 bg-slate-900 p-10 relative overflow-hidden">
                    {/* Blueprint grid backdrop */}
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-xs tracking-[0.2em] text-slate-400 uppercase">Asset Ops</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">MaintainIQ</h1>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-6">
                            <span className="text-3xl">🛠️</span>
                        </div>
                        <p className="text-slate-200 text-lg font-medium leading-snug mb-2">
                            Secure. Track. Manage.
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            A smart solution to manage your assets — real-time tracking, zero guesswork.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 text-slate-500 text-xs">
                        <span className="h-px flex-1 bg-slate-700" />
                        <span>Trusted by maintenance teams</span>
                        <span className="h-px flex-1 bg-slate-700" />
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="w-full md:w-1/2 p-10 sm:p-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
                    <p className="text-slate-500 text-sm mb-7">Log in to continue to your account.</p>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2.5 rounded-xl mb-5">
                            <span className="text-base leading-none">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.99] transition disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 mt-6 text-center">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-amber-600 font-semibold hover:text-amber-700">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;