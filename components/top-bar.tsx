"use client";

import { LogOutIcon, PlaneIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FlightDataService } from "@/lib/services/flight-data-service";
import { useAtom } from "jotai";
import { flightDataAtom, selectedYearAtom } from "@/lib/atoms";
import { ALL_FLIGHTS } from "@/lib/constants";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { User } from "firebase/auth";
import { useUserSession } from "@/lib/user-session";
import { FlightData } from "@/lib/types/flight-data-types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AddFlightDialog } from "./dialogs/add-flight-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  initialUser: User | null | undefined
}

export const TopBar: React.FC<Props> = ({ initialUser }) => {
  const user = useUserSession(initialUser)
  const [selectedYear, setSelectedYear] = useAtom<string>(selectedYearAtom)
  const [flightData] = useAtom<FlightData>(flightDataAtom)
  const years = FlightDataService.getYears(flightData)

  const handleSignOut = (event: any) => {
    event.preventDefault()
    signOut()
  }

  const handleSignIn = (event: any) => {
    event.preventDefault()
    signInWithGoogle()
  }

  const shortName = (name: string | null) => {
    if (!name) {
      return "U"
    }
    const split = name.split(" ")
    let result = ""

    for (let s of split) {
      if (s) {
        result += s[0].toUpperCase()
      }
    }

    return result
  }

  return (
    <menu className="p-4 border-b fixed top-0 left-0 right-0 bg-background/30 backdrop-blur-md z-[9998]">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <PlaneIcon />
            <div className="font-bold text-md">
              Flight Stats
            </div>
          </div>
          {user && flightData?.flights && (
            <div>
              <Select value={selectedYear} defaultValue={ALL_FLIGHTS} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value={ALL_FLIGHTS}>All ({years[ALL_FLIGHTS]})</SelectItem>
                  {Object.keys(years).filter((el) => el !== ALL_FLIGHTS).map((option, idx) =>
                    <SelectItem key={"year_option_" + idx} value={option}>{option} ({years[option]})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <AddFlightDialog>
                <Button size="sm">
                  <div className="flex gap-2 items-center">
                    <PlusIcon />
                    <div>Add</div>
                  </div>
                </Button>
              </AddFlightDialog>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback>{shortName(user.displayName)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <div className="flex gap-2 items-center">
                      <LogOutIcon />
                      Log out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleSignIn} size="sm">Login</Button>
          )}
        </div>
      </div>
    </menu>
  );
}
