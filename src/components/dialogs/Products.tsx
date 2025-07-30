// components/dialogs/ProductsDialog.tsx
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Contact } from "./Contact";

export function Products() {
  const [openContact, setOpenContact] = useState(false);

  return (
    <div className="text-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 shadow-xl">
            View Products
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-white dark:bg-zinc-900 text-black dark:text-white max-w-md shadow-2xl rounded-3xl border-2 border-purple-500 rotate-[2deg] scale-95 hover:rotate-0 hover:scale-100 transition-all duration-500">
          <h2 className="text-2xl font-bold mb-2">Our Products</h2>
          <p className="mb-4">
            We're still crafting something extraordinary! 🚀<br />
            Have a great product idea? We'd love to hear it.
          </p>

          <Button
            className="bg-purple-700 text-white hover:bg-purple-800 transition"
            onClick={() => setOpenContact(true)}
          >
            Suggest a Product
          </Button>
        </DialogContent>
      </Dialog>

      <Contact open={openContact} setOpen={setOpenContact} />
    </div>
  );
}
