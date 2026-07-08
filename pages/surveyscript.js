console.log("SURVEY SCRIPT LOADED");

// --------------------
// CSV URL
// --------------------
const questionsURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRXzSUjykCIlazKDNsoSk6S3FUCFchywAhpU6F6EaNOS5ptr9FG22q0dvTRSlCh8rdisjt2X-E27t97/pub?gid=0&single=true&output=csv";

const answersURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRXzSUjykCIlazKDNsoSk6S3FUCFchywAhpU6F6EaNOS5ptr9FG22q0dvTRSlCh8rdisjt2X-E27t97/pub?gid=295302740&single=true&output=csv";

let todayQuestion = "";
let todayQuestionId = "";
let chart = null;


// --------------------
// 初期化
// --------------------
loadData();

setInterval(loadData, 15000);


// --------------------
// データ読み込み
// --------------------
function loadData() {

  Promise.all([
    fetch(questionsURL).then(r => r.text()),
    fetch(answersURL).then(r => r.text())
  ])

  .then(([qcsv, acsv]) => {

    let questions = [];
    let answers = [];

    // questionsシート
    qcsv
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .forEach(row => {

        const cols = row.split(",");

        const id = (cols[0] || "").trim();
        const type = (cols[1] || "").trim();
        const text = (cols[2] || "").trim();

        if (type === "question") {

          questions.push({
            id: id,
            text: text
          });

        }

      });


    // answersシート
    acsv
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .forEach(row => {

        const cols = row.split(",");

        const question_id = (cols[0] || "").trim();
        const answer = (cols[1] || "").trim();

        if (answer) {

          answers.push({
            question_id: question_id,
            answer: answer
          });

        }

      });


    console.log(questions);
    console.log(answers);

    selectTodayQuestion(questions);

    drawChart(answers);

  })

  .catch(error => {

    console.error(error);

    document.getElementById("question").innerText =
      "読み込み失敗";

  });

}


// --------------------
// 今日の質問
// --------------------
function selectTodayQuestion(questions) {

  if (questions.length === 0) {

    document.getElementById("question").innerText =
      "質問がありません";

    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  let hash = 0;

  for (let i = 0; i < today.length; i++) {

    hash += today.charCodeAt(i);

  }

  const index = hash % questions.length;

  todayQuestionId = questions[index].id;

  todayQuestion = questions[index].text;

  document.getElementById("question").innerText =
    todayQuestion;

}


// --------------------
// 回答
// --------------------
function submitAnswer(answer) {

  alert("回答: " + answer);

}


// --------------------
// 質問投稿
// --------------------
function submitQuestion() {

  const q = document.getElementById("newQuestion").value;

  if (!q) {
    alert("質問を入力してください");
    return;
  }

  const form = new FormData();

  form.append("question", q);

  fetch(
    "https://script.google.com/macros/s/AKfycbwyrru1W9mptenFPy5mU5ihBYiYLqod9zcZanZI7qnyx14BteotGJGtlE-z2pDHUFA3/exec",
    {
      method: "POST",
      body: form
    }
  )
  .then(r => r.text())
  .then(() => {

      alert("投稿しました");

      document.getElementById("newQuestion").value="";

      loadData();

  })
  .catch(err => {

      console.error(err);

      alert("投稿失敗");

  });

}

// --------------------
// グラフ
// --------------------
function drawChart(answers) {

  let yes = 0;
  let no = 0;

  answers.forEach(item => {

    if (item.answer === "はい") {

      yes++;

    }

    if (item.answer === "いいえ") {

      no++;

    }

  });


  if (chart) {

    chart.destroy();

  }


  chart = new Chart(

    document.getElementById("chart"),

    {

      type: "bar",

      data: {

        labels: ["はい", "いいえ"],

        datasets: [{

          label: "回答数",

          data: [yes, no]

        }]

      },

      options: {

        responsive: true,

        scales: {

          y: {

            beginAtZero: true

          }

        }

      }

    }

  );

}