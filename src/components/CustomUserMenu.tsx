"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { ProfileDialog } from "./ProfileDailog";

export function CustomUserMenu() {
  const { user } = useUser();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.[0] ?? "U"}
              {user?.lastName?.[0] ?? ""}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            Edit FinalNote Profile
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
