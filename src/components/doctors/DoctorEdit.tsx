import React from "react";
import {
  Edit,
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
  useRecordContext,
  FunctionField,
  minLength,
} from "react-admin";
import { Avatar, Box, Typography, Alert } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const DoctorEditTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Bác sĩ: ${record.fullName}` : ""}</span>;
};

const CurrentAvatar: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Box mb={3}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Avatar hiện tại:
      </Typography>
      {record.avatarUrl ? (
        <Box>
          <Avatar
            src={record.avatarUrl}
            alt={record.fullName}
            sx={{ width: 100, height: 100, mb: 1, border: "2px solid #e0e0e0" }}
          >
            <PersonIcon sx={{ fontSize: 50 }} />
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
            📎 {record.avatarUrl}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Avatar sx={{ width: 100, height: 100, bgcolor: "primary.main" }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography
            variant="caption"
            color="warning.main"
            display="block"
            sx={{ mt: 1 }}
          >
            ⚠️ Bác sĩ này chưa có avatar
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Validation
const validateAvatar = (value: any) => {
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

export const DoctorEdit: React.FC = () => {
  // Transform để loại bỏ avatar field nếu không có file mới
  const transform = (data: any) => {
    if (!data.avatar || !data.avatar.rawFile) {
      const { avatar, avatarUrl, ...rest } = data;
      return rest;
    }
    return data;
  };

  return (
    <Edit
      title={<DoctorEditTitle />}
      mutationMode="pessimistic"
      transform={transform}
    >
      <SimpleForm>
        <TextInput source="id" label="ID" InputProps={{ readOnly: true }} />

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

        <TextInput source="phone" label="Số điện thoại" validate={required()} />

        <TextInput
          source="password"
          label="Mật khẩu mới"
          type="password"
          helperText="Để trống để giữ nguyên mật khẩu hiện tại"
        />

        <CurrentAvatar />

        <ImageInput
          source="avatar"
          label="Thay đổi avatar (tùy chọn)"
          accept={{ "image/*": [] }}
          maxSize={5000000}
          validate={validateAvatar}
          placeholder={
            <Box textAlign="center" p={2}>
              <Typography>Kéo thả hoặc click để upload avatar mới</Typography>
              <Typography variant="caption" color="textSecondary">
                PNG, JPG, GIF, WEBP • Tối đa 5MB
              </Typography>
              <Typography
                variant="caption"
                color="warning.main"
                display="block"
                sx={{ mt: 1 }}
              >
                ⚠️ Avatar cũ sẽ bị xóa khỏi Firebase Storage
              </Typography>
            </Box>
          }
        >
          <ImageField source="src" title="title" />
        </ImageInput>

        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2">
            <strong>Lưu ý:</strong> Avatar cũ sẽ tự động bị xóa khỏi Firebase
            khi upload ảnh mới
          </Typography>
        </Alert>

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

        <NumberInput
          source="experienceYears"
          label="Số năm kinh nghiệm"
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

        <FunctionField
          label="Thống kê"
          render={(record: any) => (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                ⭐ Đánh giá:{" "}
                <strong>{record.averageRating?.toFixed(1) || "N/A"}</strong> (
                {record.totalFeedbacks || 0} lượt)
              </Typography>
            </Box>
          )}
        />
      </SimpleForm>
    </Edit>
  );
};
