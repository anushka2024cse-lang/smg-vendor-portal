import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in both fields.");
            return;
        }

        setIsLoading(true);

        // Mock login delay
        setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard");
        }, 800);
    };

    return (
        <div className="app">
            <div className="login-card">
                <div className="logo">
                    <h1 style={{ color: '#1e3a8a', fontSize: '32px', fontWeight: 'bold' }}>SMG</h1>
                </div>

                <h2 className="welcome">Welcome</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <button
                    type="button"
                    className="forgot"
                    onClick={() => alert("Please contact IT support to reset your password.")}
                >
                    Forgot Password?
                </button>
            </div>
        </div>
    );
}
