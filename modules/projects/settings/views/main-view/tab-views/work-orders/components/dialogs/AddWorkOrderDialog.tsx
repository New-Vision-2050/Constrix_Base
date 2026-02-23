import { DialogHeader } from "@/components/ui/dialog";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function AddWorkOrderDialog({
  open,
  setOpenModal,
}: {
  open: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <Dialog
      open={open}
      maxWidth={"sm"}
      onClose={handleClose}
      PaperProps={{
        sx: {
          color: "white",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          position: "absolute",
          top: 0,
          right: 0,
        },
      }}
    >
      <DialogContent className="max-w-6xl w-full bg-sidebar">
        <DialogHeader>
          <DialogTitle className="text-start">
            إضافة نوع أمر العمل
          </DialogTitle>
        </DialogHeader>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <CloseIcon />
        </IconButton>

        <div className="flex flex-col gap-4">
          <TextField
            label="كود الاستشاري"
            placeholder="كود الاستشاري"
            // error={!!errors.name}
            // helperText={errors.name?.message}
            // disabled={isSubmitting}
            fullWidth
            size="medium"
          />
          <TextField
            label="وصف أمر العمل"
            placeholder="وصف أمر العمل"
            // error={!!errors.name}
            // helperText={errors.name?.message}
            // disabled={isSubmitting}
            fullWidth
            size="medium"
          />
          <TextField
            label="نوع أمر العمل"
            placeholder="نوع أمر العمل"
            // error={!!errors.name}
            // helperText={errors.name?.message}
            // disabled={isSubmitting}
            fullWidth
            size="medium"
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            // disabled={isSubmitting || isFetching}
            className="w-full"
          >
            حفظ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
