import { useState } from "react";
import API from "../api/axios";

export default function AddVideo() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Sports","Gaming","News","Comedy","Music","Podcast","Documentary","Education"];

  const add = async () => {
    if (!title || !url || !category) return alert("Fill all fields");
    try {
      await API.post("/videos", { title, url, category });
      setTitle(""); setUrl(""); setCategory("");
      alert("Video added");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding video");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Video</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Video URL" value={url} onChange={e => setUrl(e.target.value)} />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button onClick={add}>Add Video</button>
    </div>
  );
}
