export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  authRequired?: boolean; // <-- Yeh line add karein
  submenu?: Menu[];
};
