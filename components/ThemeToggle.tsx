import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg bg-forge-800 border border-forge-700 text-forge-muted hover:text-forge-text hover:border-forge-600 transition-all shadow-sm no-print"
            title="Toggle Theme"
        >
            <div className="relative w-5 h-5">
                <Sun className={`w-5 h-5 absolute transition-all duration-300 ${theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} />
                <Moon className={`w-5 h-5 absolute transition-all duration-300 ${theme === 'light' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} />
            </div>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};
