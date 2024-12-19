import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStop, FaTimes } from "react-icons/fa";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
}) => {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.5);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      handleStop(); // Stop reading when modal is closed
      document.body.style.overflow = "";
    }

    return () => {
      handleStop(); // Cleanup: Ensure reading stops when the component unmounts
      document.body.style.overflow = ""; // Reset overflow
    };
  }, [isOpen]);

  useEffect(() => {
    if (currentCharIndex > 0 && contentRef.current) {
      const currentTextElement = contentRef.current.querySelector<HTMLElement>(
        `[data-charindex='${currentCharIndex}']`
      );

      if (currentTextElement) {
        currentTextElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentCharIndex]);

  const handleReadAloud = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else if (isReading) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (summary) {
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.lang = "en-US";
      utterance.rate = speechRate;

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        setCurrentCharIndex(event.charIndex); // Track character position
      };

      utterance.onend = () => {
        setIsReading(false);
        setIsPaused(false);
        setCurrentCharIndex(0);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentCharIndex(0);
  };

  const updateSpeed = (newRate: number) => {
    if (isReading) {
      const currentText = summary.slice(currentCharIndex); // Get the remaining text
      window.speechSynthesis.cancel(); // Stop the current speech

      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.lang = "en-US";
      utterance.rate = newRate;

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        setCurrentCharIndex(currentCharIndex + event.charIndex); // Update the character index
      };

      utterance.onend = () => {
        setIsReading(false);
        setIsPaused(false);
        setCurrentCharIndex(0);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance); // Restart speech with updated rate
    }
  };

  const increaseSpeed = () => {
    setSpeechRate((prevRate) => {
      const newRate = Math.min(prevRate + 0.25, 2);
      updateSpeed(newRate);
      return newRate;
    });
  };

  const decreaseSpeed = () => {
    setSpeechRate((prevRate) => {
      const newRate = Math.max(prevRate - 0.25, 0.5);
      updateSpeed(newRate);
      return newRate;
    });
  };

  const handleClose = () => {
    handleStop(); // Stop reading when the modal is closed
    onClose();
  };

  if (!isOpen) return null;

  const lines = summary.split("\n");

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-gray-800 text-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md md:max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors"
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <h3 className="text-lg md:text-xl font-semibold text-blue-400 mb-4">
          Insight Summary
        </h3>

        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              className="text-xs text-gray-300 hover:text-white transition-all"
              onClick={decreaseSpeed}
              aria-label="Decrease Speed"
            >
              -
            </button>
            <span className="text-xs text-gray-300">{speechRate.toFixed(2)}x</span>
            <button
              className="text-xs text-gray-300 hover:text-white transition-all"
              onClick={increaseSpeed}
              aria-label="Increase Speed"
            >
              +
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-400 hover:text-white transition-all"
              onClick={handleStop}
              aria-label="Stop"
            >
              <FaStop size={16} />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-all"
              onClick={handleReadAloud}
              aria-label={isReading ? (isPaused ? "Resume" : "Pause") : "Play"}
            >
              {isReading ? (
                isPaused ? (
                  <FaPlay size={16} />
                ) : (
                  <FaPause size={16} />
                )
              ) : (
                <FaPlay size={16} />
              )}
            </button>
          </div>
        </div>

        <div
          ref={contentRef}
          className="text-gray-300 leading-relaxed overflow-y-auto pr-2"
          style={{ maxHeight: "70vh", whiteSpace: "pre-wrap" }}
        >
          {lines.map((line, lineIndex) => {
            const charStart = summary.indexOf(line);
            const charEnd = charStart + line.length;

            const isHighlighted =
              isReading &&
              currentCharIndex >= charStart &&
              currentCharIndex < charEnd;

            return (
              <div
                key={lineIndex}
                data-charindex={charStart}
                style={{
                  color: isHighlighted ? "cyan" : "inherit",
                  backgroundColor: isHighlighted
                    ? "rgba(0, 255, 255, 0.1)"
                    : "transparent",
                  padding: "0.2rem 0",
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
