const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXzSUjykCIlazKDNsoSk6S3FUCFchywAhpU6F6EaNOS5ptr9FG22q0dvTRSlCh8rdisjt2X-E27t97/pub?output=csv";

// 初期ロード
loadData();

// クリックで送信（仮：まずローカル集計）
function submitAnswer(answer) {
  alert("送信（Google Forms連携は後で追加）: " + answer);
}

// データ取得＆描画
function loadData() {

  fetch(csvURL)
    .then(res => res.text())
    .then(csv => {

      const rows = csv.trim().split("\n");

      let yes = 0;
      let no = 0;

      rows.slice(1).forEach(row => {

        const cols = row.split(",");
        const ans = cols[1]?.trim();

        if (ans === "はい") yes++;
        if (ans === "いいえ") no++;

      });

      drawChart(yes, no);

    });

}

// グラフ描画
function drawChart(yes, no) {

  const ctx = document.getElementById("chart");

  new Chart(ctx, {
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
        y: { beginAtZero: true }
      }
    }
  });

}

// 10秒ごとに更新（リアルタイム化）
setInterval(loadData, 10000);