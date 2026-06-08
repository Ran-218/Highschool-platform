const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXzSUjykCIlazKDNsoSk6S3FUCFchywAhpU6F6EaNOS5ptr9FG22q0dvTRSlCh8rdisjt2X-E27t97/pub?gid=0&single=true&output=csv";

let todayQuestion = "";
let todayQuestionId = "";

// 初期化
loadData();

// ----------------------
// データ読み込み
// ----------------------
function loadData() {

  fetch(csvURL)
    .then(res => res.text())
    .then(csv => {

      const rows = csv.trim().split("\n");

      let questions = [];
      let answers = [];

      rows.slice(1).forEach(row => {

const cols = row.split(",");

if(cols.length < 2) return;

const id = (cols[0] || "").trim();
const type = (cols[1] || "").trim();
const text = (cols[2] || "").trim();
const answer = (cols[3] || "").trim();

  if(!type) return;

  if(type === "question"){
    questions.push({id, text});
  }

  if(type === "answer"){
    answers.push(answer);
  }

});

      selectTodayQuestion(questions);
      drawChart(answers);

    });

}

// ----------------------
// 今日の質問（擬似ランダム固定）
// ----------------------
function selectTodayQuestion(questions) {

  if(questions.length === 0){
    document.getElementById("question").innerText =
      "質問がまだありません";
    return;
  }

  // 日付ベースで固定（同じ日に同じ質問）
  const today = new Date().toISOString().slice(0,10);

  let hash = 0;
  for(let i=0;i<today.length;i++){
    hash += today.charCodeAt(i);
  }

  const index = hash % questions.length;

  todayQuestion = questions[index].text;
  todayQuestionId = questions[index].id;

  document.getElementById("question").innerText = todayQuestion;
}

// ----------------------
// 質問投稿
// ----------------------
function submitQuestion() {

  const q = document.getElementById("newQuestion").value;

  alert("質問投稿（Sheets連携必要）: " + q);

}

// ----------------------
// 回答投稿
// ----------------------
function submitAnswer(answer) {

  alert(`質問: ${todayQuestion}\n回答: ${answer}`);

}

// ----------------------
// グラフ
// ----------------------
function drawChart(answers) {

  let yes = 0;
  let no = 0;

  answers.forEach(a => {
    if(a === "はい") yes++;
    if(a === "いいえ") no++;
  });

  new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: ["はい", "いいえ"],
      datasets: [{
        label: "回答数",
        data: [yes, no]
      }]
    }
  });

}

// ----------------------
// 10秒更新（簡易リアルタイム）
// ----------------------
setInterval(loadData, 10000);