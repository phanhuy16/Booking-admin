import React from "react";
import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  DateInput,
  BooleanInput,
  required,
  TextInput,
} from "react-admin";
import { Box, Typography, Alert } from "@mui/material";

// Custom validation
const validateTime = (value: any) => {
  if (!value) return "Giờ là bắt buộc";

  // Check format HH:mm
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(value)) {
    return "Định dạng giờ không hợp lệ (HH:mm)";
  }

  return undefined;
};

export const ScheduleCreate: React.FC = () => {
  // Transform data trước khi submit
  const transform = (data: any) => {
    const transformed = {
      doctorId: parseInt(data.doctorId),
      date: data.date, // ISO string format: "2025-11-01"
      startTime: data.startTime, // "08:00"
      endTime: data.endTime, // "17:00"
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    };
    return transformed;
  };

  return (
    <Create redirect="list" transform={transform}>
      <SimpleForm>
        <Typography variant="h6" gutterBottom>
          Thông tin lịch làm việc
        </Typography>

        <ReferenceInput source="doctorId" reference="doctors" label="Bác sĩ">
          <SelectInput optionText="fullName" validate={required()} fullWidth />
        </ReferenceInput>

        <DateInput
          source="date"
          label="Ngày làm việc"
          validate={required()}
          fullWidth
        />

        <Box display="flex" gap={2} width="100%">
          <TextInput
            source="startTime"
            label="Giờ bắt đầu"
            placeholder="08:00"
            validate={validateTime}
            helperText="Định dạng: HH:mm (VD: 08:00)"
          />
          <TextInput
            source="endTime"
            label="Giờ kết thúc"
            placeholder="17:00"
            validate={validateTime}
            helperText="Định dạng: HH:mm (VD: 17:00)"
          />
        </Box>

        <BooleanInput
          source="isAvailable"
          label="Còn trống"
          defaultValue={true}
        />

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Lưu ý:</strong> Nhập giờ theo định dạng 24h (VD: 08:00,
            13:30, 17:00)
          </Typography>
        </Alert>
      </SimpleForm>
    </Create>
  );
};
