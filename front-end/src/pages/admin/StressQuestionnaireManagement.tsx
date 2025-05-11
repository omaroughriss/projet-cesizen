import React, { useState, useEffect } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import Logo from '@/components/Logo';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { questionService, CreateQuestionDto } from '@/services/question.service';
import { Question } from '@/types';

const formSchema = z.object({
  question: z.string().min(5, {
    message: "Le texte de la question doit contenir au moins 5 caractères",
  }).nonempty("La question est requise"),
  score: z.coerce.number().min(1, {
    message: "Le score doit être au minimum de 1",
  }).max(100, {
    message: "Le score doit être au maximum de 100",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const StressQuestionnaireManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      score: 10,
    },
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions",
        variant: "destructive"
      });
    }
  };

  const handleAddQuestion = () => {
    setCurrentQuestion(null);
    form.reset({ question: "", score: 10 });
    setIsDialogOpen(true);
  };
  
  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question);
    form.reset({ 
      question: question.question,
      score: question.score
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (question: Question) => {
    setCurrentQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (currentQuestion) {
      try {
        await questionService.deleteQuestion(currentQuestion.id);
        await fetchQuestions();
        setIsDeleteDialogOpen(false);
        toast({
          title: "Question supprimée",
          description: `La question "${currentQuestion.question}" a été supprimée avec succès.`,
        });
      } catch (error) {
        console.error('Error deleting question:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la question",
          variant: "destructive"
        });
      }
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    try {
      if (currentQuestion) {
        await questionService.updateQuestion(currentQuestion.id, values as CreateQuestionDto);
        toast({
          title: "Question mise à jour",
          description: "La question a été modifiée avec succès.",
        });
      } else {
        const questionData: CreateQuestionDto = {
          question: values.question,
          score: values.score
        };
        await questionService.createQuestion(questionData);
        toast({
          title: "Question ajoutée",
          description: "La nouvelle question a été ajoutée au questionnaire.",
        });
      }
      await fetchQuestions();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la question",
        variant: "destructive"
      });
    }
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
            <span>Retour au tableau de bord</span>
          </Button>
          <h1 className="text-2xl font-bold text-cesidark">Gestion du questionnaire</h1>
        </header>
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
                  <TableCell className="font-medium">{question.question}</TableCell>
                  <TableCell className="text-center">{question.score}</TableCell>
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
                name="question"
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
                name="score"
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
              <p className="font-medium text-foreground">{currentQuestion.question}</p>
              <p className="text-sm text-muted-foreground mt-1">Score: {currentQuestion.score}</p>
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
