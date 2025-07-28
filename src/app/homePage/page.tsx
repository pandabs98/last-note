"use client";

import React, { useEffect, useState } from "react";

const HomePage = () => {
  const message = `Hello, I’m your final memory keeper.
I exist to preserve your last words, your feelings, your truth.
Whenever the time comes, I’ll deliver your message to those who matter most—
So speak freely, because memories deserve to live on.`;

  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<"typing" | "toMailbox" | "waiting" | "toLovedOne">("typing");

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeWriter = () => {
      if (currentIndex < message.length) {
        setDisplayedText((prev) => prev + message[currentIndex]);
        currentIndex++;
        timeoutId = setTimeout(typeWriter, 40);
      } else {
        setTimeout(() => setPhase("toMailbox"), 1000);
      }
    };

    typeWriter();

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (phase === "toMailbox") {
      setTimeout(() => setPhase("waiting"), 3000); // Wait for mailbox animation to end
      setTimeout(() => setPhase("toLovedOne"), 33000); // Deliver to loved one after 30s
    }
  }, [phase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 space-y-8 font-mono">
      {/* Typing Text */}
      <p className="text-xl sm:text-2xl md:text-3xl max-w-3xl whitespace-pre-line text-center leading-relaxed">
        {displayedText}
        {phase === "typing" && <span className="animate-pulse">|</span>}
      </p>

      {/* Animation Area */}
      {phase !== "typing" && (
        <div className="relative w-full max-w-5xl flex justify-between items-end mt-16 px-10 h-40">
          {/* Sender */}
          <div className="flex flex-col items-center">
            <div className="text-4xl">🧑</div>
            <p className="text-sm mt-1">You</p>
          </div>

          {/* Mailbox */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center">
            <div className="text-4xl">📮</div>
            <p className="text-sm mt-1">Mailbox</p>
          </div>

          {/* Receiver */}
          <div className="flex flex-col items-center">
            <div className="text-4xl">👩‍❤️‍👨</div>
            <p className="text-sm mt-1">Loved One</p>
          </div>

          {/* Mail flying from You to Mailbox */}
          {phase === "toMailbox" && (
            <div className="absolute bottom-20 left-16 animate-mail-to-mailbox">
              <div className="text-2xl rotate-[15deg]">✉️</div>
            </div>
          )}

          {/* Mail flying from Mailbox to Loved One */}
          {phase === "toLovedOne" && (
            <div className="absolute bottom-20 left-1/2 animate-mail-to-lovedone">
              <div className="text-2xl rotate-[15deg]">✉️</div>
            </div>
          )}
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        .animate-mail-to-mailbox {
          animation: mailToMailbox 3s ease-in-out forwards;
        }

        .animate-mail-to-lovedone {
          animation: mailToLovedOne 3s ease-in-out forwards;
        }

        @keyframes mailToMailbox {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(300px);
            opacity: 1;
          }
        }

        @keyframes mailToLovedOne {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(300px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
