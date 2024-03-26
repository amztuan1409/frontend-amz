import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import axios from "axios";
import * as XLSX from "xlsx"; // Import all exports from 'xlsx'

const { Option } = Select;

const Marketplace = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const getData = async () => {
    try {
      const res = await axios.get("http://103.72.98.164:8800/api/users");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData(); // Gọi ngay lần đầu để không phải chờ
  }, []);

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        switch (role) {
          case "employee":
            return "Nhân viên Sale";
          case "mkt":
            return "Nhân viên Marketing";
          case "admin":
            return "Quản trị viên";
          default:
            return role;
        }
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };
  const onFinish = async (values) => {
    const isPasswordMatch = values.password === values.confirmPassword;

    if (!isPasswordMatch) {
      // Nếu mật khẩu không khớp, hiển thị thông báo lỗi
      message.error("Mật khẩu không khớp!");
      return;
    }

    // Nếu mật khẩu khớp, tạo object requestData và gửi đi như bình thường
    const requestData = {
      username: values.username,
      name: values.name,
      password: values.password,
      role: values.role,
    };
    console.log(requestData);
    try {
      await axios.post("http://103.72.98.164:8800/api/users/register", requestData);
      setIsModalVisible(false);
      getData(); // Cập nhật lại danh sách nhân viên sau khi thêm mới
      message.success("Đã tạo nhân viên mới thành công!");
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu đăng ký:", error);
      message.error("Tên tài khoản nhân viên đã tồn tại ");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>TẤT CẢ NHÂN VIÊN</h1>
        <Button type="primary" onClick={showModal}>
          Tạo nhân viên mới
        </Button>
      </div>
      <Modal
        title="Tạo nhân viên mới"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="createEmployee"
          initialValues={{ remember: true }}
          onFinish={onFinish} // Submit form data here
        >
          <Form.Item
            label="Tên tài khoản"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên tài khoản!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận lại mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Chức vụ"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
          >
            <Select>
              <Option value="employee">Nhân viên Sale</Option>
              <Option value="mkt">Nhân viên Marketing</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default Marketplace;
