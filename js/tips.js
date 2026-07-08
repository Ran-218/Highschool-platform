import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ボタン
const submitButton = document.getElementById("submit");

// 投稿
submitButton.addEventListener("click", async () => {

  const title = document.getElementById("title").value.trim();
  const problem = document.getElementById("problem").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();

  if (!title || !problem || !description) {
    alert("すべて入力してください");
    return;
  }

  try {

    await addDoc(collection(db, "ideas"), {

      title: title,
      problem: problem,
      category: category,
      description: description,

      votes: 0,

      createdAt: serverTimestamp()

    });

    alert("投稿しました！");

    document.getElementById("title").value = "";
    document.getElementById("problem").value = "";
    document.getElementById("description").value = "";

    loadIdeas();

  }

  catch(error){

    console.error(error);

    alert("投稿できませんでした");

  }

});


// 一覧表示
async function loadIdeas(){

  const list=document.getElementById("ideaList");

  list.innerHTML="";

  const q=query(
    collection(db,"ideas"),
    orderBy("createdAt","desc")
  );

  const snapshot=await getDocs(q);

  if(snapshot.empty){

    list.innerHTML="<p>まだ投稿はありません。</p>";

    return;

  }

  snapshot.forEach(doc=>{

    const data=doc.data();

    const card=document.createElement("div");

    card.style.border="1px solid #ccc";
    card.style.padding="15px";
    card.style.marginBottom="15px";
    card.style.borderRadius="10px";

    card.innerHTML=`

<h3>${data.title}</h3>

<p><b>解決するモヤっと</b></p>

<p>${data.problem}</p>

<p><b>カテゴリー</b></p>

<p>${data.category}</p>

<p><b>アイデア</b></p>

<p>${data.description}</p>

<p>👍 ${data.votes}票</p>

`;

    list.appendChild(card);

  });

}

loadIdeas();