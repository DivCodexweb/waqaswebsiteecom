import { Menu } from "@/types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Popular",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Shop",
    newTab: false,
    path: "/shop-with-sidebar",
  },
  {
    id: 3,
    title: "Collections",
    newTab: false,
    path: "/categories",
  },
    {
    id: 4,
    title: "Brands",
    newTab: false,
    path: "/brands",
  },
  {
    id: 5,
    title: "About",
    newTab: false,
    path: "/About",
  },
  {
    id: 6,
    title: "Contact",
    newTab: false,
    path: "/contact",
  },
  {
    id: 7,
    title: "Blogs",
    newTab: false,
    path: "/blogs/blog-grid",
  },
  {
    id: 8,
    title: "My Account",
    newTab: false,
    path: "/",
    authRequired: true, // Tag added for auth filtering
    submenu: [
      {
        id: 71,
        title: "Profile",
        newTab: false,
        path: "/my-account",
      },
      {
        id: 72,
        title: "Orders",
        newTab: false,
        path: "/orders",
      },
      {
        id: 73,
        title: "Hunt For me",
        newTab: false,
        path: "/wishlist",
      },
    ],
  },
  {
    id: 9,
    title: "Checkout",
    newTab: false,
    path: "/checkout",
  },
];