if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
}

const express = require('express')
const app = express()
const { default: mongoose } = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate =  require('ejs-mate')
const session = require('express-session')
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require('passport')
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


const listingRouter = require('./routes/listing.js')
const reviewsRouter = require('./routes/review.js')
const userRouter =  require('./routes/user.js')


const Db_url = process.env.ATLAS_URL
// const Db_url = process.env.ATLAS_URL;

async function main() {
    try {
        await mongoose.connect(Db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");

        // Start server only after DB connection
        
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
    }
}

main();



async function main(){
    await mongoose.connect(Db_url)
}

// set ejs
app.set("view engine","ejs")
app.set("views",path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

app.get("/", (req, res) => {
    res.redirect("/listings");
});

const store = MongoStore.create({
    mongoUrl : Db_url,
    touchAfter: 24 * 3600,

})

store.on("error",()=>{
    console.log("ERROR ON MONGO SESSION STORE")
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    },
};



app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

app.get("/demoUser", async (req, res) =>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    })

    let regesterUser = await User.register(fakeUser, "helloId")
    res.send(regesterUser)
})

app.use("/listings", listingRouter)
app.use("/listings/:id/review", reviewsRouter)
app.use("/", userRouter)


// app.all('*',(req, res, next) =>{
//     next(new ExpressError(404, "Page not found"))
// })
// app.all("*", (req, res) => {
//     res.status(404).render("error", { message: "Page Not Found" });
// });

// error handling middle ware
app.use((err, req, res, next) =>{
    let {statusCode=500, message="Something went wrong"} = err
    res.status(statusCode).render("Error.ejs",{message})
})

let port = process.env.PORT || 8080

app.listen(port, function(){
    console.log(`Server is listing on port ${port}`)
})