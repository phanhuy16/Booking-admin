import React from "react";
import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  EmailField,
  NumberField,
  ReferenceManyField,
  Datagrid,
  ReferenceField,
  DateField,
  ShowButton,
  FunctionField,
} from "react-admin";

export const DoctorShow: React.FC = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Thông tin cơ bản">
        <TextField source="id" label="ID" />
        <TextField source="fullName" label="Họ tên" />
        <FunctionField
          label="Chuyên khoa"
          render={(record: any) => record.specialty?.name || "N/A"}
        />
        <EmailField source="email" label="Email" />
        <TextField source="phone" label="Điện thoại" />
        <TextField source="licenseNumber" label="Số giấy phép" />
        <NumberField source="experienceYears" label="Kinh nghiệm (năm)" />
        <TextField source="qualification" label="Bằng cấp" />
      </Tab>
      <Tab label="Lịch hẹn" path="appointments">
        <ReferenceManyField
          reference="appointments"
          target="doctorId"
          label="Danh sách lịch hẹn"
        >
          <Datagrid>
            <ReferenceField
              source="patientId"
              reference="patients"
              label="Bệnh nhân"
            >
              <TextField source="fullName" />
            </ReferenceField>
            <DateField source="appointmentDate" label="Ngày hẹn" showTime />
            <TextField source="status" label="Trạng thái" />
            <TextField source="reason" label="Lý do" />
            <ShowButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
