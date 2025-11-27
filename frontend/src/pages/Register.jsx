import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [input, setInput] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      await API.post("/auth/signup", { 
        name: input.username, 
        email: input.username, 
        password: input.password 
      });
      alert("Parent account created!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Parent Signup</h1>

        <input
          placeholder="Username or Email"
          name="username"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already registered?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
