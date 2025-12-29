import React, { useState } from 'react';
import { RefreshCw, Sparkles, Check, Map, Code2, ExternalLink, Terminal, ArrowRight, ChevronDown } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { ProjectStep } from '../types';
import { LoadingState } from '../components/LoadingState';
import { CopyButton } from '../components/CopyButton';

export const RealizationPage = () => {
    const { state, generateArtifact, toggleStepCompletion } = useProject();
    const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

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
        if (n.includes('setup') || n.includes('init') || n.includes('config')) return { label: 'Setup', color: 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300' };
        if (n.includes('database') || n.includes('auth') || n.includes('backend') || n.includes('api')) return { label: 'Backend', color: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300' };
        if (n.includes('ui') || n.includes('frontend') || n.includes('component') || n.includes('page')) return { label: 'Frontend', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300' };
        return { label: 'Task', color: 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300' };
    };

    return (
        <div className="relative h-full flex flex-col animate-fade-in overflow-y-auto">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30"></div>
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-forge-950 via-forge-900 to-forge-950"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col p-6 md:p-12 pb-32">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                        <div>
                            <div className="inline-flex items-center justify-center p-3 mb-4 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                                <Code2 className="w-6 h-6 text-blue-500" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">Realization Engine</h1>
                            <p className="text-slate-500 dark:text-slate-400">Execute your plan: Task by task.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {state.roadmapOutput && !state.isGenerating && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("Regenerating the roadmap will overwrite your current progress and tasks. Are you sure?")) {
                                            generateArtifact(ProjectStep.CODE);
                                        }
                                    }}
                                    className="text-slate-500 hover:text-slate-700 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-forge-800 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" /> Regenerate Plan
                                </button>
                            )}

                            {!state.roadmapOutput && (
                                <button
                                    onClick={() => generateArtifact(ProjectStep.CODE)}
                                    disabled={state.isGenerating || !state.prdOutput}
                                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                                >
                                    {state.isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Generating Plan...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Generate Roadmap
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {state.roadmapOutput && (
                        <div className="bg-white dark:bg-forge-800/50 p-4 rounded-xl border border-slate-200 dark:border-forge-700 flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                                    <span>Project Velocity</span>
                                    <span className={progressPercent === 100 ? "text-green-500" : "text-blue-500"}>{progressPercent}% Complete</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-forge-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 ease-out ${progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                            {progressPercent === 100 && (
                                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-full">
                                    <Check className="w-5 h-5 text-green-500" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {state.isGenerating ? (
                    <LoadingState type="code" message="Architecting Solution" subMessage="Breaking down the plan into DIY modules vs Expert tasks..." />
                ) : !state.roadmapOutput ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-16 border-2 border-dashed border-slate-200 dark:border-forge-700 rounded-2xl bg-slate-50 dark:bg-forge-800/30">
                        <div className="p-6 bg-blue-100 dark:bg-blue-500/20 rounded-full mb-6">
                            <Map className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ready to Build?</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md text-center mb-8">
                            Transform your PRD into a step-by-step technical roadmap.
                            The AI will break down every feature into copy-pasteable code tasks.
                        </p>

                        <button
                            onClick={() => generateArtifact(ProjectStep.CODE)}
                            disabled={!state.prdOutput}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:grayscale text-white font-bold px-10 py-4 rounded-xl shadow-xl shadow-blue-500/25 transition-all flex items-center gap-3"
                        >
                            <Sparkles className="w-5 h-5" /> Initialize Realization Engine
                        </button>

                        {!state.prdOutput && (
                            <p className="mt-4 text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full border border-red-200 dark:border-red-500/20">
                                ⚠️ Complete the PRD phase first
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {roadmapPhases.map((phase: any, i: number) => {
                            const isOpen = expandedPhase === i;
                            return (
                                <div key={i} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-white dark:bg-forge-800/50 border-blue-300 dark:border-blue-500/30' : 'bg-white dark:bg-forge-800/30 border-slate-200 dark:border-forge-700 hover:border-blue-300 dark:hover:border-blue-500/40'}`}>

                                    {/* Phase Header */}
                                    <button
                                        onClick={() => setExpandedPhase(isOpen ? null : i)}
                                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg flex items-center justify-center font-bold text-lg w-12 h-12 transition-colors ${isOpen ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-forge-800 text-slate-500 dark:text-slate-400'}`}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold transition-colors ${isOpen ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{phase.phaseName || phase.title}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{phase.description?.substring(0, 60)}...</p>
                                            </div>
                                        </div>
                                        <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'bg-blue-100 dark:bg-blue-500/20 rotate-180' : 'bg-transparent rotate-0'}`}>
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </button>

                                    {/* Phase Body */}
                                    {isOpen && (
                                        <div className="px-6 pb-6">
                                            <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-100 dark:border-forge-700">
                                                <h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Code2 className="w-4 h-4" /> Phase Tasks
                                                </h4>
                                                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
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
                                                        <div key={j} className={`group relative p-5 rounded-xl border transition-all duration-300 ${isComplete ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-500/30 opacity-75' : 'bg-slate-50 dark:bg-forge-900/50 border-slate-200 dark:border-forge-700 hover:border-blue-300 dark:hover:border-blue-500/40'}`}>
                                                            <div className="flex items-start gap-4">
                                                                {/* Checkbox */}
                                                                <button
                                                                    onClick={() => toggleStepCompletion(stepId)}
                                                                    className={`mt-1 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isComplete ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-forge-800 border-slate-300 dark:border-forge-600 hover:border-blue-400 text-transparent'}`}
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badge.color}`}>{badge.label}</span>
                                                                        <h5 className={`font-bold text-lg ${isComplete ? 'text-green-600 dark:text-green-300 line-through' : 'text-slate-800 dark:text-white'}`}>{step.stepName}</h5>
                                                                    </div>

                                                                    {/* Collapsible Prompt */}
                                                                    <details className="group/details">
                                                                        <summary className="cursor-pointer list-none text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2 mt-2">
                                                                            <Terminal className="w-3 h-3" /> View AI Studio Prompts
                                                                        </summary>
                                                                        <div className="mt-3 space-y-3">
                                                                            {step.systemPrompt && (
                                                                                <div className="bg-indigo-50 dark:bg-slate-950 rounded-lg border border-indigo-200 dark:border-indigo-500/30 overflow-hidden">
                                                                                    <div className="bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1.5 flex justify-between items-center border-b border-indigo-200 dark:border-indigo-500/10">
                                                                                        <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-2">
                                                                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> System Instructions
                                                                                        </span>
                                                                                        <CopyButton text={step.systemPrompt} className="hover:text-indigo-500" />
                                                                                    </div>
                                                                                    <div className="p-3 overflow-x-auto">
                                                                                        <pre className="text-xs font-mono text-indigo-700 dark:text-indigo-200/80 whitespace-pre-wrap leading-relaxed">{step.systemPrompt}</pre>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            <div className="bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden">
                                                                                <div className="bg-slate-200 dark:bg-white/5 px-3 py-1.5 flex justify-between items-center border-b border-slate-200 dark:border-white/5">
                                                                                    <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider flex items-center gap-2">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> User Prompt
                                                                                    </span>
                                                                                    <CopyButton text={step.diyPrompt || step.technicalBrief} className="hover:text-slate-700 dark:hover:text-white" />
                                                                                </div>
                                                                                <div className="p-3 overflow-x-auto">
                                                                                    <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
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

                        {/* Fast Track CTA */}
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-forge-700">
                            <div className="relative overflow-hidden rounded-2xl border border-orange-200 dark:border-orange-500/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-xl">
                                <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-orange-500 text-white uppercase tracking-widest shadow-lg shadow-orange-500/30">Premium</span>
                                            <span className="text-xs font-bold text-orange-600 dark:text-orange-300 uppercase tracking-widest">Done For You</span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Fast Track Your Launch</h3>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-xl">
                                            Skip the DIY learning curve. Let our expert team handle the technical heavy lifting so you can focus on scale.
                                        </p>
                                        <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2 mb-2">
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500" /> Professional Implementation</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500" /> Scalable Architecture</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500" /> 14-Day Delivery Guarantee</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <a
                                            href="mailto:contact@jalanea.com?subject=Fast%20Track%20Build%20Quote&body=I%20am%20interested%20in%20fast-tracking%20my%20project."
                                            className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                                        >
                                            <span className="flex items-center gap-2">
                                                Get a Quote <ArrowRight className="w-5 h-5" />
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Fast Track Button */}
            {!state.isGenerating && state.roadmapOutput && (
                <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50">
                    <a
                        href="mailto:contact@jalanea.com"
                        className="group flex items-center gap-3 bg-white dark:bg-forge-900 border border-orange-200 dark:border-orange-500/50 text-slate-800 dark:text-white pl-4 pr-2 py-2 rounded-full shadow-xl hover:border-orange-400 transition-all"
                    >
                        <span className="text-sm font-bold text-orange-500">Stuck?</span>
                        <span className="bg-orange-500 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                            Fast Track ⚡️
                        </span>
                    </a>
                </div>
            )}
        </div>
    );
};
