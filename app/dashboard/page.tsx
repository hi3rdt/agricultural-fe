"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import  DashboardHeader  from "@/components/dashboard-header"
import { SensorOverview } from "@/components/sensor-overview"
import { SensorCharts } from "@/components/sensor-charts"
import { PumpControls } from "@/components/pump-controls"
import { SystemStatus } from "@/components/system-status"
import { ESP32CamGallery } from "@/components/esp32-cam-gallery"

export default function AgriculturalDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (!auth) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* System Status Overview */}
        <SystemStatus />

        {/* Sensor Overview Cards */}
        <SensorOverview />

        {/* Charts Section */}
        <SensorCharts />

        <ESP32CamGallery />

        {/* Pump Controls */}
        <PumpControls />
      </main>
    </div>
  )
}
