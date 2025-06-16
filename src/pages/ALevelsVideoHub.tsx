
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, PlayCircle, List, Play } from "lucide-react";

const ALevelsVideoHub = () => {
  const [activeUnit, setActiveUnit] = useState("pure");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const pureTopics = [
    {
      unit: "Proof",
      videos: [
        {
          title: "Proof by Contradiction Chapter 1 section 1 Edexcel Pure A Level",
          educator: "Pete Hart",
          isPlaylist: true,
          playlistId: "PLTgS_vvDEfwYkhyhHv4rz-GY69X5HQooq",
          description: "Proof by Contradiction (Edexcel)"
        },
        {
          title: "Proof by Contradiction Example (A-Level Maths)",
          educator: "ExamQA",
          videoId: "Rc4xVMS6UNY",
          description: "Proof by Contradiction (Example)"
        },
        {
          title: "How to prove that the square of any natural number is either a multiple of three or one more than a multiple of three",
          educator: "ExamSolutions",
          videoId: "CtbremWlV8M",
          description: "Proof by Contradiction (Irrational Numbers)"
        },
        {
          title: "Methods of Proof (A-Level Maths)",
          educator: "ExamSolutions",
          videoId: "ZhhBegRbvkA",
          description: "Methods of Proof"
        }
      ]
    },
    {
      unit: "Algebra & Functions",
      videos: [
        {
          title: "A-level Maths: Indices & Surds",
          educator: "ExamQA",
          videoId: "4eml8adM-1w",
          description: "Indices & Surds"
        },
        {
          title: "Common Mistakes with Indices (A-Level Maths)",
          educator: "ExamQA",
          videoId: "PV2t07bh20M",
          description: "Indices & Surds (Common Mistakes)"
        },
        {
          title: "Solving Quadratic Equations (A-Level Maths)",
          educator: "ExamQA",
          videoId: "P1JEwCZIV5s",
          description: "Quadratics"
        },
        {
          title: "Quadratic Formula (A-Level Maths)",
          educator: "OnMaths",
          videoId: "S_7m6ye6PBY",
          description: "Quadratics (Formula)"
        },
        {
          title: "Partial Fractions (A-Level Maths)",
          educator: "ExamQA",
          videoId: "m7JroxXuVa8",
          description: "Partial Fractions"
        },
        {
          title: "Transformations of Graphs (A-Level Maths)",
          educator: "ExamQA",
          videoId: "v4L2ztR9y44",
          description: "Graphs of Functions (Transformations)"
        }
      ]
    },
    {
      unit: "Coordinate Geometry",
      videos: [
        {
          title: "Coordinate Geometry - A-LEVEL PURE MATHS",
          educator: "A-Level Maths Tutor UK",
          isPlaylist: true,
          playlistId: "PLJ--4OzyIjOMlI7awthEwfAbvAbANo07P",
          description: "General Coordinate Geometry"
        },
        {
          title: "Applications of Coordinate Geometry in Real Life",
          educator: "ExamQA",
          videoId: "yPZ9eGpwZbc",
          description: "Applications"
        }
      ]
    },
    {
      unit: "Trigonometry",
      videos: [
        {
          title: "Edexcel Pure Maths Year 1 - Chapter 10 Trigonometric Identities and Equations",
          educator: "Zeeshan Zamurred",
          isPlaylist: true,
          playlistId: "PLo41lMdYNV1kbzFeHvjgqhuLsR3xZtC3u",
          description: "Identities & Equations"
        },
        {
          title: "Solving Trigonometric Equations (A-Level Maths)",
          educator: "ExamQA",
          videoId: "YBnajqEum8k",
          description: "Solving Equations"
        }
      ]
    },
    {
      unit: "Differentiation",
      videos: [
        {
          title: "Differentiation from First Principles (A-Level Maths)",
          educator: "ExamQA",
          videoId: "dQra7GGeGJw",
          description: "First Principles"
        },
        {
          title: "Connected Rates of Change (A-Level Maths)",
          educator: "ExamQA",
          videoId: "79fVFma90fo",
          description: "Connected Rates of Change"
        }
      ]
    },
    {
      unit: "Integration",
      videos: [
        {
          title: "Integration by Substitution (A-Level Maths)",
          educator: "ExamQA",
          videoId: "4MS5t0NnZ58",
          description: "by Substitution"
        },
        {
          title: "Integration by Parts (A-Level Maths)",
          educator: "ExamQA",
          videoId: "__Kk0HkYPSs",
          description: "by Parts"
        }
      ]
    },
    {
      unit: "Vectors",
      videos: [
        {
          title: "Vectors in 3D (A-Level Maths)",
          educator: "ExamQA",
          videoId: "wFLuf1ioQy0",
          description: "3 Dimensions"
        },
        {
          title: "Parallel Vectors (A-Level Maths)",
          educator: "ExamQA",
          videoId: "rGN_TUi4y3c",
          description: "Parallel Vectors"
        }
      ]
    }
  ];

  const statisticsTopics = [
    {
      unit: "Statistics",
      videos: [
        {
          title: "A level Maths - Statistics",
          educator: "MME",
          isPlaylist: true,
          playlistId: "PLHnDkwDE03A9XHx5vXRUFrX3cZeoFl9Me",
          description: "Full Course"
        }
      ]
    }
  ];

  const mechanicsTopics = [
    {
      unit: "Mechanics",
      videos: [
        {
          title: "A Level FULL COURSE Revision Playlist",
          educator: "Neil Does Maths",
          isPlaylist: true,
          playlistId: "PLHI7Fe_hIbjReiZTIycfzZCmR3P0mZ0Mp",
          description: "General"
        }
      ]
    }
  ];

  const VideoCard = ({ video, videoKey }: { video: any; videoKey: string }) => {
    const isExpanded = expandedVideo === videoKey;
    
    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-amber-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-amber-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-amber-300">
                  {video.isPlaylist ? "Playlist" : "Video"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
            <div className="ml-4">
              {video.isPlaylist ? (
                <List className="h-8 w-8 text-amber-600" />
              ) : (
                <PlayCircle className="h-8 w-8 text-amber-600" />
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
          <h3 className="text-2xl font-bold text-amber-800 mb-4 border-b-2 border-amber-200 pb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 mb-4">
            A-Levels Mathematics
          </h1>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for A-Level Mathematics covering all exam boards (AQA, Edexcel, OCR). 
            Curated content from top educators to help you master Pure Mathematics, Statistics, and Mechanics.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeUnit} onValueChange={setActiveUnit} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-amber-100">
            <TabsTrigger 
              value="pure" 
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white font-semibold"
            >
              Pure Mathematics
            </TabsTrigger>
            <TabsTrigger 
              value="statistics"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white font-semibold"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="mechanics"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white font-semibold"
            >
              Mechanics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pure" className="mt-6">
            <TopicSection topics={pureTopics} />
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <TopicSection topics={statisticsTopics} />
          </TabsContent>

          <TabsContent value="mechanics" className="mt-6">
            <TopicSection topics={mechanicsTopics} />
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-amber-100 rounded-lg border-2 border-amber-200">
          <p className="text-sm text-amber-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help A-Level students find the best mathematical content available online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ALevelsVideoHub;
