import z from "zod"

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
})

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false), 
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

  export const educationSchema = z.object({
  collegeName: z.string().min(1, "College name is required"),
  universityOrBoard: z.string().min(1, "University / Board is required"),
  percentageOrCgpa: z
    .string()
    .min(1, "Percentage or CGPA is required"),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
});

export const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z
    .string()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean)
        : []
    ),
});


// export const resumeSchema = z.object({
//   contactInfo: contactSchema,
//   summary: z.string().min(1, "Professional summary is required"),
//   skills: z.string().min(1, "Skills are required"),
//   experience: z.array(entrySchema),
//   education: z.array(educationSchema),
//   projects: z.array(projectSchema),
// });

export const resumeSchema = z.object({
  // New name fields to fix "Unknown" header
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  
  // UPDATED: Now matches CategorizedSkills component output
  skills: z.array(
    z.object({
      category: z.string().min(1, "Category is required"),
      skills: z.array(z.string()).min(1, "Add at least one skill"),
    })
  ).min(1, "Please add at least one skill category"),

  experience: z.array(entrySchema),
  education: z.array(z.any()), 
  projects: z.array(z.any()), 
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});