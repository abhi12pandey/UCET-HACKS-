"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  FileSpreadsheet,
  Key,
  Mail,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function GoogleSheetsSetupGuide() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const steps = [
    {
      title: "Create Google Sheets",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      description: "Create a new Google Sheet for storing registration data",
      details: [
        "Go to Google Sheets and create a new spreadsheet",
        "Name it 'UCET Hacks 2025 Registrations'",
        "Copy the Sheet ID from the URL",
        "The URL format: https://docs.google.com/spreadsheets/d/SHEET_ID/edit",
      ],
    },
    {
      title: "Setup Service Account",
      icon: <Key className="w-5 h-5" />,
      description: "Create Google Cloud service account for API access",
      details: [
        "Go to Google Cloud Console",
        "Create a new project or select existing one",
        "Enable Google Sheets API",
        "Create a service account",
        "Download the JSON key file",
      ],
    },
    {
      title: "Configure Sheet Access",
      icon: <Shield className="w-5 h-5" />,
      description: "Share your sheet with the service account",
      details: [
        "Open your Google Sheet",
        "Click 'Share' button",
        "Add the service account email as an editor",
        "The email format: your-service@project.iam.gserviceaccount.com",
      ],
    },
    {
      title: "Setup Email",
      icon: <Mail className="w-5 h-5" />,
      description: "Configure Gmail for sending verification emails",
      details: [
        "Use callmepandey03@gmail.com as the sender",
        "Enable 2-Factor Authentication on Gmail",
        "Generate an App Password",
        "Use the App Password in EMAIL_PASSWORD",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card className={cn("border", isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200")}>
        <CardHeader>
          <CardTitle className={cn("flex items-center space-x-2", isDark ? "text-white" : "text-gray-800")}>
            <Database className="w-6 h-6 text-green-500" />
            <span>Google Sheets Integration Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-lg border",
                isDark ? "bg-gray-900/50 border-gray-600" : "bg-gray-50 border-gray-200",
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-500">{step.icon}</span>
                    <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-800")}>{step.title}</h3>
                  </div>
                  <p className={cn("text-sm mb-3", isDark ? "text-gray-300" : "text-gray-600")}>{step.description}</p>
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className={cn("text-sm flex items-start", isDark ? "text-gray-400" : "text-gray-500")}
                      >
                        <span className="mr-2">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Environment Variables Required</AlertTitle>
            <AlertDescription>
              Make sure to add these environment variables to your Vercel project:
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <code className="text-sm">GOOGLE_SHEET_ID</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("GOOGLE_SHEET_ID", "GOOGLE_SHEET_ID")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <code className="text-sm">GOOGLE_CLIENT_EMAIL</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("GOOGLE_CLIENT_EMAIL", "GOOGLE_CLIENT_EMAIL")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <code className="text-sm">GOOGLE_PRIVATE_KEY</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("GOOGLE_PRIVATE_KEY", "GOOGLE_PRIVATE_KEY")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <code className="text-sm">EMAIL_PASSWORD</code>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard("EMAIL_PASSWORD", "EMAIL_PASSWORD")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {copiedText && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-green-500"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Copied {copiedText} to clipboard!</span>
            </motion.div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={() => window.open("https://console.cloud.google.com", "_blank")}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Cloud Console</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("https://sheets.google.com", "_blank")}
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Google Sheets</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
