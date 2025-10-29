import { Alert, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  Edit,
  ListButton,
  SelectInput,
  ShowButton,
  SimpleForm,
  TopToolbar,
  useNotify,
  useRecordContext,
  useRedirect,
} from "react-admin";

const paymentStatusChoices = [
  { id: 0, name: "Đang chờ" },
  { id: 1, name: "Hoàn thành" },
  { id: 2, name: "Thất bại" },
];

// Edit Actions
const EditActions = () => (
  <TopToolbar>
    <ShowButton />
    <ListButton />
  </TopToolbar>
);

// Payment Info Display
const PaymentInfoPanel = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getMethodLabel = (method: number) => {
    switch (method) {
      case 0:
        return "Tiền mặt";
      case 1:
        return "Thẻ tín dụng";
      case 2:
        return "Bảo hiểm";
      case 3:
        return "Trực tuyến";
      default:
        return "Không xác định";
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thông tin thanh toán hiện tại
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Mã thanh toán
            </Typography>
            <Typography variant="body1">#{record.id}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Booking
            </Typography>
            <Typography variant="body1">#{record.bookingId}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Số tiền
            </Typography>
            <Typography variant="h6" color="primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(record.amount)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Phương thức
            </Typography>
            <Typography variant="body1">
              {getMethodLabel(record.method)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Thời gian thanh toán
            </Typography>
            <Typography variant="body1">
              {new Date(record.paidAt).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const PaymentEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data: any) => {
    console.log("✅ Update success, returned data:", data);
    notify("Cập nhật trạng thái thanh toán thành công", { type: "success" });
    redirect("show", "payments", data.id);
  };

  const onError = (error: any) => {
    console.error("❌ Update error:", error);
    notify("Lỗi khi cập nhật trạng thái thanh toán", { type: "error" });
  };

  const transform = (data: any) => {
    console.log("📤 Sending data to API:", { status: data.status });
    // Only send status field to match PaymentUpdateDto
    return {
      status: data.status,
    };
  };

  return (
    <Edit
      mutationOptions={{ onSuccess, onError }}
      transform={transform}
      actions={<EditActions />}
      mutationMode="pessimistic"
    >
      <SimpleForm>
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          <Typography variant="h5" gutterBottom>
            Cập nhật trạng thái thanh toán
          </Typography>

          <PaymentInfoPanel />

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Lưu ý khi thay đổi trạng thái:</strong>
            </Typography>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li>
                <strong>Hoàn thành:</strong> Booking sẽ tự động chuyển sang
                trạng thái "Completed"
              </li>
              <li>
                <strong>Thất bại:</strong> Booking sẽ bị hủy và lịch hẹn sẽ được
                mở lại
              </li>
              <li>Hệ thống sẽ tự động gửi thông báo cho bệnh nhân</li>
            </ul>
          </Alert>

          <SelectInput
            source="status"
            label="Trạng thái thanh toán"
            choices={paymentStatusChoices}
            fullWidth
            helperText="Chọn trạng thái mới cho thanh toán"
          />

          <Box sx={{ mt: 3, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
            <Typography variant="body2">
              ⚠️ <strong>Cảnh báo:</strong> Việc thay đổi trạng thái thanh toán
              sẽ ảnh hưởng trực tiếp đến trạng thái của booking và lịch hẹn. Vui
              lòng kiểm tra kỹ trước khi lưu.
            </Typography>
          </Box>
        </Box>
      </SimpleForm>
    </Edit>
  );
};
