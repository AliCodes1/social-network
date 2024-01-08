import React, { useState, useEffect, ChangeEvent } from "react";
import { getReplies, createReply, ReplyData } from "../api/replyServices";
import { useUser } from "../contexts/UserContext";
import Profile from "../assets/pngtree-twitter-social-media-round-icon-png-image_6315985.png";

interface CommentsSectionProps {
  tweetID: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ tweetID }) => {
  const [comments, setComments] = useState<ReplyData[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchReplies = async () => {
      if (tweetID) {
        const res = await getReplies(tweetID);
        setComments(res.data);
      }
    };

    if (showComments) {
      fetchReplies();
    }
  }, [tweetID, showComments]);
  const handleCommentSubmit = async () => {
    if (user?._id) {
      const response = await createReply({
        userID: user._id,
        tweetID,
        content: newComment,
      });
      setComments([response.data,...comments]);
      setNewComment("");
    }
  };

  const handleCloseComments = () => {
    setShowComments(false);
  };

  // Function to handle click outside of modal
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as Element).classList.contains('modal-overlay')) {
      handleCloseComments();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setNewComment(e.target.value);
  };
  
  return (
    <div>
      {user && (
        <>
          <button
            onClick={() => setShowComments(!showComments)}
            className="py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            {showComments ? "Hide Comments" : "Show Comments"}
          </button>
  
          {showComments && (
            <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4" onClick={handleClickOutside}>
              <div className="bg-gray-800 rounded shadow-lg w-full max-w-lg p-6 overflow-auto max-h-[80vh] relative">
                <button
                  onClick={handleCloseComments}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                  <i className="fas fa-times"></i>
                </button>
                <div className="mt-4 text-black">
                  <input
                    type="text"
                    value={newComment}
                    onChange={handleChange}
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="my-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Comment
                  </button>
                </div>
                {comments.map((comment) => (
                  <div key={comment._id} className="mb-4">
                    <div className="flex items-center mb-2">
                      <img
                        src={user?.profilePicture || Profile}
                        className="rounded-full object-cover h-10 w-10 mr-2"
                        alt="profile pic"
                      />
                      <span className="font-semibold">@{user?.username}</span>
                    </div>
                    <p className="ml-[40px]">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default CommentsSection;
