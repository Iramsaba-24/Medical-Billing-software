import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, CircularProgress, Typography } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

interface PhotoUploadProps {
  name: string;
  defaultPhoto?: string | File;
  onPhotoChange?: (file: File | null) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  name, 
  defaultPhoto,
  onPhotoChange 
}) => {
  const { setValue, watch } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  
  // Watch for changes to the form field
  const formPhotoValue = watch(name);

  // Initialize preview with defaultPhoto
  useEffect(() => {
    const initializePreview = async () => {
      if (defaultPhoto) {
        if (typeof defaultPhoto === 'string') {
          // It's a URL string from backend or data URL
          setPreview(defaultPhoto);
        } else if (defaultPhoto instanceof File) {
          // It's a File object, create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.onerror = () => {
            setPreview('');
          };
          reader.readAsDataURL(defaultPhoto);
        }
      } else {
        setPreview('');
      }
    };

    initializePreview();
  }, [defaultPhoto]);

  // Watch for form changes
  useEffect(() => {
    if (formPhotoValue) {
      if (typeof formPhotoValue === 'string') {
        // It's a URL string (from backend)
        if (!formPhotoValue.startsWith('data:')) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPreview(formPhotoValue);
        }
      } else if (formPhotoValue instanceof File) {
        // It's a File object (from form)
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(formPhotoValue);
      }
    } else {
      setPreview('');
    }
  }, [formPhotoValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, JPG, PNG)');
        return;
      }

      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert(`Image size should be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      setUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setValue(name, file, { shouldValidate: true }); // Store the file object
        setUploading(false);
        
        // Notify parent if callback provided
        if (onPhotoChange) {
          onPhotoChange(file);
        }
      };
      reader.onerror = () => {
        setUploading(false);
        alert('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreview('');
    setValue(name, null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Notify parent if callback provided
    if (onPhotoChange) {
      onPhotoChange(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2,
      position: 'relative',
      width: 150,
      margin: '0 auto'
    }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 180,
          border: '2px dashed #ccc',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
          backgroundColor: preview ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
          '&:hover': {
            borderColor: 'primary.main',
            '& .overlay': {
              opacity: 1,
            }
          }
        }}
        onClick={handleClick}
      >
        {uploading ? (
          <CircularProgress size={40} />
        ) : preview ? (
          <>
            <Box
              component="img"
              src={preview}
              alt="Student Photo"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={() => setPreview('')} // Handle broken image URLs
            />
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
            >
              <PhotoCamera sx={{ color: 'white', fontSize: 40 }} />
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 12,
                }}
              >
                Click to change photo
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ textAlign: 'center' }}>
              <PhotoCamera sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: 12,
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                Click to upload ID photo
                <br />
                3.5 x 4.5 cm
                <br />
                Max 2MB
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png"
        style={{ display: 'none' }}
      />

      {preview && !uploading && (
        <IconButton
          onClick={handleRemovePhoto}
          color="error"
          size="small"
          sx={{ 
            position: 'absolute', 
            top: -8, 
            right: -8, 
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'error.main',
              color: 'white'
            }
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default PhotoUpload;