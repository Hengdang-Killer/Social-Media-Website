/*-----------------------------------------------FUNCTION OF THE FILE--------------------------------------------*/
/**
 * This file defines a middleware function called verifyToken, which is used to verify JSON Web Tokens (JWT) in incoming HTTP requests.
*/






/*----------------------------------------------------IMPORTING MODULES-----------------------------------------------------*/
import jwt from "jsonwebtoken";
// This line imports the jsonwebtoken library, which is used to work with JSON Web Tokens.






/*-------------------------------------------FUNCTION TO VERIFY JSON WEB TOKEN(JWT)-----------------------------------------------*/
/**
 * The verifyToken middleware is responsible for checking if the incoming request contains a valid JWT in the "Authorization" header. 
 * If the token is valid, it attaches the decoded user information to the request object for further processing by other middleware or route handlers. 
 * If the token is missing or invalid, it sends an appropriate response to the client.
 */
export const verifyToken = async (req, res, next) => { // next will help us to continue the function
  try {
    let token = req.header("Authorisatioin");
    if(!token){
        return res.status(403).send("Access Denied"); // thhis handles the case if token does not exist
    }
    if(token.startswith("Bearer ")){
        token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    next();

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
/**
 * export const verifyToken = async (req, res, next) => { ... }: This line exports the verifyToken function as the default export of the module. The function is defined as an asynchronous function and takes three parameters: req (request), res (response), and next (a function that passes control to the next middleware or route handler).
 * let token = req.header("Authorisatioin");: This line retrieves the token from the request headers. The token is expected to be sent in the "Authorization" header.
 * if (!token) { ... }: This condition checks if the token is missing or not provided in the request header. If the token is missing, the middleware sends a response with a status code of 403 (Forbidden) and the message "Access Denied".
 * if (token.startsWith("Bearer ")) { ... }: This condition checks if the token starts with the string "Bearer ". If it does, the middleware removes the "Bearer " prefix from the token, as it is commonly included for better readability but not needed for token verification.
 * const verified = jwt.verify(token, process.env.JWT_SECRET);: This line verifies the token using the jwt.verify method from the jsonwebtoken library. It checks if the token is valid and has not expired, using the secret provided by the process.env.JWT_SECRET environment variable. If the token is valid, the function returns the decoded token payload.
 * req.user = verified;: If the token is valid, the decoded token payload is attached to the req object as req.user. This allows other middleware or route handlers downstream to access information about the authenticated user.
 * next();: After verifying the token and attaching the user information to the request object, the next() function is called to pass control to the next middleware or route handler in the chain.
 * catch (err) { ... }: If there is an error during token verification, the catch block will handle the error. It sends a response with a status code of 500 (Internal Server Error) and the error message as a JSON response.
*/
