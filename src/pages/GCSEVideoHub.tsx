
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, PlayCircle, List, Play } from "lucide-react";

const GCSEVideoHub = () => {
  const [activeUnit, setActiveUnit] = useState("foundation");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const foundationTopics = [
    {
      unit: "Number",
      videos: [
        {
          title: "Fractional Indices",
          educator: "ExamQA",
          videoId: "fLtCcNzhNXI",
          description: "Number Toolkit"
        },
        {
          title: "HCF and LCM using Venn Diagrams",
          educator: "ExamQA",
          videoId: "fq5tSQIIpbk",
          description: "Prime Factors, HCF & LCM"
        },
        {
          title: "Introduction to Powers and Roots",
          educator: "ExamQA",
          videoId: "9hyz41qM6LQ",
          description: "Powers, Roots & Standard Form"
        },
        {
          title: "Powers and Roots (Cube Root)",
          educator: "ExamQA",
          videoId: "qWcOoAxi8s0",
          description: "Cube Root"
        },
        {
          title: "Adding and Subtracting Fractions",
          educator: "ExamQA",
          videoId: "ObaYlGvt5jg",
          description: "Fractions"
        },
        {
          title: "Finding a Percentage of an Amount",
          educator: "ExamQA",
          videoId: "bD7UXhOhTng",
          description: "Percentages"
        },
        {
          title: "Compound Interest and Decay",
          educator: "ExamQA",
          videoId: "o8kcaSsFK0I",
          description: "Simple & Compound Interest"
        },
        {
          title: "Rounding and Error Intervals",
          educator: "ExamQA",
          videoId: "z9t1HGRNpPA",
          description: "Rounding, Estimation & Error Intervals"
        },
        {
          title: "Exact Trigonometric Values",
          educator: "ExamQA",
          videoId: "PF2nmCVSUEs",
          description: "Exact Values"
        },
        {
          title: "Calculator Skills for GCSE",
          educator: "ExamQA",
          videoId: "cmF-xzoK7rU",
          description: "Using a Calculator"
        }
      ]
    }
  ];

  const higherTopics = [
    {
      unit: "General Higher Tier",
      videos: [
        {
          title: "GCSE Maths GCSE Revision Higher Tier Course",
          educator: "HEGARTYMATHS",
          isPlaylist: true,
          playlistId: "PLxHVbxhSvleS6TaN5EqyV0mu1W35t33KL",
          description: "Full Course"
        },
        {
          title: "The Whole of iGCSE Maths A Edexcel In 2.5 Hours!",
          educator: "ExamQA",
          videoId: "Wikkld4k56g",
          description: "Full Course (Edexcel)"
        }
      ]
    }
  ];

  const VideoCard = ({ video, videoKey }: { video: any; videoKey: string }) => {
    const isExpanded = expandedVideo === videoKey;
    
    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-green-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-green-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-green-300">
                  {video.isPlaylist ? "Playlist" : "Video"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
            <div className="ml-4">
              {video.isPlaylist ? (
                <List className="h-8 w-8 text-green-600" />
              ) : (
                <PlayCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {!isExpanded ? (
            <div 
              className="relative cursor-pointer group"
              onClick={() => setExpandedVideo(videoKey)}
            >
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md relative">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId || (video.isPlaylist ? video.playlistId?.split('=')[1] : '')}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://img.youtube.com/vi/${video.videoId || (video.isPlaylist ? video.playlistId?.split('=')[1] : '')}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                  <Play className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-lg overflow-hidden shadow-md">
              {video.videoId && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
              {video.isPlaylist && video.playlistId && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/videoseries?list=${video.playlistId}&autoplay=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const TopicSection = ({ topics }: { topics: any[] }) => (
    <div className="space-y-8">
      {topics.map((topic, index) => (
        <div key={index}>
          <h3 className="text-2xl font-bold text-green-800 mb-4 border-b-2 border-green-200 pb-2">
            {topic.unit}
          </h3>
          <div className="grid gap-4">
            {topic.videos.map((video: any, videoIndex: number) => (
              <VideoCard 
                key={videoIndex} 
                video={video} 
                videoKey={`${index}-${videoIndex}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 mb-4">
            GCSE Mathematics
          </h1>
          <p className="text-xl text-green-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for GCSE Mathematics covering both Foundation and Higher tiers across all major exam boards (AQA, Edexcel, OCR).
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-teal-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeUnit} onValueChange={setActiveUnit} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-green-100">
            <TabsTrigger 
              value="foundation" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold"
            >
              Foundation Tier
            </TabsTrigger>
            <TabsTrigger 
              value="higher"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold"
            >
              Higher Tier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foundation" className="mt-6">
            <TopicSection topics={foundationTopics} />
          </TabsContent>

          <TabsContent value="higher" className="mt-6">
            <TopicSection topics={higherTopics} />
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-green-100 rounded-lg border-2 border-green-200">
          <p className="text-sm text-green-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help GCSE students find the best mathematical content available online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GCSEVideoHub;
