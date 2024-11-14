import React, { useState } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import './Post.css';

const Post = ({ post }) => {
    const [ likes, setLikes ] = useState(post.likes);
    const [ liked, setLiked ] = useState(false);

    const timeAgo = (dateString) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        const units = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 },
        ];
    
        for (let unit of units) {
            const interval = Math.floor(diffInSeconds / unit.seconds);
            if (interval >= 1) {
                return `${interval} ${unit.label}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return "Just now";
    };

    const likeHandler = async (event) => {
        event.preventDefault();

        const newLikes = liked ? likes - 1 : likes + 1;
        setLikes(newLikes);
        setLiked(!liked);

        try {
            await axios.post(`/api/like`, {
                postID: post.ID
            },
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="post">
            <h3>{post.title}</h3>
            <Link to={`/profile/${post.username}`} className="userlink">{post.username}</Link>
            <p>{post.body}</p>
            <p>{timeAgo(post.date)}</p>
            <div>
            <button 
                onClick={likeHandler} 
                className={liked ? "liked fire" : ""}
            >
                {liked ? "Unlike" : "Like"} {likes}
            </button>
            </div>
        </div>
    );
};

export default Post;