import {
  Cake,
  Email,
  Home,
  Person,
  Phone,
  Star,
  Wc,
} from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import React from "react";
import {
  Datagrid,
  DateField,
  FunctionField,
  ReferenceManyField,
  Show,
  ShowButton,
  Tab,
  TabbedShowLayout,
  TextField,
  useRecordContext,
} from "react-admin";

const PatientTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Bệnh nhân: ${record.fullName}` : ""}</span>;
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

const PatientInfoCard: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  const genderMap: Record<string, string> = {
    Male: "Nam",
    Female: "Nữ",
    Other: "Khác",
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thông tin cá nhân
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
          <InfoField icon={<Person />} label="Họ tên" value={record.fullName} />
          <InfoField
            icon={<Cake />}
            label="Ngày sinh"
            value={new Date(record.dateOfBirth).toLocaleDateString("vi-VN")}
          />
          <InfoField
            icon={<Wc />}
            label="Giới tính"
            value={genderMap[record.gender] || record.gender}
          />
          <InfoField icon={<Email />} label="Email" value={record.email} />
          <InfoField icon={<Phone />} label="Điện thoại" value={record.phone} />
          <InfoField icon={<Home />} label="Địa chỉ" value={record.address} />
        </Box>
      </CardContent>
    </Card>
  );
};

export const PatientShow: React.FC = () => (
  <Show title={<PatientTitle />}>
    <TabbedShowLayout>
      <Tab label="Thông tin chung">
        <PatientInfoCard />
      </Tab>

      <Tab label="Lịch hẹn" path="bookings">
        <ReferenceManyField
          reference="bookings"
          target="patientId"
          label="Danh sách lịch hẹn"
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="id" label="ID" />
            <DateField
              source="createdAt"
              label="Ngày tạo"
              locales="vi-VN"
              showTime
            />
            <TextField source="doctorName" label="Bác sĩ" />
            <TextField source="serviceName" label="Dịch vụ" />
            <FunctionField
              label="Trạng thái"
              render={(record: any) => {
                const statusColors: Record<
                  string,
                  "default" | "primary" | "success" | "error"
                > = {
                  Pending: "default",
                  Confirmed: "primary",
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
                    label={statusLabels[record.status] || record.status}
                    color={statusColors[record.status] || "default"}
                    size="small"
                  />
                );
              }}
            />
            <ShowButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>

      <Tab label="Hồ sơ khám bệnh" path="medical-records">
        <ReferenceManyField
          reference="medical-records"
          target="patientId"
          label="Hồ sơ khám bệnh"
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="id" label="ID" />
            <DateField source="recordedAt" label="Ngày khám" locales="vi-VN" />
            <TextField source="description" label="Mô tả" />
            <TextField source="diagnosis" label="Chẩn đoán" />
            <ShowButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>

      <Tab label="Đánh giá" path="feedbacks">
        <ReferenceManyField
          reference="feedbacks"
          target="patientId"
          label="Đánh giá của bệnh nhân"
        >
          <Datagrid bulkActionButtons={false}>
            <TextField source="id" label="ID" />
            <TextField source="doctorName" label="Bác sĩ" />
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
            <DateField
              source="createdAt"
              label="Ngày đánh giá"
              locales="vi-VN"
            />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
