import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  required,
  maxLength,
  minLength,
  useRecordContext,
  FunctionField,
} from "react-admin";
import { Avatar, Box, Typography, Alert } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const SpecialtyEditTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Chỉnh sửa: ${record.name}` : ""}</span>;
};

// Validation
const validateName = [
  required("Tên chuyên khoa là bắt buộc"),
  minLength(2, "Tên phải có ít nhất 2 ký tự"),
  maxLength(100, "Tên không được quá 100 ký tự"),
];

const validateDescription = [maxLength(500, "Mô tả không được quá 500 ký tự")];

const validateIcon = (value: any) => {
  if (!value) return undefined;

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

const CurrentIcon: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Box mb={3}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Icon hiện tại:
      </Typography>
      {record.iconUrl ? (
        <Box>
          <Avatar
            src={record.iconUrl}
            alt={record.name}
            sx={{ width: 100, height: 100, mb: 1, border: "2px solid #e0e0e0" }}
          >
            <MedicalServicesIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography
            variant="caption"
            color="textSecondary"
            display="block"
            sx={{
              wordBreak: "break-all",
              maxWidth: 400,
              backgroundColor: "#f5f5f5",
              padding: 1,
              borderRadius: 1,
            }}
          >
            📎 {record.iconUrl}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Avatar sx={{ width: 100, height: 100, bgcolor: "primary.main" }}>
            <MedicalServicesIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography
            variant="caption"
            color="warning.main"
            display="block"
            sx={{ mt: 1 }}
          >
            ⚠️ Chuyên khoa này chưa có icon
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export const SpecialtyEdit: React.FC = () => (
  <Edit title={<SpecialtyEditTitle />} mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" label="ID" disabled />

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

      <CurrentIcon />

      <ImageInput
        source="icon"
        label="Thay đổi icon (tùy chọn)"
        accept={{ "image/*": [] }}
        maxSize={5000000} // 5MB
        validate={validateIcon}
        placeholder={
          <Box textAlign="center" p={3}>
            <Typography variant="body1" gutterBottom>
              Kéo thả hoặc click để upload icon mới
            </Typography>
            <Typography variant="caption" color="textSecondary">
              PNG, JPG, GIF, WEBP • Tối đa 5MB
            </Typography>
            <Typography
              variant="caption"
              color="warning.main"
              display="block"
              sx={{ mt: 1 }}
            >
              ⚠️ Icon cũ sẽ bị xóa khỏi Firebase Storage
            </Typography>
          </Box>
        }
      >
        <ImageField source="src" title="title" />
      </ImageInput>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Lưu ý:</strong> Nếu bạn upload icon mới, icon cũ sẽ tự động bị
          xóa khỏi Firebase Storage để tiết kiệm dung lượng.
        </Typography>
      </Alert>

      <FunctionField
        label="Thông tin"
        render={(record: any) => (
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              📊 Chuyên khoa này có <strong>{record.doctorCount || 0}</strong>{" "}
              bác sĩ
            </Typography>
            {record.doctorCount > 0 && (
              <Typography
                variant="caption"
                color="warning.main"
                display="block"
                sx={{ mt: 0.5 }}
              >
                ⚠️ Không thể xóa chuyên khoa này vì còn bác sĩ
              </Typography>
            )}
          </Box>
        )}
      />
    </SimpleForm>
  </Edit>
);
