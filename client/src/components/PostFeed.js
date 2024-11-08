import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSort = (e) => {
        setSort(e.target.value);
        setPage(1);
        setPosts([]);
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/post`, {
                params: { sort, page }
            }); // Note to self: This needs user to be passed in the params to know if the user has liked the post already. If you see this on GitHub, here's a cookie 🍪.
            if (page === 1) {
                setPosts(response.data);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...response.data]);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        fetchPosts();
    }, [sort, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10 && !loading) {
                setPage((prevPage) => prevPage + 1);
            }
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

    if (!posts) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Posts</h2>
            <div>
                <form>
                    <label>Sort by:</label>
                    <select value={sort} onChange={handleSort}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Popular</option>
                    </select>
                </form>
            </div>
            
            {posts.map((post) => (
                <Post post={post} />
            ))}

            {loading && <p>Loading more posts</p>}
        </div>
    );
};

export default PostFeed;