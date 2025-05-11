import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArticleCard from '../ArticleCard';

describe('ArticleCard Component', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Article',
    content: 'Test Content',
    image: '/test-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    author: 'Test Author',
    categoryId: 1,
    category: {
      id: 1,
      name: 'Test Category',
      description: 'Test Category Description',
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryName: 'Test Category',
      article: [],
      _count: {
        article: 0
      }
    }
  };

  const mockProps = {
    article: mockArticle,
    onClick: () => {},
    index: 0
  };

  test('Rendre ArticleCard avec données d\'article', () => {
    render(
      <BrowserRouter>
        <ArticleCard {...mockProps} />
      </BrowserRouter>
    );

    // Verifier le titre
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
    
    // Verifier le contenu
    expect(screen.getByText(mockArticle.content)).toBeInTheDocument();
  });

  test('Vérifier titre, contenue, image', () => {
    render(
      <BrowserRouter>
        <ArticleCard {...mockProps} />
      </BrowserRouter>
    );

    // Verifier le titre
    const title = screen.getByText(mockArticle.title);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-xl', 'font-semibold');

    // Verifier le contenu
    const content = screen.getByText(mockArticle.content);
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('text-muted-foreground');

    // Verifier l'image si elle est présente
    if (mockArticle.image) {
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockArticle.image);
      expect(image).toHaveAttribute('alt', mockArticle.title);
    }
  });
}); 