import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  required,
  minValue,
  maxValue,
  email,
} from "react-admin";

// Tạo bác sĩ mới (User + Profile) - Dành cho Admin
export const DoctorCreate: React.FC = () => {
  return (
    <Create resource="doctors" redirect="list">
      <SimpleForm>
        {/* Thông tin tài khoản */}
        <TextInput
          source="fullName"
          label="Họ và tên"
          validate={required()}
          fullWidth
        />

        <TextInput
          source="email"
          label="Email"
          type="email"
          validate={[required(), email()]}
          fullWidth
        />

        <TextInput source="phone" label="Số điện thoại" validate={required()} />

        <TextInput
          source="password"
          label="Mật khẩu"
          type="password"
          helperText="Để trống sẽ dùng mật khẩu mặc định: Doctor@123"
        />

        {/* Thông tin chuyên môn */}
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
