const express = require("express")
const router = express.Router({mergeParams : true})
const WrapAsync = require("../utility/warpAsync.js")
const {ValidateReview, isLogedIn, isReviewAuthor} = require("../middlewere.js") 


const reviewController = require("../controllers/reviews.js")

// Review Route using post
router.post("/",isLogedIn,ValidateReview, WrapAsync(reviewController.createReview));

// Delete Review route
router.delete("/:reviewId",isLogedIn, isReviewAuthor, WrapAsync(reviewController.deleteReview))

module.exports = router;