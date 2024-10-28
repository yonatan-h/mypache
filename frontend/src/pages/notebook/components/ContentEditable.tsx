import { ReactNode, useEffect, useRef } from "react";

const getIndex = (parent: Node, child: Node, offset: number): number => {
  if (!parent.contains(child)) throw new Error("child is not in parent");
  if (parent === child) {
    return offset;
  }

  let index = 0;
  for (const node of parent.childNodes) {
    if (node.contains(child)) {
      index += getIndex(node, child, offset);
      break;
    } else {
      index += node.textContent?.length || 0;
    }
  }
  return index;
};

const getNodeAndOffset = (parent: Node, index: number): [Node, number] => {
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
  throw new Error(`out of bounds, remaining offset ${index}`);
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
  const indexes = useRef<[number, number] | null>(null);

  //restore selection
  useEffect(() => {
    if (!input.current) return;
    if (!indexes.current) return;

    const range = document.createRange();
    range.selectNodeContents(input.current);
    range.setStart(...getNodeAndOffset(input.current, indexes.current[0]));
    range.setEnd(...getNodeAndOffset(input.current, indexes.current[1]));
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    console.log("here");
  }, [input.current?.textContent]);

  const onInput = (text: string) => {
    if (input.current) {
      //save cursor
      const range = window.getSelection();

      if (!range?.anchorNode || !range?.focusNode) return;

      indexes.current = [
        getIndex(input.current, range.anchorNode, range.anchorOffset),
        getIndex(input.current, range.focusNode, range.focusOffset),
      ];
      indexes.current.sort((a, b) => a - b);
    }

    onValueChange(text);
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
        onInput={(e) => onInput(e.currentTarget.innerText)}
      >
        {children}
      </div>
    </>
  );
}
