const express = require("express")
const router = express.Router()
const WrapAsync = require("../utility/warpAsync.js")
const { isLogedIn, isOwner, ValidateListing } = require("../middlewere.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

const listingController = require("../controllers/listings.js")

router
    .route('/')
    .get(WrapAsync(listingController.index)) // index route
    .post(
        isLogedIn,
        upload.single("listing[image]"),
        ValidateListing, 
        WrapAsync(listingController.createListing)
    ); // create route

// new route
router.get('/new',isLogedIn, listingController.renderNewForm)

router.get('/search', WrapAsync(listingController.searchListing))

router
    .route('/:id')
    .get( WrapAsync(listingController.showListing)) // show route
    .put(
        isLogedIn,
        isOwner,
        upload.single("listing[image]"),
        ValidateListing,
        WrapAsync(listingController.updateListing)) // put route for update
    .delete(
        isLogedIn,
        isOwner, 
        WrapAsync(listingController.deleteListing)
    ); // Delete route

// Edit your route
router.get('/:id/edit',isLogedIn, WrapAsync(listingController.editListing))

module.exports = router