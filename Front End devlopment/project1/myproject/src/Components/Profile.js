import { useState, useEffect } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const token = localStorage.getItem("token");

  // Fetch user info when page loads
  useEffect(() => {
    fetch("http://localhost:5000/api/profile/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData({ name: data.name, email: data.email });
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Update profile
  const handleUpdate = async () => {
    const res = await fetch("http://localhost:5000/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setUser(data.user);
    setEditMode(false);
  };

  // Delete profile
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    await fetch("http://localhost:5000/api/profile/delete", {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div style={styles.container}>
      <h2>👤 Welcome, {user.name}</h2>
      <p><b>Email:</b> {user.email}</p>

      {editMode ? (
        <div style={styles.form}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleUpdate} style={styles.btn}>Save Changes</button>
          <button onClick={() => setEditMode(false)} style={styles.cancelBtn}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setEditMode(true)} style={styles.btn}>Edit Profile</button>
      )}

      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      <button onClick={handleDelete} style={styles.deleteBtn}>Delete Account</button>
    </div>
  );
}

const styles = {
  container: { marginTop: "50px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" },
  input: { margin: "10px 0", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "250px" },
  btn: { background: "#28a745", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  cancelBtn: { background: "#ffc107", marginLeft: "10px", color: "black", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  logoutBtn: { background: "#007bff", marginTop: "20px", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  deleteBtn: { background: "#dc3545", marginTop: "10px", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
};

export default Profile;
