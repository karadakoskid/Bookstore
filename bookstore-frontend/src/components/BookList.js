import React, { useState } from "react";
import {
  Box, Card, CardContent, CardMedia, Typography, Button, TextField, CardActions
} from "@mui/material";

function BookList({ books, currentUser, onEdit, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const startEdit = (book) => {
    setEditId(book._id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditGenre(book.genre);
    setEditDescription(book.description);
    setEditImageUrl(book.image_url || "");
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    onEdit(id, {
      title: editTitle,
      author: editAuthor,
      genre: editGenre,
      description: editDescription,
      image_url: editImageUrl
    }, () => {
      setEditId(null);
      setEditMessage("");
    }, setEditMessage);
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={3}>
      {books.length === 0 && (
        <Typography>No books yet.</Typography>
      )}
      {books.map(book => (
        <Card key={book._id} sx={{ width: 320, p: 1, position: "relative" }}>
          {editId === book._id ? (
            <Box component="form" onSubmit={e => handleEdit(e, book._id)} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <TextField value={editTitle} onChange={e => setEditTitle(e.target.value)} label="Title" required />
              <TextField value={editAuthor} onChange={e => setEditAuthor(e.target.value)} label="Author" required />
              <TextField value={editGenre} onChange={e => setEditGenre(e.target.value)} label="Genre" required />
              <TextField value={editDescription} onChange={e => setEditDescription(e.target.value)} label="Description" multiline minRows={2} required />
              <TextField value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} label="Image URL" />
              <Box display="flex" gap={1}>
                <Button type="submit" variant="contained" color="success">Save</Button>
                <Button type="button" variant="outlined" onClick={() => setEditId(null)}>Cancel</Button>
              </Box>
              <Typography color="success.main">{editMessage}</Typography>
            </Box>
          ) : (
            <>
              {book.image_url && (
                <CardMedia
                  component="img"
                  height="140"
                  image={book.image_url}
                  alt={book.title}
                />
              )}
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>By:</b> {book.author}<br />
                  <b>Genre:</b> {book.genre}<br />
                  <b>Uploaded by:</b> {book.uploader}<br />
                  <b>Description:</b> {book.description}
                </Typography>
              </CardContent>
              {currentUser === book.uploader && (
                <CardActions>
                  <Button size="small" onClick={() => startEdit(book)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => onDelete(book._id)}>Delete</Button>
                </CardActions>
              )}
            </>
          )}
        </Card>
      ))}
    </Box>
  );
}

export default BookList;
