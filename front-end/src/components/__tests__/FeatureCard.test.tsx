import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FeatureCard from '../FeatureCard';

describe('FeatureCard Component', () => {
  const mockProps = {
    title: 'Test Title',
    description: 'Test Description',
    image: '/test-image.jpg',
    buttonText: 'Test Button',
    to: '/test-path'
  };

  test('Rendre FeatureCard avec props définies', () => {
    render(
      <BrowserRouter>
        <FeatureCard {...mockProps} />
      </BrowserRouter>
    );
    
    // Verifier que toutes les props sont rendues correctement
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProps.image);
    expect(screen.getByRole('button')).toHaveTextContent(mockProps.buttonText);
  });

  test('Vérifier affichage titre, description, image, bouton', () => {
    render(
      <BrowserRouter>
        <FeatureCard {...mockProps} />
      </BrowserRouter>
    );

    // Verifier le style du titre
    const title = screen.getByText(mockProps.title);
    expect(title).toHaveClass('text-lg', 'font-semibold');

    // Verifier le style du contenu
    const description = screen.getByText(mockProps.description);
    expect(description).toHaveClass('text-muted-foreground');

    // Verifier l'image
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', mockProps.title);

    // Verifier le bouton
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button');
  });
}); 