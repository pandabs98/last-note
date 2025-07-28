import React from 'react'
import { SignedIn, SignedOut, UserButton, ClerkProvider } from "@clerk/nextjs";
import Link from 'next/link';
import { ModeToggle } from './ui/ModeToggle';
import { ProfileDialog } from './ProfileDailog';
// import { CustomUserMenu } from './CustomUserMenu';

const Navbar = () => {
  return (
    <ClerkProvider>
      <div>
        <header className=" body-font">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-center">
            <a className="flex title-font font-medium items-center mb-4 md:mb-0">

              <Link href="/homePage" className="ml-3 text-xl cursor-pointer">
                Last-Note
              </Link>

            </a>
            <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
              {/* <a className="mr-5 hover:underline">First Link</a>
      <a className="mr-5 hover:underline">Second Link</a>
      <a className="mr-5 hover:underline">Third Link</a>
      <a className="mr-5 hover:underline">Fourth Link</a> */}
            </nav>
            <div className="flex gap-4 items-center justify-center mr-5">
              <SignedOut>
                <Link href="/sign-in" className="text-sm sm:text-base">
                  <button className="border px-4 py-2 rounded hover:bg-muted">
                    Log In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="bg-[#6c47ff] text-white rounded-full text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-3 mr-2 cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/homePage" />
                <ProfileDialog />
                {/* <CustomUserMenu /> */}
              </SignedIn>
            </div>
            <div className="absolute top-6 right-7 cursor-pointer">
              <ModeToggle />
            </div>
          </div>
        </header>
      </div>
    </ClerkProvider>
  )
}

export default Navbar