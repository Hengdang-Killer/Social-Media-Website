/*-----------------------------------------------FUNCTION OF THE FILE--------------------------------------------*/
/**
 * Mongoose is an Object Data Modeling (ODM) library for MongoDB that provides a straightforward way to model and interact with MongoDB collections.
 * This file defines a Mongoose model for a user with specific fields and constraints and exports it for use in other parts of the application.
 * The model provides a structured and type-safe way to interact with user data in the MongoDB database.
*/






/*------------------------------------------------IMPORTING LIBRARIES------------------------------------------*/
import mongoose from "mongoose"; 
/**
 *  This line imports the Mongoose library.
 *  This library provides a convenient way to interact with MongoDB databases, allowing developers to define schemas, models, and perform various operations on data stored in a MongoDB database.
 */



/*------------------------------------------------SCHEMA FOR A USER------------------------------------------*/
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);
/**
 * const UserSchema = new mongoose.Schema({ ... }, { timestamps: true });: This defines the schema for the User model using the mongoose.Schema constructor. The UserSchema variable holds the schema definition for the user document.
 * The schema specifies the structure of the user document in the MongoDB collection. It defines the fields, their data types, validation rules, and default values. The fields in the schema correspond to the properties that each user document will have in the collection. In this case, the UserSchema defines the following fields for a user :-
 * firstName: A required string field with a minimum length of 2 characters and a maximum length of 50 characters.
 * lastName: A required string field with the same constraints as firstName.
 * email: A required string field with a maximum length of 50 characters and should be unique (no two users can have the same email address).
 * password: A required string field with a minimum length of 5 characters.
 * picturePath: A string field with a default value of an empty string.
 * friends: An array field with a default value of an empty array.
 * location: A string field.
 * occupation: A string field.
 * viewedProfile: A numeric field.
 * impressions: A numeric field.
 * The { timestamps: true } option adds two additional fields, createdAt and updatedAt, to the schema. These fields will automatically be populated with the creation and last update timestamps of each user document.
*/





/*------------------------------------------------CREATING THE MODEL OF THE ABOVE SCHEMA------------------------------------------*/
const User = mongoose.model("User", UserSchema);
/**
 * This creates the User model using the mongoose.model method. The model allows you to interact with the MongoDB collection named "users" (Mongoose automatically pluralizes the model name to find the corresponding collection).
*/




/*------------------------------------------------EXPORTING THE MODEL------------------------------------------*/
export default User;
/**
 * This exports the User model as the default export of this module. 
 * This allows other parts of the application to import and use the User model to interact with the "users" collection in the MongoDB database.
*/
