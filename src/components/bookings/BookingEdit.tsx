import { Alert, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { Edit, SelectInput, SimpleForm, useRecordContext } from "react-admin";

const bookingStatusChoices = [
  { id: 0, name: "Chờ xác nhận" },
  { id: 1, name: "Đã xác nhận" },
  { id: 2, name: "Hoàn thành" },
  { id: 3, name: "Đã hủy" },
];

const statusStringToNumber: Record<string, number> = {
  Pending: 0,
  Confirmed: 1,
  Completed: 2,
  Cancelled: 3,
};

const BookingEditTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Cập nhật lịch hẹn #${record.id}` : ""}</span>;
};

const BookingInfo: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thông tin lịch hẹn
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Bệnh nhân
            </Typography>
            <Typography variant="body1">
              {record.patientName || `ID: ${record.patientId}`}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Bác sĩ
            </Typography>
            <Typography variant="body1">
              {record.doctorName || `ID: ${record.doctorId}`}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Dịch vụ
            </Typography>
            <Typography variant="body1">
              {record.serviceName || record.serviceTitle || "N/A"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Chi phí
            </Typography>
            <Typography variant="body1" color="primary">
              {record.servicePrice?.toLocaleString("vi-VN")} ₫
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="textSecondary">
              Trạng thái hiện tại
            </Typography>
            <Typography variant="h6" color="primary">
              {typeof record.status === "number"
                ? ["Chờ xác nhận", "Đã xác nhận", "Hoàn thành", "Đã hủy"][
                    record.status
                  ]
                : record.status === "Pending"
                ? "Chờ xác nhận"
                : record.status === "Confirmed"
                ? "Đã xác nhận"
                : record.status === "Completed"
                ? "Hoàn thành"
                : record.status === "Cancelled"
                ? "Đã hủy"
                : record.status}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const BookingEdit: React.FC = () => {
  return (
    <Edit title={<BookingEditTitle />} mutationMode="pessimistic">
      <SimpleForm>
        <BookingInfo />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Cập nhật trạng thái
        </Typography>

        <SelectInput
          source="status"
          label="Status"
          choices={bookingStatusChoices}
          optionValue="id"
          optionText="name"
          format={(value) => {
            if (value == null) return "";
            if (typeof value === "string") {
              return statusStringToNumber[value] ?? "";
            }
            return Number(value);
          }}
        />

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Lưu ý:</strong>
          </Typography>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>
              <strong>Confirmed:</strong> Xác nhận lịch hẹn, hệ thống sẽ tự động
              tạo Payment
            </li>
            <li>
              <strong>Completed:</strong> Hoàn thành khám, cập nhật Payment
              thành Completed
            </li>
            <li>
              <strong>Cancelled:</strong> Hủy lịch, mở lại Schedule và đánh dấu
              Payment Failed
            </li>
          </ul>
        </Alert>
      </SimpleForm>
    </Edit>
  );
};
