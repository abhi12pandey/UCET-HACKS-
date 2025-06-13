"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Mail, Send, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TestEmailPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const sendTestEmail = async () => {
    if (!email) return

    setIsSending(true)
    setResult(null)

    try {
      const testData = {
        teamLeaderName: "John Doe",
        teamName: "Code Warriors",
        email: email,
        phone: "9876543210",
        college: "UCET VBU",
        department: "Computer Science",
        year: "3rd Year",
        teamSize: "4",
        experience: "Intermediate",
        presentationLink: "https://docs.google.com/presentation/d/example",
        motivation: "We want to build innovative solutions that can make a real impact on society.",
        agreeToTerms: true,
      }

      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, testData }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to send test email",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500",
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100",
      )}
    >
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
            <div className="flex items-center space-x-3">
              <h1
                className={cn(
                  "text-2xl font-bold bg-clip-text text-transparent",
                  isDark
                    ? "bg-gradient-to-r from-blue-400 to-purple-400"
                    : "bg-gradient-to-r from-blue-600 to-purple-600",
                )}
              >
                Email Test
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/">
                <Button
                  variant="outline"
                  className={cn(
                    "border-2",
                    isDark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-800 hover:bg-gray-100",
                  )}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent",
                isDark
                  ? "bg-gradient-to-r from-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-blue-600 to-purple-600",
              )}
            >
              Test Email System
            </h1>
            <p className={cn("text-xl", isDark ? "text-gray-300" : "text-gray-700")}>
              Send a test registration confirmation email to verify your email configuration
            </p>
          </motion.div>

          {/* Result Alert */}
          {result && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Test Form */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card
              className={cn(
                "border backdrop-blur-sm",
                isDark
                  ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700"
                  : "bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-200",
              )}
            >
              <CardHeader>
                <CardTitle className={cn("text-2xl text-center flex items-center justify-center space-x-2")}>
                  <Mail className="w-6 h-6 text-blue-500" />
                  <span className={isDark ? "text-white" : "text-gray-800"}>Send Test Email</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="email" className={cn("text-base", isDark ? "text-gray-300" : "text-gray-700")}>
                    Test Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "mt-2 h-12",
                      isDark
                        ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white/50 border-gray-300 text-gray-800 focus:border-blue-500",
                    )}
                    placeholder="your.email@example.com"
                  />
                  <p className={cn("text-sm mt-2", isDark ? "text-gray-400" : "text-gray-500")}>
                    Enter your email address to receive a test registration confirmation email with sample data.
                  </p>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200",
                  )}
                >
                  <h4 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-800")}>
                    Test Email Will Include:
                  </h4>
                  <ul className={cn("text-sm space-y-1", isDark ? "text-gray-300" : "text-gray-600")}>
                    <li>• Sample registration confirmation with test data</li>
                    <li>• Professional HTML email template</li>
                    <li>• Random motivational quote</li>
                    <li>• Event details for July 4th, 2025</li>
                    <li>• Complete branding and styling</li>
                  </ul>
                </div>

                <Button
                  onClick={sendTestEmail}
                  disabled={!email || isSending}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg font-semibold"
                >
                  {isSending ? (
                    <motion.div className="flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Test Email...
                    </motion.div>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Test Email
                    </>
                  )}
                </Button>

                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200",
                  )}
                >
                  <h4 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-800")}>
                    Troubleshooting:
                  </h4>
                  <ul className={cn("text-sm space-y-1", isDark ? "text-gray-300" : "text-gray-600")}>
                    <li>• Check your spam/junk folder if email doesn't arrive</li>
                    <li>• Verify EMAIL_USER and EMAIL_PASSWORD environment variables</li>
                    <li>• Ensure Gmail App Password is correctly configured</li>
                    <li>• Check server logs for detailed error messages</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
