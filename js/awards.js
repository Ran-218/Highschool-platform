// 歴代月間大賞データ

const awards = [

  {
    month: "2026/7",
    title: "どこでもモバ充",
    author: "非公開",
    problem: "気づいた時には携帯の充電がなくなっている。",
    likes: 3,
    description: "コンパクトサイズでスマホにずっと接続していても落とす心配がなく、かつ充電が50％を切った時に充電を始めてくれて過充電の心配がないモバイルバッテリー。"
  },

  {
    month: "2026/6",
    title: "テスト2",
    author: "カメレオンラヴァー",
    problem: "〇〇〇〇に困っている",
    likes: 2,
    description: "カメレオンの幸せを願うするためのアイデアです。"
  },

  {
    month: "2026/5",
    title: "テスト1",
    author: "元気のこ",
    problem: "〇〇〇〇をもっと便利にしたい",
    likes: 98,
    description: "きのこ採集をもっと便利にするためのアイデア"
  }

];


const awardList = document.getElementById("awardList");

let html = `

<table class="award-table">

  <thead>

    <tr>
      <th>月</th>
      <th>アイデア名</th>
      <th>投稿者名</th>
      <th>解決したいモヤっと</th>
      <th>商品説明</th>
      <th>いいね数</th>
    </tr>

  </thead>

  <tbody>
`;


awards.forEach((award) => {

  html += `

    <tr>

      <td>${award.month}</td>

      <td class="award-title">
        ${award.title}
      </td>

      <td>
        ${award.author}
      </td>

      <td class="award-problem">
        ${award.problem}
      </td>

      <td class="award-description">
        ${award.description}
      </td>

      <td class="award-likes">
        👍 ${award.likes}
      </td>

    </tr>

  `;

});


html += `

  </tbody>

</table>

`;

awardList.innerHTML = html;