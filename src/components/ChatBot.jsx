import React, { useState } from "react";
import { Box, IconButton, TextField, Typography, Paper, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      console.log("Sending message to server:", input);
      const response = await axios.post("http://127.0.0.1:5000/paraphrase", {
        question: input,
      });

      console.log("Received response from server:", response.data);
      const botMessage = { sender: "bot", text: response.data.paraphrases[0] };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput(""); // Limpiar el cuadro de entrada después de enviar el mensaje
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
      <IconButton color="primary" onClick={handleToggleChat} sx={{ backgroundColor: "white", boxShadow: 3 }}>
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </IconButton>
      {isOpen && (
        <Paper elevation={3} sx={{ width: 320, height: 480, backgroundColor: "#f9f9f9", borderRadius: 2, p: 2, mt: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
            Asistencia al Cliente
          </Typography>
          <Box sx={{ flex: 1, overflowY: "auto", mb: 1, p: 1, backgroundColor: "#fff", borderRadius: 1 }}>
            {messages.map((message, index) => (
              <Box key={index} sx={{ mb: 1, textAlign: message.sender === "user" ? "right" : "left" }}>
                <Typography variant="body2" sx={{ display: "inline-block", backgroundColor: message.sender === "user" ? "#e0f7fa" : "#e0e0e0", borderRadius: 1, p: 1, maxWidth: "80%" }}>
                  {message.text}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={input}
              onChange={handleInputChange}
              placeholder="Escribe un mensaje..."
              sx={{ mr: 1 }}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleClearChat}
            sx={{ mt: 2 }}
          >
            Eliminar Chat
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ChatBot;