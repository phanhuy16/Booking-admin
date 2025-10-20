import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EmailField,
  EditButton,
  ShowButton,
  DeleteButton,
  FunctionField,
  SearchInput,
  Filter,
  SelectInput,
} from "react-admin";

const PatientFilter: React.FC = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn placeholder="Tìm theo tên, email, SĐT" />
    <SelectInput
      source="gender"
      choices={[
        { id: "Male", name: "Nam" },
        { id: "Female", name: "Nữ" },
        { id: "Other", name: "Khác" },
      ]}
      alwaysOn
    />
  </Filter>
);

export const PatientList: React.FC = () => (
  <List
    filters={<PatientFilter />}
    sort={{ field: "id", order: "DESC" }}
    perPage={25}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="id" label="ID" />
      <TextField source="fullName" label="Họ tên" />
      <DateField source="dateOfBirth" label="Ngày sinh" locales="vi-VN" />
      <FunctionField
        label="Giới tính"
        render={(record: any) => {
          const genderMap: Record<string, string> = {
            Male: "Nam",
            Female: "Nữ",
            Other: "Khác",
          };
          return genderMap[record.gender] || record.gender;
        }}
      />
      <EmailField source="email" label="Email" />
      <TextField source="phone" label="Điện thoại" />
      <TextField source="address" label="Địa chỉ" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
