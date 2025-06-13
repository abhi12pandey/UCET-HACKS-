"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database, ExternalLink, Copy, CheckCircle, Settings, Mail, Key, Globe, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function AirtableSetupGuide() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const airtableFields = [
    { name: "Team Leader Name", type: "Single line text" },
    { name: "Email", type: "Email" },
    { name: "Phone", type: "Phone number" },
    { name: "College", type: "Single line text" },
    { name: "Department", type: "Single select" },
    { name: "Year of Study", type: "Single select" },
    { name: "Team Name", type: "Single line text" },
    { name: "Team Size", type: "Number" },
    { name: "Experience", type: "Single select" },
    { name: "Presentation Link", type: "URL" },
    { name: "Motivation", type: "Long text" },
    { name: "Registration Date", type: "Date and time" },
    { name: "Status", type: "Single select" },
  ]

  const envVariables = [
    {
      key: "AIRTABLE_BASE_ID",
      value: "your_airtable_base_id",
      description: "Found in your Airtable base URL",
    },
    {
      key: "AIRTABLE_TABLE_NAME",
      value: "Registrations",
      description: "Name of your table (default: Registrations)",
    },
    {
      key: "AIRTABLE_API_KEY",
      value: "your_airtable_api_key",
      description: "Personal access token from Airtable",
    },
    {
      key: "EMAIL_HOST",
      value: "smtp.gmail.com",
      description: "SMTP server hostname",
    },
    {
      key: "EMAIL_PORT",
      value: "587",
      description: "SMTP server port",
    },
    {
      key: "EMAIL_SECURE",
      value: "false",
      description: "Use SSL/TLS (true for port 465)",
    },
    {
      key: "EMAIL_USER",
      value: "your_email@gmail.com",
      description: "Your email address",
    },
    {
      key: "EMAIL_PASSWORD",
      value: "your_app_password",
      description: "App password (not regular password)",
    },
    {
      key: "EMAIL_FROM_NAME",
      value: "UCET Hacks 2025",
      description: "Display name for emails",
    },
    {
      key: "EMAIL_FROM_EMAIL",
      value: "noreply@ucethacks.com",
      description: "From email address (optional)",
    },
  ]

  return (
    <div className={cn("min-h-screen p-8", isDark ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className={cn("text-4xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>
            Registration System Setup Guide
          </h1>
          <p className={cn("text-lg", isDark ? "text-gray-300" : "text-gray-600")}>
            Configure Airtable and email settings for the hackathon registration system
          </p>
        </motion.div>

        {/* Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Alert>
            <Database className="h-4 w-4" />
            <AlertTitle>System Overview</AlertTitle>
            <AlertDescription>
              This registration system uses Airtable as a free database alternative to Google Sheets, with email
              notifications sent via SMTP. No Google APIs required!
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Step 1: Airtable Setup */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-500" />
                <span>Step 1: Airtable Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
                  1. Create Airtable Account
                </h3>
                <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                  Sign up for a free Airtable account at{" "}
                  <a
                    href="https://airtable.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center"
                  >
                    airtable.com <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
                  2. Create a New Base
                </h3>
                <ul className={cn("text-sm space-y-2", isDark ? "text-gray-300" : "text-gray-600")}>
                  <li>• Click "Create a base" from your workspace</li>
                  <li>• Choose "Start from scratch"</li>
                  <li>• Name your base "UCET Hacks 2025 Registrations"</li>
                  <li>• Rename the default table to "Registrations"</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
                  3. Configure Table Fields
                </h3>
                <p className={cn("text-sm mb-4", isDark ? "text-gray-300" : "text-gray-600")}>
                  Add these fields to your Registrations table:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {airtableFields.map((field, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded border",
                        isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200",
                      )}
                    >
                      <div className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>
                        {field.name}
                      </div>
                      <div className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{field.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
                  4. Get Base ID and API Key
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-600")}>
                      Base ID:
                    </p>
                    <ul className={cn("text-sm space-y-1", isDark ? "text-gray-300" : "text-gray-600")}>
                      <li>• Go to your base and look at the URL</li>
                      <li>• Copy the ID after "airtable.com/" (starts with "app")</li>
                      <li>• Example: appXXXXXXXXXXXXXX</li>
                    </ul>
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-600")}>
                      API Key:
                    </p>
                    <ul className={cn("text-sm space-y-1", isDark ? "text-gray-300" : "text-gray-600")}>
                      <li>• Go to Account → Developer Hub → Personal access tokens</li>
                      <li>• Create a new token with "data.records:write" scope</li>
                      <li>• Add your base to the token permissions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 2: Email Setup */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-green-500" />
                <span>Step 2: Email Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
                  Gmail Setup (Recommended)
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-600")}>
                      1. Enable 2-Factor Authentication:
                    </p>
                    <ul className={cn("text-sm space-y-1", isDark ? "text-gray-300" : "text-gray-600")}>
                      <li>• Go to Google Account settings</li>
                      <li>• Security → 2-Step Verification</li>
                      <li>• Follow the setup process</li>
                    </ul>
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-600")}>
                      2. Generate App Password:
                    </p>
                    <ul className={cn("text-sm space-y-1", isDark ? "text-gray-300" : "text-gray-600")}>
                      <li>• Security → App passwords</li>
                      <li>• Select "Mail" and your device</li>
                      <li>• Copy the 16-character password</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Security Note</AlertTitle>
                <AlertDescription>
                  Never use your regular Gmail password. Always use an App Password for SMTP authentication.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 3: Environment Variables */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-500" />
                <span>Step 3: Environment Variables</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                Create a <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">.env.local</code> file in your
                project root with these variables:
              </p>

              <div className="space-y-3">
                {envVariables.map((env, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded border",
                      isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200",
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <code className={cn("font-mono text-sm", isDark ? "text-green-400" : "text-green-600")}>
                          {env.key}={env.value}
                        </code>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`${env.key}=${env.value}`, env.key)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedText === env.key ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>{env.description}</p>
                  </div>
                ))}
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertTitle>Security Reminder</AlertTitle>
                <AlertDescription>
                  Never commit your .env.local file to version control. Add it to your .gitignore file.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 4: Testing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Step 4: Testing the System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
                  Test Registration
                </h3>
                <ul className={cn("text-sm space-y-2", isDark ? "text-gray-300" : "text-gray-600")}>
                  <li>
                    • Start your development server: <code>npm run dev</code>
                  </li>
                  <li>
                    • Navigate to <code>/register-v2</code>
                  </li>
                  <li>• Fill out the registration form with test data</li>
                  <li>• Check your Airtable base for the new record</li>
                  <li>• Verify the confirmation email was sent</li>
                </ul>
              </div>

              <Alert>
                <Globe className="h-4 w-4" />
                <AlertTitle>Production Deployment</AlertTitle>
                <AlertDescription>
                  When deploying to production (Vercel, Netlify, etc.), add all environment variables to your hosting
                  platform's environment settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardHeader>
              <CardTitle>✨ System Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Data Management</h4>
                  <ul className={cn("text-sm space-y-1", isDark ? "text-gray-300" : "text-gray-600")}>
                    <li>• Airtable database storage</li>
                    <li>• Real-time data validation</li>
                    <li>• Duplicate email prevention</li>
                    <li>• Structured data organization</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Email System</h4>
                  <ul className={cn("text-sm space-y-1", isDark ? "text-gray-300" : "text-gray-600")}>
                    <li>• Professional HTML emails</li>
                    <li>• Random motivational quotes</li>
                    <li>• Registration confirmation</li>
                    <li>• Event details included</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
