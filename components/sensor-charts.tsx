"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"

interface ChartData {
  time: string
  temperature: number
  humidity: number
  soilMoisture: number
}

const generateFakeData = (): ChartData[] => {
  const fallbackData: ChartData[] = []
  const now = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    fallbackData.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      temperature: 20 + Math.random() * 10, 
      humidity: 40 + Math.random() * 30,    
      soilMoisture: 20 + Math.random() * 50, 
    })
  }
  return fallbackData
}

export function SensorCharts() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    
    
    setChartData(generateFakeData())
    setIsLoading(false)
    setError(null)
  // useEffect(() => {
   
  //   const fetchHistoryData = async () => {
  //     try {
  //       const response = await fetch("/api/sensors/history")
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch sensor history")
  //       }
  //       const result = await response.json()
  //       if (result.success) {
  //         setChartData(result.data)
  //         setError(null)
  //       }
  //     } catch (err) {
  //       console.error("Error fetching sensor history:", err)
  //       setError("Failed to load sensor history")
  //       const fallbackData: ChartData[] = []
  //       const now = new Date()
  //       for (let i = 23; i >= 0; i--) {
  //         const time = new Date(now.getTime() - i * 60 * 60 * 1000)
  //         fallbackData.push({
  //           time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  //           temperature: 22 + Math.random() * 8,
  //           humidity: 50 + Math.random() * 30,
  //           soilMoisture: 30 + Math.random() * 40,
  //         })
  //       }
  //       setChartData(fallbackData)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   // Initial fetch
  //   fetchHistoryData()

  //   const interval = setInterval(fetchHistoryData, 30000)
  //   return () => clearInterval(interval)
   }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Environmental Conditions</CardTitle>
          {error && <p className="text-sm text-muted-foreground">Showing sample data - check ESP32 connection</p>}
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Legend />
                <Line
                  type="linear"
                  dataKey="temperature"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Temperature (°C)"
                  
                />
                <Line
                  type="linear"
                  dataKey="humidity"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Humidity (%)"
                  
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Soil Moisture Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="soilMoisture"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  name="Soil Moisture (%)"
                  
                />
                {/* Threshold lines */}
                <Line
                  type="linear"
                  dataKey={() => 30}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="Low Threshold"
                  dot={false}
                />
                <Line
                  type="linear"
                  dataKey={() => 60}
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="High Threshold"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
