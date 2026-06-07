const SHEET_URL = "https://docs.google.com/spreadsheets/d/1a7d5S8oVsK_Uox3s5iaXQ1PLiNLq1J1d9NuRFmmBqgU/edit?usp=sharing";

let posts = [];
let currentFilter = "all";

async function loadPosts() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.split("\n").slice(1);

  posts = rows.map((row, index) => {
    const cols = row.split(",");

    return {
      id: index,
      text: cols[1],
      category: cols[2],
      like: Number(cols[3] || 0)
    };
  }).filter(p => p.text);

  render();
  renderRanking();
}

/* -----------------------
   通常フィード
----------------------- */
function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let filtered = posts;

  if (currentFilter !== "all") {
    filtered = posts.filter(p => p.category === currentFilter);
  }

  filtered.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${post.text}</p>
      <small>${post.category}</small><br>
      <button onclick="like(${post.id})">
        👍 共感 ${post.like}
      </button>
    `;

    list.appendChild(div);
  });
}

/* -----------------------
   🔥 人気ランキング
----------------------- */
function renderRanking() {
  const ranking = document.getElementById("ranking");
  ranking.innerHTML = "";

  const top = [...posts]
    .sort((a, b) => b.like - a.like)
    .slice(0, 5);

  top.forEach((post, i) => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <strong>#${i + 1}</strong>
      <p>${post.text}</p>
      <small>🔥 ${post.like} 共感</small>
    `;

    ranking.appendChild(div);
  });
}

/* -----------------------
   共感ボタン（擬似）
----------------------- */
function like(id) {
  const post = posts.find(p => p.id === id);

  if (post) {
    post.like += 1;
  }

  render();
  renderRanking();
}

/* -----------------------
   フィルター
----------------------- */
function filter(type) {
  currentFilter = type;
  render();
}

/* 初期化 */
loadPosts();
