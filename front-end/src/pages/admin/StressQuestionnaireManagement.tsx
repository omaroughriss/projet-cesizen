
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from '@/components/Logo';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Type for a question
interface StressQuestion {
  id: string;
  label: string;
  points: number;
}

const formSchema = z.object({
  label: z.string().min(5, {
    message: "Le texte de la question doit contenir au moins 5 caractères",
  }),
  points: z.number().min(1, {
    message: "Le score doit être au minimum de 1",
  }).max(100, {
    message: "Le score doit être au maximum de 100",
  }),
});

const StressQuestionnaireManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Example data - in a real app this would come from an API
  const [questions, setQuestions] = useState<StressQuestion[]>([
    { id: 'event1', label: 'Perte d\'un proche', points: 100 },
    { id: 'event2', label: 'Divorce', points: 73 },
    { id: 'event3', label: 'Séparation', points: 65 },
    { id: 'event4', label: 'Problème de santé personnel', points: 53 },
    { id: 'event5', label: 'Perte d\'emploi', points: 47 },
    { id: 'event6', label: 'Problème de santé d\'un proche', points: 44 },
    { id: 'event7', label: 'Mariage', points: 50 },
    { id: 'event8', label: 'Perte de revenu', points: 38 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<StressQuestion | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      points: 10,
    },
  });

  // Open dialog to add a new question
  const handleAddQuestion = () => {
    setCurrentQuestion(null);
    form.reset({ label: "", points: 10 });
    setIsDialogOpen(true);
  };
  
  // Open dialog to edit an existing question
  const handleEditQuestion = (question: StressQuestion) => {
    setCurrentQuestion(question);
    form.reset({ 
      label: question.label,
      points: question.points
    });
    setIsDialogOpen(true);
  };
  
  // Open confirmation dialog to delete a question
  const handleDeleteClick = (question: StressQuestion) => {
    setCurrentQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  // Delete the question
  const confirmDelete = () => {
    if (currentQuestion) {
      setQuestions(questions.filter(q => q.id !== currentQuestion.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Question supprimée",
        description: `La question "${currentQuestion.label}" a été supprimée avec succès.`,
      });
    }
  };
  
  // Save a new question or update an existing one
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (currentQuestion) {
      // Update existing question
      setQuestions(questions.map(q => 
        q.id === currentQuestion.id 
          ? { ...q, label: values.label, points: values.points } 
          : q
      ));
      
      toast({
        title: "Question mise à jour",
        description: "La question a été modifiée avec succès.",
      });
    } else {
      // Add new question
      const newQuestion: StressQuestion = {
        id: `event${Date.now()}`, // Generate a unique ID
        label: values.label,
        points: values.points,
      };
      
      setQuestions([...questions, newQuestion]);
      
      toast({
        title: "Question ajoutée",
        description: "La nouvelle question a été ajoutée au questionnaire.",
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="w-5 h-5 text-cesidark mr-2" />
            <span>Retour au panel admin</span>
          </Button>
          <Logo />
        </header>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cesidark mb-2">Gestion du questionnaire de stress</h1>
          <p className="text-muted-foreground">
            Ajoutez, modifiez ou supprimez les questions et leurs scores associés.
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-cesidark">Liste des questions ({questions.length})</h2>
          </div>
          <Button onClick={handleAddQuestion} className="bg-cesilite hover:bg-cesidark button-hover">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une question
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-cesidark">Question</TableHead>
                <TableHead className="text-center font-semibold text-cesidark w-24">Score</TableHead>
                <TableHead className="text-right font-semibold text-cesidark w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{question.label}</TableCell>
                  <TableCell className="text-center">{question.points}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(question)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {questions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    Aucune question n'a été ajoutée au questionnaire.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Question Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentQuestion ? 'Modifier la question' : 'Ajouter une question'}</DialogTitle>
            <DialogDescription>
              {currentQuestion 
                ? 'Modifiez les détails de cette question et son score associé.' 
                : 'Ajoutez une nouvelle question au questionnaire de stress.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Entrez le texte de la question" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="100" 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        value={field.value} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" className="bg-cesilite hover:bg-cesidark button-hover">
                  {currentQuestion ? 'Enregistrer' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {currentQuestion && (
            <div className="py-4">
              <p className="font-medium text-foreground">{currentQuestion.label}</p>
              <p className="text-sm text-muted-foreground mt-1">Score: {currentQuestion.points}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StressQuestionnaireManagement;
