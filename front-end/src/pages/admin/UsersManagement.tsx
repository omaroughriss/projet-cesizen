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
import { Switch } from "@/components/ui/switch";
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
import { Search, ArrowLeft, UserPlus, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { userService } from '@/services/user.service';
import { User, CreateUserDto, UpdateUserDto } from '@/types';

interface EditUser extends User {
  password?: string;
}

const mockRoles = ["utilisateur", "administrateur"];

const ROLE_MAP = {
  "utilisateur": 2,
  "administrateur": 1
};

const ROLE_MAP_REVERSE = {
  2: "utilisateur",
  1: "administrateur"
} as const;

const UsersManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<EditUser | null>(null);
  const [newUser, setNewUser] = useState<CreateUserDto>({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    username: "",
    password: "",
    activated: true,
    roleId: 2
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleUserStatus = async (id: number, activated: boolean) => {
    try {
      if (activated) {
        await userService.desactivateUser(id);
      } else {
        await userService.reactivateUser(id);
      }
      await fetchUsers();
      toast({
        title: "Succès",
        description: "Le statut de l'utilisateur a été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      await userService.createUser(newUser);
      await fetchUsers();
      setNewUser({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        username: "",
        password: "", 
        activated: true, 
        roleId: 2 
      });
      setIsCreateDialogOpen(false);
      toast({
        title: "Succès",
        description: "Le nouvel utilisateur a été créé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (currentUser) {
      try {
        const { id, role, password, ...updateData } = currentUser;
        const dataToUpdate = {
          ...updateData,
          ...(password ? { password } : {})
        } as UpdateUserDto;
        
        await userService.updateUser(id, dataToUpdate);
        await fetchUsers();
        setCurrentUser(null);
        setIsEditDialogOpen(false);
        toast({
          title: "Succès",
          description: "L'utilisateur a été modifié avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'utilisateur",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleDeleteUser = async () => {
    if (currentUser) {
      try {
        await userService.deleteUser(currentUser.id);
        await fetchUsers();
        setCurrentUser(null);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Succès",
          description: "L'utilisateur a été supprimé avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur",
          variant: "destructive",
        });
      }
    }
  };

  const openEditDialog = (user: User) => {
    setCurrentUser({ ...user, password: "" });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
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
          <h1 className="text-2xl font-bold text-cesidark">Gestion des Utilisateurs</h1>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un utilisateur..."
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
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.lastName}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role.roleName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={user.activated} 
                          onCheckedChange={() => handleToggleUserStatus(user.id, user.activated)}
                        />
                        <span className={user.activated ? "text-green-600" : "text-red-600"}>
                          {user.activated ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-cesilite hover:text-cesidark hover:bg-cesilite/10"
                          onClick={() => openEditDialog(user)}
                        >
                          Modifier
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte utilisateur pour l'application CESIZen.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Nom</label>
                <Input 
                  id="lastName" 
                  value={newUser.lastName} 
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">Prénom</label>
                <Input 
                  id="firstName" 
                  value={newUser.firstName} 
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Nom d'utilisateur</label>
              <Input 
                id="username" 
                value={newUser.username} 
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
              <Input 
                id="password" 
                type="password" 
                value={newUser.password} 
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Rôle</label>
              <Select 
                value={newUser.roleId === 1 ? "administrateur" : "utilisateur"} 
                onValueChange={(value) => setNewUser({...newUser, roleId: ROLE_MAP[value as keyof typeof ROLE_MAP]})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utilisateur">Utilisateur</SelectItem>
                  <SelectItem value="administrateur">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active" 
                checked={newUser.activated} 
                onCheckedChange={(checked) => setNewUser({...newUser, activated: checked})}
              />
              <label htmlFor="active" className="text-sm font-medium">Compte actif</label>
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
              onClick={handleCreateUser}
              disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du compte utilisateur.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-lastName" className="text-sm font-medium">Nom</label>
                  <Input 
                    id="edit-lastName" 
                    value={currentUser.lastName} 
                    onChange={(e) => setCurrentUser({...currentUser, lastName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-firstName" className="text-sm font-medium">Prénom</label>
                  <Input 
                    id="edit-firstName" 
                    value={currentUser.firstName} 
                    onChange={(e) => setCurrentUser({...currentUser, firstName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-username" className="text-sm font-medium">Nom d'utilisateur</label>
                <Input 
                  id="edit-username" 
                  value={currentUser.username} 
                  onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={currentUser.email} 
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-password" className="text-sm font-medium">Mot de passe</label>
                <Input 
                  id="edit-password" 
                  type="password" 
                  value={currentUser.password || ''} 
                  onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                  placeholder="Laisser vide pour ne pas modifier"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-role" className="text-sm font-medium">Rôle</label>
                <Select 
                  value={ROLE_MAP_REVERSE[currentUser.roleId as keyof typeof ROLE_MAP_REVERSE]}
                  onValueChange={(value) => setCurrentUser({...currentUser, roleId: ROLE_MAP[value as keyof typeof ROLE_MAP]})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utilisateur">Utilisateur</SelectItem>
                    <SelectItem value="administrateur">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-active" 
                  checked={currentUser.activated} 
                  onCheckedChange={(checked) => setCurrentUser({...currentUser, activated: checked})}
                />
                <label htmlFor="edit-active" className="text-sm font-medium">Compte actif</label>
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
              onClick={handleEditUser}
              disabled={!currentUser?.firstName || !currentUser?.lastName || !currentUser?.email}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur "{currentUser?.firstName} {currentUser?.lastName}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteUser}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersManagement;
