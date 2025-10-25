import {
  AttachMoney,
  Email,
  MedicalServices,
  Person,
  Phone,
  School,
  Star,
  Work,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import {
  DateField,
  FunctionField,
  NumberField,
  ReferenceManyField,
  Show,
  Datagrid as ShowDatagrid,
  Tab,
  TabbedShowLayout,
  TextField,
  useRecordContext,
} from "react-admin";

const DoctorTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Bác sĩ: ${record.fullName}` : ""}</span>;
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

const DoctorInfoCard: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          {/* Avatar Section */}
          <Grid
            size={{ xs: 12, md: 3 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {record.avatarUrl ? (
              <Avatar
                src={record.avatarUrl}
                alt={record.fullName}
                sx={{ width: 150, height: 150, border: "3px solid #e0e0e0" }}
              >
                <Person sx={{ fontSize: 75 }} />
              </Avatar>
            ) : (
              <Avatar sx={{ width: 150, height: 150, bgcolor: "primary.main" }}>
                <Person sx={{ fontSize: 75 }} />
              </Avatar>
            )}
          </Grid>

          {/* Info Section */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {record.fullName}
              </Typography>

              <Chip
                icon={<MedicalServices />}
                label={record.specialtyName || record.specialty?.name || "N/A"}
                color="primary"
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoField
                    icon={<Email />}
                    label="Email"
                    value={record.email}
                  />
                  <InfoField
                    icon={<Phone />}
                    label="Điện thoại"
                    value={record.phone}
                  />
                  <InfoField
                    icon={<AttachMoney />}
                    label="Phí tư vấn"
                    value={`${record.consultationFee?.toLocaleString()} VND`}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoField
                    icon={<School />}
                    label="Kinh nghiệm"
                    value={`${record.experienceYears} năm`}
                  />
                  <InfoField
                    icon={<Work />}
                    label="Nơi làm việc"
                    value={record.workplace}
                  />
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Mô tả:
                </Typography>
                <Typography variant="body2">
                  {record.description || "Chưa có mô tả"}
                </Typography>
              </Box>

              <Box mt={2} display="flex" alignItems="center" gap={2}>
                <Chip
                  icon={<Star />}
                  label={`Đánh giá: ${
                    record.averageRating?.toFixed(1) || "N/A"
                  }`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label={`${record.totalFeedbacks || 0} lượt đánh giá`}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const DoctorShow: React.FC = () => (
  <Show title={<DoctorTitle />}>
    <TabbedShowLayout>
      <Tab label="Thông tin cơ bản">
        <DoctorInfoCard />
      </Tab>

      <Tab label="Lịch làm việc" path="schedules">
        <ReferenceManyField
          reference="schedules"
          target="doctorId"
          label="Lịch làm việc"
        >
          <ShowDatagrid bulkActionButtons={false}>
            <DateField source="date" label="Ngày" />
            <TextField source="startTime" label="Giờ bắt đầu" />
            <TextField source="endTime" label="Giờ kết thúc" />
            <FunctionField
              label="Trạng thái"
              render={(record: any) => (
                <Chip
                  label={record.isAvailable ? "Còn trống" : "Đã đầy"}
                  color={record.isAvailable ? "success" : "default"}
                  size="small"
                />
              )}
            />
          </ShowDatagrid>
        </ReferenceManyField>
      </Tab>

      <Tab label="Lịch hẹn" path="bookings">
        <ReferenceManyField
          reference="bookings"
          target="doctorId"
          label="Lịch hẹn"
        >
          <ShowDatagrid bulkActionButtons={false}>
            <TextField source="id" label="ID" />
            <DateField source="createdAt" label="Ngày tạo" showTime />
            <TextField source="patientName" label="Bệnh nhân" />
            <TextField source="serviceName" label="Dịch vụ" />
            <FunctionField
              label="Trạng thái"
              render={(record: any) => {
                const colors: Record<string, any> = {
                  Pending: "default",
                  Confirmed: "primary",
                  Completed: "success",
                  Cancelled: "error",
                };
                return (
                  <Chip
                    label={record.status}
                    color={colors[record.status] || "default"}
                    size="small"
                  />
                );
              }}
            />
          </ShowDatagrid>
        </ReferenceManyField>
      </Tab>

      <Tab label="Đánh giá" path="feedbacks">
        <ReferenceManyField
          reference="feedbacks"
          target="doctorId"
          label="Đánh giá từ bệnh nhân"
        >
          <ShowDatagrid bulkActionButtons={false}>
            <TextField source="patientName" label="Bệnh nhân" />
            <FunctionField
              label="Đánh giá"
              render={(record: any) => (
                <Box display="flex" alignItems="center">
                  <Star sx={{ color: "gold", mr: 0.5 }} />
                  <Typography>{record.rating}/5</Typography>
                </Box>
              )}
            />
            <TextField source="comment" label="Nhận xét" />
            <DateField source="createdAt" label="Ngày đánh giá" />
          </ShowDatagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
