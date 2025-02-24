import { Link } from "wouter";
import { Trophy, Home, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
// Added UserPreferences component -  Implementation details are missing from the provided information.
function UserPreferences() {
  return <div>User Preferences Placeholder</div>; // Placeholder for missing implementation.
}

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-2 font-bold text-xl">
              <Trophy className="h-6 w-6" />
              <span>ScoreKeeper</span>
            </a>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/">
              <a className="flex items-center space-x-1 text-sm font-medium">
                <Home className="h-4 w-4" />
                <span>Games</span>
              </a>
            </Link>
            {/* <Link href="/leaderboard">
              <a className="flex items-center space-x-1 text-sm font-medium">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </a>
            </Link>
            <Link href="/profile">
              <a className="flex items-center space-x-1 text-sm font-medium">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </a>
            </Link>
            <UserPreferences /> */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
