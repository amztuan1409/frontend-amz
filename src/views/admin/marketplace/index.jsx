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
import numeral from "numeral";
import * as XLSX from "xlsx"; // Import all exports from 'xlsx'
import Loading from "views/public/Loading";
const Marketplace = () => {
  
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const getData = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get("http://103.72.98.164:8800/api/bookings");
      const modifiedData = res.data.map((item) => {
        const { createdAt, updatedAt, __v, username, ...rest } = item;
        return rest;
      });
      setData(modifiedData);
      setFilteredData(modifiedData); // Set both data and filteredData after fetch
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getData(); // Gọi ngay lần đầu để không phải chờ
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
      render: formatDate,
     
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
      
      render: formatDate,
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
        record.phoneNumber && // Kiểm tra nếu phoneNumber không phải là null hoặc undefined
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
      dataIndex: "ticketPriceDouble",
      key: "ticketPriceDouble",
      render: formatCurrency,
    },
    {
      title: "Số ghế",
      dataIndex: "seats",
      key: "seats",
     
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
      width :150
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
             disabled
              
            danger
           
          >
            Xoá vé
          </Button>
        </React.Fragment>
      ),
    },
  ];
  const showRefundModal = (id) => {
    setSelectedRefundId(id); // Lưu trữ ID đơn hàng vào state
    setIsRefundModalOpen(true);
  };
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

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
};
  const exportToExcel = () => {
    // Loại bỏ trường _id từ mỗi đối tượng trong filteredData
    const filteredDataFormatted = filteredData.map(item => {
      const { _id, date, dateGo, dateBack, ...rest } = item;
      return {
          ...rest,
          date: formatDateString(date),
          dateGo: formatDateString(dateGo),
          dateBack: formatDateString(dateBack)
      };
  });

    // Chuyển đổi mảng đã lọc thành một worksheet Excel
    const worksheet = XLSX.utils.json_to_sheet(filteredDataFormatted);

    // Tạo một workbook mới
    const workbook = XLSX.utils.book_new();

    // Thêm worksheet vào workbook với tên là "Bookings"
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Ghi workbook ra tệp "bookings.xlsx"
    XLSX.writeFile(workbook, "bookings.xlsx");
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
  const handleRefundCancel = () => {
    setIsRefundModalOpen(false);
  };

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

  

  return (
    <>
         {isLoading && <Loading />}
      <div className="flex items-center justify-between">
        <h1>BẢNG TẤT CẢ ĐƠN BOOKING</h1>
        <Button type="primary" onClick={exportToExcel}>
          Xuất Excel
        </Button>
      </div>
      <Table
  columns={columns}
  dataSource={filteredData}
  scroll={{ x: "max-content" }}
  onChange={handleFilter}
  onFilterDropdownVisibleChange={clearFilters}
  rowClassName={(record) => {
    if (!record.isPayment ) {
      return 'row-not-paid';
    } else if (record.garageCollection > 0 || record.remaining > 0) {
      return 'row-transfer-positive';
    }
   
    return '';
  }}
/>

  
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
    </>
  );
};

export default Marketplace;
