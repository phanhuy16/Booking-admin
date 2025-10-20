import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  ReferenceField,
} from "react-admin";

export const AppointmentShow: React.FC = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <ReferenceField source="patientId" reference="patients" label="Bệnh nhân">
        <TextField source="fullName" />
      </ReferenceField>
      <ReferenceField source="doctorId" reference="doctors" label="Bác sĩ">
        <TextField source="fullName" />
      </ReferenceField>
      <DateField source="appointmentDate" label="Ngày giờ hẹn" showTime />
      <TextField source="status" label="Trạng thái" />
      <TextField source="reason" label="Lý do khám" />
      <TextField source="notes" label="Ghi chú" />
      <DateField source="createdAt" label="Ngày tạo" showTime />
    </SimpleShowLayout>
  </Show>
);
