import React from 'react';
import { Lightbulb, BookOpen, FileText, Code2, Check, ChevronRight } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { ProjectStep, NavItem } from '../types';

// --- Types & Config ---

export const navItems: NavItem[] = [
    { label: 'Idea', step: ProjectStep.IDEA, icon: Lightbulb, path: '/' },
    { label: 'Research', step: ProjectStep.RESEARCH, icon: BookOpen, path: '/research' },
    { label: 'PRD', step: ProjectStep.PRD, icon: FileText, path: '/prd' },
    { label: 'Realization', step: ProjectStep.CODE, icon: Code2, path: '/realization' },
];

interface SidebarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    onOpenSupport?: () => void;
}

// --- Components ---

const SidebarLink = ({ item, isActive, isComplete }: { item: NavItem, isActive: boolean, isComplete?: boolean }) => {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-forge-800 hover:text-slate-900 dark:hover:text-white'
                }`}
        >
            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            <span className="font-medium text-sm">{item.label}</span>
            <div className="ml-auto flex items-center gap-2">
                {isComplete && !isActive && <Check className="w-4 h-4 text-emerald-500" />}
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
            </div>
        </div>
    );
};

export const Sidebar = ({ currentPath, onNavigate, onOpenSupport }: SidebarProps) => {
    const { state, openSupport } = useProject();
    const handleOpenSupport = onOpenSupport || openSupport;

    const handleItemClick = (item: NavItem) => {
        onNavigate(item.path);
    };

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-forge-700 bg-white dark:bg-forge-950 p-6 flex flex-col gap-2 hidden md:flex overflow-y-auto custom-scrollbar">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-4 flex-shrink-0">Workflow</div>
            {navItems.map((item) => {
                // Determine completion status
                let isComplete = false;
                if (item.step === ProjectStep.IDEA && state.synthesizedIdea) isComplete = true;
                if (item.step === ProjectStep.RESEARCH && state.research.length > 0) isComplete = true;
                if (item.step === ProjectStep.PRD && state.prdOutput) isComplete = true;
                if (item.step === ProjectStep.CODE && state.antigravityPrompt) isComplete = true;

                return (
                    <div key={item.path} onClick={() => handleItemClick(item)} className="cursor-pointer group relative">
                        <SidebarLink
                            item={item}
                            isActive={currentPath === item.path}
                            isComplete={isComplete}
                        />
                    </div>
                );
            })}

            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-forge-700">
                {/* Pro Tip Card */}
                <div className="bg-slate-50 dark:bg-forge-800/50 p-4 rounded-xl border border-slate-200 dark:border-forge-700">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200 text-sm mb-2">Pro Tip</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Add NotebookLM exports in the Research tab to ground the model.
                    </p>
                </div>

                {/* Made by Link */}
                <a
                    href="https://jalanea.com"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block p-3 rounded-xl border border-slate-200 dark:border-forge-700 bg-white dark:bg-forge-900/30 hover:bg-slate-50 dark:hover:bg-forge-800 transition-colors text-center group"
                >
                    <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Made by</span>
                    <div className="font-bold text-slate-700 dark:text-white mt-1">Meet Jalanea ↗</div>
                </a>

                {/* Support Button */}
                <button
                    onClick={() => handleOpenSupport()}
                    className="mt-4 block w-full p-3 rounded-xl border border-slate-200 dark:border-forge-700 bg-white dark:bg-forge-900/30 hover:bg-slate-50 dark:hover:bg-forge-800 transition-colors text-center group"
                >
                    <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Need Help?</span>
                    <div className="font-bold text-slate-700 dark:text-white mt-1">Get Support</div>
                </button>
            </div>
        </aside>
    );
};

export const MobileNav = ({ currentPath, onNavigate }: { currentPath: string, onNavigate: (path: string) => void }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-forge-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-forge-700 z-50 flex items-center justify-around px-2 pb-safe">
            {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                    <div
                        key={item.path}
                        onClick={() => onNavigate(item.path)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all w-full
              ${isActive ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}
            `}
                    >
                        <item.icon className={`w-5 h-5 mb-1`} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
};
