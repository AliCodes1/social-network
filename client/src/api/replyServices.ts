import { AxiosResponse } from 'axios';
import instance from './axios';

export interface ReplyData {
  tweetID: string;
  userID: string;
  content: string;
  replyDate?: Date;
  _id?:string;
}

interface UpdateReplyData {
  content?: string;
  replyDate?: Date;
}

// Function to create a new reply
export const createReply = (replyData: ReplyData): Promise<AxiosResponse> => {
  return instance.post('/reply/reply', replyData);
};

// Function to get all replies for a tweet
export const getReplies = (tweetID: string): Promise<AxiosResponse> => {
  return instance.get('/reply/getReply',{params:{tweetID}});
};

// Function to update a reply
export const updateReply = (replyId: string, updateData: UpdateReplyData): Promise<AxiosResponse> => {
  return instance.put(`/reply/updateReply/${replyId}`, updateData);
};

// Function to delete a reply
export const deleteReply = (replyId: string): Promise<AxiosResponse> => {
  return instance.delete(`/reply/deleteReply/${replyId}`);
};