import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import UserContext from "../UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from "./Post";

const Profile = () => {
    const { username } = useParams();
    const { userID } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/user/${username}`);
                setUser(response.data[0]);
                const currentUser = await axios.get(`/api/auth-profile`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (currentUser.data[0].username === username) {
                    setIsCurrentUser(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [username]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/post/${username}`);
                setUserPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, [user, username]);

    const followHandler = async () => {
        try {
            await axios.post(`/api/follow`, {
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
                    {isCurrentUser && <Link to="/edit-profile">Edit Profile</Link>}
                    {!isCurrentUser && <Link to={`/chat/${user.username}`}>Message</Link>}
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