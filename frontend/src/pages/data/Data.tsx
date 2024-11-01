import { useUploadSparkFile } from "@/services/data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function Data() {
  const dataSources = ["Upload File"];
  const [dataSource, setDataSource] = useState(dataSources[0]);
  const [targetName, setTargetName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const uploadQ = useUploadSparkFile();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold text-xl">Create New Table</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!file) return;
          uploadQ.mutate(
            { targetName, file },
            {
              onSuccess: () => {
                navigate("/app");
              },
            }
          );
        }}
        className="flex flex-col gap-6 max-w-[800px]"
      >
        <Label className="flex flex-col gap-2">
          <span className="font-bold">Data Source</span>
          <Select value={dataSource} onValueChange={setDataSource}>
            <SelectTrigger className="">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {dataSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="font-bold">Target File Name</span>
          <Input
            className="min-w-0"
            required
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
          />
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="font-bold">CSV File</span>
          <Input
            className="min-w-0"
            type="file"
            accept=".csv"
            required
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFile(file);
            }}
          />
        </Label>
        <div>
          <Button isLoading={uploadQ.isLoading}>Upload</Button>
        </div>
      </form>
    </div>
  );
}
