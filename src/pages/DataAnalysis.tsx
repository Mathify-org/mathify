import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Dot, 
  Table2, 
  Plus, 
  Trash2,
  Download,
  Upload,
  Sparkles,
  TrendingUp
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  ScatterChart,
  Scatter,
} from "recharts";
import { toast } from "sonner";

interface DataPoint {
  id: string;
  label: string;
  value: number;
  color?: string;
}

interface ScatterDataPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
}

const CHART_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", 
  "#d084d0", "#ffb347", "#87ceeb", "#dda0dd", "#98fb98"
];

const DataAnalysis = () => {
  const [activeTab, setActiveTab] = useState("bar");
  const [data, setData] = useState<DataPoint[]>([
    { id: "1", label: "Apples", value: 25, color: "#8884d8" },
    { id: "2", label: "Bananas", value: 35, color: "#82ca9d" },
    { id: "3", label: "Oranges", value: 20, color: "#ffc658" },
    { id: "4", label: "Grapes", value: 30, color: "#ff7c7c" }
  ]);
  
  const [scatterData, setScatterData] = useState<ScatterDataPoint[]>([
    { id: "1", x: 10, y: 20, label: "Point 1" },
    { id: "2", x: 25, y: 45, label: "Point 2" },
    { id: "3", x: 40, y: 30, label: "Point 3" },
    { id: "4", x: 60, y: 55, label: "Point 4" }
  ]);

  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newX, setNewX] = useState("");
  const [newY, setNewY] = useState("");

  const addDataPoint = useCallback(() => {
    if (!newLabel.trim() || !newValue.trim()) {
      toast.error("Please enter both label and value!");
      return;
    }

    const value = parseFloat(newValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number!");
      return;
    }

    const newPoint: DataPoint = {
      id: Date.now().toString(),
      label: newLabel.trim(),
      value,
      color: CHART_COLORS[data.length % CHART_COLORS.length]
    };

    setData(prev => [...prev, newPoint]);
    setNewLabel("");
    setNewValue("");
    toast.success("Data point added successfully!");
  }, [newLabel, newValue, data.length]);

  const addScatterPoint = useCallback(() => {
    if (!newX.trim() || !newY.trim()) {
      toast.error("Please enter both X and Y values!");
      return;
    }

    const x = parseFloat(newX);
    const y = parseFloat(newY);
    
    if (isNaN(x) || isNaN(y)) {
      toast.error("Please enter valid numbers!");
      return;
    }

    const newPoint: ScatterDataPoint = {
      id: Date.now().toString(),
      x,
      y,
      label: `Point ${scatterData.length + 1}`
    };

    setScatterData(prev => [...prev, newPoint]);
    setNewX("");
    setNewY("");
    toast.success("Scatter point added successfully!");
  }, [newX, newY, scatterData.length]);

  const removeDataPoint = useCallback((id: string) => {
    setData(prev => prev.filter(point => point.id !== id));
    toast.success("Data point removed!");
  }, []);

  const removeScatterPoint = useCallback((id: string) => {
    setScatterData(prev => prev.filter(point => point.id !== id));
    toast.success("Scatter point removed!");
  }, []);

  const updateDataPoint = useCallback((id: string, field: 'label' | 'value', newVal: string) => {
    setData(prev => prev.map(point => {
      if (point.id === id) {
        if (field === 'value') {
          const value = parseFloat(newVal);
          return isNaN(value) ? point : { ...point, value };
        }
        return { ...point, [field]: newVal };
      }
      return point;
    }));
  }, []);

  const generateSampleData = useCallback(() => {
    const sampleLabels = ["Math", "Science", "English", "History", "Art"];
    const newData = sampleLabels.map((label, index) => ({
      id: (index + 1).toString(),
      label,
      value: Math.floor(Math.random() * 100) + 10,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));
    setData(newData);
    toast.success("Sample data generated!");
  }, []);

  const clearAllData = useCallback(() => {
    setData([]);
    toast.success("All data cleared!");
  }, []);

  const barChartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-24 h-24">
            <BarChart3 className="w-full h-full" />
          </div>
          <div className="absolute top-16 right-16 w-20 h-20">
            <PieChart className="w-full h-full" />
          </div>
          <div className="absolute bottom-8 left-16 w-16 h-16">
            <LineChart className="w-full h-full" />
          </div>
          <div className="absolute bottom-16 right-8 w-18 h-18">
            <Dot className="w-full h-full" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="h-8 w-8 text-cyan-300" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                Interactive Data Suite
              </Badge>
              <Sparkles className="h-8 w-8 text-cyan-300" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Data Analysis
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent block">
                Made Beautiful
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Create stunning visualizations, explore data patterns, and master statistics through interactive charts and graphs
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <BarChart3 className="h-4 w-4" />
                <span>Bar Charts</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <LineChart className="h-4 w-4" />
                <span>Line Graphs</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <PieChart className="h-4 w-4" />
                <span>Pie Charts</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Dot className="h-4 w-4" />
                <span>Scatter Plots</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Table2 className="h-4 w-4" />
                <span>Data Tables</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-[90vw] sm:max-w-md md:max-w-2xl grid-cols-5 bg-white shadow-lg rounded-xl p-1 gap-0 overflow-hidden">
                <TabsTrigger value="bar" className="flex flex-col items-center justify-center space-y-1 p-2 sm:p-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-xs min-h-[60px] sm:min-h-[70px]">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs leading-none">Bar</span>
                </TabsTrigger>
                <TabsTrigger value="line" className="flex flex-col items-center justify-center space-y-1 p-2 sm:p-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-xs min-h-[60px] sm:min-h-[70px]">
                  <LineChart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs leading-none">Line</span>
                </TabsTrigger>
                <TabsTrigger value="pie" className="flex flex-col items-center justify-center space-y-1 p-2 sm:p-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-xs min-h-[60px] sm:min-h-[70px]">
                  <PieChart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs leading-none">Pie</span>
                </TabsTrigger>
                <TabsTrigger value="scatter" className="flex flex-col items-center justify-center space-y-1 p-2 sm:p-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-xs min-h-[60px] sm:min-h-[70px]">
                  <Dot className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs leading-none">Scatter</span>
                </TabsTrigger>
                <TabsTrigger value="table" className="flex flex-col items-center justify-center space-y-1 p-2 sm:p-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs min-h-[60px] sm:min-h-[70px]">
                  <Table2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs leading-none">Table</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Bar Chart Tab */}
            <TabsContent value="bar" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-6 w-6" />
                        <span>Interactive Bar Chart</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {data.length > 0 ? (
                        <ChartContainer config={barChartConfig} className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis 
                                dataKey="label" 
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#64748b' }}
                              />
                              <YAxis 
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#64748b' }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar 
                                dataKey="value" 
                                radius={[4, 4, 0, 0]}
                                fill="url(#barGradient)"
                              />
                              <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                </linearGradient>
                              </defs>
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No data to display</p>
                            <p className="text-sm">Add some data points to see your chart!</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Control Panel */}
                <div className="space-y-4">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Add Data</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label htmlFor="label">Label</Label>
                        <Input
                          id="label"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder="Enter label"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="value">Value</Label>
                        <Input
                          id="value"
                          type="number"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Enter value"
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        onClick={addDataPoint}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Button 
                        onClick={generateSampleData}
                        variant="outline"
                        className="w-full border-emerald-200 hover:bg-emerald-50"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Sample Data
                      </Button>
                      <Button 
                        onClick={clearAllData}
                        variant="outline"
                        className="w-full border-red-200 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Line Chart Tab */}
            <TabsContent value="line" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <LineChart className="h-6 w-6" />
                        <span>Interactive Line Graph</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {data.length > 0 ? (
                        <ChartContainer config={barChartConfig} className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis 
                                dataKey="label" 
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#64748b' }}
                              />
                              <YAxis 
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#64748b' }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, fill: '#064e3b' }}
                              />
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No data to display</p>
                            <p className="text-sm">Add some data points to see your line graph!</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Add Data</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label htmlFor="line-label">Label</Label>
                        <Input
                          id="line-label"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder="Enter label"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="line-value">Value</Label>
                        <Input
                          id="line-value"
                          type="number"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Enter value"
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        onClick={addDataPoint}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Button 
                        onClick={generateSampleData}
                        variant="outline"
                        className="w-full border-emerald-200 hover:bg-emerald-50"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Sample Data
                      </Button>
                      <Button 
                        onClick={clearAllData}
                        variant="outline"
                        className="w-full border-red-200 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Pie Chart Tab */}
            <TabsContent value="pie" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <PieChart className="h-6 w-6" />
                        <span>Interactive Pie Chart</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {data.length > 0 ? (
                        <ChartContainer config={barChartConfig} className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No data to display</p>
                            <p className="text-sm">Add some data points to see your pie chart!</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Add Data</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label htmlFor="pie-label">Label</Label>
                        <Input
                          id="pie-label"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder="Enter label"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pie-value">Value</Label>
                        <Input
                          id="pie-value"
                          type="number"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Enter value"
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        onClick={addDataPoint}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Button 
                        onClick={generateSampleData}
                        variant="outline"
                        className="w-full border-emerald-200 hover:bg-emerald-50"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Sample Data
                      </Button>
                      <Button 
                        onClick={clearAllData}
                        variant="outline"
                        className="w-full border-red-200 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Scatter Plot Tab */}
            <TabsContent value="scatter" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Dot className="h-6 w-6" />
                        <span>Interactive Scatter Plot</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {scatterData.length > 0 ? (
                        <ChartContainer config={barChartConfig} className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                              <XAxis 
                                type="number" 
                                dataKey="x" 
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#64748b' }}
                              />
                              <YAxis 
                                type="number" 
                                dataKey="y" 
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#64748b' }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Scatter 
                                data={scatterData} 
                                fill="#f97316"
                              />
                            </ScatterChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <Dot className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No data to display</p>
                            <p className="text-sm">Add some data points to see your scatter plot!</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Add Data</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label htmlFor="scatter-x">X Value</Label>
                        <Input
                          id="scatter-x"
                          type="number"
                          value={newX}
                          onChange={(e) => setNewX(e.target.value)}
                          placeholder="Enter X value"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="scatter-y">Y Value</Label>
                        <Input
                          id="scatter-y"
                          type="number"
                          value={newY}
                          onChange={(e) => setNewY(e.target.value)}
                          placeholder="Enter Y value"
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        onClick={addScatterPoint}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Button 
                        onClick={() => {
                          const newScatterData = Array.from({ length: 8 }, (_, i) => ({
                            id: (i + 1).toString(),
                            x: Math.floor(Math.random() * 100),
                            y: Math.floor(Math.random() * 100),
                            label: `Point ${i + 1}`
                          }));
                          setScatterData(newScatterData);
                          toast.success("Sample scatter data generated!");
                        }}
                        variant="outline"
                        className="w-full border-emerald-200 hover:bg-emerald-50"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Sample Data
                      </Button>
                      <Button 
                        onClick={() => {
                          setScatterData([]);
                          toast.success("All scatter data cleared!");
                        }}
                        variant="outline"
                        className="w-full border-red-200 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Data Table Tab */}
            <TabsContent value="table" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50">
                    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Table2 className="h-6 w-6" />
                        <span>Frequency Table</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {data.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                            <thead>
                              <tr className="bg-gradient-to-r from-indigo-100 to-purple-100">
                                <th className="border border-gray-300 p-3 text-left font-semibold">Label</th>
                                <th className="border border-gray-300 p-3 text-left font-semibold">Value</th>
                                <th className="border border-gray-300 p-3 text-left font-semibold">Percentage</th>
                                <th className="border border-gray-300 p-3 text-left font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((point, index) => {
                                const total = data.reduce((sum, p) => sum + p.value, 0);
                                const percentage = total > 0 ? ((point.value / total) * 100).toFixed(1) : "0";
                                return (
                                  <tr key={point.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="border border-gray-300 p-3">
                                      <Input
                                        value={point.label}
                                        onChange={(e) => updateDataPoint(point.id, 'label', e.target.value)}
                                        className="border-0 bg-transparent"
                                      />
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                      <Input
                                        type="number"
                                        value={point.value}
                                        onChange={(e) => updateDataPoint(point.id, 'value', e.target.value)}
                                        className="border-0 bg-transparent"
                                      />
                                    </td>
                                    <td className="border border-gray-300 p-3 text-center">
                                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                                        {percentage}%
                                      </Badge>
                                    </td>
                                    <td className="border border-gray-300 p-3 text-center">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => removeDataPoint(point.id)}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr className="bg-gradient-to-r from-indigo-200 to-purple-200 font-semibold">
                                <td className="border border-gray-300 p-3">Total</td>
                                <td className="border border-gray-300 p-3">
                                  {data.reduce((sum, p) => sum + p.value, 0)}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">100%</td>
                                <td className="border border-gray-300 p-3"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="h-60 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <Table2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No data to display</p>
                            <p className="text-sm">Add some data points to see your frequency table!</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Control Panel for Table */}
                <div className="space-y-4">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Add Data</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label htmlFor="table-label">Label</Label>
                        <Input
                          id="table-label"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder="Enter label"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="table-value">Value</Label>
                        <Input
                          id="table-value"
                          type="number"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Enter value"
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        onClick={addDataPoint}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Button 
                        onClick={generateSampleData}
                        variant="outline"
                        className="w-full border-emerald-200 hover:bg-emerald-50"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Sample Data
                      </Button>
                      <Button 
                        onClick={clearAllData}
                        variant="outline"
                        className="w-full border-red-200 hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default DataAnalysis;
