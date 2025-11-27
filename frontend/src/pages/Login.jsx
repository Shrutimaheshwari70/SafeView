// src/pages/Auth.jsx
import { useState } from "react";
import API from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Auth({ isLogin = true }) {
  const [input, setInput] = useState({ name: "", identifier: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setInput({ ...input, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      let res;
      if (isLogin) {
        res = await API.post("/auth/login", {
          identifier: input.identifier,
          password: input.password,
        });
      } else {
        res = await API.post("/auth/signup", {
          name: input.name,
          email: input.identifier,
          password: input.password,
        });
      }

      const userData = res.data.user || res.data;
      const token = res.data.token;

      login({ user: userData, token });

      if (userData.role === "parent") navigate("/dashboard");
      else navigate("/kid/videos");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="authBox bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">{isLogin ? "Login" : "Register"}</h1>

        {!isLogin && (
          <input
            placeholder="Name"
            name="name"
            value={input.name}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <input
          placeholder={isLogin ? "Email or Username" : "Email"}
          name="identifier"
          value={input.identifier}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          placeholder="Password"
          type="password"
          name="password"
          value={input.password}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={submit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? (
            <>New? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></>
          ) : (
            <>Already have account? <Link to="/" className="text-blue-600 hover:underline">Login</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
