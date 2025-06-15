
import { FileAudio } from "lucide-react";

interface FilePreviewProps {
  file: File;
  audioUrl: string;
}

const FilePreview = ({ file, audioUrl }: FilePreviewProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <FileAudio className="h-8 w-8 text-blue-600" />
        <div className="flex-1">
          <p className="font-medium truncate">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <audio controls className="w-full max-w-xs rounded-md">
          <source src={audioUrl} type={file.type} />
        </audio>
      </div>
    </div>
  );
};

export default FilePreview;
