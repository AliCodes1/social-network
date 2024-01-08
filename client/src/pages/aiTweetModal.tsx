import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateText } from "../api/openai";
import { User } from "../api/userServices";

interface AiTweetModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onTweet: (tweet: string) => void; // Function to handle tweeting
}

const AiTweetModal: React.FC<AiTweetModalProps> = ({
  user,
  isOpen,
  onClose,
  onTweet,
}) => {
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGenerate = async () => {
    const response = await generateText(prompt);
    if (response) setAiResponse(response);
  };

  const handleTweet = () => {
    onTweet(aiResponse);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      {user && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="modal-content bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            {/* Modal Header */}
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create AI Tweet</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body text-black mb-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGenerate}
                className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Generate
              </button>
              {aiResponse && (
                <div className="mt-4 p-2 bg-gray-100 rounded">
                  <p className="text-gray-800">{aiResponse}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                onClick={handleTweet}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default AiTweetModal;
