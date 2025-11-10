import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Battery, AlertTriangle } from "lucide-react"

export function SystemStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Connectivity</p>
                <p className="text-sm text-muted-foreground">WiFi Connected</p>
              </div>
            </div>
            <Badge variant="default">Online</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Battery className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Power Status</p>
                <p className="text-sm text-muted-foreground">Main Power</p>
              </div>
            </div>
            <Badge variant="default">Stable</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Alerts</p>
                <p className="text-sm text-muted-foreground">No active alerts</p>
              </div>
            </div>
            <Badge variant="secondary">Clear</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
