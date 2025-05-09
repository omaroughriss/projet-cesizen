// Types pour les utilisateurs
export interface User {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    username: string;
    activated: boolean;
    roleId: number;
    role: Role;
}

export interface CreateUserDto {
    lastName: string;
    firstName: string;
    email: string;
    username: string;
    password: string;
    activated: boolean;
    roleId: number;
}

// Types pour les rôles
export interface Role {
    id: number;
    roleName: string;
    users: User[];
}

export interface CreateRoleDto {
    roleName: string;
}

// Types pour les articles
export interface Article {
    id: number;
    title: string;
    content: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: number;
    category: Category;
}

// Types pour les catégories
export interface Category {
    id: number;
    categoryName: string;
    article: Article[];
}

export interface CreateCategoryDto {
    categoryName: string;
}

// Types pour les questions
export interface Question {
    id: number;
    question: string;
    score: number;
}

// Type pour l'authentification
export interface AuthUser {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    username: string;
    roleId: number;
    activated: boolean;
    role: Role;
} 