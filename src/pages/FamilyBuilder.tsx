import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Baby, Crown, Heart, Home, ArrowLeft, RotateCcw, CheckCircle, Star, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface FamilyMember {
  id: string;
  name: string;
  type: 'father' | 'mother' | 'son' | 'daughter' | 'grandfather' | 'grandmother' | 'uncle' | 'aunt' | 'cousin';
  generation: number;
  x: number;
  y: number;
}

interface ActionHistory {
  type: 'add_member' | 'move_member';
  data: any;
  timestamp: number;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  familyType: 'nuclear' | 'extended' | 'joint' | 'single-parent' | 'blended';
  requiredMembers: string[];
  mathQuestion: string;
  correctAnswer: number;
  hint: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Nuclear Family",
    description: "Build a nuclear family with 2 parents and 2 children in proper layers",
    familyType: "nuclear",
    requiredMembers: ["father", "mother", "son", "daughter"],
    mathQuestion: "How many people are in this nuclear family?",
    correctAnswer: 4,
    hint: "Count all the family members you placed"
  },
  {
    id: 2,
    title: "Extended Family",
    description: "Create an extended family with grandparents, parents, and children in 3 generations",
    familyType: "extended",
    requiredMembers: ["grandfather", "grandmother", "father", "mother", "son", "daughter"],
    mathQuestion: "How many generations are represented in this family tree?",
    correctAnswer: 3,
    hint: "Count from grandparents to grandchildren"
  },
  {
    id: 3,
    title: "Joint Family",
    description: "Build a joint family with uncle, aunt, and cousins arranged in layers",
    familyType: "joint",
    requiredMembers: ["father", "mother", "son", "daughter", "uncle", "aunt", "cousin"],
    mathQuestion: "How many children are in this joint family?",
    correctAnswer: 3,
    hint: "Count sons, daughters, and cousins"
  },
  {
    id: 4,
    title: "Single Parent Family",
    description: "Create a single parent family with one parent and children in layers",
    familyType: "single-parent",
    requiredMembers: ["mother", "son", "daughter"],
    mathQuestion: "What's the total number of family members?",
    correctAnswer: 3,
    hint: "Count all the family members you placed"
  }
];

const memberTypes: { type: FamilyMember['type'], label: string, icon: string, color: string }[] = [
  { type: 'father', label: 'Father', icon: '👨', color: 'bg-blue-500' },
  { type: 'mother', label: 'Mother', icon: '👩', color: 'bg-pink-500' },
  { type: 'son', label: 'Son', icon: '👦', color: 'bg-green-500' },
  { type: 'daughter', label: 'Daughter', icon: '👧', color: 'bg-purple-500' },
  { type: 'grandfather', label: 'Grandfather', icon: '👴', color: 'bg-gray-600' },
  { type: 'grandmother', label: 'Grandmother', icon: '👵', color: 'bg-gray-500' },
  { type: 'uncle', label: 'Uncle', icon: '👨‍🦳', color: 'bg-orange-500' },
  { type: 'aunt', label: 'Aunt', icon: '👩‍🦳', color: 'bg-yellow-500' },
  { type: 'cousin', label: 'Cousin', icon: '🧒', color: 'bg-indigo-500' }
];

const FamilyBuilder: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [score, setScore] = useState(0);
  const [showMathQuestion, setShowMathQuestion] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
  const [draggedMember, setDraggedMember] = useState<string | null>(null);
  const [dropZoneActive, setDropZoneActive] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const startGame = () => {
    setGameStarted(true);
    setCurrentChallenge(0);
    setScore(0);
    resetChallenge();
  };

  const resetChallenge = () => {
    setFamilyMembers([]);
    setShowMathQuestion(false);
    setUserAnswer('');
    setShowResult(false);
    setChallengeCompleted(false);
    setActionHistory([]);
    setDraggedMember(null);
    setDropZoneActive(null);
  };

  const addFamilyMember = (type: FamilyMember['type']) => {
    const generation = getGeneration(type);
    const { x, y } = getGenerationPosition(generation);
    
    const newMember: FamilyMember = {
      id: `${type}_${Date.now()}`,
      name: memberTypes.find(m => m.type === type)?.label || type,
      type: type,
      generation: generation,
      x: x,
      y: y
    };
    
    const action: ActionHistory = {
      type: 'add_member',
      data: { member: newMember },
      timestamp: Date.now()
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setActionHistory([...actionHistory, action]);
  };

  const getGeneration = (type: string): number => {
    if (type === 'grandfather' || type === 'grandmother') return 1;
    if (type === 'father' || type === 'mother' || type === 'uncle' || type === 'aunt') return 2;
    return 3;
  };

  const getGenerationPosition = (generation: number) => {
    const canvasWidth = 800;
    const padding = 60;
    const layerHeight = 80;
    const layerTop = 20;
    
    // Calculate Y position based on generation
    let y = layerTop + (generation - 1) * layerHeight + layerHeight / 2;
    
    // Find how many members are already in this generation
    const membersInGeneration = familyMembers.filter(m => m.generation === generation);
    const spacing = 120;
    const totalWidth = Math.max(1, membersInGeneration.length + 1) * spacing;
    const startX = (canvasWidth - totalWidth) / 2;
    
    // Position new member next to existing ones
    const x = startX + (membersInGeneration.length) * spacing + spacing / 2;
    
    return { x, y };
  };

  const snapToLayer = (x: number, y: number, generation: number) => {
    const layerHeight = 80;
    const layerTop = 20;
    const targetY = layerTop + (generation - 1) * layerHeight + layerHeight / 2;
    
    // Snap to appropriate layer if close enough
    if (Math.abs(y - targetY) < 40) {
      return { x, y: targetY };
    }
    
    // Check if being dragged to a different layer
    for (let gen = 1; gen <= 3; gen++) {
      const genY = layerTop + (gen - 1) * layerHeight + layerHeight / 2;
      if (Math.abs(y - genY) < 40) {
        return { x, y: genY };
      }
    }
    
    return { x, y };
  };

  const getLayerFromY = (y: number): number => {
    const layerHeight = 80;
    const layerTop = 20;
    
    for (let gen = 1; gen <= 3; gen++) {
      const genY = layerTop + (gen - 1) * layerHeight + layerHeight / 2;
      if (Math.abs(y - genY) < 40) {
        return gen;
      }
    }
    
    return 0; // Invalid layer
  };

  const moveMember = (id: string, x: number, y: number) => {
    const member = familyMembers.find(m => m.id === id);
    if (!member) return;
    
    const snappedPosition = snapToLayer(x, y, member.generation);
    
    const previousPosition = familyMembers.find(m => m.id === id);
    if (previousPosition) {
      const action: ActionHistory = {
        type: 'move_member',
        data: { id, previousX: previousPosition.x, previousY: previousPosition.y, newX: snappedPosition.x, newY: snappedPosition.y },
        timestamp: Date.now()
      };
      setActionHistory([...actionHistory, action]);
    }
    
    setFamilyMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, x: snappedPosition.x, y: snappedPosition.y } : member
      )
    );
  };

  const undoAction = () => {
    if (actionHistory.length === 0) return;
    
    const lastAction = actionHistory[actionHistory.length - 1];
    
    switch (lastAction.type) {
      case 'add_member':
        setFamilyMembers(prev => prev.filter(m => m.id !== lastAction.data.member.id));
        break;
      case 'move_member':
        setFamilyMembers(prev => 
          prev.map(member => 
            member.id === lastAction.data.id 
              ? { ...member, x: lastAction.data.previousX, y: lastAction.data.previousY }
              : member
          )
        );
        break;
    }
    
    setActionHistory(prev => prev.slice(0, -1));
    toast({
      title: "Action Undone",
      description: "Last action has been reversed.",
    });
  };


  const checkChallenge = () => {
    const memberTypesList = familyMembers.map(m => m.type);
    const hasAllRequired = challenge.requiredMembers.every(required => 
      memberTypesList.includes(required as FamilyMember['type'])
    );
    
    if (hasAllRequired) {
      setShowMathQuestion(true);
      toast({
        title: "Family Structure Complete!",
        description: "Now answer the math question to complete the challenge.",
      });
    } else {
      toast({
        title: "Incomplete Family",
        description: "Make sure you have all required family members placed.",
        variant: "destructive",
      });
    }
  };

  const submitAnswer = () => {
    const answer = parseInt(userAnswer);
    if (answer === challenge.correctAnswer) {
      setScore(score + 100);
      setChallengeCompleted(true);
      setShowResult(true);
      toast({
        title: "Correct! 🎉",
        description: "You've completed this challenge!",
      });
    } else {
      toast({
        title: "Try Again",
        description: challenge.hint,
        variant: "destructive",
      });
    }
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      resetChallenge();
    } else {
      toast({
        title: "Congratulations! 🏆",
        description: "You've completed all family building challenges!",
      });
    }
  };

  const getFamilyIcon = (type: string) => {
    switch (type) {
      case 'nuclear': return <Home className="w-5 h-5" />;
      case 'extended': return <Users className="w-5 h-5" />;
      case 'joint': return <Crown className="w-5 h-5" />;
      case 'single-parent': return <Heart className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Family Tree Builder
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Build beautiful family trees and learn about mathematical relationships!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {getFamilyIcon(challenge.familyType)}
                        {challenge.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-purple-600">
                        Level {index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {challenge.description}
                    </CardDescription>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        <strong>Required:</strong> {challenge.requiredMembers.join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        <strong>Math Focus:</strong> {challenge.mathQuestion}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Baby className="mr-2 h-5 w-5" />
              Start Building Families
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setGameStarted(false)}
            className="text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-purple-600">
              Challenge {currentChallenge + 1} of {challenges.length}
            </Badge>
            <div className="flex items-center gap-2 text-purple-600">
              <Star className="h-5 w-5" />
              <span className="font-semibold">{score}</span>
            </div>
          </div>
        </div>

        {/* Challenge Info */}
        <Card className="mb-6 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {getFamilyIcon(challenge.familyType)}
              {challenge.title}
            </CardTitle>
            <CardDescription className="text-lg">
              {challenge.description}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Family Members Palette */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Family Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberTypes.map((member) => (
                  <Button
                    key={member.type}
                    onClick={() => addFamilyMember(member.type)}
                    className="w-full justify-start gap-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-purple-300"
                    variant="outline"
                  >
                    <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-sm`}>
                      {member.icon}
                    </div>
                    {member.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Building Area */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Family Tree Canvas</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={undoAction}
                    variant="outline"
                    size="sm"
                    disabled={actionHistory.length === 0}
                  >
                    <Undo2 className="h-4 w-4 mr-1" />
                    Undo
                  </Button>
                  <Button
                    onClick={resetChallenge}
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    onClick={checkChallenge}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Check
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-white rounded-lg border-2 border-dashed border-purple-200 h-[600px] overflow-hidden w-full max-w-[800px]">
                {/* Enhanced Generation Layer Guidelines with Drop Zone Feedback */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className={`absolute top-4 left-4 right-4 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    dropZoneActive === 1 ? 'bg-gradient-to-r from-purple-200 to-pink-200 border-2 border-purple-400' : 'bg-gradient-to-r from-purple-100 to-pink-100'
                  }`}>
                    <span className="text-sm font-semibold text-purple-600">Generation 1 (Grandparents)</span>
                  </div>
                  <div className={`absolute top-24 left-4 right-4 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    dropZoneActive === 2 ? 'bg-gradient-to-r from-blue-200 to-cyan-200 border-2 border-blue-400' : 'bg-gradient-to-r from-blue-100 to-cyan-100'
                  }`}>
                    <span className="text-sm font-semibold text-blue-600">Generation 2 (Parents, Aunts, Uncles)</span>
                  </div>
                  <div className={`absolute top-44 left-4 right-4 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    dropZoneActive === 3 ? 'bg-gradient-to-r from-green-200 to-teal-200 border-2 border-green-400' : 'bg-gradient-to-r from-green-100 to-teal-100'
                  }`}>
                    <span className="text-sm font-semibold text-green-600">Generation 3 (Children, Cousins)</span>
                  </div>
                </div>

                {familyMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    drag
                    dragMomentum={false}
                    onDragStart={() => {
                      setDraggedMember(member.id);
                    }}
                    onDrag={(_, info) => {
                      const newY = member.y + info.offset.y;
                      const layer = getLayerFromY(newY);
                      setDropZoneActive(layer);
                    }}
                    onDragEnd={(_, info) => {
                      const newX = member.x + info.offset.x;
                      const newY = member.y + info.offset.y;
                      moveMember(member.id, newX, newY);
                      setDraggedMember(null);
                      setDropZoneActive(null);
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute cursor-move z-20"
                    style={{ left: member.x, top: member.y }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold border-4 shadow-lg hover:shadow-xl transition-all duration-200 ${
                        draggedMember === member.id ? 'border-yellow-400 scale-110' : 'border-white'
                      }`}
                      style={{ 
                        backgroundColor: memberTypes.find(m => m.type === member.type)?.color.split('-')[1] 
                          ? `hsl(${memberTypes.find(m => m.type === member.type)?.color.includes('blue') ? '220' : 
                              memberTypes.find(m => m.type === member.type)?.color.includes('pink') ? '320' :
                              memberTypes.find(m => m.type === member.type)?.color.includes('green') ? '120' :
                              memberTypes.find(m => m.type === member.type)?.color.includes('purple') ? '270' :
                              memberTypes.find(m => m.type === member.type)?.color.includes('gray') ? '210' :
                              memberTypes.find(m => m.type === member.type)?.color.includes('orange') ? '30' :
                              memberTypes.find(m => m.type === member.type)?.color.includes('yellow') ? '50' : '240'} 60% 50%)`
                          : '#8b5cf6'
                      }}
                    >
                      {memberTypes.find(m => m.type === member.type)?.icon}
                    </div>
                    <div className="text-xs text-center mt-1 font-semibold text-gray-700">
                      {member.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Math Question Modal */}
        <AnimatePresence>
          {showMathQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold mb-4 text-purple-600">
                  Math Question
                </h3>
                <p className="text-gray-700 mb-6">
                  {challenge.mathQuestion}
                </p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your answer"
                  />
                  <Button
                    onClick={submitAnswer}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Submit
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showResult && challengeCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-4 text-purple-600">
                  Challenge Complete!
                </h3>
                <p className="text-gray-700 mb-6">
                  You've successfully built a {challenge.title.toLowerCase()} and solved the math problem!
                </p>
                <div className="flex gap-3">
                  {currentChallenge < challenges.length - 1 ? (
                    <Button
                      onClick={nextChallenge}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Next Challenge
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setGameStarted(false)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Back to Menu
                    </Button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FamilyBuilder;