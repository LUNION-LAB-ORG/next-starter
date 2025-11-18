import { IconDashboard, IconHome2, IconUsersGroup } from "@tabler/icons-react";

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Portefeuille de biens",
      url: "/dashboard/biens",
      icon: IconHome2,
    },
    {
      title: "Team",
      url: "/dashboard/utilisateurs",
      icon: IconUsersGroup,
    },
  ],
};
