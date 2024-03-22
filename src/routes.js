import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import Doanhso from "views/admin/doanhso";
import Account from "views/admin/account";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";
import DataTablesADS from "./views/admin/tableads";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

const routes = [
  {
    name: "Trang chủ",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    role: "admin",
  },
  {
    name: "Doanh số nhân viên",
    layout: "/admin",
    path: "bao-cao-tong",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <Doanhso />,
    role: "admin",
  },
  {
    name: "Tất cả đơn",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
    role: "admin",
  },
  {
    name: "Nhân viên nhập liệu",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
    role: "employee",
  },
  {
    name: "ADS nhập liệu",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-ads",
    component: <DataTablesADS />,
    role: "mkt",
  },
  {
    name: "Bản thân",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Quản lý tài khoản",
    layout: "/admin",
    path: "accont",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Account />,
    role: "admin",
  },
];
export default routes;
