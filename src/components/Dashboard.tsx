import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";

const Dashboard: React.FC = () => (
  <Card sx={{ margin: 2 }}>
    <CardHeader title="Chào mừng đến với Healthcare Admin" />
    <CardContent>
      <p>Hệ thống quản lý phòng khám</p>
      <ul>
        <li>Quản lý Bác sĩ</li>
        <li>Quản lý Bệnh nhân</li>
        <li>Quản lý Lịch hẹn</li>
      </ul>
    </CardContent>
  </Card>
);

export default Dashboard;
