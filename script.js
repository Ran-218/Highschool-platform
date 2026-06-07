const SHEET_URL = "https://docs.google.com/spreadsheets/d/1a7d5S8oVsK_Uox3s5iaXQ1PLiNLq1J1d9NuRFmmBqgU/edit?usp=sharing";

let posts = [];
let currentFilter = "all";
let currentMood = "all";

async function loadPosts() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = text.split("\n").slice(1);

    posts = rows.map((row, index) => {
      const cols = row.split(",");

      return {
        id: index,
        text: cols[1],
        category: cols[2],
        like: Number(cols[3] || 0),
        mood: Number(cols[4] || 0)
      };
    }).filter(p => p.text);

    render();
    renderRanking();

  } catch (e) {
    console.error(e);
    document.getElementById("list").innerText =
      "データ読み込み失敗";
  }
}

/* -------------------------
   フィルター（カテゴリ）
-------------------------- */
function filter(type) {
  currentFilter = type;
  render();
}

/* -------------------------
   フィルター（モヤ度）
-------------------------- */
function filterMood(level) {
  currentMood = level;
  render();
}

/* -------------------------
   表示（メインフィード）
-------------------------- */
function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let filtered = posts;

  // カテゴリフィルタ
  if (currentFilter !== "all") {
    filtered = filtered.filter(p => p.category === currentFilter);
  }

  // モヤ度フィルタ
  if (currentMood !== "all") {
    filtered = filtered.filter(p => p.mood == currentMood);
  }

  filtered.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${post.text}</p>
      <small>
        📂 ${post.category} | 😶 モヤ度: ${post.mood}
      </small><br>

      <button onclick="like(${post.id})">
        👍 共感 ${post.like}
      </button>
    `;

    list.appendChild(div);
  });
}

/* -------------------------
   🔥 人気ランキング
-------------------------- */
function renderRanking() {
  const ranking = document.getElementById("ranking");
  if (!ranking) return;

  ranking.innerHTML = "";

  const top = [...posts]
    .sort((a, b) => (b.like * b.mood) - (a.like * a.mood))
    .slice(0, 5);

  top.forEach((post, i) => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <strong>#${i + 1}</strong>
      <p>${post.text}</p>
      <small>
        🔥 共感 ${post.like} | 😶 モヤ度 ${post.mood}
      </small>
    `;

    ranking.appendChild(div);
  });
}

/* -------------------------
   👍 いいね（仮機能）
-------------------------- */
function like(id) {
  const post = posts.find(p => p.id === id);

  if (post) {
    post.like += 1;
  }

  render();
  renderRanking();
}

/* -------------------------
   初期化
-------------------------- */
loadPosts();
