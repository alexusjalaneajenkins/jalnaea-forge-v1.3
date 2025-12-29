import React, { useState } from 'react';
import { RefreshCw, Sparkles, Check, Map, Code2, ExternalLink, Terminal, ArrowRight, ArrowDownToLine } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { ProjectStep } from '../types';
import { PageBackground } from '../components/PageBackground';
import { LoadingState } from '../components/LoadingState';
import { CopyButton } from '../components/CopyButton';

export const RealizationPage = () => {
    const { state, generateArtifact, toggleStepCompletion } = useProject();
    const [expandedPhase, setExpandedPhase] = useState<number | null>(0); // Default open first phase

    // Safe parsing
    let roadmapPhases: any[] = [];
    try {
        if (state.roadmapOutput) {
            const jsonStr = state.roadmapOutput.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            roadmapPhases = Array.isArray(parsed) ? parsed : (parsed.phases || []);
        }
    } catch (e) {
        console.error("Failed to parse roadmap usage", e);
    }

    // Calculate Progress
    const allSteps = roadmapPhases.flatMap((p, pIdx) => p.steps?.map((s: any, sIdx: number) => ({ ...s, id: `${pIdx}-${sIdx}` })));
    const totalSteps = allSteps.length;
    const completedCount = (state.completedRoadmapSteps || []).length;
    const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    // Helper for Badges
    const getBadge = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('setup') || n.includes('init') || n.includes('config')) return { label: 'Setup', color: 'bg-slate-500/20 text-slate-300' };
        if (n.includes('database') || n.includes('auth') || n.includes('backend') || n.includes('api')) return { label: 'Backend', color: 'bg-green-500/20 text-green-300' };
        if (n.includes('ui') || n.includes('frontend') || n.includes('component') || n.includes('page')) return { label: 'Frontend', color: 'bg-blue-500/20 text-blue-300' };
        return { label: 'Task', color: 'bg-slate-500/20 text-slate-300' };
    };

    return (
        <PageBackground glowColor="blue">
            <div className="max-w-5xl mx-auto min-h-full flex flex-col p-6 md:p-12 animate-fade-in relative z-10 gap-8 pb-32">

                {/* Header with Progress */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl font-bold text-forge-text mb-2 tracking-tight">Realization Engine</h2>
                            <p className="text-forge-muted text-lg">Execute your plan: Task by task.</p>
                        </div>

                        {/* Actions: Generate or Regenerate */}
                        <div className="flex items-center gap-3">
                            {/* Show 'Regenerate' if output exists (Secondary action) */}
                            {state.roadmapOutput && !state.isGenerating && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("Regenerating the roadmap will overwrite your current progress and tasks. Are you sure?")) {
                                            generateArtifact(ProjectStep.CODE);
                                        }
                                    }}
                                    className="text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" /> Regenerate Plan
                                </button>
                            )}

                            {/* Show Primary 'Generate' if no output (Header version) */}
                            {!state.roadmapOutput && (
                                <button
                                    onClick={() => generateArtifact(ProjectStep.CODE)}
                                    disabled={state.isGenerating || !state.prdOutput}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] flex items-center gap-2 group"
                                >
                                    {state.isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Generating Plan...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            Generate Roadmap
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar (Gamification) */}
                    {state.roadmapOutput && (
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                                    <span>Project Velocity</span>
                                    <span className={progressPercent === 100 ? "text-green-400" : "text-blue-400"}>{progressPercent}% Complete</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 ease-out ${progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                            {progressPercent === 100 && (
                                <div className="p-2 bg-green-500/10 rounded-full animate-bounce">
                                    <Check className="w-5 h-5 text-green-400" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {state.isGenerating ? (
                    <LoadingState type="code" message="Architecting Solution" subMessage="Breaking down the plan into DIY modules vs Expert tasks..." />
                ) : !state.roadmapOutput ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-16 border-2 border-dashed border-white/5 rounded-2xl bg-white/5 group hover:border-blue-500/20 transition-colors">
                        <div className="p-6 bg-slate-900 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/10 shadow-2xl">
                            <Map className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Ready to Build?</h3>
                        <p className="text-slate-400 max-w-md text-center mb-8">
                            Transform your PRD into a step-by-step technical roadmap.
                            The AI will break down every feature into copy-pasteable code tasks.
                        </p>

                        <button
                            onClick={() => generateArtifact(ProjectStep.CODE)}
                            disabled={!state.prdOutput}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:grayscale text-white font-bold px-10 py-4 rounded-xl shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-1 flex items-center gap-3"
                        >
                            <Sparkles className="w-5 h-5" /> Initialize Realization Engine
                        </button>

                        {!state.prdOutput && (
                            <p className="mt-4 text-xs text-red-400 bg-red-900/20 px-3 py-1 rounded-full border border-red-500/20">
                                ⚠️ Complete the PRD phase first
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {roadmapPhases.map((phase: any, i: number) => {
                            const isOpen = expandedPhase === i;
                            return (
                                <div key={i} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-white dark:bg-white/5 border-blue-500/30 ring-1 ring-blue-500/20' : 'bg-transparent border-forge-200 dark:border-white/10 hover:border-blue-500/40'}`}>

                                    {/* Phase Header (Accordion Trigger) */}
                                    <button
                                        onClick={() => setExpandedPhase(isOpen ? null : i)}
                                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg flex items-center justify-center font-bold text-lg w-12 h-12 transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold transition-colors ${isOpen ? 'text-forge-text dark:text-white' : 'text-forge-muted dark:text-slate-300'}`}>{phase.phaseName || phase.title}</h3>
                                                <p className="text-sm text-slate-500">{phase.description?.substring(0, 60)}...</p>
                                            </div>
                                        </div>
                                        <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'bg-forge-100 dark:bg-white/10 rotate-180' : 'bg-transparent rotate-0'}`}>
                                            <div className="custom-scrol"><ArrowDownToLine className="w-5 h-5 text-slate-400" /></div> {/* Reusing Icon as Chevron-ish */}
                                        </div>
                                    </button>

                                    {/* Phase Body (Expanded) */}
                                    {isOpen && (
                                        <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-300">
                                            {/* DIY Header */}
                                            <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/10">
                                                <h4 className="text-sm font-bold text-blue-300 uppercase tracking-widest flex items-center gap-2">
                                                    <Code2 className="w-4 h-4" /> Phase Tasks
                                                </h4>
                                                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-white flex items-center gap-1 border border-blue-500/20 px-3 py-1.5 rounded-full hover:bg-blue-500/20 transition-colors">
                                                    Open AI Studio <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>

                                            {/* Task Grid */}
                                            <div className="grid grid-cols-1 gap-4">
                                                {phase.steps?.map((step: any, j: number) => {
                                                    const stepId = `${i}-${j}`;
                                                    const isComplete = (state.completedRoadmapSteps || []).includes(stepId);
                                                    const badge = getBadge(step.stepName);

                                                    return (
                                                        <div key={j} className={`group relative p-5 rounded-xl border transition-all duration-300 ${isComplete ? 'bg-green-500/5 dark:bg-green-900/10 border-green-500/30 opacity-75' : 'bg-white dark:bg-black/40 border-forge-200 dark:border-white/10 hover:border-blue-500/40'}`}>
                                                            <div className="flex items-start gap-4">
                                                                {/* Checkbox (Gamification) */}
                                                                <button
                                                                    onClick={() => toggleStepCompletion(stepId)}
                                                                    className={`mt-1 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isComplete ? 'bg-green-500 border-green-500 text-white' : 'bg-slate-900 border-slate-600 hover:border-blue-400 text-transparent'}`}
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badge.color}`}>{badge.label}</span>
                                                                        <h5 className={`font-bold text-lg ${isComplete ? 'text-green-600 dark:text-green-200 line-through' : 'text-forge-text dark:text-white'}`}>{step.stepName}</h5>
                                                                        {/* Outer Copy Button removed to encourage opening details for full context */}
                                                                    </div>

                                                                    {/* Collapsible Prompt (Progressive Disclosure) */}
                                                                    <details className="group/details">
                                                                        <summary className="cursor-pointer list-none text-xs font-mono text-slate-400 hover:text-blue-300 transition-colors flex items-center gap-2 mt-2">
                                                                            <Terminal className="w-3 h-3" /> View AI Studio Prompts
                                                                        </summary>
                                                                        <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                                                            {/* System Instructions (AI Studio) */}
                                                                            {step.systemPrompt && (
                                                                                <div className="bg-slate-950 rounded-lg border border-indigo-500/30 overflow-hidden">
                                                                                    <div className="bg-indigo-500/10 px-3 py-1.5 flex justify-between items-center border-b border-indigo-500/10">
                                                                                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-2">
                                                                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> System Instructions
                                                                                        </span>
                                                                                        <CopyButton text={step.systemPrompt} className="hover:text-indigo-300" />
                                                                                    </div>
                                                                                    <div className="p-3 overflow-x-auto">
                                                                                        <pre className="text-xs font-mono text-indigo-200/80 whitespace-pre-wrap leading-relaxed">{step.systemPrompt}</pre>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* User Prompt */}
                                                                            <div className="bg-slate-950 rounded-lg border border-white/10 overflow-hidden">
                                                                                <div className="bg-white/5 px-3 py-1.5 flex justify-between items-center border-b border-white/5">
                                                                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> User Prompt
                                                                                    </span>
                                                                                    <CopyButton text={step.diyPrompt || step.technicalBrief} className="hover:text-white" />
                                                                                </div>
                                                                                <div className="p-3 overflow-x-auto">
                                                                                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                                                        {step.diyPrompt || step.technicalBrief}
                                                                                    </pre>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </details>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* GLOBAL HIRE CTA - Footer */}
                        <div className="mt-12 pt-8 border-t border-white/10 pb-20">
                            <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/10 group transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20">

                                {/* Full Card Hover Glow (Active on Group Hover) */}
                                <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]"></div>

                                {/* Background Ambient Glows */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/30 transition-colors duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2 group-hover:bg-amber-500/20 transition-colors duration-500"></div>

                                {/* Content Container (Padding applied here so bg covers full card) */}
                                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-orange-500 text-white uppercase tracking-widest shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">Premium</span>
                                            <span className="text-xs font-bold text-orange-300 uppercase tracking-widest group-hover:text-orange-200 transition-colors">Done For You</span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-3 group-hover:drop-shadow-[0_2px_10px_rgba(249,115,22,0.3)] transition-all">Fast Track Your Launch</h3>
                                        <p className="text-slate-300 leading-relaxed mb-6 max-w-xl group-hover:text-white transition-colors">
                                            Skip the DIY learning curve. Instead of building from scratch, let our expert team handle the technical heavy lifting so you can focus on scale.
                                        </p>
                                        <ul className="text-sm text-slate-400 space-y-2 mb-2 group-hover:text-slate-200 transition-colors">
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500 group-hover:text-orange-400" /> Professional Implementation</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500 group-hover:text-orange-400" /> Scalable Architecture</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500 group-hover:text-orange-400" /> 14-Day Delivery Guarantee</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <a
                                            href="mailto:contact@jalanea.com?subject=Fast%20Track%20Build%20Quote&body=I%20am%20interested%20in%20fast-tracking%20my%20project."
                                            className="group/btn relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-orange-600 font-lg rounded-2xl focus:outline-none hover:bg-orange-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-orange-500/40 border border-orange-400/20"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                Get a Quote <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Fast Track Toggle (Sticky) - Lifted on mobile to clear Bottom Nav */}
                {!state.isGenerating && state.roadmapOutput && (
                    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-1000">
                        <a
                            href="mailto:contact@jalanea.com"
                            className="group relative flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-orange-500/50 text-white pl-4 pr-2 py-2 rounded-full shadow-2xl hover:scale-105 transition-all hover:border-orange-400 hover:shadow-orange-500/20"
                        >
                            <span className="text-sm font-bold text-orange-400 group-hover:text-amber-300 transition-colors">Stuck?</span>
                            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                                Fast Track ⚡️
                            </span>
                        </a>
                    </div>
                )}
            </div>
        </PageBackground>
    );
};
