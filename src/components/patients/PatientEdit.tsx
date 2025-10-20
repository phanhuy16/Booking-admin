import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  SelectInput,
  required,
  useRecordContext,
} from "react-admin";

const PatientEditTitle: React.FC = () => {
  const record = useRecordContext();
  return <span>{record ? `Chỉnh sửa: ${record.fullName}` : ""}</span>;
};

export const PatientEdit: React.FC = () => (
  <Edit title={<PatientEditTitle />} mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" label="ID" disabled />

      {/* Thông tin User - chỉ hiển thị, không cho sửa */}
      <TextInput source="fullName" label="Họ tên" disabled />
      <TextInput source="email" label="Email" disabled />
      <TextInput source="phone" label="Điện thoại" disabled />

      {/* Thông tin Patient Profile - cho phép sửa */}
      <DateInput
        source="dateOfBirth"
        label="Ngày sinh"
        validate={[required()]}
      />
      <SelectInput
        source="gender"
        label="Giới tính"
        choices={[
          { id: "Male", name: "Nam" },
          { id: "Female", name: "Nữ" },
          { id: "Other", name: "Khác" },
        ]}
        validate={[required()]}
      />
      <TextInput
        source="address"
        label="Địa chỉ"
        fullWidth
        multiline
        rows={3}
        validate={[required()]}
      />
    </SimpleForm>
  </Edit>
);
