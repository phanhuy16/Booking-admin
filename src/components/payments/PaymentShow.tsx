import SyncIcon from "@mui/icons-material/Sync";
import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import {
  Button,
  DateField,
  DeleteButton,
  EditButton,
  FunctionField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";

// Helper functions (same as List)
const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return "warning";
    case 1:
      return "success";
    case 2:
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return "Đang chờ";
    case 1:
      return "Hoàn thành";
    case 2:
      return "Thất bại";
    default:
      return "Không xác định";
  }
};

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

// Sync Button Component
const SyncBookingButton = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const handleSync = async () => {
    if (!record) return;

    try {
      // Call the sync endpoint
      await dataProvider.update("payments", {
        id: record.id,
        data: { syncBooking: true },
        previousData: record,
      });

      notify("Đã đồng bộ trạng thái booking thành công", { type: "success" });
      refresh();
    } catch (error) {
      notify("Lỗi khi đồng bộ trạng thái booking", { type: "error" });
    }
  };

  return (
    <Button
      label="Đồng bộ Booking"
      onClick={handleSync}
      startIcon={<SyncIcon />}
    />
  );
};

// Show Actions
const ShowActions = () => (
  <TopToolbar>
    <SyncBookingButton />
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

// Status Field
const PaymentStatusField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Chip
      label={getStatusLabel(record.status)}
      color={getStatusColor(record.status)}
      size="medium"
    />
  );
};

export const PaymentShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin thanh toán
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField source="id" label="Mã thanh toán" />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <ReferenceField
                      source="bookingId"
                      reference="bookings"
                      label="Mã booking"
                      link="show"
                    >
                      <TextField source="id" />
                    </ReferenceField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FunctionField
                      label="Số tiền"
                      render={(record: any) => (
                        <Typography variant="h6" color="primary">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(record.amount)}
                        </Typography>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FunctionField
                      label="Phương thức thanh toán"
                      render={(record: any) => (
                        <Typography>{getMethodLabel(record.method)}</Typography>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Trạng thái
                      </Typography>
                      <PaymentStatusField />
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <DateField
                      source="paidAt"
                      label="Thời gian thanh toán"
                      showTime
                      locales="vi-VN"
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Information */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin booking liên quan
              </Typography>

              <ReferenceField source="bookingId" reference="bookings" label="">
                <SimpleShowLayout>
                  <TextField source="id" label="Mã booking" />

                  <ReferenceField
                    source="patientId"
                    reference="patients"
                    label="Bệnh nhân"
                    link={false}
                  >
                    <TextField source="fullName" />
                  </ReferenceField>

                  <ReferenceField
                    source="doctorId"
                    reference="doctors"
                    label="Bác sĩ"
                    link={false}
                  >
                    <TextField source="fullName" />
                  </ReferenceField>

                  <DateField
                    source="appointmentDate"
                    label="Ngày hẹn"
                    locales="vi-VN"
                  />
                </SimpleShowLayout>
              </ReferenceField>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);
