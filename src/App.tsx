import { Admin, Login, Resource } from "react-admin";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import React from "react";
import authProvider from "./authProvider";
import CustomLoginForm from "./components/CustomLoginForm";
import Dashboard from "./components/Dashboard";
import dataProvider from "./dataProvider";
import {
  DoctorCreate,
  DoctorEdit,
  DoctorList,
  DoctorShow,
} from "./components/doctors";
import { PatientEdit, PatientList, PatientShow } from "./components/patients";
import {
  SpecialtyCreate,
  SpecialtyEdit,
  SpecialtyList,
  SpecialtyShow,
} from "./components/specialties";
import {
  ScheduleCreate,
  ScheduleEdit,
  ScheduleList,
  ScheduleShow,
} from "./components/schedules";
import { BookingEdit, BookingList, BookingShow } from "./components/bookings";
import { PaymentEdit, PaymentList, PaymentShow } from "./components/payments";

const App: React.FC = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={
      <Login>
        <CustomLoginForm />
      </Login>
    }
    dashboard={Dashboard}
  >
    <Resource
      name="doctors"
      list={DoctorList}
      edit={DoctorEdit}
      create={DoctorCreate}
      show={DoctorShow}
      icon={LocalHospitalIcon}
      options={{ label: "Bác sĩ" }}
    />
    <Resource
      name="patients"
      list={PatientList}
      edit={PatientEdit}
      show={PatientShow}
      icon={PersonIcon}
      options={{ label: "Bệnh nhân" }}
    />

    <Resource
      name="specialties"
      create={SpecialtyCreate}
      list={SpecialtyList}
      edit={SpecialtyEdit}
      show={SpecialtyShow}
      icon={MedicationIcon}
      options={{ label: "Chuyên khoa" }}
    />

    <Resource
      name="schedules"
      list={ScheduleList}
      show={ScheduleShow}
      create={ScheduleCreate}
      edit={ScheduleEdit}
      icon={CalendarTodayIcon}
      options={{ label: "Lịch làm việc" }}
    />

    <Resource
      name="bookings"
      list={BookingList}
      edit={BookingEdit}
      show={BookingShow}
      options={{ label: "Đặt lịch" }}
      icon={EventIcon}
    />

    <Resource
      name="payments"
      list={PaymentList}
      show={PaymentShow}
      edit={PaymentEdit}
      icon={PaymentIcon}
      options={{ label: "Thanh toán" }}
    />
  </Admin>
);

export default App;
