import { ReactNode, useEffect, useRef } from "react";

const getIndex = (parent: Node, child: Node, offset: number): number | null => {
  if (!parent.contains(child)) {
    console.error("child is not in parent");
    return null;
  }
  if (parent === child) return offset;

  let index = 0;
  for (const node of parent.childNodes) {
    if (node.contains(child)) {
      const childIndex = getIndex(node, child, offset);
      if (childIndex === null) return null;
      index += childIndex;

      break;
    } else {
      index += node.textContent?.length || 0;
    }
  }
  return index;
};

const getNodeAndOffset = (
  parent: Node,
  index: number
): [Node, number] | null => {
  if (index === 0 || parent.childNodes.length === 0) {
    return [parent, index];
  }

  for (const node of parent.childNodes) {
    const length = node.textContent?.length || 0;
    if (index > length) {
      index -= length;
    } else {
      return getNodeAndOffset(node, index);
    }
  }
  console.error(`out of bounds, remaining offset ${index}`);
  return null;
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
  const input = useRef<HTMLDivElement>(null);
  const index = useRef<number | null>(null);

  useEffect(() => {
    restoreSelection();
  }, [input.current?.textContent]);

  const restoreSelection = () => {
    if (!input.current) return;

    const range = document.createRange();
    range.selectNodeContents(input.current);
    const res = getNodeAndOffset(input.current, index.current || 0);
    if (!res) return;

    const [node, offset] = res;
    range.setStart(node, offset);
    range.setEnd(node, offset);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    console.log("restored selection");
  };

  const getCursorIndex = (): number | null => {
    if (!input.current) return null;
    const selection = window.getSelection();
    if (!selection?.anchorNode) return null;

    const index = getIndex(
      input.current,
      selection.anchorNode,
      selection.focusOffset
    );
    console.log("🚀 ~ getCursorIndex ~ index:", index);
    return index;
  };

  const saveCursorIndex = (number?: number) => {
    if (input.current === null) {
      console.error("input is null");
      return;
    }

    if (number) {
      index.current = number;
    } else {
      index.current = getCursorIndex();
    }
  };

  const onInput = () => {
    saveCursorIndex();
    onValueChange(input.current?.textContent || "");
  };

  //handle special key presses
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();

      const selection = window.getSelection();
      if (!selection) return console.error("no selection");
      const range = selection.getRangeAt(0);

      const tabNode = document.createTextNode("  ");
      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <>
      <div
        key={Math.random()}
        ref={input}
        suppressContentEditableWarning
        contentEditable="plaintext-only"
        spellCheck="false"
        className={className}
        onInput={onInput}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </>
  );
}
