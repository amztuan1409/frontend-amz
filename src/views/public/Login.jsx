import React, { useState } from 'react';
import { notification } from 'antd'; // Nhập notification từ Ant Design

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://103.72.98.164:8800/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/admin/profile';
      } else {
        // Sử dụng notification để báo lỗi đăng nhập
        notification.error({
          message: 'Đăng nhập thất bại',
          description: 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      // Cũng hiển thị thông báo nếu có lỗi kỹ thuật
      notification.error({
        message: 'Lỗi đăng nhập',
        description: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <>
      <div className='bg-gray-200 font-sans text-gray-900 antialiased'>
        <div className='flex h-screen w-full items-center'>
          <div className='m-4 w-full rounded bg-white p-8 shadow-lg md:mx-auto md:max-w-sm'>
            <form onSubmit={handleLogin}>
              <span className='mb-4 block w-full text-xl font-bold uppercase'>
                Đăng nhập hệ thống
              </span>
              <div className='mb-4'>
                <div className='mb-4 md:w-full'>
                  <label htmlFor='email' className='mb-1 block text-xs'>
                    Username
                  </label>
                  <input
                    className='focus:shadow-outline w-full rounded border p-2 outline-none'
                    type='text'
                    name='email'
                    id='email'
                    placeholder='Username or Email'
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className='mb-6 md:w-full'>
                  <label htmlFor='password' className='mb-1 block text-xs'>
                    Password
                  </label>
                  <input
                    className='focus:shadow-outline w-full rounded border p-2 outline-none'
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type='submit'
                  className='rounded bg-green-500 px-4 py-2 text-sm font-semibold uppercase text-white hover:bg-green-700'
                >
                  Đăng Nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
