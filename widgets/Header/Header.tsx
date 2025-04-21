import Link from "next/link";
import { ThemeToggle } from "../ThemeSwitcher/ThemeSwitcher";
import HeaderAnimation from "./HeaderProvider";

export default function Header() {
  return (
    <HeaderAnimation>
      <header className="flex max-w-full text-2xl border-b transition-transform duration-300 bg-app-bg h-[70px] border-b-gray-color-3">
        <div className="sm:w-[70%] w-[90%] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl font-bold transition-colors duration-200 text-text-color ease hover:text-text-2-color"
          >
            PlanDSTU
          </Link>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </HeaderAnimation>
  );
}
