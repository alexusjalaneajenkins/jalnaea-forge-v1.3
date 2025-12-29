import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Edit2, RefreshCw, FileText, Check, ArrowDownToLine, Download, Brain, ChevronRight } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useProject } from '../contexts/ProjectContext';
import { ProjectStep } from '../types';
import * as GeminiService from '../services/geminiService';
import { LoadingState } from '../components/LoadingState';
import { CopyButton } from '../components/CopyButton';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

// Helper
const exportToPDF = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return Promise.resolve();

    // @ts-ignore
    const html2pdfLib = html2pdf;

    const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    return html2pdfLib().set(opt).from(element).save();
};

export const PrdPage = () => {
    const { state, generateArtifact, updatePrd } = useProject();
    const [isExporting, setIsExporting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [showRefineModal, setShowRefineModal] = useState(false);
    const [refineInstruction, setRefineInstruction] = useState("");
    const [isRefining, setIsRefining] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (state.prdOutput) {
            setEditContent(state.prdOutput);
        }
    }, [state.prdOutput]);

    const handleGenerate = async () => {
        if (state.prdOutput && !confirm("This will regenerate the PRD and overwrite your current version. Are you sure?")) {
            return;
        }
        await generateArtifact(ProjectStep.PRD);
    };

    const handleManualSave = () => {
        updatePrd(editContent);
        setIsEditing(false);
    };

    const handleAiRefine = async () => {
        if (!refineInstruction.trim()) return;
        setIsRefining(true);
        try {
            const refinedPrd = await GeminiService.refinePrd(state.prdOutput, refineInstruction);
            updatePrd(refinedPrd);
            setShowRefineModal(false);
            setRefineInstruction("");
        } catch (e) {
            alert("Failed to refine PRD. See console.");
            console.error(e);
        } finally {
            setIsRefining(false);
        }
    };

    return (
        <div className="relative h-full flex flex-col animate-fade-in overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30"></div>
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-forge-950 via-forge-900 to-forge-950"></div>
            </div>

            {/* Refine Modal */}
            {showRefineModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg bg-white dark:bg-forge-900 border border-slate-200 dark:border-forge-700 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Refine with AI</h3>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                Tell the AI how to improve this document. Be specific.
                                <br />
                                <span className="text-xs opacity-70">"Add a section for GDPR", "Make the tone more corporate"</span>
                            </p>
                            <textarea
                                value={refineInstruction}
                                onChange={(e) => setRefineInstruction(e.target.value)}
                                className="w-full h-32 bg-slate-50 dark:bg-forge-800 border border-slate-200 dark:border-forge-700 rounded-xl p-4 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none mb-6"
                                placeholder="e.g. Add a 'Security Requirements' section focused on OAuth2..."
                                autoFocus
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowRefineModal(false)}
                                    className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAiRefine}
                                    disabled={isRefining || !refineInstruction.trim()}
                                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isRefining ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    {isRefining ? "Refining..." : "Refine PRD"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col p-6 md:p-12">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center justify-center p-3 mb-4 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
                            <FileText className="w-6 h-6 text-orange-500" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">Product Requirements</h1>
                        <p className="text-slate-500 dark:text-slate-400">Synthesize your Idea and Research into a structured PRD.</p>
                    </div>
                    <div className="flex gap-3">
                        {state.prdOutput && (
                            <>
                                <button
                                    onClick={() => setShowRefineModal(true)}
                                    className="bg-slate-100 dark:bg-forge-800 hover:bg-slate-200 dark:hover:bg-forge-700 text-orange-500 border border-slate-200 dark:border-forge-700 px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" /> Refine
                                </button>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 border ${isEditing ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-100 dark:bg-forge-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-forge-700 hover:bg-slate-200 dark:hover:bg-forge-700'}`}
                                >
                                    <Edit2 className="w-4 h-4" /> {isEditing ? 'Done Editing' : 'Edit'}
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleGenerate}
                            disabled={state.isGenerating}
                            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
                        >
                            {state.isGenerating ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : <RefreshCw className="w-5 h-5" />}
                            {state.prdOutput ? 'Regenerate' : 'Generate'}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-0 flex flex-col">
                    {state.isGenerating ? (
                        <div className="flex-1 flex items-center justify-center">
                            <LoadingState type="brain" message="Architecting Project" subMessage="Analyzing research, defining personas, and outlining core features..." />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col bg-white dark:bg-forge-800/50 border border-slate-200 dark:border-forge-700 rounded-2xl shadow-xl overflow-hidden">
                            {/* Toolbar */}
                            <div className="p-4 border-b border-slate-100 dark:border-forge-700 bg-slate-50 dark:bg-forge-900/50 flex items-center justify-between">
                                <span className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    {isEditing ? "Editing PRD..." : "PRD Document"}
                                </span>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <button
                                            onClick={handleManualSave}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 hover:bg-green-500 hover:text-white transition-colors"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Save Changes
                                        </button>
                                    ) : (
                                        state.prdOutput && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setIsExporting(true);
                                                        setTimeout(() => {
                                                            exportToPDF('prd-pdf-export-overlay', 'Project_PRD.pdf')
                                                                .catch(err => console.error(err))
                                                                .finally(() => setIsExporting(false));
                                                        }, 500);
                                                    }}
                                                    disabled={isExporting}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-white dark:bg-forge-800 border border-slate-200 dark:border-forge-700 text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-colors disabled:opacity-50"
                                                    title="Save as PDF"
                                                >
                                                    {isExporting ? <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div> : <ArrowDownToLine className="w-3.5 h-3.5" />}
                                                    {isExporting ? 'Exporting...' : 'Export PDF'}
                                                </button>
                                                <CopyButton
                                                    text={state.prdOutput}
                                                    className="bg-white dark:bg-forge-800 border-slate-200 dark:border-forge-700 text-slate-600 dark:text-slate-400"
                                                    title="Copy to Clipboard"
                                                />
                                            </>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Content / Editor */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-forge-900/30">
                                {isEditing ? (
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full h-full bg-transparent text-slate-800 dark:text-slate-200 font-mono text-sm p-8 focus:outline-none resize-none"
                                        spellCheck={false}
                                    />
                                ) : (
                                    <div className="p-8 md:p-12">
                                        <div id="prd-content-area" className="text-slate-700 dark:text-slate-200">
                                            {state.prdOutput ? (
                                                <>
                                                    <MarkdownRenderer content={state.prdOutput} />

                                                    {/* Export Overlay */}
                                                    {isExporting && (
                                                        <div className="fixed inset-0 z-[9999] bg-slate-950/95 flex flex-col items-center justify-center p-8 backdrop-blur-sm">
                                                            <div className="mb-6 p-4 rounded-full bg-orange-500/10 animate-bounce">
                                                                <Download className="w-8 h-8 text-orange-500" />
                                                            </div>
                                                            <h3 className="text-2xl font-bold text-white mb-2">Generating Professional PDF...</h3>
                                                            <p className="text-slate-400 mb-8">Please wait while we format your document.</p>

                                                            <div className="max-w-[800px] w-full max-h-[60vh] overflow-y-auto rounded-lg shadow-2xl custom-scrollbar">
                                                                <div id="prd-pdf-export-overlay" className="bg-white text-black p-12 w-full h-auto">
                                                                    <MarkdownRenderer content={state.prdOutput} variant="paper" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                                                    <div className="p-6 bg-orange-100 dark:bg-orange-500/20 rounded-full mb-6">
                                                        <Brain className="w-16 h-16 text-orange-500" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ready to Architect</h3>
                                                    <p className="text-center max-w-md leading-relaxed">
                                                        Click Generate to transform your vision into a professional requirements document.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Nav */}
                            {state.prdOutput && !isEditing && (
                                <div className="p-4 border-t border-slate-100 dark:border-forge-700 bg-slate-50 dark:bg-forge-900/50 flex justify-end">
                                    <button
                                        onClick={() => navigate('/realization')}
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
                                    >
                                        Proceed to Realization <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
