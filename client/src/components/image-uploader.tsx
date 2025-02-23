import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface ImageUploaderProps {
  onScoreCalculated: (score: number) => void;
}

export function ImageUploader({ onScoreCalculated }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedJoker, setSelectedJoker] = useState<string>("");
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Here you would typically show a camera preview and capture button
      // For now, we'll just show a toast
      toast({
        title: "Camera Access",
        description: "Camera capture will be implemented in the next update.",
      });
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please try uploading an image instead.",
        variant: "destructive",
      });
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || !selectedJoker) {
      toast({
        title: "Missing Information",
        description: "Please upload an image and select a joker card first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Here we'll implement the AI analysis
      // For now, we'll use a placeholder implementation
      const response = await fetch('/api/analyze-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          joker: selectedJoker,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      onScoreCalculated(result.score);

      toast({
        title: "Analysis Complete",
        description: `Score calculated: ${result.score}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCameraCapture}
            title="Capture with camera"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <Select value={selectedJoker} onValueChange={setSelectedJoker}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Joker Card" />
          </SelectTrigger>
          <SelectContent>
            {CARD_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedImage && (
          <div className="space-y-4">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
              <img
                src={selectedImage}
                alt="Card preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <Button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Analyze Cards
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
