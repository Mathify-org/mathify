import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowLeft, BarChart3, PieChart, TrendingUp, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from "recharts";

const DataAnalysis = () => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<"bar" | "pie" | "line">("bar");

  const sampleData = [
    { name: 'Jan', students: 4000, teachers: 2400, visitors: 3000 },
    { name: 'Feb', students: 3000, teachers: 1398, visitors: 2210 },
    { name: 'Mar', students: 2000, teachers: 9800, visitors: 2290 },
    { name: 'Apr', students: 2780, teachers: 3908, visitors: 2000 },
    { name: 'May', students: 1890, teachers: 4800, visitors: 2181 },
    { name: 'Jun', students: 2390, teachers: 3800, visitors: 2500 },
    { name: 'Jul', students: 3490, teachers: 4300, visitors: 2100 },
  ];

  const chartConfig = {
    students: {
      label: "Students",
      color: "var(--color-students)",
    },
    teachers: {
      label: "Teachers",
      color: "var(--color-teachers)",
    },
    visitors: {
      label: "Visitors",
      color: "var(--color-visitors)",
    },
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const handleDownload = () => {
    // Implement download functionality here
    alert('Download feature is under development!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          {/* Remove rounded container on mobile only */}
          <div className="md:bg-white/10 md:backdrop-blur-md md:rounded-2xl md:p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Interactive Data Suite
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Explore data visualization, statistical analysis, and mathematical modeling tools designed for students and educators.
            </p>
          </div>
        </div>
      </div>

      {/* Chart Selection & Data Display */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center space-x-4 mb-6">
          <Button onClick={() => setChartType("bar")} active={chartType === "bar"}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Bar Chart
          </Button>
          <Button onClick={() => setChartType("pie")} active={chartType === "pie"}>
            <PieChart className="mr-2 h-4 w-4" />
            Pie Chart
          </Button>
          <Button onClick={() => setChartType("line")} active={chartType === "line"}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Line Chart
          </Button>
        </div>

        {/* Chart Display */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Visualization</CardTitle>
            <CardDescription>Explore trends and insights with interactive charts.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[450px]">
              {chartType === "bar" && (
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="students" fill="var(--color-students)" />
                  <Bar dataKey="teachers" fill="var(--color-teachers)" />
                  <Bar dataKey="visitors" fill="var(--color-visitors)" />
                </BarChart>
              )}
              {chartType === "pie" && (
                <RechartsPieChart>
                  <RechartsPieChart data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              )}
              {chartType === "line" && (
                <LineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="students" stroke="var(--color-students)" />
                  <Line type="monotone" dataKey="teachers" stroke="var(--color-teachers)" />
                  <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" />
                </LineChart>
              )}
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card>
          <CardHeader>
            <CardTitle>Download Data</CardTitle>
            <CardDescription>Download the visualized data for offline analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download as CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataAnalysis;
