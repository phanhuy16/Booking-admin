import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  required,
  minValue,
  maxValue,
  maxLength,
  useRecordContext,
} from "react-admin";
import { Box, Typography, Alert, InputAdornment } from "@mui/material";

// Title component
const ServiceEditTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Dịch vụ: ${record.title}` : ""}</span>;
};

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

export const ServiceEdit: React.FC = () => {
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
    <Edit title={<ServiceEditTitle />} mutationMode="pessimistic">
      <SimpleForm>
        <TextInput source="id" label="ID" disabled />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Thông tin dịch vụ
        </Typography>

        <TextInput
          source="title"
          label="Tên dịch vụ"
          validate={validateTitle}
          fullWidth
          helperText="Tên dịch vụ phải là duy nhất"
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
            helperText="Giá dịch vụ (VND)"
            InputProps={{
              endAdornment: <InputAdornment position="end">₫</InputAdornment>,
            }}
            sx={{ flex: 1 }}
          />

          <NumberInput
            source="durationInMinutes"
            label="Thời gian (phút)"
            validate={validateDuration}
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
          parse={(value: string) => parseInt(value, 10)}
          format={(value: number) =>
            value !== undefined ? value.toString() : ""
          }
          validate={required("Trạng thái là bắt buộc")}
          helperText="Chỉ dịch vụ 'Hoạt động' mới hiển thị cho bệnh nhân"
        />

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>⚠️ Cảnh báo:</strong> Thay đổi giá hoặc thời gian có thể ảnh
            hưởng đến các booking đã tạo
          </Typography>
        </Alert>
      </SimpleForm>
    </Edit>
  );
};
