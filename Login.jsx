import { useState } from "react";

const API_URL = "http://localhost:8080/api/auth";

function Login() {
    const [isLogin, setIsLogin] = useState(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("SALES");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const endpoint = isLogin ? "/login" : "/register";

        const body = isLogin
            ? {
                username,
                password,
            }
            : {
                username,
                password,
                role,
            };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    typeof data === "string"
                        ? data
                        : "Request failed"
                );
            }

            if (isLogin) {
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.role);
                localStorage.setItem("isLoggedIn", "true");

                alert("Login successful");
            } else {
                alert("Registration successful. Now login.");

                setIsLogin(true);
                setPassword("");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f6f8",
            }}
        >
            <div
                style={{
                    width: "400px",
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center" }}>
                    {isLogin ? "CRM Login" : "CRM Register"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "15px",
                            boxSizing: "border-box",
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "15px",
                            boxSizing: "border-box",
                        }}
                    />

                    {!isLogin && (
                        <select
                            value={role}
                            onChange={(event) =>
                                setRole(event.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "15px",
                            }}
                        >
                            <option value="SALES">SALES</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    )}

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                    }}
                >
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                </p>

                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setUsername("");
                        setPassword("");
                    }}
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: "#e0e0e0",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    {isLogin ? "Create Account" : "Go to Login"}
                </button>
            </div>
        </div>
    );
}

export default Login;