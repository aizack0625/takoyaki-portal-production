'use client';

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { submitReview, getReviewsByShopId, deleteReview } from "../services/reviewService";

/**
 * レビュー機能のためのカスタムフック
 * @param {string} shopId - 店舗ID
 * @returns {Object} - レビュー関連の状態と操作関数を含むオブジェクト
 */
export const useReviews = (shopId) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // レビューデータの取得
  const fetchedReviews = async () => {
    if (!shopId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedReviews = await getReviewsByShopId(shopId);

      if (fetchedReviews && Array.isArray(fetchedReviews)) {
        setReviews(fetchedReviews);
      } else {
        setReviews([]);
        console.warn('レビューデータが正しい形式ではありません。');
      }

      setError(null);
    } catch (err) {
      console.error('レビュー取得エラー：', err);
      // 開発用のより詳細なエラーメッセージ
      console.error('詳細エラー：', err.code, err.message);
      setError('レビューの取得に失敗しました。' + (err.message || ''));
      setReviews([]); // エラー時はから配列を設定
    } finally {
      setIsLoading(false);
    }
  };

  // 初期ロード時にレビューを取得
  useEffect(() => {
    fetchedReviews();
  }, [shopId]); // shopIdが変更された時のみ再取得

  // レビューの投稿
  const addReview = async (reviewData) => {
    try {
      if (!user) {
        throw new Error ('レビューを投稿するにはログインが必要です。');
      }

      if (!shopId) {
        throw new Error('店舗IDが指定されていません。')
      }

      setIsLoading(true);

      // レビューデータの整形
      const formattedReviewData = {
        shopId,
        rating: reviewData.rating,
        content: reviewData.content,
        imageFile: reviewData.imageFile
      };

      // レビュー投稿API呼び出し
      await submitReview(
        formattedReviewData,
        user.uid,
        user.displayName || 'ユーザー'
      );

      // 投稿後に最新のレビューリストを再取得
      await fetchedReviews();

      return true;
    } catch (err) {
      console.error('レビュー投稿エラー：', err);
      // 開発用のより詳細なエラーメッセージ
      console.error('詳細エラー：', err.code, err.message);

      setError(err.message || 'レビューの投稿に失敗しました。');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // レビューの削除
  const removeReview = async (reviewId) => {
    try {
      if (!user) {
        throw new Error('レビューを削除するにはログインが必要です。');
      }

      if (!reviewId || !shopId) {
        throw new Error('レビューIDまたは店舗IDが指定されていません。');
      }

      setIsLoading(true);
      await deleteReview(reviewId, shopId);

      // 削除後に最新のレビューリストを再取得
      await fetchedReviews();

      return true;
    } catch (err) {
      console.error('レビュー削除エラー：', err);
      setError('レビューの削除に失敗しました。' + (err.message || ''));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reviews,
    isLoading,
    error,
    addReview,
    removeReview,
    refreshReviews: fetchedReviews
  };
};


