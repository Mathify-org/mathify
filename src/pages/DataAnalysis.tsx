import React, { useState, useMemo } from 'react';
import { ArrowLeft, BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Cell, AreaChart, Area } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const DataAnalysis = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeChart, setActiveChart] = useState('bar');
  const [dataInput, setDataInput] = useState('10,20,30,40,50');
  const [labelsInput, setLabelsInput] = useState('A,B,C,D,E');
  const [chartTitle, setChartTitle] = useState('Sample Data');

  const chartData = useMemo(() => {
    const dataValues = dataInput.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
    const labelValues = labelsInput.split(',').map(label => label.trim());
    
    return dataValues.map((value, index) => ({
      name: labelValues[index] || `Item ${index + 1}`,
      value: value,
      percentage: Math.round((value / dataValues.reduce((sum, v) => sum + v, 0)) * 100)
    }));
  }, [dataInput, labelsInput]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Tooltip />
              <Legend />
              <RechartsPieChart dataKey="value" data={chartData} cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button - Higher on mobile */}
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className={`${isMobile ? 'mb-8' : 'mb-6'} bg-white hover:bg-gray-50`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="h-10 w-10 text-blue-600" />
            Data Analysis Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your data into beautiful, interactive charts and gain valuable insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Input Section */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Data Input
                </CardTitle>
                <CardDescription>
                  Enter your data and customize your chart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Chart Title</Label>
                  <Input
                    id="title"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    placeholder="Enter chart title"
                  />
                </div>

                <div>
                  <Label htmlFor="data">Data Values (comma-separated)</Label>
                  <Textarea
                    id="data"
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    placeholder="10,20,30,40,50"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="labels">Labels (comma-separated)</Label>
                  <Textarea
                    id="labels"
                    value={labelsInput}
                    onChange={(e) => setLabelsInput(e.target.value)}
                    placeholder="A,B,C,D,E"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{chartTitle}</CardTitle>
                <CardDescription>
                  Interactive data visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Chart Type Toggle */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant={activeChart === 'bar' ? 'default' : 'outline'}
                      onClick={() => setActiveChart('bar')}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm font-medium">Bar Chart</span>
                    </Button>
                    
                    <Button
                      variant={activeChart === 'line' ? 'default' : 'outline'}
                      onClick={() => setActiveChart('line')}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <LineChart className="h-4 w-4" />
                      <span className="text-sm font-medium">Line Chart</span>
                    </Button>
                    
                    <Button
                      variant={activeChart === 'pie' ? 'default' : 'outline'}
                      onClick={() => setActiveChart('pie')}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <PieChart className="h-4 w-4" />
                      <span className="text-sm font-medium">Pie Chart</span>
                    </Button>
                    
                    <Button
                      variant={activeChart === 'area' ? 'default' : 'outline'}
                      onClick={() => setActiveChart('area')}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">Area Chart</span>
                    </Button>
                  </div>
                </div>

                {/* Chart Display */}
                <div className="w-full">
                  {renderChart()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;
