import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState("newest");

    const handleSort = (e) => {
        setSort(e.target.value);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/post?sort=${sort}`);
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, [sort]);

    if (!posts) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <form>
                    <select value={sort} onChange={handleSort}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Popular</option>
                    </select>
                </form>
            </div>
            <h2>Posts</h2>
            {posts.map((post) => (
                <Post post={post} />
            ))}
        </div>
    );
};

export default PostFeed;