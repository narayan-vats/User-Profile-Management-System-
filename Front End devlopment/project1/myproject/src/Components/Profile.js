import { useEffect, useMemo, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/profile/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData({ name: data.name || "", email: data.email || "" });
      })
      .catch((err) => {
        console.error(err);
        setStatus("Unable to load profile data.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdate = async () => {
    setStatus("");
    const res = await fetch("http://localhost:5000/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data?.user) {
      setUser(data.user);
      setEditMode(false);
      setStatus("Profile updated successfully.");
    } else {
      setStatus(data?.msg || "Profile update failed.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    await fetch("http://localhost:5000/api/profile/delete", {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  if (loading) {
    return (
      <main className="page">
        <section className="profile-shell">
          <p className="muted">Loading profile...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page">
        <section className="profile-shell">
          <p className="status-message error">Could not load user profile.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="profile-shell">
        <header className="profile-header">
          <div className="avatar">{initials}</div>
          <div>
            <span className="eyebrow">Account Dashboard</span>
            <h1>{user.name}</h1>
            <p className="muted">{user.email}</p>
          </div>
        </header>

        <div className="profile-card">
          <div className="card-title-row">
            <h2>Profile Information</h2>
            {!editMode && (
              <button onClick={() => setEditMode(true)} className="btn btn-primary">
                Edit Profile
              </button>
            )}
          </div>

          {editMode ? (
            <div className="form-grid">
              <div>
                <label htmlFor="name" className="field-label">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-input"
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="field-label">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-input"
                />
              </div>

              <div className="action-row">
                <button onClick={handleUpdate} className="btn btn-primary">
                  Save Changes
                </button>
                <button onClick={() => setEditMode(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <dl className="info-grid">
              <div>
                <dt>Name</dt>
                <dd>{user.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
            </dl>
          )}

          {status && <p className="status-message success">{status}</p>}
        </div>

        <div className="danger-zone">
          <h3>Account Actions</h3>
          <div className="action-row">
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
