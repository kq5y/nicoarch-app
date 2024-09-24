import { useDropzone } from "react-dropzone-esm";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  uploadProgress: number;
  uploadStatus: UploadStatusType;
  disabled?: boolean;
  filename?: string;
}

export default function Dropzone(params: DropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: params.onDrop,
    accept: {
      "video/mp4": [".mp4"],
    },
    multiple: false,
    disabled: params.disabled,
  });
  return (
    <div
      {...getRootProps()}
      className={`mb-2 h-32 flex items-center justify-center border-2 border-gray-200 rounded ${params.disabled ? "bg-gray-100" : "bg-white cursor-pointer"}`}
    >
      <input {...getInputProps()} />
      {params.uploadStatus === "Ready" && (
        <p className="select-none">MP4ファイルをドロップ(最大5GB)</p>
      )}
      {params.uploadStatus === "Uploading" && (
        <p className="select-none">アップロード中 {params.uploadProgress}%</p>
      )}
      {params.uploadStatus === "Complete" && (
        <p className="select-none text-center">
          アップロード完了
          <br />
          {params.filename}
        </p>
      )}
    </div>
  );
}
