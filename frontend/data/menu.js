// Single source of truth for the coffee menu. Adding a drink or changing a price
// is now a one-line edit here instead of creating/editing a pair of screens.

export const HOT_ICON = 'https://www.freeiconspng.com/uploads/black-flame-icon-png-24.png';
export const COLD_ICON = 'https://static.thenounproject.com/png/1184671-200.png';
export const QR_IMAGE = 'https://img5.pic.in.th/file/secure-sv1/S__30220303.jpeg';

export const SWEETNESS_LEVELS = [25, 50, 75, 100];

export const MENU = [
  {
    id: 'mocca',
    name: 'Mocca',
    price: 50,
    hasSweetness: true,
    image:
      'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
  },
  {
    id: 'americano',
    name: 'Americano',
    price: 50,
    hasSweetness: false,
    image:
      'https://www.acouplecooks.com/wp-content/uploads/2022/01/Iced-Americano-008s.jpg',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    price: 50,
    hasSweetness: true,
    image:
      'https://www.thespruceeats.com/thmb/HJrjMfXdLGHbgMhnM0fMkDx9XPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/what-is-espresso-765702-hero-03_cropped-ffbc0c7cf45a46ff846843040c8f370c.jpg',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    price: 50,
    hasSweetness: true,
    image:
      'https://coffeeaffection.com/wp-content/uploads/2021/02/does-a-cappuccino-have-caffeine.jpg',
  },
  {
    id: 'latte',
    name: 'Latte',
    price: 50,
    hasSweetness: true,
    image:
      'https://coffeeaffection.com/wp-content/uploads/2021/05/Spanish-latte-milk-and-espresso.jpg',
  },
];

export const getDrink = (id) => MENU.find((drink) => drink.id === id);
