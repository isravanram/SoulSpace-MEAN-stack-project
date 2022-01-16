const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const path = require('path');
const hbs = require("hbs");
const register = require("./models/register");
const { response } = require("express");
// Load the models for db
const Register = require("./models/register");
const User = require("./models/users");
// Session variables
const session = require("express-session");
const mongodbSession = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const { networkInterfaces } = require("os");
const e = require("express");


require("./db/conn");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
// To access data written in the form
app.use(express.urlencoded({ extended: false }));

// Checks whether index.html file is there or not in the given public directory
app.use(express.static(static_path));
// Setting up view engine (handlebar)
app.set("view engine", "hbs");
// Setting up hbs path
app.set("views", template_path);
hbs.registerPartials(partial_path);




// ------------------------------------- Envioronmental variables ----------------------------------------

const {
    PORT = 3000,
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_LIFETIME = 1000 * 60 * 60 * 2,
    SESS_SECRET = "Hushh"
} = process.env;



// ---------------------------------- Session -------------------------------------------------------------


const store = new mongodbSession({
    uri: "mongodb+srv://sravan:sravan@cluster0.zjuup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    collection: "mySession",
});

app.use(session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    secure: false,
    saveUninitialized: false,
    // store:store,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true
    }
}));

const redirectLogin = (req, res, next) => {
    if (!req.session.userid) {
        res.redirect("/login");
    }
    else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.userid) {
        res.redirect("/client_dashboard")
    }
    else {
        next();
    }
}

const isAuth = ((req, res, next) => {
    if (req.session.isAuth) {
        next();
    }
    else {
        res.redirect("login");
    }
});

// ---------------------------------- User Login ----------------------------------------------------------------

app.get('/user-login', (req, res) => {
    res.render("user-login")
})

app.get('/user-register', (req, res) => {
    res.render("user-register")
})

app.post('/user-register', async (req, res) => {

    try {
        if (req.body.password === req.body.confirmpassword) {
            const users = new User({
                fullname: req.body.fullname,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                confirmpassword: confirmpassword,
                age: req.body.age,

            })
            const finalusers = await users.save();
            res.status(201).render('client_dashboard');
        }
        else {
            res.send("Passwords do not match");
        }
    }
    catch {
        res.status(400).send("Error registering");
    }

})
// ---------------------------------- Counsellor Login page -----------------------------------------------------

app.get("/login", (req, res) => {
    const { userid } = req.session
    res.render("login");
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const counselorid = await Register.findOne({
            email: email
        });
        if (counselorid.password === password) {
            const { userid } = req.session
            req.session.userid = counselorid;
            // req.session.userid=req.counselorid.name;
            console.log(req.session.userid.age);
            res.status(200).render("counsellor_page", {
                userid: req.session.userid
            });
        }
        else {
            res.send("Password Invalid");
            console.log(password)
        }
    }
    catch (error) {
        // console.error("Invalid email");
        res.status(400).send("Invalid Email")
    }
})

// Default one to render as html file
app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("index");
})


app.get("/client_dashboard", isAuth, async (req, res) => {
    const counselors_list = await Register.find({});
    res.render("client_dashboard", {
        counsellors: counselors_list
    });
})


app.post("/client_dashboard", async (req, res) => {
    const counselors_list = await Register.find({});
    console.log(req.session)
    res.render("client_dashboard", {
        counsellors: counselors_list
    });
})

// ----------------------- Counsellor page endpoint -------------------------------------------------------------

app.get("/counsellor_page", (req, res) => {
    res.render("counsellor_page");
})

app.post("/counsellor_page", async (req, res) => {
    const counselors_list = await Register.find({});
    res.render("counsellor_page", {
        counsellors: counselors_list
    });
})
// appointments
// app.post("/client_dashboard",async(req,res)=>{
//     let userid=req.body.userid;
//     let counselorid=req.body.
//     try{
//         appointments.userid=req.body.userid;
//         appointments.counselorid
//     }
// Create a new counsellor in database

app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if (password === confirmpassword) {
            const registerCounselor = new Register({

                fullname: req.body.fullname,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                confirmpassword: confirmpassword,
                age: req.body.age,
                qualifications: req.body.qualifications,
                aadhaarnumber: req.body.aadhaarnumber,
                category: req.body.category

            })

            const registered = await registerCounselor.save();
            res.status(201).render("index");
        }
        else {
            res.send("Password do not match")
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error);

    }
})

// ______________________________ LISTENING TO PORT _________________________________________________________________________

app.listen(port, () => {
    console.log('Server is running at port no ' + port);
})

