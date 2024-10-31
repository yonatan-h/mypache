import Loading from "@/components/state/Loading";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useCreateCluster,
  useGetRuntimes,
  useGetWorkersRatio,
} from "@/services/compute";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavChain from "../../components/layout/NavChain";
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

export default function NewCluster() {
  const [name, setName] = useState("MyCompute");
  const [runtimeId, setRuntimeId] = useState<string>("");
  const [workers, setWorkers] = useState(0);

  const runtimesQ = useGetRuntimes();
  const ratioQ = useGetWorkersRatio();
  const createQ = useCreateCluster();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <NavChain
        paths={[
          { path: "/app/compute", label: "Compute" },
          { path: "/app/compute/new-cluster", label: "New Cluster" },
        ]}
      />

      <div>
        <h1 className="font-bold text-xl pb-3">New Cluster</h1>
        <hr />
      </div>
      <form
        className="flex flex-col gap-6 max-w-[800px]"
        onSubmit={(e) => {
          e.preventDefault();
          createQ.mutate(
            { name, runtimeId, workers },
            { onSuccess: () => navigate("/app/compute") }
          );
        }}
      >
        <Label className="flex flex-col gap-2">
          <span className="font-bold">Compute Name</span>
          <Input
            className="min-w-0"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Input>
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="font-bold">Mybricks runtime version</span>
          <Select value={runtimeId} onValueChange={setRuntimeId}>
            <SelectTrigger className="">
              <div>
                {<Loading isLoading={runtimesQ.isLoading} />}
                {runtimesQ.data && <SelectValue placeholder="Select runtime" />}
              </div>
            </SelectTrigger>
            <SelectContent>
              {runtimesQ.data &&
                runtimesQ.data.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} ({r.lang})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Label>

        <div className="text-sm flex flex-col gap-2">
          <span className="font-bold">Instance</span>

          <p className="text-sm">
            <Loading isLoading={ratioQ.isLoading} />
            {ratioQ.data?.idle}/
            {(ratioQ.data?.idle || 0) + (ratioQ.data?.busy || 0)} workers
            available. Choose number of workers for this cluster.
          </p>
          <RadioGroup
            required
            value={workers.toString() || ""}
            onValueChange={(v) => setWorkers(+v)}
          >
            {Array.from({ length: ratioQ.data?.idle || 0 }).map((_, i) => (
              <div className="flex items-center space-x-2" key={i}>
                <RadioGroupItem
                  value={(i + 1).toString()}
                  id={`workers-${i}`}
                />
                <Label htmlFor={`workers-${i}`}>{i + 1}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <hr />
        <div className="flex flex-wrap gap-3">
          <Button isLoading={createQ.isLoading}>Create Compute</Button>
          <Link to="/app/compute">
            <Button variant={"outline"} type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
