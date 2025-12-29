import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Edit2, FolderOpen, Settings, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { ProjectStep } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    onOpenProjectList?: () => void;
    onOpenSettings?: () => void;
}

export const Header = ({ onOpenProjectList, onOpenSettings }: HeaderProps) => {
    const { user, signIn, logOut, loading } = useAuth();
    const { openProjectList, state, updateTitle, openSettings } = useProject();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    const handleOpenProjectList = onOpenProjectList || openProjectList;
    const handleOpenSettings = onOpenSettings || openSettings;

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') setIsEditingTitle(false);
    };

    const currentStepNumber = Object.values(ProjectStep).indexOf(state.currentStep) + 1;

    return (
        <header className="h-16 md:h-16 border-b border-slate-200 dark:border-forge-700 bg-white dark:bg-forge-950 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
            {/* Left Side - Logo & Project Info */}
            <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">JALANEA FORGE</span>
                        <span className="text-slate-300 dark:text-slate-600">/</span>
                        {isEditingTitle ? (
                            <input
                                ref={titleInputRef}
                                type="text"
                                value={state.title}
                                onChange={(e) => updateTitle(e.target.value)}
                                onBlur={() => setIsEditingTitle(false)}
                                onKeyDown={handleKeyDown}
                                className="bg-slate-100 dark:bg-forge-800 text-slate-800 dark:text-white font-medium text-sm px-2 py-0.5 rounded border border-slate-300 dark:border-forge-600 focus:outline-none focus:border-orange-500 min-w-[150px]"
                            />
                        ) : (
                            <div
                                onClick={() => setIsEditingTitle(true)}
                                className="font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-forge-800 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-2 group"
                                title="Rename Project"
                            >
                                {state.title}
                                <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500 dark:text-slate-500">AI Product Designer</p>
                        <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
                        <p className="text-xs text-orange-500 font-semibold">
                            Step {currentStepNumber} of 4
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
                {/* Settings Button */}
                <button
                    onClick={handleOpenSettings}
                    className="p-2.5 rounded-lg bg-slate-100 dark:bg-forge-800 border border-slate-200 dark:border-forge-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:border-slate-300 dark:hover:border-forge-600 transition-all"
                    title="AI Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Auth */}
                {loading ? (
                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-forge-800 animate-pulse"></div>
                ) : user ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400 mr-2 hidden md:inline">
                            Welcome, {user.displayName?.split(' ')[0]}
                        </span>

                        <button
                            onClick={handleOpenProjectList}
                            className="p-2.5 rounded-lg bg-slate-100 dark:bg-forge-800 border border-slate-200 dark:border-forge-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                            title="My Projects"
                        >
                            <FolderOpen className="w-5 h-5" />
                        </button>

                        <div
                            onClick={logOut}
                            className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-forge-800 flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-forge-700 text-slate-600 dark:text-slate-400 overflow-hidden cursor-pointer hover:border-red-400 hover:text-red-500 transition-all"
                            title="Sign Out"
                        >
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                user.displayName?.charAt(0) || 'U'
                            )}
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={signIn}
                        className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-orange-500/25 flex items-center gap-2"
                    >
                        <span>Sign in with Google</span>
                    </button>
                )}
            </div>
        </header>
    );
};
