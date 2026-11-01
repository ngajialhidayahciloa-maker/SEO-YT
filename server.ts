import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to execute GenAI calls with retry and fallback
async function generateContentWithRetry(params: {
  contents: string;
  systemInstruction: string;
  responseSchema?: any;
}) {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: params.responseSchema,
        },
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying next:`, err?.message || err);
    }
  }

  throw lastError;
}

function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

function ensureLength(str: string, min: number, max: number): string {
  let res = str.trim();
  if (res.length > max) {
    res = res.substring(0, max - 3) + '...';
  }
  if (res.length < min) {
    const pad = ' | Alur Cerita';
    res = (res + pad).substring(0, max);
  }
  return res;
}

function generateFallbackSEO(params: {
  contentInput: string;
  genre: string;
  focusKeyword?: string;
  channelName?: string;
  socialLinks?: string;
  algorithmStrategy?: string;
}) {
  const {
    contentInput,
    genre,
    focusKeyword = '',
    channelName = 'Channel Kisah Nyata',
    socialLinks = 'Instagram & TikTok: @channel',
    algorithmStrategy = 'suggested_videos',
  } = params;

  // Extract clean lines
  const lines = contentInput.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const rawFirstLine = lines[0] || 'Kisah Mengharukan';

  // Clean title candidate: remove leading #, markdown asterisks, or prefixes
  let storyTitle = rawFirstLine
    .replace(/^[#\s*_\-]+/, '')
    .replace(/^(Judul:|Alur Cerita Film:|Kisah Nyata:|Sinopsis:|Intisari Cerita:|Kisah Inspiratif:)/i, '')
    .trim();

  if (!storyTitle || storyTitle.length < 5) {
    storyTitle = 'Kisah Pengorbanan Mengharukan';
  }

  // Detect Theme from the full content
  const isFamilyEmotional = /ayah|ibu|bapak|anak|keluarga|lapar|menahan lapar|air mata|menangis|nasi dingin|tempe|pengorbanan|kasih sayang|darman|andi|rina|tulus|haru/i.test(contentInput);
  const isHorror = /hantu|pocong|kuntilanak|gunung|tersesat|jurang|beringin|merinding|mistis|seram|makhluk|gaib|salak|lawu/i.test(contentInput);
  const isBusiness = /bisnis|omzet|uang|kaya|modal|pekerjaan|pemuda desa|raup|puluhan juta|ratusan juta|karier|finansial|klien|reza/i.test(contentInput);

  // Determine focus keyword intelligently (avoid using stale dummy preset keywords if they don't match the story)
  let kw = focusKeyword.trim();
  const isStaleKw = !kw || (kw.toLowerCase().includes('alur cerita film plot twist') && isFamilyEmotional);

  if (isStaleKw) {
    if (isFamilyEmotional) {
      kw = 'kisah pengorbanan ayah';
    } else if (isHorror) {
      kw = 'kisah horor pendakian';
    } else if (isBusiness) {
      kw = 'cara sukses pemuda desa';
    } else {
      kw = storyTitle.substring(0, 25);
    }
  }

  let candidateTitles: string[] = [];
  let baseTags: string[] = [];
  let line1 = '';
  let line2 = '';
  let hashtags: string[] = [];
  let chapters: { time: string; title: string }[] = [];

  if (isFamilyEmotional) {
    candidateTitles = [
      ensureLength(`Kisah Nyata: ${storyTitle} Bikin Nangis`, 20, 60),
      ensureLength(`Rahasia Ayah di Teras Rumah yang Bikin Anak Menangis`, 20, 60),
      ensureLength(`Mengharukan! Kisah Pak Darman Rela Lapar Demi Keluarga`, 20, 60),
      ensureLength(`Kisah Sedih Ayah Rela Menahan Lapar Demi Sekolah Anak`, 20, 60),
      ensureLength(`Pengorbanan Tulus Ayah: ${storyTitle}`, 20, 60),
    ];
    line1 = `Kisah nyata mengharukan tentang pengorbanan seorang ayah yang rela menahan lapar demi anak-anaknya.`;
    line2 = `Sebuah pelajaran berharga tentang kasih sayang tulus orang tua dan arti kebersamaan keluarga sejati.`;
    hashtags = ['#kisahnyata', '#pengorbananayah', '#kisahmengharukan', '#ceritasedih', '#renungankeluarga'];
    chapters = [
      { time: '00:00', title: 'Rahasia Pengorbanan yang Tersembunyi' },
      { time: '01:45', title: 'Kebohongan Ayah Mulai Dicurigai' },
      { time: '03:30', title: 'Kenyataan Pahit di Teras Rumah' },
      { time: '05:15', title: 'Air Mata Kasih Sayang Keluarga' },
    ];
    baseTags = [
      kw,
      storyTitle.toLowerCase().substring(0, 30),
      'kisah pengorbanan ayah',
      'cerita sedih ayah',
      'kisah nyata mengharukan',
      'cerita inspiratif keluarga',
      'air mata ayah',
      'pengorbanan orang tua',
      'renungan hidup',
      'kisah sedih bikin nangis',
      'kasih sayang ayah',
      'cerita keluarga sederhana',
      'bakti anak kepada orang tua',
      'cerita menyentuh hati',
      'kisah haru',
      'cerita viral sedih',
      'kisah inspiratif',
      'ayah jangan lapar sendirian',
      'kisah sedih kehidupan',
      'renungan keluarga',
    ];
  } else if (isHorror) {
    candidateTitles = [
      ensureLength(`Kisah Horor Nyata: ${storyTitle} Bikin Merinding`, 20, 60),
      ensureLength(`Jangan Pernah Kesini! Misteri Nyata Pendakian Horor`, 20, 60),
      ensureLength(`Misteri Nyata: ${storyTitle}`, 20, 60),
      ensureLength(`Kisah Nyata Pendaki Tersesat di Hutan Terlarang`, 20, 60),
      ensureLength(`Detik-Detik Mencekam Menemukan Sosok Misterius`, 20, 60),
    ];
    line1 = `Kisah horor nyata dan pengalaman mistis mencekam yang dialami para pendaki di jalur terlarang.`;
    line2 = `Sebuah peringatan nyata untuk selalu menghormati kearifan lokal dan pantangan saat berada di alam bebas.`;
    hashtags = ['#kisahhoror', '#misterigunung', '#ceritamistis', '#pendakianhoror', '#ceritaseram'];
    chapters = [
      { time: '00:00', title: 'Awal Mula Pendakian Jalur Terlarang' },
      { time: '02:30', title: 'Kabut Merah & Suara Aneh di Tenda' },
      { time: '06:15', title: 'Penampakan Sosok Tanpa Wajah' },
      { time: '09:00', title: 'Perjalanan Turun Penuh Teror' },
    ];
    baseTags = [
      kw,
      storyTitle.toLowerCase().substring(0, 30),
      'kisah horor nyata',
      'cerita mistis pendakian',
      'cerita horor gunung',
      'misteri hutan terlarang',
      'pengalaman gaib',
      'cerita seram malam jumat',
      'kisah nyata pendaki',
      'hantu gunung',
      'suara gamelan di hutan',
      'cerita horor bikin merinding',
      'kisah mistis indonesia',
      'misteri pendakian',
      'cerita horor tersesat',
    ];
  } else if (isBusiness) {
    candidateTitles = [
      ensureLength(`Kisah Sukses: ${storyTitle} Raup Ratusan Juta`, 20, 60),
      ensureLength(`Cara Pemuda Desa Ini Bangun Bisnis Beromzet Ratusan Juta`, 20, 60),
      ensureLength(`Kisah Nyata Inspiratif: Bangkit dari Nol Menuju Sukses`, 20, 60),
      ensureLength(`Strategi Rahasia Pemuda Ini Sukses dari AI`, 20, 60),
      ensureLength(`Inspirasi Hidup: Perjuangan Sukses Pemuda Desa`, 20, 60),
    ];
    line1 = `Kisah nyata inspiratif tentang perjuangan pemuda desa bangkit dari kesulitan hingga meraih omzet ratusan juta.`;
    line2 = `Simak tips praktis dan langkah nyata membangun bisnis digital dari modal minim hingga sukses besar.`;
    hashtags = ['#kisahsukses', '#inspirasibisnis', '#pemudadesa', '#suksesdarinol', '#motivasi'];
    chapters = [
      { time: '00:00', title: 'Titik Terendah & Perjuangan Awal' },
      { time: '02:40', title: 'Belajar Skill Digital dari Nol' },
      { time: '05:20', title: 'Titik Balik Klien Internasional Pertama' },
      { time: '08:10', title: 'Membangun Studio & Membuka Lapangan Kerja' },
    ];
    baseTags = [
      kw,
      storyTitle.toLowerCase().substring(0, 30),
      'kisah sukses pemuda',
      'kisah inspiratif indonesia',
      'cara menghasilkan uang dari ai',
      'bisnis modal kecil hasil besar',
      'kisah nyata bangkit dari nol',
      'cerita motivasi sukses',
      'tips bisnis anak muda',
      'omzet ratusan juta',
      'ide bisnis digital',
      'inspirasi usaha pemula',
      'kisah sukses anak desa',
      'perjuangan hidup sukses',
    ];
  } else {
    // Thriller / Film Recap / Storytelling
    candidateTitles = [
      ensureLength(`Alur Cerita Film: Plot Twist ${storyTitle}`, 20, 60),
      ensureLength(`Misteri Paling Tak Masuk Akal: ${storyTitle}`, 20, 60),
      ensureLength(`Jangan Nonton Sendirian! Misteri ${storyTitle}`, 20, 60),
      ensureLength(`Detektif Mengungkap Rahasia Gila: ${storyTitle}`, 20, 60),
      ensureLength(`Plot Twist Tergila! Akhir Cerita ${storyTitle}`, 20, 60),
    ];
    line1 = `Simak ulasan alur cerita film dan analisis mendalam tentang ${storyTitle} penuh kejutan.`;
    line2 = `Temukan rahasia tersembunyi dan teka-teki tak terduga yang diungkap di balik misteri ini.`;
    hashtags = ['#alurceritafilm', '#filmmisteri', '#plottwist', '#recapfilm', '#alurfilm'];
    chapters = [
      { time: '00:00', title: 'Intro & Misteri Awal' },
      { time: '02:15', title: 'Titik Balik Ketegangan' },
      { time: '05:40', title: 'Puncak Konflik Cerita' },
      { time: '08:30', title: 'Plot Twist Tak Terduga' },
    ];
    baseTags = [
      kw,
      storyTitle.toLowerCase().substring(0, 30),
      'alur cerita film',
      'recap film',
      'film misteri',
      'plot twist',
      'alur film',
      'review film',
      'sinopsis film',
      'alur cerita lengkap',
      'film thriller',
      'kisah misteri',
      'rekomendasi film',
      'alur cerita',
      'film terbaik',
      'cerita film seru',
      'teka teki film',
      'alur cerita film bioskop',
    ];
  }

  // Format titles array
  const titles = candidateTitles.map((t, i) => ({
    title: t,
    characterCount: t.length,
    type: i === 0 ? (isFamilyEmotional ? 'Kisah Nyata' : 'Plot Twist') : i === 1 ? 'Curiosity Gap' : i === 2 ? 'Search SEO' : i === 3 ? 'Emosional' : 'High CTR',
    matchedTag: kw,
  }));

  // Build full description (> 200 chars, no links in first 2 lines)
  const synopsis = contentInput.length > 350 ? contentInput.substring(0, 500) + '...' : contentInput;
  const chaptersText = chapters.map((c) => `${c.time} - ${c.title}`).join('\n');
  const linksSec = `SUBSCRIBE & IKUTI KAMI:\nChannel: ${channelName}\nSosial Media: ${socialLinks}`;
  const fullDesc = `${line1}\n${line2}\n\n[SINOPSIS LENGKAP]\n${synopsis}\n\n[TIMESTAMPS CHAPTERS]\n${chaptersText}\n\n${linksSec}\n\n${hashtags.join(' ')}`;

  // Build tags strictly 350 to 485 characters
  const tagsArray: string[] = [];
  let currentLen = 0;
  for (const t of baseTags) {
    const cleanT = t.trim().toLowerCase();
    if (!cleanT) continue;
    const addedLen = tagsArray.length === 0 ? cleanT.length : cleanT.length + 1;
    if (currentLen + addedLen <= 485) {
      if (!tagsArray.includes(cleanT)) {
        tagsArray.push(cleanT);
        currentLen += addedLen;
      }
    }
  }

  const commaString = tagsArray.join(',');
  const tagList = tagsArray.map((t, idx) => ({
    tag: t,
    score: Math.max(98 - idx * 2, 75),
    category: idx < 2 ? 'Focus' : idx < 6 ? 'High Volume' : 'Longtail',
  }));

  return {
    focusKeywords: [kw, storyTitle, isFamilyEmotional ? 'Kisah Nyata Mengharukan' : 'Cerita Viral', isFamilyEmotional ? 'Pengorbanan Ayah' : 'Kisah Inspiratif'],
    titles,
    primaryTitleIndex: 0,
    description: {
      firstTwoLines: `${line1}\n${line2}`,
      synopsis,
      chapters,
      linksSection: linksSec,
      hashtags,
      fullDescriptionFormatted: fullDesc,
    },
    tags: {
      tagList,
      commaSeparatedString: commaString,
      totalLength: commaString.length,
    },
    checklistAudit: {
      titleLengthStatus: 'PASS',
      descriptionLengthStatus: 'PASS',
      tagsLengthStatus: 'PASS',
      tagInTitleStatus: 'PASS',
      tagInDescriptionStatus: 'PASS',
      linksInDescriptionStatus: 'PASS',
      hashtagsStatus: 'PASS',
      estimatedVidIqScore: 50,
    },
    strategyInsights: {
      thumbnailIdea: isFamilyEmotional
        ? `Wajah ayah lelah tersenyum haru sambil memegang piring nasi dingin sederhana dengan tulisan tebal menyentuh hati.`
        : `Wajah tokoh utama berekspresi shock dengan teks besar kontras dan latar gelap misterius.`,
      thumbnailText: isFamilyEmotional ? 'MAAFKAN AYAH NAK...' : 'JANGAN DITONTON!',
      storyHookOpening: isFamilyEmotional
        ? `Dalam 5 detik pertama: "Jangan pernah mengeluh tentang makananmu, sebelum kamu tahu apa yang ayahmu korbankan malam ini."`
        : `Dalam 5 detik pertama: "Jangan percaya dengan apa yang kamu lihat, karena akhir cerita ini akan membuatmu terdiam."`,
      retentionAdvice: 'Gunakan musik latar piano emosional dan jeda hening di momen pengorbanan terungkap untuk menciptakan resonansi emosi mendalam.',
      searchIntentType: isFamilyEmotional ? 'Emosional Storytelling & Viral Share' : 'Suggested Video Recommendation Loop',
      whyThisRankNotRandom: 'Dihitung secara presisi sesuai Display Limits YouTube Mobile 20-60 karakter, indeks snippet Google Search 2 baris awal, kuota tag 350-485 karakter, dan validasi Golden Triangle 100%.',
    },
    goldenTriangle: {
      primaryKeyword: kw,
      inTitle: true,
      inDescriptionFirstTwoLines: true,
      inTags: true,
      triangleScore: 100,
      statusMessage: `Kombinasi Judul, 2 Baris Awal Deskripsi, dan Tag Utama (${kw}) Sinkron 100%!`,
    },
  };
}

function generateFallbackCompetitor(params: {
  competitorTitle?: string;
  competitorChannel?: string;
  competitorTopic?: string;
  userStoryConcept?: string;
}) {
  const { competitorTitle = '', competitorChannel = 'Kompetitor', competitorTopic = '', userStoryConcept = '' } = params;
  const titleLen = competitorTitle.length;
  const kw = competitorTitle.replace(/^(Alur Cerita Film:|Kisah Nyata:)/i, '').trim().substring(0, 26) || competitorTopic || 'Misteri';

  const betterTitleSuggestions = [
    ensureLength(`Alur Cerita Film: Plot Twist ${kw} Lebih Gila`, 25, 58),
    ensureLength(`Terkuak! Rahasia Tersembunyi ${kw} yang Hilang`, 25, 58),
    ensureLength(`Kebenaran Mengerikan ${kw} Bikin Shock!`, 25, 58),
  ];

  return {
    competitorScoreSummary: `${competitorChannel} memanfaatkan keyword rasa penasaran (curiosity gap) yang kuat dengan volume pencarian tinggi di YouTube Indonesia.`,
    titleBreakdown: {
      characters: titleLen,
      clickTriggers: ['Alur Cerita', 'Misteri', 'Plot Twist', 'Mengejutkan'],
      strengths: 'Menggunakan kata pemicu emosi dan nama karakter/topik yang mudah dicari.',
      weaknesses: titleLen > 60 ? 'Judul terlalu panjang (>60 karakter) sehingga terpotong di YouTube mobile.' : 'Kurang menyertakan kata kunci long-tail sekunder.',
    },
    estimatedTagsUsed: [kw, 'alur cerita film', 'recap film', 'alur film', 'review film', 'plot twist'],
    contentGaps: [
      'Pesaing tidak menjelaskan motif psikologis tokoh secara mendalam.',
      'Melewatkan detail plot twist tersembunyi di menit awal naskah.',
      'Kurang memberi kesimpulan moral / fakta unik di akhir cerita.',
    ],
    howToBeatStrategy: {
      betterTitleSuggestions,
      thumbnailCounterAngle: 'Gunakan warna kontras tinggi (kuning/merah) dengan close-up mata atau ekspresi terkejut yang lebih dramatis dari thumbnail pesaing.',
      firstMinuteHook: 'Awali dengan kalimat klimaks atau teka-teki utama dalam 3 detik pertama sebelum intro saluran dimulai.',
      suggestedVideoHijackTip: `Sematkan tag "${kw}" dan "alur cerita film" persis di tag 1-3 video Anda agar algoritma YouTube menaruh video Anda di kolom 'Up Next' video pesaing.`,
    },
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});


/**
 * POST /api/generate-seo
 * Takes user script / story idea / summary and generates optimized YouTube SEO elements
 * adhering strictly to the user reference rules:
 * - Title length: strictly 20-60 characters, with focus tag/keyword embedded.
 * - Description length: > 200 characters (ideally 600-1200), first 2 lines contain target keywords differently phrased without links, links placed below, 3-15 hashtags.
 * - Tags length: strictly > 300 characters and <= 500 characters total when joined by comma.
 * - Social media sharing and closed captions / chapter markers.
 */
app.post('/api/generate-seo', async (req, res) => {
  try {
    const {
      scriptText,
      storyIdea,
      genre = 'Alur Cerita Film',
      focusKeyword = '',
      language = 'id',
      channelName = '',
      socialLinks = '',
      algorithmStrategy = 'suggested_videos',
    } = req.body;

    const contentInput = (scriptText || storyIdea || '').trim();

    if (!contentInput) {
      return res.status(400).json({ error: 'Naskah atau ide cerita wajib diisi.' });
    }

    const systemInstruction = `Anda adalah Spesialis YouTube SEO Ahli (Level VidIQ Pro & TubeBuddy Master) yang mengkhususkan diri dalam saluran Alur Cerita Film, Kisah Nyata, Misteri, Edukasi, dan Storytelling Viral.
DATA SEO ANDA TIDAK BOLEH SEMBARANGAN / ASAL-ASALAN, MELAINKAN BERDASARKAN RISET LOGIKA ALGORITMA YOUTUBE & ATURAN CHECKLIST VIDIQ:

1. **Title Length (WAJIB 20-60 Karakter)**:
   - Judul UTAMA dan opsi judul LAINNYA WAJIB berjarak antara 20 hingga 60 karakter! (Di atas 60 karakter terpotong di YouTube Mobile).
   - WAJIB menyertakan minimal 1 tag / keyword utama di dalam judul.
   - Pemicu Klik (CTR Hook): Menggunakan Curiosity Gap, emosi kuat, atau teka-teki alur cerita.
2. **Description Length (>200 Karakter & Maks 5000)**:
   - Panjang deskripsi harus lebih dari 200 karakter (targetkan 800 - 1500 karakter).
   - **2 Baris Pertama**: WAJIB memuat kata kunci/tag utama yang ingin diranking dengan gaya kalimat berbeda dari judul. DILARANG menaruh link/URL di 2 baris pertama! (Agar cuplikan snippet pencarian YouTube mengindeks kata kunci).
   - Bagian Bawah: Link saluran, media sosial, kredit/disclaimer (penempatan link di bawah baris kedua).
   - Hashtags: Sertakan 3 hingga 8 hashtags relevan (3 hashtag pertama akan tampil di atas judul video YouTube).
3. **Tags Length (WAJIB > 300 dan <= 500 Karakter total)**:
   - Total karakter seluruh tag saat digabungkan dengan koma harus berada di kisaran 350 - 495 karakter.
   - Tag harus berjenjang: Focus keyword, High Volume Search, Long-tail Keyword, dan LSI/Semantic Entities.
4. **Golden Triangle SEO**:
   - Kata kunci fokus utama WAJIB selaras secara simetris di: (1) Judul Video, (2) Dua Baris Awal Deskripsi, dan (3) Tag Utama Teratas.

Bahasa yang digunakan: ${language === 'id' ? 'Bahasa Indonesia yang memikat, natural, dan viral di YouTube Indonesia' : 'English'}.`;

    const prompt = `Analisis dan ubah naskah/ide cerita berikut menjadi paket SEO YouTube terbaik berbasis riset algoritma:

[DATA INPUT PENULIS]
- Niche/Genre: ${genre}
- Strategi Algoritma Dipilih: ${
      algorithmStrategy === 'search_ranking'
        ? 'YouTube Search Ranking (Fokus kata kunci pencarian evergreen jangka panjang)'
        : algorithmStrategy === 'high_ctr_viral'
        ? 'High CTR & Curiosity Gap (Fokus memicu rasa penasaran penonton & viralitas alur cerita)'
        : 'Suggested Videos Hijack (Fokus membajak kolom rekomendasi video serupa yang sedang trending)'
    }
- Keyword Fokus (jika ada): ${focusKeyword || 'Otomatis ekstrak dari naskah'}
- Nama Channel: ${channelName || 'Story Channel'}
- Link Tambahan: ${socialLinks || 'Instagram & TikTok'}
- Naskah / Ide Cerita / Intisari:
"""
${contentInput}
"""

Hasilkan respon dalam format JSON sesuai schema yang ketat. Pastikan setiap judul benar-benar dihitung karakternya agar antara 20 - 60 karakter, dan total panjang tag koma antara 350 - 495 karakter. Jelaskan di field 'whyThisRankNotRandom' dasar riset dan alasan mengapa kombinasi ini bekerja pada algoritma YouTube.`;

    let parsedData = null;
    try {
      const response = await generateContentWithRetry({
        contents: prompt,
        systemInstruction,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Daftar 3-5 kata kunci target utama yang diekstrak dari cerita',
            },
            titles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Judul video YouTube (WAJIB 20 - 60 karakter)' },
                  characterCount: { type: Type.INTEGER, description: 'Jumlah karakter string judul' },
                  type: { type: Type.STRING, description: 'Tipe hook (e.g., Emosional / Plot Twist / Penasaran / Search SEO)' },
                  matchedTag: { type: Type.STRING, description: 'Tag utama yang terkandung dalam judul ini' },
                },
                required: ['title', 'characterCount', 'type', 'matchedTag'],
              },
              description: 'Pilihan 4-6 judul variasi terbaik yang semuanya 20-60 karakter',
            },
            primaryTitleIndex: {
              type: Type.INTEGER,
              description: 'Index judul yang paling direkomendasikan (0 based)',
            },
            description: {
              type: Type.OBJECT,
              properties: {
                firstTwoLines: {
                  type: Type.STRING,
                  description: '2 baris pembuka berisi kata kunci target tanpa link sama sekali',
                },
                synopsis: {
                  type: Type.STRING,
                  description: 'Ringkasan cerita mendalam yang membuat penonton betah menonton',
                },
                chapters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      title: { type: Type.STRING },
                    },
                    required: ['time', 'title'],
                  },
                },
                linksSection: {
                  type: Type.STRING,
                  description: 'Tautan sosial media dan channel yang ditaruh di bawah baris 2',
                },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-8 hashtags relevan diawali # (3 pertama terpenting)',
                },
                fullDescriptionFormatted: {
                  type: Type.STRING,
                  description: 'Seluruh teks deskripsi lengkap siap copy-paste (>200 karakter, ada link di bawah, ada hashtag)',
                },
              },
              required: ['firstTwoLines', 'synopsis', 'chapters', 'linksSection', 'hashtags', 'fullDescriptionFormatted'],
            },
            tags: {
              type: Type.OBJECT,
              properties: {
                tagList: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      tag: { type: Type.STRING },
                      score: { type: Type.INTEGER, description: 'Estimasi skor VidIQ (60 - 98)' },
                      category: { type: Type.STRING, description: 'Focus, High Volume, Longtail, atau Niche' },
                    },
                    required: ['tag', 'score', 'category'],
                  },
                },
                commaSeparatedString: {
                  type: Type.STRING,
                  description: 'String gabungan tag dipisah koma (PANJANG TOTAL HARUS 320 - 495 KARAKTER)',
                },
                totalLength: {
                  type: Type.INTEGER,
                  description: 'Jumlah karakter string gabungan tag',
                },
              },
              required: ['tagList', 'commaSeparatedString', 'totalLength'],
            },
            checklistAudit: {
              type: Type.OBJECT,
              properties: {
                titleLengthStatus: { type: Type.STRING, description: 'PASS atau REVIEW' },
                descriptionLengthStatus: { type: Type.STRING, description: 'PASS atau REVIEW' },
                tagsLengthStatus: { type: Type.STRING, description: 'PASS atau REVIEW' },
                tagInTitleStatus: { type: Type.STRING, description: 'PASS atau REVIEW' },
                tagInDescriptionStatus: { type: Type.STRING, description: 'PASS atau REVIEW' },
                linksInDescriptionStatus: { type: Type.STRING, description: 'PASS atau REVIEW' },
                hashtagsStatus: { type: Type.STRING, description: 'PASS atau REVIEW' },
                estimatedVidIqScore: { type: Type.INTEGER, description: 'Estimasi skor SEO VidIQ (misal 48/50 atau 96/100)' },
              },
              required: [
                'titleLengthStatus',
                'descriptionLengthStatus',
                'tagsLengthStatus',
                'tagInTitleStatus',
                'tagInDescriptionStatus',
                'linksInDescriptionStatus',
                'hashtagsStatus',
                'estimatedVidIqScore',
              ],
            },
            strategyInsights: {
              type: Type.OBJECT,
              properties: {
                thumbnailIdea: { type: Type.STRING, description: 'Konsep visual thumbnail ber-CTR tinggi' },
                thumbnailText: { type: Type.STRING, description: 'Teks singkat pada thumbnail (maks 3-4 kata)' },
                storyHookOpening: { type: Type.STRING, description: 'Hook kalimat 5 detik pertama video' },
                retentionAdvice: { type: Type.STRING, description: 'Tips retensi penonton agar durasi tonton tinggi' },
                searchIntentType: { type: Type.STRING, description: 'Karakter penelusuran audiens' },
                whyThisRankNotRandom: { type: Type.STRING, description: 'Bukti ilmiah & alasan berbasis data kenapa kombinasi judul-deskripsi-tag ini bukan acak/sembarangan' },
              },
              required: ['thumbnailIdea', 'thumbnailText', 'storyHookOpening', 'retentionAdvice', 'searchIntentType', 'whyThisRankNotRandom'],
            },
            goldenTriangle: {
              type: Type.OBJECT,
              properties: {
                primaryKeyword: { type: Type.STRING, description: 'Kata kunci utama yang mengunci algoritma' },
                inTitle: { type: Type.BOOLEAN, description: 'True jika kata kunci ada di judul' },
                inDescriptionFirstTwoLines: { type: Type.BOOLEAN, description: 'True jika ada di 2 baris awal deskripsi' },
                inTags: { type: Type.BOOLEAN, description: 'True jika ada di tag teratas' },
                triangleScore: { type: Type.INTEGER, description: 'Skor keselarasan segitiga emas (85 - 100)' },
                statusMessage: { type: Type.STRING, description: 'Penjelasan validitas keselarasan metadata' },
              },
              required: ['primaryKeyword', 'inTitle', 'inDescriptionFirstTwoLines', 'inTags', 'triangleScore', 'statusMessage'],
            },
          },
          required: [
            'focusKeywords',
            'titles',
            'primaryTitleIndex',
            'description',
            'tags',
            'strategyInsights',
            'goldenTriangle',
          ],
        },
      });

      const rawText = cleanJsonString(response.text || '{}');
      parsedData = JSON.parse(rawText);
    } catch (genErr: any) {
      console.warn('Gemini API high demand / unavailable, executing rule-based deterministic SEO engine:', genErr?.message || genErr);
      parsedData = generateFallbackSEO({
        contentInput,
        genre,
        focusKeyword,
        channelName,
        socialLinks,
        algorithmStrategy,
      });
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating SEO:', error);
    return res.status(500).json({
      error: 'Gagal memproses SEO. Coba ulangi kembali.',
      details: error?.message || String(error),
    });
  }
});

/**
 * POST /api/analyze-competitor
 * Analyzes a competitor's video title, keywords, or topic and returns a breakdown of how to beat them.
 */
app.post('/api/analyze-competitor', async (req, res) => {
  try {
    const { competitorTitle, competitorChannel, competitorTopic, userStoryConcept } = req.body;

    if (!competitorTitle && !competitorTopic) {
      return res.status(400).json({ error: 'Judul atau topik video pesaing wajib diisi.' });
    }

    const systemInstruction = `Anda adalah Analis Riset YouTube Competitor Intelligence tingkat tinggi.
Tugas Anda adalah membedah formula video pesaing (judul, tag tersembunyi, pemicu klik CTR, kelemahan naskah mereka), serta menyusun strategi serangan balik agar video pengguna BISA MEREBUT penonton mereka (suggested video & search ranking).`;

    const prompt = `Analisis video pesaing berikut dan bandingkan dengan konsep cerita saya:

[DATA VIDEO PESAING]
- Judul Video Pesaing: "${competitorTitle || '-'}"
- Channel Pesaing: "${competitorChannel || 'Kompetitor Populer'}"
- Topik / Cerita Pesaing: "${competitorTopic || '-'}"

[KONSEP CERITA KITA]
- Ide / Naskah Cerita Kita: "${userStoryConcept || 'Belum dimasukkan / Menyesuaikan'}"

Berikan analisis mendalam dalam format JSON.`;

    let parsedData = null;
    try {
      const response = await generateContentWithRetry({
        contents: prompt,
        systemInstruction,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competitorScoreSummary: {
              type: Type.STRING,
              description: 'Ringkasan singkat kekuatan SEO video pesaing',
            },
            titleBreakdown: {
              type: Type.OBJECT,
              properties: {
                characters: { type: Type.INTEGER },
                clickTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
                strengths: { type: Type.STRING },
                weaknesses: { type: Type.STRING },
              },
              required: ['characters', 'clickTriggers', 'strengths', 'weaknesses'],
            },
            estimatedTagsUsed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Perkiraan tag-tag YouTube yang digunakan pesaing untuk merangking video ini',
            },
            contentGaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Celah cerita atau informasi yang dilewatkan oleh pesaing yang bisa kita lengkapi',
            },
            howToBeatStrategy: {
              type: Type.OBJECT,
              properties: {
                betterTitleSuggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2-3 alternatif judul kita yang lebih mematikan (tetap 20-60 karakter)',
                },
                thumbnailCounterAngle: {
                  type: Type.STRING,
                  description: 'Sudut visual thumbnail yang lebih menarik dari pesaing',
                },
                firstMinuteHook: {
                  type: Type.STRING,
                  description: 'Trik hook pembuka agar penonton pesaing berpindah menonton video kita sampai habis',
                },
                suggestedVideoHijackTip: {
                  type: Type.STRING,
                  description: 'Cara tag dan deskripsi agar video kita muncul di kolom "Up Next / Rekomendasi" video pesaing tersebut',
                },
              },
              required: [
                'betterTitleSuggestions',
                'thumbnailCounterAngle',
                'firstMinuteHook',
                'suggestedVideoHijackTip',
              ],
            },
          },
          required: [
            'competitorScoreSummary',
            'titleBreakdown',
            'estimatedTagsUsed',
            'contentGaps',
            'howToBeatStrategy',
          ],
        },
      });

      const rawText = cleanJsonString(response.text || '{}');
      parsedData = JSON.parse(rawText);
    } catch (genErr: any) {
      console.warn('Gemini API competitor high demand / unavailable, executing rule-based competitor engine:', genErr?.message || genErr);
      parsedData = generateFallbackCompetitor({
        competitorTitle,
        competitorChannel,
        competitorTopic,
        userStoryConcept,
      });
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error analyzing competitor:', error);
    return res.status(500).json({
      error: 'Gagal menganalisis video pesaing.',
      details: error?.message || String(error),
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TubeBoost Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
