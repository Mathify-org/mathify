import React, { useState, useRef } from "react";
import { ArrowLeft, Download, Plus, Trash2, BarChart3, LineChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Legend
} from "recharts";

const DataAnalysis = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([
    { name: "January", value: 400 },
    { name: "February", value: 300 },
    { name: "March", value: 600 },
    { name: "April", value: 800 },
    { name: "May", value: 500 },
  ]);
  
  const [chartType, setChartType] = useState("bar");
  const [newDataPoint, setNewDataPoint] = useState({ name: "", value: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addDataPoint = () => {
    if (newDataPoint.name && newDataPoint.value) {
      setData([...data, { name: newDataPoint.name, value: parseFloat(newDataPoint.value) }]);
      setNewDataPoint({ name: "", value: "" });
    } else {
      toast.error("Please fill in both name and value for the new data point.");
    }
  };

  const removeDataPoint = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          if (Array.isArray(jsonData)) {
            setData(jsonData.map(item => ({
              name: item.name || "",
              value: parseFloat(item.value) || 0
            })));
            toast.success("Data successfully imported from JSON file!");
          } else {
            toast.error("Invalid JSON format. Please provide an array of data points.");
          }
        } catch (error) {
          toast.error("Error parsing JSON file. Please ensure the file is valid.");
        }
      };
      reader.readAsText(file);
    }
  };

  const exportData = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported to JSON file!");
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))
                }
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      default:
        return <p>Select a chart type to visualize data.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with back button - moved higher on mobile */}
        <div className="flex items-center gap-4 mt-2 md:mt-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Data Analysis Suite
            </h1>
            <p className="text-gray-600 mt-1">
              Create beautiful charts and analyze your data
            </p>
          </div>
        </div>

        {/* Chart Type Toggle */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Chart Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                onClick={() => setChartType("bar")}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Bar Chart
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                onClick={() => setChartType("line")}
                className="flex items-center gap-2"
              >
                <LineChart className="h-4 w-4" />
                Line Chart
              </Button>
              <Button
                variant={chartType === "pie" ? "default" : "outline"}
                onClick={() => setChartType("pie")}
                className="flex items-center gap-2"
              >
                <PieChart className="h-4 w-4" />
                Pie Chart
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Input */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Data Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Data Point Name"
                value={newDataPoint.name}
                onChange={(e) => setNewDataPoint({ ...newDataPoint, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Data Point Value"
                value={newDataPoint.value}
                onChange={(e) => setNewDataPoint({ ...newDataPoint, value: e.target.value })}
              />
            </div>
            <Button onClick={addDataPoint} className="w-full bg-green-500 text-white hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Data Point
            </Button>
          </CardContent>
        </Card>

        {/* Chart Display */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.value}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeDataPoint(index)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Import Data (JSON)
              </Button>
              <Button
                onClick={exportData}
                className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                <Download className="h-4 w-4" />
                Export Data (JSON)
              </Button>
            </div>
            <Input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              ref={fileInputRef}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataAnalysis;
