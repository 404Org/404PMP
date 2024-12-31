// frontend/src/components/comments/CommentItem.jsx
import React, { useState } from 'react';
import { Reply, Trash2, Edit2, ChevronDown } from 'lucide-react';
import ReplyItem from './ReplyItem';

const CommentItem = ({
  comment,
  onDelete,
  onUpdate,
  onReply,
  onDeleteReply,
  onUpdateReply,
  user,
  canModify,
  canDelete,
  canModifyReply,
  canDeleteReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [displayedReplies, setDisplayedReplies] = useState(5);

  const handleUpdate = async () => {
    await onUpdate(comment._id, editText);
    setIsEditing(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    await onReply(comment._id, newReply);
    setNewReply('');
  };

  const handleShowMoreReplies = () => {
    setDisplayedReplies(prev => prev + 5);
  };

  // Calculate visible replies and if there are more
  const visibleReplies = comment.replies?.slice(0, displayedReplies) || [];
  const hasMoreReplies = comment.replies?.length > displayedReplies;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white">
            {comment.user_name?.charAt(0).toUpperCase()}{comment.user_name?.charAt(1).toUpperCase()}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{comment.user_name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
            {(canModify || canDelete) && (
              <div className="flex gap-2">
                {canModify && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(comment._id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2">{comment.text}</p>
          )}

          <div className="mt-2">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
            >
              <Reply size={16} />
              Replies {comment.replies?.length > 0 && `(${comment.replies.length})`}
            </button>
          </div>

          {/* Replies Section */}
          {showReplies && (
            <div className="mt-4">
              {/* Reply Input Form */}
              <form onSubmit={handleReplySubmit} className="mb-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Reply
                  </button>
                </div>
              </form>

              {/* Replies List */}
              <div className="max-h-80 overflow-y-auto space-y-2">
                {visibleReplies.map((reply) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    onDelete={(replyId) => onDeleteReply(comment._id, replyId)}
                    onUpdate={(replyId, text) => onUpdateReply(comment._id, replyId, text)}
                    user={user}
                    canModify={canModifyReply(reply)}
                    canDelete={canDeleteReply(reply)}
                  />
                ))}
              </div>

              {/* Show More Button */}
              {hasMoreReplies && (
                <button
                  onClick={handleShowMoreReplies}
                  className="mt-2 text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                >
                  <ChevronDown size={16} />
                  Show More Replies
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;