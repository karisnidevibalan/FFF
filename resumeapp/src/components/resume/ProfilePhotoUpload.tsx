import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Camera, 
  Image as ImageIcon, 
  Loader2,
  Check,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
  userName?: string;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto,
  onPhotoChange,
  userName = 'User',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [zoom, setZoom] = useState([1]);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsUploading(true);
    try {
      // In production, upload to cloud storage (Cloudinary, S3, etc.)
      // For now, we'll use the local preview URL or convert to base64
      
      // Convert to base64 for local storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onPhotoChange(base64String);
        setIsOpen(false);
        resetState();
      };
      reader.readAsDataURL(selectedFile);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setZoom([1]);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange('');
    resetState();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Current Photo Display */}
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
          <AvatarImage 
            src={currentPhoto} 
            alt={userName}
            style={{ 
              transform: `scale(${zoom[0]}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s'
            }}
          />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay on hover */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
            >
              <Camera className="w-8 h-8 text-white" />
            </motion.div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Update Profile Photo
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Drop Zone or Preview */}
              {!previewUrl ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop an image, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPG, PNG, GIF (Max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* Preview Image */}
                  <div className="relative aspect-square max-w-[300px] mx-auto rounded-xl overflow-hidden bg-muted">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      style={{ 
                        transform: `scale(${zoom[0]}) rotate(${rotation}deg)`,
                        transition: 'transform 0.2s'
                      }}
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={resetState}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Edit Controls */}
                  <div className="space-y-4">
                    {/* Zoom Control */}
                    <div className="flex items-center gap-4">
                      <ZoomOut className="w-4 h-4 text-muted-foreground" />
                      <Slider
                        value={zoom}
                        onValueChange={setZoom}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <ZoomIn className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Rotation Control */}
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRotation((r) => r - 90)}
                      >
                        <RotateCw className="w-4 h-4 rotate-180" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRotation((r) => r + 90)}
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {currentPhoto && (
                  <Button
                    variant="destructive"
                    onClick={handleRemovePhoto}
                    className="flex-1"
                  >
                    Remove Photo
                  </Button>
                )}
                <Button
                  onClick={handleUpload}
                  disabled={!previewUrl || isUploading}
                  className="flex-1 gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Photo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          <Camera className="w-4 h-4 mr-2" />
          {currentPhoto ? 'Change Photo' : 'Add Photo'}
        </Button>
        {currentPhoto && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemovePhoto}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
