import instance from './axios';
import { AxiosResponse } from 'axios';

// Define an interface for the tweet data structure
export interface TweetData {
  content: string;
  postDate?: Date;
  isRetweet?: boolean;
  originalTweetID?: string | null; // Also a string
  userID:string;
  _id?:string;
  profilePicture?:string;
  userName?:string | null;
  likes?:string[];

}


export const addLike = (userID: string, tweetID: string): Promise<AxiosResponse> => {
    return instance.post('/tweet/addLike', { userID, tweetID });
};

export const removeLike = (userID: string, tweetID: string): Promise<AxiosResponse> => {
    return instance.post('/tweet/removeLike', { userID, tweetID });
};

export const createTweet = (tweetData: TweetData): Promise<AxiosResponse> => {
  return instance.post('/tweet/tweet', tweetData);
};

export const getTweets = (userID: string): Promise<AxiosResponse> => {
  return instance.get('/tweet/getTweet', { params: { userID } });
};
export const getAllTweets = (): Promise<AxiosResponse> => {
  return instance.get('/tweet/getAllTweets');
};


export const updateTweet = (tweetId: string, updateData: TweetData): Promise<AxiosResponse> => {
  return instance.put(`/tweet/updateTweet/${tweetId}`, updateData);
};

export const deleteTweet = (tweetId: string): Promise<AxiosResponse> => {
  return instance.delete(`/tweet/deleteTweet/${tweetId}`);
};
