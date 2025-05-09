import React, { useState, useEffect } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ArrowLeft, Plus, Pencil, Trash2, Search, FileText, RefreshCw, Eye, Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { articleService, CreateArticleDto } from '@/services/article.service';
import { Article, Category } from '@/types';
import { categoryService } from '@/services/category.service';

const ArticlesManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState<CreateArticleDto>({ 
    title: "", 
    content: "", 
    image: "", 
    categoryId: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await articleService.getAllArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: "new" | "edit") => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "new") {
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setNewArticle({ ...newArticle, image: imageUrl });
      } else {
        setEditSelectedImage(file);
        if (currentArticle) {
          const imageUrl = URL.createObjectURL(file);
          setCurrentArticle({ ...currentArticle, image: imageUrl });
        }
      }
      toast({
        title: "Image téléchargée",
        description: "L'image a bien été sélectionnée",
      });
    }
  };

  const handleCreateArticle = async () => {
    try {
      await articleService.createArticle(newArticle);
      await fetchArticles();
      setNewArticle({ title: "", content: "", image: "", categoryId: 0 });
      setSelectedImage(null);
      setIsCreateDialogOpen(false);
      toast({
        title: "Article créé",
        description: "L'article a été créé avec succès",
      });
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article",
        variant: "destructive",
      });
    }
  };

  const handleEditArticle = async () => {
    if (currentArticle) {
      try {
        await articleService.updateArticle(currentArticle.id, {
          title: currentArticle.title,
          content: currentArticle.content,
          image: currentArticle.image,
          categoryId: currentArticle.categoryId
        });
        await fetchArticles();
        setCurrentArticle(null);
        setEditSelectedImage(null);
        setIsEditDialogOpen(false);
        toast({
          title: "Article modifié",
          description: "L'article a été modifié avec succès",
        });
      } catch (error) {
        console.error('Error updating article:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'article",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteArticle = async () => {
    if (currentArticle) {
      try {
        await articleService.deleteArticle(currentArticle.id);
        await fetchArticles();
        setCurrentArticle(null);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Article supprimé",
          description: "L'article a été supprimé avec succès",
        });
      } catch (error) {
        console.error('Error deleting article:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'article",
          variant: "destructive",
        });
      }
    }
  };
  
  const openEditDialog = (article: Article) => {
    setCurrentArticle({ ...article });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (article: Article) => {
    setCurrentArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const openPreviewDialog = (article: Article) => {
    setCurrentArticle(article);
    setIsPreviewDialogOpen(true);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
          <h1 className="text-2xl font-bold text-cesidark">Gestion des Articles</h1>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un article..."
              className="pl-10 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="border-cesilite text-cesilite hover:bg-cesilite/10"
              onClick={() => setSearchQuery("")}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button
              className="bg-cesilite hover:bg-cesidark"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-cesidark" />
                      {truncateText(article.title, 40)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-cesilite/10 text-cesidark">
                        {article.category.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => openPreviewDialog(article)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-cesilite hover:text-cesidark hover:bg-cesilite/10"
                          onClick={() => openEditDialog(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    Aucun article trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Article Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouvel article</DialogTitle>
            <DialogDescription>
              Créez un nouveau contenu pour l'application CESIZen.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Titre</label>
              <Input 
                id="title" 
                value={newArticle.title} 
                onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                placeholder="Titre de l'article"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Catégorie</label>
              <Select 
                value={newArticle.categoryId.toString()} 
                onValueChange={(value) => setNewArticle({...newArticle, categoryId: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image</label>
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Téléverser une image
                </Button>
                <Input 
                  id="image-upload" 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "new")}
                />
                {selectedImage && <span className="text-sm text-muted-foreground">{selectedImage.name}</span>}
              </div>
              
              {newArticle.image && (
                <div className="mt-2 relative rounded-md overflow-hidden w-full h-40">
                  <img 
                    src={newArticle.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Contenu</label>
              <Textarea 
                id="content" 
                value={newArticle.content} 
                onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                placeholder="Contenu complet de l'article..."
                className="h-40"
              />
              <p className="text-xs text-muted-foreground">
                Utilisez deux retours à la ligne pour créer un nouveau paragraphe.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateDialogOpen(false);
                setSelectedImage(null);
                setNewArticle({ title: "", content: "", image: "", categoryId: 0 });
              }}
            >
              Annuler
            </Button>
            <Button 
              className="bg-cesilite hover:bg-cesidark"
              onClick={handleCreateArticle}
              disabled={!newArticle.title || !newArticle.content || !newArticle.image || !newArticle.categoryId}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'article</DialogTitle>
            <DialogDescription>
              Modifiez le contenu de l'article existant.
            </DialogDescription>
          </DialogHeader>
          
          {currentArticle && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">Titre</label>
                <Input 
                  id="edit-title" 
                  value={currentArticle.title} 
                  onChange={(e) => setCurrentArticle({...currentArticle, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium">Catégorie</label>
                <Select 
                  value={currentArticle.categoryId.toString()} 
                  onValueChange={(value) => setCurrentArticle({...currentArticle, categoryId: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-image" className="text-sm font-medium">Image</label>
                <div className="flex items-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('edit-image-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Téléverser une image
                  </Button>
                  <Input 
                    id="edit-image-upload" 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "edit")}
                  />
                  {editSelectedImage && <span className="text-sm text-muted-foreground">{editSelectedImage.name}</span>}
                </div>
                
                {currentArticle.image && (
                  <div className="mt-2 relative rounded-md overflow-hidden w-full h-40">
                    <img 
                      src={currentArticle.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-content" className="text-sm font-medium">Contenu</label>
                <Textarea 
                  id="edit-content" 
                  value={currentArticle.content} 
                  onChange={(e) => setCurrentArticle({...currentArticle, content: e.target.value})}
                  className="h-40"
                />
                <p className="text-xs text-muted-foreground">
                  Utilisez deux retours à la ligne pour créer un nouveau paragraphe.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditSelectedImage(null);
              }}
            >
              Annuler
            </Button>
            <Button 
              className="bg-cesilite hover:bg-cesidark"
              onClick={handleEditArticle}
              disabled={!currentArticle?.title || !currentArticle?.content || !currentArticle?.image || !currentArticle?.categoryId}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Article Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {currentArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl text-cesidark">
                  {currentArticle.title}
                </DialogTitle>
                <DialogDescription className="text-right text-xs text-muted-foreground">
                  Catégorie: {currentArticle.category.categoryName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4 rounded-lg overflow-hidden">
                <img 
                  src={currentArticle.image} 
                  alt={currentArticle.title} 
                  className="w-full h-[200px] md:h-[300px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              </div>
              
              <div className="space-y-4">
                {currentArticle.content.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-foreground leading-relaxed whitespace-pre-wrap break-words max-w-full">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <DialogFooter>
                <Button
                  className="w-full mt-4 bg-cesilite hover:bg-cesidark button-hover"
                  onClick={() => setIsPreviewDialogOpen(false)}
                >
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Article Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'article "{currentArticle?.title}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteArticle}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArticlesManagement;
