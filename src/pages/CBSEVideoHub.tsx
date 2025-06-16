
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, ExternalLink } from "lucide-react";

const CBSEVideoHub = () => {
  const [activeClass, setActiveClass] = useState("class10");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const class10Topics = [
    {
      unit: "General",
      videos: [
        {
          title: "CBSE Class 10th Complete Maths",
          educator: "Infinity Learn 9&10",
          isPlaylist: true,
          playlistId: "PLXlae0RXTn4iOwo0MKeuqjTpmtPahOQK",
          description: "Complete Maths"
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
          title: "CBSE Class 10 Maths Pair of linear equations in two variables",
          educator: "ExamQA",
          videoId: "hhmMvPsjOlg",
          description: "Pair of Linear Equations in Two Variables"
        },
        {
          title: "Class - 10th, Maths Ch - 5, Arithmetic Progressions",
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
          title: "CBSE Class 10 Maths Trigonometric Identities",
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
          title: "Relations and Functions One Shot",
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
          description: "Applications of the Integrals"
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

  const VideoCard = ({ video }: { video: any }) => {
    const videoKey = video.videoId || video.playlistId || video.externalUrl;
    const isPlaying = playingVideo === videoKey;

    if (video.isExternal) {
      return (
        <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-pink-100">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base font-bold text-pink-800 mb-2 line-clamp-2">
                  {video.title}
                </CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 text-xs">
                    {video.educator}
                  </Badge>
                  <Badge variant="outline" className="border-pink-300 text-xs">
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
              className="block w-full p-4 bg-pink-50 rounded-lg border-2 border-pink-200 hover:bg-pink-100 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <ExternalLink className="h-5 w-5 text-pink-600" />
                <span className="text-pink-800 font-medium">Visit External Resource</span>
              </div>
            </a>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-pink-100">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-bold text-pink-800 mb-2 line-clamp-2">
                {video.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-pink-100 text-pink-800 text-xs">
                  {video.educator}
                </Badge>
                <Badge variant="outline" className="border-pink-300 text-xs">
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
          <h3 className="text-xl font-bold text-pink-800 mb-3 border-b-2 border-pink-200 pb-2">
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 mb-4">
            CBSE Mathematics
          </h1>
          <p className="text-xl text-pink-800 max-w-3xl mx-auto leading-relaxed">
            Comprehensive video resources for CBSE Mathematics curriculum covering Class 10 and Class 12. Content aligned with NCERT syllabus and board examination patterns.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-red-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeClass} onValueChange={setActiveClass} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-pink-100">
            <TabsTrigger 
              value="class10" 
              className="data-[state=active]:bg-pink-500 data-[state=active]:text-white font-semibold"
            >
              Class 10
            </TabsTrigger>
            <TabsTrigger 
              value="class12"
              className="data-[state=active]:bg-pink-500 data-[state=active]:text-white font-semibold"
            >
              Class 12
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
        <div className="mt-12 p-6 bg-pink-100 rounded-lg border-2 border-pink-200">
          <p className="text-sm text-pink-800 text-center">
            <strong>Note:</strong> All videos are created by their respective educators and hosted on YouTube. 
            This is a curated collection to help CBSE students find the best mathematical content aligned with the board syllabus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CBSEVideoHub;
