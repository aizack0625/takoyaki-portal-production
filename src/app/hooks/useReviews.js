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
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const fetchedReviews = await getReviewsByShopId(shopId);
      setReviews(fetchedReviews);
      setError(null);
    } catch (err) {
      console.error('レビュー取得エラー：', err);
      setError('レビューの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // 初期ロード時にレビューを取得
  useEffect(() => {
    if (shopId) {
      fetchReviews();
    }
  }, [shopId]);

  // レビューの投稿
  const addReview = async (reviewData) => {
    try {
      if (!user) {
        throw new Error ('レビューを投稿するにはログインが必要です。');
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
      await fetchReviews();

      return true;
    } catch (err) {
      console.error('レビュー投稿エラー：', err);
      setError(err.message || 'レビューの投稿に失敗しました。');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // レビューの削除
  const removeReview = async (reviewId) => {
    try {
      setIsLoading(true);
      await deleteReview(reviewId, shopId);

      // 削除後に最新のレビューリストを再取得
      await fetchReviews();

      return true;
    } catch (err) {
      console.error('レビュー削除エラー：', err);
      setError('レビューの削除に失敗しました。');
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
    refreshReviews: fetchReviews
  };
};

