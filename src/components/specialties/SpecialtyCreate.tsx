import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  required,
  maxLength,
  minLength,
} from "react-admin";
import { Box, Typography } from "@mui/material";

// Validation
const validateName = [
  required("Tên chuyên khoa là bắt buộc"),
  minLength(2, "Tên phải có ít nhất 2 ký tự"),
  maxLength(100, "Tên không được quá 100 ký tự"),
];

const validateDescription = [maxLength(500, "Mô tả không được quá 500 ký tự")];

const validateIcon = (value: any) => {
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

export const SpecialtyCreate: React.FC = () => (
  <Create redirect="show">
    <SimpleForm>
      <TextInput
        source="name"
        label="Tên chuyên khoa"
        validate={validateName}
        fullWidth
      />

      <TextInput
        source="description"
        label="Mô tả"
        multiline
        rows={4}
        validate={validateDescription}
        fullWidth
      />

      <ImageInput
        source="icon"
        label="Icon chuyên khoa (tùy chọn)"
        accept={{ "image/*": [] }}
        maxSize={5000000} // 5MB
        validate={validateIcon}
        placeholder={
          <Box textAlign="center" p={3}>
            <Typography variant="body1" gutterBottom>
              Kéo thả hoặc click để upload icon
            </Typography>
            <Typography variant="caption" color="textSecondary">
              PNG, JPG, GIF, WEBP • Tối đa 5MB
            </Typography>
          </Box>
        }
      >
        <ImageField source="src" title="title" />
      </ImageInput>

      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ mt: 2, display: "block" }}
      >
        💡 Icon sẽ được upload lên Firebase Storage và URL sẽ được lưu vào
        database
      </Typography>
    </SimpleForm>
  </Create>
);
