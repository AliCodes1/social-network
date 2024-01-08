import { AxiosResponse } from 'axios';
import instance from './axios';
export interface User {
  _id?:string;
  username: string;
  email: string;
  password: string;
  joinDate?: Date; 
  profileDescription?: string; 
  profilePicture?: string; 
  followed?: Array<IFollow>; 
  following?: Array<IFollow>; 
}

export interface IFollow {
  followedID: string; // or mongoose.Schema.Types.ObjectId;
  followingID: string; // or mongoose.Schema.Types.ObjectId;
  // any other properties of Follow model
}

interface ProfileUpdateData {
  username?: string;
  description?: string;
  profilePic?: File;
}

export const updateProfile = (userId: string, profileData: ProfileUpdateData): Promise<AxiosResponse> => {
  const formData = new FormData();
  if (profileData.username) formData.append('username', profileData.username);
  if (profileData.description) formData.append('description', profileData.description);
  if (profileData.profilePic) formData.append('profilePic', profileData.profilePic);

  return instance.post(`/users/updateProfile/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


export const addFollower = (targetUserId: string, currentUserId: string): Promise<AxiosResponse> => {
  return instance.post('/users/follow', { targetUserId, currentUserId });
};

export const removeFollower = (targetUserId: string, currentUserId: string): Promise<AxiosResponse> => {
  return instance.delete('/users/unfollow', { data: { targetUserId, currentUserId } });
};

export const loginUser = (username: string, password: string): Promise<AxiosResponse> => {
  return instance.post('/users/login', { username:username, password:password });
};

export const logoutUser = (): Promise<AxiosResponse> => {
  return instance.post('/users/logout');
};


export const registerUser = (userData: User): Promise<AxiosResponse> => {
  return instance.post('/users/register', userData);
};

export const getAllUsers = (): Promise<AxiosResponse> => {
  //console.log(import.meta.env.BASE_URL);
  return instance.get('/users');
};

export const getUserById = (id: string): Promise<AxiosResponse> => {
  return instance.get(`/users/${id}`);
};

export const updateUser = (id: string, updateData: User): Promise<AxiosResponse> => {
  return instance.put(`/users/${id}`, updateData);
};

export const deleteUser = (id: string): Promise<AxiosResponse> => {
  return instance.delete(`/users/${id}`);
};

export const getUserSession = (): Promise<AxiosResponse> => {
  return instance.get('/users/session');
};
export const getUserWithFollowData = (userId: string): Promise<AxiosResponse> => {
  return instance.get(`/users/follow/${userId}`);
};
