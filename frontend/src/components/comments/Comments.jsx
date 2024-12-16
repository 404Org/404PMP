import React, { useState, useEffect } from 'react';
import AddComment from './AddComment';
import CommentItem from './CommentItem';

const Comments = ({ projectId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${projectId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdateComment = async (commentId, text) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/comments/${commentId}/replies/${replyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const handleUpdateReply = async (commentId, replyId, text) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/comments/${commentId}/replies/${replyId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  const handleAddReply = async (commentId, text) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/comments/${commentId}/replies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const canModifyComment = (comment) => {
    return user && user._id === comment.user_id;
  };

  const canDeleteComment = (comment) => {
    return user && (
      user._id === comment.user_id ||
      user.role === 'admin' ||
      user.role === 'project_manager'
    );
  };

  const canModifyReply = (reply) => {
    return user && user._id === reply.user_id;
  };

  const canDeleteReply = (reply) => {
    return user && (
      user._id === reply.user_id ||
      user.role === 'admin' ||
      user.role === 'project_manager'
    );
  };

  if (isLoading) {
    return <div className="mt-4 text-center">Loading comments...</div>;
  }

  if (error) {
    return <div className="mt-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      <AddComment
        projectId={projectId}
        onCommentAdded={fetchComments}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        user={user}
      />

      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
              onReply={handleAddReply}
              onDeleteReply={handleDeleteReply}
              onUpdateReply={handleUpdateReply}
              user={user}
              canModify={canModifyComment(comment)}
              canDelete={canDeleteComment(comment)}
              canModifyReply={canModifyReply}
              canDeleteReply={canDeleteReply}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">No comments yet</div>
        )}
      </div>
    </div>
  );
};

export default Comments;
