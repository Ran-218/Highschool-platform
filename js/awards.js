// 歴代月間大賞データ
// 新しい月を追加するときは、ここに1行追加するだけです。

const awards = [

  {
    month: "2026/7",
    title: "どこでもモバ充",
    author: "非公開",
    likes: 3,
    description: "外出先でもスマートフォンを簡単に充電できる。"
  },

  {
    month: "2026/6",
    title: "テスト2",
    author: "カメレオンラヴァー",
    likes: 2,
    description: "カメレオンの幸せを願うするためのアイデアです。"
  },

  {
    month: "2026/5",
    title: "テスト1",
    author: "元気のこ",
    likes: 98,
    description: "きのこ採集をもっと便利にするためのアイデア"
  }

];


// 表を表示
const awardList = document.getElementById("awardList");

let html = `

<table class="award-table">

  <thead>

    <tr>
      <th>月</th>
      <th>アイデア名</th>
      <th>投稿者名</th>
      <th>いいね数</th>
      <th>商品説明</th>
    </tr>

  </thead>

  <tbody>
`;


// 1行ずつ追加
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

      <td class="award-likes">
        👍 ${award.likes}
      </td>

      <td class="award-description">
        ${award.description}
      </td>

    </tr>

  `;

});


html += `

  </tbody>

</table>

`;


// HTMLに表示
awardList.innerHTML = html;