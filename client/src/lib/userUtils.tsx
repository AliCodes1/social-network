// src/utils/userUtils.ts
import { getUserById } from '../api/userServices';
import { User } from '../api/userServices'; // Assuming you have a User interface

export const fetchUserProfilePic = async (userId: string): Promise<string | null> => {
  try {
    const response = await getUserById(userId);
    const user: User = response.data;
    return user.profilePicture || null;
  } catch (error) {
    console.error('Error fetching user profile picture:', error);
    return null;
  }
};