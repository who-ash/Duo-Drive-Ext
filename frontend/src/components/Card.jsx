import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const Card = ({ content }) => {
  const [height, setHeight] = useState("auto");
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      setHeight(`${cardRef.current.scrollHeight}px`);
    }
  }, [content]);

  return (
    <>
      <div
        className="bg-gray-400 max-w-2xl text-sm rounded-md overflow-hidden px-5 py-5 break-words text-black"
        ref={cardRef}
        style={{ height }}
      >
        <ReactMarkdown
          components={{
            strong: ({ node, ...props }) => (
              <strong className="font-extrabold" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-2 last:mb-0" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc ml-4 mb-2" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal ml-4 mb-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="mb-1" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default Card;
