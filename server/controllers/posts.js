/*-----------------------------------------------FUNCTION OF THE FILE--------------------------------------------*/
/**
* This file contains controller functions that handle specific endpoints related to posts and their interactions. These functions interact with a MongoDB database using the Post and User models, which are MongoDB models for storing post and user data.
* The code implements CRUD functionality for posts with additional functionalities for liking posts and retrieving posts from the feed and user-specific posts. The code interacts with the MongoDB database using the Post and User models to perform these operations. It also handles errors gracefully by providing appropriate error responses with status codes when necessary.
 */





/*------------------------------------------------IMPORTING LIBRARIES------------------------------------------*/
import Post from "../models/Post.js";
import User from "../models/User.js";






/*------------------------------------------------CREATING A NEW POST------------------------------------------*/
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); // savinng the post into the mongoDB

    const post = await Post.find(); //grab all the posts with the new post
    res.status(201).json(post); // return the posts to the frontend // 201 represents we have created something
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
/**
 * This function handles an HTTP POST request to create a new post. It expects the request body to contain userId, description, and picturePath properties.
 * It first finds the user using the User model's findById method based on the provided userId.
 * Then it creates a new Post document with the user and post details. It includes the user's information such as firstName, lastName, location, and userPicturePath in the post document for reference.
 * The likes and comments properties are initialized as empty objects and arrays, respectively, for the new post.
 * The new post document is saved to the database using the save method.
 * After saving the post, it retrieves all posts from the database using the Post.find() method.
 * Finally, it responds with the newly created post list in JSON format with a status code of 201 (Created).
 * If there's an error during the process, it responds with a JSON object containing an error message and a status code of 409 (Conflict).
 */





/*-----------------------------------RETRIEVE ALL POSTS FROM DATABASE AND RETURN TO THEM TO THE FRONTEND-------------------------------*/
/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find(); //grab all the post with the new post
    res.status(200).json(post); // return the posts to the frontend // 200 is just a successful request
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/**
 * This function handles an HTTP GET request to retrieve all posts from the database.
 * It retrieves all posts using the Post.find() method.
 * It responds with the list of posts in JSON format with a status code of 200 (OK).
 * If there's an error during the process, it responds with a JSON object containing an error message and a status code of 404 (Not Found).
*/




/*---------------------------RETRIEVE ALL POSTS FROM DATABASE OF A PARTICULAR USER AND RETURN TO THEM TO THE FRONTEND-------------------*/
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }); //grab that post
    res.status(200).json(post); // return the post to the frontend // 200 is just a successful request
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/**
 * This function handles an HTTP GET request to retrieve all posts associated with a specific user based on their userId.
 * It extracts the userId from the request parameters (req.params).
 * It retrieves all posts where the userId matches the provided userId using the Post.find() method.
 * It responds with the list of posts in JSON format with a status code of 200 (OK).
 * If there's an error during the process, it responds with a JSON object containing an error message and a status code of 404 (Not Found).
*/




/*---------------------------------------------UPDATING LIKE AND UNLIKE OF A POST--------------------------------*/
export const likePost = async (req,res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    
    if(isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    )

    res.status(200).json(updatedPost); 
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}
/**
 * This function handles an HTTP PATCH request to like or unlike a post. It expects the request body to contain userId to identify the user who likes/unlikes the post.
 * It extracts the id from the request parameters (req.params), which represents the post's ID.
 * It finds the post in the database using the Post.findById() method based on the provided post ID.
 * The function checks if the user has already liked the post by calling post.likes.get(userId), where likes is a Map-like object that tracks the user IDs who liked the post.
 * If the user has already liked the post (isLiked is true), it removes the user's like by calling post.likes.delete(userId).
 * If the user hasn't liked the post yet (isLiked is false), it adds the user's like by calling post.likes.set(userId).
 * After updating the post's likes, it uses the Post.findByIdAndUpdate() method to save the updated post to the database. The { new: true } option ensures that the updated post is returned after the update.
 * Finally, it responds with the updated post data in JSON format with a status code of 200 (OK).
 * If there's an error during the process, it responds with a JSON object containing an error message and a status code of 404 (Not Found).
*/
