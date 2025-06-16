
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, PlayCircle, List, Play } from "lucide-react";

const AustralianVideoHub = () => {
  const [activeUnit, setActiveUnit] = useState("year10");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const year10Topics = [
    {
      unit: "Number and Algebra",
      videos: [
        {
          title: "Year 10: equations, inequations and formulas",
          educator: "Australian Mathematics Curriculum Videos",
          isPlaylist: true,
          playlistId: "PLFii7T4nH7JKEOfN02VMdkOZLujZEtq0p",
          description: "Equations, Inequations and Formulas"
        }
      ]
    },
    {
      unit: "Measurement and Geometry",
      videos: [
        {
          title: "Year 10 Advanced Mathematics Measurement and Geometry",
          educator: "The Maths Hack with Ken Herbert",
          isPlaylist: true,
          playlistId: "PL99wRuEaY2-okVwO4W0rD5iUst_IwCavW",
          description: "Advanced Mathematics Measurement and Geometry"
        }
      ]
    },
    {
      unit: "Statistics and Probability",
      videos: [
        {
          title: "Year 10: Probability",
          educator: "Australian Mathematics Curriculum Videos",
          isPlaylist: true,
          playlistId: "PLFii7T4nH7JKMxqFJAUd7NsSBcyfTqWvg",
          description: "Probability"
        }
      ]
    }
  ];

  const year12Topics = [
    {
      unit: "Essential Mathematics",
      videos: [
        {
          title: "Australia Year 12 Maths",
          educator: "StudyPug",
          isPlaylist: true,
          playlistId: "PLdTPQ62ogX0aQRvPBzadGQlnNzc-bZ9ne",
          description: "General Content"
        }
      ]
    },
    {
      unit: "General Mathematics",
      videos: [
        {
          title: "Maths A / General Course, Grade 11/12, High School, Queensland, Australia",
          educator: "Magic Monk",
          isPlaylist: true,
          playlistId: "PLzr5fRV1AGV9bETjmB86uxgxMNfUAFF7-",
          description: "General Course"
        }
      ]
    },
    {
      unit: "Mathematical Methods",
      videos: [
        {
          title: "Year 12 Methods",
          educator: "Nat Ayton",
          isPlaylist: true,
          playlistId: "PLOrlAArWMW_UxMIHTCYTaLAjldDyDOjHR",
          description: "Mathematical Methods"
        }
      ]
    },
    {
      unit: "Specialist Mathematics",
      videos: [
        {
          title: "Year 12 Specialist Maths",
          educator: "Maths IGS",
          isPlaylist: true,
          playlistId: "PL_uwtU_B4vq3RoK6izhYHbcEEie3BSsT-",
          description: "Specialist Mathematics"
        }
      ]
    }
  ];

  const VideoCard = ({ video, videoKey }: { video: any; videoKey: string }) => {
    const isExpanded = expandedVideo === videoKey;
    
    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-orange-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-orange-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-orange-300">
                  {video.isPlaylist ? "Playlist" : "Video"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
            <div className="ml-4">
              {video.isPlaylist ? (
                <List className="h-8 w-8 text-orange-600" />
              ) : (
                <PlayCircle className="h-8 w-8 text-orange-600" />
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
          <h3 className="text-2xl font-bold text-orange-800 mb-4 border-b-2 border-orange-200 pb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-4">
            Australian Curriculum Mathematics
          </h1>
          <p className="text-xl text-orange-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for Australian Mathematics covering Year 10 and Year 12 specialized subjects including Essential, General, Mathematical Methods, and Specialist Mathematics.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeUnit} onValueChange={setActiveUnit} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-orange-100">
            <TabsTrigger 
              value="year10" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-semibold"
            >
              Year 10 Mathematics
            </TabsTrigger>
            <TabsTrigger 
              value="year12"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-semibold"
            >
              Year 12 Mathematics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="year10" className="mt-6">
            <TopicSection topics={year10Topics} />
          </TabsContent>

          <TabsContent value="year12" className="mt-6">
            <TopicSection topics={year12Topics} />
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-orange-100 rounded-lg border-2 border-orange-200">
          <p className="text-sm text-orange-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help Australian students find the best mathematical content available online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AustralianVideoHub;
