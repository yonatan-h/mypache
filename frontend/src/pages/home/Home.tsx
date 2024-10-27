import { FaShapes } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import PromptCard from "./components/PromptCard";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="font-bold text-xl">Get Started</h1>
      <div className="flex flex-wrap gap-6">
        <PromptCard
          Icon={FaShapes}
          title="Import Data"
          description="Create a table by uploading local files"
          to="/new-table"
          toLabel="Create Table"
        />
        <PromptCard
          Icon={GiNotebook}
          title="Note Book"
          description="Create a new notebook for data analysis, and machine learning."
          to="new-notebook"
          toLabel="Create Notebook"
        />
      </div>
    </div>
  );
}
