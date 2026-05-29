"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { 
  Sparkles, 
  PlusCircle, 
  X, 
  Briefcase, 
  GraduationCap, 
  FolderKanban, 
  Loader2 
} from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  } catch (e) {
    return dateString;
  }
};

export function EntryForm({ type, entries = [], onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  // 1. Updated Configuration with custom Description Placeholders
  const fieldConfig = {
    experience: {
      icon: <Briefcase className="h-5 w-5 text-blue-500" />,
      titleLabel: "Job Title",
      titlePlaceholder: "e.g. Senior Software Engineer",
      orgLabel: "Company / Organization",
      orgPlaceholder: "e.g. Google Inc.",
      descriptionPlaceholder: "Describe your achievements and responsibilities...",
    },
    education: {
      icon: <GraduationCap className="h-5 w-5 text-emerald-500" />,
      titleLabel: "Degree / Field of Study",
      titlePlaceholder: "e.g. Bachelor of Science in Computer Science",
      orgLabel: "School / University",
      orgPlaceholder: "e.g. Stanford University",
      descriptionPlaceholder: "Describe your studies, honors, and activities...",
    },
    project: {
      icon: <FolderKanban className="h-5 w-5 text-purple-500" />,
      titleLabel: "Project Name",
      titlePlaceholder: "e.g. E-commerce Mobile App",
      orgLabel: "Technologies Used",
      orgPlaceholder: "e.g. Next.js, Firebase, Stripe",
      descriptionPlaceholder: "Describe your project...", // Specific placeholder for projects
    },
  };

  const currentConfig = fieldConfig[type.toLowerCase()] || fieldConfig.experience;

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };
    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }
    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {entries.map((item, index) => (
          <div 
            key={index} 
            className="group relative border-l-4 border-primary bg-white/10 backdrop-blur-sm p-5 rounded-r-xl transition-all hover:bg-white/20"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-white leading-none">{item.title}</h4>
                <p className="text-white/80 font-medium">{item.organization}</p>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-black/20 px-2 py-1 rounded">
                   {item.current ? `${item.startDate} — Present` : `${item.startDate} — ${item.endDate}`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-500/20"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <Card className="bg-white text-black shadow-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              {currentConfig.icon} Add {type} Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-500 tracking-tighter">
                  {currentConfig.titleLabel}
                </label>
                <Input 
                  placeholder={currentConfig.titlePlaceholder} 
                  {...register("title")} 
                  className="focus-visible:ring-primary border-gray-300"
                />
                {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-500 tracking-tighter">
                  {currentConfig.orgLabel}
                </label>
                <Input 
                  placeholder={currentConfig.orgPlaceholder} 
                  {...register("organization")} 
                  className="focus-visible:ring-primary border-gray-300"
                />
                {errors.organization && <p className="text-xs text-red-500 font-medium">{errors.organization.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-500 tracking-tighter">Start Date</label>
                <Input type="month" {...register("startDate")} className="border-gray-300" />
                {errors.startDate && <p className="text-xs text-red-500 font-medium">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-500 tracking-tighter">End Date</label>
                <Input type="month" {...register("endDate")} disabled={current} className="border-gray-300" />
                {errors.endDate && <p className="text-xs text-red-500 font-medium">{errors.endDate.message}</p>}
              </div>
            </div>

            {/* Logical Check: Hide checkbox for Projects */}
            {type.toLowerCase() !== "project" && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <input
                  type="checkbox"
                  id="current-check"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register("current")}
                  onChange={(e) => {
                    setValue("current", e.target.checked);
                    if (e.target.checked) setValue("endDate", "");
                  }}
                />
                <label htmlFor="current-check" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  I am currently in this {type.toLowerCase() === "education" ? "program" : "role"}
                </label>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black uppercase text-gray-500 tracking-tighter">Description</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 border-primary/30 text-primary hover:bg-primary/5 font-bold text-[10px]"
                  onClick={handleImproveDescription}
                  disabled={isImproving || !watch("description")}
                >
                  {isImproving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                  AI REWRITE
                </Button>
              </div>
              <Textarea
                // 2. Dynamic Placeholder injected here
                placeholder={currentConfig.descriptionPlaceholder} 
                className="h-32 border-gray-300 resize-none"
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t bg-gray-50/50 py-4">
            <Button variant="ghost" className="font-bold text-gray-500" onClick={() => { reset(); setIsAdding(false); }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd} className="px-8 font-bold">
              <PlusCircle className="h-4 w-4 mr-2" />
              Save to Resume
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Button
          className="w-full border-2 border-dashed h-20 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all rounded-xl"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <div className="flex flex-col items-center">
            <PlusCircle className="h-6 w-6 mb-1 text-white/60" />
            <span className="text-xs font-bold uppercase tracking-widest">Add {type}</span>
          </div>
        </Button>
      )}
    </div>
  );
}