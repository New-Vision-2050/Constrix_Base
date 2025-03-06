export type ArabicDataItem = {
  id: number;
  companyLogo: string;
  title: string;
  userName: string;
  email: string;
  type: string;
  Bouquet: string;
  responsible: string;
  expireAt: string;
  dataStatus: "pending" | "success"; 
  theStatus: "active" | "inactive"; 
};

export const arabicData: ArabicDataItem[] = [
  {
    id: 0,
    companyLogo: "/images/el-anwar-company.png",
    title: "شركة الانوار",
    userName: "amiccoo",
    email: "susanna.Lind57@gmail.com",
    type: "خدمات اليكترونية",
    Bouquet: "plus",
    responsible: "محمد خالد",
    expireAt: "08/10/2025",
    dataStatus: "pending",
    theStatus: "inactive",
  },
  {
    id: 1,
    companyLogo: "/images/el-anwar-company.png",
    title: "شركة الانوار",
    userName: "amiccoo",
    email: "susanna.Lind57@gmail.com",
    type: "خدمات اليكترونية",
    Bouquet: "plus",
    responsible: "محمد خالد",
    expireAt: "08/10/2025",
    dataStatus: "success",
    theStatus: "active",
  },
  {
    id: 2,
    companyLogo: "/images/el-anwar-company.png",
    title: "شركة الانوار",
    userName: "amiccoo",
    email: "susanna.Lind57@gmail.com",
    type: "خدمات اليكترونية",
    Bouquet: "plus",
    responsible: "محمد خالد",
    expireAt: "08/10/2025",
    dataStatus: "pending",
    theStatus: "active",
  },
];
