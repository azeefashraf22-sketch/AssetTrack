import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

const toastStyle = {
    fontFamily: "'Poppins', sans-serif",
    borderRadius: '16px',
    background: '#ffffff',
    color: '#1e293b', // slate-800
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px border-slate-100',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '500',
};

export const showSuccessToast = (message) => {
    toast.success(message, {
        style: toastStyle,
        icon: <CheckCircle2 className="text-emerald-500 animate-bounce" size={22} />,
        duration: 3000,
    });
};

export const showErrorToast = (message) => {
    toast.error(message, {
        style: toastStyle,
        icon: <XCircle className="text-red-500 animate-pulse" size={22} />,
        duration: 4000,
    });
};

export const showInfoToast = (message) => {
    toast(message, {
        style: toastStyle,
        icon: <Info className="text-blue-500" size={22} />,
        duration: 3000,
    });
};

export const showWarningToast = (message) => {
    toast(message, {
        style: toastStyle,
        icon: <AlertTriangle className="text-amber-500" size={22} />,
        duration: 3500,
    });
};