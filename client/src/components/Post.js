import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";

const Post = ({ post }) => {
    const [ likes, setLikes ] = useState(post.likes);
    const [ liked, setLiked ] = useState(false);

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
        <div>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p>{post.date}</p>
            <Link to={`/profile/${post.username}`}>{post.username}</Link>
            <div>
            <button 
                onClick={likeHandler} 
                style={{
                    backgroundColor: liked ? 'blue' : 'gray', // Change color based on like status
                    color: 'white',
                }}
            >
                {liked ? "Unlike" : "Like"} {likes}
            </button>
            </div>
        </div>
    );
};

export default Post;