import React, { useState, useEffect } from "react";
import { DatePicker, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

const Dashboard = () => {
  const [data, setData] = useState(null); // State để lưu dữ liệu từ API
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  ); // State để lưu ngày được chọn

  // Hàm gọi API để lấy dữ liệu dựa trên ngày đã chọn
  const fetchData = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/bookings/revenue/${date}`
      );
      setData(response.data);
      console.log("Data fetched:", response.data); // Log dữ liệu ra console
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Gọi fetchData khi component được render lần đầu tiên
  useEffect(() => {
    fetchData(selectedDate);
  }, []); // Passing an empty dependency array to trigger this effect only once on initial render

  // Hàm xử lý sự kiện khi DatePicker thay đổi
  const onChangeDate = (date, dateString) => {
    setSelectedDate(dateString); // Cập nhật ngày được chọn trong state
    fetchData(dateString); // Gọi lại fetchData với ngày mới đã chọn
  };
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  const columns = [
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Doanh thu",
      dataIndex: "total",
      key: "total",
      render: formatCurrency,
    },
  ];
  return (
    <>
      <div className="flex justify-between">
        <DatePicker
          defaultValue={dayjs()}
          onChange={onChangeDate}
          format="YYYY-MM-DD"
        />
        <h2>DOANH SỐ NHÂN VIÊN THEO NGÀY</h2>
      </div>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default Dashboard;
