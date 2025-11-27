import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "10px 20px", background: "#eee", display: "flex", justifyContent: "space-between" }}>
      <div>
        <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
        {user?.role === "parent" && <Link to="/dashboard" style={{ marginRight: "15px" }}>Dashboard</Link>}
        {user?.role === "kid" && <Link to="/kid/videos" style={{ marginRight: "15px" }}>Videos</Link>}
        {user && <Link to="/my-playlists" style={{ marginRight: "15px" }}>My Playlists</Link>}
      </div>
      <div>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
}
