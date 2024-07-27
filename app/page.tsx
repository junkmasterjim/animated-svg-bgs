"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2,
  Download,
  Plus,
  X,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const [settings, setSettings] = useState({
    width: 1000,
    height: 1000,
    circleCount: 50,
    minRadius: 10,
    maxRadius: 50,
    minDuration: 20,
    maxDuration: 40,
    colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f7d794"],
    gooEnabled: true,
    layerBlurEnabled: false,
    layerBlurAmount: 20,
    scale: 1,
    viewportScale: true,
    xPosition: 0,
    yPosition: 0,
  });

  const [circles, setCircles] = useState<Array<any>>([]);
  const [viewportDimensions, setViewportDimensions] = useState({
    width: 1000,
    height: 1000,
  });

  useEffect(() => {
    const updateViewportDimensions = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportDimensions();
    window.addEventListener("resize", updateViewportDimensions);

    return () => window.removeEventListener("resize", updateViewportDimensions);
  }, []);

  useEffect(() => {
    setCircles(
      Array.from({ length: settings.circleCount }, () => ({
        cx: Math.random() * settings.width,
        cy: Math.random() * settings.height,
        r:
          Math.random() * (settings.maxRadius - settings.minRadius) +
          settings.minRadius,
        fill: settings.colors[
          Math.floor(Math.random() * settings.colors.length)
        ],
        duration:
          Math.random() * (settings.maxDuration - settings.minDuration) +
          settings.minDuration,
      })),
    );
  }, [
    settings.circleCount,
    settings.width,
    settings.height,
    settings.minRadius,
    settings.maxRadius,
    settings.colors,
    settings.minDuration,
    settings.maxDuration,
  ]);

  const handleSettingChange = (key: any, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const svgWidth = settings.viewportScale
    ? viewportDimensions.width
    : settings.width;
  const svgHeight = settings.viewportScale
    ? viewportDimensions.height
    : settings.height;

  const exportSVG = () => {
    const svgData = document.querySelector("svg")!.outerHTML;
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "animated_background.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const addColor = () => {
    if (settings.colors.length < 8) {
      handleSettingChange("colors", [...settings.colors, "#000000"]);
    }
  };

  const removeColor = (index: any) => {
    if (settings.colors.length > 1) {
      handleSettingChange(
        "colors",
        settings.colors.filter((_, i) => i !== index),
      );
    }
  };

  const updateColor = (index: any, color: any) => {
    const newColors = [...settings.colors];
    newColors[index] = color;
    handleSettingChange("colors", newColors);
  };

  const [exportedComponent, setExportedComponent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const generateReactComponent = () => {
    const componentCode = `
  import React from 'react';

  const AnimatedBackground = () => {
    const settings = ${JSON.stringify(settings, null, 2)};
    const circles = ${JSON.stringify(circles, null, 2)};

    return (
      <svg
        width="${settings.viewportScale ? "100%" : settings.width}"
        height="${settings.viewportScale ? "100%" : settings.height}"
        viewBox="${settings.xPosition} ${settings.yPosition} ${settings.width} ${settings.height}"
        style={{ transform: \`scale(\${settings.scale})\` }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
          <filter id="layerBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation={${settings.layerBlurAmount}} />
          </filter>
        </defs>
        <g filter={${settings.layerBlurEnabled ? '"url(#layerBlur)"' : '""'}}>
          <g filter={${settings.gooEnabled ? '"url(#goo)"' : '""'}}>
            {circles.map((circle, index) => (
              <circle key={index} {...circle}>
                <animate
                  attributeName="cx"
                  values={\`\${circle.cx};\${(circle.cx + ${settings.width} / 2) % ${settings.width}};\${circle.cx}\`}
                  dur={\`\${circle.duration}s\`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={\`\${circle.cy};\${(circle.cy + ${settings.height} / 2) % ${settings.height}};\${circle.cy}\`}
                  dur={\`\${circle.duration}s\`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        </g>
      </svg>
    );
  };

  export default AnimatedBackground;
      `;

    return componentCode.trim();
  };

  const exportReactComponent = () => {
    const componentCode = generateReactComponent();
    setExportedComponent(componentCode);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 overflow-hidden">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`${settings.xPosition} ${settings.yPosition} ${settings.width} ${settings.height}`}
        className="absolute top-0 left-0 -z-10"
        style={{ transform: `scale(${settings.scale})` }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
          </filter>
          <filter id="layerBlur">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={settings.layerBlurAmount}
            />
          </filter>
        </defs>
        <g filter={settings.layerBlurEnabled ? "url(#layerBlur)" : ""}>
          <g filter={settings.gooEnabled ? "url(#goo)" : ""}>
            {circles.map((circle, index) => (
              <circle key={index} {...circle}>
                <animate
                  attributeName="cx"
                  values={`${circle.cx};${(circle.cx + settings.width / 2) % settings.width};${circle.cx}`}
                  dur={`${circle.duration}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${circle.cy};${(circle.cy + settings.height / 2) % settings.height};${circle.cy}`}
                  dur={`${circle.duration}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        </g>
      </svg>

      <Card className="z-10 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Animated SVG Background Generator
        </h1>
        <Tabs defaultValue="shape">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="shape">Shape</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="position">Position</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="shape">
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="circleCount">
                  Circle Count: {settings.circleCount}
                </Label>
                <Slider
                  id="circleCount"
                  min={10}
                  max={100}
                  step={1}
                  value={[settings.circleCount]}
                  onValueChange={([value]) =>
                    handleSettingChange("circleCount", value)
                  }
                />
              </div>
              <div>
                <Label>Circle Size</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={settings.minRadius}
                    onChange={(e) =>
                      handleSettingChange("minRadius", parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={settings.maxRadius}
                    onChange={(e) =>
                      handleSettingChange("maxRadius", parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                </div>
              </div>
              <div>
                <Label>Animation Duration (s)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={settings.minDuration}
                    onChange={(e) =>
                      handleSettingChange(
                        "minDuration",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-20"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={settings.maxDuration}
                    onChange={(e) =>
                      handleSettingChange(
                        "maxDuration",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-20"
                  />
                </div>
              </div>
              <div>
                <Label>Colors</Label>
                <div className="space-y-2">
                  {settings.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-8 h-8 p-0 border-none"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeColor(index)}
                        disabled={settings.colors.length === 1}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addColor}
                  disabled={settings.colors.length >= 8}
                  className="mt-2"
                >
                  <Plus size={16} className="mr-2" /> Add Color
                </Button>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="effects">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="gooToggle">Goo Effect</Label>
                <Switch
                  id="gooToggle"
                  checked={settings.gooEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("gooEnabled", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="layerBlurToggle">Layer Blur</Label>
                <Switch
                  id="layerBlurToggle"
                  checked={settings.layerBlurEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("layerBlurEnabled", checked)
                  }
                />
              </div>
              {settings.layerBlurEnabled && (
                <div>
                  <Label htmlFor="layerBlurAmount">
                    Layer Blur Amount: {settings.layerBlurAmount}
                  </Label>
                  <Slider
                    id="layerBlurAmount"
                    min={1}
                    max={50}
                    step={1}
                    value={[settings.layerBlurAmount]}
                    onValueChange={([value]) =>
                      handleSettingChange("layerBlurAmount", value)
                    }
                  />
                </div>
              )}
            </CardContent>
          </TabsContent>

          <TabsContent value="position">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="viewportScaleToggle">Fit to Screen</Label>
                <Switch
                  id="viewportScaleToggle"
                  checked={settings.viewportScale}
                  onCheckedChange={(checked) =>
                    handleSettingChange("viewportScale", checked)
                  }
                />
              </div>
              <div>
                <Label htmlFor="scale">
                  Scale: {settings.scale.toFixed(1)}
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() =>
                      handleSettingChange(
                        "scale",
                        Math.max(0.1, settings.scale - 0.1),
                      )
                    }
                  >
                    <Minimize2 size={16} />
                  </Button>
                  <Slider
                    id="scale"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={[settings.scale]}
                    onValueChange={([value]) =>
                      handleSettingChange("scale", value)
                    }
                  />
                  <Button
                    onClick={() =>
                      handleSettingChange(
                        "scale",
                        Math.min(2, settings.scale + 0.1),
                      )
                    }
                  >
                    <Maximize2 size={16} />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <Button
                    onClick={() =>
                      handleSettingChange("yPosition", settings.yPosition + 10)
                    }
                  >
                    <ChevronUp size={16} />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() =>
                      handleSettingChange("xPosition", settings.xPosition + 10)
                    }
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="text-center">
                    {settings.xPosition}, {settings.yPosition}
                  </div>
                  <Button
                    onClick={() =>
                      handleSettingChange("xPosition", settings.xPosition - 10)
                    }
                  >
                    <ChevronRight size={16} />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() =>
                      handleSettingChange("yPosition", settings.yPosition - 10)
                    }
                  >
                    <ChevronDown size={16} />
                  </Button>
                  <div></div>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="export">
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Button
                  onClick={exportReactComponent}
                  className="flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Export React Component</span>
                </Button>
              </div>
              <p className="text-sm text-center text-gray-600">
                Click the button above to generate and view the React component
                code.
              </p>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Exported React Component</DialogTitle>
          </DialogHeader>

          <Button
            onClick={() =>
              navigator.clipboard.writeText(exportedComponent).then(() => {
                toast.success("Component copied to clipboard!");
              })
            }
            className="space-x-2 w-fit"
          >
            <Copy size={16} />
            <span>Copy to Clipboard</span>
          </Button>
          <pre className="bg-gray-100 p-4 rounded-md text-wrap">
            <code>{exportedComponent}</code>
          </pre>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={copyToClipboard}
              className="flex items-center space-x-2"
            >
              <Copy size={16} />
              <span>Copy to Clipboard</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
