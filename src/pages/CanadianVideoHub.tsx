
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, ExternalLink } from "lucide-react";

const CanadianVideoHub = () => {
  const [activeGrade, setActiveGrade] = useState("grade10");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const grade10Topics = [
    {
      unit: "General",
      videos: [
        {
          title: "Grade 10 Math (Canada)",
          educator: "StudyPug",
          isPlaylist: true,
          playlistId: "PLdTPQ62ogX0bTZN8tonkVP0pyYEsrLgts",
          description: "Grade 10 Math (Canada)"
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
          description: "Grade 10 Analytic Geometry"
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
          description: "Mathematics [Euclidean Geometry] Grade 10"
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
          description: "Grade 10 Quadratic Functions - Vertex Form"
        }
      ]
    },
    {
      unit: "Quadratic Expressions/Equations",
      videos: [
        {
          title: "MPM 2D - Grade 10 Academic Mathematics",
          educator: "Mr. Gray - Math",
          isPlaylist: true,
          playlistId: "PL1iIYRb9fb5UrrDXVEIRdhsdkW9OIdHSF",
          description: "MPM 2D - Grade 10 Academic Mathematics"
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
          description: "Grade 12 Math (Canada)"
        }
      ]
    }
  ];

  const VideoCard = ({ video }: { video: any }) => {
    const videoKey = video.videoId || video.playlistId || video.externalUrl;
    const isPlaying = playingVideo === videoKey;

    if (video.isExternal) {
      return (
        <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-purple-100">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base font-bold text-purple-800 mb-2 line-clamp-2">
                  {video.title}
                </CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                    {video.educator}
                  </Badge>
                  <Badge variant="outline" className="border-purple-300 text-xs">
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
              className="block w-full p-4 bg-purple-50 rounded-lg border-2 border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <ExternalLink className="h-5 w-5 text-purple-600" />
                <span className="text-purple-800 font-medium">Visit External Resource</span>
              </div>
            </a>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-purple-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-bold text-purple-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-purple-300 text-xs">
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
          <h3 className="text-xl font-bold text-purple-800 mb-3 border-b-2 border-purple-200 pb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 mb-4">
            Canadian Mathematics
          </h1>
          <p className="text-xl text-purple-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for Canadian Mathematics curriculum covering Grade 10 Academic Mathematics (MPM2D) and Grade 12 Calculus and Vectors (MCV4U).
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeGrade} onValueChange={setActiveGrade} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-purple-100">
            <TabsTrigger 
              value="grade10" 
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold"
            >
              Grade 10
            </TabsTrigger>
            <TabsTrigger 
              value="grade12"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold"
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
        <div className="mt-12 p-6 bg-purple-100 rounded-lg border-2 border-purple-200">
          <p className="text-sm text-purple-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help Canadian students find the best mathematical content aligned with provincial curricula.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CanadianVideoHub;
