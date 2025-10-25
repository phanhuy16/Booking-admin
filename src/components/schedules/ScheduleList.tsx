import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Chip } from "@mui/material";
import React from "react";
import {
  CreateButton,
  Datagrid,
  DateField,
  DateInput,
  DeleteButton,
  EditButton,
  Filter,
  FunctionField,
  List,
  ReferenceInput,
  SelectInput,
  ShowButton,
  TextField,
  TopToolbar,
} from "react-admin";

const ScheduleFilter: React.FC = (props) => (
  <Filter {...props}>
    <DateInput source="fromDate" label="Từ ngày" alwaysOn />
    <DateInput source="toDate" label="Đến ngày" alwaysOn />
    <ReferenceInput source="doctorId" reference="doctors" label="Bác sĩ">
      <SelectInput optionText="fullName" />
    </ReferenceInput>
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Thêm lịch làm việc" />
  </TopToolbar>
);

export const ScheduleList: React.FC = () => (
  <List
    filters={<ScheduleFilter />}
    sort={{ field: "date", order: "DESC" }}
    perPage={25}
    actions={<ListActions />}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="id" label="ID" />

      <TextField source="doctorName" label="Bác sĩ" />

      <DateField source="date" label="Ngày" locales="vi-VN" />

      <FunctionField
        label="Giờ làm việc"
        render={(record: any) => (
          <Box display="flex" alignItems="center">
            <AccessTimeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            <span>
              {formatTime(record.startTime)} - {formatTime(record.endTime)}
            </span>
          </Box>
        )}
      />

      <FunctionField
        label="Trạng thái"
        render={(record: any) =>
          record.isAvailable ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="Còn trống"
              color="success"
              size="small"
            />
          ) : (
            <Chip
              icon={<CancelIcon />}
              label="Đã đầy"
              color="default"
              size="small"
            />
          )
        }
      />

      <FunctionField
        label="Lịch hẹn"
        render={(record: any) => (
          <Chip
            label={`${record.totalBookings || 0} lịch hẹn`}
            size="small"
            variant="outlined"
          />
        )}
      />

      <EditButton />
      <ShowButton />
      <DeleteButton
        mutationMode="pessimistic"
        confirmTitle="Xác nhận xóa"
        confirmContent="Không thể xóa lịch có lịch hẹn đang hoạt động"
      />
    </Datagrid>
  </List>
);

// Helper function to format TimeSpan
const formatTime = (timeSpan: string): string => {
  if (!timeSpan) return "N/A";
  // TimeSpan format: "HH:mm:ss"
  const parts = timeSpan.split(":");
  return `${parts[0]}:${parts[1]}`;
};
