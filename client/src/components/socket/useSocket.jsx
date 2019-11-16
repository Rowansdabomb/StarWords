import { useEffect, useState } from 'react';

import io from 'socket.io-client';

const port = '4000';


export default function useSocket() {
  const [socket, setSocket] = useState(null);

  const [lastText, setLastText] = useState('');

  useEffect(() => {
    if (socket == null) {
      const newSocket = io(`http://localhost:${port}`);
      setSocket(newSocket);
    } else {
      socket.on('connect', () => {
        socket.emit('join', 'Server Connected to Client');
      });

      socket.on('messages', () => {
        // do nothing
      });

      socket.on('speechData', (data) => {
        const final = null || data.results[0].isFinal;
        if (final === true) {
          const { transcript } = data.results[0].alternatives[0];
          setLastText({ text: `${transcript.charAt(0).toUpperCase() + transcript.slice(1)}.`, speaker: 0 });
        }
      });
    }
  }, [socket]);

  return { socket, lastText };
}
