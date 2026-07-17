// ============================
// Firebase import
// ============================

import { SurveyDB } from "../js/surveyfirebase.js";

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


function selectTodayQuestion(questions){


  if(questions.length===0){


    document.getElementById("question").innerText =
      "質問がありません";


    return;


  }



  const today =
    new Date().toISOString().slice(0,10);



  let hash = 0;



  for(let i=0;i<today.length;i++){


    hash += today.charCodeAt(i);


  }



  const index =
    hash % questions.length;



  todayQuestionId =
    questions[index].id;



  document.getElementById("question").innerText =
    questions[index].text;


}



// ============================
// 回答送信
// ============================


window.submitAnswer = async function(answer){


  try{


    await addDoc(

      collection(db,"answers"),

      {

        questionId:
          todayQuestionId,

        answer:
          answer,

        createdAt:
          serverTimestamp()

      }

    );



    alert("回答しました");



    loadData();



  }catch(error){


    console.error(error);

    alert("回答失敗");


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

      collection(db,"questions"),

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