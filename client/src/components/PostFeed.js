import React, { useEffect, useState } from "react";
import axios from "axios";

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
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                    <p>{post.date}</p>
                    <p>{post.username}</p>
                </div>
            ))}
        </div>
    );
};

export default PostFeed;