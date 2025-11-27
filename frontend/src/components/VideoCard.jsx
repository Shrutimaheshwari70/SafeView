import { useState } from "react";

export default function VideoCard({ video }) {
  const [open, setOpen] = useState(false);

  const getEmbedUrl = (url) => {
    if (url.includes("youtu.be"))
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    if (url.includes("youtube.com/watch"))
      return url.replace("watch?v=", "embed/");
    return url; // For mp4 links
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
      <img
        src={video.thumbnail}
        alt={video.title}
        style={{ width: "100%", height: "120px", objectFit: "cover", cursor: "pointer" }}
        onClick={() => setOpen(true)}
      />
      <h4>{video.title}</h4>
      <p>{video.category}</p>

      {open && (
        <div
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
          onClick={() => setOpen(false)}
        >
          <div style={{ position: "relative", backgroundColor: "#fff", padding: "10px" }}>
            {video.url.includes("youtube.com") || video.url.includes("youtu.be") ? (
              <iframe
                width="560"
                height="315"
                src={getEmbedUrl(video.url)}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <video width="560" controls autoPlay>
                <source src={video.url} type="video/mp4" />
              </video>
            )}
            <button
              onClick={() => setOpen(false)}
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
