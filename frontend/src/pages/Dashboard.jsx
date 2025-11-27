import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

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

  const navigate = useNavigate();

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
    if (!newKid.username || !newKid.age)
      return alert("Enter username and age");
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

  const goToPlaylists = (kid) => {
    navigate(`/parent/kid/${kid._id}/playlists`);
  };

  const safeThumbnail = (thumbnail) => thumbnail || "/default-thumbnail.jpg";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Parent Dashboard</h2>

      {/* Add New Kid */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Kid</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            name="username"
            placeholder="Username"
            value={newKid.username}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            placeholder="Password"
            value={newKid.password}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={newKid.age}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createKid}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            Create Kid
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <label key={c} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={newKid.allowedCategories.includes(c)}
                onChange={() => handleCategoryToggle(newKid, c, true)}
                className="w-4 h-4 accent-blue-600"
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Manage Kids */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Manage Kids</h3>
        <div className="space-y-4">
          {kids.map((kid) => (
            <div
              key={kid._id}
              className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="font-semibold">{kid.username} (Age: {kid.age})</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((c) => (
                    <label key={c} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={kid.allowedCategories?.includes(c)}
                        onChange={() => handleCategoryToggle(kid, c)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateKid(kid)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => goToPlaylists(kid)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  View Playlists
                </button>
                <button
                  onClick={() => setSelectedKid(kid)}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                >
                  Show Videos
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          Videos for {selectedKid?.username || ""}
        </h3>
        {videos.length === 0 ? (
          <p>No videos available. Add categories or videos first.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div key={video._id} className="border rounded overflow-hidden">
                <img
                  src={safeThumbnail(video.thumbnail)}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-thumbnail.jpg";
                  }}
                />
                <div className="p-2">
                  <h4 className="font-semibold text-sm">{video.title}</h4>
                  <p className="text-xs text-gray-500">{video.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
