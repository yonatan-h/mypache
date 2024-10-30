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
  const runTimes = [
    {
      id: "rn1",
      label: "1.0 STS (Python 3.13, Node 20.18)",
    },
  ];
  const [runTime, setRunTime] = useState(runTimes[0].id);

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
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {runTimes.map(({ id, label }) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>

        <div className="text-sm flex flex-col gap-2">
          <span className="font-bold">Instance</span>
          <p className="rounded shadow border p-3">
            Three workers per cluster. Your compute will automatically terminate
            after an idle period of one hour.
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
