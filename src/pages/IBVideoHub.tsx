import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, PlayCircle, List, Play } from "lucide-react";

const IBVideoHub = () => {
  const [activeUnit, setActiveUnit] = useState("ai-sl-hl");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const aiTopics = [
    {
      unit: "Number and Algebra",
      videos: [
        {
          title: "Exponential Operations and Laws (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "tE6_7FXwE34",
          description: "Exponential Operations"
        },
        {
          title: "IB Maths AA SL Number and Algebra (sequences, logs, binomial expansion, proof)",
          educator: "IB Maths & Physics Tutor",
          isPlaylist: true,
          playlistId: "PLhFaFjGB-Dcfw9GC9PTzUCg2XjjR7iF1O",
          description: "Sequences & Series (Arithmetic & Geometric)"
        },
        {
          title: "Compound Interest and Depreciation (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "H5-GPWfysto",
          description: "Applications of Geometric Sequences"
        },
        {
          title: "Exponential Growth and Logarithms (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "3gGTPqenLng",
          description: "Exponential Growth & Logarithms"
        },
        {
          title: "Percentage Error and Significant Figures (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "pAHG3YNuNEc",
          description: "Approximations"
        },
        {
          title: "Annuities and Amortisation (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "S58ceKesuXE",
          description: "Annuities & Amortisation"
        },
        {
          title: "Solving Systems of Linear Equations with Technology (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "5IZ8gpRDB0g",
          description: "Systems of Linear Equations"
        },
        {
          title: "Complex Numbers",
          educator: "Eddie Woo",
          isPlaylist: true,
          playlistId: "PL5KkMZvBpo5CE__2qeqZQa5e8gSkt1Ypy",
          description: "Complex Numbers (HL)"
        }
      ]
    },
    {
      unit: "Functions",
      videos: [
        {
          title: "Functions",
          educator: "HackMyIBMath",
          isPlaylist: true,
          playlistId: "PLwAIYmV7sGry10ffB9lzk0XIvBkoH2RvY",
          description: "General Functions"
        },
        {
          title: "Domain, Range, and Inverse Functions (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "0efE0wbdSNI",
          description: "Domain, Range, Inverse Functions"
        },
        {
          title: "Graphing Functions and Key Features (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "pwURKXdbmV0",
          description: "Graphing Functions"
        },
        {
          title: "Sinusoidal Models (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "jXBz277WKqc",
          description: "Sinusoidal Models"
        },
        {
          title: "Modelling Piecewise Functions (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "QOShdsyMMxA",
          description: "Piecewise Functions"
        },
        {
          title: "Composite Functions (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "q8xXeM_C92w",
          description: "Composite Functions"
        },
        {
          title: "Inverse Functions (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "p4vAHM7oc7E",
          description: "Inverse Functions"
        },
        {
          title: "Transformations of Graphs (IB Math AI SL)",
          educator: "ExamQA",
          videoId: "5bX5gi51vaA",
          description: "Transformations of Graphs"
        }
      ]
    }
  ];

  const hlTopics = [
    {
      unit: "General HL Content",
      videos: [
        {
          title: "IB MATH AA SL/HL",
          educator: "MathSci Consult",
          isPlaylist: true,
          playlistId: "PLBbHTAJNSH4kNPV3iQobCIJYN9hjCkmkA",
          description: "Full Course (AA SL/HL)"
        }
      ]
    }
  ];

  const VideoCard = ({ video, videoKey }: { video: any; videoKey: string }) => {
    const isExpanded = expandedVideo === videoKey;
    
    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-blue-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-blue-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-blue-300">
                  {video.isPlaylist ? "Playlist" : "Video"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
            <div className="ml-4">
              {video.isPlaylist ? (
                <List className="h-8 w-8 text-blue-600" />
              ) : (
                <PlayCircle className="h-8 w-8 text-blue-600" />
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
          <h3 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 mb-4">
            IB Mathematics
          </h1>
          <p className="text-xl text-blue-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for IB Mathematics covering Analysis and Approaches (AA) and Applications and Interpretation (AI) at both Standard Level (SL) and Higher Level (HL).
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeUnit} onValueChange={setActiveUnit} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-blue-100">
            <TabsTrigger 
              value="ai-sl-hl" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold"
            >
              Math AI (SL/HL)
            </TabsTrigger>
            <TabsTrigger 
              value="hl-additional"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold"
            >
              HL Additional Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-sl-hl" className="mt-6">
            <TopicSection topics={aiTopics} />
          </TabsContent>

          <TabsContent value="hl-additional" className="mt-6">
            <TopicSection topics={hlTopics} />
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-blue-100 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help IB students find the best mathematical content available online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IBVideoHub;
