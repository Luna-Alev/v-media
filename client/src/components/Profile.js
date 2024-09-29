import React, { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from "./Post";

const Profile = () => {
    const { username } = useParams();
    const { userID } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/user/${username}`);
                setUser(response.data[0]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [username]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/post/${username}`);
                setUserPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, [user, username]);

    const followHandler = async () => {
        try {
            await axios.post(`http://localhost:3001/follow`, {
                follower: userID,
                followee: user.username
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <div>
                <div>
                    <h1>{user.username}</h1>
                    <h3>{user.first_name} {user.last_name}</h3>
                    <p>{user.email}</p>
                    <p>{user.birth_date}</p>
                    <p>{user.join_date}</p>
                </div>
                <form onSubmit={followHandler}>
                    <button>
                        Follow
                    </button>
                </form>
            </div>
            <div>
                <h2>Posts</h2>
                {userPosts.map((post) => (
                    <Post post={post} />
                ))}
            </div>
        </div>
    );
};

export default Profile;