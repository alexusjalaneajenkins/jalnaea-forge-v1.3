import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Edit2, BookOpen, ExternalLink, Copy, Check } from 'lucide-react';
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

            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen"></div>

            {showInput ? (
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">

                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center justify-center p-3 mb-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                            <Sparkles className="w-8 h-8 text-orange-400" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-orange-200 tracking-tight leading-tight drop-shadow-sm">
                            Vibe Design with <br />
                            <span className="text-orange-400">Real Product Vision</span>
                        </h1>
                        <p className="text-lg text-forge-muted max-w-2xl mx-auto leading-relaxed">
                            Transform your raw idea into a comprehensive product blueprint using our advanced agentic workflow.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-2 shadow-2xl ring-1 ring-white/5 group focus-within:ring-orange-500/50 focus-within:bg-white/10 transition-all duration-300">
                        <div className="relative">
                            <textarea
                                className="w-full bg-transparent p-6 text-xl text-white resize-none focus:outline-none placeholder-forge-500 leading-relaxed min-h-[120px] scrollbar-hide"
                                placeholder="Describe your dream product..."
                                value={state.ideaInput}
                                onChange={(e) => updateIdea(e.target.value)}
                                autoFocus={!state.synthesizedIdea}
                            />

                            <div className="flex items-center justify-between px-4 pb-2 pt-2 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-forge-500 font-mono">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-forge-400">
                                        <span className="text--[10px] border border-forge-600 px-1 rounded">PRO</span>
                                        Gemini 2.0 Flash
                                    </div>
                                </div>
                                <button
                                    onClick={handleRefine}
                                    disabled={!state.ideaInput.trim() || state.isGenerating}
                                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                >
                                    {state.isGenerating ? (
                                        <>Thinking...</>
                                    ) : (
                                        <>Start Building <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in-up delay-100">
                        <span className="text-sm text-forge-muted mr-1 self-center">Try example:</span>
                        {quickStarts.map((text, i) => (
                            <button
                                key={i}
                                onClick={() => updateIdea(text)}
                                className="px-4 py-1.5 text-xs font-medium text-forge-300 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full transition-all hover:text-white"
                            >
                                {text}
                            </button>
                        ))}
                    </div>

                </div>
            ) : (
                /* Result View (Kept mostly same but cleaner container) */
                <div className="max-w-4xl mx-auto w-full h-full flex flex-col p-4 md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-forge-text mb-2">Product Vision</h2>
                            <p className="text-forge-muted">Your crystallized idea.</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-sm font-medium text-forge-300 bg-forge-800/50 hover:bg-forge-800 border border-forge-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Input
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                        <div className="p-4 border-b border-gray-100 bg-slate-50/80 flex items-center justify-between backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                <Sparkles className="w-4 h-4 text-orange-500" />
                                Generated Vision Statement
                            </div>
                            <CopyButton text={state.synthesizedIdea || ""} />
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                            <MarkdownRenderer content={state.synthesizedIdea} variant="paper" />
                        </div>
                    </div>

                    {/* NotebookLM Worflow Prompts */}
                    {/* NotebookLM Worflow Prompts */}
                    {state.researchMissionPrompt && (
                        <div className="mt-10 animate-fade-in-up delay-100 p-1">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-white/10 rounded-lg"><BookOpen className="w-5 h-5 text-orange-400" /></div>
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
                                <GlassCard className="flex flex-col relative overflow-hidden group border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="inline-block text-[10px] font-extrabold tracking-widest text-purple-300 bg-purple-500/20 px-2 py-1 rounded mb-2">STEP 1: SOURCE</span>
                                                <h4 className="text-lg font-bold text-white">Context Prompt</h4>
                                            </div>
                                            <CopyButton
                                                text={state.researchMissionPrompt || ""}
                                                className="text-slate-400 hover:text-white hover:bg-white/10 p-2"
                                                title="Copy Source Text"
                                            />
                                        </div>
                                        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                            Create a new Notebook. <br />
                                            Click <span className="text-white font-semibold">Add Source &gt; Paste Text</span>.
                                        </p>
                                        <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300 overflow-y-auto custom-scrollbar min-h-[140px] shadow-inner">
                                            {state.researchMissionPrompt}
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* Step 2 */}
                                {state.reportGenerationPrompt && (
                                    <GlassCard className="flex flex-col relative overflow-hidden group border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="inline-block text-[10px] font-extrabold tracking-widest text-blue-300 bg-blue-500/20 px-2 py-1 rounded mb-2">STEP 2: CHAT</span>
                                                    <h4 className="text-lg font-bold text-white">Report Prompt</h4>
                                                </div>
                                                <CopyButton
                                                    text={state.reportGenerationPrompt || ""}
                                                    className="text-slate-400 hover:text-white hover:bg-white/10 p-2"
                                                    title="Copy Chat Prompt"
                                                />
                                            </div>
                                            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                                Once sources are processed,<br />
                                                paste this into the <span className="text-white font-semibold">Chat Box</span>.
                                            </p>
                                            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300 overflow-y-auto custom-scrollbar min-h-[140px] shadow-inner">
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
                            className="bg-forge-text text-forge-950 hover:bg-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 group"
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
