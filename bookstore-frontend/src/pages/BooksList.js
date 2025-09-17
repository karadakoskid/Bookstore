import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Card, CardMedia, CardContent, CardActions, TextField, Paper } from "@mui/material";
import API from "../api";

function BooksList({ user }) {
  const [books, setBooks] = useState([]);
  const [adding, setAdding] = useState(false);

  // For adding new book
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [addMsg, setAddMsg] = useState("");

  // For editing book
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editMsg, setEditMsg] = useState("");

  const fetchBooks = () => {
    API.get("/books")
      .then(res => setBooks(res.data))
      .catch(() => setBooks([]));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await API.post("/books", {
        title,
        author,
        genre,
        description,
        image_url: imageUrl
      });
      setAddMsg("Book added successfully!");
      setTitle("");
      setAuthor("");
      setGenre("");
      setDescription("");
      setImageUrl("");
      fetchBooks();
    } catch (err) {
      setAddMsg(err.response?.data?.error || "Error adding book");
    }
  };

  const openEdit = (book) => {
    setEditId(book._id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditGenre(book.genre);
    setEditDescription(book.description);
    setEditImageUrl(book.image_url || "");
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/books/${editId}`, {
        title: editTitle,
        author: editAuthor,
        genre: editGenre,
        description: editDescription,
        image_url: editImageUrl
      });
      setEditMsg("Updated!");
      setEditId(null);
      fetchBooks();
    } catch (err) {
      setEditMsg(err.response?.data?.error || "Error updating book");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await API.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting book");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">All Books</Typography>
        {user && (
          <Button variant="contained" color="success" onClick={() => setAdding(a => !a)}>
            {adding ? "Cancel" : "Add Book"}
          </Button>
        )}
      </Box>
      {adding && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add a Book</Typography>
          <Box component="form" onSubmit={handleAddBook} display="flex" flexDirection="column" gap={2}>
            <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <TextField label="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
            <TextField label="Genre" value={genre} onChange={e => setGenre(e.target.value)} required />
            <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} multiline minRows={2} required />
            <TextField label="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            <Button type="submit" variant="contained" color="primary">Add Book</Button>
            <Typography color={addMsg.startsWith("Book added") ? "success.main" : "error"}>{addMsg}</Typography>
          </Box>
        </Paper>
      )}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {books.length === 0 && <Typography>No books yet.</Typography>}
        {books.map(book => (
          <Card key={book._id} sx={{ width: 320, p: 1, position: "relative" }}>
            {editId === book._id ? (
              <Box component="form" onSubmit={handleEditBook} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField value={editTitle} onChange={e => setEditTitle(e.target.value)} label="Title" required />
                <TextField value={editAuthor} onChange={e => setEditAuthor(e.target.value)} label="Author" required />
                <TextField value={editGenre} onChange={e => setEditGenre(e.target.value)} label="Genre" required />
                <TextField value={editDescription} onChange={e => setEditDescription(e.target.value)} label="Description" multiline minRows={2} required />
                <TextField value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} label="Image URL" />
                <Box display="flex" gap={1}>
                  <Button type="submit" variant="contained" color="success">Save</Button>
                  <Button type="button" variant="outlined" onClick={() => setEditId(null)}>Cancel</Button>
                </Box>
                <Typography color="success.main">{editMsg}</Typography>
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
                    <b>Uploader:</b> {book.uploader}<br />
                    <b>Description:</b> {book.description}
                  </Typography>
                </CardContent>
                {user === book.uploader && (
                  <CardActions>
                    <Button size="small" onClick={() => openEdit(book)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(book._id)}>Delete</Button>
                  </CardActions>
                )}
              </>
            )}
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default BooksList;
