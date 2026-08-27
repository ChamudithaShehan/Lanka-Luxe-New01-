import { useEffect } from "react";
import { useInquiry } from "@/lib/inquiry-context";
import { InquiryForm } from "./InquiryForm";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function InquiryModal() {
  const { isOpen, options, closeInquiry } = useInquiry();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeInquiry();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeInquiry]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInquiry}
            className="fixed inset-0 bg-navy/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative z-10 w-full max-w-2xl my-8 bg-navy-2 border border-gold/40 rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={closeInquiry}
              aria-label="Close inquiry modal"
              className="absolute top-4 right-4 z-20 p-2 text-mist hover:text-white rounded-full bg-navy/60 hover:bg-navy border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <InquiryForm
              initialTour={options.tourName}
              initialInterest={options.interest}
              onSuccess={() => {
                // Keep open to show success or let user dismiss
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
