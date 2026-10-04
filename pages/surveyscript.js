// ============================
// Firebase import
// ============================

import { surveyDB } from "../js/surveyfirebase.js";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ============================
// 変数
// ============================

let todayQuestionId = "";

let chart = null;


// ============================
// 初期化
// ============================

loadData();



// ============================
// 質問・回答読み込み
// ============================

async function loadData(){


  try {


    const questionSnap =
      await getDocs(collection(surveyDB,"questions"));


    const questions = [];


    questionSnap.forEach(doc=>{

      questions.push({

        id: doc.id,

        text: doc.data().text

      });


    });



    selectTodayQuestion(questions);



    const answerSnap =
      await getDocs(collection(surveyDB,"answers"));



    const answers=[];



    answerSnap.forEach(doc=>{


      answers.push({

        questionId:
          doc.data().questionId,

        answer:
          doc.data().answer

      });


    });



    drawChart(answers);



  } catch(error){


    console.error(error);


    document.getElementById("question").innerText =
      "読み込み失敗";


  }


}




// ============================
// 今日の質問
// ============================



function selectTodayQuestion(questions) {
  if (questions.length === 0) {
    document.getElementById("question").innerText =
      "質問がありません";
    todayQuestionId = "";
    return;
  }

  // 今月の質問を選ぶ基準
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // 月ごとに同じ質問を表示する
  const hash = year * 12 + month;
  const index = hash % questions.length;

  todayQuestionId = questions[index].id;

  document.getElementById("question").innerText =
    questions[index].text;
}





 // ============================
 // 回答送信（回答理由も保存）
 // ============================

window.submitAnswer = async function(answer) {

  // 今月の質問がない場合
  if (!todayQuestionId) {
    alert("質問がまだありません。");
    return;
  }

  // 入力された回答理由を取得
  const reason =
    document.getElementById("reason").value.trim();

  try {

    await addDoc(
      collection(surveyDB, "answers"),
      {
        questionId: todayQuestionId,

        answer: answer,

        reason: reason,

        createdAt: serverTimestamp()
      }
    );

    alert("回答しました");

    // 理由の入力欄を空にする
    document.getElementById("reason").value = "";

    // 回答数・グラフを更新
    loadData();

  } catch(error) {

    console.error(error);

    alert("回答失敗");

  }

};

// ============================
// 回答理由の送信
// ============================
window.submitReason = async function() {
  if (!todayQuestionId) {
    alert("質問がまだありません。");
    return;
  }

  const reason = document.getElementById("reason").value.trim();

  if (!reason) {
    alert("回答理由を入力してください。");
    return;
  }

  try {
    await addDoc(
      collection(surveyDB, "answers"),
      {
        questionId: todayQuestionId,
        reason: reason,
        createdAt: serverTimestamp()
      }
    );

    alert("回答理由を送信しました。");
    document.getElementById("reason").value = "";

  } catch (error) {
    console.error(error);
    alert("回答理由の送信に失敗しました。");
  }
};

// ============================
// 質問投稿
// ============================


window.submitQuestion = async function(){


  const q =
    document.getElementById("newQuestion").value;



  if(!q){


    alert("質問を入力してください");

    return;


  }



  try{


    await addDoc(

      collection(surveyDB,"questions"),

      {

        text:q,

        createdAt:
          serverTimestamp()

      }

    );



    alert("投稿しました");



    document.getElementById("newQuestion").value="";



    loadData();



  }catch(error){


    console.error(error);

    alert("投稿失敗");


  }


};




// ============================
// グラフ
// ============================


function drawChart(answers){



  let yes = 0;

  let no = 0;



  answers.forEach(item=>{


    // 今日の質問だけ集計

    if(item.questionId !== todayQuestionId){

      return;

    }



    if(item.answer==="はい"){

      yes++;

    }



    if(item.answer==="いいえ"){

      no++;

    }


  });



  if(chart){

    chart.destroy();

  }




  chart = new Chart(

    document.getElementById("chart"),


    {


      type:"bar",


      data:{


        labels:["はい","いいえ"],


        datasets:[{

          label:"回答数",

          data:[yes,no]

        }]


      },


      options:{


        responsive:true,


        scales:{


          y:{


            beginAtZero:true


          }


        }


      }


    }


  );


}