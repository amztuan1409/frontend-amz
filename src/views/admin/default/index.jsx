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
} from "antd";
import axios from "axios";
const Dashboard = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    const res = await axios.get("http://localhost:8800/api/report");
    setData(res.data.data.reports);
  };
  useEffect(() => {
    getData(); // Gọi ngay lần đầu để không phải chờ

    const intervalId = setInterval(() => {
      getData(); // Tiếp tục cập nhật mỗi 5 giây
    }, 5000);

    return () => clearInterval(intervalId); // Dọn dẹp
  }, []);

  console.log(data);
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
      render: formatDate,
      filters: Array.from(
        new Set(data.map((item) => formatDate(item.date)))
      ).map((date) => ({
        text: date,
        value: date,
      })),
      onFilter: (value, record) => formatDate(record.date) === value,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: formatCurrency,
    },
    {
      title: "AA",
      dataIndex: "aa",
      key: "aa",
      filters: Array.from(new Set(data.map((item) => item.aa))).map((aa) => ({
        text: aa,
        value: aa,
      })),
      onFilter: (value, record) => record.aa === value,
    },
    {
      title: "LV",
      dataIndex: "lv",
      key: "lv",
      filters: Array.from(new Set(data.map((item) => item.lv))).map((lv) => ({
        text: lv,
        value: lv,
      })),
      onFilter: (value, record) => record.lv === value,
    },
    {
      title: "ĐL",
      dataIndex: "đl",
      key: "đl",
      filters: Array.from(new Set(data.map((item) => item.đl))).map((đl) => ({
        text: đl,
        value: đl,
      })),
      onFilter: (value, record) => record.đl === value,
    },
    {
      title: "lh",
      dataIndex: "lh",
      key: "lh",
      filters: Array.from(new Set(data.map((item) => item.lh))).map((lh) => ({
        text: lh,
        value: lh,
      })),
      onFilter: (value, record) => record.lh === value,
    },
    {
      title: "tqđ",
      dataIndex: "tqđ",
      key: "tqđ",
      filters: Array.from(new Set(data.map((item) => item.tqđ))).map((tqđ) => ({
        text: tqđ,
        value: tqđ,
      })),
      onFilter: (value, record) => record.tqđ === value,
    },
    {
      title: "nk",
      dataIndex: "nk",
      key: "nk",
      filters: Array.from(new Set(data.map((item) => item.nk))).map((nk) => ({
        text: nk,
        value: nk,
      })),
      onFilter: (value, record) => record.nk === value,
    },
    {
      title: "nxm",
      dataIndex: "nxm",
      key: "nxm",
      filters: Array.from(new Set(data.map((item) => item.nxm))).map((nxm) => ({
        text: nxm,
        value: nxm,
      })),
      onFilter: (value, record) => record.nxm === value,
    },
    {
      title: "zl428",
      dataIndex: "zl428",
      key: "zl428",
      filters: Array.from(new Set(data.map((item) => item.zl428))).map(
        (zl428) => ({
          text: zl428,
          value: zl428,
        })
      ),
      onFilter: (value, record) => record.zl428 === value,
    },
    {
      title: "zl200",
      dataIndex: "zl200",
      key: "zl200",
      filters: Array.from(new Set(data.map((item) => item.zl200))).map(
        (zl200) => ({
          text: zl200,
          value: zl200,
        })
      ),
      onFilter: (value, record) => record.zl200 === value,
    },
    {
      title: "zl232",
      dataIndex: "zl232",
      key: "zl232",
      filters: Array.from(new Set(data.map((item) => item.zl232))).map(
        (zl232) => ({
          text: zl232,
          value: zl232,
        })
      ),
      onFilter: (value, record) => record.zl232 === value,
    },
    {
      title: "zl987",
      dataIndex: "zl978",
      key: "zl978",
      filters: Array.from(new Set(data.map((item) => item.zl978))).map(
        (zl978) => ({
          text: zl978,
          value: zl978,
        })
      ),
      onFilter: (value, record) => record.zl978 === value,
    },
    {
      title: "pd",
      dataIndex: "pd",
      key: "pd",
      filters: Array.from(new Set(data.map((item) => item.pd))).map((pd) => ({
        text: pd,
        value: pd,
      })),
      onFilter: (value, record) => record.pd === value,
    },
    {
      title: "lm",
      dataIndex: "lm",
      key: "lm",
      filters: Array.from(new Set(data.map((item) => item.lm))).map((lm) => ({
        text: lm,
        value: lm,
      })),
      onFilter: (value, record) => record.lm === value,
    },
    {
      title: "zloa",
      dataIndex: "zloa",
      key: "zloa",
      filters: Array.from(new Set(data.map((item) => item.zloa))).map(
        (zloa) => ({
          text: zloa,
          value: zloa,
        })
      ),
      onFilter: (value, record) => record.zloa === value,
    },
    {
      title: "amz",
      dataIndex: "amz",
      key: "amz",
      filters: Array.from(new Set(data.map((item) => item.amz))).map((amz) => ({
        text: amz,
        value: amz,
      })),
      onFilter: (value, record) => record.amz === value,
    },
    {
      title: "vn",
      dataIndex: "vn",
      key: "vn",
      filters: Array.from(new Set(data.map((item) => item.vn))).map((vn) => ({
        text: vn,
        value: vn,
      })),
      onFilter: (value, record) => record.vn === value,
    },
    {
      title: "com",
      dataIndex: "com",
      key: "com",
      filters: Array.from(new Set(data.map((item) => item.com))).map((com) => ({
        text: com,
        value: com,
      })),
      onFilter: (value, record) => record.com === value,
    },
    {
      title: "dt",
      dataIndex: "dt",
      key: "dt",
      filters: Array.from(new Set(data.map((item) => item.dt))).map((dt) => ({
        text: dt,
        value: dt,
      })),
      onFilter: (value, record) => record.dt === value,
    },
    {
      title: "hl",
      dataIndex: "hl",
      key: "hl",
      filters: Array.from(new Set(data.map((item) => item.hl))).map((hl) => ({
        text: hl,
        value: hl,
      })),
      onFilter: (value, record) => record.hl === value,
    },
    {
      title: "Lợi nhuận tương đối",
      dataIndex: "relativeProfit",
      key: "relativeProfit",
      render: formatCurrency,
    },
  ];
  const totals = data.reduce((acc, record) => {
    Object.keys(record).forEach((key) => {
      if (key !== "date") {
        // Loại trừ cột "Ngày" khỏi tính tổng
        acc[key] = (acc[key] || 0) + record[key];
      }
    });
    return acc;
  }, {});
  return (
    <>
      <div className="text-center">
        <h2>BẢNG BÁO CÁO TỔNG LIVE VIEW</h2>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        summary={(pageData) => {
          return (
            <Table.Summary.Row
              style={{
                backgroundColor: "#52c41a", // Màu xanh của thành công, màu Ant Design success color
                fontWeight: "bold", // Chữ đậm
                color: "yellow", // Màu chữ trắng
                fontSize: "16px", // Cỡ chữ lớn
              }}
            >
              <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
              {/* Duyệt qua các cột và kiểm tra key để áp dụng format phù hợp */}
              {columns.slice(1).map((col, index) => (
                <Table.Summary.Cell index={index + 1} key={col.key}>
                  {
                    col.key === "revenue" || col.key === "relativeProfit"
                      ? formatCurrency(totals[col.dataIndex]) // Áp dụng định dạng tiền tệ
                      : totals[col.dataIndex] // Giữ nguyên định dạng số
                  }
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>
          );
        }}
      />
    </>
  );
};

export default Dashboard;
