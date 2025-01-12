import { Chip } from "@nextui-org/react";

const sectionItems = [
  {
    key: "overview",
    title: "Overview",
    items: [
      {
        key: "dashboard",
        href: "/dashboard",
        icon: "solar:home-2-linear",
        title: "Dashboard",
      },
      {
        key: "insights",
        href: "/insights",
        icon: "solar:widget-2-outline",
        title: "Insights",
        endContent: (
          <Chip size="sm" variant="flat">
            New
          </Chip>
        ),
      },
      {
        key: "views",
        href: "/views",
        icon: "solar:checklist-minimalistic-outline",
        title: "Views",
        // endContent: (
        //   <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
        // ),
      },
      {
        key: "strategies",
        href: "/strategies",
        icon: "solar:users-group-two-rounded-outline",
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
        href: "#",
        title: "Cap Table",
        icon: "solar:pie-chart-2-outline",
        items: [
          {
            key: "shareholders",
            href: "#",
            title: "Shareholders",
          },
          {
            key: "note_holders",
            href: "#",
            title: "Note Holders",
          },
          {
            key: "transactions_log",
            href: "#",
            title: "Transactions Log",
          },
        ],
      },
      {
        key: "analytics",
        href: "#",
        icon: "solar:chart-outline",
        title: "Analytics",
      },
      {
        key: "perks",
        href: "/perks",
        icon: "solar:gift-linear",
        title: "Perks",
        endContent: (
          <Chip size="sm" variant="flat">
            3
          </Chip>
        ),
      },
      {
        key: "expenses",
        href: "#",
        icon: "solar:bill-list-outline",
        title: "Expenses",
      },
      {
        key: "settings",
        href: "/settings",
        icon: "solar:settings-outline",
        title: "Settings",
      },
    ],
  },
];

export default sectionItems;
