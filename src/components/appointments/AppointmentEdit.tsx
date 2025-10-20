import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateTimeInput,
  SelectInput,
  ReferenceInput,
} from "react-admin";

const statusChoices = [
  { id: "Scheduled", name: "Đã lên lịch" },
  { id: "Confirmed", name: "Đã xác nhận" },
  { id: "Completed", name: "Hoàn thành" },
  { id: "Cancelled", name: "Đã hủy" },
];

export const AppointmentEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="patientId" reference="patients" label="Bệnh nhân">
        <SelectInput optionText="fullName" required />
      </ReferenceInput>
      <ReferenceInput source="doctorId" reference="doctors" label="Bác sĩ">
        <SelectInput optionText="fullName" required />
      </ReferenceInput>
      <DateTimeInput source="appointmentDate" label="Ngày giờ hẹn" required />
      <SelectInput
        source="status"
        label="Trạng thái"
        choices={statusChoices}
        required
      />
      <TextInput source="reason" label="Lý do khám" multiline rows={3} />
      <TextInput source="notes" label="Ghi chú" multiline rows={3} />
    </SimpleForm>
  </Edit>
);
