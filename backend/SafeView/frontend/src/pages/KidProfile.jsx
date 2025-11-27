import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ParentDashboard() {
  const [kids, setKids] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [videos, setVideos] = useState([]);
  const [newKid, setNewKid] = useState({
    username: "",
    password: "",
    age: "",
    allowedCategories: [],
  });

  const [activeVideo, setActiveVideo] = useState(null); // For modal

  const categories = [
    "Sports",
    "Gaming",
    "News",
    "Comedy",
    "Music",
    "Podcast",
    "Documentary",
    "Education",
  ];

  // Load kids
  const loadKids = async () => {
    try {
      const res = await API.get("/parent/kids");
      const kidsData = res.data.kids || [];
      setKids(kidsData);
      if (kidsData.length > 0) setSelectedKid(kidsData[0]);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching kids");
    }
  };

  // Load videos
  const loadVideos = async (kid) => {
    if (!kid) return;
    try {
      const res = await API.get(`/parent/kid/${kid._id}/videos`);
      setVideos(res.data.videos || []);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching videos");
    }
  };

  useEffect(() => {
    loadKids();
  }, []);

  useEffect(() => {
    loadVideos(selectedKid);
  }, [selectedKid]);

  const handleChange = (e) =>
    setNewKid({ ...newKid, [e.target.name]: e.target.value });

  const handleCategoryToggle = (kidOrNew, category, isNew = false) => {
    const arr = kidOrNew.allowedCategories || [];
    const updated = arr.includes(category)
      ? arr.filter((c) => c !== category)
      : [...arr, category];

    if (isNew) setNewKid({ ...newKid, allowedCategories: updated });
    else
      setKids(
        kids.map((k) =>
          k._id === kidOrNew._id ? { ...k, allowedCategories: updated } : k
        )
      );
  };

  const createKid = async () => {
    if (!newKid.username || !newKid.age) return alert("Enter username and age");
    try {
      await API.post("/parent/kid", newKid);
      setNewKid({ username: "", password: "", age: "", allowedCategories: [] });
      loadKids();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating kid");
    }
  };

  const updateKid = async (kid) => {
    try {
      await API.patch(`/parent/kid/${kid._id}/categories`, {
        categories: kid.allowedCategories,
      });
      alert("Updated successfully");
      if (kid._id === selectedKid?._id) setSelectedKid({ ...kid });
    } catch (err) {
      alert(err.response?.data?.message || "Error updating kid");
    }
  };

  const openVideo = (video) => setActiveVideo(video);
  const closeVideo = () => setActiveVideo(null);

  const getEmbedUrl = (url) => {
    if (url.includes("youtu.be")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    if (url.includes("youtube.com/watch")) return url.replace("watch?v=", "embed/");
    return url; // For mp4 links
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Parent Dashboard</h2>

      {/* Add New Kid */}
      <h3>Add New Kid</h3>
      <input name="username" placeholder="Username" value={newKid.username} onChange={handleChange} />
      <input name="password" placeholder="Password" value={newKid.password} onChange={handleChange} />
      <input name="age" type="number" placeholder="Age" value={newKid.age} onChange={handleChange} />
      <div>
        {categories.map((c) => (
          <label key={c} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={newKid.allowedCategories.includes(c)}
              onChange={() => handleCategoryToggle(newKid, c, true)}
            />
            {c}
          </label>
        ))}
      </div>
      <button onClick={createKid}>Create Kid</button>

      {/* Manage Kids */}
      <h3>Manage Kids</h3>
      {kids.map((kid) => (
        <div key={kid._id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
          <p>{kid.username} (Age: {kid.age})</p>
          <div>
            {categories.map((c) => (
              <label key={c} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={kid.allowedCategories?.includes(c)}
                  onChange={() => handleCategoryToggle(kid, c)}
                />
                {c}
              </label>
            ))}
          </div>
          <button onClick={() => updateKid(kid)}>Save</button>
          <button style={{ marginLeft: "10px" }} onClick={() => setSelectedKid(kid)}>Show Videos</button>
        </div>
      ))}

      {/* Videos */}
      <h3>Videos for {selectedKid?.username || ""}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {videos.length === 0 ? (
          <p>No videos available.</p>
        ) : (
          videos.map((video) => (
            <div
              key={video._id}
              style={{
                border: "1px solid #ccc",
                width: "200px",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => openVideo(video)}
            >
              <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
              <h4>{video.title}</h4>
              <p>{video.category}</p>
            </div>
          ))
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          onClick={closeVideo}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", backgroundColor: "#fff", padding: "10px" }}
          >
            {activeVideo.url.includes("youtube.com") || activeVideo.url.includes("youtu.be") ? (
              <iframe
                width="560"
                height="315"
                src={getEmbedUrl(activeVideo.url)}
                title={activeVideo.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <video width="560" controls autoPlay>
                <source src={activeVideo.url} type="video/mp4" />
              </video>
            )}
            <button
              onClick={closeVideo}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
