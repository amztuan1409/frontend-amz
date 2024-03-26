import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Switch,
  Row,
  Col,
  notification,
} from "antd";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
const Tables = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://103.72.98.164:8800/api/expenses"); // Thay đổi URL API của bạn
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchExpenses();
  }, []);
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => text && new Date(text).toLocaleDateString("vi-VN"), // Chuyển đổi chuỗi ngày thành định dạng ngày tháng theo địa phương (ví dụ: Việt Nam)
    },
    {
      title: "Limousine AMZ",
      dataIndex: "limousineAMZ",
      key: "limousineAMZ",
      render: (value) => value.toLocaleString("vi-VN") + " VND", // Định dạng số tiền theo Việt Nam
    },
    {
      title: "Phòng SGDL",
      dataIndex: "roomSGDL",
      key: "roomSGDL",
      render: (value) => value.toLocaleString("vi-VN") + " VND",
    },
    {
      title: "Phòng Dự Phòng",
      dataIndex: "roomBackup",
      key: "roomBackup",
      render: (value) => value.toLocaleString("vi-VN") + " VND",
    },
    {
      title: "Limousine Dự Phòng",
      dataIndex: "limousineBackup",
      key: "limousineBackup",
      render: (value) => value.toLocaleString("vi-VN") + " VND",
    },
    {
      title: "Google Ads",
      dataIndex: "ggAds",
      key: "ggAds",
      render: (value) => value.toLocaleString("vi-VN") + " VND",
    },
    {
      title: "Tiktok/Zalo Ads",
      dataIndex: "tiktokZaloAds",
      key: "tiktokZaloAds",
      render: (value) => value.toLocaleString("vi-VN") + " VND",
    },
    {
      title: "Tổng Chi Phí Quảng Cáo",
      dataIndex: "totalAds",
      key: "totalAds",
      render: (value) => value.toLocaleString("vi-VN") + " VND",
    },
    {
      title: "Chi Phí Nhân Sự Trung Bình",
      dataIndex: "avStaffCost",
      key: "avStaffCost",
      render: (value) => value.toLocaleString("vi-VN") + " VND",
    },
    {
      title: "Tỷ Lệ Lợi Nhuận Trung Bình",
      dataIndex: "profitRateAvg",
      key: "profitRateAvg",
      render: (value) => `${value.toFixed(2)}%`,
    },
  ];
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    console.log(values.date);
    try {
      const formattedValues = {
        ...values,
        date: moment().toISOString(), // Gửi ngày hiện tại dưới dạng chuỗi ISO
        limousineAMZ: Number(values.limousineAMZ),
        roomSGDL: Number(values.roomSGDL),
        roomBackup: Number(values.roomBackup),
        limousineBackup: Number(values.limousineBackup),
        ggAds: Number(values.ggAds),
        tiktokZaloAds: Number(values.tiktokZaloAds),
        // Bỏ qua avStaffCost, profitRateAvg, totalAds, và reportId
      };

      await axios.post(
        "http://103.72.98.164:8800/api/expenses/create",
        formattedValues,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      notification.success({ message: "Chi tiêu được tạo thành công!" });
      setIsModalVisible(false);
      form.resetFields();
      fetchExpenses(); // Reload the expenses data
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra khi tạo chi tiêu." });
      console.error("Error creating expense:", error);
    }
  };

  // Function to handle modal cancellation
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  return (
    <>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-[30px] font-bold text-[#ff0000]">Chi tiêu ADS</h1>
        <Button type="primary" onClick={showModal}>
          Tạo chi tiêu
        </Button>
      </div>
      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={expenses}
        loading={loading}
      />
      <Modal
        title="Tạo chi tiêu quảng cáo"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="date" type="date" label="Ngày">
            <DatePicker
              style={{ width: "100%" }}
              defaultValue={dayjs()}
              disabled
            />
          </Form.Item>
          <Form.Item name="limousineAMZ" label="Limousine AMZ" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="roomSGDL" label="Phòng SGDL" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="roomBackup" label="Phòng Dự Phòng" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="limousineBackup"
            label="Limousine Dự Phòng"
            initialValue={0}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="ggAds" label="Google Ads" initialValue={0}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="tiktokZaloAds"
            label="Tiktok/Zalo Ads"
            initialValue={0}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo chi tiêu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Tables;
