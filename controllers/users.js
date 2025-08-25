const User = require("../models/user.js");

module.exports.rederSignupForm = (req, res)=>{
    res.render("users/signup.ejs")
}

module.exports.userSignup = async (req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser  = new User({email, username});
        const regesterUser = await User.register(newUser, password)
        req.login(regesterUser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash('success', "Welcome to Wonderlust")
            res.redirect('/listings') 
        })
        
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }

   
}

module.exports.rederLoginForm = (req, res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req, res)=>{
    req.flash("success","Welcome to wonderlust , You are login")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next)=>{
    req.logout((err) =>{
        if(err){
           return next(err)
        }
        req.flash("success", "you are logged out")
        res.redirect("/listings")
    })
}