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
import {
  tours as defaultTours,
  golfCourses as defaultGolfCourses,
  destinations as defaultDestinations,
  experiences as defaultExperiences,
  posts as defaultPosts,
  testimonials as defaultTestimonials,
  team as defaultTeam,
  whyUs as defaultWhyUs,
  contact as defaultContact,
  defaultGalleryItems,
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

const defaultSiteSettings: SiteSettings = {
  brandName: "Lanka Luxe Journeys",
  founderName: "Iroshan Jayawickrame",
  founderTitle: "Founder & Licensed Tourist Guide",
  founderBio: {
    en: "Founder of Lanka Luxe Journeys with 10+ years of experience in the Sri Lankan tourism industry. Diploma in Archaeology from the University of Kelaniya and licensed by the Sri Lanka Tourism Development Authority (SLTDA Licence: C-1734). Specializing in luxury private travel, cultural heritage, wildlife, golf and wellness.",
    ko: "10년 이상의 관광 업계 경력을 가진 Lanka Luxe Journeys 설립자. 켈라니야 대학교 고고학 디플로마 취득 및 스리랑카 관광청(SLTDA) 공인 가이드 라이선스(C-1734) 보유. 럭셔리 맞춤 여행, 문화유산 탐방, 사파리, 골프 및 웰니스 여행을 전문으로 합니다.",
  },
  founderQualifications: [
    "SLTDA National Tourist Guide Licence No: C-1734",
    "Diploma in Archaeology — University of Kelaniya",
    "10+ Years Professional Guiding & Itinerary Design",
    "Specialist in Luxury Golf, Wildlife & Cultural Expeditions",
    "Bilingual Concierge & Direct Communication (English & Korean)",
  ],
  licenseNumber: "C-1734",
  experienceYears: "10+",
  heroHeadline1: {
    en: "DISCOVER SRI LANKA",
    ko: "스리랑카를",
  },
  heroHeadline2: {
    en: "with a local expert.",
    ko: "현지 전문가와 함께.",
  },
  heroSubtitle: {
    en: "Private journeys, authentic experiences and luxury travel, personally crafted around you.",
    ko: "나만을 위해 섬세하게 설계된 프라이빗 럭셔리 여정, 진정한 스리랑카를 현지 전문가와 함께 경험하세요.",
  },
};

interface ContentContextType {
  tours: Tour[];
  golfCourses: GolfCourse[];
  destinations: Destination[];
  experiences: Experience[];
  posts: Post[];
  testimonials: Testimonial[];
  team: TeamMember[];
  whyUs: Feature[];
  contact: any;
  siteSettings: SiteSettings;
  inquiries: Inquiry[];
  gallery: GalleryItem[];
  isLoaded: boolean;
  refreshContent: () => Promise<void>;
  saveTour: (tour: Tour) => void;
  deleteTour: (slug: string) => void;
  saveGolfCourse: (index: number, course: GolfCourse) => void;
  addGolfCourse: (course: GolfCourse) => void;
  deleteGolfCourse: (index: number) => void;
  saveDestination: (dest: Destination) => void;
  deleteDestination: (slug: string) => void;
  saveExperience: (index: number, exp: Experience) => void;
  addExperience: (exp: Experience) => void;
  deleteExperience: (index: number) => void;
  savePost: (post: Post) => void;
  deletePost: (slug: string) => void;
  saveContact: (contactInfo: any) => void;
  saveSiteSettings: (settings: SiteSettings) => void;
  saveGalleryItem: (item: GalleryItem) => void;
  addGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  reorderGallery: (items: GalleryItem[]) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => Promise<string>;
  updateInquiryStatus: (id: string, status: Inquiry["status"], notes?: string) => void;
  deleteInquiry: (id: string) => void;
  resetToDefaults: () => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [tours, setTours] = useState<Tour[]>(defaultTours);
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>(defaultGolfCourses);
  const [destinations, setDestinations] = useState<Destination[]>(defaultDestinations);
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [whyUs, setWhyUs] = useState<Feature[]>(defaultWhyUs);
  const [contact, setContact] = useState<any>(defaultContact);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGalleryItems);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load live content from database
  const refreshContent = useCallback(async () => {
    try {
      // 1. Fetch public CMS content
      const res = await fetch("/api/content", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.tours?.length) setTours(data.tours);
        if (data.golfCourses?.length) setGolfCourses(data.golfCourses);
        if (data.destinations?.length) setDestinations(data.destinations);
        if (data.experiences?.length) setExperiences(data.experiences);
        if (data.posts?.length) setPosts(data.posts);
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        if (data.contact) setContact(data.contact);
        if (data.gallery?.length) setGallery(data.gallery);
      }

      // 2. Fetch admin inquiries if authenticated
      const inqRes = await fetch("/api/admin/inquiries", { cache: "no-store" });
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        if (Array.isArray(inqData.inquiries)) {
          setInquiries(inqData.inquiries);
        }
      }
    } catch (e) {
      console.warn("Could not refresh live content from API, falling back to static cache.", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Hydrate on mount & purge legacy localStorage content key
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Clean legacy localStorage key if present
        localStorage.removeItem("llj_admin_live_content_v1");
        localStorage.removeItem("llj_admin_token");
        localStorage.removeItem("llj_admin_auth");
      }
    } catch {
      // ignore
    }
    refreshContent();
  }, [refreshContent]);

  // Tour mutations
  const saveTour = useCallback((tour: Tour) => {
    setTours((prev) => {
      const idx = prev.findIndex((t) => t.slug === tour.slug);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = tour;
        return updated;
      }
      return [tour, ...prev];
    });

    fetch("/api/admin/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tour),
    }).catch((err) => console.error("Failed to persist tour to database:", err));
  }, []);

  const deleteTour = useCallback((slug: string) => {
    setTours((prev) => prev.filter((t) => t.slug !== slug));
    fetch(`/api/admin/tours?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Failed to delete tour from database:", err));
  }, []);

  // Golf Course mutations
  const saveGolfCourse = useCallback((index: number, course: GolfCourse) => {
    setGolfCourses((prev) => {
      const updated = [...prev];
      updated[index] = course;
      return updated;
    });

    fetch("/api/admin/golf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    }).catch((err) => console.error("Failed to persist golf course to database:", err));
  }, []);

  const addGolfCourse = useCallback((course: GolfCourse) => {
    setGolfCourses((prev) => [...prev, course]);
    fetch("/api/admin/golf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    }).catch((err) => console.error("Failed to add golf course to database:", err));
  }, []);

  const deleteGolfCourse = useCallback((index: number) => {
    setGolfCourses((prev) => {
      const target = prev[index];
      if (target) {
        fetch(`/api/admin/golf?name=${encodeURIComponent(target.name)}`, {
          method: "DELETE",
        }).catch((err) => console.error("Failed to delete golf course:", err));
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Destination mutations
  const saveDestination = useCallback((dest: Destination) => {
    setDestinations((prev) => {
      const idx = prev.findIndex((d) => d.slug === dest.slug);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = dest;
        return updated;
      }
      return [dest, ...prev];
    });

    fetch("/api/admin/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dest),
    }).catch((err) => console.error("Failed to persist destination to database:", err));
  }, []);

  const deleteDestination = useCallback((slug: string) => {
    setDestinations((prev) => prev.filter((d) => d.slug !== slug));
    fetch(`/api/admin/destinations?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Failed to delete destination from database:", err));
  }, []);

  // Experience mutations
  const saveExperience = useCallback((index: number, exp: Experience) => {
    setExperiences((prev) => {
      const updated = [...prev];
      updated[index] = exp;
      return updated;
    });

    fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exp),
    }).catch((err) => console.error("Failed to persist experience to database:", err));
  }, []);

  const addExperience = useCallback((exp: Experience) => {
    setExperiences((prev) => [...prev, exp]);
    fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exp),
    }).catch((err) => console.error("Failed to add experience to database:", err));
  }, []);

  const deleteExperience = useCallback((index: number) => {
    setExperiences((prev) => {
      const target = prev[index];
      if (target) {
        fetch(`/api/admin/experiences?title=${encodeURIComponent(target.title.en)}`, {
          method: "DELETE",
        }).catch((err) => console.error("Failed to delete experience:", err));
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Post / Blog mutations
  const savePost = useCallback((post: Post) => {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.slug === post.slug);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = post;
        return updated;
      }
      return [post, ...prev];
    });

    fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    }).catch((err) => console.error("Failed to persist blog post to database:", err));
  }, []);

  const deletePost = useCallback((slug: string) => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
    fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Failed to delete blog post:", err));
  }, []);

  // Settings & Contact mutations
  const saveContact = useCallback((contactInfo: any) => {
    setContact(contactInfo);
    fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact: contactInfo }),
    }).catch((err) => console.error("Failed to persist contact info:", err));
  }, []);

  const saveSiteSettings = useCallback((settings: SiteSettings) => {
    setSiteSettings(settings);
    fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteSettings: settings }),
    }).catch((err) => console.error("Failed to persist site settings:", err));
  }, []);

  // Gallery mutations
  const saveGalleryItem = useCallback((item: GalleryItem) => {
    setGallery((prev) => {
      const idx = prev.findIndex((g) => g.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = item;
        return updated;
      }
      return [item, ...prev];
    });
  }, []);

  const addGalleryItem = useCallback((item: GalleryItem) => {
    setGallery((prev) => [item, ...prev]);
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const reorderGallery = useCallback((items: GalleryItem[]) => {
    setGallery(items);
  }, []);

  // Inquiries mutations
  const addInquiry = useCallback(
    async (inq: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<string> => {
      const tempId = `inq-${Date.now()}`;
      const newEntry: Inquiry = {
        ...inq,
        id: tempId,
        createdAt: new Date().toISOString(),
        status: "new",
      };

      setInquiries((prev) => [newEntry, ...prev]);

      try {
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inq),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reference) {
            setInquiries((prev) =>
              prev.map((item) =>
                item.id === tempId ? { ...item, reference: data.reference } : item
              )
            );
            return data.reference;
          }
        }
      } catch (err) {
        console.error("Failed to submit inquiry:", err);
      }

      return tempId;
    },
    []
  );

  const updateInquiryStatus = useCallback(
    (id: string, status: Inquiry["status"], notes?: string) => {
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status, ...(notes !== undefined ? { notes } : {}) }
            : item
        )
      );

      fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      }).catch((err) => console.error("Failed to update inquiry in database:", err));
    },
    []
  );

  const deleteInquiry = useCallback((id: string) => {
    setInquiries((prev) => prev.filter((item) => item.id !== id));
    fetch(`/api/admin/inquiries/${id}`, {
      method: "DELETE",
    }).catch((err) => console.error("Failed to delete inquiry from database:", err));
  }, []);

  const resetToDefaults = useCallback(() => {
    setTours(defaultTours);
    setGolfCourses(defaultGolfCourses);
    setDestinations(defaultDestinations);
    setExperiences(defaultExperiences);
    setPosts(defaultPosts);
    setTestimonials(defaultTestimonials);
    setTeam(defaultTeam);
    setWhyUs(defaultWhyUs);
    setContact(defaultContact);
    setSiteSettings(defaultSiteSettings);
    setGallery(defaultGalleryItems);
    setInquiries([]);
  }, []);

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
    resetToDefaults,
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
