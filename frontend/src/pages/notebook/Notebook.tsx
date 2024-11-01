import Loading from "@/components/state/Loading";
import { useGetNotebook, useRunNotebook } from "@/services/notebook";
import { Notebook } from "@/types/notebook";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CellComponent from "./components/Cell";

export default function NotebookPage() {
  const { id } = useParams();
  const notebookQ = useGetNotebook(id || "-");
  const runQ = useRunNotebook();

  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const runCell = (cellIndex: number) => {
    if (!notebook) return;
    const newNotebook = {
      ...notebook,
      numRuns: notebook.numRuns + 1,
      cells: notebook?.cells.map((cell, index) =>
        index === cellIndex ? { ...cell, loading: true } : cell
      ),
    };
    setNotebook(newNotebook);
    runQ.mutate({
      id: notebook.id,
      index: cellIndex,
      cells: newNotebook.cells.map((c) => {
        const { loading, ...cell } = c;
        return cell;
      }),
    });
  };

  useEffect(() => {
    console.log("here");
    if (!notebookQ.data) return;
    setNotebook({
      numRuns: notebook?.numRuns || 0,
      ...notebookQ.data,
      cells: notebookQ.data.cells.map((cell) => ({ ...cell, loading: false })),
    });
  }, [notebook?.numRuns, notebookQ.data]);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] m-auto">
      {notebookQ.isLoading && (
        <p className="flex gap-2 items-center">
          <Loading isLoading /> Loading notebook
        </p>
      )}
      {notebook && (
        <h1 className="font-bold text-xl">
          {notebook?.cluster.name} |{" "}
          <span className="bg-muted p-1 text-sm text-foreground/70 border">
            {notebook?.cluster.runtime.lang}
          </span>
        </h1>
      )}
      {notebook?.cells.map((_, index) => (
        <CellComponent
          key={index}
          notebook={notebook}
          setNotebook={setNotebook}
          runCell={runCell}
          cellIndex={index}
        />
      ))}
    </div>
  );
}
