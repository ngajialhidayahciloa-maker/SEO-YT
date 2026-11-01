import React from 'react';
import {
  Youtube,
  ShieldCheck,
  FileCheck,
  Share2,
  Copy,
  Swords,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  onOpenReferenceModal: () => void;
  onOpenExportModal: () => void;
  hasResult: boolean;
  activeView: 'generator' | 'competitor';
  onChangeView: (view: 'generator' | 'competitor') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReferenceModal,
  onOpenExportModal,
  hasResult,
  activeView,
  onChangeView,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-900/30">
            <Youtube className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                TubeBoost <span className="text-red-500">SEO</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-600/20 text-red-300 font-bold border border-red-500/30">
                VIDIQ RULES
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              YouTube SEO Generator & Competitor Intelligence dari Naskah Cerita
            </p>
          </div>
        </div>

        {/* View Switcher: Generator vs Competitor */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onChangeView('generator')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'generator'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEO Generator</span>
          </button>
          <button
            onClick={() => onChangeView('competitor')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'competitor'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Analisis Pesaing</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenReferenceModal}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
            title="Buka foto referensi checklist yang diunggah"
          >
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Referensi VidIQ</span>
          </button>

          {hasResult && (
            <button
              type="button"
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold transition-all shadow-lg shadow-red-900/30"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Paket Studio</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
