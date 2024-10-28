import React from "react";
import { FaShapes } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { ImFileEmpty } from "react-icons/im";
import { SlNotebook } from "react-icons/sl";
import PromptCard from "./components/PromptCard";

interface Notebook {
  id: string;
  name: string;
  createdAt: string;
}

export default function Home() {
  const notebooks: Notebook[] = [
    { id: "1", name: "Notebook 1", createdAt: "2021-10-10" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold text-xl">Get Started</h1>
      <div className="grid sm:grid-cols-2 gap-6 md:grid-cols-3">
        <PromptCard
          Icon={GiNotebook}
          title="Note Book"
          description="Create a new notebook for data analysis, and machine learning."
          to="new-notebook"
          toLabel="Create Notebook"
        />

        <PromptCard
          Icon={FaShapes}
          title="Import Data"
          description="Create a table by uploading local files"
          to="/data"
          toLabel="Create Table"
        />

        <PromptCard
          Icon={FaShapes}
          title="Create Compute"
          description="Create a cluster of worker nodes to run a notebook on."
          to="/compute/new-cluster"
          toLabel="Create Compute"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="font-bold">Recents</h2>
        <div className="flex flex-col gap-3">
          {notebooks.length === 0 && (
            <p className="flex items-center gap-3">
              <ImFileEmpty className="text-sm text-foreground/80" />
              No notebooks so far
            </p>
          )}
          <hr />
          {notebooks.map((notebook) => (
            <React.Fragment key={notebook.id}>
              <div className="flex items-center gap-3 text-sm">
                <SlNotebook className="text-foreground/80" />
                <div>
                  <h3 className="font-bold">{notebook.name}</h3>
                  <p className="text-foreground/80">
                    Notebook -{" "}
                    {new Date(notebook.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <hr />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
