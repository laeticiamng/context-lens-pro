import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Stethoscope, 
  Users,
  Mic,
  ClipboardList,
  Plus
} from "lucide-react";

interface ScriptTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  tags: string[];
  content: string;
}

const templates: ScriptTemplate[] = [
  {
    id: "sales-pitch",
    title: "Sales Pitch",
    description: "Perfect for client presentations and demos",
    icon: Briefcase,
    category: "Business",
    tags: ["sales", "pitch", "meeting"],
    content: `Opening Hook
Start with a compelling problem statement that resonates with the client.

Value Proposition
Our solution helps you [benefit] by [how it works].

Key Features
• Feature 1 - Benefit explanation
• Feature 2 - Benefit explanation
• Feature 3 - Benefit explanation

Social Proof
"Quote from satisfied customer" - Company Name

Handle Objections
If they mention price: Focus on ROI and long-term value.
If they mention competition: Highlight unique differentiators.

Call to Action
Let's schedule a pilot program to see results firsthand.`,
  },
  {
    id: "meeting-notes",
    title: "Meeting Agenda",
    description: "Stay on track during team meetings",
    icon: Users,
    category: "Business",
    tags: ["meeting", "agenda", "team"],
    content: `Meeting Objectives
• Review progress on Q4 goals
• Discuss blockers and solutions
• Plan next sprint priorities

Discussion Points
1. Project Alpha status update
2. Budget review and adjustments
3. Team capacity and hiring needs

Action Items
[ ] Task 1 - Owner - Due Date
[ ] Task 2 - Owner - Due Date
[ ] Task 3 - Owner - Due Date

Next Steps
Schedule follow-up for [date]
Share meeting notes by EOD`,
  },
  {
    id: "presentation",
    title: "Presentation Notes",
    description: "Key points for your next presentation",
    icon: Mic,
    category: "Speaking",
    tags: ["presentation", "speaking", "keynote"],
    content: `Introduction (2 min)
Thank the audience
Personal brief intro
Set expectations for the talk

Main Point 1 (5 min)
Key concept explanation
Supporting data/example
Transition to next point

Main Point 2 (5 min)
Key concept explanation
Supporting data/example
Transition to next point

Main Point 3 (5 min)
Key concept explanation
Supporting data/example

Conclusion (3 min)
Recap the three main points
Call to action
Q&A invitation`,
  },
  {
    id: "medical-checklist",
    title: "Medical Procedure",
    description: "Step-by-step clinical protocols",
    icon: Stethoscope,
    category: "Healthcare",
    tags: ["medical", "procedure", "checklist"],
    content: `Pre-Procedure Checklist
□ Verify patient identity
□ Confirm procedure and site
□ Review allergies and medications
□ Check informed consent

Equipment Preparation
□ Sterile field setup
□ Required instruments ready
□ Monitoring equipment calibrated

Procedure Steps
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

Post-Procedure
□ Document findings
□ Post-care instructions
□ Schedule follow-up`,
  },
  {
    id: "training",
    title: "Training Module",
    description: "Educational content delivery",
    icon: GraduationCap,
    category: "Education",
    tags: ["training", "learning", "education"],
    content: `Learning Objectives
By the end of this module, you will be able to:
• Understand [concept 1]
• Apply [skill 2]
• Demonstrate [competency 3]

Key Concept 1
Definition and explanation
Real-world example
Practice application

Key Concept 2
Definition and explanation
Real-world example
Practice application

Assessment
Quick check questions:
Q1: [Question]
Q2: [Question]

Summary
Review of main takeaways
Additional resources
Next module preview`,
  },
  {
    id: "sop",
    title: "Standard Procedure",
    description: "Repeatable process documentation",
    icon: ClipboardList,
    category: "Operations",
    tags: ["sop", "process", "operations"],
    content: `Procedure: [Name]
Version: 1.0
Last Updated: [Date]

Purpose
Describe why this procedure exists.

Scope
Who this applies to and when.

Prerequisites
□ Required access/permissions
□ Necessary tools/materials
□ Training completed

Steps
1. [Action verb] [what] [how]
2. [Action verb] [what] [how]
3. [Action verb] [what] [how]
4. [Action verb] [what] [how]

Troubleshooting
If [problem]: Try [solution]
If [problem]: Escalate to [contact]

Sign-off
Procedure completed by: _______
Date: _______`,
  },
];

interface ScriptTemplatesProps {
  onSelectTemplate: (template: ScriptTemplate) => void;
}

const ScriptTemplates = ({ onSelectTemplate }: ScriptTemplatesProps) => {
  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Start from a Template</h3>
        <p className="text-sm text-muted-foreground">
          Choose a pre-built template to get started quickly
        </p>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {category}
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {templates.filter(t => t.category === category).map(template => (
              <Card 
                key={template.id}
                className="glass-card border-border/50 hover:border-primary/30 cursor-pointer transition-all group"
                onClick={() => onSelectTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <template.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm mb-0.5">{template.title}</h5>
                      <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScriptTemplates;
