import React from "react";

export function Input({ label, placeholder, value = "", onChange, enabled = true, className }) {
    return (
        <div className="flex flex-col">
            <label className="text-[#B4B4B4] text-[12px]">{label}</label>
            <input
                className={`rounded-[15px] border-[1px] border-[#B4B4B4] h-[60px] p-[20px] ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!enabled}
            />
        </div>
    );
}