// frontend/src/components/comments/ReplyItem.jsx
import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';

const ReplyItem = ({ reply, onDelete, onUpdate, user, canModify, canDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.text);

  const handleUpdate = async () => {
    await onUpdate(reply.id, editText);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm">
            {reply.user_name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">{reply.user_name}</h4>
              <p className="text-xs text-gray-500">
                {new Date(reply.created_at).toLocaleDateString()}
              </p>
            </div>
            {(canModify || canDelete) && (
              <div className="flex gap-2">
                {canModify && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(reply.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={14} />
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
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows="2"
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
                >
                  Update
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm">{reply.text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;