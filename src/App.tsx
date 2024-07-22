import React, { useState, useEffect } from "react";

import { cn } from "./lib/utils";

interface Step {
  image: string;
  title: string;
  description: string;
  prevText?: string;
  nextText?: string;
}

interface TourProps {
  steps?: Step[];
  text?: {
    next?: string;
    prev?: string;
    restart?: string;
  };
  themeClassName: string;
  blurEl?: string;
  debug?: boolean;
  storage?: string;
  startLarge?: boolean;
  styles?: {
    imageClassName?: string;
    nextButtonClassName?: string;
    previousButtonClassName?: string;
    activeDotClassName?: string;
    dotClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
  };
}

const Tour: React.FC<TourProps> = ({
  steps = [
    {
      image: "/example-1.jpg",
      title: "Step 1",
      description:
        "I am an example step, click in the top right corner to enlarge me. Click next if you no longer want to see me.",
    },
    {
      image: "/example-3.png",
      title: "Step 2",
      description:
        "Congratz, I am the second step in this 2 step tutorial. If you reached me that means you have reached the end.",
    },
  ],
  text = {
    next: "Next",
    prev: "Previous",
    restart: "Restart",
  },
  blurEl = ".can-tour-blur",
  debug = false,
  storage = "react-tour-viewed",
  startLarge = false,
  styles = {
    activeDotClassName: "bg-primary",
    dotClassName: "bg-gray-300",
    imageClassName: "bg-red-100",
  },
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(true);
  const [scaled, setScaled] = useState(false);

  const next = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  const prev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  const close = () => {
    setOpen(false);
    document.querySelector(blurEl)?.classList.remove("tour-blurred");
    localStorage.setItem(storage, "true");
  };

  const scale = () => {
    setScaled(!scaled);
    document.querySelector(blurEl)?.classList.toggle("tour-blurred");
  };

  useEffect(() => {
    const watched = localStorage.getItem(storage);

    if (!debug && watched !== null && JSON.parse(watched)) {
      setOpen(false);
    }

    if (startLarge && !watched) {
      setScaled(true);
      document.querySelector(blurEl)?.classList.add("tour-blurred");
    } else {
      document.querySelector(blurEl)?.classList.remove("tour-blurred");
    }

    const updateVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateVh();
    window.addEventListener("resize", updateVh);

    return () => window.removeEventListener("resize", updateVh);
  }, [blurEl, debug, startLarge, storage]);

  if (!open) return null;

  return (
    <>
      <button className="rounded bg-green-400 p-2" onClick={scale}>
        Toogle
      </button>
      {open && (
        <div
          onClick={scale}
          className="fixed left-0 top-0 z-[1000] flex h-screen w-screen cursor-pointer bg-primary/40"
        ></div>
      )}
      <div className={cn("tour-preview overflow-hidden rounded", scaled && "is-scaled")}>
        {steps.map((step, key) =>
          currentStep === key ? (
            <div className="step" key={key}>
              <svg
                onClick={scale}
                className={`scale ${scaled ? "is-scaled" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
              >
                <g>
                  <g>
                    <g>
                      <g>
                        <path
                          fill="#333"
                          d="M2.36 8.712l-.65-.649a.562.562 0 0 0-.96.398v2.227c0 .31.252.562.563.562h2.226a.563.563 0 0 0 .398-.96l-.65-.65 2.514-2.513a.281.281 0 0 0 0-.398l-.53-.53a.281.281 0 0 0-.398 0zM10.688.75H8.46a.562.562 0 0 0-.398.96l.65.65-2.514 2.513a.281.281 0 0 0 0 .398l.53.53c.11.11.288.11.398 0L9.64 3.288l.65.649c.354.354.96.103.96-.398V1.313a.563.563 0 0 0-.563-.563z"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>

              <svg
                onClick={close}
                className="close"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
              >
                <g>
                  <g>
                    <path
                      fill="#333"
                      d="M6-1.2c.374 0 .678.303.678.678v5.844h5.844a.678.678 0 1 1 0 1.356H6.678v5.844a.678.678 0 1 1-1.356 0V6.678H-.522a.678.678 0 1 1 0-1.356h5.844V-.522c0-.375.304-.678.678-.678z"
                    />
                  </g>
                </g>
              </svg>

              <div className={`teaser ${styles?.imageClassName}`}>
                <img src={step.image} alt={step.title} />
              </div>
              <div className="react-tour-content flex flex-col gap-4 overflow-hidden">
                <div className={cn("flex flex-col", scaled ? "overflow-auto" : "truncate")}>
                  <h3 className={cn("text-2xl font-bold leading-10", styles.titleClassName)}>
                    {step.title}
                  </h3>
                  <div
                    className={cn(
                      "leading-6 text-gray-600",
                      !scaled && "line-clamp-2 overflow-hidden text-ellipsis text-wrap",
                      styles.descriptionClassName,
                    )}
                  >
                    {step.description}
                  </div>
                </div>
                <div className="mt-auto flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <button
                        className={cn(
                          "inline-block select-none rounded px-4 py-2 text-primary-foreground transition-opacity duration-200 hover:opacity-90",
                        )}
                        onClick={prev}
                      >
                        {step.prevText || text.prev}
                      </button>
                    )}
                    <button
                      type="button"
                      className={cn(
                        "inline-block select-none rounded bg-primary px-4 py-2 text-white shadow transition-opacity duration-200 hover:opacity-90",
                        styles.nextButtonClassName,
                        currentStep === 0 && "ms-auto",
                      )}
                      onClick={next}
                    >
                      {currentStep !== steps.length - 1 ? step.nextText || text.next : text.restart}
                    </button>
                  </div>
                  <div className="m flex flex-wrap gap-2">
                    {steps.map((_, dotIndex) => (
                      <div
                        key={dotIndex}
                        className={cn(
                          "h-2 w-2 rounded-full",
                          styles.dotClassName,
                          dotIndex === currentStep && styles.activeDotClassName,
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null,
        )}
      </div>
    </>
  );
};

export default Tour;
