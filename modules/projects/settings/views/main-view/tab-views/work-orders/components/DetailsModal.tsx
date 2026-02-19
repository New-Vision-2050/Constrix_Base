import React, { Dispatch, SetStateAction } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 800 }, // عرض المودال
  bgcolor: "#1a1a2e", // اللون الداكن من الصورة
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  color: "white",
  outline: "none",
};

const DetailsModal = ({
  open,
  setOpenModal,
  title,
}: {
  open: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  title: string;
}) => {
  // بيانات تجريبية لمحاكاة الصورة
  const data = [
    { id: 401, desc: "تركيب عداد" },
    { id: 402, desc: "ضخ وتمديد" },
    { id: 403, desc: "سيفتي - قص - ضخ - تمديد" },
  ];

  return (
    <Modal open={open} onClose={() => setOpenModal(false)}>
      <Box sx={style}>
        {/* زر الإغلاق */}
        <IconButton
          onClick={() => setOpenModal(false)}
          sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>

        {/* العنوان الرئيسي */}
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          {title || "عرض نوع امر العمل"}
        </Typography>

        <Grid container spacing={4} direction="row-reverse">
          {" "}
          {/* اتجاه اليمين لليسار */}
          {/* العمود الأول: مهام امر العمل */}
          <Grid item xs={12} md={6}>
            <Typography textAlign="center" sx={{ mb: 2, color: "#bbb" }}>
              مهام امر العمل
            </Typography>
            <CustomTable data={data} />
          </Grid>
          {/* العمود الثاني: اجراءات امر العمل */}
          <Grid item xs={12} md={6}>
            <Typography textAlign="center" sx={{ mb: 2, color: "#bbb" }}>
              اجراءات امر العمل
            </Typography>
            <CustomTable data={data} />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

// مكون الجدول الداخلي الصغير
const CustomTable = ({ data }: { data: object[] }) => (
  <TableContainer
    component={Paper}
    sx={{ bgcolor: "transparent", boxShadow: "none" }}
  >
    <Table size="small">
      <TableHead sx={{ bgcolor: "#2d1b4d" }}>
        {" "}
        {/* لون الهيدر البنفسجي الغامق */}
        <TableRow>
          <TableCell
            align="center"
            sx={{ color: "white", borderBottom: "none" }}
          >
            الرقم
          </TableCell>
          <TableCell
            align="right"
            sx={{ color: "white", borderBottom: "none" }}
          >
            الوصف
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(() => (
          <TableRow
            key={"row.id"}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell
              align="center"
              sx={{
                color: "#fff",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {"row.id2"}
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: "#fff",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              row desc
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DetailsModal;
