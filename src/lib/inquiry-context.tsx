"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface InquiryOptions {
  tourName?: string;
  interest?: string;
  isLocked?: boolean;
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
    const finalOpts = opts ? { ...opts } : {};
    if (finalOpts.tourName && finalOpts.isLocked === undefined) {
      finalOpts.isLocked = true;
    }
    setOptions(finalOpts);
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
