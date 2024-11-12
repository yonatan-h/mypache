import { Notebook } from "@/types/notebook";
import { AiFillDelete } from "react-icons/ai";
import { BiPlay } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { Button } from "../../../components/ui/button";
import { ContentEditable } from "./ContentEditable";
import { tokenize } from "./tokenize";
import TokenSpan from "./TokenSpan";

export default function CellComponent({
  notebook,
  setNotebook,
  cellIndex,
  runCell,
}: {
  setNotebook: (n: Notebook) => void;
  notebook: Notebook;
  cellIndex: number;
  runCell: (i: number) => void;
}) {
  const cell = notebook.cells[cellIndex];
  const setContent = (content: string) => {
    const newCells = notebook.cells.slice();
    newCells[cellIndex] = { ...cell, content };
    setNotebook({ ...notebook, cells: newCells });
  };

  const remove = () => {
    const newCells = [
      ...notebook.cells.slice(0, cellIndex),
      ...notebook.cells.slice(cellIndex + 1),
    ];
    setNotebook({ ...notebook, cells: newCells });
  };

  return (
    <div className="  relative text-sm font-mono border-l-2 border-primary/30 pl-3">
      <span className="absolute bottom-0 right-3 text-xs  opacity-20">
        id:{cell.id || "new"}
      </span>
      <div className="flex absolute gap-2 right-3 top-3 items-center">
        {cell.loading ? (
          <CgSpinner className="  animate-spin text ml-2 mr-1" />
        ) : (
          <Button
            onClick={() => runCell(cellIndex)}
            variant={"ghost"}
            className="w-6 h-5"
          >
            <BiPlay />
          </Button>
        )}

        <Button variant={"ghost"} className="w-6 h-5" onClick={remove}>
          <AiFillDelete />
        </Button>
      </div>
      <ContentEditable
        onValueChange={setContent}
        className="border px-3 py-3 bg-muted min-h-[5rem] focus:outline-1 focus:outline-primary/70"
      >
        {tokenize(cell.content).map((t, i) => (
          <span key={i} className="">
            {/* <span className="text-xs opacity-50">{t.tt}</span> */}
            <TokenSpan token={t} key={i} />
          </span>
        ))}
      </ContentEditable>
      {cell.result && (
        <p className="px-3 py-1 whitespace-break-spaces ">{cell.result}</p>
      )}
      {cell.error && (
        <p className="px-3 py-1 bg-destructive/20 whitespace-break-spaces">
          {cell.error}
        </p>
      )}
    </div>
  );
}
