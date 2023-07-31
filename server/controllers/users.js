/*-----------------------------------------------FUNCTION OF THE FILE--------------------------------------------*/
/**
 * This file is a set of controller functions that handles specific endpoints related to user data. These functions are designed to work with the MongoDB database since they use the User model, which is a MongoDB model for storing user data.
 * This file handles three main functionalities related to users: retrieving user data, retrieving a user's friends, and adding/removing friends from a user's friend list. It interacts with the MongoDB database using the User model to perform these operations. 
 * This code also handles errors by providing appropriate error responses with status codes when necessary.
*/





/*------------------------------------------------IMPORTING MODULES------------------------------------------*/
import User from "../models/User.js";







/*------------------------------------------------FINDING A USER WITH GIVEN ID-----------------------------------------------*/
/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/**
 * This function handles an HTTP GET request to retrieve user data based on the user's ID (/:id). It uses the User model's findById method to search for the user in the database based on the provided ID.
 * If the user is found, it responds with the user data in JSON format with a status code of 200 (OK).
 * If the user is not found or there is an error in the process, it responds with a JSON object containing an error message and a status code of 404 (Not Found).
*/






/*------------------------------------------------RETRIEVING A USER'S FRIENDS-----------------------------------------------*/
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => user.findById(id)) // searching for the id
    );
    const formattedFriends = friends.map(
      ({ _id, firstname, lastname, occupation, location, picturePath }) => {
        return { _id, firstname, lastname, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/**
 * This function handles an HTTP GET request to retrieve a user's friends based on the user's ID (/:id/friends).
 * It first finds the user using the User model's findById method based on the provided ID.
 * It then uses Promise.all and the map function to retrieve all the user's friends' data by mapping through the user.friends array and calling User.findById for each friend's ID. The Promise.all ensures that all the promises for each friend retrieval are resolved before continuing.
 * The function formats the friends' data by selecting specific properties (e.g., _id, firstname, lastname, occupation, location, and picturePath) from each friend's object.
 * The formatted friends' data is then sent as a JSON response with a status code of 200 (OK).
 * If there's an error in the process, it responds with a JSON object containing an error message and a status code of 404 (Not Found).
*/






/*------------------------------------------------ADDING AND REMOVING FRIEND OF A USER-----------------------------------------------*/
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId); // copying the same array without including the friend to be removed
      friend.friends = friends.friends.filter((id) => id !==id); // copying the same array without including the user to be removed 
    } else {
      user.friends.push(friendId); // If not present then we are adding a new friend
      friend.friends.push(id); // // If not present then we are adding a new friend
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => user.findById(id)) // searching for the id
    );
    const formattedFriends = friends.map(
      ({ _id, firstname, lastname, occupation, location, picturePath }) => {
        return { _id, firstname, lastname, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/**
 * This function handles an HTTP PATCH request to add or remove a friend from a user's friend list based on their IDs (/:id/:friendId).
 * It first finds both the user and the friend using the User model's findById method based on the provided IDs.
 * If the friend's ID is already present in the user's friends array, it means the friend should be removed. To remove the friend, the function filters out the friend's ID from the user.friends array and vice versa to remove the user's ID from the friend.friends array.
 * If the friend's ID is not present in the user's friends array, it means the friend should be added. In this case, it adds the friend's ID to the user.friends array and vice versa to add the user's ID to the friend.friends array.
 * After making the necessary changes, it saves both the user and friend documents in the database using the save method.
 * Next, it retrieves all the user's friends' data (including the newly updated friend list) using the same approach as in the getUserFriends function.
 * It then formats the friends' data in the same way as in the getUserFriends function.
 * Finally, it sends the formatted friends' data as a JSON response with a status code of 200 (OK).
 * If there's an error in the process, it responds with a JSON object containing an error message and a status code of 404 (Not Found).
*/
