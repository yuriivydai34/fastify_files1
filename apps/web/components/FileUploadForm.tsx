import { useState } from 'react';
import { trpc } from '../utils/trpc';

export const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const utils = trpc.useContext();
  const uploadMutation = trpc.files.uploadFile.useMutation({
    onSuccess: () => {
      // Reset form and refresh file list
      setFile(null);
      utils.files.getFiles.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = base64.split(',')[1];
      await uploadMutation.mutate({
        name: file.name,
        file: base64Data,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Choose a file
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={!file || uploadMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </form>
  );
}; 