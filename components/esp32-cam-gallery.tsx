"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Download, Trash2, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"


const API_BASE_URL = "http://192.168.34.100:8080"

interface CameraImage {
  id: string       
  url: string      
  timestamp: string  
  size: number     
}

export function ESP32CamGallery() {
  const [images, setImages] = useState<CameraImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<CameraImage | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  
  const loadImages = async () => {
    try {
      setError(null)
      
      
      const response = await fetch(`${API_BASE_URL}/api/images`)
      
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status} ${response.statusText}`)
      }
      
      const data: CameraImage[] = await response.json()

      
      const absoluteImages = data.map(img => ({
        ...img,
        url: `${API_BASE_URL}${img.url}` 
      }));

      setImages(absoluteImages)
      if (absoluteImages.length > 0) {
        setSelectedImage(absoluteImages[0])
      } else {
        setSelectedImage(null)
      }
      
    } catch (err) {
      console.error("Error loading ESP32-CAM images:", err)
      setError("Không thể tải ảnh. Hãy đảm bảo server FastAPI (local) đang chạy.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  
  useEffect(() => {
    setIsLoading(true)
    loadImages()
  }, [])

  
  const handleCaptureRequest = async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/capture-request`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Gửi yêu cầu chụp thất bại');
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      await loadImages();
      
    } catch (err) {
      console.error("Error capturing image:", err);
      setError("Không thể gửi yêu cầu chụp ảnh.");
    } finally {
      setIsRefreshing(false)
    }
  }

  
  const handleDelete = async (id: string) => {
   
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/images/${id}`, { 
        method: 'DELETE' 
      })

      if (!response.ok) {
        throw new Error('Xóa thất bại từ server')
      }

      const updatedImages = images.filter((img) => img.id !== id)
      setImages(updatedImages)
      
      if (selectedImage?.id === id) {
        setSelectedImage(updatedImages[0] || null)
      }
    } catch (err) {
      console.error("Error deleting image:", err)
      setError("Không thể xóa ảnh.")
    }
  }

  const handleDownload = (image: CameraImage) => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.id
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            ESP32-CAM Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full h-20 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          ESP32-CAM Gallery
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={images.length > 0 ? "default" : "secondary"}>
            {images.length} {images.length === 1 ? "Image" : "Images"}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCaptureRequest}
            disabled={isRefreshing}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Làm mới {/* Đổi tên từ "Capture" thành "Làm mới" */}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed border-border bg-muted/30">
            <Camera className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Không tìm thấy ảnh nào.</p>
            <p className="text-sm text-muted-foreground">ESP32-CAM sẽ tự động gửi ảnh lên.</p>
          </div>
        ) : (
          <>
            {/* Main Image Display */}
            <div className="relative w-full rounded-lg overflow-hidden bg-muted">
              {selectedImage && (
                <>
                  <img
                    
                    src={selectedImage.url}
                    alt={`ESP32-CAM capture ${selectedImage.id}`}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-sm font-medium">{new Date(selectedImage.timestamp).toLocaleString()}</p>
                        <p className="text-xs text-gray-300">{selectedImage.size.toFixed(1)} KB</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={() => handleDownload(selectedImage)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive-foreground/80 hover:bg-destructive/80 hover:text-destructive-foreground"
                          onClick={() => handleDelete(selectedImage.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Image Carousel Thumbnails */}
            {images.length > 1 && (
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2">
                    {images.map((image) => (
                      <CarouselItem key={image.id} className="pl-2 basis-1/4">
                        <button
                          onClick={() => setSelectedImage(image)}
                          className={`w-full h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage?.id === image.id ? "border-primary" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`Thumbnail ${image.id}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {images.length > 4 && (
                    <>
                      <CarouselPrevious className="left-0" />
                      <CarouselNext className="right-0" />
                    </>
                  )}
                </Carousel>
              </div>
            )}

            {/* Image Info (giữ nguyên) */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">Tổng số ảnh</p>
                <p className="text-lg font-semibold">{images.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ảnh mới nhất</p>
                <p className="text-sm font-medium">
                  {images.length > 0 ? new Date(images[0].timestamp).toLocaleTimeString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kích thước ảnh (chọn)</p>
                <p className="text-sm font-medium">{selectedImage?.size.toFixed(1)} KB</p>
              </div>
            </div>
          </>
        )}
        
        {/* Bỏ phần hướng dẫn TODO */}
      </CardContent>
    </Card>
  )
}