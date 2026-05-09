import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    // Simulate login - in real app, this would be an API call
    // For demo purposes, we'll create a mock user based on email
    const mockUsers = {
      "farmer@example.com": { id: 1, name: "John Farmer", email: "farmer@example.com", role: "farmer" },
      "vendor@example.com": { id: 2, name: "Jane Vendor", email: "vendor@example.com", role: "vendor" }
    };

    const user = mockUsers[form.email];

    if (user) {
      console.log("Login:", form);
      alert(`Login successful as ${user.role}!`);
      login(user);
      navigate("/");
    } else {
      alert("Invalid credentials. Try farmer@example.com or vendor@example.com with any password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Login</h2>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>Farmer:</strong> farmer@example.com</div>
            <div><strong>Vendor:</strong> vendor@example.com</div>
            <div><em>Password: any password</em></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <Button text="Login" className="w-full" />
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <a href="/register" className="text-green-600 font-bold hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;