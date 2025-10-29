import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  ShowButton,
  EditButton,
  CreateButton,
  TopToolbar,
  SelectInput,
  Filter,
  useGetIdentity,
} from "react-admin";
import { Chip, Box } from "@mui/material";

const BookingFilter: React.FC = (props) => (
  <Filter {...props}>
    <SelectInput
      source="status"
      label="Trạng thái"
      choices={[
        { id: "Pending", name: "Chờ xác nhận" },
        { id: "Confirmed", name: "Đã xác nhận" },
        { id: "Completed", name: "Hoàn thành" },
        { id: "Cancelled", name: "Đã hủy" },
      ]}
      alwaysOn
    />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Đặt lịch mới" />
  </TopToolbar>
);

const StatusField: React.FC<{ source: string }> = ({ source }) => {
  const statusColors: Record<string, any> = {
    Pending: "warning",
    Confirmed: "info",
    Completed: "success",
    Cancelled: "error",
  };

  const statusLabels: Record<string, string> = {
    Pending: "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  return (
    <FunctionField
      source={source}
      render={(record: any) => (
        <Chip
          label={statusLabels[record.status] || record.status}
          color={statusColors[record.status] || "default"}
          size="small"
        />
      )}
    />
  );
};

export const BookingList: React.FC = () => {
  const { identity } = useGetIdentity();

  return (
    <List
      filters={<BookingFilter />}
      sort={{ field: "createdAt", order: "DESC" }}
      perPage={25}
      actions={<ListActions />}
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <TextField source="id" label="ID" />

        <DateField
          source="createdAt"
          label="Ngày đặt"
          showTime
          locales="vi-VN"
        />

        <FunctionField
          label="Bệnh nhân"
          render={(record: any) =>
            record.patientName || `ID: ${record.patientId}`
          }
        />

        <FunctionField
          label="Bác sĩ"
          render={(record: any) =>
            record.doctorName || `ID: ${record.doctorId}`
          }
        />

        <FunctionField
          label="Dịch vụ"
          render={(record: any) => (
            <Box>
              <div>{record.serviceName || record.serviceTitle}</div>
              <span style={{ fontSize: "0.875rem", color: "#666" }}>
                {record.servicePrice?.toLocaleString("vi-VN")} ₫
              </span>
            </Box>
          )}
        />

        <StatusField source="status" />

        <ShowButton />
        <EditButton label="Cập nhật" />
      </Datagrid>
    </List>
  );
};
