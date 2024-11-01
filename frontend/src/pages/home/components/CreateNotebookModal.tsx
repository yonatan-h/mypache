import Loading from "@/components/state/Loading";
import { useGetClusters } from "@/services/compute";
import { useGetSparkFiles } from "@/services/data";
import { useCreateNotebook } from "@/services/notebook";
import { useState } from "react";
import { AiFillFileText } from "react-icons/ai";
import { BiStop } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { ImFileEmpty } from "react-icons/im";
import { RxDotFilled } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
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

export default function CreateNotebookModal() {
  const [open, setOpen] = useState(false);
  const clusterQ = useGetClusters();
  const filesQ = useGetSparkFiles();
  const createQ = useCreateNotebook();

  const [clusterId, setClusterId] = useState("");
  const [fileId, setFileId] = useState("");
  const navigate = useNavigate();

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setClusterId("");
        setFileId("");
        setOpen(v);
      }}
    >
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
            createQ.mutate(
              { clusterId: clusterId, fileId },
              { onSuccess: (n) => navigate(`/app/notebooks/${n.id}`) }
            );
          }}
          className="flex flex-col gap-3"
        >
          <hr />
          <RadioGroup
            value={clusterId}
            onValueChange={(v) => setClusterId(v)}
            required
          >
            <Loading isLoading={clusterQ.isLoading} />

            {clusterQ.data?.length === 0 && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <ImFileEmpty />
                  No clusters found.
                </span>
                <Link to="/app/compute/new-cluster" className="font-bold">
                  <Button>Add a File</Button>
                </Link>
              </div>
            )}
            {clusterQ.data?.map((c) => (
              <div key={c.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={c.id}
                  id={"c" + c.id}
                  disabled={c.state !== "live"}
                />
                <Label
                  htmlFor={"c" + c.id}
                  className="flex gap-2 items-center cursor-pointer"
                >
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
                  <span>({c.workers.length} workers)</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <hr />

          <RadioGroup
            value={fileId}
            onValueChange={(v) => setFileId(v)}
            required
          >
            <Loading isLoading={filesQ.isLoading} />
            {filesQ.data?.length === 0 && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <ImFileEmpty />
                  No files found.
                </span>
                <Link to="/app/data" className="font-bold">
                  <Button>Add a File</Button>
                </Link>
              </div>
            )}
            {filesQ.data?.map((f) => (
              <div key={f.id} className="flex items-center space-x-2">
                <RadioGroupItem value={f.id} id={"f" + f.id} />
                <Label
                  htmlFor={"f" + f.id}
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <AiFillFileText className="ml-2" />
                  {f.filename}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <hr />
          <Button
            disabled={filesQ.data?.length === 0 || clusterQ.data?.length === 0}
          >
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
