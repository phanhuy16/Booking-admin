import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import { LoginForm, TextInput } from "react-admin";

const CustomLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <LoginForm>
      <TextInput
        source="email"
        label="Email"
        type="email"
        autoComplete="email"
        fullWidth
        isRequired
        sx={{ mb: 2 }}
      />

      <TextInput
        source="password"
        label="Mật khẩu"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        fullWidth
        isRequired
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </LoginForm>
  );
};

export default CustomLoginForm;
