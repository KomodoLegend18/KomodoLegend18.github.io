let parser = new RSSParser();
parser.parseURL('https://hololive.hololivepro.com/en/music/rss', function(err, feed) {
  if (err) throw err;
  for (let i = 0; i < 10; i++) {
    const entry = feed.items[i];
    printPost(entry);
  }
});

function printPost(entry) {
  article = document.createElement("article");

  link = document.createElement("a");
  link.setAttribute("href", entry.link);
  link.setAttribute("target", "_blank");
  link.style.cssText = "text-decoration-style:dotted;";

  h4 = document.createElement("h4");
  h4.innerText = entry.title;
  // desc = entry.content;
  // desc.innerText = JSON.stringify(entry);
  h4.title = entry.content
  h4.style.cssText = "text-overflow:ellipsis; overflow:hidden;";

  link.appendChild(h4);
  // link.appendChild(desc);
  article.appendChild(link);

  blogs = document.getElementById('blog-posts');
  blogs.appendChild(article);

  console.log(entry);
}