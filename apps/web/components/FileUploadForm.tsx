import { useState } from 'react';
import { trpc } from '../utils/trpc';
import type { TRPCClientError } from '@trpc/client';
import type { RouterInputs } from '../utils/trpc';

type UploadInput = RouterInputs['files']['uploadFile'];

export const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useContext();
  
  const uploadMutation = trpc.files.uploadFile.useMutation({
    onSuccess: () => {
      // Reset form and refresh file list
      setFile(null);
      setError(null);
      utils.files.getFiles.invalidate();
    },
    onError: (error: TRPCClientError<any>) => {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload file');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setError(null);
    const reader = new FileReader();
    
    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.onload = async () => {
      try {
        if (!reader.result) {
          throw new Error('Failed to read file');
        }

        let base64Data: string;
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix if it exists
          base64Data = reader.result.includes('base64,') 
            ? reader.result.split('base64,')[1] 
            : reader.result;
        } else {
          throw new Error('Invalid file data');
        }

        const uploadData: UploadInput = {
          name: file.name,
          file: base64Data,
          type: file.type
        };

        console.log('Uploading file with data:', {
          name: uploadData.name,
          type: uploadData.type,
          fileSize: base64Data.length
        });

        await uploadMutation.mutateAsync(uploadData);
      } catch (err) {
        console.error('File processing error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process file');
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Choose a file
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => {
              setError(null);
              const selectedFile = e.target.files?.[0] || null;
              if (selectedFile) {
                console.log('Selected file:', {
                  name: selectedFile.name,
                  type: selectedFile.type,
                  size: selectedFile.size
                });
              }
              setFile(selectedFile);
            }}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={!file || uploadMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </form>
  );
}; 