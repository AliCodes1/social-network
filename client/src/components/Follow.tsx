/* eslint-disable */
// @ts-nocheck
import { useEffect, useState } from "react";
import { getAllUsers, User as UserType } from "../api/userServices";
import { useNavigate } from "react-router-dom";
import ProfilePlaceholder from "../assets/pngtree-twitter-social-media-round-icon-png-image_6315985.png";
import { useUser } from "../contexts/UserContext";

export const useUsersData = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        const randomUsers = response.data.sort(() => 0.5 - Math.random()).slice(0, 5);
        setUsers(randomUsers);
        setFilteredUsers(randomUsers);
      } catch (error) {
        console.error("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  return { users, filteredUsers, searchQuery, setSearchQuery };
};

export const UserComponent = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center cursor-pointer p-4 border-b border-gray-700  hover:bg-gray-600" onClick={() => navigate(`/users/${user._id}`)}>
      <img src={user.profilePicture || ProfilePlaceholder} className="rounded-full h-10 w-10 object-cover" alt="profile" />
      <div className="ml-3">
        <p className="text-sm font-bold">{user.username}</p>
      </div>
    </div>
  );
};

const Follow = () => {
  const { filteredUsers, searchQuery, setSearchQuery } = useUsersData();
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="bg-gray-800 text-white w-full h-full pt-4 hidden md:block ">
       <div className="mx-4 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 rounded bg-gray-700"
        />
      </div>
      <div className="bg-gray-700 rounded-lg mx-4">
        <h3 className="text-lg font-bold p-4 border-b border-gray-600">Who To Follow</h3>
        {filteredUsers.map((user) => <UserComponent key={user._id} user={user} />)}
      </div>
    </div>
  );
};

export default Follow;
