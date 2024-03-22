import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import * as XLSX from "xlsx"; // Import all exports from 'xlsx'
const Marketplace = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/bookings");
      const modifiedData = res.data.map((item) => {
        const { createdAt, updatedAt, __v, username, ...rest } = item;
        return rest;
      });
      setData(modifiedData);
      setFilteredData(modifiedData); // Set both data and filteredData after fetch
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData(); // Gọi ngay lần đầu để không phải chờ
    const intervalId = setInterval(() => {
      getData(); // Tiếp tục cập nhật mỗi 5 giây
    }, 5000);
    return () => clearInterval(intervalId); // Dọn dẹp
  }, []);

  const formatDate = (text) => {
    const date = new Date(text);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      filters: Array.from(new Set(data.map((item) => item.date))).map(
        (date) => ({
          text: date,
          value: date,
        })
      ),
      onFilter: (value, record) => record.date === value,
    },
    {
      title: "Nhân viên",
      dataIndex: "name",
      key: "name",
      filters: Array.from(new Set(data.map((item) => item.name))).map(
        (name) => ({
          text: name,
          value: name,
        })
      ),
      onFilter: (value, record) => record.name === value,
    },
    {
      title: "Mã vé",
      dataIndex: "ticketCode",
      key: "ticketCode",
    },
    {
      title: "Ngày đi",
      dataIndex: "dateGo",
      key: "dateGo",
      filters: Array.from(new Set(data.map((item) => item.dateGo))).map(
        (dateGo) => ({
          text: dateGo,
          value: dateGo,
        })
      ),
      onFilter: (value, record) => record.dateGo === value,
    },
    {
      title: "Nguồn đặt vé",
      dataIndex: "bookingSource",
      key: "bookingSource",
      filters: Array.from(new Set(data.map((item) => item.bookingSource))).map(
        (bookingSource) => ({
          text: bookingSource,
          value: bookingSource,
        })
      ),
      onFilter: (value, record) => record.bookingSource === value,
    },
    {
      title: "Thời gian khởi hành",
      dataIndex: "timeStart",
      key: "timeStart",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      filters: Array.from(new Set(data.map((item) => item.phoneNumber))).map(
        (phoneNumber) => ({
          text: phoneNumber,
          value: phoneNumber,
        })
      ),
      onFilter: (value, record) => record.phoneNumber === value,
    },
    {
      title: "Chuyến đi",
      dataIndex: "trip",
      key: "trip",
      filters: Array.from(new Set(data.map((item) => item.trip))).map(
        (trip) => ({
          text: trip,
          value: trip,
        })
      ),
      onFilter: (value, record) => record.trip === value,
    },
    {
      title: "Hãng xe",
      dataIndex: "busCompany",
      key: "busCompany",
      filters: Array.from(new Set(data.map((item) => item.busCompany))).map(
        (busCompany) => ({
          text: busCompany,
          value: busCompany,
        })
      ),
      onFilter: (value, record) => record.busCompany === value,
    },
    {
      title: "Số lượng vé",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá vé",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      render: formatCurrency,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: formatCurrency,
    },
    {
      title: "Thanh toán",
      dataIndex: "isPayment",
      key: "isPayment",
      render: (text) => (text ? "Đã thanh toán" : "Chưa thanh toán"),
    },
    {
      title: "Đã gửi ZNS",
      dataIndex: "isSendZNS",
      key: "isSendZNS",
      render: (text) => (text ? "Đã gửi ZNS" : "Chưa gửi ZNS"),
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
      title: "Nhà xe nhận",
      dataIndex: "garageCollection",
      key: "garageCollection",
      render: formatCurrency,
    },
    {
      title: "Còn lại",
      dataIndex: "remaining",
      key: "remaining",
      render: formatCurrency,
    },
  ];
  const handleFilter = (pagination, filters, sorter) => {
    let newData = [...data];

    Object.keys(filters).forEach((key) => {
      const value = filters[key] || [];
      if (value.length > 0) {
        newData = newData.filter((item) => {
          return value.includes(item[key]);
        });
      }
    });

    setFilteredData(newData);
  };

  const clearFilters = () => {
    setFilteredData(data);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "bookings.xlsx");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1>BẢNG TẤT CẢ ĐƠN BOOKING</h1>
        <Button type="primary" onClick={exportToExcel}>
          Xuất Excel
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData} // Use filteredData instead of data here
        scroll={{ x: "max-content" }}
        onChange={handleFilter}
        onFilterDropdownVisibleChange={clearFilters}
      />
    </>
  );
};

export default Marketplace;
