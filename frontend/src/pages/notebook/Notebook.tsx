import { useState } from "react";
import { useParams } from "react-router-dom";
import { Notebook } from "../../types/main-types";
import CellComponent from "./components/Cell";

export default function NotebookPage() {
  const { id } = useParams();
  const [notebook, setNotebook] = useState<Notebook>({
    id: "1",
    clusterId: "1",
    fileId: "1",
    name: "Notebook 1",
    createdAt: "2021-10-10",
    cells: [
      {
        content: `
# generate
from random import random
import pandas as pd

xy_pairs = [] #for 
for i in range(1000):
    x = i
    y = 2*x + 1 + random()*5-2.5
    xy_pairs.append([x,y])

df = pd.DataFrame(xy_pairs, columns=["x", "y"])
print('hello world')
print(df)`,
        error: "",
        loading: false,
        result: "Hello world",
      },
      {
        content: `
# save
df.to_csv("mycsv.csv", index=False)
`,
        error: "Could'nt load server",
        loading: false,
        result: "",
      },
      {
        content: `
# save
df.to_csv("mycsv.csv", index=False)
`,
        error: "",
        loading: true,
        result: "",
      },
      { content: "", error: "", loading: false, result: "" },
    ],
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] m-auto">
      <h1 className="font-bold text-xl">
        {notebook.name} |{" "}
        <span className="bg-muted p-1 text-sm text-foreground/70 border">
          python3
        </span>
      </h1>
      {notebook.cells.map((_, index) => (
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
