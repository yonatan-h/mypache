import { AiOutlineSearch } from "react-icons/ai";
import { BiServer, BiTimeFive } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface Compute {
  name: string;
  runTime: number; //seconds
  numNodes: number;
}

export default function Compute() {
  const computes: Compute[] = [];
  return (
    <div className="flex flex-col gap-12">
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3}>
                <hr className="my-1" />
              </td>
            </tr>
            {computes.length === 0 && (
              <tr>
                <td colSpan={3}>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
