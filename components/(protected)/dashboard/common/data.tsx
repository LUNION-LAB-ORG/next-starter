import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
    IconUsersGroup,
} from "@tabler/icons-react";

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
      title: "Liste de Biens",
      url: "/dashboard/liste-de-biens",
      icon: IconUsers,
    },
    {
      title: "Nouveau biens",
      url: "/dashboard/biens",
      icon: IconChartBar,
    },
    
    {
      title: "Team",
      url: "#",
      icon: IconUsersGroup,
    },
  ],
 
 
  
};
