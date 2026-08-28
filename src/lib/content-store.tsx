"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
import { defaultGalleryItems } from "@/data/site";

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

const STORAGE_KEY = "llj_admin_live_content_v1";
const SYNC_CHANNEL = "llj_realtime_sync_channel";

const ContentContext = createContext<ContentContextType | null>(null);

function broadcastRealtimeSync() {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.postMessage({ type: "SYNC_CONTENT", timestamp: Date.now() });
      channel.close();
    } catch {}
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [whyUs, setWhyUs] = useState<Feature[]>([]);
  const [contact, setContact] = useState<any>({});
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGalleryItems);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isFetchingRef = useRef(false);

  // 1. Core live fetch function
  const fetchLiveContent = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await fetch("/api/content", {
        cache: "no-store",
        headers: { "Pragma": "no-cache" },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tours)) setTours(data.tours);
        if (Array.isArray(data.golfCourses)) setGolfCourses(data.golfCourses);
        if (Array.isArray(data.destinations)) setDestinations(data.destinations);
        if (Array.isArray(data.experiences)) setExperiences(data.experiences);
        if (Array.isArray(data.posts)) setPosts(data.posts);
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        if (data.contact && Object.keys(data.contact).length > 0) setContact(data.contact);
        if (Array.isArray(data.whyUs)) setWhyUs(data.whyUs);
        if (Array.isArray(data.testimonials)) setTestimonials(data.testimonials);
        if (Array.isArray(data.team)) setTeam(data.team);
        if (Array.isArray(data.gallery) && data.gallery.length > 0) setGallery(data.gallery);

        // Cache snapshot (without inquiries — those are PII)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, inquiries: undefined }));
        } catch {}
      }

      // Fetch inquiries separately from the auth-protected endpoint
      const token = typeof window !== "undefined" ? localStorage.getItem("llj_admin_token") : null;
      if (token) {
        const inqRes = await fetch("/api/inquiries", {
          cache: "no-store",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Pragma": "no-cache",
          },
        });
        if (inqRes.ok) {
          const inqData = await inqRes.json();
          if (Array.isArray(inqData)) {
            setInquiries(
              inqData.map((i: any) => ({
                id: i.reference || i.id,
                createdAt: i.createdAt || new Date().toISOString(),
                name: i.name,
                email: i.email,
                phone: i.phone,
                country: i.country,
                dates: i.travelDate,
                travelers: i.travelers,
                interest: i.interest || "luxury",
                tour: i.tourSlug,
                budget: i.budget,
                message: i.message,
                status: (i.status?.toLowerCase().replace(" ", "_") as any) || "new",
                notes: i.notes,
              }))
            );
          }
        }
      }
    } catch (err) {
      console.warn("Real-time live fetch error:", err);
    } finally {
      isFetchingRef.current = false;
      setIsLoaded(true);
    }
  }, []);

  // 0. Instant cached hydration on first mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.tours?.length) setTours(parsed.tours);
        if (parsed.golfCourses?.length) setGolfCourses(parsed.golfCourses);
        if (parsed.destinations?.length) setDestinations(parsed.destinations);
        if (parsed.experiences?.length) setExperiences(parsed.experiences);
        if (parsed.posts?.length) setPosts(parsed.posts);
        if (parsed.testimonials?.length) setTestimonials(parsed.testimonials);
        if (parsed.team?.length) setTeam(parsed.team);
        if (parsed.whyUs?.length) setWhyUs(parsed.whyUs);
        if (parsed.contact && Object.keys(parsed.contact).length) setContact(parsed.contact);
        if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
        if (parsed.gallery?.length) setGallery(parsed.gallery);
        if (parsed.inquiries?.length) setInquiries(parsed.inquiries);
      }
    } catch (e) {
      console.warn("Cached storage hydration error:", e);
    }
  }, []);

  // 2. Real-time Listeners (Initial Load, Focus, Visibility, Cross-Tab Broadcast, Heartbeat Polling)
  useEffect(() => {
    // Initial fetch from live database
    fetchLiveContent();

    if (typeof window === "undefined") return;

    // Cross-tab broadcast listener
    let channel: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.onmessage = (event) => {
        if (event.data?.type === "SYNC_CONTENT") {
          fetchLiveContent();
        }
      };
    }

    // Refresh when user returns to tab / window
    const handleFocus = () => fetchLiveContent();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchLiveContent();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    // 60-second gentle heartbeat polling — reduced from 4s to avoid DB overload under traffic.
    // Focus and visibility listeners handle instant updates when the admin returns to the tab.
    const interval = setInterval(fetchLiveContent, 60000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [fetchLiveContent]);

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

    fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tour),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync tour error:", e));
  }, []);

  const deleteTour = useCallback((slug: string) => {
    setTours((prev) => prev.filter((t) => t.slug !== slug));
    fetch(`/api/tours/${slug}`, { method: "DELETE" })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Delete tour error:", e));
  }, []);

  // Golf Course mutations
  const saveGolfCourse = useCallback((index: number, course: GolfCourse) => {
    const slug = course.slug || course.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const updatedCourse = { ...course, slug };

    setGolfCourses((prev) => {
      const updated = [...prev];
      updated[index] = updatedCourse;
      return updated;
    });

    fetch("/api/golf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCourse),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync golf error:", e));
  }, []);

  const addGolfCourse = useCallback((course: GolfCourse) => {
    const slug = course.slug || course.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newCourse = { ...course, slug };

    setGolfCourses((prev) => [...prev, newCourse]);
    fetch("/api/golf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync golf error:", e));
  }, []);

  const deleteGolfCourse = useCallback(
    (index: number) => {
      const course = golfCourses[index];
      const slug = course?.slug || course?.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setGolfCourses((prev) => prev.filter((_, i) => i !== index));
      if (slug) {
        fetch(`/api/golf/${slug}`, { method: "DELETE" })
          .then(() => {
            broadcastRealtimeSync();
          })
          .catch((e) => console.error("Delete golf error:", e));
      }
    },
    [golfCourses],
  );

  // Destination mutations
  const saveDestination = useCallback((dest: Destination) => {
    const slug = dest.slug || dest.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const updatedDest = { ...dest, slug };

    setDestinations((prev) => {
      const idx = prev.findIndex((d) => d.slug === slug);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = updatedDest;
        return updated;
      }
      return [...prev, updatedDest];
    });

    fetch("/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDest),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync destination error:", e));
  }, []);

  const deleteDestination = useCallback((slug: string) => {
    setDestinations((prev) => prev.filter((d) => d.slug !== slug));
    fetch(`/api/destinations/${slug}`, { method: "DELETE" })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Delete destination error:", e));
  }, []);

  // Experience mutations
  const saveExperience = useCallback((index: number, exp: Experience) => {
    const slug = exp.slug || exp.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const updatedExp = { ...exp, slug };

    setExperiences((prev) => {
      const updated = [...prev];
      updated[index] = updatedExp;
      return updated;
    });

    fetch("/api/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExp),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync experience error:", e));
  }, []);

  const addExperience = useCallback((exp: Experience) => {
    const slug = exp.slug || exp.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newExp = { ...exp, slug };

    setExperiences((prev) => [...prev, newExp]);
    fetch("/api/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExp),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync experience error:", e));
  }, []);

  const deleteExperience = useCallback(
    (index: number) => {
      const exp = experiences[index];
      const slug = exp?.slug || exp?.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setExperiences((prev) => prev.filter((_, i) => i !== index));
      if (slug) {
        fetch(`/api/experiences/${slug}`, { method: "DELETE" })
          .then(() => {
            broadcastRealtimeSync();
          })
          .catch((e) => console.error("Delete experience error:", e));
      }
    },
    [experiences],
  );

  // Blog Post mutations
  const savePost = useCallback((post: Post) => {
    const slug = post.slug || post.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const updatedPost = { ...post, slug };

    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.slug === slug);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = updatedPost;
        return updated;
      }
      return [updatedPost, ...prev];
    });

    fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync blog error:", e));
  }, []);

  const deletePost = useCallback((slug: string) => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
    fetch(`/api/blog/${slug}`, { method: "DELETE" })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Delete blog error:", e));
  }, []);

  // Contact & Settings mutations
  const saveContact = useCallback((contactInfo: any) => {
    setContact(contactInfo);
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact: contactInfo }),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync contact error:", e));
  }, []);

  const saveSiteSettings = useCallback((settings: SiteSettings) => {
    setSiteSettings(settings);
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteSettings: settings }),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync site settings error:", e));
  }, []);

  // Inquiry mutations
  const addInquiry = useCallback(
    async (inquiryData: Omit<Inquiry, "id" | "createdAt" | "status">) => {
      const tempId = `LLJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newInquiry: Inquiry = {
        ...inquiryData,
        id: tempId,
        createdAt: new Date().toISOString(),
        status: "new",
      };

      setInquiries((prev) => [newInquiry, ...prev]);

      try {
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: inquiryData.name,
            email: inquiryData.email,
            phone: inquiryData.phone,
            country: inquiryData.country,
            tourSlug: inquiryData.tour,
            travelers: inquiryData.travelers,
            travelDate: inquiryData.dates,
            duration: "",
            budget: inquiryData.budget,
            message: inquiryData.message,
            website: (inquiryData as any).website || undefined,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reference) {
            setInquiries((prev) =>
              prev.map((i) => (i.id === tempId ? { ...i, id: data.reference } : i)),
            );
            broadcastRealtimeSync();
            return data.reference;
          }
        }
      } catch (err) {
        console.error("Save inquiry to database error:", err);
      }

      broadcastRealtimeSync();
      return tempId;
    },
    [],
  );

  const updateInquiryStatus = useCallback(
    (id: string, status: Inquiry["status"], notes?: string) => {
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id
            ? {
                ...inq,
                status,
                ...(notes !== undefined ? { notes } : {}),
              }
            : inq,
        ),
      );

      const dbStatus =
        status === "new"
          ? "New"
          : status === "in_progress"
            ? "In Progress"
            : status === "contacted"
              ? "Contacted"
              : status === "booked"
                ? "Booked"
                : "Archived";

      fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: dbStatus, notes }),
      })
        .then(() => {
          broadcastRealtimeSync();
        })
        .catch((e) => console.error("Update inquiry error:", e));
    },
    [],
  );

  const deleteInquiry = useCallback((id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    fetch(`/api/inquiries/${id}`, { method: "DELETE" })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Delete inquiry error:", e));
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

    fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync gallery item error:", e));
  }, []);

  const addGalleryItem = useCallback((item: GalleryItem) => {
    setGallery((prev) => [item, ...prev]);

    fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Sync gallery item error:", e));
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));

    fetch(`/api/gallery/${id}`, { method: "DELETE" })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Delete gallery item error:", e));
  }, []);

  const reorderGallery = useCallback((items: GalleryItem[]) => {
    setGallery(items);

    fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    })
      .then(() => {
        broadcastRealtimeSync();
      })
      .catch((e) => console.error("Reorder gallery error:", e));
  }, []);

  const resetToDefaults = useCallback(() => {
    setTours([]);
    setGolfCourses([]);
    setDestinations([]);
    setExperiences([]);
    setPosts([]);
    setTestimonials([]);
    setTeam([]);
    setWhyUs([]);
    setContact({});
    setSiteSettings(defaultSiteSettings);
    setGallery(defaultGalleryItems);
    setInquiries([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    broadcastRealtimeSync();
  }, []);

  return (
    <ContentContext.Provider
      value={{
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
        refreshContent: fetchLiveContent,
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
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContentStore() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContentStore must be used within a ContentProvider");
  }
  return context;
}
