import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function MyPlaylists() {
  const { kidId } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/parent/kid/${kidId}/playlists-list`);
      setPlaylists(res.data.playlists || []);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching playlists");
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async () => {
    try {
      const res = await API.get(`/parent/kid/${kidId}/videos`);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    if (kidId) {
      loadPlaylists();
      loadVideos();
    }
  }, [kidId]);

  const createPlaylist = async () => {
    if (!newPlaylistName) return alert("Enter playlist name");

    try {
      await API.post(`/parent/kid/${kidId}/playlist-create`, {
        name: newPlaylistName,
        videoIds: [],
      });
      setNewPlaylistName("");
      loadPlaylists();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating playlist");
    }
  };

  const addVideoToPlaylist = async (playlistId, videoId) => {
    try {
      await API.post(`/parent/kid/${kidId}/playlist/${playlistId}/add-video`, {
        videoId,
      });
      loadPlaylists();
      alert("Video added!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding video");
    }
  };

 const deletePlaylist = async (playlistId) => {
  if (!window.confirm("Are you sure you want to delete this playlist?")) return;
  try {
    await API.delete(`/parent/kid/${kidId}/playlist/${playlistId}`);
    alert("Playlist deleted!");
    loadPlaylists();
  } catch (err) {
    alert(err.response?.data?.message || "Error deleting playlist");
  }
};


  if (!kidId) return <p className="p-4">No kid selected.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {playlists.length ? "Playlists" : "No playlists available"}
      </h2>

      {/* Create Playlist */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="New Playlist Name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createPlaylist}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Playlist
        </button>
      </div>

      {/* Existing Playlists */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => setSelectedPlaylist(playlist)}
              className="bg-white border rounded shadow p-4 cursor-pointer hover:shadow-lg transition"
            >
              <h4 className="font-semibold">{playlist.name}</h4>
              <p className="text-sm text-gray-500">{playlist.videos.length} videos</p>
            </div>
          ))}
        </div>
      )}

      {/* Playlist Modal */}
      {selectedPlaylist && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedPlaylist(null)}
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedPlaylist.name}</h3>
              <button
                onClick={() => deletePlaylist(selectedPlaylist._id)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>

            {selectedPlaylist.videos.length === 0 ? (
              <p className="mb-4">No videos in this playlist.</p>
            ) : (
              selectedPlaylist.videos.map((video) => (
                <div
                  key={video._id}
                  className="mb-4 cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <h4 className="font-semibold">{video.title}</h4>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-28 object-cover rounded"
                  />
                </div>
              ))
            )}

            {/* Add Videos */}
            <h4 className="font-semibold mt-4 mb-2">Add Videos:</h4>
            <div className="space-y-2">
              {videos.map((video) => (
                <div key={video._id} className="flex items-center gap-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p>{video.title}</p>
                    <button
                      onClick={() =>
                        addVideoToPlaylist(selectedPlaylist._id, video._id)
                      }
                      className="mt-1 text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                    >
                      Add to Playlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">{selectedVideo.title}</h3>
            {selectedVideo.url.includes("youtube") ||
            selectedVideo.url.includes("youtu.be") ? (
              <iframe
                width="100%"
                height="400"
                src={
                  selectedVideo.url.includes("youtu.be")
                    ? selectedVideo.url.replace(
                        "youtu.be/",
                        "www.youtube.com/embed/"
                      )
                    : selectedVideo.url.replace("watch?v=", "embed/")
                }
                title={selectedVideo.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <video width="100%" height="400" controls>
                <source src={selectedVideo.url} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
