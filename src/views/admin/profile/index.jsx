import { useEffect, useState } from "react";
import { MdExitToApp } from "react-icons/md";
import axios from "axios";

const ProfileOverview = () => {
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const id = user._id;

  const [dataUser, setdataUser] = useState();
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://103.72.98.164:8800/api/users/${id}`
        );
        setdataUser(response.data); // Cập nhật trạng thái với dữ liệu người dùng
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Xử lý lỗi ở đây, ví dụ: thông báo cho người dùng, cập nhật trạng thái, v.v...
      }
    };
    getData();
  }, [id]);
  const logOut = () => {
    localStorage.removeItem("user");
    alert("Bạn đã đăng xuất");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="navbar-top">
        <div className="title-profile">
          <h1>Profile</h1>
        </div>

        <ul>
          <li>
            <button onClick={() => logOut()}>
              <MdExitToApp className="h-8 w-8" />
            </button>
          </li>
        </ul>
      </div>

      <div className="main">
        <h2>Thông tin chi tiết</h2>
        <div className="card">
          <div className="card-body">
            <i className="fa fa-pen fa-xs edit"></i>
            <table>
              {dataUser && (
                <tbody>
                  <tr>
                    <td>Họ và tên</td>
                    <td>:</td>
                    <td>{dataUser.name}</td>
                  </tr>
                  <tr>
                    <td>Chức vụ</td>
                    <td>:</td>
                    <td>
                      {dataUser.role == "admin"
                        ? "Quản trị viên"
                        : dataUser.role == "mkt"
                        ? "Nhân viên Marketing"
                        : "Nhân viên Sale"}
                    </td>
                  </tr>
                  <tr>
                    <td>Tên tài khoản</td>
                    <td>:</td>
                    <td>{dataUser.username}</td>
                  </tr>
                  <tr>
                    <td>Mật khẩu</td>
                    <td>:</td>
                    <td>
                      <button className="rounded-md bg-[#ffff00] p-2">
                        Quên mật khẩu
                      </button>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileOverview;
