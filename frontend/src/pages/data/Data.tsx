import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";

export default function Data() {
  const dataSources = ["Upload File"];
  const [dataSource, setDataSource] = useState(dataSources[0]);
  const [fileName, setFileName] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold text-xl">Create New Table</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
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
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="font-bold">CSV File</span>
          <Input className="min-w-0" type="file" accept=".csv" required />
        </Label>
        <div>
          <Button>Upload</Button>
        </div>
      </form>
    </div>
  );
}
