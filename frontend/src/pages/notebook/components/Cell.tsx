import { AiFillDelete } from "react-icons/ai";
import { BiPlay } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { Button } from "../../../components/ui/button";
import { Notebook } from "../../../types/main-types";
import { ContentEditable } from "./ContentEditable";
import { tokenize } from "./tokenize";
import TokenSpan from "./TokenSpan";

export default function CellComponent({
  notebook,
  setNotebook,
  cellIndex,
}: {
  setNotebook: (n: Notebook) => void;
  notebook: Notebook;
  cellIndex: number;
}) {
  const cell = notebook.cells[cellIndex];
  const setContent = (content: string) => {
    const newCells = notebook.cells.slice();
    newCells[cellIndex] = { ...cell, content };
    setNotebook({ ...notebook, cells: newCells });
  };

  return (
    <div className="  relative text-sm font-mono border-l-2 border-primary/30 pl-3">
      <div className="flex absolute gap-2 right-3 top-3 items-center">
        {cell.loading ? (
          <CgSpinner className="  animate-spin text ml-2 mr-1" />
        ) : (
          <Button variant={"ghost"} className="w-6 h-5">
            <BiPlay />
          </Button>
        )}
        <Button variant={"ghost"} className="w-6 h-5">
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
      {cell.result && <div className="px-3 py-1">{cell.result}</div>}
      {cell.error && (
        <div className="px-3 py-1 bg-destructive/20">{cell.error}</div>
      )}
    </div>
  );
}
