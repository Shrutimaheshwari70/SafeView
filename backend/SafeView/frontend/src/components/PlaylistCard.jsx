export default function PlaylistCard({ playlist }) {
  return (
    <div style={{ width: "250px", border: "1px solid #ccc", padding: "10px" }}>
      <img src={playlist.thumbnail} alt={playlist.title} style={{ width: "100%" }} />
      <h4>{playlist.title}</h4>
      <p>{playlist.category}</p>
      <a href={playlist.url} target="_blank">Watch</a>
    </div>
  );
}
