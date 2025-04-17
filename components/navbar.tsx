"use client";

import { Button } from "@heroui/button";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Skeleton } from "@heroui/skeleton";
import { signOut, useSession } from "next-auth/react";

import { ExitIcon } from "@/components/icons";

export const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <HeroUINavbar className="pt-4" maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:flex sm:basis-full" justify="end">
        {status === "loading" ? (
          <NavbarItem className="lg:flex">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
          </NavbarItem>
        ) : (
          <NavbarItem className="text-xl font-semibold lg:flex">
            {session?.user?.email}
          </NavbarItem>
        )}
        <NavbarItem className="md:flex">
          <Button
            isIconOnly
            aria-label="Like"
            variant="light"
            onPress={() => {
              sessionStorage.clear();
              signOut({ callbackUrl: "/login" });
            }}
          >
            <ExitIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
