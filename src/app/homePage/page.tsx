"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const HERO_MESSAGE = `Hello, I’m your final memory keeper.
I exist to preserve your last words, your feelings, your truth.
Whenever the time comes, I’ll deliver your message to those who matter most —
So speak freely, because memories deserve to live on.`;

const HomePage: React.FC = () => {
  const { user } = useUser();
  const username = user?.firstName || "User";

  const [displayedText, setDisplayedText] = useState("");
  const [typeDone, setTypeDone] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [openEnvelope, setOpenEnvelope] = useState(false);
  // const [showMsgCard, setShowMsgCard] = useState(false);
  const [journeyPhase, setJourneyPhase] = useState<"idle" | "toMailbox" | "toLovedOne">("idle");

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeWriter = () => {
      if (currentIndex < HERO_MESSAGE.length) {
        setDisplayedText((prev) => prev + HERO_MESSAGE[currentIndex]);
        currentIndex++;
        timeoutId = setTimeout(typeWriter, 30);
      } else {
        setTypeDone(true);
      }
    };

    typeWriter();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (typeDone) {
      setTimeout(() => setShowEnvelope(true), 200);
      setTimeout(() => setOpenEnvelope(true), 1200);
      setTimeout(() => setShowMsgCard(true), 1800);
      setTimeout(() => setJourneyPhase("toMailbox"), 3500);
    }
  }, [typeDone]);

  useEffect(() => {
    if (journeyPhase === "toMailbox") {
      setTimeout(() => setJourneyPhase("toLovedOne"), 3800);
    }
  }, [journeyPhase]);

  return (
    <div className="relative bg-gradient-to-br from-blue-950 via-black to-indigo-900 min-h-screen flex flex-col items-center py-12 px-2 overflow-x-hidden">
      <section className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl h-[440px] rounded-3xl glassy border border-white/10 shadow-xl p-6 gap-10 md:gap-0 mb-16"
        style={{ background: "rgba(20,24,38,0.9)" }}>
        
        {/* LEFT: Hero Message */}
        <div className="flex-1 flex flex-col justify-center items-start h-full">
          <p className="text-xl sm:text-2xl md:text-2xl font-mono text-white/90 leading-relaxed whitespace-pre-line mb-6 min-h-[200px]">
            {displayedText}
            {!typeDone && <span className="animate-pulse text-indigo-300">|</span>}
          </p>
          {typeDone && (
            <button className="rounded-xl px-6 py-2 bg-indigo-600 text-white mt-4 shadow hover:bg-indigo-700 transition font-semibold tracking-wide">
              <Link href={"/sign-up"}>Start your memory</Link>
            </button>
          )}
        </div>

        {/* RIGHT: Envelope Flip */}
        <div className="flex-1 flex items-center justify-center h-full relative">
          {showEnvelope && (
            <div className={`envelope-box ${openEnvelope ? "flipped" : ""}`}>
              <div className="envelope">
                <div className="envelope-front">
                  <div className="envelope-face">
                    ✉️
                  </div>
                </div>
                <div className="envelope-back">
                  <div className="msg-card bg-gradient-to-br from-indigo-200 to-blue-100 shadow-lg px-4 py-3 rounded-xl text-base text-gray-900 font-medium"
                    style={{ minWidth: "170px", maxWidth: "250px" }}>
                    <span className="block text-indigo-700 font-semibold mb-1">
                      Hello Mr. <span className="text-indigo-500">{username}</span>
                    </span>
                    Welcome, your memories are safe with us.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Journey */}
      <section className="relative w-full max-w-3xl flex flex-col items-center py-4 gap-3">
        <div className="flex items-end justify-between w-full px-4 relative">
          <div className="flex flex-col items-center z-10">
            <div className="bg-indigo-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl">🧑</div>
            <span className="mt-2 text-base font-mono text-indigo-200">You</span>
          </div>
          <div className="flex flex-col items-center z-10 relative">
            <div className="bg-white border-2 border-indigo-300 w-16 h-16 rounded-full flex items-center justify-center shadow-lg text-3xl">📮</div>
            <span className="mt-2 text-base font-mono text-indigo-300">Last-Note Mailbox</span>
          </div>
          <div className="flex flex-col items-center z-10">
            <div className="bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl">👩‍❤️‍👨</div>
            <span className="mt-2 text-base font-mono text-pink-100">Loved One</span>
          </div>

          {/* Journey Animation */}
          {journeyPhase === "toMailbox" && (
            <div className="absolute left-20 bottom-20 animate-mail-to-mailbox">
              <span className="text-4xl">✉️</span>
            </div>
          )}
          {journeyPhase === "toLovedOne" && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-20 animate-mail-to-lovedone">
              <span className="text-4xl">✉️</span>
            </div>
          )}
        </div>
      </section>

      {/* Styles */}
      <style jsx>{`
        .glassy {
          backdrop-filter: blur(18px) saturate(110%);
          background: rgba(18, 22, 32, 0.85);
        }

        .envelope-box {
          perspective: 1000px;
          width: 130px;
          height: 90px;
        }

        .envelope {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.9s ease-in-out;
          transform-style: preserve-3d;
        }

        .envelope-front, .envelope-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(40,60,180,0.15);
        }

        .envelope-front {
          background: #ffffffee;
          border: 3px solid #c7d2fe;
          z-index: 2;
        }

        .envelope-back {
          background: transparent;
          transform: rotateY(180deg);
          z-index: 1;
        }

        .envelope-box.flipped .envelope {
          transform: rotateY(180deg);
        }

        .msg-card {
          animation: fadeInUp 0.9s ease forwards;
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-mail-to-mailbox {
          animation: mailToMailbox 2.4s cubic-bezier(.74,0,.27,1.05) forwards;
        }

        @keyframes mailToMailbox {
          0% { opacity:1; transform:translateX(0); }
          100% { opacity:0; transform: translateX(215px); }
        }

        .animate-mail-to-lovedone {
          animation: mailToLovedOne 2.8s cubic-bezier(.74,0,.27,1.05) forwards;
        }

        @keyframes mailToLovedOne {
          0% {opacity:1; transform:translateX(0);}
          100% {opacity:0; transform: translateX(250px);}
        }
      `}</style>
    </div>
  );
};

export default HomePage;
