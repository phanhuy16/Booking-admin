import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Box, Chip } from "@mui/material";
import React from "react";
import {
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  DeleteButton,
  EditButton,
  Filter,
  FunctionField,
  List,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";

// Service Status type
type ServiceStatus = "Active" | "Inactive" | "Pending";

// Thay đổi: dùng số thay vì string
const SERVICE_STATUS: Record<
  number,
  {
    label: string;
    color: "success" | "default" | "warning";
    icon: React.ElementType;
  }
> = {
  0: { label: "Hoạt động", color: "success", icon: CheckCircleIcon },
  1: { label: "Ngưng hoạt động", color: "default", icon: CancelIcon },
  // Bỏ Pending nếu backend không hỗ trợ
  // 2: { label: "Chờ duyệt", color: "warning", icon: HourglassEmptyIcon },
};

// Format VND currency
const formatVND = (value: number): string => {
  if (value === null || value === undefined) return "0 ₫";

  const formatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(value)} ₫`;
};

// Format duration
const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}ph` : `${hours}h`;
};

// Filter component
const ServiceFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Tìm kiếm" source="q" alwaysOn />
    <SelectInput
      source="status"
      label="Trạng thái"
      choices={[
        { id: "Active", name: "Hoạt động" },
        { id: "Inactive", name: "Ngưng hoạt động" },
        { id: "Pending", name: "Chờ duyệt" },
      ]}
    />
  </Filter>
);

// List Actions
const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Thêm dịch vụ" />
  </TopToolbar>
);

// Bulk Actions
const BulkActionButtons = () => (
  <>
    <BulkDeleteButton
      mutationMode="pessimistic"
      confirmTitle="Xác nhận xóa"
      confirmContent="Bạn có chắc chắn muốn xóa các dịch vụ này?"
    />
  </>
);

export const ServiceList: React.FC = () => (
  <List
    filters={<ServiceFilter />}
    actions={<ListActions />}
    sort={{ field: "id", order: "DESC" }}
    perPage={25}
  >
    <Datagrid rowClick="edit" bulkActionButtons={<BulkActionButtons />}>
      <TextField source="id" label="ID" />

      <TextField source="title" label="Tên dịch vụ" />

      <FunctionField
        label="Mô tả"
        render={(record: any) => (
          <Box
            sx={{
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={record.description}
          >
            {record.description || "—"}
          </Box>
        )}
      />

      <FunctionField
        label="Giá"
        sortBy="price"
        render={(record: any) => (
          <Box sx={{ fontWeight: 600, color: "success.main" }}>
            {formatVND(record.price)}
          </Box>
        )}
      />

      <FunctionField
        label="Thời gian"
        sortBy="durationInMinutes"
        render={(record: any) => (
          <Chip
            label={formatDuration(record.durationInMinutes)}
            size="small"
            variant="outlined"
          />
        )}
      />

      <FunctionField
        label="Trạng thái"
        sortBy="status"
        render={(record: any) => {
          const statusKey = record.status as number;
          const status = SERVICE_STATUS[statusKey] || SERVICE_STATUS[1];
          const Icon = status.icon;
          return (
            <Chip
              icon={<Icon />}
              label={status.label}
              color={status.color as any}
              size="small"
            />
          );
        }}
      />

      <EditButton />
      <DeleteButton
        mutationMode="pessimistic"
        confirmTitle="Xác nhận xóa"
        confirmContent="Không thể xóa dịch vụ đang có booking hoạt động"
      />
    </Datagrid>
  </List>
);
