console.log("SURVEY SCRIPT LOADED");

const questionsURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXzSUjykCIlazKDNsoSk6S3FUCFchywAhpU6F6EaNOS5ptr9FG22q0dvTRSlCh8rdisjt2X-E27t97/pub?gid=0&single=true&output=csv";
const answersURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXzSUjykCIlazKDNsoSk6S3FUCFchywAhpU6F6EaNOS5ptr9FG22q0dvTRSlCh8rdisjt2X-E27t97/pub?gid=295302740&single=true&output=csv";

let todayQuestion = "";
let todayQuestionId = "";

loadData();

function loadData() {

  Promise.all([
    fetch(questionsURL).then(r => r.text()),
    fetch(answersURL).then(r => r.text())
  ])
  .then(([qcsv, acsv]) => {

    let questions = [];
    let answers = [];

    // -----------------
    // questions
    // -----------------
    qcsv.trim().split("\n").slice(1).forEach(row => {

      const cols = row.split(",");
      const id = (cols[0] || "").trim();
      const text = (cols[1] || "").trim();

      if(id && text){
        questions.push({id, text});
      }

    });

    // -----------------
    // answers
    // -----------------
    acsv.trim().split("\n").slice(1).forEach(row => {

      const cols = row.split(",");
      const question_id = (cols[0] || "").trim();
      const answer = (cols[1] || "").trim();

      if(answer){
        answers.push({question_id, answer});
      }

    });

    console.log("questions:", questions);
    console.log("answers:", answers);

    selectTodayQuestion(questions);
    drawChart(answers);

  })
  .catch(err => {
    console.error("fetch error:", err);
    document.getElementById("question").innerText = "読み込み失敗";
  });

}