import {
  BriefcaseBusinessIcon,
  Calendar,
  Code2Icon,
  LayoutDashboard,
  List,
  Puzzle,
  Settings,
  ShieldUser,
  User2Icon,
} from "lucide-react"

export const SideBarOption = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/mock-interview/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/mock-interview/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/mock-interview/all-interview",
  }
  // {
  //   name: "Settings",
  //   icon: Settings,
  //   path: "/mock-interview/settings",
  // },
]

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: ShieldUser,
  },
]

export const QUESTIONS_PROMPT = `You are en expert technical interviewer.
Based on the following inputs, generate a 10 well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}

Job Description: {{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}


Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration

Adjust the number and depth of questions to match the interview duration.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
question:'',
type:'Technical/Behavioral/Experience/Problem Solving/Leadership'
},{
...
}]

The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
`

export const FEEDBACK_PROMPT = `
{{conversation}}
Depend on this interview Conversation between assistant and user,
Give me feedbaack for user interview. Give me rating out of 10 for technical skills,
Communication, Problem Solving, Experience. Also giv me summary in 3 lines 
about interview and one line to let me know whether is recommended for hire or not with message.

Give me response in JSON format
{ 
    feedback:{
    rating:{
        technicalSkills: 5, 
        communicaton:6,
        problemSolving:4,
        experience:7
    },
    summary:<in 3 Line>,
    Recommendation: '',
    RecommendationMsg: ''
}
}

`
