import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePlaylist() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const create = async () => {
    if (!name) return alert("Enter playlist name");
    try {
      await API.post("/playlists", { name });
      navigate("/my-playlists");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating playlist");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Playlist</h2>
      <input placeholder="Playlist Name" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={create}>Create</button>
    </div>
  );
}
