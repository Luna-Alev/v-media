import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";

const PostFeed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:3001/posts");
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);
    return (
        <div>
            <h2>Posts</h2>
            {posts.map((post) => (
                <Post post={post} />
            ))}
        </div>
    );
};

export default PostFeed;