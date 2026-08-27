const fs = require('fs');

const newTours = `export const tours: Tour[] = [
  {
    slug: "luxury-highlights",
    name: { en: "Sri Lanka Luxury Highlights", ko: "스리랑카 럭셔리 하이라이트" },
    category: "Luxury",
    categories: ["Luxury", "Culture", "Wildlife"],
    days: 8,
    price: "Custom",
    image: sigiriya,
    gallery: [sigiriya, kandy, tea, ella, galle],
    locations: ["Sigiriya", "Dambulla", "Kandy", "Nuwara Eliya", "Ella", "Yala", "Galle", "Bentota"],
    short: {
      en: "Ideal for first-time visitors covering the cultural triangle, highlands, safari, and beach.",
      ko: "스리랑카를 처음 방문하는 분들을 위한 완벽한 코스입니다. 문화, 고산지대, 사파리, 해변을 아우릅니다.",
    },
    overview: {
      en: "Experience the ultimate Sri Lanka journey. Highlights include Sigiriya Rock Fortress, Dambulla Cave Temple, Kandy's Sacred Tooth Relic, Nuwara Eliya tea plantations, Ella train journey, Yala safari, and Galle Fort heritage tour.",
      ko: "스리랑카의 진수를 경험하세요. 시기리야, 담불라, 캔디 사원, 누와라엘리야 차밭, 엘라 기차 여행, 얄라 국립공원 사파리, 갈레 요새가 포함됩니다.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Airport meet & greet, transfer to hotel." },
      { day: "02", title: "Cultural Triangle", text: "Explore Sigiriya Rock Fortress and Dambulla Cave Temple." },
      { day: "03", title: "Kandy", text: "Visit the Temple of the Sacred Tooth Relic." },
      { day: "04", title: "Highlands", text: "Explore Nuwara Eliya tea plantations." },
      { day: "05", title: "Scenic Journey", text: "Train journey to Ella and sightseeing." },
      { day: "06", title: "Safari", text: "Yala National Park jeep safari." },
      { day: "07", title: "Heritage & Beach", text: "Galle Fort tour and Bentota beach relaxation." },
      { day: "08", title: "Departure", text: "Airport transfers." }
    ],
    included: [
      "Luxury 4-5 star accommodation",
      "Private luxury vehicle",
      "Professional English-speaking chauffeur guide",
      "Daily breakfast",
      "All entrance arrangements",
      "Airport transfers"
    ],
    excluded: baseExcluded,
    hotels: ["Luxury 4-5 star hotels"],
    transport: "Private luxury vehicle",
    optional: [],
  },
  {
    slug: "golf-escape",
    name: { en: "Sri Lanka Golf Escape", ko: "스리랑카 골프 에스케이프" },
    category: "Golf",
    categories: ["Golf", "Luxury"],
    days: 10,
    price: "Custom",
    image: golf,
    gallery: [golf, golf2, kandy, tea, galle],
    locations: ["Colombo", "Victoria", "Nuwara Eliya", "Hambantota"],
    short: {
      en: "A premium 10-day golf holiday for enthusiasts, playing on Sri Lanka's finest courses.",
      ko: "골프 애호가를 위한 10일간의 프리미엄 골프 휴양. 스리랑카 최고의 코스를 경험하세요.",
    },
    overview: {
      en: "Play at Colombo Golf Club, Victoria Golf & Country Resort, Nuwara Eliya Golf Club, and Shangri-La Hambantota. Additional experiences include Kandy city tour, tea factory visit, Galle Fort, and luxury beach stays.",
      ko: "콜롬보, 빅토리아, 누와라엘리야, 샹그릴라 함반토타 골프 클럽에서 라운딩을 즐기며 캔디, 차밭, 갈레 요새 관광이 포함됩니다.",
    },
    itinerary: [
      { day: "01-02", title: "Colombo", text: "Arrival and golf at Colombo Golf Club." },
      { day: "03-04", title: "Victoria", text: "Golf at Victoria Golf & Country Resort and Kandy tour." },
      { day: "05-06", title: "Nuwara Eliya", text: "Golf at Nuwara Eliya Golf Club and Tea factory visit." },
      { day: "07-09", title: "Hambantota", text: "Golf at Shangri-La Hambantota and Galle Fort exploration." },
      { day: "10", title: "Departure", text: "Private transfer to airport." }
    ],
    included: [
      "Premium accommodation",
      "Green fee arrangements & Tee-time reservations",
      "Golf equipment transportation",
      "Private chauffeur service"
    ],
    excluded: baseExcluded,
    hotels: ["Premium accommodation near courses"],
    transport: "Private chauffeur service with golf equipment transport",
    optional: [],
  },
  {
    slug: "wildlife-adventure",
    name: { en: "Sri Lanka Wildlife Adventure", ko: "스리랑카 와일드라이프 어드벤처" },
    category: "Experiences",
    categories: ["Wildlife", "Experiences"],
    days: 7,
    price: "Custom",
    image: wildlife,
    gallery: [wildlife, resort, aerial, train],
    locations: ["Wilpattu", "Minneriya", "Yala", "Udawalawe"],
    short: {
      en: "Ideal for nature enthusiasts and wildlife photographers.",
      ko: "자연을 사랑하는 분들과 야생동물 사진가들을 위한 완벽한 투어.",
    },
    overview: {
      en: "Explore Wilpattu National Park, witness the seasonal Minneriya Elephant Gathering, experience Yala National Park safaris, and visit the Udawalawe Elephant Transit Home.",
      ko: "윌파투 국립공원, 미네리야 코끼리 모임, 얄라 국립공원 사파리, 우다왈라웨 코끼리 보호소를 방문합니다.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Airport meet & greet." },
      { day: "02", title: "Wilpattu", text: "Wilpattu National Park safari." },
      { day: "03", title: "Minneriya", text: "Minneriya Elephant Gathering (seasonal)." },
      { day: "04", title: "Yala", text: "Travel south for Yala Safari." },
      { day: "05", title: "Yala National Park", text: "Full day safari experience." },
      { day: "06", title: "Udawalawe", text: "Visit Udawalawe Elephant Transit Home." },
      { day: "07", title: "Departure", text: "Transfer to airport." }
    ],
    included: baseIncluded,
    excluded: baseExcluded,
    hotels: ["Luxury Safari Lodges & Camps"],
    transport: "Private vehicle and 4x4 Safari Jeeps",
    optional: ["Birdwatching experiences"],
  },
  {
    slug: "cultural-heritage-journey",
    name: { en: "Cultural Heritage Journey", ko: "문화 유산 여정" },
    category: "Culture",
    categories: ["Culture"],
    days: 7,
    price: "Custom",
    image: culture,
    gallery: [culture, sigiriya, kandy, galle],
    locations: ["Anuradhapura", "Mihintale", "Sigiriya", "Polonnaruwa", "Dambulla", "Kandy"],
    short: {
      en: "A deep dive into Sri Lanka's ancient cities, sacred sites, and rich cultural traditions.",
      ko: "스리랑카의 고대 도시와 성지, 풍부한 문화 전통을 깊이 탐구하는 투어.",
    },
    overview: {
      en: "Discover Anuradhapura, Mihintale, Sigiriya, Polonnaruwa, Dambulla Cave Temple, and Kandy. Enjoy traditional village tours, cultural dances, and gem museums.",
      ko: "아누라다푸라, 미힌탈레, 시기리야, 폴론나루와 등 고대 도시를 탐험하고 전통 마을과 문화 공연을 즐깁니다.",
    },
    itinerary: [
      { day: "01", title: "Arrival & Anuradhapura", text: "Transfer to ancient city." },
      { day: "02", title: "Mihintale", text: "Visit the sacred site of Mihintale." },
      { day: "03", title: "Sigiriya & Village", text: "Climb Lion Rock and enjoy a traditional village tour with lunch." },
      { day: "04", title: "Polonnaruwa", text: "Explore the ruins of Polonnaruwa." },
      { day: "05", title: "Dambulla", text: "Visit Dambulla Cave Temple." },
      { day: "06", title: "Kandy", text: "City tour, Temple of the Tooth, and Cultural Dance." },
      { day: "07", title: "Departure", text: "Gem museum visit and airport transfer." }
    ],
    included: baseIncluded,
    excluded: baseExcluded,
    hotels: ["Heritage Boutique Hotels"],
    transport: "Private luxury vehicle",
    optional: [],
  },
  {
    slug: "romantic-honeymoon",
    name: { en: "Romantic Honeymoon in Paradise", ko: "로맨틱 허니문 인 파라다이스" },
    category: "Honeymoon",
    categories: ["Honeymoon", "Luxury"],
    days: 8,
    price: "Custom",
    image: honeymoon,
    gallery: [honeymoon, resort, beach, ella],
    locations: ["Beachfront", "Hill Country"],
    short: {
      en: "Ideal for newlyweds featuring candlelight dining, luxury resorts, and couple's spa treatments.",
      ko: "신혼부부를 위한 완벽한 여행. 프라이빗 다이닝, 럭셔리 리조트, 스파가 포함됩니다.",
    },
    overview: {
      en: "Celebrate your love with private candlelight dining, luxury beachfront stays, a scenic train journey, couple's spa treatments, sunset cruises, and a professional photography session.",
      ko: "로맨틱한 촛불 저녁 식사, 해변 리조트, 기차 여행, 커플 스파 및 전문 허니문 스냅 촬영이 포함됩니다.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Welcome and transfer to luxury resort." },
      { day: "02", title: "Relaxation", text: "Couple's spa treatment." },
      { day: "03", title: "Sunset", text: "Sunset cruise experience." },
      { day: "04", title: "Scenic Journey", text: "Romantic train ride." },
      { day: "05", title: "Photography", text: "Professional honeymoon photography session." },
      { day: "06", title: "Beach Leisure", text: "Free time at the beachfront." },
      { day: "07", title: "Dining", text: "Private candlelight dinner." },
      { day: "08", title: "Departure", text: "Transfer to airport." }
    ],
    included: baseIncluded,
    excluded: baseExcluded,
    hotels: ["Luxury Beachfront Resorts"],
    transport: "Private luxury vehicle",
    optional: ["Helicopter transfer"],
  },
  {
    slug: "family-discovery-tour",
    name: { en: "Family Discovery Tour", ko: "패밀리 디스커버리 투어" },
    category: "Family",
    categories: ["Family", "Wildlife"],
    days: 9,
    price: "Custom",
    image: train,
    gallery: [train, wildlife, beach, galle],
    locations: ["Pinnawala", "Madu River", "Yala", "Galle"],
    short: {
      en: "Suitable for families with children of all ages, blending wildlife, beaches, and fun activities.",
      ko: "모든 연령대의 자녀와 함께하기 좋은 가족 여행. 야생동물, 해변, 재미있는 체험이 가득합니다.",
    },
    overview: {
      en: "Family experiences include Pinnawala Elephant Orphanage, a turtle hatchery, Madu River safari, Yala National Park, Galle Fort, beach leisure, and a scenic train journey.",
      ko: "코끼리 고아원, 거북이 부화장, 마두강 사파리, 얄라 국립공원, 갈레 요새 및 해변 휴양이 포함됩니다.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Family welcome." },
      { day: "02", title: "Elephants", text: "Pinnawala Elephant Orphanage." },
      { day: "03", title: "Train Ride", text: "Scenic family train journey." },
      { day: "04", title: "Safari Time", text: "Yala National Park safari." },
      { day: "05", title: "Galle Fort", text: "Explore the historic Galle Fort." },
      { day: "06", title: "Turtles & River", text: "Turtle hatchery and Madu River safari." },
      { day: "07-08", title: "Beach", text: "Beach leisure activities." },
      { day: "09", title: "Departure", text: "Airport transfer." }
    ],
    included: baseIncluded,
    excluded: baseExcluded,
    hotels: ["Family-friendly Luxury Resorts"],
    transport: "Private family vehicle",
    optional: [],
  },
  {
    slug: "wellness-ayurveda-retreat",
    name: { en: "Wellness & Ayurveda Retreat", ko: "웰니스 & 아유르베다 리트리트" },
    category: "Experiences",
    categories: ["Experiences", "Luxury"],
    days: 10,
    price: "Custom",
    image: wellness,
    gallery: [wellness, resort, beach, tea],
    locations: ["Retreat Centers", "Beachside"],
    short: {
      en: "Recommended for guests seeking relaxation, healing, and rejuvenation through Ayurveda and yoga.",
      ko: "진정한 휴식과 치유를 원하는 분들을 위한 아유르베다 및 요가 리트리트.",
    },
    overview: {
      en: "Includes daily Ayurveda treatments, guided yoga sessions, meditation practices, healthy wellness cuisine, nature walks, and beachside relaxation.",
      ko: "매일 아유르베다 트리트먼트, 요가, 명상, 웰니스 식단, 자연 산책 및 해변 휴식이 제공됩니다.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Transfer to wellness retreat." },
      { day: "02-08", title: "Wellness Program", text: "Daily Ayurveda, yoga, meditation, and nature walks." },
      { day: "09", title: "Beach Relaxation", text: "Beachside leisure and healthy cuisine." },
      { day: "10", title: "Departure", text: "Rejuvenated departure transfer." }
    ],
    included: baseIncluded,
    excluded: baseExcluded,
    hotels: ["Luxury Wellness & Ayurveda Resorts"],
    transport: "Private transfer",
    optional: [],
  },
  {
    slug: "luxury-beach-holiday",
    name: { en: "Luxury Beach Holiday", ko: "럭셔리 비치 홀리데이" },
    category: "Luxury",
    categories: ["Luxury", "Honeymoon"],
    days: 7,
    price: "Custom",
    image: beach,
    gallery: [beach, aerial, galle, resort],
    locations: ["Bentota", "Mirissa", "Weligama", "Tangalle"],
    short: {
      en: "Sun, sand, and serenity on Sri Lanka's most beautiful southern beaches.",
      ko: "스리랑카 남부의 아름다운 해변에서 즐기는 완벽한 럭셔리 휴양.",
    },
    overview: {
      en: "Visit Bentota, Mirissa, Weligama, and Tangalle. Enjoy whale watching (seasonal), water sports, sunset cruises, fine seafood dining, and spa treatments.",
      ko: "벤토타, 미리사, 웰리가마, 탕갈레 해변에서 고래 관찰, 수상 스포츠, 선셋 크루즈, 파인 다이닝을 즐깁니다.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Transfer to Bentota." },
      { day: "02", title: "Water Sports", text: "Activities in Bentota." },
      { day: "03", title: "South Coast", text: "Move to Weligama/Mirissa." },
      { day: "04", title: "Whale Watching", text: "Morning whale watching (seasonal)." },
      { day: "05", title: "Tangalle", text: "Transfer to Tangalle, sunset cruise." },
      { day: "06", title: "Spa & Dining", text: "Spa treatments and fine seafood dining." },
      { day: "07", title: "Departure", text: "Transfer to airport." }
    ],
    included: baseIncluded,
    excluded: baseExcluded,
    hotels: ["5-Star Beach Resorts"],
    transport: "Private luxury vehicle",
    optional: [],
  },
  {
    slug: "tailor-made-experience",
    name: { en: "Tailor-Made Sri Lanka Experience", ko: "스리랑카 맞춤 여행" },
    category: "Custom",
    categories: ["Custom"],
    days: 14,
    price: "On Request",
    image: colombo,
    gallery: [colombo, sigiriya, golf, wildlife, beach],
    locations: ["Anywhere in Sri Lanka"],
    short: {
      en: "Every traveler is unique. We design fully customized itineraries based on your preferences.",
      ko: "모든 여행자는 특별합니다. 고객님의 예산, 관심사, 여행 스타일에 맞춘 100% 맞춤 일정을 설계합니다.",
    },
    overview: {
      en: "We design fully customized itineraries based on travel dates, budget, personal interests, group size, golf preferences, wildlife, culture, culinary tastes, and preferred luxury level.",
      ko: "여행 일정, 예산, 관심사, 골프, 야생동물, 문화, 미식 및 선호하는 럭셔리 등급에 따라 완벽한 맞춤 여행을 만들어 드립니다.",
    },
    itinerary: [
      { day: "01+", title: "Your Journey", text: "Crafted exclusively for you by our specialists." }
    ],
    included: baseIncluded,
    excluded: baseExcluded,
    hotels: ["Chosen to your preference"],
    transport: "Tailored to your itinerary",
    optional: ["Unlimited possibilities"],
  }
];
`;

const fileContent = fs.readFileSync('src/data/site.ts', 'utf8');

const toursStartStr = 'export const tours: Tour[] = [';
const toursEndStr = 'export const tourFilters = [';

const toursStart = fileContent.indexOf(toursStartStr);
const toursEnd = fileContent.indexOf(toursEndStr);

if (toursStart !== -1 && toursEnd !== -1) {
  const topPart = fileContent.substring(0, toursStart);
  const bottomPart = fileContent.substring(toursEnd);
  
  fs.writeFileSync('src/data/site.ts', topPart + newTours + '\n' + bottomPart, 'utf8');
  console.log('Tours updated safely.');
} else {
  console.log('Could not find boundaries.');
}
