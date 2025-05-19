'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types';

const wsUrl = 'ws://localhost:8080';

export default function WsMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  const socketRef = useRef<WebSocket>(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setConnectionStatus('Connected');
      // ws.send('hi from client');
    };
    ws.onmessage = (event) => {
      // console.log('Message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error('WebSocket onmessage error:', error);
      }
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setConnectionStatus('Disconnected');
    };
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      console.log('Closing WebSocket connection');
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  // Function to send messages
  const sendMessage = useCallback(() => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      inputMessage.trim() !== ''
    ) {
      // Create a message object
      const messageObj = {
        type: 'message',
        text: inputMessage,
        timestamp: new Date().toISOString()
      };

      // Send as JSON string
      socketRef.current.send(JSON.stringify(messageObj));

      // Clear input field after sending
      setInputMessage('');
    }
  }, [inputMessage]);

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div className="websocket-container">
        <p>WsMessages!!</p>
        <div className="status-bar">
          Status: <span className={`status-${connectionStatus.toLowerCase()}`}>{connectionStatus}</span>
        </div>

        <div className="message-container">
          {messages.length === 0 ? (
            <div className="no-messages">No messages yet</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="message">
                <div className="message-text">{msg.text}</div>
                {msg.timestamp && (
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={connectionStatus !== 'Connected'}
          />
          <button
            onClick={sendMessage}
            disabled={connectionStatus !== 'Connected' || inputMessage.trim() === ''}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}