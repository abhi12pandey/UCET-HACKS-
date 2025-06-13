import { type NextRequest, NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { type sheets_v4, google } from "googleapis"

// Google Sheets configuration
const googleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEET_ID || "",
  range: "Registrations!A:M",
  clientEmail: process.env.GOOGLE_CLIENT_EMAIL || "",
  privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
}

// Initialize Google Sheets API
async function getGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
  try {
    if (!googleSheetsConfig.clientEmail || !googleSheetsConfig.privateKey) {
      throw new Error("Google Sheets credentials are missing")
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: googleSheetsConfig.clientEmail,
        private_key: googleSheetsConfig.privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    return sheets
  } catch (error) {
    console.error("Error initializing Google Sheets client:", error)
    throw new Error("Failed to initialize Google Sheets API")
  }
}

// Fetch registrations from Google Sheets
async function fetchRegistrations(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    if (!googleSheetsConfig.spreadsheetId) {
      throw new Error("Google Sheets ID is missing")
    }

    const sheets = await getGoogleSheetsClient()

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: googleSheetsConfig.spreadsheetId,
      range: googleSheetsConfig.range,
    })

    if (!response.data.values || response.data.values.length === 0) {
      return { success: true, data: [] }
    }

    const [headers, ...rows] = response.data.values

    // Convert rows to objects
    const registrations = rows.map((row, index) => ({
      id: index + 1,
      registrationDate: row[0] || "",
      teamLeaderName: row[1] || "",
      email: row[2] || "",
      phone: row[3] || "",
      college: row[4] || "",
      department: row[5] || "",
      year: row[6] || "",
      teamName: row[7] || "",
      teamSize: row[8] || "",
      experience: row[9] || "",
      presentationLink: row[10] || "",
      motivation: row[11] || "",
      status: row[12] || "Registered",
    }))

    return { success: true, data: registrations }
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch registrations",
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await fetchRegistrations()

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error || "Failed to fetch registrations",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data || [],
      total: result.data?.length || 0,
    })
  } catch (error) {
    console.error("Admin API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}
