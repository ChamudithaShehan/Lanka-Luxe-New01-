"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Tour,
  GolfCourse,
  Destination,
  Experience,
  Post,
  Testimonial,
  TeamMember,
  Feature,
  GalleryItem,
} from "@/data/site";

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  dates?: string;
  travelers?: string;
  interest?: string;
  tour?: string;
  budget?: string;
  message?: string;
  status: "new" | "in_progress" | "contacted" | "booked" | "archived";
  notes?: string;
  reference?: string;
}

export interface SiteSettings {
  brandName: string;
  founderName: string;
  founderTitle: string;
  founderBio: { en: string; ko: string };
  founderQualifications: string[];
  licenseNumber: string;
  experienceYears: string;
  heroHeadline1: { en: string; ko: string };
  heroHeadline2: { en: string; ko: string };
  heroSubtitle: { en: string; ko: string };
}

interface ContentContextType {
  tours: Tour[];
  golfCourses: GolfCourse[];
  destinations: Destination[];
  experiences: Experience[];
  posts: Post[];
  testimonials: Testimonial[];
  team: TeamMember[];
  whyUs: Feature[];
  contact: any | null;
  siteSettings: SiteSettings | null;
  inquiries: Inquiry[];
  gallery: GalleryItem[];
  isLoaded: boolean;
  isLoading: boolean;
  dbError: boolean;
  errorMessage: string | null;
  refreshContent: () => Promise<void>;
  saveTour: (tour: Tour) => Promise<{ success: boolean; error?: string }>;
  deleteTour: (slug: string) => Promise<{ success: boolean; error?: string }>;
  saveGolfCourse: (index: number, course: GolfCourse) => Promise<{ success: boolean; error?: string }>;
  addGolfCourse: (course: GolfCourse) => Promise<{ success: boolean; error?: string }>;
  deleteGolfCourse: (index: number) => Promise<{ success: boolean; error?: string }>;
  saveDestination: (dest: Destination) => Promise<{ success: boolean; error?: string }>;
  deleteDestination: (slug: string) => Promise<{ success: boolean; error?: string }>;
  saveExperience: (index: number, exp: Experience) => Promise<{ success: boolean; error?: string }>;
  addExperience: (exp: Experience) => Promise<{ success: boolean; error?: string }>;
  deleteExperience: (index: number) => Promise<{ success: boolean; error?: string }>;
  savePost: (post: Post) => Promise<{ success: boolean; error?: string }>;
  deletePost: (slug: string) => Promise<{ success: boolean; error?: string }>;
  saveContact: (contactInfo: any) => Promise<{ success: boolean; error?: string }>;
  saveSiteSettings: (settings: SiteSettings) => Promise<{ success: boolean; error?: string }>;
  saveGalleryItem: (item: GalleryItem) => Promise<{ success: boolean; error?: string }>;
  addGalleryItem: (item: GalleryItem) => Promise<{ success: boolean; error?: string }>;
  deleteGalleryItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  reorderGallery: (items: GalleryItem[]) => Promise<{ success: boolean; error?: string }>;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => Promise<string>;
  updateInquiryStatus: (id: string, status: Inquiry["status"], notes?: string) => Promise<{ success: boolean; error?: string }>;
  deleteInquiry: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  // Pure database-driven states - NO static fallback arrays or demo data
  const [tours, setTours] = useState<Tour[]>([]);
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [whyUs, setWhyUs] = useState<Feature[]>([]);
  const [contact, setContact] = useState<any | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load live content exclusively from MySQL through API
  const refreshContent = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch public CMS content from database API
      const res = await fetch("/api/content", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        setDbError(true);
        setErrorMessage("Content is temporarily unavailable. Please try again later.");
        // DO NOT inject fallback data
        setTours([]);
        setGolfCourses([]);
        setDestinations([]);
        setExperiences([]);
        setPosts([]);
        setGallery([]);
        setWhyUs([]);
        setTestimonials([]);
        setTeam([]);
        return;
      }

      const data = await res.json();

      if (data.dbConnected === false) {
        setDbError(true);
        setErrorMessage(data.error || "Content is temporarily unavailable. Please try again later.");
        setTours([]);
        setGolfCourses([]);
        setDestinations([]);
        setExperiences([]);
        setPosts([]);
        setGallery([]);
        setWhyUs([]);
        setTestimonials([]);
        setTeam([]);
        return;
      }

      // MySQL query successful
      setDbError(false);
      setErrorMessage(null);
      setTours(data.tours || []);
      setGolfCourses(data.golfCourses || []);
      setDestinations(data.destinations || []);
      setExperiences(data.experiences || []);
      setPosts(data.posts || []);
      setGallery(data.gallery || []);
      setWhyUs(data.whyUs || []);
      setTestimonials(data.testimonials || []);
      setTeam(data.team || []);
      setSiteSettings(data.siteSettings || null);
      setContact(data.contact || null);

      // 2. Fetch admin inquiries if authenticated
      try {
        const inqRes = await fetch("/api/admin/inquiries", { cache: "no-store" });
        if (inqRes.ok) {
          const inqData = await inqRes.json();
          if (Array.isArray(inqData.inquiries)) {
            setInquiries(inqData.inquiries);
          }
        }
      } catch {
        // Not authenticated as admin or inquiries table empty
      }
    } catch (e: any) {
      console.error("Database connection failure in refreshContent:", e?.message || e);
      setDbError(true);
      setErrorMessage("Content is temporarily unavailable. Please try again later.");
      // Strictly no static fallback substitution
      setTours([]);
      setGolfCourses([]);
      setDestinations([]);
      setExperiences([]);
      setPosts([]);
      setGallery([]);
      setWhyUs([]);
      setTestimonials([]);
      setTeam([]);
    } finally {
      setIsLoaded(true);
      setIsLoading(false);
    }
  }, []);

  // Hydrate on mount & purge any legacy localStorage content keys
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("llj_admin_live_content_v1");
        localStorage.removeItem("llj_admin_token");
        localStorage.removeItem("llj_admin_auth");
      }
    } catch {
      // ignore
    }
    refreshContent();
  }, [refreshContent]);

  // ==========================================
  // AUTHORITATIVE DATABASE MUTATIONS (NO FAKE SUCCESS)
  // ==========================================

  // Tour mutations
  const saveTour = useCallback(
    async (tour: Tour): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/tours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tour),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to save tour to database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        console.error("Failed to save tour:", err);
        return { success: false, error: "Database connection failed. Tour could not be saved." };
      }
    },
    [refreshContent]
  );

  const deleteTour = useCallback(
    async (slug: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`/api/admin/tours?slug=${encodeURIComponent(slug)}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to delete tour from database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        console.error("Failed to delete tour:", err);
        return { success: false, error: "Database connection failed. Tour could not be deleted." };
      }
    },
    [refreshContent]
  );

  // Golf Course mutations
  const saveGolfCourse = useCallback(
    async (index: number, course: GolfCourse): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/golf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(course),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to save golf course to database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not save golf course." };
      }
    },
    [refreshContent]
  );

  const addGolfCourse = useCallback(
    async (course: GolfCourse): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/golf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(course),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to add golf course to database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not add golf course." };
      }
    },
    [refreshContent]
  );

  const deleteGolfCourse = useCallback(
    async (index: number): Promise<{ success: boolean; error?: string }> => {
      const target = golfCourses[index];
      if (!target) return { success: false, error: "Golf course not found." };
      try {
        const res = await fetch(`/api/admin/golf?name=${encodeURIComponent(target.name)}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to delete golf course from database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not delete golf course." };
      }
    },
    [golfCourses, refreshContent]
  );

  // Destination mutations
  const saveDestination = useCallback(
    async (dest: Destination): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/destinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dest),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to save destination to database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not save destination." };
      }
    },
    [refreshContent]
  );

  const deleteDestination = useCallback(
    async (slug: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`/api/admin/destinations?slug=${encodeURIComponent(slug)}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to delete destination from database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not delete destination." };
      }
    },
    [refreshContent]
  );

  // Experience mutations
  const saveExperience = useCallback(
    async (index: number, exp: Experience): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(exp),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to save experience to database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not save experience." };
      }
    },
    [refreshContent]
  );

  const addExperience = useCallback(
    async (exp: Experience): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(exp),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to add experience to database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not add experience." };
      }
    },
    [refreshContent]
  );

  const deleteExperience = useCallback(
    async (index: number): Promise<{ success: boolean; error?: string }> => {
      const target = experiences[index];
      if (!target) return { success: false, error: "Experience not found." };
      try {
        const res = await fetch(
          `/api/admin/experiences?title=${encodeURIComponent(target.title?.en || "")}`,
          { method: "DELETE" }
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to delete experience from database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not delete experience." };
      }
    },
    [experiences, refreshContent]
  );

  // Blog mutations
  const savePost = useCallback(
    async (post: Post): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to save blog post to database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not save blog post." };
      }
    },
    [refreshContent]
  );

  const deletePost = useCallback(
    async (slug: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to delete blog post from database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not delete blog post." };
      }
    },
    [refreshContent]
  );

  // Contact & Settings mutations
  const saveContact = useCallback(
    async (contactInfo: any): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact: contactInfo }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to save contact settings." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not save contact." };
      }
    },
    [refreshContent]
  );

  const saveSiteSettings = useCallback(
    async (settings: SiteSettings): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteSettings: settings }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to save site settings." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not save settings." };
      }
    },
    [refreshContent]
  );

  // Gallery mutations
  const saveGalleryItem = useCallback(
    async (item: GalleryItem): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to save gallery item to database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not save gallery photo." };
      }
    },
    [refreshContent]
  );

  const addGalleryItem = useCallback(
    async (item: GalleryItem): Promise<{ success: boolean; error?: string }> => {
      return saveGalleryItem(item);
    },
    [saveGalleryItem]
  );

  const deleteGalleryItem = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`/api/gallery/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to delete gallery item from database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not delete gallery photo." };
      }
    },
    [refreshContent]
  );

  const reorderGallery = useCallback(
    async (items: GalleryItem[]): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(items),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to reorder gallery in database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not reorder gallery." };
      }
    },
    [refreshContent]
  );

  // Inquiries mutations
  const addInquiry = useCallback(
    async (inq: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<string> => {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inq),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry to database.");
      }

      await refreshContent();
      return data.reference || `inq-${Date.now()}`;
    },
    [refreshContent]
  );

  const updateInquiryStatus = useCallback(
    async (id: string, status: Inquiry["status"], notes?: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`/api/admin/inquiries/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, notes }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to update inquiry in database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not update inquiry." };
      }
    },
    [refreshContent]
  );

  const deleteInquiry = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`/api/admin/inquiries/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to delete inquiry from database." };
        }
        await refreshContent();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Database connection failed. Could not delete inquiry." };
      }
    },
    [refreshContent]
  );

  const value = {
    tours,
    golfCourses,
    destinations,
    experiences,
    posts,
    testimonials,
    team,
    whyUs,
    contact,
    siteSettings,
    inquiries,
    gallery,
    isLoaded,
    isLoading,
    dbError,
    errorMessage,

    saveTour,
    deleteTour,
    saveGolfCourse,
    addGolfCourse,
    deleteGolfCourse,
    saveDestination,
    deleteDestination,
    saveExperience,
    addExperience,
    deleteExperience,
    savePost,
    deletePost,
    saveContact,
    saveSiteSettings,
    saveGalleryItem,
    addGalleryItem,
    deleteGalleryItem,
    reorderGallery,
    addInquiry,
    updateInquiryStatus,
    deleteInquiry,
    refreshContent,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContentStore() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContentStore must be used within a ContentProvider");
  }
  return context;
}
