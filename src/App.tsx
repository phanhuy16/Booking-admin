import EventIcon from "@mui/icons-material/Event";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import React from "react";
import { Admin, Login, Resource } from "react-admin";
import authProvider from "./authProvider";
import Dashboard from "./components/Dashboard";
import dataProvider from "./dataProvider";
import { DoctorCreate } from "./components/doctors/DoctorCreate";
import { DoctorEdit } from "./components/doctors/DoctorEdit";
import { DoctorList } from "./components/doctors/DoctorList";
import { DoctorShow } from "./components/doctors/DoctorShow";
import { PatientEdit } from "./components/patients/PatientEdit";
import { PatientList } from "./components/patients/PatientList";
import { PatientShow } from "./components/patients/PatientShow";
import CustomLoginForm from "./components/CustomLoginForm";
import { SpecialtyList } from "./components/specialties/SpecialtyList";
import { SpecialtyEdit } from "./components/specialties/SpecialtyEdit";
import { SpecialtyShow } from "./components/specialties/SpecialtyShow";
import { SpecialtyCreate } from "./components/specialties/SpecialtyCreate";
import { ScheduleList } from "./components/schedules/ScheduleList";
import { ScheduleShow } from "./components/schedules/ScheduleShow";
import { ScheduleCreate } from "./components/schedules/ScheduleCreate";
import { ScheduleEdit } from "./components/schedules/ScheduleEdit";

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
      icon={EventIcon}
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
  </Admin>
);

export default App;
