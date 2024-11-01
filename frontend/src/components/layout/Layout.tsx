import { blockNoAuth, useGetMe } from "@/services/user";
import { useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineCloud,
  AiOutlineDatabase,
} from "react-icons/ai";
import { BsBricks } from "react-icons/bs";
import { Link, Outlet } from "react-router-dom";
import Loading from "../state/Loading";
import { Button } from "../ui/button";
import NavigationLink from "./NavigationLink";

export default function Layout() {
  blockNoAuth();
  const meQ = useGetMe();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-6 bg-foreground text-background flex justify-between items-center p-2">
        <Link
          to="/app"
          className="flex items-center gap-3 text font-bold text-background/90 "
        >
          <BsBricks />
          mybricks
        </Link>
        <Button className="bg-background/20 rounded-full w-8 h-8">
          <Loading isLoading={meQ.isLoading} />
          {meQ.data && meQ.data.id[0]}
        </Button>
      </div>
      <div className="flex-1 flex ">
        <nav
          className={`
             pt-2 bg-foreground border-y text-background/80
            border-background/20 flex flex-col gap-2 text-sm`}
        >
          {/* <NavigationLink Icon={IoMdAddCircleOutline} title="New" to="/new" /> */}
          <NavigationLink
            open={open}
            Icon={AiOutlineDatabase}
            title="Data"
            to="/app/data"
          />
          <NavigationLink
            open={open}
            Icon={AiOutlineCloud}
            title="Compute"
            to="/app/compute"
          />
          <div className="flex-1"></div>
          <button
            className="border-t border-background/20  flex gap-2 items-center px-4 py-2"
            onClick={() => setOpen(!open)}
          >
            {open && <AiOutlineArrowLeft />}
            {!open && <AiOutlineArrowRight />}
            {open && <span className="text-center ">Collapse Menu</span>}
          </button>
        </nav>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
