
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, PlayCircle, List, Play } from "lucide-react";

const CanadianVideoHub = () => {
  const [activeUnit, setActiveUnit] = useState("grade10");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const grade10Topics = [
    {
      unit: "General Grade 10",
      videos: [
        {
          title: "Grade 10 Math (Canada)",
          educator: "StudyPug",
          isPlaylist: true,
          playlistId: "PLdTPQ62ogX0bTZN8tonkVP0pyYEsrLgts",
          description: "Full Course"
        }
      ]
    },
    {
      unit: "Analytic Geometry",
      videos: [
        {
          title: "Grade 10 Analytic Geometry",
          educator: "Ms Havrot's Canadian University Math Prerequisites",
          isPlaylist: true,
          playlistId: "PLGinkJ_ZMO2FDMwjxbgNZP936Ldybce7P",
          description: "Analytic Geometry"
        }
      ]
    },
    {
      unit: "Geometric Properties",
      videos: [
        {
          title: "Mathematics [Euclidean Geometry] Grade 10",
          educator: "M.D.S. Tutoring",
          isPlaylist: true,
          playlistId: "PL2qwOyfIJnGQsJ7wKPgSiQ0VdbjpvjEYM",
          description: "Euclidean Geometry"
        }
      ]
    },
    {
      unit: "Quadratic Relations",
      videos: [
        {
          title: "Grade 10 Quadratic Functions - Vertex Form",
          educator: "Ms Havrot's Canadian University Math Prerequisites",
          isPlaylist: true,
          playlistId: "PLGinkJ_ZMO2GVaU49f8Pzn00QLaD90Mhe",
          description: "Quadratic Functions"
        },
        {
          title: "MPM 2D - Grade 10 Academic Mathematics",
          educator: "Mr. Gray - Math",
          isPlaylist: true,
          playlistId: "PL1iIYRb9fb5UrrDXVEIRdhsdkW9OIdHSF",
          description: "Academic Mathematics"
        }
      ]
    }
  ];

  const grade12Topics = [
    {
      unit: "Calculus & Vectors",
      videos: [
        {
          title: "Grade 12 Calculus & Vectors (MCV4U)",
          educator: "Mr. Cioffi",
          isPlaylist: true,
          playlistId: "PLOOybF6Fi6MIa4AT3-IRCP5TlJ7sG4RgF",
          description: "Full Course (MCV4U)"
        },
        {
          title: "Grade 12 Math (Canada)",
          educator: "StudyPug",
          isPlaylist: true,
          playlistId: "PLdTPQ62ogX0YaiAcPNftr55EBvmKz2vym",
          description: "General Grade 12"
        }
      ]
    }
  ];

  const VideoCard = ({ video, videoKey }: { video: any; videoKey: string }) => {
    const isExpanded = expandedVideo === videoKey;
    
    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-purple-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-purple-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-purple-300">
                  {video.isPlaylist ? "Playlist" : "Video"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
            <div className="ml-4">
              {video.isPlaylist ? (
                <List className="h-8 w-8 text-purple-600" />
              ) : (
                <PlayCircle className="h-8 w-8 text-purple-600" />
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
          <h3 className="text-2xl font-bold text-purple-800 mb-4 border-b-2 border-purple-200 pb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 mb-4">
            Canadian Curriculum Mathematics
          </h1>
          <p className="text-xl text-purple-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for Canadian high school mathematics, focusing on Ontario curriculum for Grade 10 Academic Mathematics (MPM2D) and Grade 12 Calculus and Vectors (MCV4U).
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeUnit} onValueChange={setActiveUnit} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-purple-100">
            <TabsTrigger 
              value="grade10" 
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold"
            >
              Grade 10 Mathematics
            </TabsTrigger>
            <TabsTrigger 
              value="grade12"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold"
            >
              Grade 12 Mathematics
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
        <div className="mt-12 p-6 bg-purple-100 rounded-lg border-2 border-purple-200">
          <p className="text-sm text-purple-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help Canadian students find the best mathematical content available online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CanadianVideoHub;
