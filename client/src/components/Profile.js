import React, { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
    const { username } = useParams();
    const { userID } = useContext(UserContext);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/user/${username}`);
                setUser(response.data[0]);
                console.log(response.data[0]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [username]);

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
    );
};

export default Profile;