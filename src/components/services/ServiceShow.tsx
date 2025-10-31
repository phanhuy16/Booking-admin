import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
  useRecordContext,
  ReferenceManyField,
  Datagrid,
  DateField,
} from "react-admin";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  AttachMoney,
  AccessTime,
  CheckCircle,
  Description,
  EventNote,
} from "@mui/icons-material";

// DÙNG SỐ (0, 1) thay vì chuỗi
const SERVICE_STATUS: Record<
  number,
  { label: string; color: "success" | "default" | "warning" }
> = {
  0: { label: "Hoạt động", color: "success" },
  1: { label: "Ngưng hoạt động", color: "default" },
  // Bỏ Pending nếu backend không có
};

// Format VND
const formatVND = (value: number) => {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("vi-VN").format(value);
};

// Format duration
const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
};

// Title component
const ServiceShowTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Dịch vụ: ${record.title}` : ""}</span>;
};

// Info Field component
const InfoField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: any;
}> = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Box mr={2} color="primary.main">
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "N/A"}</Typography>
    </Box>
  </Box>
);

// Service Info Card
const ServiceInfoCard: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  const statusKey = record.status as number;
  const status = SERVICE_STATUS[statusKey] || SERVICE_STATUS[1];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thông tin dịch vụ
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoField
              icon={<EventNote />}
              label="Tên dịch vụ"
              value={record.title}
            />
            <InfoField
              icon={<AttachMoney />}
              label="Giá dịch vụ"
              value={
                <Box sx={{ fontWeight: 600, color: "success.main" }}>
                  {formatVND(record.price)}
                </Box>
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoField
              icon={<AccessTime />}
              label="Thời gian thực hiện"
              value={formatDuration(record.durationInMinutes)}
            />
            <Box display="flex" alignItems="center" mb={2}>
              <Box mr={2} color="primary.main">
                <CheckCircle />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Trạng thái
                </Typography>
                <Box>
                  <Chip
                    label={status.label}
                    color={status.color as any}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {record.description && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" alignItems="flex-start" gap={2}>
              <Description color="primary" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Mô tả
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {record.description}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const ServiceShow: React.FC = () => (
  <Show title={<ServiceShowTitle />}>
    <SimpleShowLayout>
      <ServiceInfoCard />

      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Lịch sử booking
        </Typography>
        <ReferenceManyField
          reference="bookings"
          target="serviceId"
          label={false}
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="id" label="ID" />
            <TextField source="patientName" label="Bệnh nhân" />
            <TextField source="doctorName" label="Bác sĩ" />
            <DateField
              source="createdAt"
              label="Ngày đặt"
              showTime
              locales="vi-VN"
            />
            <FunctionField
              label="Trạng thái"
              render={(record: any) => {
                const colors: Record<string, any> = {
                  Pending: "default",
                  Confirmed: "primary",
                  Completed: "success",
                  Cancelled: "error",
                };
                const labels: Record<string, string> = {
                  Pending: "Chờ xác nhận",
                  Confirmed: "Đã xác nhận",
                  Completed: "Hoàn thành",
                  Cancelled: "Đã hủy",
                };
                return (
                  <Chip
                    label={labels[record.status] || record.status}
                    color={colors[record.status] || "default"}
                    size="small"
                  />
                );
              }}
            />
          </Datagrid>
        </ReferenceManyField>
      </Box>
    </SimpleShowLayout>
  </Show>
);
