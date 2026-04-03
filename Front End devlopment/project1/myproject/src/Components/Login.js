import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setMsg("Login successful. Redirecting...");
        window.location.href = "/profile";
      } else {
        setMsg(data.msg || "Login failed.");
      }
    } catch (err) {
      setMsg("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuccess = msg.toLowerCase().includes("successful");

  return (
    <main className="page">
      <section className="hero-panel login-layout">
        <div className="hero-copy">
          <span className="eyebrow">User Profile Management</span>
          <h1>Manage Identity With a Clean, Modern Dashboard</h1>
          <p>
            Sign in to update your profile, keep account details accurate, and control
            your account actions in one place.
          </p>
          <ul className="feature-list">
            <li>Quick profile edits</li>
            <li>Secure account actions</li>
            <li>Responsive project-ready interface</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="muted">Sign in to continue</p>

          <form onSubmit={handleLogin} className="form-stack">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-input"
              required
            />

            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input"
              required
            />

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Login"}
            </button>
          </form>

          {msg && (
            <p className={isSuccess ? "status-message success" : "status-message error"}>{msg}</p>
          )}

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
