import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be atleast 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Account created! Welcome");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Create account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start managing your tasks today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-lg border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus: outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                className="w-full px-4 py-2.5 rounded-lg border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus: outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
            </div>

            {/* password */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 rounded-lg border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus: outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••"
                className="w-full px-4 py-2.5 rounded-lg border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus: outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disable:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer flex items-center jsutify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx={12}
                      cy={12}
                      r={10}
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
