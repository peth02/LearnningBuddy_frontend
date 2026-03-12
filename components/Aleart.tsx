'use client'
import { useEffect } from "react";

type AlertType = "success" | "error";

interface AlertProps {
  message: string;
  type: AlertType;
  onClose: () => void;
}

export default function Alert({ message, type, onClose }: AlertProps) {
  // ตั้งเวลาให้หายไปเองหลังจาก 3 วินาที
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className={`
      flex items-center gap-4 bg-white p-5 rounded-3xl shadow-2xl border 
      animate-in fade-in slide-in-from-right-10 duration-500
      ${isSuccess ? "border-green-100" : "border-red-100"}
    `}>
      {/* Icon Area */}
      <div className={`
        w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
        ${isSuccess ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
      `}>
        {isSuccess ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        )}
      </div>

      {/* Text Area */}
      <div className="flex-1 min-w-[200px]">
        <h4 className={`text-[10px] font-black uppercase tracking-widest ${isSuccess ? "text-green-700" : "text-red-700"}`}>
          {type}
        </h4>
        <p className="text-sm font-bold text-gray-700 mt-0.5">{message}</p>
      </div>

      {/* Close Button */}
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  );
}