// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const multer = require('multer');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
 
//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const adminRouter = require('./routes/adminrouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI, // ← .env se lo
  collection: 'sessions'
});


// ✅ Yeh lagao - cloudinary config
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'decobnb',
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/mpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerOptions = { storage, fileFilter };

app.use(express.urlencoded());
app.use(multer(multerOptions).fields([
  { name: 'photo' },
  { name: 'video' },
]));
app.use(express.static(path.join(rootDir, 'public')))
app.use("", express.static(path.join(rootDir, 'uploads')))
app.use("/host", express.static(path.join(rootDir, 'uploads')))
app.use("/homes", express.static(path.join(rootDir, 'uploads')))
app.use("/events", express.static(path.join(rootDir, 'uploads')))

app.use(session({
  secret: process.env.SESSION_SECRET, // ← .env se lo
  resave: false,
  saveUninitialized: true,
  store
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn
  next();
})

app.use(authRouter)
app.use(storeRouter);
app.use(adminRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

app.use(errorsController.pageNotFound);

mongoose.connect(process.env.MONGODB_URI).then(() => { // ← .env se lo
  console.log('Connected to Mongo');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on address http://localhost:${process.env.PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});