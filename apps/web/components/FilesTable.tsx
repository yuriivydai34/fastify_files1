import { trpc } from '../utils/trpc';
import { format } from 'date-fns';
import type { FileInfo } from 'schema';

export const FilesTable = () => {
  const { data: files, isLoading, error } = trpc.files.getFiles.useQuery();
  const deleteFileMutation = trpc.files.deleteFile.useMutation({
    onSuccess: () => {
      // Invalidate the files query to refresh the list
      trpc.files.getFiles.invalidate();
    }
  });

  if (isLoading) {
    return <div>Loading files...</div>;
  }

  if (error) {
    return <div>Error loading files: {error.message}</div>;
  }

  if (!files?.length) {
    return <div>No files uploaded yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file: FileInfo) => (
            <tr key={file.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {file.url ? (
                  <a href={file.url} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                ) : (
                  file.name
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {file.size ? `${Math.round(file.size / 1024)} KB` : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(file.createdAt), 'PPp')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this file?')) {
                      deleteFileMutation.mutate({ id: file.id });
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 