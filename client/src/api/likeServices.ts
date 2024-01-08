import { AxiosResponse } from 'axios';
import instance from './axios';

export const addLike = (userID: string, tweetID: string): Promise<AxiosResponse> => {
  return instance.post('/like/add', { userID, tweetID });
};

export const removeLike = (userID: string, tweetID: string): Promise<AxiosResponse> => {
  return instance.delete('/like/remove', { data: { userID, tweetID } });
};

export const getLikesByTweet = (tweetID: string): Promise<AxiosResponse> => {
  return instance.get(`/like/tweet/${tweetID}`);
};