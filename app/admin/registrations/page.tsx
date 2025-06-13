"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Users,
  GraduationCap,
  Download,
  RefreshCw,
  Calendar,
  TrendingUp,
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Registration {
  id: string
  fields: {
    "Team Leader Name": string
    Email: string
    Phone: string
    College: string
    Department: string
    "Year of Study": string
    "Team Name": string
    "Team Size": number
    Experience: string
    "Presentation Link": string
    Motivation: string
    "Registration Date": string
    Status: string
  }
  createdTime: string
}

interface RegistrationStats {
  total: number
  today: number
  departments: { [key: string]: number }
  experience: { [key: string]: number }
  teamSizes: { [key: string]: number }
}

export default function RegistrationsAdminPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [stats, setStats] = useState<RegistrationStats>({
    total: 0,
    today: 0,
    departments: {},
    experience: {},
    teamSizes: {},
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("")

  // Fetch registrations from Airtable
  const fetchRegistrations = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/registrations")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch registrations")
      }

      setRegistrations(data.records || [])
      calculateStats(data.records || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch registrations")
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const calculateStats = (records: Registration[]) => {
    const today = new Date().toDateString()
    const departments: { [key: string]: number } = {}
    const experience: { [key: string]: number } = {}
    const teamSizes: { [key: string]: number } = {}

    let todayCount = 0

    records.forEach((record) => {
      // Count today's registrations
      const regDate = new Date(record.fields["Registration Date"]).toDateString()
      if (regDate === today) {
        todayCount++
      }

      // Count by department
      const dept = record.fields.Department
      departments[dept] = (departments[dept] || 0) + 1

      // Count by experience
      const exp = record.fields.Experience
      experience[exp] = (experience[exp] || 0) + 1

      // Count by team size
      const size = record.fields["Team Size"].toString()
      teamSizes[size] = (teamSizes[size] || 0) + 1
    })

    setStats({
      total: records.length,
      today: todayCount,
      departments,
      experience,
      teamSizes,
    })
  }

  // Filter registrations
  useEffect(() => {
    let filtered = registrations

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.fields["Team Leader Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.fields["Team Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.fields.Email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDepartment) {
      filtered = filtered.filter((reg) => reg.fields.Department === selectedDepartment)
    }

    if (selectedExperience) {
      filtered = filtered.filter((reg) => reg.fields.Experience === selectedExperience)
    }

    setFilteredRegistrations(filtered)
  }, [registrations, searchTerm, selectedDepartment, selectedExperience])

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Team Leader Name",
      "Email",
      "Phone",
      "College",
      "Department",
      "Year of Study",
      "Team Name",
      "Team Size",
      "Experience",
      "Presentation Link",
      "Registration Date",
      "Status",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredRegistrations.map((reg) =>
        [
          `"${reg.fields["Team Leader Name"]}"`,
          `"${reg.fields.Email}"`,
          `"${reg.fields.Phone}"`,
          `"${reg.fields.College}"`,
          `"${reg.fields.Department}"`,
          `"${reg.fields["Year of Study"]}"`,
          `"${reg.fields["Team Name"]}"`,
          reg.fields["Team Size"],
          `"${reg.fields.Experience}"`,
          `"${reg.fields["Presentation Link"]}"`,
          `"${reg.fields["Registration Date"]}"`,
          `"${reg.fields.Status}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ucet-hacks-registrations-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

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
                Registration Dashboard
              </h1>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Monitor and manage UCET Hacks 2025 registrations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={fetchRegistrations} variant="outline" size="sm" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span className="ml-2">Refresh</span>
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm" disabled={filteredRegistrations.length === 0}>
                <Download className="w-4 h-4" />
                <span className="ml-2">Export CSV</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
                    Total Registrations
                  </p>
                  <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Today</p>
                  <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stats.today}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Departments</p>
                  <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {Object.keys(stats.departments).length}
                  </p>
                </div>
                <GraduationCap className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-600")}>Avg Team Size</p>
                  <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {stats.total > 0
                      ? (
                          Object.entries(stats.teamSizes).reduce(
                            (acc, [size, count]) => acc + Number.parseInt(size) * count,
                            0,
                          ) / stats.total
                        ).toFixed(1)
                      : "0"}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className={cn("mb-6", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Search by name, team, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
                    )}
                  />
                </div>
                <div>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className={cn(
                      "w-full h-10 rounded-md border px-3 py-2 text-sm",
                      isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
                    )}
                  >
                    <option value="">All Departments</option>
                    {Object.keys(stats.departments).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept} ({stats.departments[dept]})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className={cn(
                      "w-full h-10 rounded-md border px-3 py-2 text-sm",
                      isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
                    )}
                  >
                    <option value="">All Experience Levels</option>
                    {Object.keys(stats.experience).map((exp) => (
                      <option key={exp} value={exp}>
                        {exp} ({stats.experience[exp]})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    Showing {filteredRegistrations.length} of {stats.total}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Registrations Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Registrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className={cn("ml-2", isDark ? "text-gray-300" : "text-gray-600")}>
                    Loading registrations...
                  </span>
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="text-center py-12">
                  <Users className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-gray-600" : "text-gray-400")} />
                  <p className={cn("text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
                    {registrations.length === 0 ? "No registrations yet" : "No registrations match your filters"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={cn("border-b", isDark ? "border-gray-700" : "border-gray-200")}>
                        <th
                          className={cn("text-left py-3 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}
                        >
                          Team Leader
                        </th>
                        <th
                          className={cn("text-left py-3 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}
                        >
                          Team Name
                        </th>
                        <th
                          className={cn("text-left py-3 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}
                        >
                          Email
                        </th>
                        <th
                          className={cn("text-left py-3 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}
                        >
                          Department
                        </th>
                        <th
                          className={cn("text-left py-3 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}
                        >
                          Team Size
                        </th>
                        <th
                          className={cn("text-left py-3 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}
                        >
                          Experience
                        </th>
                        <th
                          className={cn("text-left py-3 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}
                        >
                          Date
                        </th>
                        <th
                          className={cn("text-left py-3 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((registration, index) => (
                        <motion.tr
                          key={registration.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "border-b hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                            isDark ? "border-gray-700" : "border-gray-200",
                          )}
                        >
                          <td className="py-3 px-4">
                            <div>
                              <div className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                                {registration.fields["Team Leader Name"]}
                              </div>
                              <div className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                                {registration.fields.Phone}
                              </div>
                            </div>
                          </td>
                          <td className={cn("py-3 px-4", isDark ? "text-gray-300" : "text-gray-700")}>
                            {registration.fields["Team Name"]}
                          </td>
                          <td className={cn("py-3 px-4", isDark ? "text-gray-300" : "text-gray-700")}>
                            <a href={`mailto:${registration.fields.Email}`} className="text-blue-500 hover:underline">
                              {registration.fields.Email}
                            </a>
                          </td>
                          <td className={cn("py-3 px-4", isDark ? "text-gray-300" : "text-gray-700")}>
                            <div>
                              <div>{registration.fields.Department}</div>
                              <div className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                                {registration.fields["Year of Study"]}
                              </div>
                            </div>
                          </td>
                          <td className={cn("py-3 px-4", isDark ? "text-gray-300" : "text-gray-700")}>
                            {registration.fields["Team Size"]} members
                          </td>
                          <td className={cn("py-3 px-4", isDark ? "text-gray-300" : "text-gray-700")}>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                registration.fields.Experience === "Beginner"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : registration.fields.Experience === "Intermediate"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                              )}
                            >
                              {registration.fields.Experience}
                            </span>
                          </td>
                          <td className={cn("py-3 px-4 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                            {new Date(registration.fields["Registration Date"]).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-1 rounded-full text-xs",
                                registration.fields.Status === "Registered"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
                              )}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {registration.fields.Status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
