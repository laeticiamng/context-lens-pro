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
import { useLanguage } from "@/i18n/LanguageContext";

interface ScriptTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  tags: string[];
  content: string;
}

interface ScriptTemplatesProps {
  onSelectTemplate: (template: ScriptTemplate) => void;
}

const ScriptTemplates = ({ onSelectTemplate }: ScriptTemplatesProps) => {
  const { language } = useLanguage();

  const templates: ScriptTemplate[] = [
    {
      id: "sales-pitch",
      title: language === "fr" ? "Argumentaire de Vente" : "Sales Pitch",
      description: language === "fr" ? "Parfait pour les présentations et démos clients" : "Perfect for client presentations and demos",
      icon: Briefcase,
      category: language === "fr" ? "Affaires" : "Business",
      tags: language === "fr" ? ["ventes", "pitch", "réunion"] : ["sales", "pitch", "meeting"],
      content: language === "fr" ? `Accroche d'ouverture
Commencez par un problème qui résonne avec le client.

Proposition de valeur
Notre solution vous aide à [bénéfice] en [comment ça marche].

Fonctionnalités clés
• Fonctionnalité 1 - Explication du bénéfice
• Fonctionnalité 2 - Explication du bénéfice
• Fonctionnalité 3 - Explication du bénéfice

Preuve sociale
"Citation d'un client satisfait" - Nom de l'entreprise

Gestion des objections
S'ils mentionnent le prix : Focus sur le ROI et la valeur long terme.
S'ils mentionnent la concurrence : Mettre en avant les différenciateurs.

Appel à l'action
Planifions un programme pilote pour voir les résultats.` : `Opening Hook
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
      title: language === "fr" ? "Ordre du jour" : "Meeting Agenda",
      description: language === "fr" ? "Restez organisé pendant les réunions" : "Stay on track during team meetings",
      icon: Users,
      category: language === "fr" ? "Affaires" : "Business",
      tags: language === "fr" ? ["réunion", "agenda", "équipe"] : ["meeting", "agenda", "team"],
      content: language === "fr" ? `Objectifs de la réunion
• Revue des objectifs Q4
• Discussion des blocages et solutions
• Planification des priorités du prochain sprint

Points de discussion
1. Mise à jour du Projet Alpha
2. Révision et ajustements du budget
3. Capacité de l'équipe et recrutement

Actions
[ ] Tâche 1 - Responsable - Date
[ ] Tâche 2 - Responsable - Date
[ ] Tâche 3 - Responsable - Date

Prochaines étapes
Planifier un suivi pour [date]
Partager les notes de réunion avant fin de journée` : `Meeting Objectives
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
      title: language === "fr" ? "Notes de Présentation" : "Presentation Notes",
      description: language === "fr" ? "Points clés pour votre prochaine présentation" : "Key points for your next presentation",
      icon: Mic,
      category: language === "fr" ? "Prise de parole" : "Speaking",
      tags: language === "fr" ? ["présentation", "conférence", "keynote"] : ["presentation", "speaking", "keynote"],
      content: language === "fr" ? `Introduction (2 min)
Remercier l'audience
Brève présentation personnelle
Définir les attentes

Point principal 1 (5 min)
Explication du concept clé
Données/exemple à l'appui
Transition vers le point suivant

Point principal 2 (5 min)
Explication du concept clé
Données/exemple à l'appui
Transition vers le point suivant

Point principal 3 (5 min)
Explication du concept clé
Données/exemple à l'appui

Conclusion (3 min)
Récapitulatif des trois points
Appel à l'action
Invitation aux questions` : `Introduction (2 min)
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
      title: language === "fr" ? "Procédure Médicale" : "Medical Procedure",
      description: language === "fr" ? "Protocoles cliniques étape par étape" : "Step-by-step clinical protocols",
      icon: Stethoscope,
      category: language === "fr" ? "Santé" : "Healthcare",
      tags: language === "fr" ? ["médical", "procédure", "checklist"] : ["medical", "procedure", "checklist"],
      content: language === "fr" ? `Checklist Pré-Procédure
□ Vérifier l'identité du patient
□ Confirmer la procédure et le site
□ Revoir allergies et médicaments
□ Vérifier le consentement éclairé

Préparation de l'équipement
□ Champ stérile en place
□ Instruments requis prêts
□ Équipement de monitoring calibré

Étapes de la procédure
1. [Description étape 1]
2. [Description étape 2]
3. [Description étape 3]

Post-Procédure
□ Documenter les observations
□ Instructions post-soins
□ Planifier le suivi` : `Pre-Procedure Checklist
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
      title: language === "fr" ? "Module de Formation" : "Training Module",
      description: language === "fr" ? "Livraison de contenu éducatif" : "Educational content delivery",
      icon: GraduationCap,
      category: language === "fr" ? "Éducation" : "Education",
      tags: language === "fr" ? ["formation", "apprentissage", "éducation"] : ["training", "learning", "education"],
      content: language === "fr" ? `Objectifs d'apprentissage
À la fin de ce module, vous serez capable de :
• Comprendre [concept 1]
• Appliquer [compétence 2]
• Démontrer [compétence 3]

Concept clé 1
Définition et explication
Exemple concret
Application pratique

Concept clé 2
Définition et explication
Exemple concret
Application pratique

Évaluation
Questions de vérification rapide :
Q1 : [Question]
Q2 : [Question]

Résumé
Revue des points clés
Ressources supplémentaires
Aperçu du prochain module` : `Learning Objectives
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
      title: language === "fr" ? "Procédure Standard" : "Standard Procedure",
      description: language === "fr" ? "Documentation de processus reproductibles" : "Repeatable process documentation",
      icon: ClipboardList,
      category: language === "fr" ? "Opérations" : "Operations",
      tags: language === "fr" ? ["sop", "processus", "opérations"] : ["sop", "process", "operations"],
      content: language === "fr" ? `Procédure : [Nom]
Version : 1.0
Dernière mise à jour : [Date]

Objectif
Décrire pourquoi cette procédure existe.

Portée
À qui cela s'applique et quand.

Prérequis
□ Accès/permissions requis
□ Outils/matériaux nécessaires
□ Formation complétée

Étapes
1. [Verbe d'action] [quoi] [comment]
2. [Verbe d'action] [quoi] [comment]
3. [Verbe d'action] [quoi] [comment]
4. [Verbe d'action] [quoi] [comment]

Dépannage
Si [problème] : Essayer [solution]
Si [problème] : Escalader vers [contact]

Validation
Procédure complétée par : _______
Date : _______` : `Procedure: [Name]
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

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {language === "fr" ? "Commencer avec un modèle" : "Start from a Template"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "fr" 
            ? "Choisissez un modèle prédéfini pour démarrer rapidement"
            : "Choose a pre-built template to get started quickly"}
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
