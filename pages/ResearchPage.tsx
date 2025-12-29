import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, ChevronRight } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { PageBackground } from '../components/PageBackground';
import { GlassCard } from '../components/GlassCard';

export const ResearchPage = () => {
    const { state, addResearch, generateResearchPrompt } = useProject();
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await addResearch(e.target.files[0]);
        }
    };

    const formatFileSize = (bytes: number, isBase64: boolean) => {
        const realBytes = isBase64 ? bytes * 0.75 : bytes;
        return (realBytes / 1024).toFixed(1) + ' KB';
    };

    return (
        <PageBackground glowColor="purple">
            <div className="max-w-5xl mx-auto min-h-full flex flex-col justify-center p-6 md:p-12 animate-fade-in relative z-10">
                <div className="mb-10 text-center mt-auto md:mt-0">
                    <h2 className="text-4xl font-bold text-forge-text mb-3 tracking-tight">Research & Context</h2>
                    <p className="text-forge-muted text-lg max-w-2xl mx-auto">
                        Ground the AI in your specific domain. Upload documents or review the automated research mission.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 flex-1 min-h-0">

                    {/* Upload Area */}
                    <GlassCard className="flex flex-col p-2 transition-colors" hoverEffect={true}>
                        <div
                            className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300
                 ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-forge-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-white/5'}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={async (e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files[0]) await addResearch(e.dataTransfer.files[0]);
                            }}
                        >
                            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                                <Upload className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-medium text-forge-text mb-2">Upload Knowledge</h3>
                            <p className="text-forge-muted text-sm text-center mb-8 max-w-xs leading-relaxed">
                                Drag & drop PDFs, TXT, MD, JSON files here. <br /> Perfect for adding NotebookLM exports.
                            </p>
                            <label className="cursor-pointer group relative overflow-hidden rounded-xl bg-purple-600 px-8 py-3 transition-all hover:bg-purple-500 shadow-lg shadow-purple-500/25">
                                <span className="relative font-semibold text-white">Browse Files</span>
                                <input type="file" className="hidden" accept=".pdf,.txt,.md,.json" onChange={handleFileChange} />
                            </label>
                        </div>
                    </GlassCard>

                    {/* Active Sources Only - Prompts removed as per new flow */}
                    <GlassCard className="flex-1 flex flex-col p-6 min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-forge-text flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-400" />
                                Active Sources
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-purple-400/80 bg-purple-400/10 px-2 py-1 rounded">
                                    {state.research.length} FILES
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            {state.research.length === 0 ? (
                                <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-forge-muted text-sm border-2 border-dashed border-forge-200 dark:border-white/10 rounded-xl bg-forge-50 dark:bg-white/5">
                                    <div className="mb-2 p-2 rounded-full bg-white/50 dark:bg-white/5">
                                        <BookOpen className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <p className="font-medium">No sources yet</p>
                                    <p className="text-xs text-forge-muted mt-0.5">Using base knowledge only</p>
                                </div>
                            ) : (
                                state.research.map((doc) => (
                                    <div key={doc.id} className="group flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-white/5 hover:bg-forge-50 dark:hover:bg-white/10 border border-forge-200 dark:border-white/5 transition-all shadow-sm dark:shadow-none">
                                        <div className="w-10 h-10 rounded-lg bg-forge-100 dark:bg-slate-900 border border-forge-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-forge-muted dark:text-slate-400">
                                            {doc.mimeType === 'application/pdf' ? 'PDF' : 'TXT'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-forge-text dark:text-slate-200 truncate">{doc.name}</div>
                                            <div className="text-xs text-forge-muted dark:text-slate-500">{formatFileSize(doc.content.length, doc.mimeType === 'application/pdf')}</div>
                                        </div>
                                        <button
                                            className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-400 transition-all"
                                            title="Remove (Not implemented in demo)"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400/50"></div>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlassCard>

                </div>

                <div className="flex justify-end pt-6 border-t border-forge-200 dark:border-white/10">
                    <button
                        onClick={() => navigate('/prd')}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:shadow-purple-500/40"
                    >
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left" />
                        <span className="relative flex items-center gap-2">
                            Next: Generate PRD <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>
        </PageBackground>
    );
};
