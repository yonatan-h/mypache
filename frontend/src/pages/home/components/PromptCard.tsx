import { ReactNode } from "react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";

export default function PromptCard({
  Icon,
  title,
  description,
  to,
  toLabel,
  toComponent,
}: {
  Icon: IconType;
  title: string;
  description: string;
  to?: string;
  toLabel?: string;
  toComponent?: ReactNode;
}) {
  return (
    <div className="text-sm border shadow p-3 flex flex-col gap-3">
      <div className="flex gap-3 items-center">
        <div className="p-2 bg-blue-800 rounded">
          <Icon className="text-background " />
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="">{description}</p>
      {toComponent ? (
        toComponent
      ) : (
        <Link to={to || ""}>
          <Button variant="outline">{toLabel}</Button>
        </Link>
      )}
    </div>
  );
}
