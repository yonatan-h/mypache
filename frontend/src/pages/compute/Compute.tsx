import { AiOutlineSearch } from "react-icons/ai";
import { BiServer, BiStop, BiTimeFive } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RxDotFilled, RxSwitch } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Compute } from "../../types/main-types";

export default function ComputePage() {
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold text-xl">Compute</h1>

      <div className="flex flex-wrap gap-3 justify-between">
        <div className=" md:w-[30rem] relative flex items-center">
          <AiOutlineSearch className="absolute left-3 opacity-50" />
          {/* Todo: make functional  */}
          <Input
            className="pl-9"
            placeholder="Filter compute you have access to"
          />
        </div>

        <Link to="/compute/new-cluster">
          <Button>Create Compute</Button>
        </Link>
      </div>

      <div>
        <table className="w-full">
          <thead>
            <tr className=" ">
              <th className="text-start px-3  border-r text-foreground/80 text-sm">
                <span className="flex gap-1 items-center">
                  <RxSwitch />
                  State
                </span>
              </th>
              <th className="text-start px-3  border-r text-foreground/80 text-sm">
                <span className="flex gap-1 items-center">
                  <MdDriveFileRenameOutline />
                  Name
                </span>
              </th>
              <th className="text-start px-3  border-r text-foreground/80 text-sm">
                <span className="flex gap-1 items-center">
                  <BiTimeFive />
                  Run Time
                </span>
              </th>
              <th className="text-start px-3  text-foreground/80 text-sm">
                <span className="flex gap-1 items-center">
                  <BiServer />
                  Nodes
                </span>
              </th>

              <th className="text-start px-3  text-foreground/80 text-sm">
                <span className="flex gap-1 items-center">
                  <CiSettings className="text-xl" />
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4}>
                <hr className="my-1" />
              </td>
            </tr>
            {computes.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col gap-3 items-center p-6 text-foreground/70">
                    <IoMdAdd className="text-7xl opacity-50" />
                    <div className="text-center">
                      <p className="font-bold">No Compute</p>
                      <p className="text-sm">
                        Create compute to run workloads from your notebooks
                      </p>
                    </div>

                    <Link to="/compute/new-cluster">
                      <Button variant={"outline"} className="shadow">
                        Create Compute
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            )}
            {computes.map((compute) => (
              <tr key={compute.name}>
                <td className="px-3 border-r text-foreground/80 text-sm">
                  {compute.state === "live" && (
                    <span className="flex items-center">
                      <RxDotFilled className="text-3xl text-green-600" />
                      Running
                    </span>
                  )}

                  {compute.state === "stopped" && (
                    <span className="flex items-center">
                      <BiStop className="text-xl text-red-700 mx-1" /> Stopped
                    </span>
                  )}

                  {compute.state === "loading" && (
                    <span className="flex items-center">
                      <CgSpinner className="animate-spin text ml-2 mr-1" />{" "}
                      Preparing
                    </span>
                  )}
                </td>
                <td className="px-3 border-r text-foreground/80 text-sm">
                  {compute.name}
                </td>
                <td className="px-3 border-r text-foreground/80 text-sm">
                  {compute.runTime}
                </td>
                <td className="px-3 text-foreground/80 text-sm">
                  {compute.numWorkers}
                </td>

                <td className="px-3 text-foreground/80 text-sm">
                  {compute.state === "live" ? (
                    <button className="px-3 hover:opacity-50">
                      <BiStop className="text-2xl" />
                    </button>
                  ) : (
                    <span className="px-5">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
