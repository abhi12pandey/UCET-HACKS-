"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Plus,
  Edit,
  Eye,
  Send,
  Save,
  Trash2,
  Mail,
  Settings,
  Quote,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: "registration" | "reminder" | "announcement" | "winner" | "custom"
  createdAt: string
  updatedAt: string
}

interface MotivationalQuote {
  id: string
  text: string
  author: string
  category: string
}

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  fromName: string
  fromEmail: string
}

const defaultQuotes: MotivationalQuote[] = [
  {
    id: "1",
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "innovation",
  },
  {
    id: "2",
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    category: "future",
  },
  {
    id: "3",
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "coding",
  },
  {
    id: "4",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "problem-solving",
  },
  {
    id: "5",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion",
  },
]

const defaultTemplates: EmailTemplate[] = [
  {
    id: "registration-confirmation",
    name: "Registration Confirmation",
    subject: "🎉 Welcome to UCET Hacks 2025 - Registration Confirmed!",
    category: "registration",
    variables: ["teamLeaderName", "teamName", "email", "phone", "department", "teamSize"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    htmlContent: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">UCET Hacks 2025</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">The Genesis of Innovation</p>
        </div>
        
        <!-- Success Icon -->
        <div style="text-align: center; padding: 30px 20px 20px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 36px;">✓</span>
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 0 30px 40px;">
          <h2 style="color: #1e293b; text-align: center; margin: 0 0 30px 0; font-size: 24px;">Registration Successful!</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello <strong style="color: #1e293b;">{{teamLeaderName}}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Congratulations! Your team <strong style="color: #667eea;">"{{teamName}}"</strong> has been successfully registered for UCET Hacks 2025. We're excited to have you join us for this incredible journey of innovation and creativity!
          </p>
          
          <!-- Registration Details -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #667eea;">
            <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px;">📋 Your Registration Details</h3>
            <div style="display: grid; gap: 10px;">
              <div><strong>Team Leader:</strong> {{teamLeaderName}}</div>
              <div><strong>Email:</strong> {{email}}</div>
              <div><strong>Phone:</strong> {{phone}}</div>
              <div><strong>Department:</strong> {{department}}</div>
              <div><strong>Team Size:</strong> {{teamSize}} members</div>
            </div>
          </div>
          
          <!-- Event Details -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #ffffff; margin: 0 0 20px 0; font-size: 18px;">📅 Event Details</h3>
            <div style="color: #e2e8f0; line-height: 1.8;">
              <div style="margin-bottom: 10px;"><strong>📍 Venue:</strong> UCET VBU Campus, Hazaribagh, Jharkhand</div>
              <div style="margin-bottom: 10px;"><strong>📅 Date:</strong> July 4th, 2025</div>
              <div style="margin-bottom: 10px;"><strong>⏰ Duration:</strong> 9 Hours of Innovation</div>
              <div><strong>🏆 Prize Pool:</strong> To Be Announced</div>
            </div>
          </div>
          
          <!-- What's Next -->
          <div style="background-color: #ecfdf5; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin: 0 0 20px 0; font-size: 18px;">🚀 What's Next?</h3>
            <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Mark your calendar for July 4th, 2025</li>
              <li>Start brainstorming innovative ideas with your team</li>
              <li>Prepare your development environment and tools</li>
              <li>Follow us on social media for regular updates</li>
              <li>Join our community group (link coming soon)</li>
            </ul>
          </div>
        </div>
        
        <!-- Quote Section -->
        {{motivationalQuote}}
        
        <!-- Footer -->
        <div style="background-color: #1e293b; padding: 30px 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">© 2025 UCET Hacks | All Rights Reserved</p>
          <p style="color: #64748b; margin: 0; font-size: 12px;">Made with ❤️ by UCET Students</p>
        </div>
      </div>
    `,
    textContent: `
UCET Hacks 2025 - Registration Confirmation

Hello {{teamLeaderName}},

Congratulations! Your team "{{teamName}}" has been successfully registered for UCET Hacks 2025.

Registration Details:
- Team Leader: {{teamLeaderName}}
- Email: {{email}}
- Phone: {{phone}}
- Department: {{department}}
- Team Size: {{teamSize}} members

Event Details:
- Venue: UCET VBU Campus, Hazaribagh, Jharkhand
- Date: July 4th, 2025
- Duration: 9 Hours of Innovation
- Prize Pool: To Be Announced

What's Next:
- Mark your calendar for July 4th, 2025
- Start brainstorming innovative ideas with your team
- Prepare your development environment and tools
- Follow us on social media for regular updates

{{motivationalQuoteText}}

Contact: ucethacks2025@ucet.ac.in | +91 9876543210
© 2025 UCET Hacks | All Rights Reserved
    `,
  },
]

export default function EmailTemplatesPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
  const [quotes, setQuotes] = useState<MotivationalQuote[]>(defaultQuotes)
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "",
    password: "",
    fromName: "UCET Hacks 2025",
    fromEmail: "",
  })

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("emailTemplates")
    const savedQuotes = localStorage.getItem("motivationalQuotes")
    const savedConfig = localStorage.getItem("emailConfig")

    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    }
    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes))
    }
    if (savedConfig) {
      setEmailConfig(JSON.parse(savedConfig))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("emailTemplates", JSON.stringify(templates))
  }, [templates])

  useEffect(() => {
    localStorage.setItem("motivationalQuotes", JSON.stringify(quotes))
  }, [quotes])

  useEffect(() => {
    localStorage.setItem("emailConfig", JSON.stringify(emailConfig))
  }, [emailConfig])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const createNewTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `template-${Date.now()}`,
      name: "New Template",
      subject: "New Email Subject",
      htmlContent: "<p>Your email content here...</p>",
      textContent: "Your email content here...",
      variables: [],
      category: "custom",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTemplates([...templates, newTemplate])
    setSelectedTemplate(newTemplate)
    setIsEditing(true)
    showNotification("success", "New template created successfully!")
  }

  const saveTemplate = (template: EmailTemplate) => {
    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toISOString(),
    }

    setTemplates(templates.map((t) => (t.id === template.id ? updatedTemplate : t)))
    setSelectedTemplate(updatedTemplate)
    setIsEditing(false)
    showNotification("success", "Template saved successfully!")
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
    }
    showNotification("success", "Template deleted successfully!")
  }

  const addQuote = () => {
    const newQuote: MotivationalQuote = {
      id: `quote-${Date.now()}`,
      text: "",
      author: "",
      category: "general",
    }
    setQuotes([...quotes, newQuote])
  }

  const updateQuote = (quoteId: string, updates: Partial<MotivationalQuote>) => {
    setQuotes(quotes.map((q) => (q.id === quoteId ? { ...q, ...updates } : q)))
  }

  const deleteQuote = (quoteId: string) => {
    setQuotes(quotes.filter((q) => q.id !== quoteId))
  }

  const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  const renderTemplateWithQuote = (template: EmailTemplate, sampleData: any = {}) => {
    const randomQuote = getRandomQuote()
    const quoteHtml = `
      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; margin: 20px 30px; border-left: 4px solid #667eea;">
        <h4 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">💡 Inspiration</h4>
        <blockquote style="color: #475569; font-style: italic; margin: 0 0 10px 0; font-size: 16px; line-height: 1.6;">
          "${randomQuote?.text || "Innovation distinguishes between a leader and a follower."}"
        </blockquote>
        <cite style="color: #64748b; font-size: 14px;">— ${randomQuote?.author || "Steve Jobs"}</cite>
      </div>
    `

    const quoteText = `\n\n"${randomQuote?.text || "Innovation distinguishes between a leader and a follower."}" - ${randomQuote?.author || "Steve Jobs"}\n`

    // Sample data for preview
    const defaultSampleData = {
      teamLeaderName: "John Doe",
      teamName: "Code Warriors",
      email: "john.doe@ucet.ac.in",
      phone: "9876543210",
      department: "Computer Science",
      teamSize: "4",
      motivationalQuote: quoteHtml,
      motivationalQuoteText: quoteText,
    }

    const data = { ...defaultSampleData, ...sampleData }

    let htmlContent = template.htmlContent
    let textContent = template.textContent

    // Replace variables
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      htmlContent = htmlContent.replace(regex, value as string)
      textContent = textContent.replace(regex, value as string)
    })

    return { htmlContent, textContent }
  }

  const sendTestEmail = async (template: EmailTemplate, testEmail: string) => {
    setIsSending(true)
    try {
      const { htmlContent, textContent } = renderTemplateWithQuote(template)

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmail,
          subject: template.subject,
          htmlContent,
          textContent,
          config: emailConfig,
        }),
      })

      const result = await response.json()

      if (result.success) {
        showNotification("success", "Test email sent successfully!")
      } else {
        showNotification("error", result.message || "Failed to send test email")
      }
    } catch (error) {
      showNotification("error", "Failed to send test email")
    } finally {
      setIsSending(false)
    }
  }

  const exportTemplates = () => {
    const data = {
      templates,
      quotes,
      emailConfig,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ucet-hacks-email-templates-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showNotification("success", "Templates exported successfully!")
  }

  const importTemplates = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.templates) setTemplates(data.templates)
        if (data.quotes) setQuotes(data.quotes)
        if (data.emailConfig) setEmailConfig(data.emailConfig)

        showNotification("success", "Templates imported successfully!")
      } catch (error) {
        showNotification("error", "Failed to import templates. Invalid file format.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className={cn("min-h-screen transition-colors duration-500", isDark ? "bg-gray-900" : "bg-gray-50")}>
      {/* Header */}
      <div
        className={cn(
          "border-b backdrop-blur-sm sticky top-0 z-40",
          isDark ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200",
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                Email Template Manager
              </h1>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Create, manage, and send email templates for UCET Hacks 2025
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={exportTemplates} variant="outline" size="sm" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
              <label className="cursor-pointer">
                <input type="file" accept=".json" onChange={importTemplates} className="hidden" />
                <Button variant="outline" size="sm" className="flex items-center space-x-2" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                  </span>
                </Button>
              </label>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50"
          >
            <Alert variant={notification.type === "error" ? "destructive" : "default"}>
              {notification.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{notification.type === "success" ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center space-x-2">
              <Quote className="w-4 h-4" />
              <span>Quotes</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Email Config</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>Email Templates</h2>
              <Button onClick={createNewTemplate} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Template</span>
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Template List */}
              <div className="lg:col-span-1">
                <Card className={cn("h-fit", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
                  <CardHeader>
                    <CardTitle className="text-lg">Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all",
                          selectedTemplate?.id === template.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                        )}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>
                              {template.name}
                            </h4>
                            <p className={cn("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-600")}>
                              {template.category}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTemplate(template)
                                setIsEditing(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteTemplate(template.id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Template Editor */}
              <div className="lg:col-span-2">
                {selectedTemplate ? (
                  <TemplateEditor
                    template={selectedTemplate}
                    isEditing={isEditing}
                    onSave={saveTemplate}
                    onCancel={() => setIsEditing(false)}
                    onEdit={() => setIsEditing(true)}
                    onSendTest={sendTestEmail}
                    isSending={isSending}
                    isDark={isDark}
                  />
                ) : (
                  <Card
                    className={cn(
                      "h-96 flex items-center justify-center",
                      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                    )}
                  >
                    <div className="text-center">
                      <Mail className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-gray-600" : "text-gray-400")} />
                      <p className={cn("text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
                        Select a template to edit
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>
                Motivational Quotes
              </h2>
              <Button onClick={addQuote} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Quote</span>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} onUpdate={updateQuote} onDelete={deleteQuote} isDark={isDark} />
              ))}
            </div>
          </TabsContent>

          {/* Email Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <EmailConfigForm config={emailConfig} onChange={setEmailConfig} isDark={isDark} />
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <TemplatePreview
              templates={templates}
              quotes={quotes}
              renderTemplateWithQuote={renderTemplateWithQuote}
              isDark={isDark}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Template Editor Component
function TemplateEditor({
  template,
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onSendTest,
  isSending,
  isDark,
}: {
  template: EmailTemplate
  isEditing: boolean
  onSave: (template: EmailTemplate) => void
  onCancel: () => void
  onEdit: () => void
  onSendTest: (template: EmailTemplate, email: string) => void
  isSending: boolean
  isDark: boolean
}) {
  const [editedTemplate, setEditedTemplate] = useState(template)
  const [testEmail, setTestEmail] = useState("")

  useEffect(() => {
    setEditedTemplate(template)
  }, [template])

  const handleSave = () => {
    onSave(editedTemplate)
  }

  return (
    <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{isEditing ? "Edit Template" : "Template Details"}</CardTitle>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={onCancel} variant="outline" size="sm">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={onEdit} size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={editedTemplate.name}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={editedTemplate.category}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, category: e.target.value as any })}
              disabled={!isEditing}
              className={cn(
                "mt-1 w-full rounded-md border px-3 py-2 text-sm",
                isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
              )}
            >
              <option value="registration">Registration</option>
              <option value="reminder">Reminder</option>
              <option value="announcement">Announcement</option>
              <option value="winner">Winner</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={editedTemplate.subject}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, subject: e.target.value })}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="htmlContent">HTML Content</Label>
          <Textarea
            id="htmlContent"
            value={editedTemplate.htmlContent}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, htmlContent: e.target.value })}
            disabled={!isEditing}
            rows={10}
            className="mt-1 font-mono text-sm"
          />
        </div>

        <div>
          <Label htmlFor="textContent">Text Content</Label>
          <Textarea
            id="textContent"
            value={editedTemplate.textContent}
            onChange={(e) => setEditedTemplate({ ...editedTemplate, textContent: e.target.value })}
            disabled={!isEditing}
            rows={6}
            className="mt-1"
          />
        </div>

        {/* Test Email Section */}
        <div className="border-t pt-4">
          <h4 className={cn("font-medium mb-3", isDark ? "text-white" : "text-gray-900")}>Send Test Email</h4>
          <div className="flex space-x-2">
            <Input
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => onSendTest(editedTemplate, testEmail)} disabled={!testEmail || isSending}>
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Quote Card Component
function QuoteCard({
  quote,
  onUpdate,
  onDelete,
  isDark,
}: {
  quote: MotivationalQuote
  onUpdate: (id: string, updates: Partial<MotivationalQuote>) => void
  onDelete: (id: string) => void
  isDark: boolean
}) {
  const [isEditing, setIsEditing] = useState(!quote.text)

  return (
    <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter quote text..."
              value={quote.text}
              onChange={(e) => onUpdate(quote.id, { text: e.target.value })}
              rows={3}
            />
            <Input
              placeholder="Author name"
              value={quote.author}
              onChange={(e) => onUpdate(quote.id, { author: e.target.value })}
            />
            <Input
              placeholder="Category"
              value={quote.category}
              onChange={(e) => onUpdate(quote.id, { category: e.target.value })}
            />
            <div className="flex space-x-2">
              <Button onClick={() => setIsEditing(false)} size="sm">
                <Save className="w-4 h-4" />
              </Button>
              <Button onClick={() => onDelete(quote.id)} variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <blockquote className={cn("italic mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
              "{quote.text}"
            </blockquote>
            <cite className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>— {quote.author}</cite>
            <div className="flex justify-between items-center mt-3">
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded",
                  isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600",
                )}
              >
                {quote.category}
              </span>
              <div className="flex space-x-1">
                <Button onClick={() => setIsEditing(true)} size="sm" variant="ghost">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button onClick={() => onDelete(quote.id)} size="sm" variant="ghost">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Email Config Form Component
function EmailConfigForm({
  config,
  onChange,
  isDark,
}: {
  config: EmailConfig
  onChange: (config: EmailConfig) => void
  isDark: boolean
}) {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"success" | "error" | null>(null)

  const testConnection = async () => {
    setIsTestingConnection(true)
    try {
      const response = await fetch("/api/test-email-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const result = await response.json()
      setConnectionStatus(result.success ? "success" : "error")
    } catch (error) {
      setConnectionStatus("error")
    } finally {
      setIsTestingConnection(false)
    }
  }

  return (
    <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="text-lg">Email Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="host">SMTP Host</Label>
            <Input
              id="host"
              value={config.host}
              onChange={(e) => onChange({ ...config, host: e.target.value })}
              placeholder="smtp.gmail.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              value={config.port}
              onChange={(e) => onChange({ ...config, port: Number.parseInt(e.target.value) })}
              placeholder="587"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="secure"
            checked={config.secure}
            onChange={(e) => onChange({ ...config, secure: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="secure">Use SSL/TLS (port 465)</Label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="user">Username/Email</Label>
            <Input
              id="user"
              value={config.user}
              onChange={(e) => onChange({ ...config, user: e.target.value })}
              placeholder="your-email@gmail.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password/App Password</Label>
            <Input
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => onChange({ ...config, password: e.target.value })}
              placeholder="your-app-password"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              value={config.fromName}
              onChange={(e) => onChange({ ...config, fromName: e.target.value })}
              placeholder="UCET Hacks 2025"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              value={config.fromEmail}
              onChange={(e) => onChange({ ...config, fromEmail: e.target.value })}
              placeholder="noreply@ucethacks.com"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button onClick={testConnection} disabled={isTestingConnection} className="flex items-center space-x-2">
            {isTestingConnection ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Test Connection</span>
          </Button>

          {connectionStatus && (
            <div
              className={cn(
                "flex items-center space-x-2",
                connectionStatus === "success" ? "text-green-600" : "text-red-600",
              )}
            >
              {connectionStatus === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">
                {connectionStatus === "success" ? "Connection successful" : "Connection failed"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Template Preview Component
function TemplatePreview({
  templates,
  quotes,
  renderTemplateWithQuote,
  isDark,
}: {
  templates: EmailTemplate[]
  quotes: MotivationalQuote[]
  renderTemplateWithQuote: (template: EmailTemplate, sampleData?: any) => { htmlContent: string; textContent: string }
  isDark: boolean
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || "")
  const [previewMode, setPreviewMode] = useState<"html" | "text">("html")

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  if (!selectedTemplate) {
    return (
      <Card
        className={cn(
          "h-96 flex items-center justify-center",
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        )}
      >
        <div className="text-center">
          <Eye className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-gray-600" : "text-gray-400")} />
          <p className={cn("text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
            No templates available for preview
          </p>
        </div>
      </Card>
    )
  }

  const { htmlContent, textContent } = renderTemplateWithQuote(selectedTemplate)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>Template Preview</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm",
              isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
            )}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <div className="flex rounded-md border">
            <button
              onClick={() => setPreviewMode("html")}
              className={cn(
                "px-3 py-2 text-sm rounded-l-md",
                previewMode === "html"
                  ? "bg-blue-500 text-white"
                  : isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700",
              )}
            >
              HTML
            </button>
            <button
              onClick={() => setPreviewMode("text")}
              className={cn(
                "px-3 py-2 text-sm rounded-r-md border-l",
                previewMode === "text"
                  ? "bg-blue-500 text-white"
                  : isDark
                    ? "bg-gray-700 text-gray-300 border-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-300",
              )}
            >
              Text
            </button>
          </div>
        </div>
      </div>

      <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
        <CardContent className="p-0">
          {previewMode === "html" ? (
            <div className="h-96 overflow-auto">
              <iframe srcDoc={htmlContent} className="w-full h-full border-0" title="Email Preview" />
            </div>
          ) : (
            <div className="p-6 h-96 overflow-auto">
              <pre className={cn("whitespace-pre-wrap text-sm", isDark ? "text-gray-300" : "text-gray-700")}>
                {textContent}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
