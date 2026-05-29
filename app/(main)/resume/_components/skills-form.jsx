"use client";

import { useState } from "react";
import { Plus, X, Code2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function CategorizedSkills({ value = [], onChange }) {
  const [newCategory, setNewCategory] = useState("");
  const [activeSkill, setActiveSkill] = useState("");

  // Safety Guard: Ensure value is always an array to prevent "map is not a function"
  const safeValue = Array.isArray(value) ? value : [];

  const addCategory = () => {
    if (!newCategory.trim()) return;
    onChange([...safeValue, { category: newCategory.trim(), skills: [] }]);
    setNewCategory("");
  };

  const addSkill = (categoryIndex) => {
    if (!activeSkill.trim()) return;
    const updatedValue = [...safeValue];
    // Create a new skills array to maintain immutability
    updatedValue[categoryIndex] = {
      ...updatedValue[categoryIndex],
      skills: [...updatedValue[categoryIndex].skills, activeSkill.trim()],
    };
    onChange(updatedValue);
    setActiveSkill("");
  };

  const removeSkill = (catIdx, skillIdx) => {
    const updatedValue = [...safeValue];
    updatedValue[catIdx].skills = updatedValue[catIdx].skills.filter((_, i) => i !== skillIdx);
    onChange(updatedValue);
  };

  const removeCategory = (catIdx) => {
    const updatedValue = safeValue.filter((_, i) => i !== catIdx);
    onChange(updatedValue);
  };

  return (
    <div className="space-y-6">
      {/* Category Creation Input */}
      <div className="flex gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
        <Input
          placeholder="New Category (e.g., Technical Skills)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
          className="bg-black/20 text-white border-white/20 focus:ring-primary"
        />
        <Button onClick={addCategory} variant="secondary" type="button" className="font-bold">
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {/* Categorized Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeValue.map((cat, catIdx) => (
          <Card key={catIdx} className="bg-white text-black shadow-xl border-none overflow-hidden group">
            <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">
                  {cat.category}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeCategory(catIdx)}
                className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            <CardContent className="p-4 space-y-4">
              {/* Skill Tags */}
              <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                {cat.skills.map((skill, skillIdx) => (
                  <Badge 
                    key={skillIdx}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 py-1 pl-3 pr-1 flex items-center gap-1 group/badge"
                  >
                    <span className="text-xs font-medium">{skill}</span>
                    <button 
                      type="button"
                      onClick={() => removeSkill(catIdx, skillIdx)}
                      className="p-0.5 rounded-full hover:bg-primary/20 text-primary/50 hover:text-primary transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {cat.skills.length === 0 && (
                  <span className="text-[10px] text-gray-400 italic">No skills added yet...</span>
                )}
              </div>

              {/* Individual Skill Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. React"
                  value={activeSkill}
                  onChange={(e) => setActiveSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(catIdx);
                    }
                  }}
                  className="h-8 text-xs border-gray-200"
                />
                <Button size="sm" type="button" onClick={() => addSkill(catIdx)} className="h-8 px-3 text-[10px] font-bold">
                  ADD
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}