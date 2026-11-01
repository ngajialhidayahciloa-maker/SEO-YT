import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { ChecklistItemAudit, ChecklistStatus } from '../types/seo';

interface ChecklistViewProps {
  items: ChecklistItemAudit[];
  overallScore: number;
  passedCount: number;
  totalCheckable: number;
  activeTab: 'checklist' | 'seo' | 'details' | 'thumbnail';
  onTabChange: (tab: 'checklist' | 'seo' | 'details' | 'thumbnail') => void;
  onJumpToFix?: (fieldId: string) => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  items,
  overallScore,
  passedCount,
  totalCheckable,
  activeTab,
  onTabChange,
  onJumpToFix,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>('title_length');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderIcon = (status: ChecklistStatus) => {
    switch (status) {
      case 'pass':
        return (
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'fail':
        return (
          <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'neutral':
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-700/60 text-slate-400 flex items-center justify-center shrink-0 border border-slate-600">
            <MinusCircle className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Mobile/VidIQ App Header Emulation */}
      <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('details')}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Kembali ke editor"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">Video Analysis</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40">
              VidIQ Engine
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-slate-400">SEO Score</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              {overallScore}/50 ({Math.round((overallScore / 50) * 100)}%)
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tabs matching the reference images: Thumbnail | Details | SEO | Checklist */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => onTabChange('thumbnail')}
          className={`px-4 py-2.5 transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'thumbnail'
              ? 'border-red-500 text-white font-bold bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Thumbnail
        </button>
        <button
          onClick={() => onTabChange('details')}
          className={`px-4 py-2.5 transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'details'
              ? 'border-red-500 text-white font-bold bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => onTabChange('seo')}
          className={`px-4 py-2.5 transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'border-red-500 text-white font-bold bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>SEO</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
            {overallScore}
          </span>
        </button>
        <button
          onClick={() => onTabChange('checklist')}
          className={`px-4 py-2.5 transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
            activeTab === 'checklist'
              ? 'border-red-500 text-white font-bold bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Checklist</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600/20 text-red-400 font-mono">
            {passedCount}/{totalCheckable}
          </span>
        </button>
      </div>

      {/* Progress & Stat Banner */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">
            Lolos Audit VidIQ: <strong className="text-emerald-400">{passedCount}</strong> dari {totalCheckable} kriteria
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                passedCount === totalCheckable
                  ? 'bg-emerald-500'
                  : passedCount >= 5
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${(passedCount / totalCheckable) * 100}%` }}
            />
          </div>
          <span className="font-mono text-slate-400">{Math.round((passedCount / totalCheckable) * 100)}%</span>
        </div>
      </div>

      {/* Checklist items list */}
      <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[620px]">
        {items.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`transition-colors ${
                isExpanded ? 'bg-slate-800/40' : 'hover:bg-slate-850/40 bg-slate-900'
              }`}
            >
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  {renderIcon(item.status)}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.status === 'fail' && onJumpToFix && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToFix(item.id);
                      }}
                      className="text-[11px] px-2 py-0.5 rounded bg-red-600/20 text-red-300 hover:bg-red-600/40 border border-red-500/30 transition-colors"
                    >
                      Perbaiki
                    </button>
                  )}
                  <span className="text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-4 pt-1 text-xs space-y-2.5 text-slate-300 bg-slate-950/40 border-t border-slate-800/40">
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                  {item.actionableHelp && (
                    <div
                      className={`p-2.5 rounded-lg border font-mono text-[11px] leading-relaxed flex items-start gap-2 ${
                        item.status === 'pass'
                          ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                          : item.status === 'fail'
                          ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div>{item.actionableHelp}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
