import React, { useState, useEffect , useRef  } from "react";
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
import numeral from "numeral";
import Loading from "views/public/Loading";

const Tables = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollToFirstRow();
    }
  }, []);
  const today = new Date();
  const initialMonth = today.getMonth() + 1; // Lấy tháng hiện tại
  const initialYear = today.getFullYear(); // Lấy năm hiện tại
  // Thiết lập giá trị mặc định cho month và year
  const [month, setMonth] = useState(initialMonth.toString());
  const { RangePicker } = DatePicker;
  const [year, setYear] = useState(initialYear.toString());
  const [dataBooking, setDataBooking] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const [currentMonthYear, setCurrentMonthYear] = useState(moment());
  const [isLoading, setIsLoading] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);


  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const id = user._id;
  const name = user.name;
  const { TextArea } = Input;

  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({
      ticketPrice: numeral(450000).format('0,0'),
      ticketPriceDouble: numeral(750000).format('0,0'),
      ticketPriceBack: numeral(450000).format('0,0'),
      ticketPriceDoubleBack: numeral(750000).format('0,0'),
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsRoundTrip(false)
  };
  const showEditModal = (record) => {
   
    setSelectedBooking(record);
    const isRoundTripBooking = (record.quantityBack && record.quantityBack > 0) || (record.quantityDoubleBack && record.quantityDoubleBack > 0);
    console.log(isRoundTripBooking);
    setIsRoundTrip(isRoundTripBooking); // Cập nhật state dựa trên kết quả kiểm tra
    setIsEditModalOpen(true);
    form.setFieldsValue({
      date: dayjs(record.date),
      dateGo: dayjs(record.dateGo),
      dateBack: dayjs(record.dateBack),
      timeStart: record.timeStart,
      timeBack: record.timeBack,
      bookingSource: record.bookingSource,
      customerName: record.customerName,
      phoneNumber: record.phoneNumber,
      trip: record.trip,
      busCompany: record.busCompany,
      busCompanyBack: record.busCompanyBack,
      quantity: record.quantity,
      quantityBack: record.quantityBack,
      quantityDouble: record.quantityDouble,
      quantityDoubleBack: record.quantityDoubleBack,
      ticketPriceDouble: numeral(record.ticketPriceDouble).format("0,0"),
      ticketPriceDoubleBack: numeral(record.ticketPriceDoubleBack).format("0,0"),
      ticketPrice: numeral(record.ticketPrice).format("0,0"),
      ticketPriceBack: numeral(record.ticketPriceBack).format("0,0"),
      total: numeral(record.total).format("0,0"),
      isPayment: record.isPayment,
      transfer: numeral(record.transfer).format("0,0"),
      cash: numeral(record.cash).format("0,0"),
      garageCollection: numeral(record.garageCollection).format("0,0"),
      remaining: numeral(record.remaining).format("0,0"),
      seats: record.seats,
      seatsBack: record.seatsBack,
      pickuplocation: record.pickuplocation,
      pickuplocationBack: record.pickuplocationBack,
      paylocation: record.paylocation,
      paylocationBack: record.paylocationBack,
      note: record.note,
      deposit: record.deposit,
      roundTrip: isRoundTripBooking,
    });
  };

  const handleEditCancel = () => {
     setIsRoundTrip(false)
    setIsEditModalOpen(false);
  };

  const onEditFinish = async (values) => {
   
    try {
      setIsLoading(true); 
      // Update selected booking data with form values
      const updatedBooking = {
        ...selectedBooking,
        date: values.date.format("YYYY-MM-DD"),
        dateGo: values.dateGo.format("YYYY-MM-DD"),
        dateBack: values.dateBack.format("YYYY-MM-DD"),
        timeStart: values.timeStart,
        timeBack: values.timeBack,
        bookingSource: values.bookingSource,
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        pickuplocation: values.pickuplocation,
        pickuplocationBack: values.pickuplocationBack,
        paylocation: values.paylocation,
        paylocationBack: values.paylocationBack,
        trip: values.trip,
        busCompany: values.busCompany,
        busCompanyBack: values.busCompanyBack,
        note: values.note,
        deposit: values.deposit,
        seats: values.seats,
        seatsBack:  values.seatsBack,
        ticketPriceDouble: numeral(values.ticketPriceDouble).value(),
        ticketPriceDoubleBack: numeral(values.ticketPriceDoubleBack).value(),
        quantityDouble: numeral(values.quantityDouble).value(),
        quantityDoubleBack: numeral(values.quantityDoubleBack).value(),
        ticketPrice: numeral(values.ticketPrice).value(),
        ticketPriceBack:numeral(values.ticketPriceBack).value(),
        quantity: numeral(values.quantity).value(),
        quantityBack: numeral(values.quantityBack).value(),
        total: numeral(values.total).value(),
        isPayment: values.isPayment,
        transfer: numeral(values.transfer).value(),
        cash: numeral(values.cash).value(),
        garageCollection: numeral(values.garageCollection).value(),
        remaining: numeral(values.remaining).value(),
      };

      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://103.72.98.164:8800/api/bookings/${selectedBooking._id}`,
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
    }finally {
      setIsLoading(false); // Kết thúc hiển thị component loading sau khi hoàn thành hoặc xảy ra lỗi
    }
  };

  const getData = async (startDate, endDate) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://103.72.98.164:8800/api/bookings/getbyuserId`, // Giả định đây là endpoint hỗ trợ lấy dữ liệu theo khoảng thời gian
        {
          userId: id,
          startDate,
          endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDataBooking(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu booking:", error);
    }
  };
  useEffect(() => {
    // Chuyển đổi ngày hiện tại sang định dạng YYYY-MM-DD
    const today = moment().format("YYYY-MM-DD");
    getData();
  }, []); // Mảng rỗng đảm bảo rằng effect chỉ chạy một lần sau khi component mount
  
  

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
      filters: Array.from(new Set(dataBooking.map((item) => formatDate(item.date))))
        .sort((a, b) => new Date(a) - new Date(b)) // Sắp xếp ngày từ cũ đến mới
        .map((date) => ({
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
      title: "Số ghế",
      dataIndex: "seats",
      key: "seats",
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
      title: "Đơn giá giường đơn",
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
      title: "Số lượng giường đơn",
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
      title: "Đơn giá giường đôi",
      dataIndex: "ticketPriceDouble",
      key: "ticketPriceDouble",
      render: formatCurrency,
      filters: Array.from(
        new Set(dataBooking.map((item) => item.ticketPriceDouble))
      ).map((ticketPriceDouble) => ({
        text: formatCurrency(ticketPriceDouble),
        value: ticketPriceDouble,
      })),
      onFilter: (value, record) => record.ticketPriceDouble === value,
    },
    {
      title: "Số lượng giường đôi",
      dataIndex: "quantityDouble",
      key: "quantityDouble",
      filters: Array.from(
        new Set(dataBooking.map((item) => item.quantityDouble))
      ).map((quantityDouble) => ({
        text: quantityDouble,
        value: quantityDouble,
      })),
      onFilter: (value, record) => record.quantityDouble === value,
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
      title: "Cọc tiền",
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
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
      setIsLoading(true); // Bắt đầu hiển thị component loading khi bắt đầu gửi dữ liệu

      values.date = dayjs(values.date).format("YYYY-MM-DD");
      values.dateGo = dayjs(values.dateGo).format("YYYY-MM-DD");
      values.customerName = values.customerName ? values.customerName.toUpperCase() : "";
      // Chuyển đổi các giá trị số từ chuỗi đã format sang số
      values.quantity = numeral(values.quantity).value();
      values.quantityBack = numeral(values.quantityBack).value();
      values.quantityDouble = numeral(values.quantityDouble).value();
      values.quantityDoubleBack = numeral(values.quantityDoubleBack).value();
      values.total = numeral(values.total).value();
      values.transfer = numeral(values.transfer).value();
      values.cash = numeral(values.cash).value();
      values.garageCollection = numeral(values.garageCollection).value();
      values.ticketPrice = numeral(values.ticketPrice).value();
      values.ticketPriceBack = numeral(values.ticketPriceBack).value();
      values.ticketPriceDouble = numeral(values.ticketPriceDouble).value();
      values.ticketPriceDoubleBack = numeral(values.ticketPriceDoubleBack).value();
      // Đảm bảo rằng 'remaining' cũng được chuyển đổi nếu nó tồn tại trong form
      if (values.remaining) {
        values.remaining = numeral(values.remaining).value();
      }
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      console.log(values);
      // Gửi dữ liệu đặt vé lên máy chủ
      const response = await axios.post(
        "http://103.72.98.164:8800/api/bookings/create",
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
      setIsRoundTrip(false)
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Modal.error({
        title: "Lỗi",
        content: "Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại sau!",
      });
      console.error("Lỗi khi đặt vé:", error);
    } finally {
      setIsLoading(false); // Kết thúc hiển thị component loading sau khi hoàn thành hoặc xảy ra lỗi
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
    values.refundAmount = numeral(values.refundAmount).value();
    try {
      setIsLoading(true);
      const requestBody = {
        refundAmount: values.refundAmount,
        season: values.season,
        bank: values.bank, // Thêm trường bank vào requestBody
      };
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://103.72.98.164:8800/api/bookings/refund/${selectedRefundId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        Modal.success({
          title: "Hoàn vé thành công",
          content: `Đã hoàn ${requestBody.refundAmount.toLocaleString()}  cho đơn này thành công.`,
        });

      }
      form.resetFields();
      setIsRefundModalOpen(false);
      getData();
    } catch (error) {
      Modal.error({
        title: "Lỗi hoàn vé",
        content: "Đã xảy ra lỗi khi hoàn vé. Vui lòng thử lại sau.",
      });
      form.resetFields();
      console.error("Lỗi khi hoàn vé:", error);
    } finally {
      setIsLoading(false); // Kết thúc hiển thị component loading sau khi hoàn thành hoặc xảy ra lỗi
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
            `http://103.72.98.164:8800/api/bookings/delete/${bookingId}`,
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
      quantityDouble: 0,
      total: 0,
      cash: 0,
      transfer: 0,
      remaining: 0,
      ticketPrice: 0,
      garageCollection: 0,
      ticketPriceDouble: 0,
    };

    dataBooking.forEach((item) => {
      totals.quantity += item.quantity;
      totals.total += item.total;
      totals.cash += item.cash;
      totals.transfer += item.transfer;
      totals.remaining += item.remaining;
      totals.ticketPrice += item.ticketPrice;
      totals.garageCollection += item.garageCollection;
      totals.quantityDouble += item.quantityDouble;
      totals.ticketPriceDouble += item.ticketPriceDouble;
    });

    return totals;
  };

  const totals = calculateTotals();
 
  const handleValueChangeRefund = (_, allValues) => {
    const {
      refundAmount
    } = allValues;
   
    // Format và cập nhật giá trị đơn giá và số lượng
    const formattedrefundAmount = numeral(refundAmount).format("0,0");
   

  
    form.setFieldsValue({
      refundAmount: formattedrefundAmount,
    });
  }; 
  
  

  const handleValueChange = (_, allValues) => {
    const {
      ticketPrice,
      quantity,
      ticketPriceBack,
      quantityBack,
      transfer,
      cash,
      garageCollection,
      ticketPriceDouble,
      quantityDouble,
      ticketPriceDoubleBack,
      quantityDoubleBack,

    } = allValues;
   
    // Format và cập nhật giá trị đơn giá và số lượng
    const formattedPrice = numeral(ticketPrice).format("0,0");
    const formattedQuantity = numeral(quantity).format("0,0");
    const formattedQuantityDouble = numeral(quantityDouble).format("0,0");
    const formattedPriceDouble = numeral(ticketPriceDouble).format("0,0");
    const formattedPriceBack = numeral(ticketPriceBack).format("0,0");
    const formattedQuantityBack = numeral(quantityBack).format("0,0");
    const formattedQuantityDoubleBack = numeral(quantityDoubleBack).format("0,0");
    const formattedPriceDoubleBack = numeral(ticketPriceDoubleBack).format("0,0");

    const totalPrice =
      numeral(ticketPrice).value() * numeral(quantity).value() +
      numeral(ticketPriceDouble).value() * numeral(quantityDouble).value() + 
      numeral(ticketPriceBack).value() * numeral(quantityBack).value() +
      numeral(ticketPriceDoubleBack).value() * numeral(quantityDoubleBack).value() 

    // Tính toán và format cho các trường thanh toán
    const formattedTransfer = numeral(transfer).format("0,0");
    const formattedCash = numeral(cash).format("0,0");
    const formattedGarageCollection = numeral(garageCollection).format("0,0");
 
    // Tính toán còn lại
    const remaining =
      totalPrice -
      (numeral(transfer).value() +
        numeral(cash).value() +
        numeral(garageCollection).value());

    form.setFieldsValue({
      ticketPriceDouble: formattedPriceDouble,
      ticketPrice: formattedPrice,
      quantity: formattedQuantity,
      quantityDouble: formattedQuantityDouble,
      total: numeral(totalPrice).format("0,0"),
      ticketPriceBack : formattedPriceBack,
      ticketPriceDoubleBack : formattedPriceDoubleBack,
      quantityBack : formattedQuantityBack,
      quantityDoubleBack : formattedQuantityDoubleBack,
      transfer: formattedTransfer,
      cash: formattedCash,
      garageCollection: formattedGarageCollection,
      remaining: numeral(remaining).format("0,0"), // Cập nhật giá trị còn lại
     
    });
  }; 
  
  
  const handleCombinedChange = (_, allValues) => {
    // Logic để xác định khi nào cần cập nhật điểm đón và trả dựa trên việc người dùng thay đổi hãng xe hoặc chuyến đi
    const busOrTripChanged = _.busCompany || _.trip; // Chỉ kiểm tra sự thay đổi từ hãng xe hoặc chuyến đi
    const pickupOrDropoffChanged = _.hasOwnProperty('pickuplocation') || _.hasOwnProperty('paylocation'); // Kiểm tra sự thay đổi trực tiếp từ điểm đón hoặc điểm trả
  
    
    
    if (busOrTripChanged) {
      const { busCompany, trip } = allValues;
      let newPickups = [], newDropoffs = [];
  
      // Logic để cập nhật dựa trên thông tin từ hãng xe và chuyến đi
      if (busCompaniesInfo[busCompany] && busCompaniesInfo[busCompany][trip]) {
        const info = busCompaniesInfo[busCompany][trip];
        newPickups = trip === "SÀI GÒN - ĐÀ LẠT" ? info.pickups : info.dropoffs;
        newDropoffs = trip === "SÀI GÒN - ĐÀ LẠT" ? info.dropoffs : info.pickups;
  
        form.setFieldsValue({
          pickuplocation: newPickups.length > 0 ? newPickups[0] : '',
          paylocation: newDropoffs.length > 0 ? newDropoffs[0] : '',
          pickuplocationBack: newDropoffs.length > 0 ? newDropoffs[0] : '',
          paylocationBack: newPickups.length > 0 ? newPickups[0] : '',
          
        });
      }
    }
  
    // Xử lý khi có sự thay đổi trực tiếp từ điểm đón hoặc điểm trả
    if (pickupOrDropoffChanged) {
      // Cập nhật điểm đón và trả cho vé về dựa trên sự thay đổi
      form.setFieldsValue({
        pickuplocationBack: allValues.paylocation, // Gán điểm đón vé về bằng điểm trả hiện tại
        paylocationBack: allValues.pickuplocation, // Gán điểm trả vé về bằng điểm đón hiện tại
      });
    }
  
    // Đảm bảo rằng logic để format tiền tệ và các thay đổi khác vẫn được gọi
    handleValueChange(_, allValues);
  };
  




  const busCompaniesInfo = {
    "AA": {
      "SÀI GÒN - ĐÀ LẠT": {
        pickups: [ "526 An Dương Vương, P9, Quận 5, HCM"],
        dropoffs: ["4C Yersin, Phường 10, TP Đà Lạt"]
      }
    },
    "LV" :{
      "SÀI GÒN - ĐÀ LẠT" : {
        pickups : [ "152 Chu Văn An, P26, Bình Thạnh HCM"],
        dropoffs : [" 14 Đống Đa, Phường 3, TP Đà Lạt"]
      }
    },
    "TQĐ" :{
      "SÀI GÒN - ĐÀ LẠT" : {
        pickups : ["Bến xe An Sương, QL22, Hóc Môn, HCM"],
        dropoffs : ["263 Mai Anh Đào, Phường 8, TP Đà Lạt"]
      }
    },
    "LH" :{
      "SÀI GÒN - ĐÀ LẠT" : {
        pickups : [],
        dropoffs : ["D11 KQH Hoàng Diệu, Phường 5, TP Đà Lạt"]
      }
    },
    "KT" :{
      "SÀI GÒN - ĐÀ LẠT" : {
        pickups : [],
        dropoffs : ["16 Phan Chu Trinh, Phường 9, TP Đà Lạt"]
      }
    },
    "PP" :{
      "SÀI GÒN - ĐÀ LẠT" : {
        pickups : ["522 Hoàng Văn Thụ, P4, Quận Tân Bình, HCM" , "522 Hoàng Văn Thụ, P4, Quận Tân Bình, HCM"],
        dropoffs : ["20C đường 3/4, Phường 3, TP Đà Lạt"]
      }
    },
   
  };


  const [dateRange, setDateRange] = useState([
  moment(), // Ngày bắt đầu (ngày hiện tại)
  moment(), // Ngày kết thúc (ngày hiện tại)
]);


  return (
    <>
    {isLoading && <Loading />}
      <div className="flex items-center justify-between py-4">
      <RangePicker
 
  format="YYYY-MM-DD"
  onChange={(dates, dateStrings) => {
    setDateRange(dates);
    getData(dateStrings[0], dateStrings[1]);
  }}
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
          <Table.Summary.Cell index={9}></Table.Summary.Cell>
          <Table.Summary.Cell index={10}>{formatCurrency(totals.ticketPrice)}</Table.Summary.Cell>
          <Table.Summary.Cell index={11}>{totals.quantity} </Table.Summary.Cell>
          <Table.Summary.Cell index={12}>
            {formatCurrency(totals.ticketPriceDouble)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={13}>
          {totals.quantityDouble}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={14}>
          {formatCurrency(totals.total)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={15}>
          {formatCurrency(totals.cash)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={16}>
          {formatCurrency(totals.transfer)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={17}>
          {formatCurrency(totals.garageCollection)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={18}>
          {formatCurrency(totals.remaining)}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={19}>
           
          </Table.Summary.Cell>
          <Table.Summary.Cell index={20}>
           
          </Table.Summary.Cell>
          <Table.Summary.Cell index={21}></Table.Summary.Cell>
          <Table.Summary.Cell index={22}></Table.Summary.Cell>
         
        </Table.Summary.Row>
      )}
    />

    
    
      <Modal
        title="Hoàn vé"
        visible={isRefundModalOpen}
        onCancel={handleRefundCancel}
        footer={null}
      >
        <Form form={form}  onValuesChange={handleValueChangeRefund}  onFinish={onRefundFinish} layout="vertical">
        <Form.Item name='refundAmount' label="Nhập số tiền hoàn của đơn này">
            <Input placeholder="Nhập số tiền hoàn của đơn này"/>
          </Form.Item>
          <Form.Item name='bank' label="Số tài khoản">
          <TextArea rows={4} placeholder="Nhập số tài khoản" />
           
          </Form.Item>
          <Form.Item name='season' label="Lý do">
          <TextArea rows={4} placeholder="Nhập Lý do" />
           
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
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={handleCombinedChange}
          layout="vertical"
        >
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
              <Form.Item name="trip" label="Chuyến đi">
                <Select style={{ width: "100%" }}>
                  <Option value="SÀI GÒN - ĐÀ LẠT">SÀI GÒN - ĐÀ LẠT</Option>
                  <Option value="ĐÀ LẠT - SÀI GÒN">ĐÀ LẠT - SÀI GÒN</Option>
                 
                  <Option value="BÌNH DƯƠNG - ĐÀ LẠT">
                    BÌNH DƯƠNG - ĐÀ LẠT
                  </Option>
                  <Option value="NHA TRANG - ĐÀ LẠT">NHA TRANG - ĐÀ LẠT</Option>
                  <Option value="NHÀ TRANG - SÀI GÒN">
                    NHÀ TRANG - SÀI GÒN
                  </Option>
               
                  <Option value="ĐÀ LẠT - BÌNH DƯƠNG">
                    ĐÀ LẠT - BÌNH DƯƠNG
                  </Option>
                  <Option value="ĐÀ LẠT - NHA TRANG">ĐÀ LẠT - NHA TRANG</Option>
                  <Option value="SÀI GÒN - NHA TRANG">
                    SÀI GÒN - NHA TRANG
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dateGo" label="Ngày đi">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
            <Form.Item
              name="roundTrip"
              label="Khứ hồi"
              valuePropName="checked"
            >
            <Switch onChange={(checked) => setIsRoundTrip(checked)} />
            </Form.Item>
            </Col>

          

            <Col span={8} >
              {/* <Form.Item name="tripBack" label="Chuyến về"  className={isRoundTrip ? "" : "hidden"}>
                <Select style={{ width: "100%" }}>
                  <Option value="SÀI GÒN - ĐÀ LẠT">SÀI GÒN - ĐÀ LẠT</Option>
                  <Option value="ĐÀ LẠT - SÀI GÒN">ĐÀ LẠT - SÀI GÒN</Option>
                 
                  <Option value="BÌNH DƯƠNG - ĐÀ LẠT">
                    BÌNH DƯƠNG - ĐÀ LẠT
                  </Option>
                  <Option value="NHA TRANG - ĐÀ LẠT">NHA TRANG - ĐÀ LẠT</Option>
                  <Option value="NHÀ TRANG - SÀI GÒN">
                    NHÀ TRANG - SÀI GÒN
                  </Option>
               
                  <Option value="ĐÀ LẠT - BÌNH DƯƠNG">
                    ĐÀ LẠT - BÌNH DƯƠNG
                  </Option>
                  <Option value="ĐÀ LẠT - NHA TRANG">ĐÀ LẠT - NHA TRANG</Option>
                  <Option value="SÀI GÒN - NHA TRANG">
                    SÀI GÒN - NHA TRANG
                  </Option>
                </Select>
              </Form.Item> */}
            </Col>   
            <Col span={8}>
            <Form.Item name="dateBack" label="Ngày về"  className={isRoundTrip ? "" : "hidden"}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col> 



            <Col span={8}>
              <Form.Item name="timeStart" label="Giờ đi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="seats" label="Ghế Đi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="customerName" label="Họ tên khách">
                <Input />
              </Form.Item>
            </Col>



            <Col span={8}>
              <Form.Item name="timeBack" label="Giờ về"  className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="seatsBack" label="Ghế về"  className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
            </Col>

            <Col span={8}>
              <Form.Item name="phoneNumber" label="Số điện thoại khách">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="busCompany" label="Hãng xe">
                <Select
                  
                  style={{ width: "100%" }}
                >
                  <Option value="AA">AA</Option>
                  <Option value="LV">LV</Option>
                  <Option value="LH">LH</Option>
                  <Option value="TQĐ">TQĐ</Option>
                  <Option value="PP">PP</Option>
                  <Option value="KT">KT</Option>
                </Select>
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
            </Col>





            <Col span={8}>
              <Form.Item name="busCompanyBack" label="Hãng xe về"  className={isRoundTrip ? "" : "hidden"}>
                <Select
                  
                  style={{ width: "100%" }}
                >
                  <Option value="AA">AA</Option>
                  <Option value="LV">LV</Option>
                  <Option value="LH">LH</Option>
                  <Option value="TQĐ">TQĐ</Option>
                  <Option value="PP">PP</Option>
                  <Option value="KT">KT</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Số lượng giường đơn">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ticketPrice" label="Đơn giá giường đơn">
                <Input  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantityDouble" label="Số lượng giường đôi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ticketPriceDouble" label="Đơn giá giường đôi">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="quantityBack" label="Số lượng giường đơn vé về"  className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ticketPriceBack" label="Đơn giá giường đơn vé về"   className={isRoundTrip ? "" : "hidden"}>
                <Input  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantityDoubleBack" label="Số lượng giường đôi vé về"   className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ticketPriceDoubleBack" label="Đơn giá giường đôi vé về"   className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>



            <Col span={12}>
  <Form.Item name="pickuplocation" label="Điểm đón">
    <Input placeholder="Nhập điểm đón" />
  </Form.Item>
            </Col>
            <Col span={12}>
  <Form.Item name="paylocation" label="Điểm trả">
    <Input placeholder="Nhập điểm trả" />
  </Form.Item>
            </Col>




            
            <Col span={12}>
  <Form.Item name="pickuplocationBack" label="Điểm đón vé về"  className={isRoundTrip ? "" : "hidden"}>
    <Input placeholder="Nhập điểm đón vé về" />
  </Form.Item>
            </Col>
            <Col span={12}>
  <Form.Item name="paylocationBack" label="Điểm trả vé về"  className={isRoundTrip ? "" : "hidden"}>
    <Input placeholder="Nhập điểm trả về" />
  </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item name="transfer" label="Chuyển khoản">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cash" label="Tiền mặt">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="garageCollection" label="Nhà xe thu">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="remaining" label="Còn lại">
                <Input disabled addonAfter="VNĐ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="total" label="Tổng cộng">
                <Input disabled addonAfter="VNĐ" />
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
          <Row className="py-4">
            <Col span={24}>
              <Form.Item label="Ghi chú của khách hàng" name="note">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row className="pb-4">
            <Col span={24}>
              <Form.Item label="Thông tin chuyển khoản" name="deposit">
                <TextArea rows={4} />
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
          <Form
          form={form}
          onFinish={onEditFinish}
          onValuesChange={handleCombinedChange}
          layout="vertical"
        >
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
              <Form.Item name="trip" label="Chuyến đi">
                <Select style={{ width: "100%" }}>
                  <Option value="SÀI GÒN - ĐÀ LẠT">SÀI GÒN - ĐÀ LẠT</Option>
                  <Option value="ĐÀ LẠT - SÀI GÒN">ĐÀ LẠT - SÀI GÒN</Option>
                 
                  <Option value="BÌNH DƯƠNG - ĐÀ LẠT">
                    BÌNH DƯƠNG - ĐÀ LẠT
                  </Option>
                  <Option value="NHA TRANG - ĐÀ LẠT">NHA TRANG - ĐÀ LẠT</Option>
                  <Option value="NHÀ TRANG - SÀI GÒN">
                    NHÀ TRANG - SÀI GÒN
                  </Option>
               
                  <Option value="ĐÀ LẠT - BÌNH DƯƠNG">
                    ĐÀ LẠT - BÌNH DƯƠNG
                  </Option>
                  <Option value="ĐÀ LẠT - NHA TRANG">ĐÀ LẠT - NHA TRANG</Option>
                  <Option value="SÀI GÒN - NHA TRANG">
                    SÀI GÒN - NHA TRANG
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dateGo" label="Ngày đi">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
            <Form.Item
              name="roundTrip"
              label="Khứ hồi"
              valuePropName="checked"
              
            >
            <Switch  onChange={(checked) => setIsRoundTrip(checked)} />
            </Form.Item>
            </Col>

          

            <Col span={8} >
              {/* <Form.Item name="tripBack" label="Chuyến về"  className={isRoundTrip ? "" : "hidden"}>
                <Select style={{ width: "100%" }}>
                  <Option value="SÀI GÒN - ĐÀ LẠT">SÀI GÒN - ĐÀ LẠT</Option>
                  <Option value="ĐÀ LẠT - SÀI GÒN">ĐÀ LẠT - SÀI GÒN</Option>
                 
                  <Option value="BÌNH DƯƠNG - ĐÀ LẠT">
                    BÌNH DƯƠNG - ĐÀ LẠT
                  </Option>
                  <Option value="NHA TRANG - ĐÀ LẠT">NHA TRANG - ĐÀ LẠT</Option>
                  <Option value="NHÀ TRANG - SÀI GÒN">
                    NHÀ TRANG - SÀI GÒN
                  </Option>
               
                  <Option value="ĐÀ LẠT - BÌNH DƯƠNG">
                    ĐÀ LẠT - BÌNH DƯƠNG
                  </Option>
                  <Option value="ĐÀ LẠT - NHA TRANG">ĐÀ LẠT - NHA TRANG</Option>
                  <Option value="SÀI GÒN - NHA TRANG">
                    SÀI GÒN - NHA TRANG
                  </Option>
                </Select>
              </Form.Item> */}
            </Col>   
            <Col span={8}>
            <Form.Item name="dateBack" label="Ngày về"  className={isRoundTrip ? "" : "hidden"}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col> 



            <Col span={8}>
              <Form.Item name="timeStart" label="Giờ đi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="seats" label="Ghế Đi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="customerName" label="Họ tên khách">
                <Input />
              </Form.Item>
            </Col>



            <Col span={8}>
              <Form.Item name="timeBack" label="Giờ về"  className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="seatsBack" label="Ghế về"  className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
            </Col>

            <Col span={8}>
              <Form.Item name="phoneNumber" label="Số điện thoại khách">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="busCompany" label="Hãng xe">
                <Select
                  
                  style={{ width: "100%" }}
                >
                  <Option value="AA">AA</Option>
                  <Option value="LV">LV</Option>
                  <Option value="LH">LH</Option>
                  <Option value="TQĐ">TQĐ</Option>
                  <Option value="PP">PP</Option>
                  <Option value="KT">KT</Option>
                </Select>
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
            </Col>





            <Col span={8}>
              <Form.Item name="busCompanyBack" label="Hãng xe về"  className={isRoundTrip ? "" : "hidden"}>
                <Select
                  
                  style={{ width: "100%" }}
                >
                  <Option value="AA">AA</Option>
                  <Option value="LV">LV</Option>
                  <Option value="LH">LH</Option>
                  <Option value="TQĐ">TQĐ</Option>
                  <Option value="PP">PP</Option>
                  <Option value="KT">KT</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Số lượng giường đơn">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ticketPrice" label="Đơn giá giường đơn">
                <Input  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantityDouble" label="Số lượng giường đôi">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ticketPriceDouble" label="Đơn giá giường đôi">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="quantityBack" label="Số lượng giường đơn vé về"  className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ticketPriceBack" label="Đơn giá giường đơn vé về"   className={isRoundTrip ? "" : "hidden"}>
                <Input  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantityDoubleBack" label="Số lượng giường đôi vé về"   className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ticketPriceDoubleBack" label="Đơn giá giường đôi vé về"   className={isRoundTrip ? "" : "hidden"}>
                <Input />
              </Form.Item>
            </Col>



            <Col span={12}>
  <Form.Item name="pickuplocation" label="Điểm đón">
    <Input placeholder="Nhập điểm đón" />
  </Form.Item>
            </Col>
            <Col span={12}>
  <Form.Item name="paylocation" label="Điểm trả">
    <Input placeholder="Nhập điểm trả" />
  </Form.Item>
            </Col>




            
            <Col span={12}>
  <Form.Item name="pickuplocationBack" label="Điểm đón vé về"  className={isRoundTrip ? "" : "hidden"}>
    <Input placeholder="Nhập điểm đón vé về" />
  </Form.Item>
            </Col>
            <Col span={12}>
  <Form.Item name="paylocationBack" label="Điểm trả vé về"  className={isRoundTrip ? "" : "hidden"}>
    <Input placeholder="Nhập điểm trả về" />
  </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item name="transfer" label="Chuyển khoản">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cash" label="Tiền mặt">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="garageCollection" label="Nhà xe thu">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="remaining" label="Còn lại">
                <Input disabled addonAfter="VNĐ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="total" label="Tổng cộng">
                <Input disabled addonAfter="VNĐ" />
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
          <Row className="py-4">
            <Col span={24}>
              <Form.Item label="Ghi chú của khách hàng" name="note">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row className="pb-4">
            <Col span={24}>
              <Form.Item label="Thông tin chuyển khoản" name="deposit">
                <TextArea rows={4} />
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
    </>
  );
};

export default Tables;
