import Loading from "@/components/state/Loading";
import { useGetNotebook } from "@/services/notebook";
import { Notebook } from "@/types/notebook";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CellComponent from "./components/Cell";

export default function NotebookPage() {
  const { id } = useParams();
  console.log("🚀 ~ NotebookPage ~ id:", id);

  const notebookQ = useGetNotebook(id || "-");
  const [notebook, setNotebook] = useState<Notebook | null>(null);

  useEffect(() => {
    if (!notebookQ.data) return;
    setNotebook({
      ...notebookQ.data,
      cells: notebookQ.data.cells.map((cell) => ({ ...cell, loading: false })),
    });
  }, [notebookQ.data]);

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
          cellIndex={index}
        />
      ))}
    </div>
  );
}
