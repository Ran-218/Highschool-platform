import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  increment,
  where
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { db } from "./firebase.js";
console.log("tips.js が読み込まれました");

// ===============================
// 投稿機能
// ===============================

const submitBtn = document.getElementById("submit");


submitBtn.addEventListener("click", async () => {

  const title = document.getElementById("title").value;
  const problem = document.getElementById("problem").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;


  if (
    title === "" ||
    problem === "" ||
    description === ""
  ) {

    alert("未入力の項目があります");
    return;

  }


  try {

    const now = new Date();

await addDoc(collection(db,"ideas"),{

  title: title,
  problem: problem,
  category: category,
  description: description,

  votes: 0,

  createdAt: serverTimestamp(),

  year: now.getFullYear(),

  month: now.getMonth()+1

});


    alert("投稿しました！");


    document.getElementById("title").value="";
    document.getElementById("problem").value="";
    document.getElementById("description").value="";


  } catch(error){

    console.error(error);

    alert("投稿に失敗しました");

  }

});




// ===============================
// 投稿一覧表示
// ===============================


const ideaList = document.getElementById("ideaList");


const q = query(

  collection(db,"ideas"),

  orderBy("createdAt","desc")

);



onSnapshot(q,(snapshot)=>{


  ideaList.innerHTML="";


  if(snapshot.empty){

    ideaList.innerHTML=
    "<p>まだ投稿はありません</p>";

    return;

  }



  snapshot.forEach((docSnap)=>{


    const data = docSnap.data();


    const div = document.createElement("div");


    div.className="idea-card";



    div.innerHTML = `

      <h3>
      💡 ${data.title}
      </h3>


      <p>
      <b>解決したいモヤっと：</b>
      ${data.problem}
      </p>


      <p>
      <b>カテゴリー：</b>
      ${data.category}
      </p>


      <p>
      ${data.description}
      </p>


      <button class="vote-btn"
      data-id="${docSnap.id}">
      👍 ${data.votes || 0}
      </button>


      <hr>

    `;



    ideaList.appendChild(div);


  });



  // 投票ボタン設定

  const buttons =
  document.querySelectorAll(".vote-btn");


  buttons.forEach(button=>{


    button.addEventListener("click",async()=>{


      const id =
      button.dataset.id;



      const ref =
      doc(db,"ideas",id);



      await updateDoc(ref,{

        votes:increment(1)

      });


    });


  });



});




// ===============================
// ランキング表示
// ===============================


const ranking =
document.getElementById("ranking");



const now = new Date();

const rankingQuery = query(

  collection(db,"ideas"),

  where("year","==",now.getFullYear()),

  where("month","==",now.getMonth()+1),

  orderBy("votes","desc")

);



onSnapshot(rankingQuery,(snapshot)=>{


  ranking.innerHTML="";


  let count=0;


  snapshot.forEach((docSnap)=>{


    if(count>=5)return;


    const data=docSnap.data();



    ranking.innerHTML += `

    <p>
    ${count+1}位 🏆

    ${data.title}

    👍${data.votes || 0}

    </p>

    `;


    count++;


  });



  if(count===0){

    ranking.innerHTML=
    "<p>まだランキングはありません</p>";

  }


});