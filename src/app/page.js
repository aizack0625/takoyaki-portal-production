import { ReviewCard } from "./components/ReviewCard";

export default function Home() {
  const reviews = [
    {
      userName: "相澤",
      date: "2025.1.30",
      shopName: 'たこ焼きコロコロ',
      shopId: 1,
      rating: 5,
      content: "ふわトロで美味しかったです！"
    },
    {
      userName: "ユーザーネーム1",
      date: "2025.1.30",
      shopName: 'たこ焼きキング',
      shopId: 2,
      rating: 4,
      content: "レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。"
    },
    {
      userName: "ユーザーネーム2",
      date: "2025.1.30",
      shopName: 'たこ焼き○○○',
      shopId: 3,
      rating: 3,
      content: "レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。レビュー内容です。"
    }
  ];

  return (
    <main className="container mx-auto px-4 pb-20">
      <h2 className="text-xl font-bold my-6">新着たこ活</h2>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
      <div className="text-center mt-8">
        <button className="px-8 py-2 bg-[#83BC87] text-white rounded-full">
          もっと見る
        </button>
      </div>
    </main>
  );
}

