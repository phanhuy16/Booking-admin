import React from "react";
import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  DateInput,
  BooleanInput,
  required,
  TimeInput,
} from "react-admin";
import { Box, Typography, Alert } from "@mui/material";

// Validation cho thời gian
const validateStartTime = (value: any, allValues: any) => {
  if (!value) return "Giờ bắt đầu là bắt buộc";

  // Kiểm tra nếu có endTime, startTime phải nhỏ hơn endTime
  if (allValues.endTime) {
    const start = convertTimeToMinutes(value);
    const end = convertTimeToMinutes(allValues.endTime);

    if (start >= end) {
      return "Giờ bắt đầu phải nhỏ hơn giờ kết thúc";
    }
  }

  return undefined;
};

const validateEndTime = (value: any, allValues: any) => {
  if (!value) return "Giờ kết thúc là bắt buộc";

  // Kiểm tra nếu có startTime, endTime phải lớn hơn startTime
  if (allValues.startTime) {
    const start = convertTimeToMinutes(allValues.startTime);
    const end = convertTimeToMinutes(value);

    if (end <= start) {
      return "Giờ kết thúc phải lớn hơn giờ bắt đầu";
    }
  }

  return undefined;
};

// Helper: Convert time string to minutes for comparison
const convertTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
};

export const ScheduleCreate: React.FC = () => {
  // Transform data trước khi submit
  const transform = (data: any) => {
    // Parse time to ensure correct format
    const parseTime = (time: string) => {
      if (!time) return "00:00:00";
      // If format is HH:mm, add :00
      if (time.length === 5) {
        return `${time}:00`;
      }
      // If format is HH:mm:ss, return as is
      return time;
    };

    const transformed = {
      doctorId: parseInt(data.doctorId),
      date: data.date, // ISO string format: "2025-11-01"
      startTime: parseTime(data.startTime),
      endTime: parseTime(data.endTime),
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    };

    return transformed;
  };

  return (
    <Create redirect="list" transform={transform}>
      <SimpleForm>
        <Typography variant="h6" gutterBottom>
          Tạo lịch làm việc mới
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Chọn bác sĩ, ngày và thời gian làm việc. Hệ thống sẽ tự động tạo
            lịch làm việc cho bác sĩ trong khoảng thời gian đã chọn.
          </Typography>
        </Alert>

        <ReferenceInput source="doctorId" reference="doctors" label="Bác sĩ">
          <SelectInput
            optionText="fullName"
            validate={required("Vui lòng chọn bác sĩ")}
            fullWidth
          />
        </ReferenceInput>

        <DateInput
          source="date"
          label="Ngày làm việc"
          validate={required("Vui lòng chọn ngày làm việc")}
          fullWidth
          helperText="Chọn ngày bác sĩ sẽ làm việc"
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="primary">
            Thời gian làm việc
          </Typography>
        </Box>

        <Box display="flex" gap={2} width="100%">
          <TimeInput
            source="startTime"
            label="Giờ bắt đầu"
            validate={validateStartTime}
            helperText="Chọn giờ bắt đầu làm việc"
            defaultValue="08:00"
            parse={(value) => {
              // Đảm bảo format HH:mm
              if (!value) return null;
              return value.length === 5 ? value : value.substring(0, 5);
            }}
            format={(value) => {
              // Format từ HH:mm:ss hoặc HH:mm về HH:mm
              if (!value) return "";
              return value.substring(0, 5);
            }}
            sx={{ flex: 1 }}
          />

          <TimeInput
            source="endTime"
            label="Giờ kết thúc"
            validate={validateEndTime}
            helperText="Chọn giờ kết thúc làm việc"
            defaultValue="17:00"
            parse={(value) => {
              if (!value) return null;
              return value.length === 5 ? value : value.substring(0, 5);
            }}
            format={(value) => {
              if (!value) return "";
              return value.substring(0, 5);
            }}
            sx={{ flex: 1 }}
          />
        </Box>

        <BooleanInput
          source="isAvailable"
          label="Còn trống (cho phép đặt lịch)"
          defaultValue={true}
          helperText="Bật nếu bác sĩ còn nhận lịch hẹn trong khung giờ này"
        />

        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>💡 Mẹo:</strong> Click vào ô giờ để chọn từ bảng thời gian,
            hoặc nhập trực tiếp theo format 24h (VD: 08:00, 14:30)
          </Typography>
        </Alert>
      </SimpleForm>
    </Create>
  );
};
