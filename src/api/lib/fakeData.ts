import { Movie, Review } from "../../types";

const TIMES = {
  hours: ["02", "03", "04", "05", "06", "07", "08", "09", "10", "11"],
  minutes: ["10", "20", "30", "40", "50"],
};

/**
 * Generates a random set of showtimes for a movie
 * @returns an array of showtimes for the next 6 days
 */
const genShowTimes = () => {
  const res = [];
  for (let i = 1; i < 7; i++) {
    const day = {
      day: new Date(Date.now() + i * DAY).toDateString(),
      times: [] as string[],
    };
    // randomly add 1- 5 showtimes based on the TIMES object
    for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
      const hour = TIMES.hours[Math.floor(Math.random() * TIMES.hours.length)];
      const minute =
        TIMES.minutes[Math.floor(Math.random() * TIMES.minutes.length)];
      day.times.push(`${hour}:${minute}PM`);
    }
    // sort the times
    day.times = Array.from(new Set(day.times)).sort();
    res.push(day);
  }
  return res;
};

// 1 day in milliseconds
const DAY = 1000 * 60 * 60 * 24;

/**
 * a list of movies to use for testing
 */
export const MOVIES: Movie[] = [
  {
    movie_id: "tt1234567",
    title: "Oppenheimer",
    year: "2023",
    rating: "R",
    poster: "Document2_htm_6e6a41119b9ce1f7",
    plot: "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.",
    genres: ["Biography", "Drama", "History"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234568",
    title: "Spider-Man: Across the Spider-Verse",
    year: "2023",
    rating: "PG",
    poster: "Document2_htm_dd1a88e6d7d098ec",
    plot: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    genres: ["Animation", "Action", "Adventure"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234569",
    title: "Mission: Impossible - Dead Reckoning Part One",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_7b57183b1c5f69f2",
    plot: "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.",
    genres: ["Action", "Adventure", "Thriller"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234570",
    title: "John Wick: Chapter 4",
    year: "2023",
    rating: "R",
    poster: "Document2_htm_c7b919c1465e06d4",
    plot: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    genres: ["Action", "Crime", "Thriller"],
    showTimes: genShowTimes(),
  },

  {
    movie_id: "tt1234572",
    title: "Dune: Part Two",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_f6f16106c7f9f014",
    plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    genres: ["Action", "Adventure", "Drama"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234573",
    title: "A Haunting in Venice",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_c5e16bfb6dd9244a",
    plot: "In post-World War II Venice, Poirot, now retired and living in his own exile, reluctantly attends a seance. But when one of the guests is murdered, it is up to the former detective to once again uncover the killer.",
    genres: ["Crime", "Drama", "Horror"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234574",
    title: "Indiana Jones and the Dial of Destiny",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_a2487a2c3c6b1252",
    plot: "Archaeologist Indiana Jones races against time to retrieve a legendary artifact that can change the course of history.",
    genres: ["Action", "Adventure"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234575",
    title: "The Batman",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_dcb5fd75f74dd4f2",
    plot: "In his second year of fighting crime, Batman explores the corruption that plagues Gotham City and how it may tie to his own family, while also coming into conflict with a serial killer known as the Riddler.",
    genres: ["Action", "Crime", "Drama"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234576",
    title: "Jurassic World: Dominion",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_bc207ccbc0b336f9",
    plot: "The sixth and final installment of the Jurassic Park franchise, which follows the aftermath of the events of Jurassic World: Fallen Kingdom, in which dinosaurs have been unleashed on the world.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234578",
    title: "Black Panther: Wakanda Forever",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_8fcfb0f1a877276a",
    plot: "The sequel to the Academy Award-winning Black Panther, which will continue to explore the incomparable world of Wakanda and all of the rich and varied characters introduced in the first film.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234579",
    title: "The Flash",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_bf0525e9b3fcfc24",
    plot: "Barry Allen, aka The Flash, travels back in time to prevent his mother's murder, which brings unintended consequences to his timeline.",
    genres: ["Action", "Adventure", "Fantasy"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234580",
    title: "Fantastic Beasts and Where to Find Them: The Secrets of Dumbledore",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_9b1fa59041ab9bf8",
    plot: "The third installment of the Fantastic Beasts series, which follows the adventures of Newt Scamander and his friends in the wizarding world of the early 20th century.",
    genres: ["Adventure", "Family", "Fantasy"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1630029",
    title: "Avatar: The Way of Water",
    year: "2022",
    rating: "PG-13",
    poster: "Document2_htm_f8285bbfcfdcf3a9",
    plot: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234583",
    title: "The Matrix Resurrections",
    year: "2021",
    rating: "R",
    poster: "Document2_htm_ebaf0077598e0793",
    plot: "Neo and Trinity return to the world of the Matrix, where they encounter familiar and new faces, as well as a dangerous new threat that could destroy everything they fought for.",
    genres: ["Action", "Sci-Fi"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1234585",
    title: "Guardians of the Galaxy Vol. 3",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_8da26b10c8ee3f84",
    plot: "The third and final installment of the Guardians of the Galaxy trilogy, which follows the misfit team of heroes as they face new challenges and enemies in the cosmic realm.",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt10648342",
    title: "Thor: Love and Thunder",
    year: "2022",
    rating: "PG-13",
    poster: "Document2_htm_a7d089f5a7976088",
    plot: "Thor tries to find inner peace, but must return to action and recruit Valkyrie, Korg, and Jane Foster - who is now the Mighty Thor - to stop Gorr the God Butcher from eliminating all gods.",
    genres: ["Action", "Adventure", "Comedy"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt12362592",
    title: "Barbie",
    year: "2023",
    rating: "PG",
    poster: "Document2_htm_e7be8af70e120fb4",
    plot: "Barbie is a fashion doll who gets expelled from Barbieland for not being perfect enough. She goes on an adventure in the real world, where she discovers that being yourself is the most important thing.",
    genres: ["Comedy", "Family", "Fantasy"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt27989345",
    title: "Dungeons & Dragons",
    year: "2023",
    rating: "",
    poster: "Document2_htm_dd7acd6acbaffcda",
    plot: "A group of adventurers embark on a quest to find a mythical treasure in a fantasy world inspired by the popular role-playing game.",
    genres: ["Action", "Adventure", "Fantasy"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt14534054",
    title: "Elemental",
    year: "2023",
    rating: "PG",
    poster: "Document2_htm_fece228d667a3437",
    plot: "Elemental is an upcoming animated film by Pixar, set to be released in June 2023. It is directed by Peter Sohn, who previously directed The Good Dinosaur (2015), and features the voices of Leah Lewis, Mamoudou Athie, Ronnie del Carmen, and Shila Ommi. The film is set in a world where fire-, water-, land- and air-residents live together, and follows the friendship between a fiery young woman named Ember and a go-with-the-flow guy named Wade.",
    genres: ["Adventure", "Comedy", "Fantasy"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt2798920",
    title: "Transformers: Rise of the Beasts",
    year: "2023",
    rating: "R",
    poster: "Document2_htm_5010027795b299e0",
    plot: "A group of adventurers embark on a quest to find a mythical treasure in a fantasy world inspired by the popular role-playing game.",
    genres: ["Action", "Adventure", "Fantasy"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt6718170",
    title: "The Super Mario Bros. Movie",
    year: "2023",
    rating: "PG",
    poster: "Document2_htm_2b539974f7523d78",
    plot: "A plumber named Mario travels through an underground labyrinth with his brother, Luigi, trying to save a captured princess.",
    genres: ["Animation", "Adventure", "Comedy"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt1745960",
    title: "Top Gun: Maverick",
    year: "2022",
    rating: "PG-13",
    poster: "Document2_htm_301e4df0859d3b6d",
    plot: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN’s elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    genres: ["Action", "Drama"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt14230388",
    title: "Asteroid City",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_2cad7cfe71404824",
    plot: "Following a writer on his world famous fictional play about a grieving father who travels with his tech-obsessed family to small rural Asteroid City to compete in a junior stargazing event, only to have his world view disrupted forever.",
    genres: ["Comedy", "Drama", "Romance"],
    showTimes: genShowTimes(),
  },
  {
    movie_id: "tt10954600",
    title: "Ant-Man and the Wasp: Quantumania",
    year: "2023",
    rating: "PG-13",
    poster: "Document2_htm_590ba89081100ef3",
    plot: "When Scott Lang and Hope van Dyne, along with Hope’s parents, Hank Pym and Janet van Dyne, and Scott’s daughter, Cassie, are accidentally sent to the Quantum Realm, they soon find themselves exploring the Realm, interacting with strange new creatures and facing off against Kang the Conqueror.",
    genres: ["Action", "Adventure", "Comedy"],
    showTimes: genShowTimes(),
  },
];

export const REVIEWS: Review[] = [];
