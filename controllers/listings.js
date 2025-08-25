const Listing = require('../models/listing.js')


module.exports.index = async (req,res) =>{
    let allListing = await Listing.find({})
    res.render('listing/index.ejs',{allListing}) 
}

module.exports.renderNewForm = (req, res)=>{
    res.render("listing/new.ejs")
}

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : 'reviews', 
        populate: {path: "author"}})
        .populate('owner');
    res.render("listing/show.ejs",{listing})
}

module.exports.createListing = async (req, res) =>{
    let url = req.file.path
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing);
    // console.log(newListing)
    newListing.owner = req.user._id
    newListing.image = {url, filename}
    await newListing.save()
    req.flash("success", "New Listing Created!")
    res.redirect('/listings')
}

module.exports.editListing = async (req, res) =>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render('listing/edit.ejs',{listing, originalImageUrl})
}

module.exports.updateListing = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing})

    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url, filename}
        await listing.save()
    }   
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    let DeleteList = await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}