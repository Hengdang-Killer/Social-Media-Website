/*-----------------------------------------------FUNCTION OF THE FILE--------------------------------------------*/
/**
 * This file is a module that defines a Mongoose schema for a "post" entity in the MongoDB database.
 * This file provides a structure for storing and interacting with "post" data in the MongoDB database using Mongoose, and it allows us to perform CRUD operations (Create, Read, Update, Delete) on the "posts" collection. Note that the likes field uses a Map to store likes for each post, and the comments field is an array that holds comments for each post, initialized with an empty array as the default value.
 */




/*------------------------------------------------IMPORTING LIBRARIES------------------------------------------*/
import mongoose from "mongoose";
/**
 * This is importing the Mongoose library.
 * This library provides a convenient way to interact with MongoDB databases, allowing developers to define schemas, models, and perform various operations on data stored in a MongoDB database.
 */




/*------------------------------------------------SCHEMA FOR A POST------------------------------------------*/
const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
/**
 * This defines the schema for the "post" entity using Mongoose. It has several fields, such as userId, firstName, lastName, location, description, picturePath, userPicturePath, likes, and comments. 
 * The timestamps: true option automatically adds createdAt and updatedAt fields to the documents, which track when the documents were created and last updated, respectively.
 */




/*------------------------------------------------CREATING THE MODEL OF THE ABOVE SCHEMA------------------------------------------*/
const Post = mongoose.model("Post", postSchema);
/**
 * This creates a Mongoose model named "Post" using the defined schema. 
 * The model is associated with the "posts" collection in the MongoDB database.
 */





/*------------------------------------------------EXPORTING THE MODEL------------------------------------------*/
export default Post;
/**
 * This exports the "Post" model as the default export of the module, allowing other files to import and use it.
 */
