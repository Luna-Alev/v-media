import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from "socket.io-client";
import UserContext from '../UserContext';

const Chat = ({}) => {
    const { userID } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:8080', {
            transports: ['websocket']
        });

        console.log('Connected to server', userID);
        socket.current.emit('login', userID);


        socket.current.on('private_message', ({ from, content }) => {
            setChat(prev => [...prev, `From ${from}: ${content}`]);
        });

        return () => socket.current.disconnect();
    });

    const sendMessage = () => {
        socket.current.emit('private_message', {
            from: userID,
            to: recipientId,
            content: message
        });
        setChat(prev => [...prev, `To ${recipientId}: ${message}`]);
        setMessage('');
    };

    return (
        <div>
            <h3>Chat with User {recipientId}</h3>
            <input
                type="text"
                placeholder="Recipient User ID"
                value={recipientId}
                onChange={e => setRecipientId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                <h4>Chat Log</h4>
                <div>
                    {chat.map((msg, index) => <p key={index}>{msg}</p>)}
                </div>
            </div>
        </div>
    );
};

export default Chat;