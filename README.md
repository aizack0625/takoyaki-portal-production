### たこ焼き屋ポータルサイト

サイトマップ（Figma）
https://www.figma.com/design/j9DHKQxcZ5vsC0OtYCHc1l/%E3%82%B5%E3%82%A4%E3%83%88%E3%83%9E%E3%83%83%E3%83%97%EF%BC%88%E3%81%9F%E3%81%93%E3%83%9D%E3%83%BC%EF%BC%89

### １、テーマ

自分が食べたいたこ焼き見つけられるたこ焼き屋の情報サイト

たこ焼き屋の情報を投稿、閲覧することができるサイト

### ２、課題定義

**誰のどんな課題を解決するのか？**

たこ焼きを食べたい時に、たこ焼き屋の情報をまとめたサイトがあることで、

たこ焼き屋の情報が見やすくなり、たこ焼きが好きな人や食べたい人の課題を解決する。

**なぜそれを解決したいのか？**

自分自身たこ焼きが好きで、たこ焼き屋を探そうとしてもたこ焼き屋の情報がまとまったサイトがなく、不便に感じた為。自分でたこ焼き屋のサイトを作ろうと思った。

どうやって解決するのか？

たこ焼き屋の住所、営業時間、メニュー情報、口コミ投稿ができて、誰でもたこ焼き屋の

情報が投稿できるWebサイトを作成する。

### ３、要件定義

**優先度**

- P0：必須
- P1：ここまで実装することを想定
- P2：可能であれば実装したい

**ログイン機能**

- 会員登録ができる (P1)
- ユーザー名、パスワードを登録する (P1)
- ユーザーアイコンが設定できる。デフォルトは灰色のユーザーイメージ画像 (P1)
- ログイン状態でのみ、以下の機能が利用できる
    - 口コミの新規投稿、編集、削除 (P0)
    - 他のユーザーの投稿への「いいね」機能 (P1)
    - お気に入りの店舗を保存する「お気に入り」機能 (P1)
    - 店舗や食べ物の写真を投稿できる (P2)
    - 他のユーザーの投稿へのコメント機能 (P2)

**店舗情報**

- 店舗情報の表示 (P0)
- 店舗の口コミ、営業時間、メニュー情報、星評価をユーザーが投稿、書き込みができる (P1)
- 店舗情報を検索できる、現在地を取得して近くの店舗を表示できる (P1)
- レビューが多い、少ない順。評価が高い、低い順。できる (P2)
- 店舗情報とGoogleマップの紐付け (P2)
- 都道府県からお店を探せる機能 (P2)

**マイページ機能**

- ユーザー名、パスワード、アイコンの編集ができる (P1)
- 自身で投稿した口コミの確認、編集、削除ができる (P1)
- 「お気に入り」と「いいね」の管理ができる (P1)

その他

- ヘルプページの作成 (P2)
- SNS共有機能：LINE、Instagram、Xなど(P2)
- タグ検索機能：カリカリ系、ふわとろ系、ソース濃厚、チーズ入りなど(P2)
    
    タグ検索、お店にあらかじめタグを設定しておく
    
    タグ設定方法、ボタンから設定
    

**非機能要件**

- スマホに対応 (P0)
- 個人情報は収集しない (P0)
- PCに対応 (P1)
- タブレットに対応 (P2)

### ４、使用技術

**OS**

- Mac OS

**プログラミング言語**

- JavaScript

**フレームワーク**

- Next.js（React)

**API**

- Google Maps API

**データベース**

- Firebase

**UI全般**

- MaterialUI/Icons
- emotion
- TailWind CSS
- CSS Modules
- Bootstrap Icons

**フォント**

h1

- Dela Gothic One

他

- Noto Sans JP

**デプロイ**

- Vercel

**バージョン管理**

- Git/Github
