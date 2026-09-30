import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OfficerLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    username: username,
                    password: password
                }
            );

            localStorage.setItem(
                "officerToken",
                response.data.token
            );

            navigate("/officer");

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <h1>JanSaathi</h1>

            <h2>Officer Login</h2>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Username:</label>

                    <br />

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        placeholder="Enter username"
                    />
                </div>

                <br />

                <div>
                    <label>Password:</label>

                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                    />
                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
}

export default OfficerLogin;