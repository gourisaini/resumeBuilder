var express = require('express');
var router = express.Router();
const upload = require("../helpers/multer").single("avatar");
const fs = require("fs");
const User = require("../models/userModel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
const nodemailer = require("nodemailer");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home', isLoggedIn: req.user ? true : false, user: req.user });
});

/* GET create page. */
router.get('/create', isLoggedIn, function (req, res, next) {
  res.render('create', { title: 'Create', isLoggedIn: req.user ? true : false, user: req.user });
});

/* GET show page. */
router.get('/show/:id', isLoggedIn, async function (req, res, next) {
  res.render('view', { title: 'Resume', isLoggedIn: req.user ? true : false, user: req.user });
});
/* GET sign up page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Sign Up', isLoggedIn: req.user ? true : false, user: req.user });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Sign In', isLoggedIn: req.user ? true : false, user: req.user });
});

/* POST sign up page. */
router.post('/signup', function (req, res, next) {
  const { name, username, email, password } = req.body;
  User.register({ name, username, email }, password)
    .then((user) => {
      res.redirect("/login");
    }).catch((err) => {
      res.send(err);
    })
});

/* POST sign up page. */
router.post('/login', passport.authenticate('local', {
  successRedirect: "/profile",
  failureRedirect: "/login",
}), function (req, res, next) { });

router.get("/signout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/login")
  })
})

/* GET profile page. */
router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile", { title: "Profile", isLoggedIn: req.user ? true : false, user: req.user });
});

/* GET change password page. */
router.get('/changePassword', function (req, res, next) {
  res.render('reset', { title: 'Change Password', isLoggedIn: req.user ? true : false, user: req.user });
});

/* post change password page. */
router.post('/changePassword', async function (req, res, next) {
  try {
    await req.user.changePassword(
      req.body.oldPassword,
      req.body.newPassword
    );
    await req.user.save();
    res.redirect("/profile");
  } catch (error) {
    res.send(error);
  }
});

/* GET change password page. */
router.get('/forgetPassword', function (req, res, next) {
  res.render('forget', { title: 'Forget Password', isLoggedIn: req.user ? true : false, user: req.user });
});

/* GET change password page. */
router.post('/forgetPassword', async function (req, res, next) {
  const check = await User.findOne({ email: req.body.email });
  if (!check) return res.send("User not found");
  const code = Math.floor(Math.random() * 9000 + 1000);

  // Node mailer

  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "gourisaini241@gmail.com",
      pass: "lysargusnpgmtiqj",
    },
  });

  const mailOptions = {
    from: "Temp Mail Pvt. Ltd.<gourisaini241@gmail.com>",
    to: req.body.email,
    subject: "Password Reset code",
    text: "Do not share this code to anyone.",
    html: `<p>Do not share this code to anyone.</p><h1>${code}</h1>`,
  };

  transport.sendMail(mailOptions, async (err, info) => {
    if (err) return res.send(err);
    console.log(info);

    await User.findByIdAndUpdate(check._id, { code });

    res.redirect("/code");
  });
});



/* GET code page. */
router.get('/code', function (req, res, next) {
  res.render('code', { title: 'OTP', isLoggedIn: req.user ? true : false, user: req.user });
});

// /* post code page. */
router.post("/code", async function (req, res, next) {
  const check = await User.findOne({ code: req.body.code });
  if (!check) return res.send("Wrong OTP");
  await User.findByIdAndUpdate(check._id, { code: "" });
  res.redirect("/setPassword/" + check._id)
})

router.get("/reset-password", isLoggedIn, function (req, res, next) {
  res.render("reset", {
    title: "Reset-Password",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});
router.post("/reset-password", isLoggedIn, async function (req, res, next) {
  try {
    await req.user.changePassword(
      req.body.oldPassword,
      req.body.newPassword
    );
    await req.user.save();
    res.redirect("/profile");
  } catch (error) {
    res.send(err);
  }
});

/* GET set password page. */
router.get('/setPassword/:id', function (req, res, next) {
  res.render('set', { title: 'Set Password', isLoggedIn: req.user ? true : false, id: req.params.id });
});

/* post set password page. */
router.post('/setPassword/:id', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    await user.setPassword(
      req.body.newPassword
    );
    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.send(error);
  }
});

router.post("/upload", isLoggedIn, async function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      console.log("ERROR>>>>>", err.message);
      res.send(err.message);
    }
    if (req.file) {
      if (req.user.avatar != "dummy.png") {
        fs.unlinkSync("./public/images/" + req.user.avatar);
      }
      req.user.avatar = req.file.filename;
      req.user
        .save()
        .then(() => {
          res.redirect("/profile");
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
});

router.post("/update/:id", isLoggedIn, async function (req, res, next) {
  try {
    const { name, username, email, address, phone, dob, lang, hobby, linkedin, github, objective, declare } = req.body;
    const updatedUserInfo = { name, username, email, address, phone, dob, lang, hobby, linkedin, github, objective, declare};
    await User.findOneAndUpdate(req.params.id, updatedUserInfo);
    res.redirect("/update/" + req.params.id);
  } catch (error) {
    res.send(err);
  }
});

router.get("/basic/:id", isLoggedIn, function (req, res, next) {
  res.render("Resume/basic", {
    title: "Basic Details",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});

router.post("/add-basic/:id", isLoggedIn, async function (req, res, next) {
  const { objective, address, phone, dob, lang, hobby, linkedin, github, declare } = req.body;
  const user = { objective, address, phone, dob, lang, hobby, linkedin, github, declare };
  await User.findOneAndUpdate(req.params.id, user);
  res.redirect("/create");
});

router.get("/education/:id", isLoggedIn, function (req, res, next) {
  res.render("Resume/education", {
    title: "Education Details",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});

router.post("/add-edu/:id", isLoggedIn, async function (req, res, next) {
  req.user.education.push(req.body);
  await req.user.save();
  const user = req.user;
  res.redirect("/education/" + user._id);
});

router.get("/delete-edu/:index", isLoggedIn, async function (req, res, next) {
  const eduCopy = [...req.user.education];
  eduCopy.splice(req.params.index, 1);
  req.user.education = [...eduCopy];
  await req.user.save();
  const user = req.user;
  res.redirect("/education/" + user._id);
});


router.get("/experience/:id", isLoggedIn, function (req, res, next) {
  res.render("Resume/experience", {
    title: "Experience Details",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});

router.post("/add-ex/:id", isLoggedIn, async function (req, res, next) {
  req.user.experience.push(req.body);
  await req.user.save();
  const user = req.user;
  res.redirect("/experience/" + user._id);
});

router.get("/delete-ex/:index", isLoggedIn, async function (req, res, next) {
  const exCopy = [...req.user.experience];
  exCopy.splice(req.params.index, 1);
  req.user.experience = [...exCopy];
  await req.user.save();
  const user = req.user;
  res.redirect("/experience/" + user._id);
});


router.get("/project/:id", isLoggedIn, function (req, res, next) {
  res.render("Resume/project", {
    title: "Project Details",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});

router.post("/add-pro/:id", isLoggedIn, async function (req, res, next) {
  req.user.project.push(req.body);
  await req.user.save();
  const user = req.user;
  res.redirect("/project/" + user._id);
});

router.get("/delete-pro/:index", isLoggedIn, async function (req, res, next) {
  const proCopy = [...req.user.project];
  proCopy.splice(req.params.index, 1);
  req.user.project = [...proCopy];
  await req.user.save();
  const user = req.user;
  res.redirect("/project/" + user._id);
});


router.get("/skill/:id", isLoggedIn, function (req, res, next) {
  res.render("Resume/skill", {
    title: "Skills Details",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});

router.post("/add-s/:id", isLoggedIn, async function (req, res, next) {
  req.user.skill.push(req.body);
  await req.user.save();
  const user = req.user;
  res.redirect("/skill/" + user._id);
});

router.get("/delete-s/:index", isLoggedIn, async function (req, res, next) {
  const sCopy = [...req.user.skill];
  sCopy.splice(req.params.index, 1);
  req.user.skill = [...sCopy];
  await req.user.save();
  const user = req.user;
  res.redirect("/skill/" + user._id);
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}


module.exports = router;