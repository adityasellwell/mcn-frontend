/**
 * ==========================================================
 * Landing Page Data
 * ==========================================================
 *
 * Temporary Mock Data
 *
 * Future:
 * This data will come from API
 * managed through Admin Panel.
 *
 * ==========================================================
 */
import HeroImage from "../../assets/images/hero/hero-networking.webp";
import ChapterImage from "../../assets/images/chapter/chapter-image.webp";
export const landingData = {
  hero: {
            

            badge: "Business Networking Community",

            title: "Meet People Who Move Business Forward",

            description:
                "Join a networking community where entrepreneurs, professionals, and business owners build meaningful connections, referrals, and growth opportunities.",

            primaryButtonText: "Become A Member",

            primaryButtonLink: "/register",

            secondaryButtonText: "Explore Meetings",

            secondaryButtonLink: "/meetings",

            /*
            * FUTURE ADMIN CONTROL
            *
            * Admin should upload hero image
            * from Website Management module.
            *
            * Recommended Image:
            *
            * - Professional networking event
            * - Entrepreneurs discussing
            * - Business meetup
            * - Modern networking illustration
            *
            * Size:
            * 1200 x 900
            *
            * Format:
            * WebP
            */
            image: HeroImage,

            stats: [
                {
                value: "150+",
                label: "Members",
                },
                {
                value: "24+",
                label: "Meetings",
                },
                {
                value: "500+",
                label: "Connections",
                },
            ],
            },

  about: {
                title: "What Is MCN?",

                subtitle:
                    "MCN is a business networking community where professionals, entrepreneurs, and business owners build meaningful relationships, exchange referrals, and grow together.",

                features: [
                            {
                                icon: "users",
                                title: "Business Networking",
                                description:
                                "Build meaningful relationships with entrepreneurs and professionals."
                            },

                            {
                                icon: "handshake",
                                title: "Referral Opportunities",
                                description:
                                "Exchange quality referrals and generate new business opportunities."
                            },

                            {
                                icon: "calendar",
                                title: "Monthly Meetings",
                                description:
                                "Participate in structured networking events every month."
                            },

                            {
                                icon: "growth",
                                title: "Community Growth",
                                description:
                                "Learn, collaborate, and grow with a trusted business community."
                            }
                            ]
                },

  howItWorks: {
                    title: "Grow Your Network In 4 Simple Steps",

                    subtitle:
                        "MCN helps professionals and business owners build relationships, generate referrals, and grow through structured networking.",

                    steps: [
                        {
                        number: "01",
                        title: "Join MCN",
                        description:
                            "Register and become part of the MCN networking community."
                        },

                        {
                        number: "02",
                        title: "Attend Meetings",
                        description:
                            "Participate in monthly networking meetings and connect with members."
                        },

                        {
                        number: "03",
                        title: "Build Connections",
                        description:
                            "Create meaningful relationships with entrepreneurs and professionals."
                        },

                        {
                        number: "04",
                        title: "Receive Referrals",
                        description:
                            "Grow your business through trusted referrals and opportunities."
                        }
                    ]
                    },
  meetings: {
                    title: "Join The Next Networking Event",

                    subtitle:
                        "Attend structured networking meetings, build relationships, and grow through referrals.",

                    items: [
                        {
                        id: 1,
                        title: "MCN Monthly Business Meetup",

                        date: "15 June 2026",

                        time: "10:00 AM",

                        location: "Mumbai",

                        members: 40,

                        visitors: 15,
                        },

                        {
                        id: 2,
                        title: "Entrepreneur Networking Session",

                        date: "30 June 2026",

                        time: "11:00 AM",

                        location: "Mumbai",

                        members: 35,

                        visitors: 12,
                        },
                    ],
                    },

   chapter: {
                    title: "MCN Main Chapter",

                    subtitle:
                        "A community of entrepreneurs, professionals, and business owners committed to building meaningful relationships, referrals, and long-term business growth.",

                    image: ChapterImage,

                    stats: [
                        {
                        value: "45+",
                        label: "Members",
                        },

                        {
                        value: "24+",
                        label: "Meetings",
                        },

                        {
                        value: "500+",
                        label: "Connections",
                        },
                    ],
                    },

  testimonials: [
                    {
                        id: 1,
                        name: "Rahul Sharma",
                        company: "RS Digital Solutions",

                        testimonial:
                        "MCN helped me connect with business owners and generate valuable referrals within the first few months."
                    },

                    {
                        id: 2,
                        name: "Neha Patel",
                        company: "NP Consulting",

                        testimonial:
                        "The monthly meetings are structured, professional, and filled with opportunities to build meaningful relationships."
                    },

                    {
                        id: 3,
                        name: "Amit Mehta",
                        company: "AM Enterprises",

                        testimonial:
                        "MCN is more than networking. It is a community where members genuinely help each other grow."
                    }
                    ],

    cta: {
                title: "Ready To Grow Your Network?",

                subtitle:
                    "Join a community of entrepreneurs, professionals, and business owners building meaningful connections and referrals.",

                primaryButtonText: "Become A Member",

                secondaryButtonText: "Attend A Meeting",
                },

  footer: {},
};