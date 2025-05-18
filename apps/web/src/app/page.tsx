import FilesList from "./filesList";
import FileUpload from "./fileUpload";
import KafkaMessages from "./kafkaMessages";

export default async function Home() {
  return (
    <div>
      <FilesList />
      <FileUpload />
      <KafkaMessages />
    </div>
  );
}
