import React from "react";
import { Box, Avatar, Typography, CircularProgress } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { isValidImageUrl } from "../utils/imageHelpers";

interface ImagePreviewProps {
  url?: string | null;
  altText?: string;
  size?: number;
  showUrl?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  url,
  altText = "Preview",
  size = 80,
  showUrl = false,
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const handleLoad = () => setLoading(false);
  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (!url || !isValidImageUrl(url)) {
    return (
      <Avatar sx={{ width: size, height: size, bgcolor: "primary.main" }}>
        <MedicalServicesIcon sx={{ fontSize: size * 0.5 }} />
      </Avatar>
    );
  }

  return (
    <Box>
      <Box position="relative" display="inline-block">
        {loading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: "translate(-50%, -50%)" }}
          >
            <CircularProgress size={size * 0.3} />
          </Box>
        )}

        <Avatar
          src={error ? undefined : url}
          alt={altText}
          sx={{
            width: size,
            height: size,
            opacity: loading ? 0.5 : 1,
            transition: "opacity 0.3s",
          }}
          onLoad={handleLoad}
          onError={handleError}
        >
          <MedicalServicesIcon sx={{ fontSize: size * 0.5 }} />
        </Avatar>
      </Box>

      {showUrl && (
        <Typography
          variant="caption"
          color="textSecondary"
          display="block"
          sx={{
            mt: 1,
            maxWidth: size * 3,
            wordBreak: "break-all",
            fontSize: "0.7rem",
          }}
        >
          {url}
        </Typography>
      )}
    </Box>
  );
};
