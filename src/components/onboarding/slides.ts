export type Slide = {
  image: string;
  location: string;
  title: string;
  body: string;
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const slides: Slide[] = [
  {
    image: photo("photo-1449158743715-0a90ebb6d2d8"),
    location: "Whistler, BC",
    title: "Find a stay that fits your story",
    body: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
  },
  {
    image: photo("photo-1520250497591-112f2f40a3f4"),
    location: "Tulum, Mexico",
    title: "Stay somewhere that fits your pace",
    body: "Describe the trip in one sentence and roam ranks stays that match, from quiet retreats to lively city lofts.",
  },
  {
    image: photo("photo-1502784444187-359ac186c5bb"),
    location: "Lisbon, Portugal",
    title: "Book with clear, honest policies",
    body: "Ask about cancellation, pets, and house rules and get the host's exact words, never a guess.",
  },
];
