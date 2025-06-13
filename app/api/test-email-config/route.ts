import nodemailer from "nodemailer"
import { type NextRequest, NextResponse } from "next/server"

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const config: EmailConfig = await request.json()

    // Validate required fields
    if (!config.host || !config.port || !config.user || !config.password) {
      return NextResponse.json(
        { success: false, message: "Missing required configuration parameters" },
        { status: 400 },
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Test connection
    await transporter.verify()

    return NextResponse.json({
      success: true,
      message: "Email configuration is valid",
    })
  } catch (error) {
    console.error("Email config test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Invalid email configuration",
      },
      { status: 500 },
    )
  }
}
