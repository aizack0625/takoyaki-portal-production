import { ReviewCard } from "./components/ReviewCard";

export default function Home() {
  const reviews = [
    {
      userName: "ユーザーネーム",
      date: "2025.1.30",
      rating: 4,
      content: "レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。"
    },
    {
      userName: "ユーザーネーム",
      date: "2025.1.30",
      rating: 4,
      content: "レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。"
    },
    {
      userName: "ユーザーネーム",
      date: "2025.1.30",
      rating: 4,
      content: "レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。"
    }
  ];


  return (
    <main className="container mx-auto px-4 pb-20">
      <h2 className="text-xl font-bold my-6">新着たこ活</h2>
      <div className="">
      </div>
    </main>
  );
}
