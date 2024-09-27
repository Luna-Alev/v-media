import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
    const { username } = useParams();
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

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>{user.username}</h1>
            <h3>{user.first_name} {user.last_name}</h3>
            <p>{user.email}</p>
            <p>{user.birth_date}</p>
            <p>{user.join_date}</p>
        </div>
    );
};

export default Profile;