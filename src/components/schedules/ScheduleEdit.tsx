import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  TimeInput,
  required,
  useRecordContext,
  FunctionField,
} from "react-admin";
import { Box, Typography, Alert, Chip } from "@mui/material";

const ScheduleEditTitle: React.FC = () => {
  const record = useRecordContext();
  return (
    <span>
      {record
        ? `Lịch làm việc: ${record.doctorName} - ${new Date(
            record.date
          ).toLocaleDateString("vi-VN")}`
        : ""}
    </span>
  );
};

export const ScheduleEdit: React.FC = () => {
  return (
    <Edit title={<ScheduleEditTitle />} mutationMode="pessimistic">
      <SimpleForm>
        <TextInput source="id" label="ID" disabled />

        <TextInput source="doctorName" label="Bác sĩ" disabled fullWidth />

        <DateInput
          source="date"
          label="Ngày làm việc"
          validate={required()}
          fullWidth
        />

        <Box display="flex" gap={2} width="100%">
          <TimeInput
            source="startTime"
            label="Giờ bắt đầu"
            validate={required()}
            parse={(value) => {
              if (!value) return null;
              // Convert "HH:mm" to "HH:mm:ss"
              return value.length === 5 ? `${value}:00` : value;
            }}
            format={(value) => {
              if (!value) return "";
              // Convert "HH:mm:ss" to "HH:mm"
              return value.substring(0, 5);
            }}
          />
          <TimeInput
            source="endTime"
            label="Giờ kết thúc"
            validate={required()}
            parse={(value) => {
              if (!value) return null;
              return value.length === 5 ? `${value}:00` : value;
            }}
            format={(value) => {
              if (!value) return "";
              return value.substring(0, 5);
            }}
          />
        </Box>

        <BooleanInput source="isAvailable" label="Còn trống" />

        <FunctionField
          label="Thông tin"
          render={(record: any) => (
            <Box mt={2}>
              <Chip
                label={`${record.totalBookings || 0} lịch hẹn`}
                color={record.totalBookings > 0 ? "primary" : "default"}
                variant="outlined"
              />
              {record.totalBookings > 0 && (
                <Typography
                  variant="caption"
                  color="warning.main"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  ⚠️ Không thể xóa lịch này vì có lịch hẹn
                </Typography>
              )}
            </Box>
          )}
        />

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Cảnh báo:</strong> Thay đổi lịch làm việc có thể ảnh hưởng
            đến các lịch hẹn đã có
          </Typography>
        </Alert>
      </SimpleForm>
    </Edit>
  );
};
