import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"; // routes folder
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS ---- middleware(functions that runs in between different requests) and package configurations */

const __filename = fileURLToPath(import.meta.url); // to use ES6 modules.
const __dirname = path.dirname(__filename); // to use ES6 modules.
dotenv.config();
const app = express();
app.use(express.json()); // The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(helmet()); // Helmet.js is a Node.js module that helps in securing HTTP headers. It is implemented in express applications. Therefore, we can say that helmet.js helps in securing express applications. It sets up various HTTP headers to prevent attacks like Cross-Site-Scripting(XSS), clickjacking, etc.
// Why security of HTTP headers are important: Sometimes developers ignore the HTTP headers. Since HTTP headers can leak sensitive information about the application, therefore, it is important to use the headers in a secure way.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Blocks others from loading your resources cross-origin
app.use(morgan("common")); // HTTP request logger middleware for node.js
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Express uses connect middleware, to specify the file upload size
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); //Express uses connect middleware, to specify the file upload size
app.use(cors()); // CORS stands for Cross-Origin Resource Sharing . It allows us to relax the security applied to an API. This is done by bypassing the Access-Control-Allow-Origin headers, which specify which origins can access the API.
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // setting directory of where we are gonna keep our assets (in my case it is image)

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTER WITH FILES */
app.post("/auth/register", upload.single("picture"), register); // route, middleware, ending(controller, logic of end point)
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; // 6001 incase the one in .env does not work
mongoose
  .connect(process.env.MONGO_URL, {
    //connecting to actual mongo database
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // after connecting
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
