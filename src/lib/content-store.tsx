"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
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
  type Tour,
  type GolfCourse,
  type Destination,
  type Experience,
  type Post,
  type Testimonial,
  type TeamMember,
  type Feature,
} from "@/data/site";

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
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

const initialSampleInquiries: Inquiry[] = [
  {
    id: "inq-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    name: "Park Min-jun",
    email: "minjun.park@seoul.kr",
    country: "South Korea",
    dates: "Oct 15 - Oct 25, 2026",
    travelers: "4",
    interest: "golf",
    tour: "The Master's Golf Expedition",
    budget: "$15,000 - $20,000",
    message: "We are 4 golfers wanting to play Nuwara Eliya and Shangri-La Hambantota with VIP van transport and Korean guide assistance.",
    status: "new",
  },
  {
    id: "inq-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    name: "Eleanor Vance",
    email: "eleanor.vance@london.co.uk",
    country: "United Kingdom",
    dates: "Dec 10 - Dec 22, 2026",
    travelers: "2",
    interest: "luxury",
    tour: "The Grand Ceylon Odyssey",
    budget: "$10,000+",
    message: "Looking for a luxury private honeymoon with tea bungalows and private leopard safari in Yala.",
    status: "in_progress",
    notes: "Sent initial itinerary draft via email. Awaiting hotel preferences.",
  },
];

interface ContentContextType {
  tours: Tour[];
  golfCourses: GolfCourse[];
  destinations: Destination[];
  experiences: Experience[];
  posts: Post[];
  testimonials: Testimonial[];
  team: TeamMember[];
  whyUs: Feature[];
  contact: typeof defaultContact;
  siteSettings: SiteSettings;
  inquiries: Inquiry[];

  // Mutations
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
  saveContact: (contactInfo: typeof defaultContact) => void;
  saveSiteSettings: (settings: SiteSettings) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => string;
  updateInquiryStatus: (id: string, status: Inquiry["status"], notes?: string) => void;
  deleteInquiry: (id: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "llj_admin_live_content_v1";

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
  const [contact, setContact] = useState(defaultContact);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialSampleInquiries);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tours) setTours(parsed.tours);
        if (parsed.golfCourses) setGolfCourses(parsed.golfCourses);
        if (parsed.destinations) setDestinations(parsed.destinations);
        if (parsed.experiences) setExperiences(parsed.experiences);
        if (parsed.posts) setPosts(parsed.posts);
        if (parsed.testimonials) setTestimonials(parsed.testimonials);
        if (parsed.team) setTeam(parsed.team);
        if (parsed.whyUs) setWhyUs(parsed.whyUs);
        if (parsed.contact) setContact(parsed.contact);
        if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
        if (parsed.inquiries) setInquiries(parsed.inquiries);
      }
    } catch (e) {
      console.warn("Failed to load live content from storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
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
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Failed to save live content", e);
    }
  }, [
    isLoaded,
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
  ]);

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
  }, []);

  const deleteTour = useCallback((slug: string) => {
    setTours((prev) => prev.filter((t) => t.slug !== slug));
  }, []);

  const saveGolfCourse = useCallback((index: number, course: GolfCourse) => {
    setGolfCourses((prev) => {
      const updated = [...prev];
      if (index >= 0 && index < updated.length) {
        updated[index] = course;
      }
      return updated;
    });
  }, []);

  const addGolfCourse = useCallback((course: GolfCourse) => {
    setGolfCourses((prev) => [...prev, course]);
  }, []);

  const deleteGolfCourse = useCallback((index: number) => {
    setGolfCourses((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
  }, []);

  const deleteDestination = useCallback((slug: string) => {
    setDestinations((prev) => prev.filter((d) => d.slug !== slug));
  }, []);

  const saveExperience = useCallback((index: number, exp: Experience) => {
    setExperiences((prev) => {
      const updated = [...prev];
      if (index >= 0 && index < updated.length) {
        updated[index] = exp;
      }
      return updated;
    });
  }, []);

  const addExperience = useCallback((exp: Experience) => {
    setExperiences((prev) => [...prev, exp]);
  }, []);

  const deleteExperience = useCallback((index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
  }, []);

  const deletePost = useCallback((slug: string) => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const saveContact = useCallback((contactInfo: typeof defaultContact) => {
    setContact(contactInfo);
  }, []);

  const saveSiteSettings = useCallback((settings: SiteSettings) => {
    setSiteSettings(settings);
  }, []);

  const addInquiry = useCallback(
    (inq: Omit<Inquiry, "id" | "createdAt" | "status">) => {
      const newId = `inq-${Date.now()}`;
      const newEntry: Inquiry = {
        ...inq,
        id: newId,
        createdAt: new Date().toISOString(),
        status: "new",
      };
      setInquiries((prev) => [newEntry, ...prev]);
      return newId;
    },
    [],
  );

  const updateInquiryStatus = useCallback(
    (id: string, status: Inquiry["status"], notes?: string) => {
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status, ...(notes !== undefined ? { notes } : {}) }
            : item,
        ),
      );
    },
    [],
  );

  const deleteInquiry = useCallback((id: string) => {
    setInquiries((prev) => prev.filter((item) => item.id !== id));
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
    setInquiries(initialSampleInquiries);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
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
    addInquiry,
    updateInquiryStatus,
    deleteInquiry,
    resetToDefaults,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContentStore() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContentStore must be used within a ContentProvider");
  }
  return ctx;
}
