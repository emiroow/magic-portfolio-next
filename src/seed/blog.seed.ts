import { blogModel } from "@/models/blog";

export const seedBlogData = async () => {
  const samples = [
    {
      title: "Hello World",
      summary: "My first post on my new blog.",
      content:
        "<p>Hi there!</p><pre><code class=\"language-js\">console.log('Hello World')</code></pre>",
      slug: "hello-world",
      lang: "en",
    },
    {
      title: "سلام دنیا",
      summary: "اولین پست من در بلاگ.",
      content:
        "<p>سلام!</p><pre><code class=\"language-js\">console.log('Hello World')</code></pre>",
      slug: "hello-world",
      lang: "fa",
    },
  ];

  await blogModel.insertMany(samples);
};
