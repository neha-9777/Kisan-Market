import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "vendor" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Simulate registration
    const userData = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      role: form.role
    };

    console.log("Register:", form);
    alert(`Registration successful as ${form.role}!`);

    // Auto-login after registration
    login(userData);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <Input
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
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

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("farmer")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  form.role === "farmer"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                🌾 Farmer
                <div className="text-xs mt-1 opacity-75">Sell my products</div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("vendor")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  form.role === "vendor"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                🛒 Vendor
                <div className="text-xs mt-1 opacity-75">Buy from farmers</div>
              </button>
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <Button text="Register" className="w-full" />
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-green-600 font-bold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;