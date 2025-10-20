import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
  ReferenceManyField,
  Datagrid as ShowDatagrid,
  useRecordContext,
  EmailField,
  ShowButton,
} from "react-admin";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
} from "@mui/material";
import {
  MedicalServices,
  Description,
  People,
  Person,
  Email,
  Star,
} from "@mui/icons-material";

const SpecialtyTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Chuyên khoa: ${record.name}` : ""}</span>;
};

const SpecialtyInfoCard: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          {/* Icon Section */}
          <Grid
            size={{ xs: 12, md: 3 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {record.iconUrl ? (
              <Avatar
                src={record.iconUrl}
                alt={record.name}
                sx={{ width: 120, height: 120 }}
              />
            ) : (
              <Avatar sx={{ width: 120, height: 120, bgcolor: "primary.main" }}>
                <MedicalServices sx={{ fontSize: 60 }} />
              </Avatar>
            )}
          </Grid>

          {/* Info Section */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {record.name}
              </Typography>

              <Box display="flex" alignItems="center" mb={2}>
                <Description sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body1" color="text.secondary">
                  {record.description || "Chưa có mô tả"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  icon={<People />}
                  label={`${record.doctorCount || 0} bác sĩ`}
                  color="primary"
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

export const SpecialtyShow: React.FC = () => (
  <Show title={<SpecialtyTitle />}>
    <SimpleShowLayout>
      <SpecialtyInfoCard />

      {/* Danh sách bác sĩ trong chuyên khoa */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Danh sách bác sĩ
        </Typography>
        <ReferenceManyField
          reference="doctors"
          target="specialtyId"
          label={false}
        >
          <ShowDatagrid bulkActionButtons={false}>
            <TextField source="id" label="ID" />

            <FunctionField
              label="Avatar"
              render={(record: any) => (
                <Avatar src={record.avatarUrl} alt={record.fullName}>
                  <Person />
                </Avatar>
              )}
            />

            <TextField source="fullName" label="Họ tên" />
            <EmailField source="email" label="Email" />
            <TextField source="phone" label="Điện thoại" />

            <FunctionField
              label="Kinh nghiệm"
              render={(record: any) => `${record.experienceYears || 0} năm`}
            />

            <FunctionField
              label="Đánh giá"
              render={(record: any) => (
                <Box display="flex" alignItems="center">
                  <Star sx={{ color: "gold", mr: 0.5, fontSize: 20 }} />
                  <Typography>{record.rating?.toFixed(1) || "N/A"}</Typography>
                </Box>
              )}
            />

            <ShowButton />
          </ShowDatagrid>
        </ReferenceManyField>
      </Box>
    </SimpleShowLayout>
  </Show>
);
