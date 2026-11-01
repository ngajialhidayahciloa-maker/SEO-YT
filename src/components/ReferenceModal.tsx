import React from 'react';
import { X, CheckCircle2, AlertCircle, FileCheck, ExternalLink } from 'lucide-react';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const referenceImages = [
    {
      src: '/assets/aistudio/WhatsApp_Image_2026-10-31_at_20.22.51C_5d6f409b.jpeg',
      title: 'Bagian 1: Judul, Deskripsi, Tags, & Social Media',
      points: [
        'Title length: 20-60 karakter (Judul pendek tidak terpotong di HP, sertakan target keyword).',
        'Description length: > 200 karakter (2 baris pertama berisi keyword tanpa link, hashtags pertama tampil di atas video).',
        'Tags length: > 300 dan maks 500 karakter total.',
        'Added 1 tag in title: Judul wajib memuat minimal 1 tag terbaik.',
      ],
    },
    {
      src: '/assets/aistudio/WhatsApp_Image_2026-10-31_at_20.22.51_e5b10904.jpeg',
      title: 'Bagian 2: Tag Deskripsi, Link, & Hashtags',
      points: [
        'Added 1 tag in description: Kata kunci harus ada di baris-baris awal deskripsi.',
        'Links in description: Link channel/sosial media TIDAK boleh di 2 baris pertama.',
        'Hashtags in description: 3 hingga 15 hashtag (3 pertama diprioritaskan).',
        'Closed captions (manual): Subtitle untuk jangkau audiens luas.',
      ],
    },
    {
      src: '/assets/aistudio/WhatsApp_Image_2026-10-31_at_20.22.50_5ffeba28.jpeg',
      title: 'Bagian 3: Tab SEO Checklist & Status Public',
      points: [
        'Made public: Video disetel publik agar dapat ditemukan di search & rekomendasi.',
        'Skor SEO VidIQ dihitung berdasarkan pemenuhan seluruh checklist ini.',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Aturan Referensi VidIQ Video Analysis
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  100% Terintegrasi
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Aplikasi ini dikonfigurasi langsung sesuai gambar acuan checklist VidIQ yang Anda upload.
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
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {referenceImages.map((img, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[9/16] max-h-72 bg-black flex items-center justify-center overflow-hidden border-b border-slate-800 group">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 left-2 text-[11px] font-mono bg-black/70 px-2 py-0.5 rounded text-slate-300">
                    Screenshot #{idx + 1}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 mb-2">{img.title}</h4>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {img.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checklist Summary Matrix */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl">
            <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              Bagaimana AI Mengeksekusi Naskah Anda Menjadi SEO Sesuai Aturan:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-semibold text-emerald-400">1. Generator Judul:</span>
                <p className="text-slate-400 mt-1">
                  Menghasilkan 5 variasi judul dengan karakter yang strictly 20-60 karakter dan menyematkan tag fokus.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-semibold text-emerald-400">2. Struktur Deskripsi:</span>
                <p className="text-slate-400 mt-1">
                  Baris 1-2 diisi kata kunci berbeda dari judul tanpa tautan. Link ditempatkan di bawah, plus 3-8 hashtag.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-semibold text-emerald-400">3. Kumpulan Tag:</span>
                <p className="text-slate-400 mt-1">
                  Tag dihitung hingga mencapai rentang ideal 350-495 karakter (melebihi syarat 300, di bawah batas 500).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-red-900/30"
          >
            Tutup & Mulai Eksekusi SEO
          </button>
        </div>
      </div>
    </div>
  );
};
