import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";

export default function Videos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        // Agar public folder me videos.json hai
        const res = await fetch("/videos.json");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        alert("Error loading videos");
      }
    };
    loadVideos();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Videos</h2>
      {videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
