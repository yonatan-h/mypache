import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

export default function NavigationLink({
  Icon,
  title,
  to,
}: {
  Icon: IconType;
  title: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm flex gap-2 pr-3 mx-1 rounded ${
          isActive ? "bg-background/20" : ""
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`w-1 h-full bg-red-500 ${isActive ? "" : "opacity-0"}`}
          ></div>
          <div className="flex-1 rounded flex gap-2 items-center px-2 py-1 ">
            <Icon className="text-xl" />
            <span>{title}</span>
          </div>
        </>
      )}
    </NavLink>
  );
}
