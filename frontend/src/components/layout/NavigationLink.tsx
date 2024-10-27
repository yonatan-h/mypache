import { IconType } from "react-icons";
import { NavLink, useLocation } from "react-router-dom";

export default function NavigationLink({
  Icon,
  title,
  to,
}: {
  Icon: IconType;
  title: string;
  to: string;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink to={to} className="text-sm flex gap-2 pr-3 mx-1  rounded">
      <div
        className={`w-1 h-full bg-red-500 ${isActive ? "" : "opacity-0"}`}
      ></div>
      <div
        className={`
            flex-1 rounded flex gap-2 items-center px-2 py-1
            ${isActive ? "bg-background/20 " : ""}`}
      >
        <Icon className="text-xl" />
        <span>{title}</span>
      </div>
    </NavLink>
  );
}
