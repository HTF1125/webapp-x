"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlay, FaPause, FaStop, FaMinus, FaPlus } from "react-icons/fa";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow,
} from "@nextui-org/react";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary }) => {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.5);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentCharIndex(0);
  }, []);

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

  const updateSpeed = useCallback(
    (newRate: number) => {
      if (isReading) {
        const remainingText = summary.slice(currentCharIndex) || "";
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(remainingText);
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
    },
    [isReading, summary, currentCharIndex]
  );

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

  const lines = summary.split("\n");
  const readTextEndIndex =
    currentCharIndex > summary.length ? summary.length : currentCharIndex;

  useEffect(() => {
    if (!isOpen) {
      handleStop();
    }
  }, [isOpen, handleStop]);

  useEffect(() => {
    if (currentCharIndex > 0 && contentRef.current) {
      const currentTextElement = contentRef.current.querySelector<HTMLElement>(
        `[data-charindex='${currentCharIndex}']`
      );
      if (currentTextElement) {
        currentTextElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentCharIndex]);

  return (
    <Modal
      isOpen={isOpen}
      size="5xl"
      onOpenChange={(open) => {
        if (!open) {
          handleStop();
          onClose();
        }
      }}
      className="bg-white dark:bg-gray-900 max-h-[95vh] overflow-hidden"
      style={{ transition: "none" }}
    >
      <ModalContent>
        {(onCloseInternal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl text-gray-900 dark:text-white">
              Summary
            </ModalHeader>
            <ModalBody className="max-h-[80vh] overflow-hidden">
              <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
                      onClick={decreaseSpeed}
                      aria-label="Decrease Speed"
                    >
                      <FaMinus size={18} />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{speechRate.toFixed(2)}x</span>
                    <button
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
                      onClick={increaseSpeed}
                      aria-label="Increase Speed"
                    >
                      <FaPlus size={18} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
                      onClick={handleStop}
                      aria-label="Stop"
                    >
                      <FaStop size={24} />
                    </button>
                    <button
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
                      onClick={handleReadAloud}
                      aria-label={isReading ? (isPaused ? "Resume" : "Pause") : "Play"}
                    >
                      {isReading ? (
                        isPaused ? (
                          <FaPlay size={24} />
                        ) : (
                          <FaPause size={24} />
                        )
                      ) : (
                        <FaPlay size={24} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <ScrollShadow className="max-h-[65vh] overflow-y-auto px-4">
                <div ref={contentRef} className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
                  {lines.map((line, index) => (
                    <React.Fragment key={index}>
                      {line.split("").map((char, charIndex) => {
                        const globalCharIndex = summary.indexOf(line) + charIndex;
                        return (
                          <span
                            key={globalCharIndex}
                            data-charindex={globalCharIndex}
                            className={
                              globalCharIndex < readTextEndIndex ? "text-gray-400 dark:text-gray-500" : ""
                            }
                          >
                            {char}
                          </span>
                        );
                      })}
                      {index < lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseInternal} size="lg">
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SummaryModal;
