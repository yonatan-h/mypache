import { useState } from "react";
import { BiStop } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { RxDotFilled } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Compute, File } from "../../../types/main-types";

export default function CreateNotebookModal() {
  const computes: Compute[] = [
    {
      id: "1",
      state: "live",
      name: "compute1",
      runTime: "1.0 STS (Python 3.13, Node 20.18)",
      numWorkers: 3,
    },

    {
      id: "2",
      state: "stopped",
      name: "compute2",
      runTime: "1.0 STS (Python 3.13, Node 20.18)",
      numWorkers: 3,
    },

    {
      id: "3",
      state: "loading",
      name: "compute3",
      runTime: "1.0 STS (Python 3.13, Node 20.18)",
      numWorkers: 3,
    },
  ];

  const files: File[] = [
    { id: "1", name: "file1" },
    { id: "2", name: "file2" },
  ];

  const [computeId, setComputeId] = useState(computes[0].id);
  const [fileName, setFileId] = useState(files[0].id);
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button variant="outline">Create Notebook</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle>Create Notebook</DialogTitle>
          <DialogDescription>
            Please choose a cluster and a file to work with.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/notebook/5");
          }}
          className="flex flex-col gap-3"
        >
          <hr />
          <RadioGroup
            value={computeId}
            onValueChange={(v) => setComputeId(v)}
            required
          >
            {computes.map((c) => (
              <div key={c.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={c.id}
                  id={"c" + c.id}
                  disabled={c.state !== "live"}
                />
                <Label htmlFor={"c" + c.id} className="flex gap-2 items-center">
                  <div className="flex items-center">
                    {c.state === "live" && (
                      <RxDotFilled className="text-3xl text-green-600" />
                    )}

                    {c.state === "stopped" && (
                      <BiStop className="text-xl text-red-700 mx-1" />
                    )}

                    {c.state === "loading" && (
                      <CgSpinner className="animate-spin text ml-2 mr-1" />
                    )}
                    <span>{c.name}</span>
                  </div>
                  <span>{c.numWorkers} workers</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <hr />

          <RadioGroup
            value={fileName}
            onValueChange={(v) => setFileId(v)}
            required
          >
            {files.map((f) => (
              <div key={f.id} className="flex items-center space-x-2">
                <RadioGroupItem value={f.id} id={"f" + f.id} />
                <Label htmlFor={"f" + f.id} className="flex gap-2 items-center">
                  {f.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <hr />
          <Button>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
