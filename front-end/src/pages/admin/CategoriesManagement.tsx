
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Pencil, Trash2, Tag } from 'lucide-react';

// Mock data
const mockCategories = [
  { id: 1, name: "Stress", articlesCount: 3 },
  { id: 2, name: "Sommeil", articlesCount: 1 },
  { id: 3, name: "Emotions", articlesCount: 2 }
];

const CategoriesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(mockCategories);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: "" });

  const handleCreateCategory = () => {
    const id = Math.max(...categories.map(c => c.id)) + 1;
    setCategories([...categories, { id, name: newCategory.name, articlesCount: 0 }]);
    setNewCategory({ name: "" });
    setIsCreateDialogOpen(false);
  };

  const handleEditCategory = () => {
    if (currentCategory) {
      setCategories(categories.map(category => 
        category.id === currentCategory.id ? { ...currentCategory } : category
      ));
      setCurrentCategory(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteCategory = () => {
    if (currentCategory) {
      setCategories(categories.filter(category => category.id !== currentCategory.id));
      setCurrentCategory(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const openEditDialog = (category: any) => {
    setCurrentCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
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
          <h1 className="text-2xl font-bold text-cesidark">Gestion des Catégories</h1>
        </header>

        <div className="flex justify-end mb-6">
          <Button
            className="bg-cesilite hover:bg-cesidark"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle catégorie
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la catégorie</TableHead>
                <TableHead>Nombre d'articles</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-cesidark" />
                    <Badge variant="outline" className="bg-cesilite/10 text-cesidark">
                      {category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.articlesCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-cesilite hover:text-cesidark hover:bg-cesilite/10"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(category)}
                        disabled={category.articlesCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Les catégories permettent d'organiser les articles par thématique.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="category-name" className="text-sm font-medium">Nom de la catégorie</label>
              <Input 
                id="category-name" 
                value={newCategory.name} 
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="Ex: Nutrition"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              className="bg-cesilite hover:bg-cesidark"
              onClick={handleCreateCategory}
              disabled={!newCategory.name}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Renommez la catégorie existante.
            </DialogDescription>
          </DialogHeader>
          
          {currentCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-category-name" className="text-sm font-medium">Nom de la catégorie</label>
                <Input 
                  id="edit-category-name" 
                  value={currentCategory.name} 
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              className="bg-cesilite hover:bg-cesidark"
              onClick={handleEditCategory}
              disabled={!currentCategory?.name}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{currentCategory?.name}" ? 
              Cette action est irréversible.
              {currentCategory?.articlesCount > 0 && (
                <p className="mt-2 text-red-500">
                  Cette catégorie contient {currentCategory.articlesCount} article(s). 
                  Veuillez d'abord déplacer ou supprimer ces articles.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteCategory}
              disabled={currentCategory?.articlesCount > 0}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriesManagement;
