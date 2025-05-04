
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

// Mock data
const mockArticles = [
  {
    id: 1,
    title: "Comprendre le stress chronique",
    content: "Le stress chronique se distingue du stress aigu par sa durée et son impact. Contrairement au stress aigu qui est une réponse normale à un danger immédiat, le stress chronique persiste sur une longue période. Lorsque vous êtes constamment exposé à des situations stressantes, votre corps maintient un niveau élevé d'hormones de stress, ce qui peut entraîner divers problèmes de santé.\n\nLes symptômes courants du stress chronique comprennent des maux de tête récurrents, des troubles du sommeil, des problèmes digestifs, et une sensation constante d'anxiété. Sur le long terme, le stress chronique peut contribuer à des problèmes plus graves comme l'hypertension, les maladies cardiaques, et la dépression.\n\nPour gérer efficacement le stress chronique, il est important d'adopter plusieurs stratégies complémentaires. La pratique régulière d'activités physiques, les techniques de relaxation comme la méditation ou la respiration profonde, et le maintien d'un réseau social solide sont des éléments clés pour réduire les effets néfastes du stress.",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2080&auto=format&fit=crop",
    category: "Stress"
  },
  {
    id: 2,
    title: "Améliorer la qualité de votre sommeil",
    content: "La qualité du sommeil influence directement notre santé mentale, notre productivité et notre bien-être général. Pourtant, de nombreuses personnes souffrent d'insomnie ou de troubles du sommeil sans en connaître les causes ou les solutions.\n\nPlusieurs facteurs peuvent perturber votre cycle de sommeil : l'exposition aux écrans avant de dormir, la consommation de caféine ou d'alcool, un environnement de sommeil inadapté, et le stress. En comprenant ces facteurs, vous pouvez prendre des mesures pour améliorer votre sommeil.\n\nParmi les techniques efficaces, l'établissement d'une routine régulière de sommeil est primordial. Votre corps fonctionne selon un rythme circadien qui régule vos cycles de sommeil et d'éveil. En vous couchant et en vous levant à la même heure chaque jour, vous renforcez ce rythme naturel.\n\nL'environnement de sommeil joue également un rôle crucial. Une chambre fraîche, sombre et calme favorise un sommeil réparateur. Pensez à limiter l'exposition à la lumière bleue des écrans au moins une heure avant de vous coucher, car elle supprime la production de mélatonine, l'hormone du sommeil.",
    image: "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?q=80&w=2048&auto=format&fit=crop",
    category: "Sommeil"
  },
  {
    id: 3,
    title: "La gestion des émotions négatives",
    content: "Les émotions négatives font partie intégrante de l'expérience humaine. Elles ne sont pas intrinsèquement mauvaises et peuvent même nous fournir des informations précieuses sur nos besoins et nos limites. Le problème survient lorsque ces émotions deviennent écrasantes ou lorsque nous les gérons de manière malsaine.\n\nLa première étape dans la gestion des émotions négatives est de les reconnaître et de les nommer. Cette simple prise de conscience peut souvent diminuer leur intensité et nous donner un sentiment de contrôle. Plutôt que de dire simplement 'Je me sens mal', essayez d'être plus précis : 'Je me sens frustré parce que...' ou 'Je ressens de l'anxiété à propos de...'\n\nUne fois que vous avez identifié vos émotions, vous pouvez explorer diverses stratégies pour les gérer. La pleine conscience vous permet d'observer vos émotions sans jugement, tandis que la restructuration cognitive vous aide à remettre en question les pensées négatives qui alimentent vos émotions.\n\nL'expression émotionnelle, que ce soit par la discussion, l'écriture ou l'art, peut également être bénéfique. N'oubliez pas que demander de l'aide à un ami de confiance ou à un professionnel de la santé mentale est un signe de force, pas de faiblesse.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    category: "Emotions"
  }
];

const mockCategories = ["Stress", "Sommeil", "Emotions"];

const ArticlesManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [articles, setArticles] = useState(mockArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [newArticle, setNewArticle] = useState({ 
    title: "", 
    content: "", 
    image: "", 
    category: ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: "new" | "edit") => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "new") {
        setSelectedImage(file);
        // Create object URL for preview
        const imageUrl = URL.createObjectURL(file);
        setNewArticle({ ...newArticle, image: imageUrl });
      } else {
        setEditSelectedImage(file);
        if (currentArticle) {
          // Create object URL for preview
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

  const handleCreateArticle = () => {
    const id = Math.max(...articles.map(a => a.id)) + 1;
    setArticles([...articles, { ...newArticle, id }]);
    setNewArticle({ title: "", content: "", image: "", category: "" });
    setSelectedImage(null);
    setIsCreateDialogOpen(false);
    toast({
      title: "Article créé",
      description: "L'article a été créé avec succès",
    });
  };

  const handleEditArticle = () => {
    if (currentArticle) {
      setArticles(articles.map(article => 
        article.id === currentArticle.id ? currentArticle : article
      ));
      setCurrentArticle(null);
      setEditSelectedImage(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Article modifié",
        description: "L'article a été modifié avec succès",
      });
    }
  };

  const handleDeleteArticle = () => {
    if (currentArticle) {
      setArticles(articles.filter(article => article.id !== currentArticle.id));
      setCurrentArticle(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès",
      });
    }
  };
  
  const openEditDialog = (article: any) => {
    setCurrentArticle({ ...article });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (article: any) => {
    setCurrentArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const openPreviewDialog = (article: any) => {
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
                        {article.category}
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
                value={newArticle.category} 
                onValueChange={(value) => setNewArticle({...newArticle, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
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
                setNewArticle({ title: "", content: "", image: "", category: "" });
              }}
            >
              Annuler
            </Button>
            <Button 
              className="bg-cesilite hover:bg-cesidark"
              onClick={handleCreateArticle}
              disabled={!newArticle.title || !newArticle.content || !newArticle.image || !newArticle.category}
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
                  value={currentArticle.category} 
                  onValueChange={(value) => setCurrentArticle({...currentArticle, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
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
              disabled={!currentArticle?.title || !currentArticle?.content || !currentArticle?.image || !currentArticle?.category}
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
                  Catégorie: {currentArticle.category}
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
                  <p key={idx} className="text-foreground leading-relaxed">
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
