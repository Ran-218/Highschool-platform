console.log("SCRIPT START");
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

console.log("LOADDATA RUN");#
setInterval(loadData, 15000);

// --------------------
// データ読み込み
// --------------------
function loadData() {

console.log("FETCH START");

  Promise.all([
    fetch(questionsURL).then(r => r.text()),
    fetch(answersURL).then(r => r.text())
  ])
  .then(([qcsv, acsv]) => {

    let questions = [];
    let answers = [];

    // --------------------
    // QUESTIONS
    // --------------------
    qcsv
      .trim()
      .split(/\r?\n/)
      .filter(r => r)
      .slice(1)
      .forEach(row => {

        const cols = row.split(",");

        const id = (cols[0] ?? "").trim();
        const type = (cols[1] ?? "").trim();
        const text = (cols[2] ?? "").trim();

        if (type === "question" && text) {
          questions.push({ id, text });
        }
      });

    // --------------------
    // ANSWERS
    // --------------------
    acsv
      .trim()
      .split(/\r?\n/)
      .filter(r => r)
      .slice(1)
      .forEach(row => {

        const cols = row.split(",");

        const type = (cols[1] ?? "").trim();
        const answer = (cols[2] ?? "").trim();

        if (type === "answer" && answer) {
          answers.push(answer);
        }
      });

    console.log("questions:", questions);
    console.log("answers:", answers);

    selectTodayQuestion(questions);
    drawChart(answers);

  })
  .catch(err => {
    console.error(err);
    document.getElementById("question").innerText = "読み込み失敗";
  });
}

// --------------------
// 今日の質問（固定）
// --------------------
function selectTodayQuestion(questions) {

  if (!questions.length) {
    document.getElementById("question").innerText = "質問がまだありません";
    return;
  }

  const today = new Date().toISOString().slice(0,10);

  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash += today.charCodeAt(i);
  }

  const index = hash % questions.length;

  todayQuestion = questions[index].text;
  todayQuestionId = questions[index].id;

  document.getElementById("question").innerText = todayQuestion;
}

// --------------------
// 回答（仮）
// --------------------
function submitAnswer(answer) {
  alert(`質問: ${todayQuestion}\n回答: ${answer}`);
}

// --------------------
// 質問投稿（仮）
// --------------------
function submitQuestion() {
  const q = document.getElementById("newQuestion").value;
  alert("質問投稿（未連携）: " + q);
}

// --------------------
// グラフ
// --------------------
function drawChart(answers) {

  let yes = 0;
  let no = 0;

  answers.forEach(a => {
    if (a === "はい") yes++;
    if (a === "いいえ") no++;
  });

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
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