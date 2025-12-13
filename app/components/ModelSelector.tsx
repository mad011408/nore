"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles, Cpu, Brain, Zap } from "lucide-react";
import type { SelectedModel } from "@/types/chat";
import { modelDisplayNames } from "@/lib/ai/providers";

interface ModelSelectorProps {
  value: SelectedModel;
  onChange: (model: SelectedModel) => void;
  disabled?: boolean;
}

const modelIcons: Record<SelectedModel, React.ReactNode> = {
  default: <Sparkles className="w-3.5 h-3.5" />,
  "claude-opus-4-5": <Brain className="w-3.5 h-3.5" />,
  "gemini-3-pro": <Zap className="w-3.5 h-3.5" />,
  "gpt-5.2-pro": <Cpu className="w-3.5 h-3.5" />,
  "gpt-5.2-thinking": <Brain className="w-3.5 h-3.5" />,
};

const modelDescriptions: Record<SelectedModel, string> = {
  default: "Auto-select based on mode",
  "claude-opus-4-5": "Most capable Claude model",
  "gemini-3-pro": "Google's advanced model",
  "gpt-5.2-pro": "OpenAI's latest pro model",
  "gpt-5.2-thinking": "Extended thinking capability",
};

export function ModelSelector({
  value,
  onChange,
  disabled = false,
}: ModelSelectorProps) {
  const displayName =
    value === "default" ? "Auto" : modelDisplayNames[value] || value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-7 px-2 text-xs font-medium rounded-md focus-visible:ring-1 shrink-0 bg-muted hover:bg-muted/50 gap-1"
          data-testid="model-selector"
        >
          {modelIcons[value]}
          <span className="max-w-[100px] truncate">{displayName}</span>
          <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Select Model
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Default/Auto option */}
        <DropdownMenuItem
          onClick={() => onChange("default")}
          className="cursor-pointer"
          data-testid="model-default"
        >
          <div className="flex items-start gap-2">
            {modelIcons.default}
            <div className="flex flex-col">
              <span className="font-medium">Auto</span>
              <span className="text-xs text-muted-foreground">
                {modelDescriptions.default}
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Custom Models
        </DropdownMenuLabel>

        {/* Claude Opus 4.5 */}
        <DropdownMenuItem
          onClick={() => onChange("claude-opus-4-5")}
          className="cursor-pointer"
          data-testid="model-claude"
        >
          <div className="flex items-start gap-2">
            {modelIcons["claude-opus-4-5"]}
            <div className="flex flex-col">
              <span className="font-medium">
                {modelDisplayNames["claude-opus-4-5"]}
              </span>
              <span className="text-xs text-muted-foreground">
                {modelDescriptions["claude-opus-4-5"]}
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        {/* Gemini 3 Pro */}
        <DropdownMenuItem
          onClick={() => onChange("gemini-3-pro")}
          className="cursor-pointer"
          data-testid="model-gemini"
        >
          <div className="flex items-start gap-2">
            {modelIcons["gemini-3-pro"]}
            <div className="flex flex-col">
              <span className="font-medium">
                {modelDisplayNames["gemini-3-pro"]}
              </span>
              <span className="text-xs text-muted-foreground">
                {modelDescriptions["gemini-3-pro"]}
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        {/* GPT-5.2 Pro */}
        <DropdownMenuItem
          onClick={() => onChange("gpt-5.2-pro")}
          className="cursor-pointer"
          data-testid="model-gpt-pro"
        >
          <div className="flex items-start gap-2">
            {modelIcons["gpt-5.2-pro"]}
            <div className="flex flex-col">
              <span className="font-medium">
                {modelDisplayNames["gpt-5.2-pro"]}
              </span>
              <span className="text-xs text-muted-foreground">
                {modelDescriptions["gpt-5.2-pro"]}
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        {/* GPT-5.2 Thinking */}
        <DropdownMenuItem
          onClick={() => onChange("gpt-5.2-thinking")}
          className="cursor-pointer"
          data-testid="model-gpt-thinking"
        >
          <div className="flex items-start gap-2">
            {modelIcons["gpt-5.2-thinking"]}
            <div className="flex flex-col">
              <span className="font-medium">
                {modelDisplayNames["gpt-5.2-thinking"]}
              </span>
              <span className="text-xs text-muted-foreground">
                {modelDescriptions["gpt-5.2-thinking"]}
              </span>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
