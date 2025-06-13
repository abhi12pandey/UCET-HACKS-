"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  Users,
  Code,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Calendar,
  MapPin,
  LinkIcon,
  Send,
  Shield,
  Clock,
  FileSpreadsheet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FormData {
  teamLeaderName: string
  email: string
  phone: string
  college: string
  department: string
  year: string
  teamName: string
  teamSize: string
  experience: string
  presentationLink: string
  motivation: string
  agreeToTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

interface RegistrationResponse {
  success: boolean
  message: string
  data?: any
  errors?: FormErrors
  verified?: boolean
}

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
      </svg>

      {/* Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.8} duration={8 + i * 0.5} />
      ))}
    </div>
  )
}

export default function RegisterV2Page() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [registrationData, setRegistrationData] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    teamLeaderName: "",
    email: "",
    phone: "",
    college: "UCET VBU",
    department: "",
    year: "",
    teamName: "",
    teamSize: "3",
    experience: "",
    presentationLink: "",
    motivation: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const totalSteps = 3

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required"
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePhone = (phone: string): string => {
    if (!phone) return "Phone number is required"
    if (!/^\d{10}$/.test(phone)) return "Phone number must be exactly 10 digits"
    return ""
  }

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value.trim()) return `${fieldName} is required`
    return ""
  }

  const validateUrl = (url: string): string => {
    if (!url) return ""
    try {
      new URL(url)
      return ""
    } catch (e) {
      return "Please enter a valid URL"
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      newErrors.teamLeaderName = validateRequired(formData.teamLeaderName, "Team leader name")
      newErrors.email = validateEmail(formData.email)
      newErrors.phone = validatePhone(formData.phone)
      newErrors.department = validateRequired(formData.department, "Department")
      newErrors.year = validateRequired(formData.year, "Year of study")
    } else if (step === 2) {
      newErrors.teamName = validateRequired(formData.teamName, "Team name")
      newErrors.experience = validateRequired(formData.experience, "Experience level")
      newErrors.presentationLink = validateUrl(formData.presentationLink)
    } else if (step === 3) {
      newErrors.motivation = validateRequired(formData.motivation, "Motivation")
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions"
      }
    }

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, value]) => value !== ""))
    setErrors(filteredErrors)

    return Object.keys(filteredErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null)
    }
  }

  const handlePhoneChange = (value: string) => {
    // Only allow digits and limit to 10 characters
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
    handleInputChange("phone", digitsOnly)
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    setApiError(null)

    try {
      const response = await fetch("/api/register-v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result: RegistrationResponse = await response.json()

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors)
        }
        throw new Error(result.message || "Registration failed")
      }

      if (result.success) {
        setRegistrationData(result.data)
        setIsSuccess(true)
      } else {
        setApiError(result.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setApiError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (isSuccess) {
    return (
      <div
        className={cn(
          "min-h-screen transition-colors duration-500 relative overflow-hidden flex items-center justify-center",
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"
            : "bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100",
        )}
      >
        <AnimatedBackground />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10 max-w-2xl mx-auto px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent",
              isDark
                ? "bg-gradient-to-r from-green-400 to-emerald-400"
                : "bg-gradient-to-r from-green-600 to-emerald-600",
            )}
          >
            Registration Successful & Verified!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl mb-8 text-white px-4"
          >
            Welcome to UCET Hacks 2025, <span className="font-semibold">{formData.teamLeaderName}</span>!
            <br />
            Your team "<span className="font-semibold">{formData.teamName}</span>" has been registered and verified
            successfully.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <div
              className={cn(
                "p-4 md:p-6 rounded-lg border backdrop-blur-sm",
                isDark ? "bg-gray-800/70 border-gray-600" : "bg-white/70 border-gray-300",
              )}
            >
              <h3 className={cn("text-base md:text-lg font-semibold mb-4", isDark ? "text-white" : "text-gray-800")}>
                📧 Verification Email Sent
              </h3>
              <p className={cn("text-sm md:text-base", isDark ? "text-gray-200" : "text-gray-700")}>
                A detailed verification email with event information and motivational quote has been sent to{" "}
                <span className="font-medium">{formData.email}</span> from callmepandey03@gmail.com
              </p>
            </div>

            <div
              className={cn(
                "p-4 md:p-6 rounded-lg border backdrop-blur-sm",
                isDark ? "bg-green-900/30 border-green-600" : "bg-green-50/70 border-green-300",
              )}
            >
              <h3 className={cn("text-base md:text-lg font-semibold mb-4", isDark ? "text-white" : "text-gray-800")}>
                📊 Data Stored in Google Sheets
              </h3>
              <p className={cn("text-sm md:text-base", isDark ? "text-gray-200" : "text-gray-700")}>
                Your registration data has been securely stored in Google Sheets for easy management and access.
              </p>
            </div>

            <div
              className={cn(
                "p-4 md:p-6 rounded-lg border backdrop-blur-sm",
                isDark ? "bg-blue-900/30 border-blue-600" : "bg-blue-50/70 border-blue-300",
              )}
            >
              <h3 className={cn("text-base md:text-lg font-semibold mb-4", isDark ? "text-white" : "text-gray-800")}>
                📅 Mark Your Calendar
              </h3>
              <div className="flex items-center justify-center space-x-2 text-xl md:text-2xl font-bold text-blue-500">
                <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                <span>July 4th, 2025</span>
              </div>
            </div>

            <Link href="/">
              <Button
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    )
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
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3">
              <motion.div
                className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Code className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </motion.div>
              <h1
                className={cn(
                  "text-lg md:text-2xl font-bold bg-clip-text text-transparent",
                  isDark
                    ? "bg-gradient-to-r from-blue-400 to-purple-400"
                    : "bg-gradient-to-r from-blue-600 to-purple-600",
                )}
              >
                UCET Hacks 2025
              </h1>
            </Link>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-xs md:text-sm">
                <FileSpreadsheet
                  className={cn("w-3 h-3 md:w-4 md:h-4", isDark ? "text-green-400" : "text-green-600")}
                />
                <span className={cn("font-medium text-white", isDark ? "text-green-400" : "text-green-600")}>
                  Google Sheets
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-xs md:text-sm">
                <Send className={cn("w-3 h-3 md:w-4 md:h-4", isDark ? "text-blue-400" : "text-blue-600")} />
                <span className={cn("font-medium text-white", isDark ? "text-blue-400" : "text-blue-600")}>
                  Email Verified
                </span>
              </div>
              <ThemeToggle />
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-2 text-xs md:text-sm px-2 md:px-4",
                    isDark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-800 hover:bg-gray-100",
                  )}
                >
                  <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-24 md:pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 border border-white/20 mb-4 md:mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
              <span className="text-xs md:text-sm text-white">Google Sheets + Email Verification</span>
            </motion.div>

            <h1
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent",
                isDark
                  ? "bg-gradient-to-r from-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-blue-600 to-purple-600",
              )}
            >
              Join UCET Hacks 2025
            </h1>
            <p className="text-base md:text-xl max-w-2xl mx-auto text-white px-4">
              Register your team for the most exciting hackathon at UCET VBU
            </p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6 md:mt-8"
            >
              {[
                {
                  icon: <FileSpreadsheet className="w-3 h-3 md:w-4 md:h-4" />,
                  text: "Google Sheets",
                  color: "text-green-500",
                },
                { icon: <Send className="w-3 h-3 md:w-4 md:h-4" />, text: "Email Verified", color: "text-blue-500" },
                { icon: <Shield className="w-3 h-3 md:w-4 md:h-4" />, text: "Validated", color: "text-purple-500" },
                { icon: <Clock className="w-3 h-3 md:w-4 md:h-4" />, text: "Real-time", color: "text-orange-500" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1 md:py-2 rounded-full border backdrop-blur-sm",
                    isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200",
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={feature.color}>{feature.icon}</span>
                  <span className={cn("text-xs md:text-sm", isDark ? "text-gray-300" : "text-gray-700")}>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* API Error Alert */}
          {apiError && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Error</AlertTitle>
                <AlertDescription className="text-sm">{apiError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-4">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNumber = index + 1
                const isActive = stepNumber === currentStep
                const isCompleted = stepNumber < currentStep

                return (
                  <div key={stepNumber} className="flex items-center">
                    <motion.div
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-sm md:text-base",
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110"
                          : isCompleted
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : isDark
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-200 text-gray-500",
                      )}
                      whileHover={{ scale: 1.1 }}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : stepNumber}
                    </motion.div>
                    {index < totalSteps - 1 && (
                      <div
                        className={cn(
                          "w-8 md:w-16 h-1 mx-1 md:mx-2 transition-all duration-300",
                          stepNumber < currentStep
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : isDark
                              ? "bg-gray-700"
                              : "bg-gray-200",
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="text-center">
              <span className={cn("text-xs md:text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card
              className={cn(
                "border backdrop-blur-sm relative overflow-hidden",
                isDark
                  ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700"
                  : "bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-200",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />

              <CardHeader className="relative z-10 pb-4 md:pb-6">
                <CardTitle className={cn("text-lg md:text-2xl text-center", isDark ? "text-white" : "text-gray-800")}>
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Team Details"}
                  {currentStep === 3 && "Final Details"}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 px-4 md:px-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4 md:space-y-6"
                      >
                        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 md:gap-6">
                          <div>
                            <Label
                              htmlFor="teamLeaderName"
                              className={cn(
                                "text-sm md:text-base flex items-center",
                                isDark ? "text-gray-300" : "text-gray-700",
                              )}
                            >
                              <User className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                              Team Leader Name *
                            </Label>
                            <Input
                              id="teamLeaderName"
                              value={formData.teamLeaderName}
                              onChange={(e) => handleInputChange("teamLeaderName", e.target.value)}
                              className={cn(
                                "mt-2 h-10 md:h-12 text-sm md:text-base",
                                errors.teamLeaderName ? "border-red-500" : "",
                                isDark
                                  ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                  : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                              )}
                              placeholder="Enter your full name"
                            />
                            {errors.teamLeaderName && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                              >
                                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {errors.teamLeaderName}
                              </motion.p>
                            )}
                          </div>

                          <div>
                            <Label
                              htmlFor="email"
                              className={cn(
                                "text-sm md:text-base flex items-center",
                                isDark ? "text-gray-300" : "text-gray-700",
                              )}
                            >
                              <Mail className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                              Email Address *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className={cn(
                                "mt-2 h-10 md:h-12 text-sm md:text-base",
                                errors.email ? "border-red-500" : "",
                                isDark
                                  ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                  : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                              )}
                              placeholder="your.email@ucet.ac.in"
                            />
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                              >
                                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {errors.email}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 md:gap-6">
                          <div>
                            <Label
                              htmlFor="phone"
                              className={cn(
                                "text-sm md:text-base flex items-center",
                                isDark ? "text-gray-300" : "text-gray-700",
                              )}
                            >
                              <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                              Phone Number *
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              className={cn(
                                "mt-2 h-10 md:h-12 text-sm md:text-base",
                                errors.phone ? "border-red-500" : "",
                                isDark
                                  ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                  : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                              )}
                              placeholder="9876543210"
                              maxLength={10}
                            />
                            <p className={cn("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                              {formData.phone.length}/10 digits
                            </p>
                            {errors.phone && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                              >
                                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {errors.phone}
                              </motion.p>
                            )}
                          </div>

                          <div>
                            <Label
                              htmlFor="college"
                              className={cn(
                                "text-sm md:text-base flex items-center",
                                isDark ? "text-gray-300" : "text-gray-700",
                              )}
                            >
                              <GraduationCap className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                              College
                            </Label>
                            <Input
                              id="college"
                              value={formData.college}
                              onChange={(e) => handleInputChange("college", e.target.value)}
                              className={cn(
                                "mt-2 h-10 md:h-12 text-sm md:text-base",
                                isDark
                                  ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                  : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                              )}
                              placeholder="UCET VBU"
                            />
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 md:gap-6">
                          <div>
                            <Label
                              htmlFor="department"
                              className={cn("text-sm md:text-base", isDark ? "text-gray-300" : "text-gray-700")}
                            >
                              Department *
                            </Label>
                            <select
                              id="department"
                              value={formData.department}
                              onChange={(e) => handleInputChange("department", e.target.value)}
                              className={cn(
                                "mt-2 h-10 md:h-12 w-full rounded-md border px-3 py-2 text-xs md:text-sm",
                                errors.department ? "border-red-500" : "",
                                isDark
                                  ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                  : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                              )}
                            >
                              <option value="">Select Department</option>
                              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                              <option value="Information Technology">Information Technology</option>
                              <option value="Electronics & Communication">Electronics & Communication</option>
                              <option value="Electrical Engineering">Electrical Engineering</option>
                              <option value="Mechanical Engineering">Mechanical Engineering</option>
                              <option value="Civil Engineering">Civil Engineering</option>
                            </select>
                            {errors.department && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                              >
                                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {errors.department}
                              </motion.p>
                            )}
                          </div>

                          <div>
                            <Label
                              htmlFor="year"
                              className={cn("text-sm md:text-base", isDark ? "text-gray-300" : "text-gray-700")}
                            >
                              Year of Study *
                            </Label>
                            <select
                              id="year"
                              value={formData.year}
                              onChange={(e) => handleInputChange("year", e.target.value)}
                              className={cn(
                                "mt-2 h-10 md:h-12 w-full rounded-md border px-3 py-2 text-xs md:text-sm",
                                errors.year ? "border-red-500" : "",
                                isDark
                                  ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                  : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                              )}
                            >
                              <option value="">Select Year</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                            </select>
                            {errors.year && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                              >
                                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {errors.year}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Step 2: Team Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4 md:space-y-6"
                      >
                        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 md:gap-6">
                          <div>
                            <Label
                              htmlFor="teamName"
                              className={cn(
                                "text-sm md:text-base flex items-center",
                                isDark ? "text-gray-300" : "text-gray-700",
                              )}
                            >
                              <Users className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                              Team Name *
                            </Label>
                            <Input
                              id="teamName"
                              value={formData.teamName}
                              onChange={(e) => handleInputChange("teamName", e.target.value)}
                              className={cn(
                                "mt-2 h-10 md:h-12 text-sm md:text-base",
                                errors.teamName ? "border-red-500" : "",
                                isDark
                                  ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                  : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                              )}
                              placeholder="Enter your team name"
                            />
                            {errors.teamName && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                              >
                                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                {errors.teamName}
                              </motion.p>
                            )}
                          </div>

                          <div>
                            <Label
                              htmlFor="teamSize"
                              className={cn("text-sm md:text-base", isDark ? "text-gray-300" : "text-gray-700")}
                            >
                              Team Size
                            </Label>
                            <select
                              id="teamSize"
                              value={formData.teamSize}
                              onChange={(e) => handleInputChange("teamSize", e.target.value)}
                              className={cn(
                                "mt-2 h-10 md:h-12 w-full rounded-md border px-3 py-2 text-xs md:text-sm",
                                isDark
                                  ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                  : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                              )}
                            >
                              <option value="3">3 members</option>
                              <option value="4">4 members</option>
                              <option value="5">5 members</option>
                              <option value="6">6 members</option>
                            </select>
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Label
                            htmlFor="experience"
                            className={cn("text-sm md:text-base", isDark ? "text-gray-300" : "text-gray-700")}
                          >
                            Experience Level *
                          </Label>
                          <select
                            id="experience"
                            value={formData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                            className={cn(
                              "mt-2 h-10 md:h-12 w-full rounded-md border px-3 py-2 text-xs md:text-sm",
                              errors.experience ? "border-red-500" : "",
                              isDark
                                ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                            )}
                          >
                            <option value="">Select Experience Level</option>
                            <option value="Beginner">Beginner (0-1 years)</option>
                            <option value="Intermediate">Intermediate (1-3 years)</option>
                            <option value="Advanced">Advanced (3+ years)</option>
                          </select>
                          {errors.experience && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                            >
                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {errors.experience}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <Label
                            htmlFor="presentationLink"
                            className={cn(
                              "text-sm md:text-base flex items-center",
                              isDark ? "text-gray-300" : "text-gray-700",
                            )}
                          >
                            <LinkIcon className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            Presentation Link (Optional)
                          </Label>
                          <Input
                            id="presentationLink"
                            value={formData.presentationLink}
                            onChange={(e) => handleInputChange("presentationLink", e.target.value)}
                            className={cn(
                              "mt-2 h-10 md:h-12 text-sm md:text-base",
                              errors.presentationLink ? "border-red-500" : "",
                              isDark
                                ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                            )}
                            placeholder="https://docs.google.com/presentation/d/..."
                          />
                          <p className={cn("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                            Share a link to your project idea presentation (optional)
                          </p>
                          {errors.presentationLink && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                            >
                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {errors.presentationLink}
                            </motion.p>
                          )}
                        </motion.div>

                        {/* Event Info Cards */}
                        <motion.div variants={itemVariants} className="grid gap-3 md:grid-cols-2 md:gap-4 mt-6 md:mt-8">
                          <div
                            className={cn(
                              "p-3 md:p-4 rounded-lg border",
                              isDark ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200",
                            )}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                              <h4
                                className={cn(
                                  "font-semibold text-sm md:text-base",
                                  isDark ? "text-white" : "text-gray-800",
                                )}
                              >
                                Event Date
                              </h4>
                            </div>
                            <p className="text-xs md:text-sm font-bold text-blue-500">July 4th, 2025</p>
                          </div>

                          <div
                            className={cn(
                              "p-3 md:p-4 rounded-lg border",
                              isDark ? "bg-purple-900/20 border-purple-700" : "bg-purple-50 border-purple-200",
                            )}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                              <h4
                                className={cn(
                                  "font-semibold text-sm md:text-base",
                                  isDark ? "text-white" : "text-gray-800",
                                )}
                              >
                                Duration
                              </h4>
                            </div>
                            <p className={cn("text-xs md:text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                              9 hours of innovation
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Step 3: Final Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4 md:space-y-6"
                      >
                        <motion.div variants={itemVariants}>
                          <Label
                            htmlFor="motivation"
                            className={cn("text-sm md:text-base", isDark ? "text-gray-300" : "text-gray-700")}
                          >
                            Why do you want to participate in UCET Hacks 2025? *
                          </Label>
                          <Textarea
                            id="motivation"
                            rows={4}
                            value={formData.motivation}
                            onChange={(e) => handleInputChange("motivation", e.target.value)}
                            className={cn(
                              "mt-2 text-sm md:text-base",
                              errors.motivation ? "border-red-500" : "",
                              isDark
                                ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                                : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                            )}
                            placeholder="Tell us about your motivation, what you hope to learn, and what you plan to build..."
                          />
                          {errors.motivation && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                            >
                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {errors.motivation}
                            </motion.p>
                          )}
                        </motion.div>

                        {/* Event Details */}
                        <motion.div variants={itemVariants} className="space-y-3 md:space-y-4">
                          <h4
                            className={cn(
                              "text-base md:text-lg font-semibold",
                              isDark ? "text-white" : "text-gray-800",
                            )}
                          >
                            Event Details
                          </h4>
                          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                            <div
                              className={cn(
                                "p-3 md:p-4 rounded-lg border",
                                isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200",
                              )}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                                <span
                                  className={cn(
                                    "font-medium text-sm md:text-base",
                                    isDark ? "text-white" : "text-gray-800",
                                  )}
                                >
                                  Venue
                                </span>
                              </div>
                              <p className={cn("text-xs md:text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                                UCET VBU Campus, Hazaribagh, Jharkhand
                              </p>
                            </div>

                            <div
                              className={cn(
                                "p-3 md:p-4 rounded-lg border",
                                isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200",
                              )}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                                <span
                                  className={cn(
                                    "font-medium text-sm md:text-base",
                                    isDark ? "text-white" : "text-gray-800",
                                  )}
                                >
                                  Date
                                </span>
                              </div>
                              <p className="text-xs md:text-sm font-bold text-purple-500">July 4th, 2025</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Terms and Conditions */}
                        <motion.div variants={itemVariants}>
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="agreeToTerms"
                              checked={formData.agreeToTerms}
                              onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <Label
                              htmlFor="agreeToTerms"
                              className={cn("text-xs md:text-sm", isDark ? "text-gray-300" : "text-gray-700")}
                            >
                              I agree to the{" "}
                              <a href="#" className="text-blue-500 hover:underline">
                                terms and conditions
                              </a>{" "}
                              and{" "}
                              <a href="#" className="text-blue-500 hover:underline">
                                privacy policy
                              </a>
                              . I understand that all team members must be current students of UCET VBU. *
                            </Label>
                          </div>
                          {errors.agreeToTerms && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs md:text-sm mt-1 flex items-center"
                            >
                              <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {errors.agreeToTerms}
                            </motion.p>
                          )}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <motion.div
                  className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={cn(
                      "px-4 md:px-6 py-2 md:py-3 text-sm md:text-base",
                      isDark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50",
                    )}
                  >
                    <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={handleNext}
                      className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                    >
                      Next
                      <motion.div
                        className="ml-1 md:ml-2"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                      </motion.div>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                    >
                      {isSubmitting ? (
                        <motion.div className="flex items-center">
                          <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                          Registering...
                        </motion.div>
                      ) : (
                        <>
                          Complete Registration
                          <CheckCircle className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
