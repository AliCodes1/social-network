/* eslint-disable */
// @ts-nocheck
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUsersData, UserComponent } from "./Follow"; // Import the exported hooks and components
import { Button } from "@/components/ui/button"; // Update with the correct path
import AiTweetModal from "@/pages/aiTweetModal";
import {useUser} from "../contexts/UserContext";
import { createTweet, TweetData } from "@/api/tweetServices";
const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { filteredUsers, searchQuery, setSearchQuery } = useUsersData();
    const {user}=useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleTweet = async (tweet: string) => {
    if (user) {
        // Check if user is not null
        try {
          const tweetData: TweetData = {
            content: tweet,
            userID: user._id,
            profilePicture: user.profilePicture,
            userName: user.username,
            // Set other properties if necessary
          };
          await createTweet(tweetData);
          
        } catch (error) {
          console.error("Failed to post tweet");
        }
      }

    // Implement your tweet functionality here
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <aside className="w-full h-full bg-gray-800 text-white flex flex-col md:flex">
      {/* Mobile Menu Bar */}
      <div className="flex justify-between items-start bg-gray-800 p-2 md:hidden">
        {/* Hamburger Icon */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          <i className="fas fa-bars"></i>
        </button>
        {/* Search Bar and Dropdown Wrapper */}
        <div className="md:hidden  relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 rounded bg-gray-700"
          />
          {searchQuery && (
            <div className="absolute bg-gray-700 w-full mt-1 rounded z-10">
              {filteredUsers.map((user) => (
                <UserComponent key={user._id} user={user} />
              ))}
            </div>
          )}
        </div>

        {/* User Icon */}
        <Link
          to="/profile"
          className="flex items-center space-x-3 py-2 hover:bg-gray-700 rounded-md px-3"
        >
          <i className="fas fa-user text-xl"></i>
        </Link>
      </div>

      {/* Search Bar */}

      {/* Mobile Sidebar - Collapsible */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block bg-gray-800`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {/* Navigation Links */}
          <Link
            to="/"
            className="hidden md:block items-center space-x-3 py-2 hover:bg-gray-700 rounded-md px-3"
          >
            <i className="fas fa-twitter text-xl text-blue-400"></i>
          </Link>
          <Link
            to="/"
            className="flex items-center space-x-3 py-2 hover:bg-gray-700 rounded-md px-3 "
          >
            <i className="fas fa-home text-xl"></i>
            <span>Home</span>
          </Link>
         
          <Link
            to="/profile"
            className=" items-center space-x-3 py-2 hover:bg-gray-700 rounded-md px-3 hidden md:block"
          >
            <i className="fas fa-user text-xl"></i>
            <span>Profile</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center space-x-3 py-2 hover:bg-gray-700 rounded-md px-3"
          >
            <i className="fas fa-sign-in-alt text-xl"></i>
            <span>Login</span>
          </Link>
          <div className="mt-4 w-[200px]">
            <Button onClick={handleOpenModal} className="tweet-ai-button bg-blue-400">
              Generate Tweet with AI
            </Button>
            <AiTweetModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onTweet={handleTweet}
              user={user}
            />
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
