import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  ShowButton,
  DeleteButton,
  FunctionField,
  SearchInput,
  Filter,
  CreateButton,
  TopToolbar,
} from "react-admin";
import { Avatar, Chip, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";

const DoctorFilter: React.FC = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn placeholder="Tìm theo tên, email" />
  </Filter>
);

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Thêm bác sĩ" />
  </TopToolbar>
);

export const DoctorList: React.FC = () => (
  <List
    filters={<DoctorFilter />}
    sort={{ field: "id", order: "DESC" }}
    perPage={25}
    actions={<ListActions />}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="id" label="ID" />

      <FunctionField
        label="Avatar"
        render={(record: any) =>
          record.avatarUrl ? (
            <Avatar
              src={record.avatarUrl}
              alt={record.fullName}
              sx={{ width: 40, height: 40 }}
            >
              <PersonIcon />
            </Avatar>
          ) : (
            <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
              <PersonIcon />
            </Avatar>
          )
        }
      />

      <TextField source="fullName" label="Họ tên" />

      <FunctionField
        label="Chuyên khoa"
        render={(record: any) => (
          <Chip
            label={record.specialtyName || record.specialty?.name || "N/A"}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      />

      <EmailField source="email" label="Email" />
      <TextField source="phone" label="Điện thoại" />

      <FunctionField
        label="Phí tư vấn"
        render={(record: any) =>
          record.consultationFee
            ? `${record.consultationFee.toLocaleString("vi-VN")} ₫`
            : "N/A"
        }
      />

      <FunctionField
        label="Kinh nghiệm"
        render={(record: any) => `${record.experienceYears || 0} năm`}
      />

      <FunctionField
        label="Đánh giá"
        render={(record: any) =>
          record.averageRating ? (
            <Box display="flex" alignItems="center">
              <StarIcon sx={{ color: "gold", mr: 0.5, fontSize: 18 }} />
              <span>{record.averageRating.toFixed(1)}</span>
            </Box>
          ) : (
            "Chưa có"
          )
        }
      />

      <EditButton />
      <ShowButton />
      <DeleteButton
        mutationMode="pessimistic"
        confirmTitle="Xác nhận xóa"
        confirmContent="Không thể xóa bác sĩ có lịch hẹn đang hoạt động"
      />
    </Datagrid>
  </List>
);
