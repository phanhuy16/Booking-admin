
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.includes('storage.googleapis.com') ||
      url.includes('firebasestorage.googleapis.com');
  } catch {
    return false;
  }
};

export const getImagePreview = (file: any): string | null => {
  if (!file) return null;

  // Nếu là file object từ ImageInput
  if (file.rawFile) {
    return URL.createObjectURL(file.rawFile);
  }

  // Nếu là URL string
  if (typeof file === 'string') {
    return file;
  }

  return null;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};