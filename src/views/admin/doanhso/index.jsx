import React, { useState, useEffect } from "react";
import { DatePicker, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const fetchData = async (date) => {
    try {
      const response = await axios.get(`http://103.72.98.164:8800/api/bookings/revenue/${date}`);
      setData(response.data);
      console.log("Data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, []);

  const onChangeDate = (date, dateString) => {
    setSelectedDate(dateString);
    fetchData(dateString);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

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
    {
      title: "Tiền chuyển khoản",
      dataIndex: "transfer",
      key: "transfer",
      render: formatCurrency,
    },
    {
      title: "Tiền mặt",
      dataIndex: "cash",
      key: "cash",
      render: formatCurrency,
    },
    {
      title: "Nhà xe thu",
      dataIndex: "garageCollection",
      key: "garageCollection",
      render: formatCurrency,
    },
  ];

  const renderSummary = () => {
    let totalRevenue = data?.reduce((sum, record) => sum + record.total, 0) || 0;
    let totaltransfer = data?.reduce((sum, record) => sum + record.transfer, 0) || 0;
    let totalgarageCollection = data?.reduce((sum, record) => sum + record.garageCollection, 0) || 0;
    let totalcash = data?.reduce((sum, record) => sum + record.cash, 0) || 0;
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>Tổng cộng</Table.Summary.Cell>
          <Table.Summary.Cell index={1}>{formatCurrency(totalRevenue)}</Table.Summary.Cell>
         
          <Table.Summary.Cell index={2}>{formatCurrency(totaltransfer)}</Table.Summary.Cell>
          <Table.Summary.Cell index={2}>{formatCurrency(totalcash)}</Table.Summary.Cell>
          <Table.Summary.Cell index={3}>{formatCurrency(totalgarageCollection)}</Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };

  return (
    <>
      <div className="flex justify-between">
        <DatePicker defaultValue={dayjs()} onChange={onChangeDate} format="YYYY-MM-DD" />
        <h2>DOANH SỐ NHÂN VIÊN THEO NGÀY</h2>
      </div>
      <Table columns={columns} dataSource={data} summary={renderSummary} />
    </>
  );
};

export default Dashboard;
