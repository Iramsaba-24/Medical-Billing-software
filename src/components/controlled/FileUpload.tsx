import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface FileUploadProps {
  name: string;
  label: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  preview?: string | null;
  onChange?: (file: File | null) => void;
  onDelete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  required = false,
  accept = 'image/*,application/pdf',
  maxSizeMB = 2,
  preview,
  onChange,
  onDelete
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const errorMessage = localError || (errors[name]?.message as string) || '';

  const effectivePreview = preview || objectUrl;

  const fieldValue = watch(name);

  useEffect(() => {
    if (!fieldValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
    }
  }, [fieldValue, objectUrl]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File must be smaller than ${maxSizeMB}MB`);
      setSelectedFile(null);
      setValue(name, []);
      onChange?.(null);
      return;
    }

    if (objectUrl) URL.revokeObjectURL(objectUrl);

    setSelectedFile(file);
    setValue(name, file, { shouldValidate: true });
    setLocalError(null);
    onChange?.(file);

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setObjectUrl(URL.createObjectURL(file));
    } else {
      setObjectUrl(null);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    setValue(name, null, { shouldValidate: true });
    onChange?.(null);
    if (onDelete) onDelete();
  };

  return (
    <Box>
      <Button variant="contained" component="label" fullWidth sx={{ borderRadius: 2 }}>
        {label} {required && '*'}
        <input
          type="file"
          hidden
          accept={accept}
          {...register(name, {
            required: required ? `${label} is required` : false,
            onChange: handleFileChange
          })}
        />
      </Button>

      {selectedFile && (
        <Box
          sx={{
            mt: 2,
            p: 1,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2">{selectedFile.name}</Typography>
          <Box>
            <IconButton onClick={() => setPreviewOpen(true)} size="small" title="Preview" aria-label="Preview file">
              <VisibilityIcon />
            </IconButton>
            <IconButton onClick={handleDelete} size="small" title="Remove" aria-label="Remove file" color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {errorMessage && (
        <Typography id={`${name}-error`} color="error" variant="body2" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogContent dividers>
          {effectivePreview &&
            (selectedFile?.type === 'application/pdf' ? (
              <Box component="iframe" src={effectivePreview} sx={{ width: '100%', height: '70vh', border: 'none' }} />
            ) : (
              <Box component="img" src={effectivePreview} alt="Preview" sx={{ maxWidth: '100%', maxHeight: '70vh', display: 'block' }} />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUpload;
