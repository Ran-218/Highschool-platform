import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// =========================
// 記事投稿
// =========================
window.postArticle = async function () {

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value;
  const language = document.getElementById("language").value;
  const content = document.getElementById("content").value.trim();

  if (!title || !author || !content) {
    alert("タイトル・名前・本文を入力してください。");
    return;
  }

  await addDoc(collection(db, "articles"), {

    title: title,
    author: author,
    category: category,
    language: language,
    content: content,

    likes: 0,

    createdAt: serverTimestamp(),

    awardMonth: "",

    isMonthlyWinner: false

  });

  alert("投稿しました！");

  location.reload();

};

// =========================
// 記事一覧
// =========================
async function loadArticles() {

  const q = query(
    collection(db, "articles"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  let html = "";

  for (const article of snapshot.docs) {

    const data = article.data();

    html += `
      <div style="border:1px solid #ccc;padding:15px;margin-bottom:20px;">

      <h2>${data.title}</h2>

      <p>
      <b>${data.author}</b>
      </p>

      <p>

      ${data.category}

      |

      ${data.language}

      </p>

      <p>

      ${data.content.replace(/\n/g,"<br>")}

      </p>

      <button onclick="like('${article.id}')">

      👍 ${data.likes}

      </button>

      <hr>

      <h4>コメント</h4>

      <div id="comments-${article.id}">
      読み込み中...
      </div>

      <textarea
      id="comment-${article.id}"
      placeholder="一言コメント"
      rows="2"
      cols="40"></textarea>

      <br>

      <button onclick="comment('${article.id}')">

      コメントする

      </button>

      </div>
    `;
  }

  document.getElementById("articles").innerHTML = html;

  // コメント読み込み
  for (const article of snapshot.docs) {
    loadComments(article.id);
  }

    }
    // =========================
// 👍いいね
// =========================

window.like = async function(articleID) {

  const ref = doc(db, "articles", articleID);

  await updateDoc(ref, {
    likes: increment(1)
  });

  location.reload();

};


// =========================
// コメント投稿
// =========================

window.comment = async function(articleID) {

  const text = document
    .getElementById("comment-" + articleID)
    .value
    .trim();

  if (text === "") {
    alert("コメントを入力してください。");
    return;
  }

  // その記事のコメント数を取得
  const q = query(
    collection(db, "comments"),
    where("articleID", "==", articleID)
  );

  const snap = await getDocs(q);

  if (snap.size >= 5) {
    alert("コメントは5件までです。");
    return;
  }

  // コメントを追加
  await addDoc(collection(db, "comments"), {

    articleID: articleID,

    text: text,

    createdAt: serverTimestamp()

  });

  location.reload();

};

// =========================
// コメント表示
// =========================

async function loadComments(articleID) {

  const q = query(
    collection(db, "comments"),
    where("articleID", "==", articleID)
  );

  const snapshot = await getDocs(q);

  let html = "";

  if (snapshot.empty) {

    html = "<p>まだコメントはありません。</p>";

  } else {

    snapshot.forEach((comment) => {

      const data = comment.data();

      html += `
        <p>💬 ${data.text}</p>
      `;

    });

  }

  document.getElementById("comments-" + articleID).innerHTML = html;

}


// =========================
// ページ読み込み時
// =========================

loadArticles();