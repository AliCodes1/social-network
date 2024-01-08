/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Profile from "../assets/pngtree-twitter-social-media-round-icon-png-image_6315985.png";
import { Button } from "@/components/ui/button"; // Update with the correct path
import { Textarea } from "@/components/ui/textarea"; // Update with the correct path
import {
  createTweet,
  getAllTweets,
  TweetData,
  addLike,
  removeLike
} from "../api/tweetServices"; // Update with the correct path
import { useUser } from "../contexts/UserContext";
import CommentsSection from "./comments";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

// Define a type for your form state
interface FormState {
  content: string;
}

const Home = () => {
  const [form, setForm] = useState<FormState>({ content: "" });
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const { user } = useUser();
  const { isLoggedIn,loading } = useAuth(); // Use the authentication context to check if the user is logged in
  const [ws, setWs] = useState<WebSocket | null>(null);

  const handleLikeOrUnlike = async (tweet: TweetData) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      if (tweet._id && tweet.likes && tweet.likes.includes(user._id)) {
        // If the tweet is already liked by the user, remove the like
        await removeLike(user._id, tweet._id);
        // Update the tweet's likes array by removing the user's ID
        const updatedLikes = tweet.likes.filter(
          (likeId) => likeId !== user._id
        );
        setTweets(
          tweets.map((t) =>
            t._id === tweet._id ? { ...t, likes: updatedLikes } : t
          )
        );
      } else if (tweet._id && tweet.likes) {
        // If the tweet is not liked by the user, add the like
        await addLike(user._id, tweet._id);
        // Update the tweet's likes array by adding the user's ID
        const updatedLikes = [...tweet.likes, user._id];
        setTweets(
          tweets.map((t) =>
            t._id === tweet._id ? { ...t, likes: updatedLikes } : t
          )
        );
      }
    } catch (error) {
      console.error("Error updating like status");
    }
  };

  useEffect(() => {
    const fetchTweets = async () => {
      console.log("test");
      try {
        const response = await getAllTweets();
        if (response && response.data) {
          setTweets(response.data);
        }
      } catch (error) {
        console.error("Error fetching tweets");
      }
    };
    const webSocket = new WebSocket(import.meta.env.VITE_APP_WEBSOCKET_SERVER); 
    setWs(webSocket);

    // Handle incoming messages
    webSocket.onmessage = (event) => {
      const newTweet = JSON.parse(event.data);
      setTweets(currentTweets => [newTweet, ...currentTweets]);
    };
    fetchTweets();

    // Clean up function to close WebSocket connection
    return () => {
      webSocket.close();
    };
  }, [isLoggedIn]);


  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      // Check if user is not null
      try {
        const tweetData: TweetData = {
          content: form.content,
          userID: user._id,
          profilePicture: user.profilePicture,
          userName: user.username,
          // Set other properties if necessary
        };
        const response = await createTweet(tweetData);
        if (response && response.data) {
          setForm({ content: "" });
          setTweets([response.data, ...tweets]);
        }
      } catch (error) {
        console.error("Failed to post tweet");
      }
    }
  };
  

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator or a blank screen
  }
  return (
    <main className="bg-gray-800 w-full min-h-screen p-4 mr-8 text-white">
      <div className="max-w-2xl mx-auto">
        {user && (
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={user.profilePicture || Profile}
                className="rounded-full h-10 w-10 object-cover"
                alt="profile"
              />
              <span className="font-semibold">@{user.username}</span>
            </div>
            <form
              onSubmit={handleSubmit}
              className="bg-gray-700 p-4 rounded-lg"
            >
              <Textarea
                placeholder="What's happening?"
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                className="bg-transparent w-full border-none"
              />
              <Button className="bg-blue-500 hover:bg-blue-600 mt-2">
                Tweet
              </Button>
            </form>
          </div>
        )}

        {tweets.map((tweet) => (
          <div key={tweet._id} className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-4 mb-2">
              <img
                src={tweet.profilePicture || Profile}
                className="rounded-full h-8 w-8 object-cover"
                alt="user"
              />
              <Link to={`/users/${tweet.userID}`}>
                <span>@{tweet.userName}</span>
              </Link>{" "}
            </div>
            <p className="mb-2">{tweet.content}</p>
            <div className="flex items-center space-x-4">
              {user && (<button
                className="flex items-center space-x-1"
                onClick={() => user && user._id && handleLikeOrUnlike(tweet)}
              >
                <i
                  className={`fas fa-heart ${
                    tweet.likes.includes(user._id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                ></i>
                <span>{tweet.likes.length}</span>
              </button>)}
              {tweet._id && <CommentsSection tweetID={tweet._id} />}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
