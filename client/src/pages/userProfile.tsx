/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserById,
  User,
  getUserWithFollowData,
  addFollower,
  removeFollower,
} from "../api/userServices";
import { getTweets, addLike, removeLike, TweetData } from "@/api/tweetServices";
import ProfilePlaceholder from "../assets/pngtree-twitter-social-media-round-icon-png-image_6315985.png"; // Import a profile placeholder image
import { useUser } from "../contexts/UserContext";
import { IFollow } from "@/api/userServices";

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userTweets, setUserTweets] = useState<TweetData[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && user?._id && user) {
        try {
          const userResponse = await getUserById(userId);
          setUserProfile(userResponse.data);

          const tweetsResponse = await getTweets(userId);
          setUserTweets(tweetsResponse.data);

          const followResponse = await getUserWithFollowData(user._id);
          if (followResponse.data) {
            setUser({
              ...user,
              following: followResponse.data.following,
              followed: followResponse.data.followed,
            });
          }
          // Check if the current user is already following this profile
          setIsFollowing(
            followResponse.data.following.some((follow: { _id: string }) => {
                return follow._id === userId;
            })
            
          );
        } catch (error) {
          console.error("Error fetching user data");
        }
      }
    };

    fetchUserData();
  }, [userId, user?._id]);

  const handleFollow = async () => {
    const targetUserId = userId;
    const currentUserId = user?._id;
    if (userId && targetUserId && currentUserId) {
      try {
        if (isFollowing) {
          // Unfollowing the user
          await removeFollower(targetUserId, currentUserId);
          setIsFollowing(false);
          // Update userProfile state to decrease the follower count
          setUserProfile((prevProfile) =>
            prevProfile
              ? {
                  ...prevProfile,
                  followed: prevProfile?.followed?.filter((f) => f._id !== currentUserId),

                }
              : null
          );
        } else {
          // Following the user
          await addFollower(targetUserId, currentUserId);
          setIsFollowing(true);
          // Update userProfile state to increase the follower count
          setUserProfile((prevProfile) =>
            prevProfile
              ? {
                  ...prevProfile,
                  followed: [...prevProfile.followed, {_id:currentUserId}],

                }
              : null
          );
        }
      } catch (error) {
        console.error("Error in follow/unfollow action");
      }
    }
  };
  const handleLikeOrUnlike = async (tweet: TweetData) => {
    if (!userId || !user) {
      console.error("User not authenticated");
      return;
    }

    try {
      let updatedLikes;
      if (tweet.likes!.includes(user._id)) {
        // Unliking the tweet
        await removeLike(userId, tweet._id!);
        updatedLikes = tweet.likes!.filter((likeId) => likeId !== user._id);
      } else {
        // Liking the tweet
        await addLike(userId, tweet._id!);
        updatedLikes = [...tweet.likes!, user._id];
      }
      // Update the local state
      setUserTweets((tweets) =>
        tweets.map((t) =>
          t._id === tweet._id ? { ...t, likes: updatedLikes! } : t
        )
      );
    } catch (error) {
      console.error("Error updating like status");
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg overflow-hidden">
        {user && (
          <>
            <div className="p-4 sm:p-6">
              <button
                onClick={handleBack}
                className="mb-4 py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded-full text-gray-700"
              >
                &larr; Back
              </button>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <img
                  src={userProfile?.profilePicture || ProfilePlaceholder}
                  alt="Profile"
                  className="rounded-full h-24 w-24 object-cover border-4 border-blue-200"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {userProfile?.username}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {userProfile?.profileDescription}
                  </p>
                  <div className="mt-4">
                    <span className="text-sm font-semibold text-gray-600 mr-6">
                      {userProfile?.following?.length} Following
                    </span>
                    <span className="text-sm font-semibold text-gray-600">
                      {userProfile?.followed?.length} Followers
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center sm:justify-start mt-4">
                <button
                  onClick={handleFollow}
                  className={`mt-4 py-2 px-4 rounded-full text-white font-bold ${
                    isFollowing
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
            <div className="bg-blue-100 p-4 sm:p-6 border-t border-blue-200">
              {userTweets.map((tweet) => (
                <div
                  key={tweet._id}
                  className="py-4 border-b border-blue-200 last:border-b-0"
                >
                  <p className="text-gray-800">{tweet.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => handleLikeOrUnlike(tweet)}
                      className={` space-x-1 text-sm ${
                        tweet.likes!.includes(user._id)
                          ? "text-red-600 hover:text-red-700"
                          : "text-gray-400 hover:text-gray-500"
                      }`}
                    >
                      <i
                        className={`fas fa-heart ${
                          tweet.likes!.includes(userId!)
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      ></i>

                      <span className="text-sm">
                        {tweet.likes!.length > 0 ? tweet.likes!.length : ""}
                      </span>
                    </button>
                    <span className="text-sm text-gray-600">
                      {new Date(tweet.postDate || "").toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
