import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setMsg("Registration successful. Redirecting...");
        window.location.href = "/profile";
      } else {
        setMsg(data.msg || "Registration failed.");
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
          <span className="eyebrow">Create Your Account</span>
          <h1>Register Once and Start Managing Your Profile</h1>
          <p>
            Set up your account to access the profile dashboard, update personal
            details, and manage your information from a single place.
          </p>
          <ul className="feature-list">
            <li>Fast account creation</li>
            <li>Immediate profile access</li>
            <li>Same responsive experience across devices</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="muted">Register to continue</p>

          <form onSubmit={handleRegister} className="form-stack">
            <div>
              <label htmlFor="name" className="field-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-input"
                required
              />
            </div>

            <div>
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
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-input"
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
          </form>

          {msg && (
            <p className={isSuccess ? "status-message success" : "status-message error"}>{msg}</p>
          )}

          <p className="auth-switch">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
