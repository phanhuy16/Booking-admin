import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
  FunctionField,
  SearchInput,
  Filter,
  TopToolbar,
} from "react-admin";
import { Avatar, Chip, Box } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const SpecialtyFilter: React.FC = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn placeholder="Tìm theo tên chuyên khoa" />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Thêm chuyên khoa" />
  </TopToolbar>
);

export const SpecialtyList: React.FC = () => (
  <List
    filters={<SpecialtyFilter />}
    sort={{ field: "id", order: "ASC" }}
    perPage={25}
    actions={<ListActions />}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="id" label="ID" />

      <FunctionField
        label="Icon"
        render={(record: any) =>
          record.iconUrl ? (
            <Avatar
              src={record.iconUrl}
              alt={record.name}
              sx={{ width: 40, height: 40 }}
            >
              {/* Fallback nếu ảnh không load được */}
              <MedicalServicesIcon />
            </Avatar>
          ) : (
            <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
              <MedicalServicesIcon />
            </Avatar>
          )
        }
      />

      <TextField source="name" label="Tên chuyên khoa" />
      <TextField source="description" label="Mô tả" />

      <FunctionField
        label="Số bác sĩ"
        render={(record: any) => (
          <Chip
            label={record.doctorCount || 0}
            color="primary"
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
        confirmContent="Bạn có chắc muốn xóa chuyên khoa này? Chỉ có thể xóa nếu không có bác sĩ nào."
      />
    </Datagrid>
  </List>
);
