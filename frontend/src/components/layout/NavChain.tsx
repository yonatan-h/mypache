import React from "react";
import { NavLink } from "react-router-dom";

export default function NavChain({
  paths,
}: {
  paths: { path: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-1">
      {paths.map(({ path, label }, i) => (
        <React.Fragment key={path}>
          <NavLink
            to={path}
            className={`text-sm ${
              i === paths.length - 1 ? "" : "text-blue-700"
            }`}
          >
            {label}
          </NavLink>
          {i !== paths.length - 1 && <span>|</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
