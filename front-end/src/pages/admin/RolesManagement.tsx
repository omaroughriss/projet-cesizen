
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
import { ArrowLeft, Plus, Pencil, Trash2, Shield } from 'lucide-react';
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

// Mock data
const mockRoles = [
  { id: 1, name: "Administrateur", permissions: ["Gérer les utilisateurs", "Gérer les rôles", "Gérer les articles", "Gérer les catégories"] },
  { id: 2, name: "Editeur", permissions: ["Gérer les articles", "Gérer les catégories"] },
  { id: 3, name: "Utilisateur", permissions: ["Lire les articles"] }
];

const mockPermissions = [
  "Gérer les utilisateurs",
  "Gérer les rôles",
  "Gérer les articles",
  "Gérer les catégories", 
  "Lire les articles"
];

const RolesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(mockRoles);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] as string[] });

  const handleCreateRole = () => {
    const id = Math.max(...roles.map(r => r.id)) + 1;
    setRoles([...roles, { ...newRole, id }]);
    setNewRole({ name: "", permissions: [] });
    setIsCreateDialogOpen(false);
  };

  const handleEditRole = () => {
    if (currentRole) {
      setRoles(roles.map(role => 
        role.id === currentRole.id ? currentRole : role
      ));
      setCurrentRole(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteRole = () => {
    if (currentRole) {
      setRoles(roles.filter(role => role.id !== currentRole.id));
      setCurrentRole(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const openEditDialog = (role: any) => {
    setCurrentRole({ ...role });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (role: any) => {
    setCurrentRole(role);
    setIsDeleteDialogOpen(true);
  };

  const togglePermission = (permission: string, target: "new" | "current") => {
    if (target === "new") {
      if (newRole.permissions.includes(permission)) {
        setNewRole({
          ...newRole,
          permissions: newRole.permissions.filter(p => p !== permission)
        });
      } else {
        setNewRole({
          ...newRole,
          permissions: [...newRole.permissions, permission]
        });
      }
    } else if (currentRole) {
      if (currentRole.permissions.includes(permission)) {
        setCurrentRole({
          ...currentRole,
          permissions: currentRole.permissions.filter((p: string) => p !== permission)
        });
      } else {
        setCurrentRole({
          ...currentRole,
          permissions: [...currentRole.permissions, permission]
        });
      }
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
          <h1 className="text-2xl font-bold text-cesidark">Gestion des Rôles</h1>
        </header>

        <div className="flex justify-end mb-6">
          <Button
            className="bg-cesilite hover:bg-cesidark"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau rôle
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du rôle</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-cesidark" />
                    {role.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="bg-cesilite/10 text-cesidark">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-cesilite hover:text-cesidark hover:bg-cesilite/10"
                        onClick={() => openEditDialog(role)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(role)}
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

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau rôle</DialogTitle>
            <DialogDescription>
              Définissez le nom et les permissions pour ce rôle.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="role-name" className="text-sm font-medium">Nom du rôle</label>
              <Input 
                id="role-name" 
                value={newRole.name} 
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                placeholder="Ex: Modérateur"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Permissions</label>
              <div className="grid grid-cols-1 gap-2 p-2 border rounded-md">
                {mockPermissions.map((permission, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                    onClick={() => togglePermission(permission, "new")}
                  >
                    <div className={`w-4 h-4 rounded mr-2 border flex items-center justify-center ${
                      newRole.permissions.includes(permission) 
                        ? "bg-cesilite border-cesilite" 
                        : "border-gray-300"
                    }`}>
                      {newRole.permissions.includes(permission) && 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      }
                    </div>
                    <span>{permission}</span>
                  </div>
                ))}
              </div>
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
              onClick={handleCreateRole}
              disabled={!newRole.name || newRole.permissions.length === 0}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rôle</DialogTitle>
            <DialogDescription>
              Modifiez le nom et les permissions de ce rôle.
            </DialogDescription>
          </DialogHeader>
          
          {currentRole && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-role-name" className="text-sm font-medium">Nom du rôle</label>
                <Input 
                  id="edit-role-name" 
                  value={currentRole.name} 
                  onChange={(e) => setCurrentRole({...currentRole, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Permissions</label>
                <div className="grid grid-cols-1 gap-2 p-2 border rounded-md">
                  {mockPermissions.map((permission, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                      onClick={() => togglePermission(permission, "current")}
                    >
                      <div className={`w-4 h-4 rounded mr-2 border flex items-center justify-center ${
                        currentRole.permissions.includes(permission) 
                          ? "bg-cesilite border-cesilite" 
                          : "border-gray-300"
                      }`}>
                        {currentRole.permissions.includes(permission) && 
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        }
                      </div>
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
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
              onClick={handleEditRole}
              disabled={!currentRole?.name || currentRole?.permissions.length === 0}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le rôle</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le rôle "{currentRole?.name}" ? 
              Cette action est irréversible et pourrait affecter les utilisateurs assignés à ce rôle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteRole}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RolesManagement;
