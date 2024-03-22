import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8800/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Lưu token và thông tin người dùng vào Local Storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect đến trang chính hoặc làm bất kỳ điều gì bạn muốn ở đây
        window.location.href = "http://localhost:3000/admin/profile"; // Ví dụ: điều hướng đến trang chính
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-200 font-sans text-gray-900 antialiased">
        <div className="flex h-screen w-full items-center">
          <div className="m-4 w-full rounded bg-white p-8 shadow-lg md:mx-auto md:max-w-sm">
            <span className="mb-4 block w-full text-xl font-bold uppercase">
              Đăng nhập hệ thống
            </span>
            <div className="mb-4">
              <div className="mb-4 md:w-full">
                <label htmlFor="email" className="mb-1 block text-xs">
                  Username
                </label>
                <input
                  className="focus:shadow-outline w-full rounded border p-2 outline-none"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Username or Email"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-6 md:w-full">
                <label htmlFor="password" className="mb-1 block text-xs">
                  Password
                </label>
                <input
                  className="focus:shadow-outline w-full rounded border p-2 outline-none"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="rounded bg-green-500 px-4 py-2 text-sm font-semibold uppercase text-white hover:bg-green-700"
                onClick={handleLogin}
              >
                Đăng Nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
