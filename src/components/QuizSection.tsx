
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const questions = [
  {
    question: "What helps prevent soil erosion?",
    options: ["Planting trees", "Removing plants", "Adding water", "Making holes"],
    correct: 0,
  },
  {
    question: "Which weather condition can cause soil erosion?",
    options: ["Snow", "Heavy rain", "Rainbow", "Clouds"],
    correct: 1,
  },
];

const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <Card className="p-6 bg-accent/20">
      {!showResult ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <p className="text-lg">{questions[currentQuestion].question}</p>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-lg py-8"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">
            You got {score} out of {questions.length} correct!
          </h3>
          <Button
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowResult(false);
            }}
          >
            Try Again
          </Button>
        </div>
      )}
    </Card>
  );
};

export default QuizSection;
