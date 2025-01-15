import { MdOutlineDashboard } from "react-icons/md";
import {
  FaRegLightbulb,
  FaRegListAlt,
  FaUsers,
  FaChartPie,
  FaChartLine,
  FaGift,
  FaReceipt,
  FaCog,
} from "react-icons/fa";
import { Chip } from "@nextui-org/react";

export const sectionItems = [
  {
    key: "overview",
    title: "Overview",
    items: [
      {
        key: "dashboard",
        href: "/dashboard",
        icon: <MdOutlineDashboard size={20} />,
        title: "Dashboard",
      },
      {
        key: "insights",
        href: "/insights",
        icon: <FaRegLightbulb size={20} />,
        title: "Insights",
        notification: (
          <Chip size="sm" variant="flat">
            New
          </Chip>
        ),
      },
      {
        key: "views",
        href: "/views",
        icon: <FaRegListAlt size={20} />,
        title: "Views",
      },
      {
        key: "strategies",
        href: "/strategies",
        icon: <FaUsers size={20} />,
        title: "Strategies",
      },
    ],
  },
  {
    key: "organization",
    title: "Organization",
    items: [
      {
        key: "cap_table",
        href: "/cap-table",
        icon: <FaChartPie size={20} />,
        title: "Cap Table",
      },
      {
        key: "analytics",
        href: "/analytics",
        icon: <FaChartLine size={20} />,
        title: "Analytics",
      },
      {
        key: "perks",
        href: "/perks",
        icon: <FaGift size={20} />,
        title: "Perks",
        notification: (
          <Chip size="sm" variant="flat">
            3
          </Chip>
        ),
      },
      {
        key: "expenses",
        href: "/expenses",
        icon: <FaReceipt size={20} />,
        title: "Expenses",
      },
      {
        key: "settings",
        href: "/settings",
        icon: <FaCog size={20} />,
        title: "Settings",
      },
    ],
  },
];
