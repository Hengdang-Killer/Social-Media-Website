/*-----------------------------------------------FUNCTION OF THE FILE--------------------------------------------*/
/**
 * This file contains two functions, register and login, which handle user registration and user login functionality (with appropriate error handling and secure password encryption using bcrypt and JSON Web Tokens for authentication.) for the application.
 */





/*----------------------------------------------------IMPORTING MODULES-----------------------------------------------------*/
import bcrypt from "bcrypt"; // allow us to encrypt our password
import jwt from "jsonwebtoken"; // give us a way to give user a web token that they can use for authorisation
import User from "../models/User.js";







/* ----------------------------------------------REGISTER USER------------------------------------------------------ */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt(); // basically encryption salt is generated
    const passwordHash = await bcrypt.hash(password, salt); // Encrypting the password using the salt

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // 201 is a status code which we will give to user that something has been created
  } catch (err) {
    res.status(500).json({ error: err.message }); // error in registration
  }
};
/**
 * This function is an asynchronous function (async) that handles the user registration process.
 * The function receives data from the client's request (req.body) containing information about the user to be registered, such as firstName,    lastName, email, password, picturePath, friends, location, and occupation.
 * It uses bcrypt to generate a salt and hash the user's password before storing it in the database. This ensures that the user's password is securely encrypted before being stored in the database.
 * A new instance of the User model is created with the provided user data, including the hashed password.
 * Random values for viewedProfile and impressions are generated and assigned to the new user.
 * The new user is saved to the database using the save() method.
 * If the user is successfully saved, a status code of 201 (Created) and the saved user data are sent as a JSON response to the client. 
 * If there's an error, a status code of 500 (Internal Server Error) and the error message are sent as a JSON response.
 */








/* --------------------------------------LOGGING IN-------------------------------------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); // Finding email in database
    if (!user) return res.status(400).json({ msg: "User does not exist. " }); // if email is not present in database

    const isMatch = await bcrypt.compare(password, user.password); // Comparing given password with the password mapped with the email in the database
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " }); // if password does not match

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // deleting password so that it does not get sent back to the front-end as it should confedentitial
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * This function is an asynchronous function (async) that handles the user login process.
 * The function receives data from the client's request (req.body) containing the email and password entered by the user during the login attempt.
 * It looks up the user in the database based on the provided email using User.findOne({ email: email }).
 * If the user with the provided email does not exist, a status code of 400 (Bad Request) and a JSON response indicating "User does not exist" are sent to the client.
 * If the user exists, it uses bcrypt.compare to check if the provided password matches the stored hashed password for that user.
 * If the passwords match, a JSON Web Token (JWT) is generated and signed with the user's _id as the payload and a secret from the environment (process.env.JWT_SECRET). This token is sent back to the client along with the user data (with the password property removed for security reasons).
 * If the passwords do not match, a status code of 400 (Bad Request) and a JSON response indicating "Invalid credentials" are sent to the client.
 * If there's an error during the process, a status code of 500 (Internal Server Error) and the error message are sent as a JSON response.
*/
