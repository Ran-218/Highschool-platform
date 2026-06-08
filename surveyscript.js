const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXzSUjykCIlazKDNsoSk6S3FUCFchywAhpU6F6EaNOS5ptr9FG22q0dvTRSlCh8rdisjt2X-E27t97/pub?gid=0&single=true&output=csv";

let todayQuestion = "";
let todayQuestionId = "";

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

        const id = (cols[0] || "").trim();
        const col2 = (cols[1] || "").trim();
        const col3 = (cols[2] || "").trim();

        // Sheet1（questions）
        if(cols.length >= 3 && col2 && !col3){
          questions.push({
            id: id,
            text: col2
          });
        }

        // Sheet2（answers）
        if(cols.length >= 2 && col2 && col3){
          answers.push({
            question_id: id,
            answer: col2
          });
        }

      });

      selectTodayQuestion(questions);
      drawChart(answers);

    })
    .catch(err => {
      console.error("fetch error:", err);
      document.getElementById("question").innerText = "読み込み失敗";
    });

}

// ----------------------
// 今日の質問（固定化）
// ----------------------
function selectTodayQuestion(questions) {

  if(questions.length === 0){
    document.getElementById("question").innerText = "質問なし";
    return;
  }

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
// 回答送信（仮）
// ----------------------
function submitAnswer(answer) {

  alert(`質問: ${todayQuestion}\n回答: ${answer}`);

  // 本当はここでGoogle Forms or Apps Scriptに送る
}

// ----------------------
// 質問投稿（仮）
// ----------------------
function submitQuestion() {

  const q = document.getElementById("newQuestion").value;

  alert("質問投稿: " + q);

}

// ----------------------
// グラフ
// ----------------------
let chart;

function drawChart(answers) {

  let yes = 0;
  let no = 0;

  answers.forEach(a => {
    if((a.answer || "").trim() === "はい") yes++;
    if((a.answer || "").trim() === "いいえ") no++;
  });

  if(chart){
    chart.destroy();
  }

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

// ----------------------
// 10秒更新
// ----------------------
setInterval(loadData, 10000);