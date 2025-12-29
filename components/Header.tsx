import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Edit2, FolderOpen, Settings } from 'lucide-react';
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

    // Use props if provided, otherwise fallback to context (for flexibility)
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

    return (
        <header className="h-16 md:h-20 border-b border-forge-200 dark:border-forge-700 bg-white/80 dark:bg-forge-950/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-forge-accent flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-xl tracking-tight text-forge-text leading-tight">JALANEA FORGE</span>
                        <span className="text-forge-700">/</span>
                        {isEditingTitle ? (
                            <input
                                ref={titleInputRef}
                                type="text"
                                value={state.title}
                                onChange={(e) => updateTitle(e.target.value)}
                                onBlur={() => setIsEditingTitle(false)}
                                onKeyDown={handleKeyDown}
                                className="bg-forge-900 text-forge-text font-medium text-sm px-2 py-0.5 rounded border border-forge-700 focus:outline-none focus:border-forge-accent min-w-[150px]"
                            />
                        ) : (
                            <div
                                onClick={() => setIsEditingTitle(true)}
                                className="font-medium text-forge-text hover:bg-forge-900 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-2 group"
                                title="Rename Project"
                            >
                                {state.title}
                                <Edit2 className="w-3 h-3 text-forge-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-forge-500 font-medium mt-0.5">AI Product Designer</p>
                        <span className="text-forge-700 text-xs mt-0.5">•</span>
                        <p className="text-xs text-forge-accent font-semibold mt-0.5">
                            Step {(Object.values(ProjectStep).indexOf(state.currentStep) + 1)} of 4
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleOpenProjectList}
                    className="p-2 rounded-lg bg-forge-800 border border-forge-700 text-forge-muted hover:text-forge-text hover:border-forge-600 transition-all shadow-sm md:hidden"
                    title="My Projects"
                >
                    <FolderOpen className="w-5 h-5" />
                </button>
                <button
                    onClick={handleOpenSettings}
                    className="p-2 rounded-lg bg-forge-800 border border-forge-700 text-forge-muted hover:text-forge-text hover:border-forge-600 transition-all shadow-sm"
                    title="AI Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
                <ThemeToggle />
                {loading ? (
                    <div className="h-8 w-8 rounded-full bg-forge-800 animate-pulse"></div>
                ) : user ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-forge-muted mr-2 hidden md:inline">Welcome, {user.displayName?.split(' ')[0]}</span>

                        <button
                            onClick={handleOpenProjectList}
                            className="p-2 text-forge-muted hover:text-forge-text hover:bg-forge-800 rounded-lg transition-colors mr-2"
                            title="My Projects"
                        >
                            <FolderOpen className="w-5 h-5" />
                        </button>

                        <div
                            onClick={logOut}
                            className="h-9 w-9 rounded-full bg-forge-800 flex items-center justify-center text-xs font-bold border border-forge-700 text-forge-muted overflow-hidden cursor-pointer hover:border-red-500 hover:text-red-500 transition-all shadow-sm"
                            title="Sign Out"
                        >
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                user.displayName?.charAt(0) || 'U'
                            )}
                        </div>
                        {/* Mobile Menu Button - Hidden as we use Bottom Nav now */}
                    </div>
                ) : (
                    <button
                        onClick={signIn}
                        className="text-sm font-semibold bg-forge-accent hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                        <span>Sign in with Google</span>
                    </button>
                )}
            </div>
        </header>
    );
};
