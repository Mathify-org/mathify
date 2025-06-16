
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, PlayCircle, List, Play } from "lucide-react";

const USVideoHub = () => {
  const [activeUnit, setActiveUnit] = useState("grade10");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const grade10Topics = [
    {
      unit: "Algebra & Geometry",
      videos: [
        {
          title: "Basics of Geometry for High School",
          educator: "Math Center",
          videoId: "LVldOxyEP8E",
          description: "Geometry Basics"
        },
        {
          title: "Vectors - Basic Introduction - Physics",
          educator: "The Organic Chemistry Tutor",
          videoId: "EwSHKuSxX_8",
          description: "Vectors Introduction"
        }
      ]
    }
  ];

  const grade12Topics = [
    {
      unit: "Advanced Mathematics",
      videos: [
        {
          title: "PreCalculus",
          educator: "ProfRobBob",
          isPlaylist: true,
          playlistId: "PL4FB17E5C77DCCE69",
          description: "PreCalculus Course"
        },
        {
          title: "AP Calculus BC",
          educator: "Advanced Placement",
          isPlaylist: true,
          playlistId: "PLoGgviqq4844oVJMjJ8YkD4mQIoMp4Cbu",
          description: "AP Calculus BC"
        },
        {
          title: "Discrete Math (For High Schools)",
          educator: "Math Center",
          videoId: "EBHeuT6youI",
          description: "Discrete Mathematics"
        },
        {
          title: "Matrices : Secondary(High) School And GCE's : Intensive Revisions",
          educator: "The Math Sorcerer",
          videoId: "uWSqyRZUriE",
          description: "Matrices"
        },
        {
          title: "Complex Numbers in 20 minutes ✅",
          educator: "Transcended Institute",
          videoId: "kpGaQ86EUug",
          description: "Complex Numbers"
        }
      ]
    }
  ];

  const VideoCard = ({ video, videoKey }: { video: any; videoKey: string }) => {
    const isExpanded = expandedVideo === videoKey;
    
    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-red-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-red-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-red-300">
                  {video.isPlaylist ? "Playlist" : "Video"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
            <div className="ml-4">
              {video.isPlaylist ? (
                <List className="h-8 w-8 text-red-600" />
              ) : (
                <PlayCircle className="h-8 w-8 text-red-600" />
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
          <h3 className="text-2xl font-bold text-red-800 mb-4 border-b-2 border-red-200 pb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 mb-4">
            US Common Core Mathematics
          </h1>
          <p className="text-xl text-red-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for US high school mathematics following Common Core State Standards for Grades 10 and 12.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-red-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeUnit} onValueChange={setActiveUnit} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-red-100">
            <TabsTrigger 
              value="grade10" 
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-semibold"
            >
              Grade 10
            </TabsTrigger>
            <TabsTrigger 
              value="grade12"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-semibold"
            >
              Grade 12
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grade10" className="mt-6">
            <TopicSection topics={grade10Topics} />
          </TabsContent>

          <TabsContent value="grade12" className="mt-6">
            <TopicSection topics={grade12Topics} />
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-red-100 rounded-lg border-2 border-red-200">
          <p className="text-sm text-red-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help US high school students find the best mathematical content available online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default USVideoHub;
