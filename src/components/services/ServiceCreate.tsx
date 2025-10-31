import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  required,
  minValue,
  maxValue,
  maxLength,
} from "react-admin";
import { Box, Typography, Alert, InputAdornment } from "@mui/material";

// Validation
const validateTitle = [required("Tên dịch vụ là bắt buộc"), maxLength(100)];
const validateDescription = [maxLength(500)];
const validatePrice = [
  required("Giá là bắt buộc"),
  minValue(0, "Giá phải lớn hơn hoặc bằng 0"),
  maxValue(999999, "Giá không được vượt quá 999,999"),
];
const validateDuration = [
  required("Thời gian là bắt buộc"),
  minValue(1, "Thời gian tối thiểu 1 phút"),
  maxValue(1440, "Thời gian không được vượt quá 1440 phút (24h)"),
];

export const ServiceCreate: React.FC = () => {
  const formatVND = (value: number): string => {
    if (value === null || value === undefined) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const parseVND = (value: any): number | null => {
    if (value === null || value === undefined || value === "") return null;
    const cleanStr = value.toString().replace(/\./g, "");
    const num = parseInt(cleanStr, 10);
    return isNaN(num) ? null : num;
  };

  return (
    <Create redirect="list">
      <SimpleForm>
        <Typography variant="h6" gutterBottom>
          Thông tin dịch vụ
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Tạo dịch vụ mới cho hệ thống. Các dịch vụ sẽ được hiển thị cho bệnh
            nhân khi đặt lịch khám.
          </Typography>
        </Alert>

        <TextInput
          source="title"
          label="Tên dịch vụ"
          validate={validateTitle}
          fullWidth
          helperText="VD: Khám tổng quát, Xét nghiệm máu, Siêu âm tim..."
        />

        <TextInput
          source="description"
          label="Mô tả"
          validate={validateDescription}
          multiline
          rows={4}
          fullWidth
          helperText="Mô tả chi tiết về dịch vụ (tối đa 500 ký tự)"
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="primary">
            Thông tin giá và thời gian
          </Typography>
        </Box>

        <Box display="flex" gap={2} width="100%">
          <NumberInput
            source="price"
            label="Giá dịch vụ"
            validate={validatePrice}
            format={formatVND}
            parse={parseVND}
            helperText="Nhập giá dịch vụ (VND)"
            InputProps={{
              endAdornment: <InputAdornment position="end">₫</InputAdornment>,
            }}
            sx={{ flex: 1 }}
          />

          <NumberInput
            source="durationInMinutes"
            label="Thời gian (phút)"
            validate={validateDuration}
            defaultValue={30}
            helperText="Thời gian thực hiện dịch vụ"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">phút</InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
        </Box>

        <SelectInput
          source="status"
          label="Trạng thái"
          choices={[
            { id: 0, name: "Hoạt động" },
            { id: 1, name: "Ngưng hoạt động" },
          ]}
          defaultValue="Active"
          helperText="Chỉ dịch vụ 'Hoạt động' mới hiển thị cho bệnh nhân"
        />

        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>💡 Mẹo:</strong> Đặt giá và thời gian hợp lý để tối ưu trải
            nghiệm đặt lịch
          </Typography>
        </Alert>
      </SimpleForm>
    </Create>
  );
};
