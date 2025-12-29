import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const CopyButton = ({ text, className = "", title = "Copy to Clipboard", variant = "dark" }: { text: string, className?: string, title?: string, variant?: "dark" | "light" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const baseStyles = variant === "light"
        ? "bg-white/80 backdrop-blur-sm border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-white"
        : "bg-forge-800 border-forge-700 text-forge-400 hover:text-forge-text hover:border-forge-500";

    const copiedStyles = "bg-emerald-500/10 border-emerald-500/30 text-emerald-600";

    return (
        <button
            onClick={handleCopy}
            className={`relative p-2 rounded-lg transition-all duration-200 shadow-sm border group ${copied ? copiedStyles : baseStyles} ${className}`}
            title={copied ? "Copied!" : title}
        >
            <div className="relative w-4 h-4">
                <div className={`absolute inset-0 transition-all duration-300 ${copied ? 'scale-0 opacity-0 rotate-45' : 'scale-100 opacity-100 rotate-0'}`}>
                    <Copy className="w-4 h-4" />
                </div>
                <div className={`absolute inset-0 transition-all duration-300 ${copied ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-45'}`}>
                    <Check className="w-4 h-4" />
                </div>
            </div>
        </button>
    );
};
