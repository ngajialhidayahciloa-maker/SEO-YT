/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ScriptInputSection } from './components/ScriptInputSection';
import { ChecklistView } from './components/ChecklistView';
import { DetailsEditorView } from './components/DetailsEditorView';
import { CompetitorAnalyzer } from './components/CompetitorAnalyzer';
import { ThumbnailStrategyTab } from './components/ThumbnailStrategyTab';
import { SeoScoreTab } from './components/SeoScoreTab';
import { ReferenceModal } from './components/ReferenceModal';
import { ExportModal } from './components/ExportModal';
import { SAMPLE_SCRIPTS } from './data/sampleScripts';
import { GeneratedSEOResult, TagItem, TitleOption } from './types/seo';
import { auditSEO } from './utils/seoAuditor';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Youtube,
  Zap,
} from 'lucide-react';

export default function App() {
  // Input state
  const [scriptText, setScriptText] = useState(SAMPLE_SCRIPTS[0].content);
  const [genre, setGenre] = useState(SAMPLE_SCRIPTS[0].genre);
  const [focusKeyword, setFocusKeyword] = useState(SAMPLE_SCRIPTS[0].focusKeyword);
  const [channelName, setChannelName] = useState('Alur Cerita Sinema');
  const [socialLinks, setSocialLinks] = useState('Instagram: @alurceritasinema | TikTok: @alurcerita');
  const [algorithmStrategy, setAlgorithmStrategy] = useState('suggested_videos');

  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result state
  const [seoResult, setSeoResult] = useState<GeneratedSEOResult | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<TagItem[]>([]);

  // Navigation states
  const [activeView, setActiveView] = useState<'generator' | 'competitor'>('generator');
  const [activeTab, setActiveTab] = useState<'checklist' | 'seo' | 'details' | 'thumbnail'>('checklist');

  // Modals
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleScriptChange = (newText: string) => {
    setScriptText(newText);
    const lines = newText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length > 0) {
      const first = lines[0].replace(/^[#\s*_\-]+/, '').replace(/^(Judul:|Alur Cerita Film:|Kisah Nyata:|Sinopsis:|Intisari Cerita:)/i, '').trim();
      if (/ayah|ibu|bapak|anak|keluarga|lapar|menangis|air mata|pengorbanan|darman/i.test(newText)) {
        if (genre === 'Alur Cerita Film' || !genre) {
          setGenre('Kisah Nyata & Mengharukan');
        }
        if (focusKeyword === 'alur cerita film plot twist' || !focusKeyword) {
          setFocusKeyword(first ? first : 'kisah pengorbanan ayah');
        }
      } else if (focusKeyword === 'alur cerita film plot twist' && first && !first.toLowerCase().includes('island secret')) {
        setFocusKeyword(first.substring(0, 30));
      }
    }
  };

  // Initial trigger or fallback generator so the user sees results quickly
  const handleGenerateSEO = async () => {
    if (!scriptText.trim()) {
      setErrorMessage('Silakan masukkan naskah atau ide cerita terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText,
          genre,
          focusKeyword,
          channelName,
          socialLinks,
          algorithmStrategy,
          language: 'id',
        }),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || resJson.details || 'Gagal memproses SEO');
      }

      const data: GeneratedSEOResult = resJson.data;
      setSeoResult(data);

      const chosenTitle =
        data.titles && data.titles.length > 0
          ? data.titles[data.primaryTitleIndex || 0]?.title || data.titles[0].title
          : '';
      setSelectedTitle(chosenTitle);
      setDescription(data.description?.fullDescriptionFormatted || '');
      setTags(data.tags?.tagList || []);
      setActiveTab('checklist');

      // Scroll smoothly to results area on mobile/desktop
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Error generating SEO:', err);
      setErrorMessage(
        err.message || 'Terjadi kesalahan saat menghubungi server AI Studio. Coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time live audit computation against the user's uploaded VidIQ rules!
  const liveAudit = useMemo(() => {
    return auditSEO({
      title: selectedTitle,
      description,
      tags: tags.map((t) => t.tag),
    });
  }, [selectedTitle, description, tags]);

  // Tag management
  const handleAddTag = (newTag: string) => {
    if (!newTag.trim()) return;
    setTags((prev) => [
      ...prev,
      {
        tag: newTag.trim(),
        score: Math.floor(Math.random() * 20) + 75,
        category: 'Custom',
      },
    ]);
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleApplyCompetitorTitle = (newTitle: string) => {
    setSelectedTitle(newTitle);
    setActiveView('generator');
    setActiveTab('details');
  };

  const handleJumpToFix = (fieldId: string) => {
    setActiveTab('details');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenReferenceModal={() => setIsReferenceModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        hasResult={Boolean(seoResult)}
        activeView={activeView}
        onChangeView={(v) => setActiveView(v)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Banner Informing Compliance with Uploaded Images */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Aturan Checklist VidIQ Video Analysis Aktif
              </h2>
              <p className="text-xs text-slate-400">
                Judul 20-60 Karakter • Deskripsi &gt;200 Karakter (Kata kunci di baris 1-2 tanpa link) • Tags 300-500 Karakter • Hashtags 3-15
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReferenceModalOpen(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Lihat Foto Bukti Referensi</span>
          </button>
        </div>

        {/* Competitor Intelligence View */}
        {activeView === 'competitor' ? (
          <CompetitorAnalyzer
            currentStoryConcept={scriptText}
            onApplyTitle={handleApplyCompetitorTitle}
          />
        ) : (
          /* Main Generator Flow */
          <div className="space-y-8">
            {/* Step 1: Script Input Section */}
            <ScriptInputSection
              scriptText={scriptText}
              onChangeScriptText={handleScriptChange}
              genre={genre}
              onChangeGenre={setGenre}
              focusKeyword={focusKeyword}
              onChangeFocusKeyword={setFocusKeyword}
              channelName={channelName}
              onChangeChannelName={setChannelName}
              socialLinks={socialLinks}
              onChangeSocialLinks={setSocialLinks}
              algorithmStrategy={algorithmStrategy}
              onChangeAlgorithmStrategy={setAlgorithmStrategy}
              onSubmit={handleGenerateSEO}
              isLoading={isLoading}
              onOpenReferenceModal={() => setIsReferenceModalOpen(true)}
            />

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Step 2: Results & Live VidIQ Checklist Area */}
            {seoResult && (
              <div id="results-section" className="space-y-6 pt-4 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      Hasil Optimasi YouTube SEO
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Skor SEO: {liveAudit.overallScore}/50
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Semua data di bawah ini dapat diedit secara langsung dan checklist akan diperbarui secara real-time.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-900/30"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>Salin Semua Untuk YouTube Studio</span>
                  </button>
                </div>

                {/* 2-Column Responsive Layout: Left: Editor / Details / Thumbnail / SEO | Right: Exact VidIQ Checklist Phone Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Interactive Workspace Tabs (7 Cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Workspace Mode Tabs */}
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`px-3.5 py-1.5 rounded-lg transition-all ${
                          activeTab === 'details'
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        1. Editor Judul, Deskripsi & Tag
                      </button>
                      <button
                        onClick={() => setActiveTab('thumbnail')}
                        className={`px-3.5 py-1.5 rounded-lg transition-all ${
                          activeTab === 'thumbnail'
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        2. Strategi Thumbnail & Retensi
                      </button>
                      <button
                        onClick={() => setActiveTab('seo')}
                        className={`px-3.5 py-1.5 rounded-lg transition-all ${
                          activeTab === 'seo'
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        3. Indeks Skor Algoritma
                      </button>
                    </div>

                    {activeTab === 'details' && (
                      <DetailsEditorView
                        titles={seoResult.titles}
                        selectedTitle={selectedTitle}
                        onSelectTitle={setSelectedTitle}
                        description={description}
                        onChangeDescription={setDescription}
                        tags={tags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                        tagsLength={liveAudit.tagsLength}
                        hashtags={liveAudit.hashtags}
                        focusKeywords={seoResult.focusKeywords}
                      />
                    )}

                    {activeTab === 'thumbnail' && (
                      <ThumbnailStrategyTab
                        insights={seoResult.strategyInsights}
                        title={selectedTitle}
                      />
                    )}

                    {activeTab === 'seo' && (
                      <SeoScoreTab
                        score={liveAudit.overallScore}
                        passedCount={liveAudit.passedCount}
                        totalCheckable={liveAudit.totalCheckable}
                        items={liveAudit.items}
                        focusKeywords={seoResult.focusKeywords}
                        goldenTriangle={seoResult.goldenTriangle}
                        strategyInsights={seoResult.strategyInsights}
                      />
                    )}

                    {activeTab === 'checklist' && (
                      <div className="lg:hidden">
                        <ChecklistView
                          items={liveAudit.items}
                          overallScore={liveAudit.overallScore}
                          passedCount={liveAudit.passedCount}
                          totalCheckable={liveAudit.totalCheckable}
                          activeTab={activeTab}
                          onTabChange={setActiveTab}
                          onJumpToFix={handleJumpToFix}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column: Exact VidIQ Video Analysis Checklist (5 Cols) */}
                  <div className="lg:col-span-5 sticky top-20">
                    <ChecklistView
                      items={liveAudit.items}
                      overallScore={liveAudit.overallScore}
                      passedCount={liveAudit.passedCount}
                      totalCheckable={liveAudit.totalCheckable}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      onJumpToFix={handleJumpToFix}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reference Images Modal */}
      <ReferenceModal
        isOpen={isReferenceModalOpen}
        onClose={() => setIsReferenceModalOpen(false)}
      />

      {/* YouTube Studio Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={selectedTitle}
        description={description}
        tagsCommaString={liveAudit.tagsJoinedString}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>TubeBoost AI • YouTube SEO Optimizer Sesuai Format Standar VidIQ</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Title: 20-60 Chars</span>
            <span>•</span>
            <span>Desc: &gt;200 Chars</span>
            <span>•</span>
            <span>Tags: 300-500 Chars</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
