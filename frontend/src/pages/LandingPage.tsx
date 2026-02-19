import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  MessageCircle,
  Calendar,
  TrendingUp,
  Heart,
  ArrowRight,
  CheckCircle,
  Quote,
  ChevronLeft,
  ChevronRight,
  Building2,
  Hammer,
  HardHat,
  Ruler,
  Trophy,
  Target,
  Lightbulb,
  GraduationCap,
  Moon,
  Sun,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Footer from "../components/common/Footer";
import AnimatedBackground from "../components/common/AnimatedBackground";
import { useTheme } from "../context/ThemeContext";

// Import images
import alumniConnectLogo from "../assets/logos/alumni_connect_logo-removebg-preview.png";
import awardis from "../assets/civil eng element/awardis.jpg";
import dept from "../assets/civil eng element/dept.png";
import interct from "../assets/civil eng element/interct.jpg";
import lis from "../assets/civil eng element/lis.jpg";
import listens from "../assets/civil eng element/listens.jpg";
// import studentDiscuss from '../assets/civil eng element/student discuss.png';
// import alumniTalk from '../assets/civil eng element/studnet alumni talk.png';
// import aestheticBuilding from '../assets/civil eng element/aesthetic building.jpeg';
import bimProject from "../assets/civil eng element/BIM Project Management Software _ BEXEL Manager.jpeg";
// import bridgesWithNames from '../assets/civil eng element/bridges with names.jpeg';
// import beautifulBuilding from '../assets/civil eng element/buitiful building.jpeg';
import roadDesign from "../assets/civil eng element/Road Design_ Pavement Thickness and Material Quantity Calculations.jpeg";
// import multiFamousBuilding from '../assets/civil eng element/multi famous building.jpeg';
// import nightView from '../assets/civil eng element/night view 🤍🪟.jpeg';
// import trendyCivil from '../assets/civil eng element/trendy civil.jpeg';
// import architecture3d from '../assets/civil eng element/3d architecture design.jpeg';
// import alumnis from '../assets/civil eng element/alumnis.jpg';
import infrastr from "../assets/civil eng element/infrastr.avif";
import one from "../assets/civil eng element/one.jpg";
import two from "../assets/civil eng element/two.jpg";
import three from "../assets/civil eng element/three.jpg";
import four from "../assets/civil eng element/four.jpg";
// import learn from '../assets/civil eng element/learn.jpg';
import archimarvels from "../assets/civil eng element/archimarvels.jpg";
import moderndesign from "../assets/civil eng element/moderndesign.jpg";
import bim10Dimensions from "../assets/civil eng element/BIM 10 Dimensions.jpeg";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [clickedCard, setClickedCard] = useState<number | null>(null);

  // Hero section images for carousel
  const heroImages = [
    { src: dept, title: "Infrastructure Construction" },
    { src: awardis, title: "Green Infrastructure" },
    { src: listens, title: "Aesthetic Design" },
    { src: interct, title: "Beautiful Structures" },
    { src: lis, title: "Night Views" },
  ];

  // const stats = {
  //   alumni: 0,
  //   students: 0,
  //   companies: 0,
  //   opportunities: 0,
  //   events: 0,
  //   projects: 0,
  // };

  const partOne = useMemo(() => "Connect. ", []);
  const partTwo = useMemo(() => "Construct. ", []);
  const partThree = useMemo(() => "Conquer. ", []);
  const totalLength = partOne.length + partTwo.length + partThree.length;
  const [shownCount, setShownCount] = useState(0); // how many characters to show from combined string
  const [phase, setPhase] = useState("typing"); // 'typing' | 'pausing' | 'deleting'

  useEffect(() => {
    const typeMs = 70; // typing speed
    const deleteMs = 40; // deleting speed
    const pauseEndMs = 1000; // pause after full typed
    const pauseStartMs = 600; // pause before re-typing after deletion

    let timeoutId;

    if (phase === "typing") {
      if (shownCount < totalLength) {
        timeoutId = setTimeout(() => setShownCount(shownCount + 1), typeMs);
      } else {
        timeoutId = setTimeout(() => setPhase("pausing"), pauseEndMs);
      }
    } else if (phase === "pausing") {
      timeoutId = setTimeout(() => setPhase("deleting"), pauseEndMs);
    } else if (phase === "deleting") {
      if (shownCount > 0) {
        timeoutId = setTimeout(() => setShownCount(shownCount - 1), deleteMs);
      } else {
        timeoutId = setTimeout(() => setPhase("typing"), pauseStartMs);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [phase, shownCount, totalLength]);

  // derive how many chars of each part to show from combined shownCount
  const partOneCount = Math.min(shownCount, partOne.length);
  const partTwoCount = Math.max(
    0,
    Math.min(shownCount - partOne.length, partTwo.length),
  );
  const partThreeCount = Math.max(
    0,
    Math.min(shownCount - partOne.length - partTwo.length, partThree.length),
  );

  const testimonials = [
    {
      id: 1,
      name: "Prince Michael",
      batch: "2021",
      role: "Senior Structural Engineer at L&T Construction",
      company: "Larsen & Toubro",
      quote:
        "Alumni Connect bridges the gap between experience and ambition. I've mentored 5 civil engineering students and helped 3 of them secure positions in top infrastructure companies. The platform's focus on our domain makes networking more meaningful.",
    },
    {
      id: 2,
      name: "Shruti Roy",
      batch: "2021",
      role: "Project Engineer at Tata Projects",
      company: "Tata Projects",
      quote:
        "Thanks to Alumni Connect, I found my first job in highway construction! Senior alumni shared their interview experiences and technical knowledge that was crucial for my selection. The civil engineering-specific resources are invaluable.",
    },
    {
      id: 3,
      name: "Er. Ajay Mahato",
      batch: "2021",
      role: "Project Manager at ABG",
      company: "ABG",
      quote:
        "This platform reconnected me with my BIT Sindri civil engineering batchmates. We now collaborate on projects and share industry insights. It's amazing to see our ACE community making an impact on India's infrastructure!",
    },
  ];

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Auto-slide hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b border-sky-200 dark:border-gray-700 shadow-sm backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img
                src={alumniConnectLogo}
                alt="Alumni Connect Logo"
                className="h-10 sm:h-12 md:h-12 lg:h-14 w-auto object-contain drop-shadow-md"
              />
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                  Alumni Connect
                </h1>
                <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-semibold transition-colors">
                  ACE BIT Sindri
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                About
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Success Stories
              </a>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/80 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 border border-sky-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-110"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-orange-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex text-sm md:text-base"
              >
                Login
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Civil Engineering Theme */}
      <section className="relative bg-gradient-to-br from-sky-50 via-green-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white py-16 md:py-24 overflow-hidden min-h-[600px] transition-colors duration-300">
        {/* Animated Background for Dark Mode */}
        <AnimatedBackground variant="stars" />

        {/* Sliding Background Images Carousel with Cool Effects */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentHeroImage
                  ? "opacity-100 scale-100 blur-0"
                  : index ===
                      (currentHeroImage - 1 + heroImages.length) %
                        heroImages.length
                    ? "opacity-0 -translate-x-full scale-95 blur-sm"
                    : "opacity-0 translate-x-full scale-95 blur-sm"
              }`}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover object-center"
                style={{ filter: "brightness(0.9)" }}
              />
              {/* Fully transparent overlay - no color overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5"></div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`h-2.5 rounded-full transition-all duration-300 shadow-lg ${
                index === currentHeroImage
                  ? "bg-orange-600 w-10"
                  : "bg-white/60 w-2.5 hover:bg-orange-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center min-h-[500px] flex flex-col justify-center">
            {/* Text Content - Centered with Better Visibility */}
            <Badge
              variant="success"
              className="mb-6 bg-white/95 dark:bg-gray-800/95 text-orange-600 dark:text-orange-400 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-600 shadow-lg inline-flex mx-auto"
            >
              <Building2 size={16} className="mr-2" />
              ACE BIT Sindri
            </Badge>
            {/* 
            <div className="mb-8 px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">Connect.</span>{' '}
                <span className="text-orange-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">Construct.</span>{' '}
                <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">Conquer.</span>
              </h1> */}

            {/* Association of Civil Engineers - Continuous Typing */}
            <span className="mb-8 px-4">
              <span
                className={`text-white font-bold text-5xl 
sm:text-4xl 
md:text-5xl 
lg:text-6xl 
xl:text-7xl 
drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]
leading-tight tracking-wide`}
              >
                {partOne.slice(0, partOneCount)}
              </span>
              <span
                className={`text-orange-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)] text-5xl 
sm:text-4xl 
md:text-5xl 
lg:text-6xl 
xl:text-7xl 
font-bold 
leading-tight 

 tracking-wide ml-2`}
              >
                {partTwo.slice(0, partTwoCount)}
              </span>
              <span
                className={`text-white font-bold text-5xl 
sm:text-4xl 
md:text-5xl 
lg:text-6xl 
xl:text-7xl 
drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]
leading-tight tracking-wide`}
              >
                {partThree.slice(0, partThreeCount)}
              </span>
            </span>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed max-w-3xl mx-auto font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
              Join{" "}
              <span className="font-bold text-orange-400 text-lg sm:text-xl md:text-2xl lg:text-3xl"></span>{" "}
              Civil engineering professionals from BIT Sindri
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate("/signup/student")}
              className="bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-semibold shadow-xl"
            >
              <GraduationCap size={20} className="mr-2" />
              Join as Student
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/signup/alumni")}
              className="border-2 border-orange-600 dark:border-orange-400 text-orange-600 dark:text-orange-400 hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white font-semibold bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            >
              <HardHat size={20} className="mr-2" />
              Join as Alumni
            </Button>
          </div>

          {/* ===================== Quick Stats Section (Commented Out) =====================
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto px-4">
              {[
                // { value: '00+', label: 'Alumni' },
                // { value: '00+', label: 'Companies' },
                // { value: '00+', label: 'Opportunities' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                             rounded-lg p-2 sm:p-3 md:p-4 shadow-lg
                             border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl
                                font-bold text-orange-600 dark:text-orange-400 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold
                                text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            =================== End of Quick Stats Section =================== */}
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="currentColor"
              className="text-white dark:text-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* About ACE Section */}
      <section
        id="about"
        className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden"
      >
        <AnimatedBackground variant="grid" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge
                variant="primary"
                className="mb-4 dark:bg-blue-900 dark:text-blue-300"
              >
                <Building2 size={16} className="mr-2" />
                About ACE BIT Sindri
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Association of Civil Engineers
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Connecting civil engineering professionals since 1957
              </p>
            </div>

            {/* Image Showcase */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div
                className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                onClick={() => window.open(infrastr, "_blank")}
              >
                <img
                  src={infrastr}
                  alt="Famous Bridges"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-semibold">
                    Infrastructure Projects
                  </p>
                </div>
              </div>
              <div
                className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                onClick={() => window.open(archimarvels, "_blank")}
              >
                <img
                  src={archimarvels}
                  alt="Famous Buildings"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-semibold">
                    Architectural Marvels
                  </p>
                </div>
              </div>
              <div
                className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                onClick={() => window.open(moderndesign, "_blank")}
              >
                <img
                  src={moderndesign}
                  alt="3D Architecture"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-semibold">Modern Design</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card
                variant="elevated"
                className="p-6 bg-white dark:bg-gray-800"
              >
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <Trophy
                    className="text-orange-600 dark:text-orange-400"
                    size={24}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Our Legacy
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  The Department of Civil Engineering was Established in 1957.
                  The department has produced over 5,000+ civil engineers who
                  are now contributing to India's infrastructure development
                  across highways, bridges, dams, structural engineering, and
                  soil mechanics projects. We specialize in Soil Mechanics &
                  Foundation Engineering, and Structural Engineering.
                </p>
              </Card>

              <Card
                variant="elevated"
                className="p-6 bg-white dark:bg-gray-800"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Target
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Our Mission
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To create a vibrant community where civil engineering students
                  and alumni collaborate, share knowledge, and build the
                  infrastructure that powers India's growth. The department
                  provides adequate facilities for R&D work and thus provides a
                  vital impetus in the growth of the state.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden"
      >
        <AnimatedBackground variant="particles" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge
              variant="primary"
              className="mb-4 dark:bg-blue-900 dark:text-blue-300"
            >
              <Lightbulb size={16} className="mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything Civil Engineers Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Specialized tools and features designed specifically for civil
              engineering professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-orange-600" size={32} />,
                title: "Alumni Network",
                description:
                  "Connect with 00+ civil engineering alumni working in top infrastructure companies across India and abroad.",
                color: "orange",
              },
              {
                icon: <Briefcase className="text-blue-600" size={32} />,
                title: "Job & Internship Board",
                description:
                  "Access exclusive opportunities in construction, structural design, project management, and infrastructure development.",
                color: "blue",
              },
              {
                icon: <GraduationCap className="text-green-600" size={32} />,
                title: "Mentorship Program",
                description:
                  "Get guidance from experienced civil engineers on career paths, technical skills, and industry certifications.",
                color: "green",
              },
              {
                icon: <Hammer className="text-purple-600" size={32} />,
                title: "Project Showcase",
                description:
                  "Share your construction projects, design work, and technical innovations with the community.",
                color: "purple",
              },
              {
                icon: <Calendar className="text-indigo-600" size={32} />,
                title: "Technical Workshops",
                description:
                  "Attend workshops on AutoCAD, STAAD Pro, BIM, project management, and latest construction technologies.",
                color: "indigo",
              },
              {
                icon: <MessageCircle className="text-pink-600" size={32} />,
                title: "Knowledge Exchange",
                description:
                  "Discuss structural designs, construction techniques, material specifications, and solve technical challenges together.",
                color: "pink",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                variant="elevated"
                onClick={() =>
                  setClickedCard(clickedCard === index ? null : index)
                }
                className={`
                  p-6 cursor-pointer transition-all duration-500 border-t-4 border-t-current
                  hover:shadow-2xl hover:-translate-y-2 hover:scale-105
                  ${
                    clickedCard === index
                      ? "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 shadow-2xl scale-105 -translate-y-2"
                      : "bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-gray-50 hover:via-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:via-gray-800 dark:hover:to-gray-700"
                  }
                `}
                style={{ borderTopColor: `var(--color-${feature.color}-600)` }}
              >
                <div
                  className={`
                  w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-all duration-500
                  ${
                    clickedCard === index
                      ? "bg-white/20 scale-110 rotate-12"
                      : `bg-${feature.color}-100 dark:bg-${feature.color}-900`
                  }
                `}
                >
                  {React.cloneElement(feature.icon, {
                    className: clickedCard === index ? "text-white" : "",
                  })}
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
                    clickedCard === index
                      ? "text-white"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`leading-relaxed transition-colors duration-300 ${
                    clickedCard === index
                      ? "text-white/90"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {feature.description}
                </p>
                {clickedCard === index && (
                  <div className="mt-4 pt-4 border-t border-white/30 animate-fadeIn">
                    <p className="text-white/80 text-sm italic"></p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        <AnimatedBackground variant="waves" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge
              variant="primary"
              className="mb-4 dark:bg-blue-900 dark:text-blue-300"
            >
              <Target size={16} className="mr-2" />
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in 3 Simple Steps
            </h2>
          </div>

          {/* Visual Process Flow with Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <img
                src={interct}
                alt="Students Discussing"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                onClick={() => window.open(interct, "_blank")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 via-orange-900/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  Connect with Alumni
                </h3>
                <p className="text-orange-100">
                  Build meaningful connections with civil engineering
                  professionals
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <img
                src={awardis}
                alt="Alumni Student Interaction"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                onClick={() => window.open(awardis, "_blank")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  Learn & Grow
                </h3>
                <p className="text-blue-100">
                  Gain insights from experienced professionals in the industry
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description:
                  "Sign up with your BIT Sindri credentials. Add your civil engineering specialization, projects, and career interests.",
                icon: <GraduationCap size={32} />,
              },
              {
                step: "02",
                title: "Connect & Network",
                description:
                  "Find alumni from your batch or working in your field of interest. Join domain-specific groups and discussions.",
                icon: <Users size={32} />,
              },
              {
                step: "03",
                title: "Grow Your Career",
                description:
                  "Access job opportunities, attend technical workshops, get mentorship, and contribute to the community.",
                icon: <TrendingUp size={32} />,
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <Card
                  variant="elevated"
                  className="p-8 bg-white dark:bg-gray-800 text-center hover:shadow-xl transition-all"
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 dark:from-orange-500 dark:to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="mt-8 mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      {React.cloneElement(step.icon, {
                        className: "text-orange-600 dark:text-orange-400",
                      })}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight size={24} className="text-orange-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Civil Engineering Technologies Showcase */}
      <section className="py-20 bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
        

        <div className="text-center mb-16">
          {/* Additional Images Showcase */}
          <div className="grid md:grid-cols-4 gap-4 mt-12 max-w-6xl mx-auto">
            <div
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer"
              onClick={() => window.open(two, "_blank")}
            >
              <img
                src={one}
                alt="Aesthetic Building"
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Aesthetic Design</p>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer"
              onClick={() => window.open(four, "_blank")}
            >
              <img
                src={four}
                alt="Beautiful Building"
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Modern Architecture</p>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer"
              onClick={() => window.open(one, "_blank")}
            >
              <img
                src={three}
                alt="Night View Building"
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Night Aesthetics</p>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer"
              onClick={() => window.open(three, "_blank")}
            >
              <img
                src={two}
                alt="Trendy Civil Engineering"
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Innovative Design</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden"
      >
        <AnimatedBackground variant="particles" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <Badge
              variant="success"
              className="mb-4 dark:bg-green-900 dark:text-green-300"
            >
              <Heart size={16} className="mr-2" />
              From Our Alumni Network
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real experiences from civil engineering professionals
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card
              variant="elevated"
              className="p-8 md:p-12 bg-white dark:bg-gray-800 relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 text-orange-200 dark:text-orange-900">
                <Quote size={80} />
              </div>

              <div className="relative z-10">
                <div className="mb-8">
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 dark:from-orange-500 dark:to-orange-700 rounded-full flex items-center justify-center">
                      <HardHat className="text-white" size={28} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {testimonials[currentTestimonial].role}
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        Batch of {testimonials[currentTestimonial].batch} •{" "}
                        {testimonials[currentTestimonial].company}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={prevTestimonial}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center space-x-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial
                          ? "bg-orange-600 dark:bg-orange-500 w-8"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-700 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 text-white transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Building2
            size={400}
            className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4"
          />
          <Hammer
            size={300}
            className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Build Your Future?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Join the Premier civil engineering alumni network from BIT Sindri.
              Connect, learn, and grow with fellow engineers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate("/signup")}
                className="bg-white text-sky-700 hover:bg-gray-100 font-semibold shadow-xl"
              >
                <GraduationCap size={20} className="mr-2" />
                Join Now
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-2 border-white text-white hover:bg-white hover:text-sky-700 font-semibold"
              >
                Already a Member? Login
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>Connect Forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>Distinguished Alumni</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>Active Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
