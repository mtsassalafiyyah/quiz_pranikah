let score = 0;
let timeLeft = 0;
let timer = null;
let currentLevel = "";
let currentIndex = 0;
let currentQuestions = [];

const feedbackBenar = [
  "MasyaAllah! Jawaban kamu benar 👍",
  "Bagus! Terus tingkatkan pemahamanmu 💪",
  "Hebat! Ilmu kamu semakin bertambah 🌟",
  "Alhamdulillah, tepat sekali ✅"
];

const feedbackSalah = [
  "Belum tepat, tetap semangat ya 💪",
  "Tidak apa-apa, belajar itu proses 😊",
  "Masih kurang tepat, ayo coba lagi 📚",
  "Tetap semangat, insyaAllah bisa 💖"
];

const questions = {
  mudah: [
    { q: "Apa tujuan utama pernikahan dalam Islam?", a: ["Mendapatkan harta", "Membentuk keluarga sakinah", "Pamer status", "Menghindari kerja"], correct: 1 },
    { q: "Siapa wali dalam pernikahan?", a: ["Teman", "Guru", "Ayah atau wali sah", "Tetangga"], correct: 2 },
    { q: "Akad nikah dilakukan dengan...", a: ["Main-main", "Ijab kabul", "Doa saja", "Janji biasa"], correct: 1 },
    { q: "Saksi nikah minimal berjumlah...", a: ["1", "2", "3", "4"], correct: 1 },
    { q: "Pernikahan adalah ibadah karena...", a: ["Ada pesta", "Perintah agama", "Tradisi", "Budaya"], correct: 1 },
    { q: "Suami wajib memberi...", a: ["Hadiah saja", "Nafkah", "Liburan", "Uang jajan kecil"], correct: 1 },
    { q: "Istri wajib menjaga...", a: ["Gengsi", "Harta orang lain", "Kehormatan diri dan keluarga", "Popularitas"], correct: 2 },
    { q: "Nikah tanpa wali hukumnya...", a: ["Sah", "Tidak sah", "Makruh", "Sunah"], correct: 1 },
    { q: "Salah satu adab rumah tangga adalah...", a: ["Saling menghormati", "Saling egois", "Saling menyalahkan", "Diam semua"], correct: 0 },
    { q: "Pernikahan adalah...", a: ["Beban", "Ibadah", "Tradisi saja", "Gengsi"], correct: 1 }
  ],

  sedang: [
    { q: "Rukun nikah yang benar adalah...", a: ["Pengantin, wali, saksi, ijab kabul", "Pengantin & tamu", "Gedung & dekorasi", "Penghulu saja"], correct: 0 },
    { q: "Komunikasi rumah tangga bertujuan untuk...", a: ["Menang sendiri", "Menyelesaikan konflik", "Mendominasi", "Menghindar"], correct: 1 },
    { q: "Nafkah batin berarti...", a: ["Uang", "Kasih sayang & perhatian", "Hadiah", "Liburan"], correct: 1 },
    { q: "Musyawarah berarti...", a: ["Diskusi bersama", "Satu orang", "Ikut orang lain", "Diam"], correct: 0 },
    { q: "Pendidikan anak tanggung jawab...", a: ["Ibu", "Ayah", "Keduanya", "Sekolah"], correct: 2 },
    { q: "Kejujuran menciptakan...", a: ["Konflik", "Kepercayaan", "Takut", "Tekanan"], correct: 1 },
    { q: "Kesabaran berarti...", a: ["Marah", "Mengendalikan emosi", "Kabur", "Diam total"], correct: 1 },
    { q: "Tujuan nikah menurut agama...", a: ["Status", "Ibadah & berkah", "Harta", "Gengsi"], correct: 1 },
    { q: "Masalah diselesaikan dengan...", a: ["Marah", "Komunikasi", "Diam", "Kabur"], correct: 1 },
    { q: "Saling menghormati berarti...", a: ["Merendahkan", "Menghargai pasangan", "Diam", "Menang sendiri"], correct: 1 }
  ],

  sulit: [
    { q: "Sakinah berarti...", a: ["Mewah", "Tenang & damai", "Populer", "Kaya"], correct: 1 },
    { q: "Mawaddah berarti...", a: ["Kasih sayang", "Harta", "Status", "Kuasa"], correct: 0 },
    { q: "Warahmah berarti...", a: ["Cinta", "Rahmat Allah", "Popularitas", "Kekuatan"], correct: 1 },
    { q: "Nafkah wajib oleh...", a: ["Istri", "Suami", "Anak", "Ortu"], correct: 1 },
    { q: "Pendidikan pranikah bertujuan...", a: ["Formalitas", "Bekal kesiapan", "Administrasi", "Syarat"], correct: 1 },
    { q: "Konflik diselesaikan dengan...", a: ["Ego", "Saling mengalah", "Marah", "Diam"], correct: 1 },
    { q: "Kepemimpinan suami untuk...", a: ["Kuasa", "Tanggung jawab", "Pamer", "Otoriter"], correct: 1 },
    { q: "Nikah tanpa ilmu berpotensi...", a: ["Bahagia", "Masalah", "Sukses", "Tenang"], correct: 1 },
    { q: "Maqashid nikah menjaga...", a: ["Harta", "Keturunan & kehormatan", "Kerja", "Gengsi"], correct: 1 },
    { q: "Tujuan utama rumah tangga...", a: ["Populer", "Sakinah mawaddah warahmah", "Harta", "Gengsi"], correct: 1 }
  ]
};

function startGame(level) {
  currentLevel = level;
  score = 0;
  currentIndex = 0;

  currentQuestions = [...questions[level]];
  shuffle(currentQuestions);

  timeLeft = level === "mudah" ? 90 : level === "sedang" ? 75 : 60;

  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
  document.getElementById("feedback").textContent = "";
  updateProgress();

  clearInterval(timer);
  timer = setInterval(updateTime, 1000);

  showQuestion();
}

function updateTime() {
  timeLeft--;
  document.getElementById("time").textContent = timeLeft;
  if (timeLeft <= 0) endGame();
}

function showQuestion() {
  if (currentIndex >= 10) {
    endGame();
    return;
  }

  const q = currentQuestions[currentIndex];
  document.getElementById("question").textContent = q.q;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  q.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => checkAnswer(i, q.correct);
    answers.appendChild(btn);
  });

  updateProgress();
}

function checkAnswer(selected, correct) {
  const fb = document.getElementById("feedback");

  if (selected === correct) {
    score += 10;
    fb.textContent = "✅ " + random(feedbackBenar);
  } else {
    fb.textContent = "❌ " + random(feedbackSalah);
  }

  document.getElementById("score").textContent = score;
  currentIndex++;

  setTimeout(showQuestion, 900);
}

function endGame() {
  clearInterval(timer);

  let msg = "";
  if (score >= 90) msg = "🌟 Luar biasa! Kamu sangat siap secara ilmu!";
  else if (score >= 70) msg = "👍 Bagus! Tingkatkan lagi agar lebih siap.";
  else if (score >= 50) msg = "😊 Cukup, tapi perlu banyak belajar lagi.";
  else msg = "💪 Tetap semangat! Ilmu pranikah itu penting.";

  document.getElementById("question").textContent =
    "🎉 Selesai! Skor Akhir: " + score + " / 100";

  document.getElementById("answers").innerHTML = "";
  document.getElementById("feedback").innerHTML =
    msg + "<br><br>Semoga Allah mudahkan membangun keluarga sakinah 🤲";

  document.getElementById("progress").textContent = "Selesai";
}

function updateProgress() {
  document.getElementById("progress").textContent =
    "Soal " + (currentIndex + 1) + " / 10";
}

/* UTIL */
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
