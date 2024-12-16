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

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore scrolling when modal is closed
      document.body.style.overflow = "";
    }

    return () => {
      // Clean up overflow style
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          setCurrentCharIndex(event.charIndex);
        }
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

  const increaseSpeed = () => {
    setSpeechRate((prevRate) => Math.min(prevRate + 0.25, 2));
  };

  const decreaseSpeed = () => {
    setSpeechRate((prevRate) => Math.max(prevRate - 0.5, 0.5));
  };

  const renderSummaryWithHighlight = () => {
    if (!summary) return null;

    const readText = summary.substring(0, currentCharIndex);
    const unreadText = summary.substring(currentCharIndex);

    return (
      <span>
        <span className="text-gray-500">{readText}</span>
        <span className="text-gray-100">{unreadText}</span>
      </span>
    );
  };

  // Stop speech synthesis when modal is closed
  const handleClose = () => {
    handleStop();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={handleClose}
    >
      <div
        className="relative bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors"
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        {/* Modal Header */}
        <h3 className="text-xl font-semibold text-blue-400 mb-4">
          Insight Summary
        </h3>

        {/* Controls Section */}
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
              <FaStop size={14} />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-all"
              onClick={handleReadAloud}
              aria-label={isReading ? (isPaused ? "Resume" : "Pause") : "Play"}
            >
              {isReading ? (
                isPaused ? (
                  <FaPlay size={14} />
                ) : (
                  <FaPause size={14} />
                )
              ) : (
                <FaPlay size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div
          className="text-gray-300 leading-relaxed mb-6 overflow-y-auto pr-2"
          style={{ maxHeight: "70vh" }}
        >
          {renderSummaryWithHighlight()}
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
