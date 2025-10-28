// Datos de atletas de ejemplo para demostración
export const atletasEjemplo = [
  {
    id: 1,
    nombre: 'Lionel Messi',
    foto: '/src/assets/players/player1.png',
    deporte: 'Fútbol',
    edad: 36,
    nacionalidad: 'Argentina',
    altura: 170,
    peso: 72,
    club: 'Inter Miami',
    somatotipo: 'Mesomorfo',
    capacidades: {
      potencia: 92,
      fuerza: 78,
      velocidad: 88,
      flexibilidad: 85,
      resistencia: 90
    }
  },
  {
    id: 2,
    nombre: 'Cristiano Ronaldo',
    foto: '/src/assets/players/player2.png',
    deporte: 'Fútbol',
    edad: 38,
    nacionalidad: 'Portugal',
    altura: 187,
    peso: 84,
    club: 'Al Nassr',
    somatotipo: 'Mesomorfo Atlético',
    capacidades: {
      potencia: 95,
      fuerza: 92,
      velocidad: 86,
      flexibilidad: 80,
      resistencia: 88
    }
  },
  {
    id: 3,
    nombre: 'Neymar Jr',
    foto: '/src/assets/players/player3.png',
    deporte: 'Fútbol',
    edad: 31,
    nacionalidad: 'Brasil',
    altura: 175,
    peso: 68,
    club: 'Al Hilal',
    somatotipo: 'Ectomorfo',
    capacidades: {
      potencia: 88,
      fuerza: 75,
      velocidad: 94,
      flexibilidad: 92,
      resistencia: 84
    }
  },
  {
    id: 4,
    nombre: 'Kylian Mbappé',
    foto: '/src/assets/players/player4.png',
    deporte: 'Fútbol',
    edad: 24,
    nacionalidad: 'Francia',
    altura: 178,
    peso: 73,
    club: 'PSG',
    somatotipo: 'Mesomorfo',
    capacidades: {
      potencia: 94,
      fuerza: 82,
      velocidad: 98,
      flexibilidad: 88,
      resistencia: 86
    }
  },
  {
    id: 5,
    nombre: 'Erling Haaland',
    foto: '/src/assets/players/player5.png',
    deporte: 'Fútbol',
    edad: 23,
    nacionalidad: 'Noruega',
    altura: 194,
    peso: 88,
    club: 'Manchester City',
    somatotipo: 'Mesomorfo Endomorfo',
    capacidades: {
      potencia: 96,
      fuerza: 94,
      velocidad: 91,
      flexibilidad: 78,
      resistencia: 85
    }
  }
];

// Función para generar capacidades aleatorias basadas en somatotipo
export const generarCapacidadesPorSomatotipo = (somatotipo: string) => {
  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  switch (somatotipo) {
    case 'Ectomorfo':
      // Ectomorfo: más velocidad y flexibilidad, menos fuerza
      return {
        potencia: random(70, 85),
        fuerza: random(60, 75),
        velocidad: random(85, 95),
        flexibilidad: random(85, 95),
        resistencia: random(75, 88)
      };
    
    case 'Mesomorfo':
      // Mesomorfo: equilibrado, valores altos en todo
      return {
        potencia: random(85, 95),
        fuerza: random(80, 92),
        velocidad: random(80, 92),
        flexibilidad: random(78, 88),
        resistencia: random(82, 92)
      };
    
    case 'Endomorfo':
      // Endomorfo: más fuerza y potencia, menos velocidad
      return {
        potencia: random(88, 96),
        fuerza: random(88, 96),
        velocidad: random(70, 82),
        flexibilidad: random(70, 80),
        resistencia: random(80, 90)
      };
    
    default:
      // Por defecto: valores promedio
      return {
        potencia: random(75, 85),
        fuerza: random(75, 85),
        velocidad: random(75, 85),
        flexibilidad: random(75, 85),
        resistencia: random(75, 85)
      };
  }
};
