import Loading from "@/components/state/Loading";
import { Button } from "@/components/ui/button";
import { useGetNotebook, useRunNotebook } from "@/services/notebook";
import { Notebook } from "@/types/notebook";
import { useEffect, useState } from "react";
import { BsFillEggFill } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import { useParams } from "react-router-dom";
import CellComponent from "./components/Cell";

export default function NotebookPage() {
  const { id } = useParams();
  const notebookQ = useGetNotebook(id || "-");
  const runQ = useRunNotebook();

  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [showAddLastCell, setShowAddLastCell] = useState(false);

  useEffect(() => {
    if (!notebookQ.data) return;
    setNotebook({
      numRuns: notebook?.numRuns || 0,
      ...notebookQ.data,
      cells: notebookQ.data.cells.map((cell) => ({ ...cell, loading: false })),
    });
  }, [notebook?.numRuns, notebookQ.data]);

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

  const addCell = (content: string = "") => {
    if (!notebook) return;
    const newNotebook = {
      ...notebook,
      cells: [
        ...notebook.cells,
        { content, error: "", result: "", loading: false },
      ],
    };
    setNotebook(newNotebook);
  };

  //debugging stuff
  const lastCell = notebook?.cells[notebook.cells.length - 1];
  useEffect(() => {
    if (!lastCell) return;
    if (notebook && notebook?.cells.length <= 1) return;
    localStorage.setItem("cell", lastCell?.content);
  }, [lastCell?.content]);

  useEffect(() => {
    const show = localStorage.getItem("showAddLastCell") === "true";
    if (show) setShowAddLastCell(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("showAddLastCell", showAddLastCell.toString());
  }, [showAddLastCell]);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] m-auto">
      {showAddLastCell && (
        <Button
          onClick={() => {
            addCell(localStorage.getItem("cell") || "print('h')");
          }}
        >
          Add last cell (for debugging)
        </Button>
      )}
      {notebookQ.isLoading && (
        <p className="flex gap-2 items-center">
          <Loading isLoading /> Loading notebook
        </p>
      )}
      {notebook && (
        <div className="flex flex-wrap justify-between items-center">
          <h1 className="font-bold text-xl">
            {notebook?.cluster.name} |{" "}
            <span className="bg-muted p-1 text-sm text-foreground/70 border">
              {notebook?.cluster.runtime.lang}
            </span>
          </h1>
          <button onClick={() => setShowAddLastCell(!showAddLastCell)}>
            <BsFillEggFill className="text-sm" />
          </button>
        </div>
      )}
      {notebook?.cells.map((c, index) => (
        <CellComponent
          key={`${index}-${c.id}`}
          notebook={notebook}
          setNotebook={setNotebook}
          runCell={runCell}
          cellIndex={index}
        />
      ))}
      <div>
        <Button onClick={() => addCell()} variant={"outline"}>
          <MdAdd />
          New Cell
        </Button>
      </div>
    </div>
  );
}
