/*-----------------------------------------------FUNCTION OF THE FILE--------------------------------------------*/
/**
 * This code snippet demonstrates the use of the Express router to define a specific route for handling user login functionality. 
 * The code also imports the login function from an external controller file (../controllers/auth.js) to handle the logic for user login.
 * By using this router, we modularize our application and handle different routes in separate files. The actual login logic is delegated to the login function in the auth.js controller, promoting separation of concerns and making the codebase more organized and maintainable.
*/





/*------------------------------------------------IMPORTING LIBRARIES------------------------------------------*/
import express from "express";
/**
 * This line imports the Express library.
 */



import { login } from "../controllers/auth.js";
/**
 * This line imports the login function from the auth.js file located in the ../controllers directory. 
 * The login function is handles the logic for user login and is typically defined in the auth.js file.
 */





/*------------------------------------------------ROUTING------------------------------------------*/
const router = express.Router(); 
/**
 * This creates an instance of the Express router using the express.Router() function. 
 * The router allows us to define specific routes and their corresponding handlers.
 */



router.post("/login", login);
/**
 * This line sets up a POST route with the path "/login" using the router.post() method. 
 * When a client sends a POST request to "/login", the login function from the auth.js controller will be executed to handle the login functionality. 
 * Note that this is only setting up the route, and the actual login logic is defined in the login function imported from the auth.js controller.
 */






/*-----------------------------------------------------EXPORTING---------------------------------------------------*/
export default router;
/**
 * This line exports the router as the default export of this module. 
 * The router can then be imported and mounted in the main application to handle the "/login" route.
 */
