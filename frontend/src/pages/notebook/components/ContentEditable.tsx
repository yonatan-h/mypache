import { ReactNode, useEffect, useRef, useState } from "react";

//passed
const getCursorIndex = (parent: Node, target: Node, offset: number): number => {
  if (parent !== target && !parent.contains(target)) {
    throw new Error("The cursor is not found in the parent node");
  }

  if (parent === target) return offset;

  let index = 0;
  for (const node of parent.childNodes) {
    if (node.contains(target) || node === target) {
      return index + getCursorIndex(node, target, offset);
    }
    index += node.textContent?.length || 0;
  }
  throw new Error("Something is terribly terribly wrong with the cursor");
};

const landCursor = (parent: Node, offset: number) => {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(parent, offset);
  range.collapse();
  sel?.removeAllRanges();
  sel?.addRange(range);
};

const restoreCursor = (parent: Node, remainingChars: number) => {
  const isWithin = remainingChars <= (parent.textContent?.length || 0);
  if (!isWithin) {
    throw new Error("The cursor is out of bounds");
  }

  if (isWithin && !parent.hasChildNodes()) {
    landCursor(parent, remainingChars);
    return;
  }

  for (const node of parent.childNodes) {
    const len = node.textContent?.length || 0;
    remainingChars -= len;
    if (remainingChars > 0) continue;
    restoreCursor(node, remainingChars + len);
    return;
  }
  throw new Error(
    `Something is terribly terribly wrong with the cursor, ${remainingChars} ${parent.textContent}`
  );
};

export function ContentEditable({
  onValueChange,
  className,
  children,
}: {
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [cursorIndex, setCursorIndex] = useState<number | null>(null);

  const updateCursorIndex = () => {
    const range = window.getSelection()?.getRangeAt(0);
    const offset = range?.startOffset || 0;
    const node = range?.startContainer;
    if (node && divRef.current?.contains(node)) {
      const cursorIndex = getCursorIndex(divRef.current, node, offset);
      setCursorIndex(cursorIndex);
      console.log("cursor index", cursorIndex);
    }
  };

  useEffect(() => {
    const div = divRef.current;
    if (!div || div.textContent === null) return console.log("No div");
    if (cursorIndex === null) return console.log("No index");
    if (cursorIndex > div.textContent.length || cursorIndex < 0) {
      return console.error("bad cursor index");
    }
    restoreCursor(div, cursorIndex);
  }, [cursorIndex, divRef.current?.textContent]);

  return (
    <>
      {/* <p>Cursor {JSON.stringify({ cursorIndex })}</p> */}
      <div
        key={Math.random()}
        ref={divRef}
        onBlur={() => setCursorIndex(null)}
        suppressContentEditableWarning
        contentEditable="plaintext-only"
        spellCheck="false"
        className={className}
        onInput={() => {
          updateCursorIndex();
          onValueChange(divRef.current?.textContent || "");
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();

            const sel = window.getSelection();
            const range = sel?.getRangeAt(0);
            if (!range) return;

            const node = document.createTextNode("  ");
            range.insertNode(node);
            range.setStartAfter(node);
            range.collapse();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }}
      >
        {children}
      </div>
    </>
  );
}
