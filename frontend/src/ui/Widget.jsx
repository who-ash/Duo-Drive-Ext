import Voice from "../components/Voice";
import Button from "../components/Button";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../utils/constant";
import Card from "../components/Card";
import Loader from "../components/Loader";
import TalkToPeer from "../ui/TalkToPeer";
import { LuSparkles } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";

const Widget = () => {
  const [input, setInput] = useState("");
  const [loader, setLoader] = useState(false);
  const [history, setHistory] = useState([]);
  const [showTalkToPeer, setShowTalkToPeer] = useState(false);

  const endOfMessagesRef = useRef(null);

  const handleChat = async () => {
    const data = {
      prompt: input,
    };
    setLoader(true);
    try {
      const response = await axios.post(`${URL}/chat`, data);
      setHistory([...history, ...response.data.history]);
      setInput("");
      setLoader(false);
    } catch (error) {
      console.error("Failed to get the error", error);
    } finally {
      setLoader(false);
    }
  };

  const ToggleTalkToPeer = () => {
    setShowTalkToPeer(!showTalkToPeer);
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [history]);

  return (
    <div className="h-screen w-screen bg-black relative flex flex-col ">
      {showTalkToPeer ? (
        <TalkToPeer onClick={ToggleTalkToPeer} />
      ) : (
        <>
          {/* Response Display */}
          <div className="flex-grow p-2 overflow-y-scroll no-scrollbar">
            <div className="max-w-4xl mx-auto">
              {history.map((entry, index) =>
                entry.parts.map((part, partIndex) => (
                  <div
                    key={`${index}-${partIndex}`}
                    className={`flex items-start gap-3 mb-3 ${entry.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {entry.role !== "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mt-1">
                        <LuSparkles className="text-white text-sm" />
                      </div>
                    )}

                    <Card content={part.text} />

                    {entry.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mt-1">
                        <FaUserAlt className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={endOfMessagesRef} />
            </div>
          </div>

          <div className="px-4 pb-6 pt-2">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center bg-gray-800 rounded-3xl border border-gray-700 shadow-lg min-h-[60px]">
                {/* Voice Button */}
                <button
                  onClick={ToggleTalkToPeer}
                  className="absolute left-3 p-2 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Voice onClick={ToggleTalkToPeer} />
                </button>

                {/* Textarea */}
                <textarea
                  className="flex-1 bg-transparent text-white text-base outline-none resize-none pl-14 pr-14 py-4 max-h-[200px] overflow-y-auto no-scrollbar ml-4"
                  placeholder="I am feeling stressed today, can you help me?"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChat();
                    }
                  }}
                />

                {/* Send Button */}
                <div className="absolute right-3 flex items-center justify-center">
                  {loader ? (
                    <Loader />
                  ) : (
                    <button
                      onClick={handleChat}
                      disabled={!input.trim()}
                      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${input.trim()
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Widget;
