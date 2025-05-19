'use client'

import React, { useState, useEffect } from 'react';

const wsUrl = 'ws://localhost:4000';

export default function WsMessages() {
  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      ws.send('Hello, WebSocket!');
    };
    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <p>WsMessages!!</p>
    </div>
  );
}