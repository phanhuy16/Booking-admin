import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  EditButton,
  ShowButton,
  DeleteButton,
} from "react-admin";

export const AppointmentList: React.FC = () => (
  <List sort={{ field: "appointmentDate", order: "DESC" }}>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <ReferenceField source="patientId" reference="patients" label="Bệnh nhân">
        <TextField source="fullName" />
      </ReferenceField>
      <ReferenceField source="doctorId" reference="doctors" label="Bác sĩ">
        <TextField source="fullName" />
      </ReferenceField>
      <DateField source="appointmentDate" label="Ngày hẹn" showTime />
      <TextField source="status" label="Trạng thái" />
      <TextField source="reason" label="Lý do" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
