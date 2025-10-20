import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  ShowButton,
  DeleteButton,
  FunctionField,
} from "react-admin";

export const DoctorList: React.FC = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="fullName" label="Họ tên" />

      {/* Nếu specialty là object */}
      <FunctionField
        label="Chuyên khoa"
        render={(record: any) => record.specialty?.name || "N/A"}
      />

      <EmailField source="email" label="Email" />
      <TextField source="phone" label="Điện thoại" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
