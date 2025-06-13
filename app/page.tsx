"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Menu,
  X,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Lightbulb,
  Code,
  Rocket,
  Heart,
  Zap,
  BookOpen,
  Sparkles,
  MessageSquare,
  Send,
  Mail,
  Phone,
  Globe,
  Star,
  ArrowRight,
  Play,
  Clock,
  Award,
  Target,
  Cpu,
  Database,
  Smartphone,
  Palette,
  Brain,
  Shield,
  ChevronDown,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"

const quotes = [
  "Innovation distinguishes between a leader and a follower. – Steve Jobs",
  "The best way to predict the future is to invent it. – Alan Kay",
  "Hackathons: Where ideas turn into reality in 24 hours!",
  "Stay hungry, stay foolish. – Steve Jobs",
  "Code is like humor. When you have to explain it, it's bad. – Cory House",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
]

const themes = [
  {
    icon: <Heart className="w-6 h-6" />,
    emoji: "🏥",
    title: "Health Sector & Wellness",
    description:
      "Innovative solutions to improve healthcare delivery, mental health support, fitness tracking, medical diagnostics, and overall wellness.",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-red-500/10 to-pink-500/10",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    emoji: "⚡",
    title: "Smart Energy & Sustainability",
    description:
      "Technologies for energy efficiency, renewable energy, waste reduction, sustainable living, smart grids, and reducing carbon footprints.",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-500/10 to-orange-500/10",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    emoji: "🌾",
    title: "Smart Agriculture & Food Technology",
    description:
      "IoT, data analytics, automation in agriculture to boost crop yield, reduce waste, enhance supply chain transparency, and ensure food safety.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    emoji: "📚",
    title: "Education & Skill Development",
    description:
      "Tools and platforms for e-learning, virtual classrooms, personalized learning, and educational access in underserved communities.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    emoji: "🚀",
    title: "Miscellaneous Innovation & Emerging Technologies",
    description:
      "Creative, technically sound ideas in blockchain, AR, robotics, digital art, or other frontier technologies.",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-violet-500/10",
  },
]

const faqs = [
  {
    question: "Who can participate in UCET Hacks 2025?",
    answer:
      "Current students of UCET VBU are eligible to participate. Teams should consist of 3 to 6 members, and inter-departmental teams are encouraged.",
  },
  {
    question: "How long is the hackathon?",
    answer: "The hackathon runs for 9 hours, during which teams must build and deploy their projects.",
  },
  {
    question: "What technologies can we use?",
    answer:
      "You can use any technology stack of your choice. Platforms like GitHub, Vercel, and Firebase are recommended for deployment.",
  },
  {
    question: "How will projects be evaluated?",
    answer:
      "Projects will be judged based on innovation & creativity (25%), technical complexity (20%), functionality (20%), deployment & usability (15%), and presentation & demo (20%).",
  },
  {
    question: "Can I join without a team?",
    answer:
      "Yes, we'll have a team formation session before the hackathon starts to help solo participants find teammates.",
  },
  {
    question: "Will there be prizes?",
    answer:
      "Yes, there will be exciting prizes for the winning teams across different categories. Details will be announced closer to the event.",
  },
  {
    question: "Is there any registration fee?",
    answer: "No, participation in UCET Hacks 2025 is completely free for all eligible students.",
  },
  {
    question: "Will food and refreshments be provided?",
    answer: "Yes, we'll provide meals, snacks, and beverages throughout the event to keep you energized.",
  },
]

const stats = [
  {
    number: "500+",
    label: "Expected Participants",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "9",
    label: "Hours of Innovation",
    icon: <Clock className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "5",
    label: "Theme Categories",
    icon: <Lightbulb className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
  },
  {
    number: "T.B.A",
    label: "Prize Pool",
    icon: <Trophy className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
  },
]

const techStack = [
  { name: "React", icon: <Code className="w-8 h-8" />, color: "text-blue-500" },
  { name: "Node.js", icon: <Cpu className="w-8 h-8" />, color: "text-green-500" },
  { name: "Python", icon: <Brain className="w-8 h-8" />, color: "text-yellow-500" },
  { name: "MongoDB", icon: <Database className="w-8 h-8" />, color: "text-green-600" },
  { name: "Flutter", icon: <Smartphone className="w-8 h-8" />, color: "text-blue-400" },
  { name: "UI/UX", icon: <Palette className="w-8 h-8" />, color: "text-purple-500" },
  { name: "AI/ML", icon: <Brain className="w-8 h-8" />, color: "text-red-500" },
  { name: "Blockchain", icon: <Shield className="w-8 h-8" />, color: "text-orange-500" },
]

// Floating particle component
function FloatingParticle({ delay = 0, duration = 10 }: { delay?: number; duration?: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
      initial={{ x: -10, y: 0, opacity: 0 }}
      animate={{
        x: [0, 100, 200, 300, 400, 500],
        y: [0, -50, 100, -100, 50, 0],
        opacity: [0, 1, 0.5, 1, 0.3, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  )
}

// Animated background component
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="200"
          cy="200"
          r="100"
          fill="url(#grad1)"
          animate={{
            cx: [200, 800, 200],
            cy: [200, 600, 200],
            r: [100, 150, 100],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.circle
          cx="800"
          cy="300"
          r="150"
          fill="url(#grad2)"
          animate={{
            cx: [800, 200, 800],
            cy: [300, 700, 300],
            r: [150, 100, 150],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.circle
          cx="500"
          cy="800"
          r="80"
          fill="url(#grad1)"
          animate={{
            cx: [500, 100, 900, 500],
            cy: [800, 200, 600, 800],
            r: [80, 120, 80, 80],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </svg>

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.8} duration={8 + i * 0.5} />
      ))}
    </div>
  )
}

// Video background component
function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if autoplay fails
      })
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Animated CSS background as video fallback */}
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-pulse">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
        </div>
      </motion.div>
    </div>
  )
}

export default function UCETHacks() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#themes", label: "Themes" },
    { href: "#sponsors", label: "Sponsors" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ]

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500 relative overflow-hidden",
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100",
      )}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <motion.nav
        className={cn(
          "fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300",
          isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-black/10",
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Code className="w-6 h-6 text-white" />
              </motion.div>
              <h1
                className={cn(
                  "text-2xl font-bold bg-clip-text text-transparent",
                  isDark
                    ? "bg-gradient-to-r from-blue-400 to-purple-400"
                    : "bg-gradient-to-r from-blue-600 to-purple-600",
                )}
              >
                UCET Hacks 2025
              </h1>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors relative group",
                    isDark ? "text-white hover:text-blue-400" : "text-gray-800 hover:text-blue-600",
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {item.label}
                  <motion.div
                    className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300",
                      isDark
                        ? "bg-gradient-to-r from-blue-400 to-purple-400"
                        : "bg-gradient-to-r from-blue-600 to-purple-600",
                    )}
                  />
                </motion.a>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <motion.button
                className={isDark ? "text-white" : "text-gray-800"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="md:hidden mt-4 space-y-4 pb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block transition-colors py-2",
                      isDark ? "text-white hover:text-blue-400" : "text-gray-800 hover:text-blue-600",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section with Video Background */}
      <section
        id="home"
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 text-center overflow-hidden min-h-screen flex items-center"
      >
        <VideoBackground />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="container mx-auto relative z-20"
        >
          {/* Announcement Badge */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Star className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <span className="text-white font-medium">Registration Opens Soon</span>
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isHeroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              UCET
            </motion.span>
            <br />
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400"
              animate={{
                backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              HACKS
            </motion.span>
            <br />
            <motion.span
              className="text-4xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              2025
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={cn(
              "text-xl md:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto font-light",
              isDark ? "text-gray-200" : "text-white drop-shadow-lg",
            )}
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            The Genesis of Innovation – A Hackathon Organised by{" "}
            <span
              className={cn(
                "font-semibold bg-clip-text text-transparent",
                isDark
                  ? "bg-gradient-to-r from-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-blue-300 to-purple-300 drop-shadow-sm",
              )}
            >
              UCET VBU
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/register-v2">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  <span className="flex items-center">
                    Register Now
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "px-8 py-6 text-lg rounded-full border-2 backdrop-blur-sm transition-all duration-300",
                  isDark
                    ? "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                    : "border-gray-800/30 text-gray-800 hover:bg-gray-800/10 hover:border-gray-800/50 bg-white/20",
                )}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Promo
              </Button>
            </motion.div>
          </motion.div>

          {/* Tech Stack Icons */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {techStack.slice(0, 6).map((tech, index) => (
              <motion.div
                key={tech.name}
                className="flex flex-col items-center space-y-2 group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div
                  className={cn(
                    "p-3 rounded-xl backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300",
                    tech.color,
                  )}
                >
                  {tech.icon}
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{tech.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 text-blue-400"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <Code size={40} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-10 text-purple-400"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <Lightbulb size={35} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-20 text-pink-400"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <Rocket size={30} />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-20 text-yellow-400"
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <Trophy size={32} />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={item} className="text-center" whileHover={{ scale: 1.05, y: -5 }}>
                <Card
                  className={cn(
                    "border backdrop-blur-sm relative overflow-hidden group",
                    isDark
                      ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700"
                      : "bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-200",
                  )}
                >
                  <motion.div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r ${stat.color}`}
                  />
                  <CardContent className="pt-6 text-center relative z-10">
                    <motion.div
                      className={`mb-4 mx-auto w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}
                      whileHover={{ rotate: 360 }}
                      transition={{
                        duration: 0.5,
                      }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      className={cn("text-3xl md:text-4xl font-bold mb-2", isDark ? "text-white" : "text-gray-800")}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-600")}>
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className={cn("py-16 px-4 backdrop-blur-sm relative", isDark ? "bg-black/20" : "bg-white/20")}>
        <div className="container mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                className="text-6xl mb-4 opacity-20"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              >
                "
              </motion.div>
              <p
                className={cn(
                  "text-xl md:text-2xl lg:text-3xl italic font-light leading-relaxed",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                {quotes[currentQuote]}
              </p>
              <motion.div
                className="mt-6 flex justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {quotes.map((_, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentQuote
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 w-8"
                        : isDark
                          ? "bg-gray-600"
                          : "bg-gray-400",
                    )}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent",
              isDark ? "bg-gradient-to-r from-blue-400 to-purple-400" : "bg-gradient-to-r from-blue-600 to-purple-600",
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Event Information
          </motion.h2>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Eligibility",
                icon: <Users className="w-8 h-8" />,
                content: [
                  "Current students of UCET VBU",
                  "Team size: 3 to 6 members",
                  "Inter-departmental teams encouraged",
                  "All members must contribute",
                ],
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Rules",
                icon: <Trophy className="w-8 h-8" />,
                content: [
                  "Build and deploy within 9 hours",
                  "Use platforms like GitHub, Vercel, Firebase",
                  "Project must be functional and creative",
                  "Judged on innovation, tech, usability",
                ],
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Evaluation Criteria",
                icon: <Award className="w-8 h-8" />,
                content: [
                  "Innovation & Creativity – 25%",
                  "Technical Complexity – 20%",
                  "Functionality – 20%",
                  "Deployment & Usability – 15%",
                  "Presentation & Demo – 20%",
                ],
                color: "from-green-500 to-emerald-500",
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                variants={item}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="group"
              >
                <Card
                  className={cn(
                    "border backdrop-blur-sm h-full relative overflow-hidden",
                    isDark
                      ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700"
                      : "bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-200",
                  )}
                >
                  <motion.div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r ${card.color}`}
                  />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {card.icon}
                      </motion.div>
                      <CardTitle className={isDark ? "text-white" : "text-gray-800"}>{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-3">
                      {card.content.map((item, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <motion.span
                            className={`mr-3 mt-1 w-2 h-2 rounded-full bg-gradient-to-r ${card.color} flex-shrink-0`}
                            whileHover={{ scale: 1.5 }}
                          />
                          <span className={isDark ? "text-gray-300" : "text-gray-700"}>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="themes" className={cn("py-20 px-4", isDark ? "bg-black/20" : "bg-white/20")}>
        <div className="container mx-auto">
          <motion.h2
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent",
              isDark ? "bg-gradient-to-r from-purple-400 to-pink-400" : "bg-gradient-to-r from-purple-600 to-pink-600",
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Themes & Guidelines
          </motion.h2>

          <div className="space-y-8 max-w-6xl mx-auto">
            {themes.map((theme, index) => (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="group"
              >
                <Card
                  className={cn(
                    "border backdrop-blur-sm overflow-hidden relative",
                    isDark
                      ? "bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-gray-700"
                      : "bg-gradient-to-r from-white/90 to-gray-50/90 border-gray-300",
                  )}
                >
                  <motion.div
                    className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${theme.bgColor}`}
                  />
                  <div className="relative p-4 md:p-6 lg:p-8">
                    <CardHeader className="pb-4 px-0">
                      <CardTitle
                        className={cn(
                          "flex flex-col items-center text-center space-y-4 md:flex-row md:items-center md:text-left md:space-y-0 md:space-x-4 text-lg md:text-xl lg:text-2xl",
                          isDark ? "text-white" : "text-gray-900",
                        )}
                      >
                        <motion.div className="flex items-center justify-center space-x-3" whileHover={{ scale: 1.05 }}>
                          <motion.span
                            className="text-3xl md:text-4xl lg:text-5xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {theme.emoji}
                          </motion.span>
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.color} text-white shadow-lg`}>
                            {theme.icon}
                          </div>
                        </motion.div>
                        <span className="flex-1 font-semibold leading-tight">{theme.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                      <p
                        className={cn(
                          "text-sm md:text-base lg:text-lg leading-relaxed text-center md:text-left",
                          isDark ? "text-gray-200" : "text-gray-800",
                        )}
                      >
                        {theme.description}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent",
              isDark ? "bg-gradient-to-r from-blue-400 to-purple-400" : "bg-gradient-to-r from-blue-600 to-purple-600",
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Partner With Us
          </motion.h2>

          <motion.div
            className="max-w-5xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className={cn("text-lg md:text-xl leading-relaxed", isDark ? "text-gray-300" : "text-gray-700")}>
              Join us in fostering innovation and supporting the next generation of tech talent. By sponsoring UCET
              Hacks 2025, you'll gain visibility among bright young minds, showcase your brand, and contribute to the
              growth of the tech ecosystem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Benefits Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card
                className={cn(
                  "border backdrop-blur-sm overflow-hidden h-full",
                  isDark
                    ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700"
                    : "bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-2xl flex items-center", isDark ? "text-white" : "text-gray-800")}>
                    <Target className="mr-3 w-6 h-6 text-blue-500" />
                    Sponsorship Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      "Brand visibility throughout the event",
                      "Direct engagement with talented students",
                      "Opportunity to present challenges",
                      "Recognition as innovation supporter",
                      "Networking with academic leaders",
                      "Access to innovative project demos",
                    ].map((benefit, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-2 mr-3 flex-shrink-0"
                          whileHover={{ scale: 1.5 }}
                        />
                        <span className={isDark ? "text-gray-300" : "text-gray-700"}>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tiers Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card
                className={cn(
                  "border backdrop-blur-sm overflow-hidden h-full",
                  isDark
                    ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700"
                    : "bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-2xl flex items-center", isDark ? "text-white" : "text-gray-800")}>
                    <Trophy className="mr-3 w-6 h-6 text-yellow-500" />
                    Sponsorship Tiers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { tier: "Platinum", amount: "₹50,000+", color: "from-gray-400 to-gray-600", icon: "💎" },
                      { tier: "Gold", amount: "₹25,000+", color: "from-yellow-400 to-yellow-600", icon: "🥇" },
                      { tier: "Silver", amount: "₹15,000+", color: "from-gray-300 to-gray-500", icon: "🥈" },
                      { tier: "Bronze", amount: "₹10,000+", color: "from-orange-400 to-orange-600", icon: "🥉" },
                    ].map((tier, index) => (
                      <motion.div
                        key={tier.tier}
                        className={`p-4 rounded-xl bg-gradient-to-r ${tier.color} text-white relative overflow-hidden`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{tier.icon}</span>
                            <span className="font-semibold text-lg">{tier.tier}</span>
                          </div>
                          <span className="font-bold text-xl">{tier.amount}</span>
                        </div>
                        <motion.div
                          className="absolute inset-0 bg-white/10"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Become a Sponsor
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={cn("py-20 px-4", isDark ? "bg-black/20" : "bg-white/20")}>
        <div className="container mx-auto">
          <motion.h2
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent",
              isDark ? "bg-gradient-to-r from-pink-400 to-purple-400" : "bg-gradient-to-r from-pink-600 to-purple-600",
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.div
            className="max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={item}>
                  <AccordionItem
                    value={`item-${index}`}
                    className={cn(
                      "border rounded-lg px-6 backdrop-blur-sm",
                      isDark ? "border-gray-700 bg-gray-900/50" : "border-gray-300 bg-white/50",
                    )}
                  >
                    <AccordionTrigger
                      className={cn(
                        "text-left hover:no-underline py-4 md:py-6 group",
                        isDark ? "text-white hover:text-blue-300" : "text-gray-900 hover:text-blue-700",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          {index + 1}
                        </motion.div>
                        <span className="font-semibold text-lg">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className={cn("pb-6 pl-11", isDark ? "text-gray-300" : "text-gray-800")}>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {faq.answer}
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent",
              isDark ? "bg-gradient-to-r from-green-400 to-blue-400" : "bg-gradient-to-r from-green-600 to-blue-600",
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Get In Touch
          </motion.h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className={cn("text-2xl md:text-3xl font-semibold mb-8", isDark ? "text-white" : "text-gray-800")}>
                Contact Information
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: <Mail className="w-6 h-6" />,
                    label: "Email",
                    value: "ucethacks2025@ucet.ac.in",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: <Phone className="w-6 h-6" />,
                    label: "Phone",
                    value: "+91 9876543210",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    label: "Address",
                    value: "UCET VBU, Hazaribagh, Jharkhand",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: <Globe className="w-6 h-6" />,
                    label: "Website",
                    value: "www.ucethacks2025.com",
                    color: "from-orange-500 to-red-500",
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={contact.label}
                    className="flex items-start space-x-4 group"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-r ${contact.color} text-white`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {contact.icon}
                    </motion.div>
                    <div>
                      <div className={cn("font-semibold text-lg", isDark ? "text-white" : "text-gray-800")}>
                        {contact.label}
                      </div>
                      <div className={cn("text-base", isDark ? "text-gray-300" : "text-gray-600")}>{contact.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-800")}>Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: <Twitter className="w-5 h-5" />, color: "from-blue-400 to-blue-600" },
                    { icon: <Linkedin className="w-5 h-5" />, color: "from-blue-600 to-blue-800" },
                    { icon: <Instagram className="w-5 h-5" />, color: "from-pink-500 to-purple-600" },
                    { icon: <Github className="w-5 h-5" />, color: "from-gray-600 to-gray-800" },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className={`p-3 rounded-xl bg-gradient-to-r ${social.color} text-white`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card
                className={cn(
                  "border backdrop-blur-sm",
                  isDark
                    ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700"
                    : "bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-200",
                )}
              >
                <CardHeader>
                  <CardTitle className={cn("text-2xl", isDark ? "text-white" : "text-gray-800")}>
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="name" className={cn("text-base", isDark ? "text-gray-300" : "text-gray-700")}>
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(
                          "mt-2 h-12",
                          isDark
                            ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                        )}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="email" className={cn("text-base", isDark ? "text-gray-300" : "text-gray-700")}>
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                          "mt-2 h-12",
                          isDark
                            ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                        )}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="subject" className={cn("text-base", isDark ? "text-gray-300" : "text-gray-700")}>
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={cn(
                          "mt-2 h-12",
                          isDark
                            ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                        )}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="message" className={cn("text-base", isDark ? "text-gray-300" : "text-gray-700")}>
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={cn(
                          "mt-2",
                          isDark
                            ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                        )}
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg font-semibold"
                      >
                        {isSubmitting ? (
                          <motion.div className="flex items-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Sending...
                          </motion.div>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={cn(
          "backdrop-blur-sm border-t py-16 px-4 relative overflow-hidden",
          isDark ? "bg-black/40 border-gray-800" : "bg-white/40 border-gray-200",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            {/* Logo and Title */}
            <motion.div className="flex items-center justify-center space-x-4" whileHover={{ scale: 1.05 }}>
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Code className="w-7 h-7 text-white" />
              </motion.div>
              <h3
                className={cn(
                  "text-2xl font-bold bg-clip-text text-transparent",
                  isDark
                    ? "bg-gradient-to-r from-blue-400 to-purple-400"
                    : "bg-gradient-to-r from-blue-600 to-purple-600",
                )}
              >
                UCET Hacks 2025
              </h3>
            </motion.div>

            {/* Event Details */}
            <div className="space-y-4">
              <motion.div className="flex items-center justify-center space-x-2" whileHover={{ scale: 1.05 }}>
                <MapPin className={isDark ? "w-5 h-5 text-blue-400" : "w-5 h-5 text-blue-600"} />
                <span className={cn("text-lg", isDark ? "text-gray-300" : "text-gray-700")}>
                  UCET VBU, Hazaribagh, Jharkhand
                </span>
              </motion.div>
              <motion.div className="flex items-center justify-center space-x-2" whileHover={{ scale: 1.05 }}>
                <Calendar className={isDark ? "w-5 h-5 text-purple-400" : "w-5 h-5 text-purple-600"} />
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Coming Soon - Stay Tuned!</span>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.div
              className="flex justify-center space-x-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                { name: "Twitter", icon: <Twitter className="w-5 h-5" />, color: "from-blue-400 to-blue-600" },
                { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, color: "from-blue-600 to-blue-800" },
                { name: "Instagram", icon: <Instagram className="w-5 h-5" />, color: "from-pink-500 to-purple-600" },
                { name: "GitHub", icon: <Github className="w-5 h-5" />, color: "from-gray-600 to-gray-800" },
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href="#"
                  variants={item}
                  className={`p-3 rounded-xl bg-gradient-to-r ${social.color} text-white transition-all duration-300 hover:shadow-lg`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div
              className={cn("w-full h-px", isDark ? "bg-gray-700" : "bg-gray-300")}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
            />

            {/* Copyright */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
                © 2025 UCET Hacks | All Rights Reserved
              </p>
              <p className={cn("text-xs", isDark ? "text-gray-600" : "text-gray-400")}>
                Made with ❤️ by UCET Students | Powered by Innovation
              </p>
            </motion.div>

            {/* Scroll to Top Button */}
            <motion.button
              className={cn(
                "fixed bottom-8 right-8 p-3 rounded-full shadow-lg backdrop-blur-sm border z-50",
                isDark
                  ? "bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800"
                  : "bg-white/80 border-gray-300 text-gray-800 hover:bg-gray-100",
              )}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <ChevronDown className="w-5 h-5 rotate-180" />
            </motion.button>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
