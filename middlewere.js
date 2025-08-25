const Listing = require('./models/listing.js')
const Review = require('./models/review.js')
const ExpressError = require("./utility/ExpressError.js")
const {listingSchema, reviewSchema} = require('./schema.js')


module.exports.isLogedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error',"You must be logedin to create a listing")
        return res.redirect("/login")
    }
    next()
} 

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async(req, res, next)=>{
        let {id} = req.params;
        let listing = await Listing.findById(id)
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","You are not owner of this listing")
            return res.redirect(`/listings/${id}`)
        }
        next()
}



//  listing validating using joi (on server side we make the content is required so we use joi for validating)
module.exports.ValidateListing = (req, res, next) =>{
   let {error} = listingSchema.validate(req.body);
    console.log(error)
    if(error){
        let errMsg = error.details.map((el) => el.message).join("");
        return next(new ExpressError(400, errMsg));
    }else{
        next()
    }
}


// review validatging using joi
module.exports.ValidateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        let errMsg = error.details.map((el) => el.message).join("");
        return next(new ExpressError(400, errMsg));
    }else{
        next()
    }
}


// Review delete middleware
module.exports.isReviewAuthor = async(req, res, next)=>{
        let {id, reviewId} = req.params;
        let review = await Review.findById(reviewId)
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","You are not owner of this review")
            return res.redirect(`/listings/${id}`)
        }
        next()
}