// hooks/useCloudinaryUpload.ts
import { useState } from 'react';

interface UploadResult {
  secure_url: string;
  public_id: string;
}

interface UseCloudinaryUpload {
  uploadImage: (file: File) => Promise<UploadResult | null>;
  uploading: boolean;
  error: string | null;
}

export function useCloudinaryUpload(): UseCloudinaryUpload {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'vitrine_uploads';

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    if (!cloudName) {
      setError('Cloudinary não configurado corretamente');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      // Upload direto para Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload falhou: ${response.statusText}`);
      }

      const result: UploadResult = await response.json();
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro no upload:', err);
      return null;

    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}