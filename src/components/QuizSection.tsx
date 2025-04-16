
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
  {
    question: "What is soil conservation?",
    options: ["Making soil dirty", "Protecting soil from erosion", "Removing all plants", "Adding more water"],
    correct: 1,
  },
  {
    question: "Which of these is NOT a method of soil conservation?",
    options: ["Terrace farming", "Contour plowing", "Burning vegetation", "Cover crops"],
    correct: 2,
  },
  {
    question: "How do tree roots help prevent soil erosion?",
    options: ["They hold soil together", "They make soil softer", "They remove water", "They add rocks"],
    correct: 0,
  },
  {
    question: "What is mulching?",
    options: ["Removing plants", "Covering soil with protective layer", "Digging holes", "Watering plants"],
    correct: 1,
  },
  {
    question: "Which natural force most commonly causes soil erosion?",
    options: ["Wind", "Earthquakes", "Lightning", "Volcanoes"],
    correct: 0,
  },
  {
    question: "What type of farming helps prevent soil erosion on hills?",
    options: ["Vertical farming", "Terrace farming", "Underground farming", "Water farming"],
    correct: 1,
  },
  {
    question: "Why is soil conservation important?",
    options: ["To grow more weeds", "To protect fertile land", "To create deserts", "To remove plants"],
    correct: 1,
  },
  {
    question: "What is a windbreak?",
    options: ["A broken window", "Trees planted to block wind", "A type of storm", "A farming tool"],
    correct: 1,
  },
  {
    question: "Which activity can harm soil conservation efforts?",
    options: ["Crop rotation", "Overgrazing", "Planting trees", "Using mulch"],
    correct: 1,
  },
  {
    question: "What is contour plowing?",
    options: ["Plowing in straight lines", "Plowing across slopes", "Plowing vertically", "Not plowing at all"],
    correct: 1,
  },
  {
    question: "How do cover crops help soil?",
    options: ["They protect soil", "They remove nutrients", "They cause erosion", "They kill insects"],
    correct: 0,
  },
  {
    question: "What happens when soil erodes?",
    options: ["Soil becomes more fertile", "Soil is lost", "Plants grow better", "More rain falls"],
    correct: 1,
  },
  {
    question: "Which is a sign of soil erosion?",
    options: ["More plants growing", "Gullies forming", "Better crop yields", "Increased fertility"],
    correct: 1,
  },
  {
    question: "How can farmers prevent soil erosion?",
    options: ["Remove all plants", "Plant only one crop", "Rotate crops", "Avoid mulching"],
    correct: 2,
  },
  {
    question: "What role do forests play in soil conservation?",
    options: ["They cause erosion", "They protect soil", "They remove soil", "They heat the soil"],
    correct: 1,
  },
  {
    question: "Why is grass good for preventing soil erosion?",
    options: ["It has deep roots", "It kills other plants", "It removes water", "It breaks up soil"],
    correct: 0,
  },
  {
    question: "What is strip cropping?",
    options: ["Removing all crops", "Planting in alternating strips", "Burning crops", "Flooding fields"],
    correct: 1,
  },
  {
    question: "Which human activity can increase soil erosion?",
    options: ["Tree planting", "Deforestation", "Crop rotation", "Using mulch"],
    correct: 1,
  }
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
