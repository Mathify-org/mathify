
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calculator, TrendingUp, PiggyBank, DollarSign, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TaxCalculator = () => {
  const [income, setIncome] = useState<string>('');
  const [taxRate, setTaxRate] = useState<number>(20);
  const [results, setResults] = useState<{
    grossIncome: number;
    taxAmount: number;
    netIncome: number;
    monthlyNet: number;
  } | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);

  const scenarios = [
    {
      title: "Young Professional",
      description: "Recent graduate starting their first job",
      suggestedIncome: 35000,
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: "Experienced Worker",
      description: "Mid-career professional with experience",
      suggestedIncome: 55000,
      icon: <Calculator className="h-6 w-6" />
    },
    {
      title: "Senior Executive",
      description: "Senior management position",
      suggestedIncome: 85000,
      icon: <DollarSign className="h-6 w-6" />
    }
  ];

  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0;
    const taxAmount = (grossIncome * taxRate) / 100;
    const netIncome = grossIncome - taxAmount;
    const monthlyNet = netIncome / 12;

    setResults({
      grossIncome,
      taxAmount,
      netIncome,
      monthlyNet
    });
  };

  const applyScenario = (scenarioIncome: number) => {
    setIncome(scenarioIncome.toString());
  };

  useEffect(() => {
    if (income) {
      calculateTax();
    }
  }, [income, taxRate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
                  <Calculator className="h-8 w-8" />
                  Tax Calculator
                </h1>
                <p className="text-purple-100 text-lg">Learn about income, taxes, and take-home pay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Income & Tax Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="income" className="text-lg font-semibold text-gray-700 mb-2 block">
                      Annual Income ($)
                    </Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="Enter your annual income"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="text-lg p-4 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <Label className="text-lg font-semibold text-gray-700 mb-4 block flex items-center gap-2">
                      <Percent className="h-5 w-5" />
                      Tax Rate: {taxRate}%
                    </Label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="10"
                        max="40"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseInt(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-green-400 to-red-500 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>10% (Low)</span>
                        <span>25% (Medium)</span>
                        <span>40% (High)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Try These Scenarios:</h3>
                    <div className="grid gap-3">
                      {scenarios.map((scenario, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => applyScenario(scenario.suggestedIncome)}
                          className="justify-start text-left p-4 h-auto hover:bg-blue-100 border-blue-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-blue-600">
                              {scenario.icon}
                            </div>
                            <div>
                              <div className="font-semibold">{scenario.title}</div>
                              <div className="text-sm text-gray-600">{scenario.description}</div>
                              <div className="text-sm font-medium text-green-600">
                                ${scenario.suggestedIncome.toLocaleString()}/year
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <PiggyBank className="h-6 w-6" />
                  Your Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {results ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-700">
                          ${results.grossIncome.toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-600 font-medium">Gross Income</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-700">
                          ${results.taxAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-red-600 font-medium">Tax Amount</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg text-center border-2 border-green-200">
                      <div className="text-3xl font-bold text-green-700 mb-2">
                        ${results.netIncome.toLocaleString()}
                      </div>
                      <div className="text-lg text-green-600 font-medium mb-4">Annual Take-Home Pay</div>
                      <div className="text-xl font-semibold text-green-800">
                        ${Math.round(results.monthlyNet).toLocaleString()}/month
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Tax Breakdown</span>
                        <span>{taxRate}% of income</span>
                      </div>
                      <Progress 
                        value={taxRate} 
                        className="h-4"
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>You Keep: {(100 - taxRate).toFixed(0)}%</span>
                        <span>Taxes: {taxRate}%</span>
                      </div>
                    </div>

                    {/* Educational Tips */}
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-amber-800 mb-2">💡 Did You Know?</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Higher incomes typically have higher tax rates</li>
                        <li>• Tax rates vary by country and region</li>
                        <li>• Understanding taxes helps with financial planning</li>
                        <li>• Your take-home pay is what you actually receive</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Enter your income to see the calculation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Educational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="shadow-xl border-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-center">Understanding Income Tax</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Gross Income</h4>
                  <p className="text-sm">Your total income before any deductions or taxes</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Tax Amount</h4>
                  <p className="text-sm">The portion of your income paid to the government</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Net Income</h4>
                  <p className="text-sm">Your actual take-home pay after taxes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TaxCalculator;
