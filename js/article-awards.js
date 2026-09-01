// ========================================
// 歴代月間大賞記事
// ========================================
// 新しい受賞記事を追加するときは、
// awards の中に1つ追加してください。
// ========================================

const awards = [

  {
    month: "2026/7",

    title: "日本経済を分析",

    author: "非公開",

    likes: 80,

    category: "日本経済分析記事",

    language: "日本語",

    content: `Test3
    
    日本の経済にはさまざまな課題があります。高校生の視点から、現在の状況や今後について考察しました。`
  },


  {
    month: "2026/6",

    title: "世界経済のこれから",

    author: "非公開",

    likes: 105,

    category: "世界経済分析記事",

    language: "日本語",

    content: `Test2

各国の経済状況を比較しながら、これからの世界経済について考えた。`
  },


  {
    month: "2026/5",

    title: "New Business with High School Students",

    author: "anonymous writer",

    likes: 98,

    category: "ビジネス構想記事",

    language: "English",

    content: `Test1

I will tell you the way to be innovative in real business world even if you are a high school student.`
  }

];


// ========================================
// 表を作成
// ========================================

const articleAwardList =
  document.getElementById("articleAwardList");

let html = `

<div class="article-award-table-wrapper">

<table class="article-award-table">

<thead>

<tr>

<th>月</th>

<th>記事タイトル</th>

<th>投稿者名</th>

<th>いいね数</th>

<th>カテゴリー</th>

<th>言語</th>

</tr>

</thead>

<tbody>

`;


// ========================================
// 受賞記事を1つずつ表示
// ========================================

awards.forEach((award) => {

  html += `

<tr class="article-info-row">

<td>
${award.month}
</td>

<td class="article-award-title">
${award.title}
</td>

<td>
${award.author}
</td>

<td class="article-award-likes">
👍 ${award.likes}
</td>

<td>
${award.category}
</td>

<td>
${award.language}
</td>

</tr>


<tr class="article-content-row">

<td colspan="6">

<div class="article-content">

${award.content.replace(/\n/g, "<br>")}

</div>

</td>

</tr>

`;

});


html += `

</tbody>

</table>

</div>

`;


// ========================================
// HTMLに表示
// ========================================

articleAwardList.innerHTML = html;