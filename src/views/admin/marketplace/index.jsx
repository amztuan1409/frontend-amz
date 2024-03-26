import React, { useState, useEffect } from "react";
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
import * as XLSX from "xlsx"; // Import all exports from 'xlsx'
const Marketplace = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get("http://103.72.98.164:8800/api/bookings");
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            autoFocus
            placeholder="Tìm kiếm số điện thoại"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              confirm({ closeDropdown: false }); // Giữ dropdown mở để tiếp tục tìm kiếm
            }}
            onPressEnter={() => confirm()} // Thực hiện tìm kiếm khi ấn Enter
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()} // Thực hiện tìm kiếm khi click
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters()} // Xóa bộ lọc
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.phoneNumber
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
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
      title: "Số lượng vé đơn",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá vé đơn",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      render: formatCurrency,
    },
    {
      title: "Số lượng vé đôi",
      dataIndex: "quantityDouble",
      key: "quantityDouble",
    },
    {
      title: "Giá vé đôi",
      dataIndex: "quantityDouble",
      key: "quantityDouble",
      render: formatCurrency,
    },
    {
      title: "Số ghế",
      dataIndex: "seats",
      key: "seats",
     
    },
    {
      title: "Điểm đón",
      dataIndex: "pickuplocation",
      key: "pickuplocation",
    },
    {
      title: "Điểm trả",
      dataIndex: "paylocation",
      key: "paylocation",
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
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Cọc",
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <React.Fragment>
          <Button
            type="primary"
           
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Button
           
            style={{ margin: "0 8px" }}
          
          >
            Hoàn vé
          </Button>
          <Button
             disabled
              
            danger
           
          >
            Xoá vé
          </Button>
        </React.Fragment>
      ),
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

//   <Modal
//   title="Chỉnh sửa đặt vé"
//   visible={isEditModalOpen}
//   onCancel={handleEditCancel}
//   footer={null}
//   width={800}
// >
//   <Form
//     form={form}
//     onValuesChange={handleValueChange}
//     onFinish={onEditFinish}
//     layout="vertical"
//   >
//     <Row gutter={[16, 16]}>
//       <Col span={8}>
//         <Form.Item name="date" label="Ngày đặt">
//           <DatePicker disabled style={{ width: "100%" }} />
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item name="dateGo" label="Ngày đi">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item name="timeStart" label="Giờ đi">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item name="bookingSource" label="Nguồn đặt">
//           <Select style={{ width: "100%" }}>
//             <Option value="ZL428">ZL428</Option>
//             <Option value="ZL200">ZL200</Option>
//             <Option value="ZL232">ZL232</Option>
//             <Option value="ZL978">ZL978</Option>
//             <Option value="PD">PD</Option>
//             <Option value="LM">LM</Option>
//             <Option value="ZLOA">ZLOA</Option>
//             <Option value="AMZ">AMZ</Option>
//             <Option value="VN">VN</Option>
//             <Option value="COM">COM</Option>
//             <Option value="DT">DT</Option>
//             <Option value="HL">HL</Option>
//           </Select>
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item name="customerName" label="Họ tên khách">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item name="phoneNumber" label="Số điện thoại khách">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item name="trip" label="Chuyến đi">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item name="busCompany" label="Hãng xe">
//           <Select style={{ width: "100%" }}>
//             <Option value="AA">AA</Option>
//             <Option value="LV">LV</Option>
//             <Option value="ĐL">ĐL</Option>
//             <Option value="LH">LH</Option>
//             <Option value="TQĐ">TQĐ</Option>
//             <Option value="NK">NK</Option>
//             <Option value="NXM">NXM</Option>
//           </Select>
//         </Form.Item>
//       </Col>
//       <Col span={8}>
//         <Form.Item name="seats" label="Số Ghế">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item name="quantity" label="Số lượng giường đơn">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item name="ticketPrice" label="Đơn giá giường đơn">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item name="quantityDouble" label="Số lượng giường đôi">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item name="ticketPriceDouble" label="Đơn giá giường đôi">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
// <Form.Item name="pickuplocation" label="Điểm đón">
// <Input placeholder="Nhập điểm đón" />
// </Form.Item>
// </Col>

// <Col span={12}>
// <Form.Item name="paylocation" label="Điểm trả">
// <Input placeholder="Nhập điểm trả" />
// </Form.Item>
// </Col>
      

//       <Col span={12}>
//         <Form.Item name="transfer" label="Chuyển khoản">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item name="cash" label="Tiền mặt">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item name="garageCollection" label="Nhà xe thu">
//           <Input />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item name="remaining" label="Còn lại">
//           <Input disabled addon addonAfter="VNĐ" />
//         </Form.Item>
//       </Col>
//       <Col span={12}>
//         <Form.Item name="total" label="Tổng cộng">
//           <Input
//             disabled
//             addonAfter="VNĐ"
//             value={
//               form.getFieldValue("total")
//                 ? form.getFieldValue("total").toLocaleString()
//                 : ""
//             }
//           />
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item
//           name="isPayment"
//           label="Trạng thái thanh toán"
//           valuePropName="checked"
//         >
//           <Switch />
//         </Form.Item>
//       </Col>
//     </Row>
//     <Row className="py-4">
//       <Col span={24}>
//         <Form.Item label="Ghi chú của khách hàng" name="note">
//           <TextArea rows={4} />
//         </Form.Item>
//       </Col>
//     </Row>
//     <Row className="pb-4">
//       <Col span={24}>
//         <Form.Item label="Thông tin chuyển khoản" name="deposit">
//           <TextArea rows={4} />
//         </Form.Item>
//       </Col>
//     </Row>
//     <Row justify="end">
//       <Col>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Lưu
//           </Button>
//         </Form.Item>
//       </Col>
//     </Row>
//   </Form>
// </Modal>

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
