import { Button } from "ui";
import { trpc } from "../utils/trpc";
import { FilesTable } from '../components/FilesTable';
import { FileUploadForm } from '../components/FileUploadForm';

export default function Web() {
  const health = trpc.health.health.useQuery();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Files</h1>
      <FileUploadForm />
      <FilesTable />
      {health.data && <p>TRPC Health: {health.data.health}</p>}
    </div>
  );
}
