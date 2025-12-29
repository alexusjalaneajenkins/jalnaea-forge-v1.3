import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, ChevronRight, Trash2 } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

export const ResearchPage = () => {
    const { state, addResearch, removeResearch } = useProject();
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
        <div className="relative h-full flex flex-col animate-fade-in overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white to-slate-50"></div>
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-forge-950 via-forge-900 to-forge-950"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col p-6 md:p-12">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 mb-4 bg-purple-100 dark:bg-purple-500/20 rounded-2xl">
                        <BookOpen className="w-8 h-8 text-purple-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        <span className="text-slate-400 dark:text-slate-400">Ground with</span>
                        <br />
                        <span className="text-purple-500">Real Research</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Upload documents or NotebookLM exports to give the AI domain-specific knowledge.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">

                    {/* Upload Area */}
                    <div className="bg-white dark:bg-forge-800/50 border border-slate-200 dark:border-forge-700 rounded-2xl p-2 shadow-xl">
                        <div
                            className={`h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all duration-300 min-h-[300px]
                 ${isDragging ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10' : 'border-slate-200 dark:border-forge-600 hover:border-purple-400 dark:hover:border-purple-500/50'}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={async (e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files[0]) await addResearch(e.dataTransfer.files[0]);
                            }}
                        >
                            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6">
                                <Upload className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">Upload Knowledge</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8 max-w-xs leading-relaxed">
                                Drag & drop PDFs, TXT, MD, JSON files here. <br />Perfect for adding NotebookLM exports.
                            </p>
                            <label className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-purple-500/25 transition-all">
                                <span>Browse Files</span>
                                <input type="file" className="hidden" accept=".pdf,.txt,.md,.json" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    {/* Active Sources */}
                    <div className="bg-white dark:bg-forge-800/50 border border-slate-200 dark:border-forge-700 rounded-2xl p-6 shadow-xl flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-slate-700 dark:text-white flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-500" />
                                Active Sources
                            </h3>
                            <span className="text-xs font-mono text-purple-500 bg-purple-100 dark:bg-purple-500/20 px-2 py-1 rounded">
                                {state.research.length} FILES
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            {state.research.length === 0 ? (
                                <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-forge-600 rounded-xl bg-slate-50 dark:bg-forge-900/50">
                                    <div className="mb-2 p-2 rounded-full bg-slate-100 dark:bg-forge-800">
                                        <BookOpen className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <p className="font-medium">No sources yet</p>
                                    <p className="text-xs mt-0.5">Using base knowledge only</p>
                                </div>
                            ) : (
                                state.research.map((doc) => (
                                    <div key={doc.id} className="group flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-forge-900/50 hover:bg-slate-100 dark:hover:bg-forge-800 border border-slate-200 dark:border-forge-700 transition-all">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-300">
                                            {doc.mimeType === 'application/pdf' ? 'PDF' : 'TXT'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-slate-700 dark:text-white truncate">{doc.name}</div>
                                            <div className="text-xs text-slate-400 dark:text-slate-500">{formatFileSize(doc.content.length, doc.mimeType === 'application/pdf')}</div>
                                        </div>
                                        {removeResearch && (
                                            <button
                                                onClick={() => removeResearch(doc.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                                                title="Remove file"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end pt-8 mt-auto">
                    <button
                        onClick={() => navigate('/prd')}
                        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-purple-500/25 transition-all"
                    >
                        Next: Generate PRD <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
