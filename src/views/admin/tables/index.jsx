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
import dayjs from "dayjs";
import moment from "moment";

const Tables = () => {
  const today = new Date();
  const initialMonth = today.getMonth() + 1; // Lấy tháng hiện tại
  const initialYear = today.getFullYear(); // Lấy năm hiện tại
  // Thiết lập giá trị mặc định cho month và year
  const [month, setMonth] = useState(initialMonth.toString());
  const [year, setYear] = useState(initialYear.toString());
  const [dataBooking, setDataBooking] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const [currentMonthYear, setCurrentMonthYear] = useState(moment());
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const id = user._id;
  const name = user.name;

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showEditModal = (record) => {
    setSelectedBooking(record);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      date: dayjs(record.date),
      dateGo: dayjs(record.dateGo),
      timeStart: record.timeStart,
      bookingSource: record.bookingSource,
      customerName: record.customerName,
      phoneNumber: record.phoneNumber,
      trip: record.trip,
      busCompany: record.busCompany,
      ticketPrice: record.ticketPrice,
      quantity: record.quantity,
      total: record.total,
      isPayment: record.isPayment,
      transfer: record.transfer,
      cash: record.cash,
      garageCollection: record.garageCollection,
      remaining: record.remaining,
    });
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const onEditFinish = async (values) => {
    try {
      // Update selected booking data with form values
      const updatedBooking = {
        ...selectedBooking,
        date: values.date.format("YYYY-MM-DD"),
        dateGo: values.dateGo.format("YYYY-MM-DD"),
        timeStart: values.timeStart,
        bookingSource: values.bookingSource,
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        trip: values.trip,
        busCompany: values.busCompany,
        ticketPrice: parseFloat(values.ticketPrice),
        quantity: parseInt(values.quantity),
        total: parseInt(values.total),
        isPayment: values.isPayment,
        transfer: values.transfer,
        cash: values.cash,
        garageCollection: values.garageCollection,
        remaining: values.remaining,
      };

      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:8800/api/bookings/${selectedBooking._id}`,
        updatedBooking,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Modal.success({
        title: "Thông báo",
        content: "Chỉnh sửa đơn đặt vé thành công!",
        onOk: () => {
          setIsEditModalOpen(false);
          form.resetFields();
          getData();
        },
      });
    } catch (error) {
      Modal.error({
        title: "Lỗi",
        content:
          "Đã xảy ra lỗi khi chỉnh sửa đơn đặt vé. Vui lòng thử lại sau!",
      });
      console.error("Lỗi khi chỉnh sửa đơn đặt vé:", error);
    }
  };

  const getData = async () => {
    console.log(month, year);
    try {
      const res = await axios.post(
        `http://localhost:8800/api/bookings/getbyuserId/${month}/${year}`,
        { userId: id }
      );
      setDataBooking(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu booking:", error);
    }
  };
  useEffect(() => {
    // Xử lý khi thay đổi tháng và năm
    getData();
  }, [month, year]); // Lắng nghe sự kiện thay đổi monthYear hoặc id

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
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: formatDate,
      filters: Array.from(
        new Set(dataBooking.map((item) => formatDate(item.date)))
      ).map((date) => ({
        text: date,
        value: date,
      })),
      onFilter: (value, record) => formatDate(record.date) === value,
    },
    {
      title: "Ngày đi",
      dataIndex: "dateGo",
      key: "dateGo",
      render: formatDate,
      filters: Array.from(
        new Set(dataBooking.map((item) => formatDate(item.dateGo)))
      ).map((dateGo) => ({
        text: dateGo,
        value: dateGo,
      })),
      onFilter: (value, record) => formatDate(record.dateGo) === value,
    },
    {
      title: "Mã vé",
      dataIndex: "ticketCode",
      key: "ticketCode",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      filters: Array.from(
        new Set(dataBooking.map((item) => item.customerName))
      ).map((customerName) => ({
        text: customerName,
        value: customerName,
      })),
      onFilter: (value, record) => record.customerName === value,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      filters: Array.from(
        new Set(dataBooking.map((item) => item.phoneNumber))
      ).map((phoneNumber) => ({
        text: phoneNumber,
        value: phoneNumber,
      })),
      onFilter: (value, record) => record.phoneNumber === value,
    },
    {
      title: "Nguồn đặt",
      dataIndex: "bookingSource",
      key: "bookingSource",
      filters: Array.from(
        new Set(dataBooking.map((item) => item.bookingSource))
      ).map((bookingSource) => ({
        text: bookingSource,
        value: bookingSource,
      })),
      onFilter: (value, record) => record.bookingSource === value,
    },
    {
      title: "Hãng xe",
      dataIndex: "busCompany",
      key: "busCompany",
      filters: Array.from(
        new Set(dataBooking.map((item) => item.busCompany))
      ).map((busCompany) => ({
        text: busCompany,
        value: busCompany,
      })),
      onFilter: (value, record) => record.busCompany === value,
    },
    {
      title: "Chuyến đi",
      dataIndex: "trip",
      key: "trip",
      filters: Array.from(new Set(dataBooking.map((item) => item.trip))).map(
        (trip) => ({
          text: trip,
          value: trip,
        })
      ),
      onFilter: (value, record) => record.trip === value,
    },
    {
      title: "Giờ đi",
      dataIndex: "timeStart",
      key: "timeStart",
      filters: Array.from(
        new Set(dataBooking.map((item) => item.timeStart))
      ).map((timeStart) => ({
        text: timeStart,
        value: timeStart,
      })),
      onFilter: (value, record) => record.timeStart === value,
    },
    {
      title: "Đơn giá",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      render: formatCurrency,
      filters: Array.from(
        new Set(dataBooking.map((item) => item.ticketPrice))
      ).map((ticketPrice) => ({
        text: formatCurrency(ticketPrice),
        value: ticketPrice,
      })),
      onFilter: (value, record) => record.ticketPrice === value,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      filters: Array.from(
        new Set(dataBooking.map((item) => item.quantity))
      ).map((quantity) => ({
        text: quantity,
        value: quantity,
      })),
      onFilter: (value, record) => record.quantity === value,
    },
    {
      title: "Tổng cộng",
      dataIndex: "total",
      key: "total",
      render: formatCurrency,
    },
    {
      title: "Tiền mặt",
      dataIndex: "cash",
      key: "cash",
      render: formatCurrency,
    },
    {
      title: "Chuyển khoảng",
      dataIndex: "transfer",
      key: "transfer",
      render: formatCurrency,
    },
    {
      title: "Nhà xe thu",
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
      title: "Trạng thái thanh toán",
      dataIndex: "isPayment",
      key: "isPayment",
      filters: [
        { text: "Đã thanh toán", value: true },
        { text: "Chưa thanh toán", value: false },
      ],
      onFilter: (value, record) => record.isPayment === value,
      render: (text) => (text ? "Đã thanh toán" : "Chưa thanh toán"),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <React.Fragment>
          <Button
            type="primary"
            onClick={() => showEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Button
            onClick={() => showRefundModal(record._id)} // Chỉnh sửa ở đây
            style={{ margin: "0 8px" }}
            disabled={!record.isPayment}
          >
            Hoàn vé
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record._id)} // Thêm sự kiện onClick để xử lý xóa
          >
            Xoá vé
          </Button>
        </React.Fragment>
      ),
    },
  ];
  const { Option } = Select;
  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value); // Chuyển đổi sang kiểu số nguyên
    const ticketPrice = parseFloat(form.getFieldValue("ticketPrice")); // Chuyển đổi sang kiểu số thực
    const total = quantity * ticketPrice;
    form.setFieldsValue({ total });
  };

  const handlePriceChange = (e) => {
    const ticketPrice = parseFloat(e.target.value); // Chuyển đổi sang kiểu số thực
    const quantity = parseInt(form.getFieldValue("quantity")); // Chuyển đổi sang kiểu số nguyên
    const total = quantity * ticketPrice;
    form.setFieldsValue({ total });
  };

  const calculateRemaining = () => {
    const total = parseFloat(form.getFieldValue("total") || 0);
    const cash = parseFloat(form.getFieldValue("cash") || 0);
    const transfer = parseFloat(form.getFieldValue("transfer") || 0);
    const garageCollection = parseFloat(
      form.getFieldValue("garageCollection") || 0
    );

    const remaining = total - (cash + transfer + garageCollection);
    form.setFieldsValue({ remaining });
  };

  const onFinish = async (values) => {
    try {
      console.log("Date:", values.date);
      console.log("DateGo:", values.dateGo);

      // Chuyển đổi kiểu dữ liệu của trường total và quantity
      values.date = dayjs(values.date).format("YYYY-MM-DD");
      values.dateGo = dayjs(values.dateGo).format("YYYY-MM-DD");
      values.total = parseInt(values.total);
      values.quantity = parseInt(values.quantity);
      // Chuyển đổi kiểu dữ liệu của giá vé sang số
      values.ticketPrice = parseFloat(values.ticketPrice);

      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      // Gửi dữ liệu đặt vé lên máy chủ
      const response = await axios.post(
        "http://localhost:8800/api/bookings/create",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token qua header Authorization
          },
        }
      );
      // Hiển thị thông báo thành công
      Modal.success({
        title: "Thông báo",
        content: "Đặt vé thành công!",
        onOk: () => {
          // Đóng modal và làm mới dữ liệu đặt vé
          setIsModalOpen(false);
          form.resetFields();
          getData();
        },
      });
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Modal.error({
        title: "Lỗi",
        content: "Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại sau!",
      });
      console.error("Lỗi khi đặt vé:", error);
    }
  };

  const showRefundModal = (id) => {
    setSelectedRefundId(id); // Lưu trữ ID đơn hàng vào state
    setIsRefundModalOpen(true);
  };

  // Hàm để đóng Modal hoàn vé
  const handleRefundCancel = () => {
    setIsRefundModalOpen(false);
  };

  const onRefundFinish = async (values) => {
    try {
      // Xác định body request
      const requestBody = {
        refundPercentage: values.refundPercentage,
      };

      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      // Gọi API PATCH để hoàn vé với ID và tỷ lệ % hoàn vé đã chọn
      const response = await axios.patch(
        `http://localhost:8800/api/bookings/refund/${selectedRefundId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token qua header Authorization
          },
        }
      );

      // Kiểm tra phản hồi từ API và thông báo kết quả cho người dùng
      if (response && response.data) {
        Modal.success({
          title: "Hoàn vé thành công",
          content: `Đã hoàn ${values.refundPercentage}% vé thành công.`,
        });
      }

      // Sau khi hoàn vé, đóng Modal và làm mới dữ liệu
      setIsRefundModalOpen(false);
      getData(); // Gọi lại hàm lấy dữ liệu đơn hàng để cập nhật dữ liệu mới
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra khi gọi API
      Modal.error({
        title: "Lỗi hoàn vé",
        content: "Đã xảy ra lỗi khi hoàn vé. Vui lòng thử lại sau.",
      });
      console.error("Lỗi khi hoàn vé:", error);
    }
  };

  const handleDelete = (bookingId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa đơn đặt vé này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `http://localhost:8800/api/bookings/delete/${bookingId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Modal.success({
            title: "Xóa thành công",
            content: "Đơn đặt vé đã được xóa thành công.",
          });
          getData(); // Làm mới dữ liệu sau khi xóa
        } catch (error) {
          Modal.error({
            title: "Xóa thất bại",
            content: "Đã xảy ra lỗi khi xóa đơn đặt vé. Vui lòng thử lại sau.",
          });
          console.error("Lỗi khi xóa đơn đặt vé:", error);
        }
      },
    });
  };

  const handleMonthYearChange = (value) => {
    const selectedMonth = value.month() + 1; // Month trong moment.js bắt đầu từ 0
    const selectedYear = value.year();

    // Cập nhật state
    setMonth(selectedMonth.toString());
    setYear(selectedYear.toString());
    setCurrentMonthYear(value);
  };
  const calculateTotals = () => {
    const totals = {
      quantity: 0,
      total: 0,
      cash: 0,
      transfer: 0,
      remaining: 0,
      ticketPrice: 0,
      garageCollection: 0,
    };

    dataBooking.forEach((item) => {
      totals.quantity += item.quantity;
      totals.total += item.total;
      totals.cash += item.cash;
      totals.transfer += item.transfer;
      totals.remaining += item.remaining;
      totals.ticketPrice += item.ticketPrice;
      totals.garageCollection += item.garageCollection;
    });

    return totals;
  };

  // Trong phần return của component, trước khi render <Table>...
  const totals = calculateTotals();
  return (
    <>
      <div className="flex items-center justify-between py-4">
        <DatePicker
          picker="month"
          value={currentMonthYear}
          onChange={handleMonthYearChange}
          format="MM/YYYY"
        />
        <h1 className="text-[30px] font-bold text-[#ff0000]">
          BẢNG ĐƠN ĐẶT VÉ XE CỦA {name}
        </h1>
        <Button type="primary" onClick={showModal}>
          Tạo đơn
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataBooking}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
        rowClassName={(record) => (record.isPayment ? "" : "unpaid-row")}
        summary={() => (
          <Table.Summary.Row
            style={{
              backgroundColor: "#52c41a", // Màu xanh của thành công, màu Ant Design success color
              fontWeight: "bold", // Chữ đậm
              color: "yellow", // Màu chữ trắng
              fontSize: "16px", // Cỡ chữ lớn
            }}
          >
            <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
            <Table.Summary.Cell index={1}></Table.Summary.Cell>
            <Table.Summary.Cell index={2}></Table.Summary.Cell>
            <Table.Summary.Cell index={3}></Table.Summary.Cell>
            <Table.Summary.Cell index={4}></Table.Summary.Cell>
            <Table.Summary.Cell index={5}></Table.Summary.Cell>
            <Table.Summary.Cell index={6}></Table.Summary.Cell>
            <Table.Summary.Cell index={7}></Table.Summary.Cell>
            <Table.Summary.Cell index={8}></Table.Summary.Cell>
            <Table.Summary.Cell index={9}>
              {formatCurrency(totals.ticketPrice)}
            </Table.Summary.Cell>

            <Table.Summary.Cell index={10}>
              {totals.quantity}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={11}>
              {formatCurrency(totals.total)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={12}>
              {formatCurrency(totals.cash)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={13}>
              {formatCurrency(totals.transfer)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={14}>
              {formatCurrency(totals.garageCollection)}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={15}>
              {formatCurrency(totals.remaining)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Modal
        title="Hoàn vé"
        visible={isRefundModalOpen}
        onCancel={handleRefundCancel}
        footer={null}
      >
        <Form form={form} onFinish={onRefundFinish} layout="vertical">
          <Form.Item
            name="refundPercentage"
            label="Chọn tỷ lệ % hoàn vé"
            rules={[
              { required: true, message: "Vui lòng chọn tỷ lệ % hoàn vé!" },
            ]}
          >
            <Select>
              <Select.Option value="0">0%</Select.Option>
              <Select.Option value="10">10%</Select.Option>
              <Select.Option value="20">20%</Select.Option>
              <Select.Option value="50">50%</Select.Option>
              <Select.Option value="100">100%</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Hoàn vé
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thông tin đặt vé"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="date" label="Ngày đặt">
                <DatePicker
                  style={{ width: "100%" }}
                  defaultValue={dayjs()}
                  disabled
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="dateGo" label="Ngày đi">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="timeStart" label="Giờ đi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bookingSource" label="Nguồn đặt">
                <Select style={{ width: "100%" }}>
                  <Option value="ZL428">ZL428</Option>
                  <Option value="ZL200">ZL200</Option>
                  <Option value="ZL232">ZL232</Option>
                  <Option value="ZL978">ZL978</Option>
                  <Option value="PD">PD</Option>
                  <Option value="LM">LM</Option>
                  <Option value="ZLOA">ZLOA</Option>
                  <Option value="AMZ">AMZ</Option>
                  <Option value="VN">VN</Option>
                  <Option value="COM">COM</Option>
                  <Option value="DT">DT</Option>
                  <Option value="HL">HL</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="customerName" label="Họ tên khách">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="phoneNumber" label="Số điện thoại khách">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="trip" label="Chuyến đi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="busCompany" label="Hãng xe">
                <Select style={{ width: "100%" }}>
                  <Option value="AA">AA</Option>
                  <Option value="LV">LV</Option>
                  <Option value="ĐL">ĐL</Option>
                  <Option value="LH">LH</Option>
                  <Option value="TQĐ">TQĐ</Option>
                  <Option value="NK">NK</Option>
                  <Option value="NXM">NXM</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ticketPrice" label="Đơn giá">
                <Input onChange={handlePriceChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quantity" label="Số lượng">
                <Input onChange={handleQuantityChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transfer" label="Chuyển khoản">
                <Input onChange={calculateRemaining} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cash" label="Tiền mặt">
                <Input onChange={calculateRemaining} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="garageCollection" label="Nhà xe thu">
                <Input onChange={calculateRemaining} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="remaining" label="Còn lại">
                <Input disabled addonAfter="VNĐ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="total" label="Tổng cộng">
                <Input
                  disabled
                  addonAfter="VNĐ"
                  value={
                    form.getFieldValue("total")
                      ? form.getFieldValue("total").toLocaleString()
                      : ""
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="isPayment"
                label="Trạng thái thanh toán"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Tạo đơn
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa đặt vé"
        visible={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={onEditFinish} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="date" label="Ngày đặt">
                <DatePicker disabled style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dateGo" label="Ngày đi">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="timeStart" label="Giờ đi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bookingSource" label="Nguồn đặt">
                <Select style={{ width: "100%" }}>
                  <Option value="ZL428">ZL428</Option>
                  <Option value="ZL200">ZL200</Option>
                  <Option value="ZL232">ZL232</Option>
                  <Option value="ZL978">ZL978</Option>
                  <Option value="PD">PD</Option>
                  <Option value="LM">LM</Option>
                  <Option value="ZLOA">ZLOA</Option>
                  <Option value="AMZ">AMZ</Option>
                  <Option value="VN">VN</Option>
                  <Option value="COM">COM</Option>
                  <Option value="DT">DT</Option>
                  <Option value="HL">HL</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="customerName" label="Họ tên khách">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="phoneNumber" label="Số điện thoại khách">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="trip" label="Chuyến đi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="busCompany" label="Hãng xe">
                <Select style={{ width: "100%" }}>
                  <Option value="AA">AA</Option>
                  <Option value="LV">LV</Option>
                  <Option value="ĐL">ĐL</Option>
                  <Option value="LH">LH</Option>
                  <Option value="TQĐ">TQĐ</Option>
                  <Option value="NK">NK</Option>
                  <Option value="NXM">NXM</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ticketPrice" label="Đơn giá">
                <Input onChange={handlePriceChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quantity" label="Số lượng">
                <Input onChange={handleQuantityChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transfer" label="Chuyển khoản">
                <Input onChange={calculateRemaining} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cash" label="Tiền mặt">
                <Input onChange={calculateRemaining} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="garageCollection" label="Nhà xe thu">
                <Input onChange={calculateRemaining} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="remaining" label="Còn lại">
                <Input disabled addonAfter="VNĐ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="total" label="Tổng cộng">
                <Input
                  disabled
                  addonAfter="VNĐ"
                  value={
                    form.getFieldValue("total")
                      ? form.getFieldValue("total").toLocaleString()
                      : ""
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="isPayment"
                label="Trạng thái thanh toán"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Tables;
