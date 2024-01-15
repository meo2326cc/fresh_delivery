import { useEffect, useState } from "react";
import { PageTemplate } from "./ClientComponent";
import axios from "axios";

export default function News() {
  document.title = "最新消息-鮮到家";
  const [post, getPost] = useState({ articles: [], status: "loading" });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_PATH_CLIENT_ARTICLES_ALL
        );
        getPost({ articles: res.data.articles, status: "resolve" });
      } catch (error) {
        getPost({ ...post, status: "error" });
      }
    })();
  }, []);

  return (
    <PageTemplate title={"最新消息"}>
      {post.status === "loading" ? <IsLoading /> :  <HavePost post={post} /> }
    </PageTemplate>
  );
}

function HavePost({ post }) {
    console.log(post)
switch (post.status) {
  case "error":
    return (
      <div className="alert alert-danger w-100" role="alert">
        無法取得貼文，請稍候再試
      </div>
    );
  case "resolve":
    return <ul className="list-unstyled">{post.articles.map((item) => {
        return <li className="mt-5 border border-1 p-5" key={item.id}>
                <h2 className="fs-4 border-bottom pb-3">{item.title}</h2>
                <span className="fs-7 mb-3 d-block text-secondary">日期：{new Date(item.create_at).toLocaleString()}</span>
                <pre>{item.description} </pre>
               </li>;
      })}</ul>
  default:
    null;
}
}

function IsLoading() {
  return (
    <>
      <div
        className=" bg-white d-flex justify-content-center align-items-center"
        
      >
        <span className="material-icons pending fs-1">refresh</span>
      </div>
    </>
  );
}
