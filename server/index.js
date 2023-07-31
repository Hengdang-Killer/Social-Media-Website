/*-----------------------------------------------FUNCTION OF THE FILE--------------------------------------------*/
/**
 * This file sets up an Express.js server, connects it to the MongoDB database, and configures several middleware to handle various aspects of the application, including file uploads, logging, security headers, and CORS handling. It also defines routes for user registration and post creation.
 */





/*----------------------------------------------------IMPORTING MODULES-----------------------------------------------------*/
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
/*
path is a built-in module that provides utilities for working with file and directory paths. It is used to handle file and directory paths in a platform-independent way, ensuring that your code works consistently across different operating systems (e.g., Windows, macOS, Linux).
*/



import { fileURLToPath } from "url";
/*
url is a built-in module that provides utilities for parsing and formatting URLs (Uniform Resource Locators). It allows you to work with URLs, query parameters, and other components of a URL in a convenient and platform-independent way.
Importing the fileURLToPath function from the "url" module: This function is used to convert a file URL to a file path.
*/



import authRoutes from "./routes/auth.js"; // routes folder
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";






/* ------------------------------------CREATING VARIABLES FOR MIDDLEWARE CONFIGURATIONS------------------------------------- */
/**
 * middleware(functions that runs in between different requests) and package configurations
 */





const __filename = fileURLToPath(import.meta.url);
/*
the import.meta object is an automatically available meta-property in ECMAScript modules. It provides meta data about the current module, including the url property, which holds the URL of the current module file.
The fileURLToPath function is used to convert a file URL (like file:///path/to/file.js) to a file path that can be used by the local file system (e.g., /path/to/file.js). This is necessary because some Node.js modules or APIs expect file paths rather than URLs.
*/





const __dirname = path.dirname(__filename);
/*
 the code creates a constant named __dirname. This constant will store the directory path of the current module file. The path.dirname function extracts the directory path from a given file path. Since __filename contains the file path of the current module file, path.dirname(__filename) will give you the directory path containing that file.
 */





dotenv.config();
/*
dotenv.config() is a function commonly used in Node.js applications to load environment variables from a .env file into the Node.js process environment. This function is part of the popular dotenv library, which simplifies the process of managing environment variables in your applications
*/




const app = express();
/*
It sets up an instance of the Express.js framework, creating the foundation for building web applications and APIs. 
After creating the "app" instance, you can use various methods and middleware provided by Express to handle HTTP requests, define routes, serve static files, and more. For example, you can define routes for different HTTP methods like GET, POST, PUT, and DELETE and define how the server should respond to each type of request. 
*/





/* ------------------------------------MIDDLEWARE CONFIGURATIONS------------------------------------- */
/**
 * Below several middleware functions are being set up for the application using the app.use() method. 
 * Middleware functions in Express are functions that have access to the request and response objects and can modify them, execute additional logic, and then pass the control to the next middleware or route handler. 
 */




app.use(express.json()); 
// This middleware parses incoming JSON payloads and makes them available as req.body. It is used to handle JSON data sent in the request body.




app.use(helmet()); 
// Helmet is a security middleware for Express that adds various HTTP headers to enhance security. It helps protect your application from common web vulnerabilities.




app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 
// This specific Helmet middleware sets the Cross-Origin Resource Policy (CORP) header to "cross-origin", which allows cross-origin access to the resources served by the server.




app.use(morgan("common")); 
// Morgan is a popular logging middleware for Express. It logs HTTP request details to the console. In this case, it is set to use the "common" predefined format for logging.




app.use(bodyParser.json({ limit: "30mb", extended: true })); 
// This line is setting up the bodyParser middleware to handle JSON payloads. The limit option sets the maximum size for the request body, and extended: true allows parsing of rich objects and arrays.




app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); 
// This line sets up the bodyParser middleware to handle URL-encoded form data in the request body. It allows parsing form data in the same way as bodyParser.json() but for form submissions.




app.use(cors()); 
// CORS (Cross-Origin Resource Sharing) is a mechanism that allows resources (e.g., fonts, images) to be requested from another domain outside the domain from which the first resource was served. This middleware enables Cross-Origin Resource Sharing by adding appropriate headers to the responses



app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// This middleware serves static files, such as images, CSS, and JavaScript files, from the specified directory. It means that when a client requests a file from the "/assets" URL path, Express will serve the corresponding file from the "public/assets" directory.
// setting directory of where we are gonna keep our assets (in my case it is image)









/* -----------------------------------------------------FILE STORAGE----------------------------------------------------- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
/**
 * The multer.diskStorage function is used to configure the destination and file naming strategy for the uploaded files. It takes an object with two functions as properties: destination and filename.
 * The "destination" function is used to determine the destination directory where the uploaded files will be stored. The function receives the request (req), the file object (file), and a callback function (cb). The callback function (cb) should be called with null as the first argument (to indicate no error) and the destination directory as the second argument.
 * The "filename" function is used to define the file name for the uploaded file. The function receives the request (req), the file object (file), and a callback function (cb). The callback function (cb) should be called with null as the first argument (to indicate no error) and the desired file name as the second argument.
 * const upload = multer({ storage });: After configuring the disk storage with the multer.diskStorage function, the multer function is called with the storage object passed as an option. This sets up the actual multer middleware with the provided storage configuration.
 * The upload constant now holds the configured multer middleware, which can be used to process file uploads.
 * With this setup, when a file is uploaded to the server via an HTTP request, multer will use the configured diskStorage to determine the destination directory and file name for the uploaded file. The uploaded file will then be saved to the specified destination directory with the specified file name.
*/









/* --------------------------------------------ROUTES WITH FILES------------------------------------------------------ */
/**
 * In the below two routes, the application is set up to handle HTTP POST requests to specific endpoints with different functionalities, including file uploads and user authentication.
 * These routes define different endpoints in the application to handle user registration and post creation functionalities. 
 * The first route (/auth/register) expects a file upload with the field name "picture" and is responsible for user registration. 
 * The second route (/posts) also expects a file upload with the field name "picture", but it additionally requires the request to be authenticated using the verifyToken middleware before allowing post creation.
 */



/**
 * USER REGISTRATION
 */
app.post("/auth/register", upload.single("picture"), register);
/**
 * route, middleware, ending(controller, logic of end point)
 * app.post: This indicates that the route handles HTTP POST requests.
 * "/auth/register": This is the URL path for the route. When the client sends a POST request to /auth/register, this route will be triggered.
 * upload.single("picture"): This is a multer middleware that handles the file upload for a single file with the field name "picture". It means the client is expected to send a file in the request with the field name "picture".
 * register: This is the callback function that will be executed when the route is triggered. It is responsible for handling the logic to register a user, which typically involves processing the uploaded file (if provided) and saving user data in a database.
*/



/**
 * NEW POST CREATION
 */
app.post("/posts", verifyToken, upload.single("picture"), createPost);
/**
 * app.post: This indicates that the route handles HTTP POST requests.
 * "/posts": This is the URL path for the route. When the client sends a POST request to /posts, this route will be triggered.
 * verifyToken: This is a custom middleware function called verifyToken. It is used to verify the authenticity of the request by checking the presence and validity of a token in the request headers. This middleware is typically used to protect certain routes and ensure that only authenticated users can access them.
 * upload.single("picture"): This is a multer middleware that handles the file upload for a single file with the field name "picture". It means the client is expected to send a file in the request with the field name "picture".
 * createPost: This is the callback function that will be executed when the route is triggered. It is responsible for handling the logic to create a new post, which typically involves processing the uploaded file (if provided) and saving the post data in a database.
*/








/* ------------------------------------ROUTES FOR DIFFERENT FUNCTIONALITIES DEPENDING UPON URLS------------------------------------- */
/**
 * In this code section, the application is using separate route handlers for different sections of the application, each defined in a separate file. This helps to modularize the code and keep the routes organized.
 */




app.use("/auth", authRoutes);
/**
 * app.use: This sets up middleware for the application to handle incoming requests.
 * "/auth": This is the base URL path for the routes defined in the authRoutes module. When a client makes a request to a URL starting with /auth, the routes defined in the authRoutes module will handle those requests.
 * authRoutes: This is the router object that contains the routes for authentication-related functionality. 
 * The authRoutes object is defined in a separate file, and it handles all the routes related to user authentication, such as registration, login, logout, etc.
*/





app.use("/users", userRoutes);
/** 
 * app.use: This sets up middleware for the application to handle incoming requests.
 * "/users": This is the base URL path for the routes defined in the userRoutes module. When a client makes a request to a URL starting with /users, the routes defined in the userRoutes module will handle those requests.
 * userRoutes: This is the router object that contains the routes for user-related functionality. The userRoutes object is defined in a separate file, and it handles routes related to user management, profile updates, etc.
*/





app.use("/posts", postRoutes);
/**
 * app.use: This sets up middleware for the application to handle incoming requests.
 * "/posts": This is the base URL path for the routes defined in the postRoutes module. When a client makes a request to a URL starting with /posts, the routes defined in the postRoutes module will handle those requests.
 * postRoutes: This is the router object that contains the routes for handling posts-related functionality. The postRoutes object is defined in a separate file and handles routes for creating, retrieving, updating, and deleting posts.
*/





/* ---------------------------------------------------MONGOOSE SETUP-------------------------------------------------------------- */
/**
 * This section sets up the application to connect to the MongoDB database and starts a server to handle incoming HTTP requests. 
 * The server will listen on the port specified by the PORT environment variable, or it will default to port 6001 if the PORT environment variable is not provided. 
 * If the MongoDB connection is successful, the server will start running, and the port number will be logged to the console. 
 * If there is an error connecting to the database, an error message will be logged to the console.
 */




const PORT = process.env.PORT || 6001; // 6001 incase the one in .env does not work
/**
 * This sets up the port number on which the server will listen. The server will use the value of the PORT environment variable, if available (commonly set in the hosting environment). If the PORT environment variable is not set, the server will default to port 6001.
 */




mongoose
  .connect(process.env.MONGO_URL, {
    //connecting to actual mongo database
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // after connecting
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADDING THE DUMMY USERS AND POSTS (ONE TIME ONLY)*/
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
/**
 * mongoose.connect(process.env.MONGO_URL, { ... });: This connects the application to the MongoDB database. The process.env.MONGO_URL refers to the connection string of the MongoDB database and provided through the environment variable. The options object passed as the second argument is used to configure the MongoDB connection with options like "useNewUrlParser" and "useUnifiedTopology", which are needed for proper connection setup.
 * .then(() => { ... });: If the MongoDB connection is successful, the .then() block will be executed. Inside this block :- 
 * app.listen(PORT, () => console.log(Server Port: ${PORT}));: The application is started and listens for incoming HTTP requests on the specified PORT. Once the server is up and running, a message is logged to the console indicating the port number on which the server is listening.
 * .catch((error) => console.log(${error} did not connect));: If there is an error during the MongoDB connection process, the .catch() block will be executed, and an error message will be logged to the console indicating that the connection was not successful.
*/
