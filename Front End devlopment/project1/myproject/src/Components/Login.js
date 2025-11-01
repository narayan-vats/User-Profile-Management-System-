import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setMsg("Login successful!");
        window.location.href = "/profile"; // redirect to profile
      } else {
        setMsg(data.msg || "Login failed!");
      }
    } catch (err) {
      setMsg("Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔐 Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button style={styles.btn} type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" },
  form: { display: "flex", flexDirection: "column", width: "300px" },
  input: { margin: "10px 0", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
  btn: { background: "#007bff", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer" },
};

export default Login;
