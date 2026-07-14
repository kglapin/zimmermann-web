export type Service = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  description: string;
  points: string[];
};

export type Office = {
  city: string;
  address: string;
  postcode: string;
  phone: string;
  tel: string;
  lat: number;
  lng: number;
  directions: string;
};

export const business = {
  name: 'Ubezpieczenia Zimmermann',
  shortName: 'Zimmermann',
  description:
    'Rodzinna multiagencja ubezpieczeniowa w Kaliszu i Krotoszynie. Porównujemy oferty wielu towarzystw i pomagamy także po zawarciu polisy.',
  foundedYear: 2002,
  primaryPhone: '789 315 400',
  primaryTel: '+48789315400',
};

export const services: Service[] = [
  {
    id: 'samochod',
    title: 'Samochód',
    subtitle: 'OC, AC, NNW i Assistance',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=86',
    alt: 'Nowoczesny samochód na drodze',
    description: 'Porównujemy zakres, składkę i najważniejsze różnice między wariantami.',
    points: ['Zakres ochrony', 'Assistance w Polsce i za granicą', 'Pomoc po szkodzie'],
  },
  {
    id: 'dom',
    title: 'Dom i mieszkanie',
    subtitle: 'Majątek i odpowiedzialność',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=86',
    alt: 'Nowoczesny dom jednorodzinny',
    description: 'Dobieramy ochronę murów, wyposażenia i odpowiedzialności prywatnej.',
    points: ['Mury i wyposażenie', 'Zalanie, pożar i przepięcia', 'OC w życiu prywatnym'],
  },
  {
    id: 'zycie',
    title: 'Życie i zdrowie',
    subtitle: 'Bezpieczeństwo rodziny',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1800&q=86',
    alt: 'Rodzina spędzająca wspólnie czas',
    description: 'Pokazujemy warianty dopasowane do sytuacji rodzinnej i budżetu.',
    points: ['Ochrona życia', 'Poważne zachorowania', 'Opieka medyczna'],
  },
  {
    id: 'firma',
    title: 'Firma',
    subtitle: 'Majątek, OC i pracownicy',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=86',
    alt: 'Nowoczesne biuro firmy',
    description: 'Porządkujemy ryzyka firmy i porównujemy najważniejsze zakresy.',
    points: ['OC działalności', 'Mienie i sprzęt', 'Floty i pracownicy'],
  },
  {
    id: 'rolnictwo',
    title: 'Rolnictwo',
    subtitle: 'Gospodarstwo, uprawy i maszyny',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=86',
    alt: 'Pole uprawne w Polsce',
    description: 'Dobieramy ochronę gospodarstwa, budynków, maszyn i upraw.',
    points: ['OC rolnika', 'Budynki i maszyny', 'Uprawy i zwierzęta'],
  },
  {
    id: 'podroze',
    title: 'Podróże',
    subtitle: 'Leczenie, bagaż i ratownictwo',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=86',
    alt: 'Podróżni na lotnisku',
    description: 'Sprawdzamy koszty leczenia, ratownictwo i zakres Assistance.',
    points: ['Koszty leczenia', 'Ratownictwo', 'Sport i choroby przewlekłe'],
  },
];

export const statementLines = [
  ['Najpierw słuchamy', 'Rozpoznajemy potrzeby'],
  ['Potem porównujemy', 'Pokazujemy różnice'],
  ['Zostajemy na dłużej', 'Pomagamy po szkodzie'],
] as const;

export const processSteps = [
  ['Słuchamy', 'Ustalamy, co chcesz zabezpieczyć.'],
  ['Porównujemy', 'Sprawdzamy cenę, zakres i wyłączenia.'],
  ['Wyjaśniamy', 'Pokazujemy najważniejsze różnice.'],
  ['Pomagamy', 'Zostajemy również po zakupie.'],
] as const;

export const claimSteps = [
  ['Zabezpiecz miejsce', 'Zadbaj o bezpieczeństwo i ogranicz dalsze szkody.'],
  ['Zbierz materiały', 'Przygotuj zdjęcia, dane uczestników i dokumenty.'],
  ['Skontaktuj się z nami', 'Wskażemy właściwy kanał i kolejne kroki.'],
] as const;

export const reviews = [
  ['Marcin Gąsiorek', 'Szybka, fachowa obsługa i konkretne wyjaśnienie różnic między ofertami.'],
  ['Magdalena Gumienna', 'Wszystko sprawnie załatwione. Otrzymałam jasne podpowiedzi i dobre rozwiązanie.'],
  ['Katarzyna Bączkiewicz', 'Duża wiedza, zaangażowanie i polisa dobrze dopasowana do moich potrzeb.'],
] as const;

export const faqs = [
  [
    'Czy porównanie ofert jest bezpłatne?',
    'Tak. Rozmowa, analiza potrzeb i przygotowanie wariantów nie zobowiązują do zakupu polisy.',
  ],
  [
    'Czy polisę można zawrzeć zdalnie?',
    'Wiele ubezpieczeń możemy przygotować telefonicznie lub online. Dostępny sposób zawarcia zależy od rodzaju produktu i procedur danego towarzystwa.',
  ],
  [
    'Jakich informacji potrzebujecie do przygotowania propozycji?',
    'Zakres danych zależy od ubezpieczenia. Najczęściej potrzebne są podstawowe dane osoby lub firmy, informacje o przedmiocie ubezpieczenia oraz — jeśli ją posiadasz — obecna polisa. Przed rozmową powiemy dokładnie, co warto przygotować.',
  ],
  [
    'Czy porównujecie wyłącznie cenę?',
    'Nie. Sprawdzamy również zakres ochrony, limity, wyłączenia, udziały własne, warianty Assistance i inne zapisy, które mogą mieć znaczenie przy szkodzie.',
  ],
  [
    'Jak szybko otrzymam propozycje?',
    'Prostsze warianty często można omówić podczas jednej rozmowy. Przy ubezpieczeniu firmy, gospodarstwa lub bardziej złożonego ryzyka przygotowanie rzetelnego porównania może wymagać dodatkowego czasu.',
  ],
  [
    'Czy pomożecie przy zmianie obecnej polisy?',
    'Tak. Sprawdzimy termin obecnej umowy i wyjaśnimy, czy wypowiedzenie jest potrzebne oraz jakie kroki należy wykonać, aby zachować ciągłość ochrony.',
  ],
  [
    'Czy mogę uporządkować u Was kilka ubezpieczeń jednocześnie?',
    'Tak. Możemy przeanalizować między innymi samochód, dom, życie, firmę lub podróże i sprawdzić, czy obecne umowy nie dublują ochrony albo nie pozostawiają istotnych luk.',
  ],
  [
    'Czy obsługujecie klientów spoza Kalisza i Krotoszyna?',
    'Tak. Wiele spraw prowadzimy zdalnie, o ile pozwala na to rodzaj ubezpieczenia i procedura wybranego towarzystwa.',
  ],
  [
    'Czy pomagacie po wystąpieniu szkody?',
    'Tak. Pomagamy ustalić właściwy sposób zgłoszenia, potrzebne dokumenty i kolejne kroki. Decyzję w sprawie odpowiedzialności i wypłaty świadczenia podejmuje towarzystwo ubezpieczeniowe.',
  ],
  [
    'Co zrobić, gdy nie wiem, jakiego zakresu ochrony potrzebuję?',
    'Od tego zaczynamy rozmowę. Najpierw pytamy o sytuację, majątek, zobowiązania i najważniejsze ryzyka, a dopiero później pokazujemy rozwiązania, które warto porównać.',
  ],
] as const;

export const offices: Office[] = [
  {
    city: 'Kalisz',
    address: 'ul. Konopnickiej 3-5, lok. 10',
    postcode: '62-800 Kalisz',
    phone: '789 315 400',
    tel: '+48789315400',
    lat: 51.7486634,
    lng: 18.0757771,
    directions: 'https://www.google.com/maps/dir/?api=1&destination=Konopnickiej+3-5,+62-800+Kalisz',
  },
  {
    city: 'Krotoszyn',
    address: 'ul. Piastowska 30',
    postcode: '63-700 Krotoszyn',
    phone: '502 252 048',
    tel: '+48502252048',
    lat: 51.6954181,
    lng: 17.4327915,
    directions: 'https://www.google.com/maps/dir/?api=1&destination=Piastowska+30,+63-700+Krotoszyn',
  },
];