
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, PlayCircle, List, Play } from "lucide-react";

const CBSEVideoHub = () => {
  const [activeUnit, setActiveUnit] = useState("class10");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const class10Topics = [
    {
      unit: "General Class 10",
      videos: [
        {
          title: "CBSE Class 10th Complete Maths",
          educator: "Infinity Learn 9&10",
          isPlaylist: true,
          playlistId: "PLXlae0RXTn4iOwo0MKeuqjTpmtPahOQK",
          description: "Complete Course"
        }
      ]
    },
    {
      unit: "Algebra",
      videos: [
        {
          title: "Chapter 2 - Polynomials - Maths Class 10 CBSE",
          educator: "Mathematics Class X",
          isPlaylist: true,
          playlistId: "PLSYQ3WiyH7wwgvz4E4Ox5_FRu9RgFNJNm",
          description: "Polynomials"
        },
        {
          title: "CBSE Class 10 Maths Pair of linear equations in two variables Animation",
          educator: "ExamQA",
          videoId: "hhmMvPsjOlg",
          description: "Pair of Linear Equations"
        },
        {
          title: "Class - 10th, Maths Ch - 5, Arithmetic Progressions New NCERT CBSE",
          educator: "GREEN Board",
          videoId: "-hpgsPJLCSI",
          description: "Arithmetic Progressions"
        }
      ]
    },
    {
      unit: "Geometry",
      videos: [
        {
          title: "Circles: Class 10 Maths",
          educator: "NumberX",
          isPlaylist: true,
          playlistId: "PLH0jTWbuqbtFk8QELjx4lmY646dWOUSSC",
          description: "Circles"
        }
      ]
    },
    {
      unit: "Trigonometry",
      videos: [
        {
          title: "Introduction to Trigonometry CBSE Class 10 Maths Mathematics",
          educator: "LearnoHub - Class 11, 12",
          isPlaylist: true,
          playlistId: "PLE9BA4323CE202752",
          description: "Introduction to Trigonometry"
        },
        {
          title: "CBSE Class 10 Maths Trigonometric Identities Animation in English",
          educator: "ExamQA",
          videoId: "DfO4xnnwKvg",
          description: "Trigonometric Identities"
        }
      ]
    },
    {
      unit: "Mensuration",
      videos: [
        {
          title: "Class 10 Surface Areas and Volumes Complete By Green Board",
          educator: "GREEN Board",
          isPlaylist: true,
          playlistId: "PLIlJ3MdWYpocjT-MybhoMi9Bf8QgdxKAU",
          description: "Surface Areas and Volumes"
        }
      ]
    },
    {
      unit: "Statistics & Probability",
      videos: [
        {
          title: "CBSE Class 10 Maths Statistics by LearnCBSE.in",
          educator: "GyanPub Learning",
          isPlaylist: true,
          playlistId: "PLItJjtWTBUw4AwzErprK1dLTpI8tG8yJ5",
          description: "Statistics"
        }
      ]
    }
  ];

  const class12Topics = [
    {
      unit: "Relations and Functions",
      videos: [
        {
          title: "Relations and Functions One Shot I Morning Session on Relation and Function Class 12 I Class 12 Math",
          educator: "YouTube",
          videoId: "s23CWs9YQcc",
          description: "Relations and Functions"
        },
        {
          title: "CBSE Class 12 Maths Chapter 2 Inverse Trigonometric Function",
          educator: "UpSkill Excel",
          isPlaylist: true,
          playlistId: "PLkD55fvkjW37OklLcxL7gsPUN7f_zsc5T",
          description: "Inverse Trigonometric Functions"
        }
      ]
    },
    {
      unit: "Algebra",
      videos: [
        {
          title: "Class 12 Maths Matrices Topic Wise",
          educator: "Kaksha Kendra",
          isPlaylist: true,
          playlistId: "PLONitmNdBWFFDId3qd7J8leLMJF8opeCt",
          description: "Matrices"
        },
        {
          title: "class 12 maths chapter 4 determinants",
          educator: "NCERTHELP",
          isPlaylist: true,
          playlistId: "PLauXkHsTK5c_3IqjODZSmUTtq4Dt_rTbL",
          description: "Determinants"
        }
      ]
    },
    {
      unit: "Calculus",
      videos: [
        {
          title: "Class 12 - Continuity & Differentiability",
          educator: "Math&Me - Nikhila Sankar",
          isPlaylist: true,
          playlistId: "PLYCPm82_6450k9Dfto0e_vs75bjYkQdgd",
          description: "Continuity and Differentiability"
        },
        {
          title: "Applications of Derivatives Class 12 Full Chapter (2024)",
          educator: "YouTube",
          videoId: "H2EtL2Pu3j4",
          description: "Applications of Derivatives"
        },
        {
          title: "CBSE Class 12 Maths Chapter 7 Integrals",
          educator: "UpSkill Excel",
          isPlaylist: true,
          playlistId: "PLkD55fvkjW35Syn8170giQWKp22iKYQVg",
          description: "Integrals"
        },
        {
          title: "Class 12th Chapter 8 Application Of Integrals PYQS and Important Questions",
          educator: "Mathematics Untold",
          isPlaylist: true,
          playlistId: "PLRTnAds52wM8s1eHupXoAVPqZj2tTFSFQ",
          description: "Applications of Integrals"
        }
      ]
    },
    {
      unit: "Linear Programming",
      videos: [
        {
          title: "Chapter 12 Linear Programming Class 12 Maths",
          educator: "All About Mathematics - Nitin Goyal",
          isPlaylist: true,
          playlistId: "PLhWL6AUdPvhJtR49XvFXbHQZBy-qJIIES",
          description: "Linear Programming"
        }
      ]
    },
    {
      unit: "Probability",
      videos: [
        {
          title: "Probability Class 12",
          educator: "R B Classes Maths CBSE Class",
          isPlaylist: true,
          playlistId: "PLcWcbMyDDiuQWzPfVOHJ-AYYh7kCi2wUu",
          description: "Probability"
        }
      ]
    }
  ];

  const VideoCard = ({ video, videoKey }: { video: any; videoKey: string }) => {
    const isExpanded = expandedVideo === videoKey;
    
    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-teal-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-teal-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-teal-300">
                  {video.isPlaylist ? "Playlist" : "Video"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
            <div className="ml-4">
              {video.isPlaylist ? (
                <List className="h-8 w-8 text-teal-600" />
              ) : (
                <PlayCircle className="h-8 w-8 text-teal-600" />
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
          <h3 className="text-2xl font-bold text-teal-800 mb-4 border-b-2 border-teal-200 pb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-500 mb-4">
            CBSE Mathematics (India)
          </h1>
          <p className="text-xl text-teal-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for CBSE Mathematics covering Class 10 and Class 12 syllabus with emphasis on conceptual understanding and exam preparation.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-teal-400 to-sky-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeUnit} onValueChange={setActiveUnit} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-teal-100">
            <TabsTrigger 
              value="class10" 
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white font-semibold"
            >
              Class 10 Mathematics
            </TabsTrigger>
            <TabsTrigger 
              value="class12"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white font-semibold"
            >
              Class 12 Mathematics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="class10" className="mt-6">
            <TopicSection topics={class10Topics} />
          </TabsContent>

          <TabsContent value="class12" className="mt-6">
            <TopicSection topics={class12Topics} />
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-teal-100 rounded-lg border-2 border-teal-200">
          <p className="text-sm text-teal-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help CBSE students find the best mathematical content available online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CBSEVideoHub;
