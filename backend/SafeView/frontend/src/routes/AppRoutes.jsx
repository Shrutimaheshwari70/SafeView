  // src/routes/AppRoutes.jsx
  import { useEffect, useState } from "react";
  import { Routes, Route, Navigate } from "react-router-dom";
  import API from "../api/axios";

  import Dashboard from "../pages/Dashboard";
  import KidProfile from "../pages/KidProfile";
  import Videos from "../pages/Videos";
  import AddVideo from "../pages/AddVideo";
  import MyPlaylists from "../pages/MyPlaylists";
  import CreatePlaylist from "../pages/CreatePlaylist";
  import Auth from "../pages/Login";
  import Register from "../pages/Register";

  export default function AppRoutes() {
    const [firstKidId, setFirstKidId] = useState(null);

    useEffect(() => {
      const loadKids = async () => {
        try {
          const res = await API.get("/parent/kids"); // backend endpoint
          if (res.data.kids && res.data.kids.length > 0) {
            setFirstKidId(res.data.kids[0]._id); // first kid
          }
        } catch (err) {
          console.error("Error fetching kids:", err);
        }
      };
      loadKids();
    }, []);

    return (
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Auth isLogin={true} />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard & Kids */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kid/:kidId" element={<KidProfile />} />
        <Route path="/kid/:kidId/videos" element={<Videos />} />
        <Route path="/add-video" element={<AddVideo />} />
        <Route path="/kid/:kidId/playlists" element={<MyPlaylists />} />
        <Route path="/create-playlist" element={<CreatePlaylist />} />
          <Route path="/parent/kid/:kidId/playlists" element={<MyPlaylists />} />

        {/* Redirect /my-playlists to first kid */}
   <Route
  path="/my-playlists"
  element={
    firstKidId === null ? (
      <p>Loading...</p>
    ) : firstKidId ? (
      <Navigate to={`/kid/${firstKidId}/playlists`} replace />
    ) : (
      <p>No kid available.</p>
    )
  }
/>


        {/* Catch-all 404 */}
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    );
  }
