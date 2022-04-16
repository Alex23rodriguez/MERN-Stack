import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsCtrl {
  static async apiPostReview(req, res, next) {
    try {
      const restaurantId = req.body.restaurant_id;
      const review = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();

      var { error } = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date
      );
      if (error) {
        throw new Error(error);
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const text = req.body.text;
      const date = new Date();

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        text,
        date
      );

      var { error } = reviewResponse;
      if (error) {
        throw new Error(`Failed to update review: ${error}`);
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update review - user may not be original poster"
        );
      }
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query._id;
      const userId = req.body.user_id;
      //   console.log(reviewId);

      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);

      if (reviewResponse.deletedCount === 0) {
        throw new Error(
          "Unable to delete review. user may not be original poster"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
