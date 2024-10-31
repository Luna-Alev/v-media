import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from 'axios';
import UserContext from '../UserContext';

const Chat = ({}) => {
    const { recipient } = useParams();
    const { username } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:8080', {
            transports: ['websocket']
        });

        console.log('Connected to server', username);
        socket.current.emit('login', username);


        socket.current.on('private_message', ({ from, content }) => {
            if (from === recipient) {
                setChat(prev => [...prev, { from: from, time: new Date(), content }]);
            }
            
        });

        return () => socket.current.disconnect();
    }, [username]);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await axios.get(`/api/chat/${recipient}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setChat(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchChat();
    }, [recipient]);

    const sendMessage = () => {
        socket.current.emit('private_message', {
            from: username,
            to: recipient,
            time: new Date(),
            content: message
        });
        setChat(prev => [...prev, { from: username, time: new Date(), content: message }]);
        setMessage('');
    };

    return (
        <div>
            <h3>Chat with {recipient}</h3>
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
                    {chat.map((msg, index) => (
                        <p key={index}>
                            {msg.from === username ? "You" : `From ${msg.from}`} at {new Date(msg.time).toLocaleString()}: {msg.content}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Chat;