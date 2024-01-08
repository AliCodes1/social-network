import instance from './axios';
import { AxiosResponse } from 'axios';

export const addFollower = (followedID: string, followingID: string): Promise<AxiosResponse> => {
  return instance.post('/followData/follow', { followedID, followingID });
};

export const removeFollower = (followedID: string, followingID: string): Promise<AxiosResponse> => {
  return instance.delete('/followData/unfollow', { data: { followedID, followingID } });
};