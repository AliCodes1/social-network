import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { updateProfile } from "../api/userServices";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface ProfileState {
  username: string;
  description: string;
  profilePic: File | undefined;
}

const Profile: React.FC = () => {
  const { user, setUser } = useUser();
  const [profile, setProfile] = useState<ProfileState>({
    username: user?.username || "",
    description: user?.profileDescription || "",
    profilePic: undefined,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, profilePic: e.target.files?.[0] });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const response = await updateProfile(user._id, {
          username: profile.username,
          description: profile.description,
          profilePic: profile.profilePic,
        });
        setUser(response.data);

        navigate("/");
      } catch (error) {
        console.error("Error updating profile");
      }
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleBackClick = () => {
    navigate(-1);
  };
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      {user && (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
            >
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditing ? "Edit Profile" : "Profile"}
            </h1>
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={profile.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transition duration-200"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Username</h2>
                <p className="text-gray-600">{user.username}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Description</h2>
                <p className="text-gray-600">{user.profileDescription}</p>
              </div>
              {user.profilePicture && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Profile Picture
                  </h2>
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );


};

export default Profile;
