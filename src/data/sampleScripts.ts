export interface SampleScript {
  id: string;
  genre: string;
  title: string;
  focusKeyword: string;
  content: string;
}

export const SAMPLE_SCRIPTS: SampleScript[] = [
  {
    id: 'film_plot_twist',
    genre: 'Alur Cerita Film',
    title: 'Plot Twist Pulau Terisolasi (Thriller Misteri)',
    focusKeyword: 'alur cerita film plot twist',
    content: `Alur Cerita Film: "The Island Secret" (2024)
Intisari Cerita:
Seorang detektif bernama Edward dikirim ke sebuah pulau karang terpencil di lepas pantai untuk menyelidiki hilangnya seorang miliarder misterius. Di pulau tersebut hanya ada mercusuar tua dan sebuah rumah mewah bergaya Gotik yang dihuni oleh 5 orang yang saling mencurigai.

Setiap malam badai datang, satu per satu penghuni rumah ditemukan tewas dengan petunjuk lilin hitam di dekat tubuh mereka. Edward mulai merasa jam tangan dan ingatannya tidak sinkron. Jam di pulau berjalan mundur 1 jam setiap kali lonceng mercusuar berdentang.

Di klimaks cerita, Edward menemukan buku harian sang miliarder di ruang bawah tanah rahasia. Ternyata, miliarder itu bukanlah orang lain melainkan Edward sendiri yang telah kehilangan ingatan akibat trauma 10 tahun lalu, dan seluruh orang di rumah itu adalah proyeksi ilusi dari rasa bersalahnya saat proses terapi psikiatri eksperimental.`,
  },
  {
    id: 'kisah_horor',
    genre: 'Kisah Horor & Misteri',
    title: 'Misteri Jalur Pendakian Terlarang Gunung Salak',
    focusKeyword: 'kisah horor pendakian gunung',
    content: `Kisah Nyata Pendakian: "Jangan Menoleh ke Belakang"
Intisari Cerita:
Pada bulan Oktober 2021, empat sahabat asal Bandung nekat mendaki jalur yang sudah lama ditutup warga lokal di lereng timur. Sejak awal pos perizinan, juru kunci sudah berpesan untuk tidak pernah menyalakan senter ke arah dahan pohon beringin tua setelah jam 6 sore.

Namun, di tengah perjalanan mereka tersesat karena kabut tebal berwarna kemerahan menyelimuti tenda. Mereka mendengar suara gamelan jawa dan tawa anak kecil yang melayang di sekitar kanopi hutan. Saat salah satu pendaki bernama Yoga menyorotkan senter ke atas, ia melihat sosok tinggi berpakaian serba putih tanpa wajah yang sedang mengamati mereka.

Perjalanan turun menjadi mimpi buruk selama 18 jam di mana kompas terus berputar ke arah puncak. Mereka baru tersadar di bibir jurang ketika adzan subuh berkumandang dari desa seberang lembah.`,
  },
  {
    id: 'kisah_sukses_ai',
    genre: 'Edukasi & Bisnis',
    title: 'Kisah Pemuda Desa Raup Ratusan Juta dari AI',
    focusKeyword: 'cara menghasilkan uang dari ai',
    content: `Intisari Cerita Inspiratif:
Kisah nyata Reza, seorang pemuda dari pelosok Jawa Tengah yang dulu hanya bekerja sebagai buruh tani dengan penghasilan harian pas-pasan. Dengan bermodalkan sebuah laptop bekas pinjaman dan koneksi internet gratis di balai desa, Reza mulai mempelajari cara memanfaatkan kecerdasan buatan (Artificial Intelligence) untuk membuat konten dan desain digital bagi klien mancanegara.

Dalam 8 bulan pertama ia sempat mengalami penolakan puluhan kali. Namun titik balik terjadi saat ia menemukan alur kerja otomatisasi naskah dan aset video untuk agensi luar negeri. Di tahun kedua, omzet bulanannya tembus lebih dari 120 juta rupiah dan ia kini mempekerjakan 14 pemuda di desanya untuk membangun studio kreatif berbasis AI.`,
  },
];
