import React, { useContext } from "react";
import UserContext from "../UserContext";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";

const Post = ({ post }) => {
    const { userID } = useContext(UserContext);

    const likeHandler = async () => {
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
            <form onSubmit={likeHandler}>
                <button>
                    Like {post.likes}
                </button>
            </form>
        </div>
    );
};

export default Post;