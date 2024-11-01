import Loading from "@/components/state/Loading";
import { useStopCluster } from "@/services/compute";
import { Cluster } from "@/types/compute";
import { BiStop } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { RxDotFilled } from "react-icons/rx";

export default function ComputeRow({ cluster }: { cluster: Cluster }) {
  const stopQ = useStopCluster();
  return (
    <tr key={cluster.name}>
      <td className="px-3 border-r text-foreground/80 text-sm">
        {cluster.state === "live" && (
          <span className="flex items-center">
            <RxDotFilled className="text-3xl text-green-600" />
            Running
          </span>
        )}

        {cluster.state === "stopped" && (
          <span className="flex items-center">
            <BiStop className="text-xl text-red-700 mx-1" /> Stopped
          </span>
        )}

        {cluster.state === "loading" && (
          <span className="flex items-center">
            <CgSpinner className="animate-spin text ml-2 mr-1" /> Preparing
          </span>
        )}
      </td>
      <td className="px-3 border-r text-foreground/80 text-sm">
        {cluster.name}
      </td>
      <td className="px-3 border-r text-foreground/80 text-sm">
        {cluster.runtime.name} ({cluster.runtime.lang})
      </td>
      <td className="px-3 text-foreground/80 text-sm">
        {cluster.workers.length}
      </td>

      <td className="px-3 text-foreground/80 text-sm">
        {cluster.state === "live" ? (
          <>
            <Loading isLoading={stopQ.isLoading} />
            {!stopQ.isLoading && (
              <button
                className="px-3 hover:opacity-50"
                onClick={() => {
                  stopQ.mutate(cluster.id);
                }}
              >
                <BiStop className="text-2xl" />
              </button>
            )}
          </>
        ) : (
          <span className="px-5">-</span>
        )}
      </td>
    </tr>
  );
}
