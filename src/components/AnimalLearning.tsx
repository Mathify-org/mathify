
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bird, Bug, Cat } from "lucide-react";

const AnimalLearning = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="mb-10">
      <Tabs defaultValue="animals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="animals" className="text-lg py-4 flex items-center gap-2 data-[state=active]:bg-purple-100">
            <Cat className="h-5 w-5" /> Animals
          </TabsTrigger>
          <TabsTrigger value="insects" className="text-lg py-4 flex items-center gap-2 data-[state=active]:bg-green-100">
            <Bug className="h-5 w-5" /> Insects
          </TabsTrigger>
          <TabsTrigger value="birds" className="text-lg py-4 flex items-center gap-2 data-[state=active]:bg-blue-100">
            <Bird className="h-5 w-5" /> Birds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="animals" className="mt-4">
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div custom={0} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Cat className="h-6 w-6" /> What are Animals?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p>Animals are multicellular organisms that form the biological kingdom Animalia. They are eukaryotic, meaning their cells have a nucleus enclosed within a membrane.</p>
                  <ul className="mt-4 space-y-2 list-disc pl-5">
                    <li>They have bodies made of many cells</li>
                    <li>They eat other organisms for food</li>
                    <li>They can usually move around</li>
                    <li>They respond quickly to their environment</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={1} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full bg-gradient-to-br from-white to-purple-50">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1485833077593-4278bba3f11f" 
                    alt="Deer"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Examples of Animals</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="bg-purple-100 p-1 rounded-full">🦁</span> Lions, tigers, and cats
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-purple-100 p-1 rounded-full">🐕</span> Dogs, wolves, and foxes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-purple-100 p-1 rounded-full">🐘</span> Elephants and giraffes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-purple-100 p-1 rounded-full">🐋</span> Whales and dolphins
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="insects" className="mt-4">
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div custom={0} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-6 w-6" /> What are Insects?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p>Insects are a class of invertebrates within the arthropod group that have a three-part body, three pairs of jointed legs, and one pair of antennae.</p>
                  <ul className="mt-4 space-y-2 list-disc pl-5">
                    <li>They have an exoskeleton (hard outer covering)</li>
                    <li>They have six legs (three pairs)</li>
                    <li>Most have wings as adults</li>
                    <li>They have three body parts: head, thorax, and abdomen</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={1} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full bg-gradient-to-br from-white to-green-50">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1498936178812-4b2e558d2937" 
                    alt="Bees"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Examples of Insects</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="bg-green-100 p-1 rounded-full">🦋</span> Butterflies and moths
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-green-100 p-1 rounded-full">🐝</span> Bees, wasps, and ants
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-green-100 p-1 rounded-full">🪲</span> Beetles and ladybugs
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-green-100 p-1 rounded-full">🦗</span> Grasshoppers and crickets
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="birds" className="mt-4">
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div custom={0} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Bird className="h-6 w-6" /> What are Birds?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p>Birds are a group of warm-blooded vertebrates characterized by feathers, toothless beaked jaws, a high metabolic rate, and a strong lightweight skeleton.</p>
                  <ul className="mt-4 space-y-2 list-disc pl-5">
                    <li>They have feathers (the only animals that do!)</li>
                    <li>They have wings (though not all birds can fly)</li>
                    <li>They have beaks or bills instead of teeth</li>
                    <li>Most birds lay eggs with hard shells</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={1} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full bg-gradient-to-br from-white to-blue-50">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1441057206919-63d19fac2369" 
                    alt="Penguins"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Examples of Birds</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="bg-blue-100 p-1 rounded-full">🦅</span> Eagles and hawks
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-blue-100 p-1 rounded-full">🦜</span> Parrots and finches
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-blue-100 p-1 rounded-full">🦆</span> Ducks and swans
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="bg-blue-100 p-1 rounded-full">🐧</span> Penguins (birds that can't fly!)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimalLearning;
