import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, Youtube, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  tagsCommaString: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  tagsCommaString,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadTxt = () => {
    const fullText = `=== YOUTUBE SEO BUNDLE (VIDIQ COMPLIANT) ===

[1. JUDUL VIDEO (${title.length}/60 Karakter)]
${title}

[2. DESKRIPSI LENGKAP (${description.length}/5000 Karakter)]
${description}

[3. TAGS DIPISAH KOMA (${tagsCommaString.length}/500 Karakter)]
${tagsCommaString}
`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `YouTube_SEO_${title.substring(0, 20).replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Salin Paket Lengkap YouTube Studio
              </h3>
              <p className="text-xs text-slate-400">
                Semua elemen sudah dioptimasi dan siap dipaste langsung ke kolom upload YouTube Studio.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* 1. Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                1. Judul Video ({title.length}/60 Karakter):
              </label>
              <button
                onClick={() => handleCopy(title, 'title')}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium"
              >
                {copiedField === 'title' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Judul</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium select-all">
              {title}
            </div>
          </div>

          {/* 2. Tags */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                2. Tags Format Koma ({tagsCommaString.length}/500 Karakter):
              </label>
              <button
                onClick={() => handleCopy(tagsCommaString, 'tags')}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium"
              >
                {copiedField === 'tags' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Semua Tags</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono max-h-24 overflow-y-auto break-all select-all">
              {tagsCommaString}
            </div>
          </div>

          {/* 3. Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                3. Deskripsi Lengkap ({description.length}/5000 Karakter):
              </label>
              <button
                onClick={() => handleCopy(description, 'desc')}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium"
              >
                {copiedField === 'desc' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Deskripsi</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
              {description}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download File .TXT</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-red-900/30"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
