import React, { useState } from 'react';
import { Send } from 'lucide-react';

const AddComment = ({ projectId, onCommentAdded, replyTo, onCancelReply, user }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${projectId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: newComment,
            parent_id: replyTo,
          }),
        }
      );

      if (response.ok) {
        setNewComment('');
        onCommentAdded();
        if (replyTo) onCancelReply();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-grow">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            {replyTo && (
              <button
                type="button"
                onClick={onCancelReply}
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                Cancel Reply
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Send size={16} />
              {replyTo ? 'Post Reply' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddComment; 