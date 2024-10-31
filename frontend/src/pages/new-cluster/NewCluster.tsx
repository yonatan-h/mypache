import Loading from "@/components/state/Loading";
import { useGetRuntimes, useGetWorkersRatio } from "@/services/compute";
import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [computeName, setComputeName] = useState("MyCompute");
  const [runTime, setRunTime] = useState<string>("");

  const runtimesQ = useGetRuntimes();
  const workersRatioQ = useGetWorkersRatio();

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
        }}
      >
        <Label className="flex flex-col gap-2">
          <span className="font-bold">Compute Name</span>
          <Input
            className="min-w-0"
            required
            value={computeName}
            onChange={(e) => setComputeName(e.target.value)}
          ></Input>
        </Label>

        <Label className="flex flex-col gap-2">
          <span className="font-bold">Mybricks runtime version</span>
          <Select value={runTime} onValueChange={setRunTime}>
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
          <p className="rounded shadow border p-3">
            <Loading isLoading={workersRatioQ.isLoading} /> workers per cluster.
            Your compute will automatically terminate after an idle period of
            one hour.
          </p>
        </div>
        <hr />
        <div className="flex flex-wrap gap-3">
          <Button>Create Compute</Button>
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
