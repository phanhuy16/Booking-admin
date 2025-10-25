import {
  AccessTime,
  CalendarToday,
  CheckCircle,
  EventNote,
  Person,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import {
  Datagrid,
  DateField,
  FunctionField,
  ReferenceManyField,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
} from "react-admin";

const ScheduleTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Lịch làm việc: ${record.doctorName}` : ""}</span>;
};

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

const ScheduleInfoCard: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thông tin lịch làm việc
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField
              icon={<Person />}
              label="Bác sĩ"
              value={record.doctorName}
            />
            <InfoField
              icon={<CalendarToday />}
              label="Ngày làm việc"
              value={new Date(record.date).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField
              icon={<AccessTime />}
              label="Giờ làm việc"
              value={`${formatTime(record.startTime)} - ${formatTime(
                record.endTime
              )}`}
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
                  {record.isAvailable ? (
                    <Chip label="Còn trống" color="success" size="small" />
                  ) : (
                    <Chip label="Đã đầy" color="default" size="small" />
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" gap={2}>
          <EventNote color="primary" />
          <Typography variant="body2">
            <strong>{record.totalBookings || 0}</strong> lịch hẹn đã đặt
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const ScheduleShow: React.FC = () => (
  <Show title={<ScheduleTitle />}>
    <SimpleShowLayout>
      <ScheduleInfoCard />

      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Danh sách lịch hẹn
        </Typography>
        <ReferenceManyField
          reference="bookings"
          target="scheduleId"
          label={false}
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="id" label="ID" />
            <TextField source="patientName" label="Bệnh nhân" />
            <TextField source="serviceName" label="Dịch vụ" />
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

// Helper function
const formatTime = (timeSpan: string): string => {
  if (!timeSpan) return "N/A";
  const parts = timeSpan.split(":");
  return `${parts[0]}:${parts[1]}`;
};
