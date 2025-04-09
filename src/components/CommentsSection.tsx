import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

interface Comment {
  CommentID: number;
  UID: string;
  CommentText: string;
  Timestamp: string; // Expected to be convertible with new Date()
}

interface CommentsSectionProps {
  eventId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ eventId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Get current user's UID from localStorage and normalize it
  const userUID = (localStorage.getItem("userId") || '').toLowerCase();
  console.log("Fetched userId from LocalStorage for comments: ", userUID);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://155.138.217.239:5000/api/comments/getComments?EventID=${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      } else {
        setMessage('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setMessage('An error occurred while fetching comments');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!newCommentText.trim()) {
      setMessage('Comment cannot be empty');
      return;
    }
    try {
      const response = await fetch('http://155.138.217.239:5000/api/comments/addComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EventID: eventId,
          UID: userUID,
          CommentText: newCommentText
        })
      });
      console.log("Posting comment:", { eventId, userUID, newCommentText });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        fetchComments();
        setNewCommentText('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setMessage('An error occurred while adding comment');
    }
  };

  // Delete an existing comment
  const handleDeleteComment = async (commentID: number) => {
    try {
      const response = await fetch('http://155.138.217.239:5000/api/comments/deleteComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CommentID: commentID,
          UID: userUID
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        fetchComments();
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setMessage('An error occurred while deleting comment');
    }
  };

  // Prepare a comment for editing
  const startEditing = (commentID: number, currentText: string) => {
    setEditingCommentId(commentID);
    setEditingCommentText(currentText);
  };

  // Update an edited comment
  const handleEditComment = async () => {
    if (editingCommentId === null || !editingCommentText.trim()) {
      setMessage('Comment text cannot be empty');
      return;
    }
    try {
      const response = await fetch('http://155.138.217.239:5000/api/comments/editComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CommentID: editingCommentId,
          UID: userUID,
          CommentText: editingCommentText
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        fetchComments();
        setEditingCommentId(null);
        setEditingCommentText('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to update comment');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      setMessage('An error occurred while editing comment');
    }
  };

  return (
    <Box sx={{ marginTop: 4, backgroundColor: '#f8f8f8', padding: 2, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Comments</Typography>
      {message && <Typography variant="body2" color="error">{message}</Typography>}
      
      {/* New Comment Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddComment} sx={{ marginLeft: 1 }}>
          Post
        </Button>
      </Box>
      
      {/* Comments List */}
      {comments.length === 0 ? (
        <Typography variant="body1">No comments yet.</Typography>
      ) : (
        comments.map((comment) => (
          <Box key={comment.CommentID} sx={{ marginBottom: 2, padding: 1, backgroundColor: '#fff', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
              {new Date(comment.Timestamp).toLocaleString()}
            </Typography>
            {editingCommentId === comment.CommentID ? (
              <>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={editingCommentText}
                  onChange={(e) => setEditingCommentText(e.target.value)}
                  sx={{ marginTop: 1, marginBottom: 1 }}
                />
                <Box>
                  <Button variant="contained" onClick={handleEditComment} sx={{ marginRight: 1 }}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => { setEditingCommentId(null); setEditingCommentText(''); }}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ marginTop: 1, marginBottom: 1 }}>
                  {comment.CommentText}
                </Typography>
                {/* Show edit/delete buttons if the comment belongs to the current user */}
                {comment.UID && comment.UID.toLowerCase() === userUID && (
                  <Box>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => startEditing(comment.CommentID, comment.CommentText)} 
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => handleDeleteComment(comment.CommentID)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default CommentsSection;
