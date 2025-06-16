
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, ExternalLink } from "lucide-react";

const USVideoHub = () => {
  const [activeGrade, setActiveGrade] = useState("grade10");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const grade10Topics = [
    {
      unit: "Algebra",
      videos: [
        {
          title: "Algebra 1 (Eureka Math/EngageNY)",
          educator: "Khan Academy",
          isExternal: true,
          externalUrl: "https://www.khanacademy.org/math/engageny-alg-1",
          description: "Full Course (Algebra 1)"
        }
      ]
    },
    {
      unit: "Geometry",
      videos: [
        {
          title: "Geometry (all content)",
          educator: "Khan Academy",
          isExternal: true,
          externalUrl: "https://www.khanacademy.org/math/geometry",
          description: "Full Course (Geometry)"
        },
        {
          title: "Basics of Geometry for High School",
          educator: "Math Center",
          videoId: "LVldOxyEP8E",
          description: "Basics of Geometry"
        }
      ]
    }
  ];

  const grade12Topics = [
    {
      unit: "Algebra",
      videos: [
        {
          title: "Algebra 2",
          educator: "Khan Academy",
          isExternal: true,
          externalUrl: "https://www.khanacademy.org/math/algebra2",
          description: "Full Course (Algebra 2)"
        }
      ]
    },
    {
      unit: "Functions/Pre-Calculus",
      videos: [
        {
          title: "PreCalculus",
          educator: "ProfRobBob",
          isPlaylist: true,
          playlistId: "PL4FB17E5C77DCCE69",
          description: "PreCalculus"
        }
      ]
    },
    {
      unit: "Calculus",
      videos: [
        {
          title: "AP Calculus BC",
          educator: "Advanced Placement",
          isPlaylist: true,
          playlistId: "PLoGgviqq4844oVJMjJ8YkD4mQIoMp4Cbu",
          description: "AP Calculus BC"
        }
      ]
    },
    {
      unit: "Discrete Mathematics",
      videos: [
        {
          title: "Discrete Math (For High Schools)",
          educator: "Math Center",
          videoId: "EBHeuT6youI",
          description: "Discrete Math"
        }
      ]
    },
    {
      unit: "Number and Quantity",
      videos: [
        {
          title: "Vectors - Basic Introduction - Physics",
          educator: "The Organic Chemistry Tutor",
          videoId: "EwSHKuSxX_8",
          description: "Vectors"
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

  const VideoCard = ({ video }: { video: any }) => {
    const videoKey = video.videoId || video.playlistId || video.externalUrl;
    const isPlaying = playingVideo === videoKey;

    if (video.isExternal) {
      return (
        <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-red-100">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base font-bold text-red-800 mb-2 line-clamp-2">
                  {video.title}
                </CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                    {video.educator}
                  </Badge>
                  <Badge variant="outline" className="border-red-300 text-xs">
                    External Link
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{video.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <a
              href={video.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-4 bg-red-50 rounded-lg border-2 border-red-200 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <ExternalLink className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">Visit External Resource</span>
              </div>
            </a>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-red-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-bold text-red-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-red-300 text-xs">
                  {video.isPlaylist ? "Playlist" : "Video"}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">{video.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {!isPlaying ? (
            <div 
              className="relative aspect-video rounded-lg overflow-hidden shadow-md cursor-pointer bg-gray-100 flex items-center justify-center"
              onClick={() => setPlayingVideo(videoKey)}
            >
              <img
                src={`https://img.youtube.com/vi/${video.videoId || 'default'}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-white" />
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
    <div className="space-y-6">
      {topics.map((topic, index) => (
        <div key={index}>
          <h3 className="text-xl font-bold text-red-800 mb-3 border-b-2 border-red-200 pb-2">
            {topic.unit}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topic.videos.map((video: any, videoIndex: number) => (
              <VideoCard key={videoIndex} video={video} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-500 to-rose-500 mb-4">
            US Common Core Mathematics
          </h1>
          <p className="text-xl text-red-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for US Common Core Mathematics covering Grade 10 (Algebra I & Geometry) and Grade 12 (Advanced Topics, Pre-Calculus, Calculus).
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-red-400 to-rose-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeGrade} onValueChange={setActiveGrade} className="w-full">
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
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube or external platforms. 
            This is a curated collection to help US students find the best mathematical content aligned with Common Core standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default USVideoHub;
