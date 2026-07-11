import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: "📊" },
        { name: "Assets", path: "/assets", icon: "📦" },
        { name: "Issues", path: "/issues", icon: "⚠️" },
    ];

    return (
        <>
            {/* Mobile top bar with toggle button */}
            <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h1 className="text-base font-bold text-slate-900">MaintainIQ</h1>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            {/* Backdrop (mobile only) */}
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Sidebar drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 p-5 transform transition-transform duration-300 ease-in-out
                    md:static md:translate-x-0 md:z-auto md:shadow-lg md:w-56 md:min-h-screen md:p-4
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between mb-1 px-2">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">MaintainIQ</h1>
                        <p className="text-xs text-slate-400">Asset Management</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="space-y-1 mt-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition ${location.pathname === item.path
                                ? "bg-amber-50 text-amber-700 font-semibold"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}

export default Sidebar;