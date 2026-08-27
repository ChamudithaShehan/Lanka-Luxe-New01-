import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface InquiryOptions {
  tourName?: string;
  interest?: string;
}

interface InquiryContextType {
  isOpen: boolean;
  options: InquiryOptions;
  openInquiry: (opts?: InquiryOptions) => void;
  closeInquiry: () => void;
}

const InquiryContext = createContext<InquiryContextType | null>(null);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<InquiryOptions>({});

  const openInquiry = useCallback((opts?: InquiryOptions) => {
    setOptions(opts || {});
    setIsOpen(true);
  }, []);

  const closeInquiry = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <InquiryContext.Provider value={{ isOpen, options, openInquiry, closeInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) {
    throw new Error("useInquiry must be used within an InquiryProvider");
  }
  return ctx;
}
