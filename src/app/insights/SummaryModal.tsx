import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlay, FaPause, FaStop, FaTimes, FaMinus, FaPlus } from "react-icons/fa";

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

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentCharIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    handleStop();
    onClose();
  }, [onClose, handleStop]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener('keydown', handleKeyDown);
    } else {
      handleStop();
      document.body.style.overflow = "";
    }

    return () => {
      handleStop();
      document.body.style.overflow = "";
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, handleStop]);

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

  const handleReadAloud = useCallback(() => {
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
        setCurrentCharIndex(event.charIndex);
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
  }, [isPaused, isReading, summary, speechRate]);

  const updateSpeed = useCallback((newRate: number) => {
    if (isReading) {
      const currentText = summary.slice(currentCharIndex);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.lang = "en-US";
      utterance.rate = newRate;

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        setCurrentCharIndex(currentCharIndex + event.charIndex);
      };

      utterance.onend = () => {
        setIsReading(false);
        setIsPaused(false);
        setCurrentCharIndex(0);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [isReading, summary, currentCharIndex]);

  const increaseSpeed = useCallback(() => {
    setSpeechRate((prevRate) => {
      const newRate = Math.min(prevRate + 0.25, 2);
      updateSpeed(newRate);
      return newRate;
    });
  }, [updateSpeed]);

  const decreaseSpeed = useCallback(() => {
    setSpeechRate((prevRate) => {
      const newRate = Math.max(prevRate - 0.25, 0.5);
      updateSpeed(newRate);
      return newRate;
    });
  }, [updateSpeed]);

  if (!isOpen) return null;

  const readTextEndIndex =
    currentCharIndex > summary.length ? summary.length : currentCharIndex;

  const lines = summary.split('\n');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md md:max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors"
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
          Insight Summary
        </h3>

        <div className="flex flex-wrap items-center justify-between mb-4 bg-slate-800 p-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-300 hover:text-white transition-all"
              onClick={decreaseSpeed}
              aria-label="Decrease Speed"
            >
              <FaMinus size={14} />
            </button>
            <span className="text-xs text-gray-300">{speechRate.toFixed(2)}x</span>
            <button
              className="text-gray-300 hover:text-white transition-all"
              onClick={increaseSpeed}
              aria-label="Increase Speed"
            >
              <FaPlus size={14} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-300 hover:text-white transition-all"
              onClick={handleStop}
              aria-label="Stop"
            >
              <FaStop size={16} />
            </button>
            <button
              className="text-gray-300 hover:text-white transition-all"
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
          className="text-gray-200 leading-relaxed overflow-y-auto pr-2"
          style={{ maxHeight: "70vh" }}
        >
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              {line.split('').map((char, charIndex) => {
                const globalCharIndex = summary.indexOf(line) + charIndex;
                return (
                  <span
                    key={globalCharIndex}
                    className={globalCharIndex < readTextEndIndex ? "text-gray-500" : ""}
                  >
                    {char}
                  </span>
                );
              })}
              {index < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
