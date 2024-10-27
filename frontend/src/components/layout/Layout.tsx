import { BsBricks } from "react-icons/bs";
import { Outlet } from "react-router-dom";
import { Button } from "../ui/button";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-6 bg-foreground/80 text-background flex justify-between items-center ">
        <h1 className="flex items-center gap-3 text-lg p-2 ">
          <BsBricks />
          MyBricks
        </h1>
        <Button className="bg-background/20 " size={"icon"}>
          Y
        </Button>
      </div>
      <div className="flex-1 flex min-h-screen">
        <nav className="bg-foreground/80 h-full"></nav>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
