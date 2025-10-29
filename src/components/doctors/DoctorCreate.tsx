import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  ImageField,
  required,
  minValue,
  maxValue,
  email as emailValidator,
  minLength,
} from "react-admin";
import { Box, Typography } from "@mui/material";

// Validation
const validateAvatar = (value: any) => {
  if (!value) return undefined; // Optional

  if (value.rawFile) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];

    if (value.rawFile.size > maxSize) {
      return "File không được vượt quá 5MB";
    }

    if (!allowedTypes.includes(value.rawFile.type)) {
      return "Chỉ chấp nhận file PNG, JPG, GIF, WEBP";
    }
  }

  return undefined;
};

export const DoctorCreate: React.FC = () => {
  return (
    <Create redirect="show">
      <SimpleForm>
        <Typography variant="h6" gutterBottom>
          Thông tin tài khoản
        </Typography>

        <TextInput
          source="fullName"
          label="Họ và tên"
          validate={[required(), minLength(2)]}
          fullWidth
        />

        <TextInput
          source="email"
          label="Email"
          type="email"
          validate={[required(), emailValidator()]}
          fullWidth
        />

        <TextInput
          source="phone"
          label="Số điện thoại"
          validate={required()}
          helperText="VD: 0901234567"
        />

        <TextInput
          source="password"
          label="Mật khẩu"
          type="password"
          helperText="Để trống sẽ dùng mật khẩu mặc định: Doctor@123"
        />

        <TextInput
          source="consultationFee"
          label="Phí tư vấn (VNĐ)"
          validate={[required(), minValue(0), maxValue(10000000)]}
          format={(value) =>
            value ? parseInt(value).toLocaleString("vi-VN") : ""
          }
          parse={(value) => {
            if (!value) return 0;
            const numericValue = value.toString().replace(/\./g, "");
            return parseInt(numericValue) || 0;
          }}
          helperText="Nhập số tiền, VD: 500.000"
          fullWidth
        />

        <ImageInput
          source="avatar"
          label="Avatar"
          accept={{ "image/*": [] }}
          maxSize={5000000}
          validate={validateAvatar}
          placeholder={
            <Box textAlign="center" p={2}>
              <Typography>Kéo thả hoặc click để upload avatar</Typography>
              <Typography variant="caption" color="textSecondary">
                PNG, JPG, GIF, WEBP • Tối đa 5MB
              </Typography>
            </Box>
          }
        >
          <ImageField source="src" title="title" />
        </ImageInput>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Thông tin chuyên môn
        </Typography>

        <ReferenceInput
          source="specialtyId"
          reference="specialties"
          label="Chuyên khoa"
        >
          <SelectInput optionText="name" validate={required()} />
        </ReferenceInput>

        <NumberInput
          source="experienceYears"
          label="Số năm kinh nghiệm"
          defaultValue={0}
          validate={[required(), minValue(0), maxValue(100)]}
        />

        <TextInput source="workplace" label="Nơi làm việc" fullWidth />

        <TextInput
          source="description"
          label="Mô tả / Giới thiệu"
          multiline
          rows={4}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
