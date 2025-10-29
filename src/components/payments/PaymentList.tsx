import { Chip } from "@mui/material";
import {
  CreateButton,
  Datagrid,
  DateField,
  ExportButton,
  FilterButton,
  FunctionField,
  List,
  ReferenceField,
  ReferenceInput,
  SearchInput,
  SelectInput,
  TextField,
  TopToolbar,
  useRecordContext,
} from "react-admin";

// Status colors
const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return "warning"; // Pending
    case 1:
      return "success"; // Completed
    case 2:
      return "error"; // Failed
    default:
      return "default";
  }
};

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return "Đang chờ";
    case 1:
      return "Hoàn thành";
    case 2:
      return "Thất bại";
    default:
      return "Không xác định";
  }
};

const getMethodLabel = (method: number) => {
  switch (method) {
    case 0:
      return "Tiền mặt";
    case 1:
      return "Thẻ tín dụng";
    case 2:
      return "Bảo hiểm";
    case 3:
      return "Trực tuyến";
    default:
      return "Không xác định";
  }
};

// Custom field components
const PaymentStatusField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Chip
      label={getStatusLabel(record.status)}
      color={getStatusColor(record.status)}
      size="small"
    />
  );
};

const PaymentMethodField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return <span>{getMethodLabel(record.method)}</span>;
};

// List Actions
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// Filters
const paymentFilters = [
  <SearchInput source="q" alwaysOn placeholder="Tìm kiếm..." />,
  <SelectInput
    source="status"
    label="Trạng thái"
    choices={[
      { id: 0, name: "Đang chờ" },
      { id: 1, name: "Hoàn thành" },
      { id: 2, name: "Thất bại" },
    ]}
    alwaysOn
  />,
  <SelectInput
    source="method"
    label="Phương thức"
    choices={[
      { id: 0, name: "Tiền mặt" },
      { id: 1, name: "Thẻ tín dụng" },
      { id: 2, name: "Bảo hiểm" },
      { id: 3, name: "Trực tuyến" },
    ]}
  />,
  <ReferenceInput source="bookingId" reference="bookings" label="Booking">
    <SelectInput optionText={(choice: any) => `#${choice.id}`} />
  </ReferenceInput>,
];

export const PaymentList = () => (
  <List
    filters={paymentFilters}
    actions={<ListActions />}
    sort={{ field: "id", order: "DESC" }}
    perPage={25}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="id" label="ID" />

      <ReferenceField
        source="bookingId"
        reference="bookings"
        label="Booking"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>

      <FunctionField
        label="Số tiền"
        render={(record: any) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.amount)
        }
      />

      <FunctionField
        label="Phương thức"
        render={(record: any) => <PaymentMethodField />}
      />

      <FunctionField
        label="Trạng thái"
        render={(record: any) => <PaymentStatusField />}
      />

      <DateField
        source="paidAt"
        label="Thời gian thanh toán"
        showTime
        locales="vi-VN"
      />
    </Datagrid>
  </List>
);
