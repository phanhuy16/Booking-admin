import {
  CalendarToday,
  MedicalServices,
  Payment,
  Person,
  Schedule,
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
  DateField,
  EditButton,
  FunctionField,
  Show,
  TopToolbar,
  useRecordContext,
} from "react-admin";

const BookingTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Lịch hẹn #${record.id}` : ""}</span>;
};

const BookingActions = () => (
  <TopToolbar>
    <EditButton label="Cập nhật trạng thái" />
  </TopToolbar>
);

const InfoSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Box mr={1} color="primary.main">
          {icon}
        </Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {children}
    </CardContent>
  </Card>
);

const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const statusColors: Record<string, any> = {
    Pending: "warning",
    Confirmed: "info",
    Completed: "success",
    Cancelled: "error",
  };

  const statusLabels: Record<string, string> = {
    Pending: "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  return (
    <Chip
      label={statusLabels[status] || status}
      color={statusColors[status] || "default"}
      sx={{ fontSize: "1rem", padding: "20px 10px" }}
    />
  );
};

export const BookingShow: React.FC = () => {
  const record = useRecordContext();

  return (
    <Show title={<BookingTitle />} actions={<BookingActions />}>
      <Box p={2}>
        <Grid container spacing={3}>
          {/* Trạng thái và thông tin cơ bản */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Lịch hẹn #{record?.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Đặt lúc:{" "}
                      <DateField source="createdAt" showTime locales="vi-VN" />
                    </Typography>
                  </Box>
                  <FunctionField
                    render={(record: any) => (
                      <StatusChip status={record.status} />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Thông tin bệnh nhân */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoSection icon={<Person />} title="Thông tin bệnh nhân">
              <FunctionField
                render={(record: any) => (
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {record.patientName || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {record.patientId}
                    </Typography>
                  </Box>
                )}
              />
            </InfoSection>
          </Grid>

          {/* Thông tin bác sĩ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoSection icon={<Person />} title="Thông tin bác sĩ">
              <FunctionField
                render={(record: any) => (
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {record.doctorName || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {record.doctorId}
                    </Typography>
                  </Box>
                )}
              />
            </InfoSection>
          </Grid>

          {/* Thông tin dịch vụ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoSection icon={<MedicalServices />} title="Dịch vụ khám">
              <FunctionField
                render={(record: any) => (
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {record.serviceName || record.serviceTitle || "N/A"}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      {record.servicePrice?.toLocaleString("vi-VN")} ₫
                    </Typography>
                  </Box>
                )}
              />
            </InfoSection>
          </Grid>

          {/* Thông tin lịch khám */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoSection icon={<Schedule />} title="Lịch khám">
              <FunctionField
                render={(record: any) => (
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body1">
                        {record.scheduleDate
                          ? new Date(record.scheduleDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Thời gian:{" "}
                      {record.scheduleStartTime && record.scheduleEndTime
                        ? `${record.scheduleStartTime} - ${record.scheduleEndTime}`
                        : "N/A"}
                    </Typography>
                  </Box>
                )}
              />
            </InfoSection>
          </Grid>

          {/* Thông tin thanh toán */}
          <Grid size={{ xs: 12 }}>
            <InfoSection icon={<Payment />} title="Thông tin thanh toán">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    Tổng chi phí
                  </Typography>
                  <FunctionField
                    render={(record: any) => (
                      <Typography variant="h5" color="primary">
                        {record.servicePrice?.toLocaleString("vi-VN")} ₫
                      </Typography>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    Trạng thái thanh toán
                  </Typography>
                  <FunctionField
                    render={(record: any) => (
                      <Chip
                        label={
                          record.status === "Completed"
                            ? "Đã thanh toán"
                            : record.status === "Confirmed"
                            ? "Chờ thanh toán"
                            : "Chưa thanh toán"
                        }
                        color={
                          record.status === "Completed" ? "success" : "warning"
                        }
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </InfoSection>
          </Grid>
        </Grid>
      </Box>
    </Show>
  );
};
