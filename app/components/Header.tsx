import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="flex h-16 w-full items-center border-b px-4 md:px-6">
      <Link
        className="inset-y-0 flex items-center gap-2 font-semibold text-lg hover:drop-shadow-xl"
        to="/"
      >
        nicoarch
      </Link>
      <nav className="flex flex-1 justify-end font-medium">
        <Link className="mx-2 hover:drop-shadow-xl" to="/">
          Home
        </Link>
        <Link className="mx-2 hover:drop-shadow-xl" to="/tasks">
          Tasks
        </Link>
        <Link className="mx-2 hover:drop-shadow-xl" to="/videos">
          Videos
        </Link>
      </nav>
    </header>
  );
}
