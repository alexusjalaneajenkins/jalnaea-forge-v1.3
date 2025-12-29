import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Edit2, BookOpen, ExternalLink } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { ProjectStep } from '../types';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { GlassCard } from '../components/GlassCard';
import { CopyButton } from '../components/CopyButton';

export const IdeaPage = () => {
    const { state, updateIdea, generateArtifact } = useProject();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const handleRefine = async () => {
        if (!state.ideaInput.trim()) return;
        await generateArtifact(ProjectStep.IDEA);
        setIsEditing(false);
    };

    const showInput = !state.synthesizedIdea || isEditing;

    const quickStarts = [
        "SaaS Dashboard for AI Analytics",
        "Portfolio for 3D Artist",
        "Fitness App for Seniors",
        "Marketplace for Vintage Clothes"
    ];

    return (
        <div className="relative h-full flex flex-col animate-fade-in overflow-hidden">

            {/* Ambient Background - Light mode: subtle violet glow, Dark mode: deep navy */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Light mode gradient */}
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-orange-50/30"></div>
                {/* Dark mode gradient */}
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-forge-950 via-forge-900 to-forge-950"></div>
            </div>

            {showInput ? (
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">

                    <div className="text-center mb-10 space-y-4">
                        {/* Sparkle Icon */}
                        <div className="inline-flex items-center justify-center p-4 mb-4 bg-orange-100 dark:bg-orange-500/20 rounded-2xl">
                            <Sparkles className="w-8 h-8 text-orange-500" />
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                            <span className="text-slate-400 dark:text-slate-400">Vibe Design with</span>
                            <br />
                            <span className="text-orange-500">Real Product Vision</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                            Transform your raw idea into a comprehensive product blueprint using our advanced agentic workflow.
                        </p>
                    </div>

                    {/* Input Card */}
                    <div className="w-full max-w-2xl bg-white dark:bg-forge-800/80 border border-slate-200 dark:border-forge-700 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <textarea
                                className="w-full bg-transparent text-lg text-slate-800 dark:text-white resize-none focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 leading-relaxed min-h-[100px]"
                                placeholder="Describe your dream product..."
                                value={state.ideaInput}
                                onChange={(e) => updateIdea(e.target.value)}
                                autoFocus={!state.synthesizedIdea}
                            />
                        </div>

                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-forge-700 bg-slate-50/50 dark:bg-forge-900/50">
                            {/* Model Badge */}
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="px-1.5 py-0.5 text-[10px] font-bold border border-slate-300 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400">PRO</span>
                                <span>Gemini 2.0 Flash</span>
                            </div>

                            {/* Start Building Button */}
                            <button
                                onClick={handleRefine}
                                disabled={!state.ideaInput.trim() || state.isGenerating}
                                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-orange-500/40"
                            >
                                {state.isGenerating ? (
                                    <>Thinking...</>
                                ) : (
                                    <>Start Building <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Example Chips */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400 self-center">Try example:</span>
                        {quickStarts.map((text, i) => (
                            <button
                                key={i}
                                onClick={() => updateIdea(text)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-forge-800 hover:bg-slate-50 dark:hover:bg-forge-700 border border-slate-200 dark:border-forge-600 rounded-full transition-all"
                            >
                                {text}
                            </button>
                        ))}
                    </div>

                </div>
            ) : (
                /* Result View */
                <div className="max-w-4xl mx-auto w-full h-full flex flex-col p-4 md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-forge-text mb-2">Product Vision</h2>
                            <p className="text-forge-muted">Your crystallized idea.</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-forge-800 hover:bg-slate-50 dark:hover:bg-forge-700 border border-slate-200 dark:border-forge-600 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Input
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200 dark:border-forge-700 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                        <div className="p-4 border-b border-gray-100 dark:border-forge-700 bg-slate-50/80 dark:bg-forge-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                                <Sparkles className="w-4 h-4 text-orange-500" />
                                Generated Vision Statement
                            </div>
                            <CopyButton text={state.synthesizedIdea || ""} />
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-forge-900">
                            <MarkdownRenderer content={state.synthesizedIdea} variant="paper" />
                        </div>
                    </div>

                    {/* NotebookLM Workflow Prompts */}
                    {state.researchMissionPrompt && (
                        <div className="mt-10 animate-fade-in p-1">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-forge-text flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-orange-100 dark:bg-orange-500/20 rounded-lg"><BookOpen className="w-5 h-5 text-orange-500" /></div>
                                        NotebookLM Workflow
                                    </h3>
                                    <p className="text-sm text-forge-muted max-w-lg leading-relaxed">
                                        Use these specialized prompts to generate a comprehensive research report in Google NotebookLM.
                                    </p>
                                </div>
                                <a
                                    href="https://notebooklm.google.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                                >
                                    Launch NotebookLM <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Step 1 */}
                                <GlassCard className="flex flex-col relative overflow-hidden border border-slate-200 dark:border-forge-700 bg-white dark:bg-forge-800/50">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="inline-block text-[10px] font-extrabold tracking-widest text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-2 py-1 rounded mb-2">STEP 1: SOURCE</span>
                                                <h4 className="text-lg font-bold text-forge-text">Context Prompt</h4>
                                            </div>
                                            <CopyButton
                                                text={state.researchMissionPrompt || ""}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 p-2"
                                                title="Copy Source Text"
                                            />
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                                            Create a new Notebook. <br />
                                            Click <span className="text-forge-text font-semibold">Add Source &gt; Paste Text</span>.
                                        </p>
                                        <div className="flex-1 bg-slate-50 dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 font-mono text-xs text-slate-600 dark:text-slate-300 overflow-y-auto custom-scrollbar min-h-[140px]">
                                            {state.researchMissionPrompt}
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* Step 2 */}
                                {state.reportGenerationPrompt && (
                                    <GlassCard className="flex flex-col relative overflow-hidden border border-slate-200 dark:border-forge-700 bg-white dark:bg-forge-800/50">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="inline-block text-[10px] font-extrabold tracking-widest text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 px-2 py-1 rounded mb-2">STEP 2: CHAT</span>
                                                    <h4 className="text-lg font-bold text-forge-text">Report Prompt</h4>
                                                </div>
                                                <CopyButton
                                                    text={state.reportGenerationPrompt || ""}
                                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 p-2"
                                                    title="Copy Chat Prompt"
                                                />
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                                                Once sources are processed,<br />
                                                paste this into the <span className="text-forge-text font-semibold">Chat Box</span>.
                                            </p>
                                            <div className="flex-1 bg-slate-50 dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 font-mono text-xs text-slate-600 dark:text-slate-300 overflow-y-auto custom-scrollbar min-h-[140px]">
                                                {state.reportGenerationPrompt}
                                            </div>
                                        </div>
                                    </GlassCard>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => navigate('/research')}
                            className="bg-forge-text text-white dark:text-forge-950 hover:opacity-90 px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 group"
                        >
                            Continue to Research
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
