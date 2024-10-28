import { AiOutlineCloud, AiOutlineDatabase } from "react-icons/ai";
import { BsBricks } from "react-icons/bs";
import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import NavigationLink from "./NavigationLink";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-6 bg-foreground text-background flex justify-between items-center p-2">
        <Link
          to="/"
          className="flex items-center gap-3 text font-bold text-background/90 "
        >
          <BsBricks />
          mybricks
        </Link>
        <Button className="bg-background/20 rounded-full w-8 h-8">Y</Button>
      </div>
      <div className="flex-1 flex ">
        <nav
          className={`
             py-2 bg-foreground border-y text-background/90
            border-background/20 flex flex-col gap-2`}
        >
          {/* <NavigationLink Icon={IoMdAddCircleOutline} title="New" to="/new" /> */}
          <NavigationLink Icon={AiOutlineDatabase} title="Data" to="/data" />
          <NavigationLink Icon={AiOutlineCloud} title="Compute" to="/compute" />
        </nav>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
