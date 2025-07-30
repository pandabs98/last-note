"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { About } from "@/components/dialogs/About";
import { Products } from "@/components/dialogs/Products";
import { Contact } from "@/components/dialogs/Contact"; 

export default function Home() {
  const [clicked, setClicked] = useState(false);
  const [contactOpen, setContactOpen] = useState(false); 

  const handleClicked = () => setClicked((prev) => !prev);

  const subItems = [
    {
      label: "Home Page",
      href: "/homePage",
    },
    {
      label: "About",
      component: <About />,
    },
    {
      label: "Use products",
      component: <Products />,
    },
    {
      label: "Contact Us",
      component: (
        <Button
          onClick={() => setContactOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 shadow-xl"
        >
          Contact Us
        </Button>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Dark mode toggle */}
      <div className="absolute top-6 right-6">
        <ModeToggle />
      </div>

      {/* MENU Button */}
      <div className="flex flex-col items-center pt-16 space-y-4 transition-all duration-700">
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: clicked ? 0 : 200 }}
          transition={{ type: "spring", stiffness: 70 }}
          className="z-20"
        >
          <Button onClick={handleClicked} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 shadow-xl">
            {clicked ? "Menu" : "Home"}
          </Button>
        </motion.div>

        {/* Before Click Message */}
        <AnimatePresence>
          {!clicked && (
            <motion.h1
              className="text-lg mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Click the button to see something
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Chart */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            className="flex flex-col items-center mt-16 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Desktop View */}
            <div className="hidden md:flex flex-col items-center w-full">
              <motion.div
                className="relative h-0.5 bg-white w-full max-w-[720px] mb-8"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5 }}
              >
                {subItems.map((_, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 h-4 w-0.5 bg-white"
                    style={{
                      left: `calc(${(idx + 0.5) * (100 / subItems.length)}%)`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                ))}
              </motion.div>

              <div className="flex justify-between gap-6 max-w-[720px] w-full px-4 flex-wrap">
                {subItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    {item.component ? (
                      item.component
                    ) : (
                      <a
                        href={item.href}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 shadow-xl text-white px-4 py-2 rounded-md block text-center"
                      >
                        {item.label}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden flex-col items-start mt-10 relative ml-4">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
              <div className="absolute left-0 -top-8 h-8 w-0.5 bg-white" />
              <div className="flex flex-col gap-6 ml-6">
                {subItems.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-6 h-0.5 bg-white" />
                    {item.component ? (
                      item.component
                    ) : (
                      <a
                        href={item.href}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 shadow-xl text-white px-4 py-2 rounded-md block"
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Dialog (rendered outside) */}
      <Contact open={contactOpen} setOpen={setContactOpen} />
    </div>
  );
}
