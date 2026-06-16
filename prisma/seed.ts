import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=80`;

async function main() {
  console.log("🌱 Seeding Pawmani...");

  // Wipe listings (and cascade to images/favorites) so re-runs are idempotent
  await db.listing.deleteMany({});

  // ── Breeders ────────────────────────────────────────────────────────────────

  const breeders = [
    await db.user.upsert({
      where: { email: "sarah@pawmani-seed.dev" },
      update: {},
      create: {
        email: "sarah@pawmani-seed.dev",
        name: "Sarah Mitchell",
        image: img("1494790108377-be9c29b29330"),
        role: "BREEDER",
        breederProfile: {
          create: {
            bio: "Passionate Golden Retriever breeder for over 12 years. All my pups are raised in a loving home environment with proper socialization and vet care from day one.",
            city: "Austin",
            avgRating: 4.9,
            reviewCount: 48,
          },
        },
      },
      include: { breederProfile: true },
    }),

    await db.user.upsert({
      where: { email: "james@pawmani-seed.dev" },
      update: {},
      create: {
        email: "james@pawmani-seed.dev",
        name: "James Park",
        image: img("1507003211169-0a1dd7228f2d"),
        role: "BREEDER",
        breederProfile: {
          create: {
            bio: "TICA-registered Persian and Siamese breeder based in Seattle. Champion bloodlines, health-tested parents, and kittens raised underfoot with lots of love.",
            city: "Seattle",
            avgRating: 4.8,
            reviewCount: 34,
          },
        },
      },
      include: { breederProfile: true },
    }),

    await db.user.upsert({
      where: { email: "maria@pawmani-seed.dev" },
      update: {},
      create: {
        email: "maria@pawmani-seed.dev",
        name: "Maria Rodriguez",
        image: img("1438761681033-6461ffad8d80"),
        role: "BREEDER",
        breederProfile: {
          create: {
            bio: "Avian specialist with 15 years of experience breeding Cockatiels, Conures, and African Greys. All birds are hand-tamed and DNA sexed.",
            city: "Miami",
            avgRating: 4.7,
            reviewCount: 62,
          },
        },
      },
      include: { breederProfile: true },
    }),

    await db.user.upsert({
      where: { email: "tom@pawmani-seed.dev" },
      update: {},
      create: {
        email: "tom@pawmani-seed.dev",
        name: "Tom Chen",
        image: img("1472099645785-5658abf4ff4e"),
        role: "BREEDER",
        breederProfile: {
          create: {
            bio: "French Bulldog and Pomeranian specialist in Los Angeles. Small hobby breeder — only 2–3 litters per year, so every puppy gets individual attention.",
            city: "Los Angeles",
            avgRating: 4.9,
            reviewCount: 27,
          },
        },
      },
      include: { breederProfile: true },
    }),

    await db.user.upsert({
      where: { email: "emma@pawmani-seed.dev" },
      update: {},
      create: {
        email: "emma@pawmani-seed.dev",
        name: "Emma Watson",
        image: img("1489424731084-a5d8b776d85e"),
        role: "BREEDER",
        breederProfile: {
          create: {
            bio: "Holland Lop and Mini Rex rabbit breeder in Denver. ARBA member. My bunnies are litter trained, social, and come with a starter care kit.",
            city: "Denver",
            avgRating: 4.8,
            reviewCount: 19,
          },
        },
      },
      include: { breederProfile: true },
    }),

    await db.user.upsert({
      where: { email: "david@pawmani-seed.dev" },
      update: {},
      create: {
        email: "david@pawmani-seed.dev",
        name: "David Kim",
        image: img("1500648767791-00dcc994a43e"),
        role: "BREEDER",
        breederProfile: {
          create: {
            bio: "Reptile specialist based in New York. Captive-bred Bearded Dragons, Ball Pythons, and Crested Geckos. All animals come with complete care guides.",
            city: "New York",
            avgRating: 4.6,
            reviewCount: 41,
          },
        },
      },
      include: { breederProfile: true },
    }),
  ];

  const [sarah, james, maria, tom, emma, david] = breeders;
  const sarahProfile = sarah.breederProfile!;
  const jamesProfile = james.breederProfile!;
  const mariaProfile = maria.breederProfile!;
  const tomProfile = tom.breederProfile!;
  const emmaProfile = emma.breederProfile!;
  const davidProfile = david.breederProfile!;

  // ── Listings ─────────────────────────────────────────────────────────────────

  const listingsData = [
    // DOGS — Sarah Mitchell (Austin TX)
    {
      breederId: sarahProfile.id,
      title: "Golden Retriever Puppies",
      species: "DOG" as const,
      breed: "Golden Retriever",
      ageValue: 8, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 1800,
      status: "AVAILABLE" as const,
      description: "Beautiful AKC Golden Retriever puppies from champion bloodlines. Health-tested parents, first vaccinations done, microchipped. Raised in our home with children and other dogs.",
      vaccinationStatus: "PARTIAL" as const,
      images: [img("1587300003388-59208cc962cb"), img("1552053831-71594a27632d")],
    },
    {
      breederId: sarahProfile.id,
      title: "Female Golden Retriever",
      species: "DOG" as const,
      breed: "Golden Retriever",
      ageValue: 10, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 1900,
      status: "AVAILABLE" as const,
      description: "Sweet female Golden from our latest litter. Excellent temperament, great with kids. Health guarantee included.",
      vaccinationStatus: "PARTIAL" as const,
      images: [img("1633722715463-4be97c81e3de"), img("1587300003388-59208cc962cb")],
    },
    {
      breederId: sarahProfile.id,
      title: "Labrador Retriever Puppy",
      species: "DOG" as const,
      breed: "Labrador Retriever",
      ageValue: 9, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 1500,
      status: "AVAILABLE" as const,
      description: "Classic yellow Labrador from OFA-tested parents. Ready for his forever home. Loves everyone he meets.",
      vaccinationStatus: "PARTIAL" as const,
      images: [img("1552053831-71594a27632d"), img("1559190394-df5a28aab5c5")],
    },
    {
      breederId: sarahProfile.id,
      title: "German Shepherd Pup",
      species: "DOG" as const,
      breed: "German Shepherd",
      ageValue: 12, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 2200,
      status: "AVAILABLE" as const,
      description: "Working-line German Shepherd from imported European parents. Strong nerves, great drives. Perfect for active families.",
      vaccinationStatus: "FULL" as const,
      images: [img("1589941013453-ec89f33b5e95"), img("1591946614720-90a587da4a36")],
    },
    // BREEDING listings
    {
      breederId: sarahProfile.id,
      title: "Champion Golden Retriever — Stud",
      species: "DOG" as const,
      breed: "Golden Retriever",
      ageValue: 3, ageUnit: "YEARS" as const,
      gender: "MALE" as const,
      price: null,
      status: "AVAILABLE" as const,
      purpose: "BREEDING" as const,
      description: "AKC Champion male Golden Retriever available for stud service. OFA hips Excellent, elbows Normal. Health-tested clear for all genetic conditions. Proven sire with outstanding offspring.",
      vaccinationStatus: "FULL" as const,
      images: [img("1587300003388-59208cc962cb"), img("1552053831-71594a27632d")],
    },
    {
      breederId: jamesProfile.id,
      title: "TICA Grand Champion Persian — Breeding Female",
      species: "CAT" as const,
      breed: "Persian",
      ageValue: 2, ageUnit: "YEARS" as const,
      gender: "FEMALE" as const,
      price: null,
      status: "AVAILABLE" as const,
      purpose: "BREEDING" as const,
      description: "TICA-registered Grand Champion silver Persian available for approved breeding program. PKD-negative, HCM-tested clear. Exceptional bloodlines. Serious breeders only.",
      vaccinationStatus: "FULL" as const,
      images: [img("1478098711619-5ab0b478d6e6"), img("1514888286974-6c03e2ca1dba")],
    },
    {
      breederId: tomProfile.id,
      title: "French Bulldog Stud — DNA Tested",
      species: "DOG" as const,
      breed: "French Bulldog",
      ageValue: 2, ageUnit: "YEARS" as const,
      gender: "MALE" as const,
      price: null,
      status: "AVAILABLE" as const,
      purpose: "BREEDING" as const,
      description: "Compact, typey brindle French Bulldog available for stud. Full DNA health panel clear. BAER hearing tested normal bilaterally. Proven sire. Fresh or chilled shipping available.",
      vaccinationStatus: "FULL" as const,
      images: [img("1583511655826-05700d52f4d9"), img("1605897237323-3ec4e6a8f5a9")],
    },
    {
      breederId: emmaProfile.id,
      title: "Holland Lop Buck — ARBA Registered",
      species: "RABBIT" as const,
      breed: "Holland Lop",
      ageValue: 1, ageUnit: "YEARS" as const,
      gender: "MALE" as const,
      price: null,
      status: "AVAILABLE" as const,
      purpose: "BREEDING" as const,
      description: "Show-quality Holland Lop buck available for breeding. ARBA registered, excellent type and disposition. Would suit does with similar conformation.",
      vaccinationStatus: "NONE" as const,
      images: [img("1585110396000-c9ffd4e4b308"), img("1518715308788-3005759c61d4")],
    },

    // DOGS — Tom Chen (Los Angeles CA)
    {
      breederId: tomProfile.id,
      title: "French Bulldog Puppy",
      species: "DOG" as const,
      breed: "French Bulldog",
      ageValue: 11, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 3500,
      status: "AVAILABLE" as const,
      description: "AKC French Bulldog in brindle. DNA health tested, BAER hearing tested. Parents on site. No puppy mill — small home breeder.",
      vaccinationStatus: "PARTIAL" as const,
      images: [img("1583511655826-05700d52f4d9"), img("1605897237323-3ec4e6a8f5a9")],
    },
    {
      breederId: tomProfile.id,
      title: "Cream French Bulldog",
      species: "DOG" as const,
      breed: "French Bulldog",
      ageValue: 9, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 3800,
      status: "AVAILABLE" as const,
      description: "Stunning cream Frenchie female. Health-tested, playful personality. Comes with puppy pack and lifetime breeder support.",
      vaccinationStatus: "PARTIAL" as const,
      images: [img("1605897237323-3ec4e6a8f5a9"), img("1583511655826-05700d52f4d9")],
    },
    {
      breederId: tomProfile.id,
      title: "Pomeranian Puppy",
      species: "DOG" as const,
      breed: "Pomeranian",
      ageValue: 12, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 2400,
      status: "AVAILABLE" as const,
      description: "Tiny orange Pomeranian from show-quality parents. Incredibly fluffy, spunky personality. All shots up to date.",
      vaccinationStatus: "FULL" as const,
      images: [img("1518717758536-85ae29035b6d"), img("1587300003388-59208cc962cb")],
    },
    {
      breederId: tomProfile.id,
      title: "Corgi Puppy — Pembroke",
      species: "DOG" as const,
      breed: "Pembroke Welsh Corgi",
      ageValue: 10, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 2000,
      status: "AVAILABLE" as const,
      description: "Classic sable-and-white Pembroke Corgi. Big personality in a small package. AKC registrable, health guarantee.",
      vaccinationStatus: "PARTIAL" as const,
      images: [img("1546527868-ccb7ee7dfa6a"), img("1587300003388-59208cc962cb")],
    },
    {
      breederId: sarahProfile.id,
      title: "Miniature Dachshund",
      species: "DOG" as const,
      breed: "Miniature Dachshund",
      ageValue: 14, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 1600,
      status: "AVAILABLE" as const,
      description: "Smooth-coat miniature Dachshund in chocolate & tan. Charming little dog full of personality. Loves cuddles.",
      vaccinationStatus: "FULL" as const,
      images: [img("1425082661705-1834bfd09dca"), img("1518717758536-85ae29035b6d")],
    },
    {
      breederId: tomProfile.id,
      title: "Shih Tzu — Male",
      species: "DOG" as const,
      breed: "Shih Tzu",
      ageValue: 3, ageUnit: "MONTHS" as const,
      gender: "MALE" as const,
      price: 1400,
      status: "AVAILABLE" as const,
      description: "Adorable Shih Tzu in gold and white. Non-shedding, great for apartments. Loves being around people.",
      vaccinationStatus: "PARTIAL" as const,
      images: [img("1587300003388-59208cc962cb"), img("1518717758536-85ae29035b6d")],
    },

    // CATS — James Park (Seattle WA)
    {
      breederId: jamesProfile.id,
      title: "Persian Kitten — Silver",
      species: "CAT" as const,
      breed: "Persian",
      ageValue: 14, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 1600,
      status: "AVAILABLE" as const,
      description: "Gorgeous silver Persian from TICA-registered cattery. Parents are Grand Champions. Health guarantee, PKD-negative. Raised with love in our home.",
      vaccinationStatus: "FULL" as const,
      images: [img("1478098711619-5ab0b478d6e6"), img("1514888286974-6c03e2ca1dba")],
    },
    {
      breederId: jamesProfile.id,
      title: "Siamese Kitten — Blue Point",
      species: "CAT" as const,
      breed: "Siamese",
      ageValue: 12, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 1200,
      status: "AVAILABLE" as const,
      description: "Talkative, intelligent Blue Point Siamese. Traditional apple-head type. Vaccinated, microchipped, litter-trained.",
      vaccinationStatus: "FULL" as const,
      images: [img("1596854407944-bf87f6fdd49e"), img("1478098711619-5ab0b478d6e6")],
    },
    {
      breederId: jamesProfile.id,
      title: "Maine Coon Kitten",
      species: "CAT" as const,
      breed: "Maine Coon",
      ageValue: 16, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 1800,
      status: "AVAILABLE" as const,
      description: "Massive, gentle Maine Coon kitten. Brown tabby with stunning tufted ears. HCM-tested parents, 2-year health guarantee.",
      vaccinationStatus: "FULL" as const,
      images: [img("1574158622682-e40e69881006"), img("1596854407944-bf87f6fdd49e")],
    },
    {
      breederId: jamesProfile.id,
      title: "British Shorthair — Blue",
      species: "CAT" as const,
      breed: "British Shorthair",
      ageValue: 4, ageUnit: "MONTHS" as const,
      gender: "FEMALE" as const,
      price: 2000,
      status: "AVAILABLE" as const,
      description: "Classic blue British Shorthair, plush teddy-bear coat. Calm, affectionate, great with children. TICA registered.",
      vaccinationStatus: "FULL" as const,
      images: [img("1513360371669-4adf3dd7dff8"), img("1574158622682-e40e69881006")],
    },
    {
      breederId: jamesProfile.id,
      title: "Ragdoll Kitten — Seal Bicolor",
      species: "CAT" as const,
      breed: "Ragdoll",
      ageValue: 13, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 1700,
      status: "AVAILABLE" as const,
      description: "Blue-eyed seal bicolor Ragdoll. Goes limp when you pick her up — the true Ragdoll trait. Loves belly rubs.",
      vaccinationStatus: "PARTIAL" as const,
      images: [img("1514888286974-6c03e2ca1dba"), img("1478098711619-5ab0b478d6e6")],
    },
    {
      breederId: jamesProfile.id,
      title: "Bengal Kitten",
      species: "CAT" as const,
      breed: "Bengal",
      ageValue: 12, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 2200,
      status: "AVAILABLE" as const,
      description: "High-glitter spotted Bengal from TICA registered parents. Athletic, curious, and absolutely stunning coat.",
      vaccinationStatus: "FULL" as const,
      images: [img("1513360371669-4adf3dd7dff8"), img("1514888286974-6c03e2ca1dba")],
    },

    // BIRDS — Maria Rodriguez (Miami FL)
    {
      breederId: mariaProfile.id,
      title: "Hand-Tame Cockatiel",
      species: "BIRD" as const,
      breed: "Cockatiel",
      ageValue: 10, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 180,
      status: "AVAILABLE" as const,
      description: "Lutino Cockatiel, fully hand-tamed and learning to whistle. Loves shoulder sitting and head scratches. DNA sexed.",
      vaccinationStatus: "NONE" as const,
      images: [img("1508193638397-1c4234db14d8"), img("1552728089-57bdde30beb3")],
    },
    {
      breederId: mariaProfile.id,
      title: "Green Cheek Conure",
      species: "BIRD" as const,
      breed: "Green Cheek Conure",
      ageValue: 12, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 350,
      status: "AVAILABLE" as const,
      description: "Pineapple Green Cheek Conure, hand-raised and socialized. Playful, cuddly, and surprisingly quiet for a conure.",
      vaccinationStatus: "NONE" as const,
      images: [img("1552728089-57bdde30beb3"), img("1508193638397-1c4234db14d8")],
    },
    {
      breederId: mariaProfile.id,
      title: "African Grey Parrot",
      species: "BIRD" as const,
      breed: "African Grey",
      ageValue: 6, ageUnit: "MONTHS" as const,
      gender: "MALE" as const,
      price: 2800,
      status: "AVAILABLE" as const,
      description: "Congo African Grey, hand-raised from hatch. Already saying a few words. Outstanding intelligence — the Einstein of parrots.",
      vaccinationStatus: "NONE" as const,
      images: [img("1552728089-57bdde30beb3"), img("1508193638397-1c4234db14d8")],
    },
    {
      breederId: mariaProfile.id,
      title: "Sun Conure Pair",
      species: "BIRD" as const,
      breed: "Sun Conure",
      ageValue: 5, ageUnit: "MONTHS" as const,
      gender: "MALE" as const,
      price: 900,
      status: "AVAILABLE" as const,
      description: "Bonded Sun Conure pair — vibrant orange and yellow plumage. Both hand-tame. Selling together only.",
      vaccinationStatus: "NONE" as const,
      images: [img("1508193638397-1c4234db14d8"), img("1552728089-57bdde30beb3")],
    },
    {
      breederId: mariaProfile.id,
      title: "Budgerigar — English",
      species: "BIRD" as const,
      breed: "English Budgerigar",
      ageValue: 8, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 80,
      status: "AVAILABLE" as const,
      description: "Fluffy English Budgie in sky blue. Hand-tame, step-up trained. Perfect first bird for families.",
      vaccinationStatus: "NONE" as const,
      images: [img("1552728089-57bdde30beb3"), img("1508193638397-1c4234db14d8")],
    },

    // RABBITS — Emma Watson (Denver CO)
    {
      breederId: emmaProfile.id,
      title: "Holland Lop Bunny",
      species: "RABBIT" as const,
      breed: "Holland Lop",
      ageValue: 10, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 120,
      status: "AVAILABLE" as const,
      description: "Broken orange Holland Lop, floppy ears and calm personality. Litter trained, ARBA registered parents. Comes with starter hay and pellets.",
      vaccinationStatus: "NONE" as const,
      images: [img("1585110396000-c9ffd4e4b308"), img("1518715308788-3005759c61d4")],
    },
    {
      breederId: emmaProfile.id,
      title: "Mini Rex Rabbit",
      species: "RABBIT" as const,
      breed: "Mini Rex",
      ageValue: 8, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 90,
      status: "AVAILABLE" as const,
      description: "Blue Mini Rex with incredibly plush, velvet-like fur. Gentle and curious. Loves exploring and being held.",
      vaccinationStatus: "NONE" as const,
      images: [img("1518715308788-3005759c61d4"), img("1585110396000-c9ffd4e4b308")],
    },
    {
      breederId: emmaProfile.id,
      title: "Lionhead Bunny",
      species: "RABBIT" as const,
      breed: "Lionhead",
      ageValue: 12, ageUnit: "WEEKS" as const,
      gender: "FEMALE" as const,
      price: 110,
      status: "AVAILABLE" as const,
      description: "White Lionhead with a magnificent mane. Compact and adorable. Socialised with children, litter trained.",
      vaccinationStatus: "NONE" as const,
      images: [img("1585110396000-c9ffd4e4b308"), img("1518715308788-3005759c61d4")],
    },
    {
      breederId: emmaProfile.id,
      title: "Flemish Giant",
      species: "RABBIT" as const,
      breed: "Flemish Giant",
      ageValue: 3, ageUnit: "MONTHS" as const,
      gender: "MALE" as const,
      price: 150,
      status: "AVAILABLE" as const,
      description: "Steel grey Flemish Giant — the gentle giant of the rabbit world. Calm temperament, great with dogs and kids.",
      vaccinationStatus: "NONE" as const,
      images: [img("1518715308788-3005759c61d4"), img("1585110396000-c9ffd4e4b308")],
    },

    // EXOTIC — David Kim (New York NY)
    {
      breederId: davidProfile.id,
      title: "Bearded Dragon",
      species: "EXOTIC" as const,
      breed: "Bearded Dragon",
      ageValue: 8, ageUnit: "WEEKS" as const,
      gender: "MALE" as const,
      price: 200,
      status: "AVAILABLE" as const,
      description: "Citrus morph Bearded Dragon, captive bred. Already eating well on dubia roaches and veggies. Handleable from day one.",
      vaccinationStatus: "NONE" as const,
      images: [img("1504450874802-0ba2bcd9b5ae"), img("1531386151447-fd76ad50012f")],
    },
    {
      breederId: davidProfile.id,
      title: "Ball Python — Pastel",
      species: "EXOTIC" as const,
      breed: "Ball Python",
      ageValue: 4, ageUnit: "MONTHS" as const,
      gender: "FEMALE" as const,
      price: 350,
      status: "AVAILABLE" as const,
      description: "Pastel Ball Python, eating frozen-thawed mice consistently. Very docile and easy to handle. Perfect beginner snake.",
      vaccinationStatus: "NONE" as const,
      images: [img("1531386151447-fd76ad50012f"), img("1504450874802-0ba2bcd9b5ae")],
    },
    {
      breederId: davidProfile.id,
      title: "Crested Gecko",
      species: "EXOTIC" as const,
      breed: "Crested Gecko",
      ageValue: 3, ageUnit: "MONTHS" as const,
      gender: "FEMALE" as const,
      price: 120,
      status: "AVAILABLE" as const,
      description: "Harlequin Crested Gecko, captive bred. No UVB needed, eats CGD readily. Calm and easy to care for.",
      vaccinationStatus: "NONE" as const,
      images: [img("1504450874802-0ba2bcd9b5ae"), img("1531386151447-fd76ad50012f")],
    },
    {
      breederId: davidProfile.id,
      title: "Chinchilla",
      species: "EXOTIC" as const,
      breed: "Chinchilla",
      ageValue: 4, ageUnit: "MONTHS" as const,
      gender: "MALE" as const,
      price: 250,
      status: "AVAILABLE" as const,
      description: "Standard grey Chinchilla with incredibly soft fur. Curious and playful. Comes with care guide and dust bath kit.",
      vaccinationStatus: "NONE" as const,
      images: [img("1531386151447-fd76ad50012f"), img("1504450874802-0ba2bcd9b5ae")],
    },
    {
      breederId: davidProfile.id,
      title: "Veiled Chameleon",
      species: "EXOTIC" as const,
      breed: "Veiled Chameleon",
      ageValue: 3, ageUnit: "MONTHS" as const,
      gender: "MALE" as const,
      price: 180,
      status: "AVAILABLE" as const,
      description: "Captive-bred Veiled Chameleon, eating crickets and dubia. Stunning colour-changing display. For experienced keepers.",
      vaccinationStatus: "NONE" as const,
      images: [img("1504450874802-0ba2bcd9b5ae"), img("1531386151447-fd76ad50012f")],
    },
  ];

  // Insert listings
  for (const data of listingsData) {
    const { images, ...listingData } = data;
    await db.listing.create({
      data: {
        ...listingData,
        images: {
          create: images.map((url, i) => ({
            url,
            displayOrder: i,
            isPrimary: i === 0,
          })),
        },
      },
    });
  }

  // ── Buyer accounts (for reviews) ─────────────────────────────────────────────

  const buyers = [
    await db.user.upsert({ where: { email: "alex@pawmani-seed.dev" }, update: {}, create: { email: "alex@pawmani-seed.dev", name: "Alex Thompson", image: img("1535713875002-d1d0cf377fde"), role: "BUYER" } }),
    await db.user.upsert({ where: { email: "jen@pawmani-seed.dev" }, update: {}, create: { email: "jen@pawmani-seed.dev", name: "Jennifer Lee", image: img("1544005313-94ddf0286df2"), role: "BUYER" } }),
    await db.user.upsert({ where: { email: "mike@pawmani-seed.dev" }, update: {}, create: { email: "mike@pawmani-seed.dev", name: "Mike Garcia", image: img("1570295999919-56ceb5ecca61"), role: "BUYER" } }),
    await db.user.upsert({ where: { email: "priya@pawmani-seed.dev" }, update: {}, create: { email: "priya@pawmani-seed.dev", name: "Priya Patel", image: img("1508214751196-bcfd4ca60f91"), role: "BUYER" } }),
  ];

  // ── Reviews ───────────────────────────────────────────────────────────────────

  const reviewsData = [
    // Sarah Mitchell reviews
    { reviewerId: buyers[0].id, breederId: sarahProfile.id, rating: 5, body: "Sarah was absolutely wonderful to work with. Our Golden puppy is healthy, happy, and incredibly well-socialized. She answered every question patiently and even sent weekly photo updates!" },
    { reviewerId: buyers[1].id, breederId: sarahProfile.id, rating: 5, body: "Bought our Labrador from Sarah 6 months ago. She's been available for follow-up questions ever since. The puppy was exactly as described — sweet temperament, fully vaccinated, no issues." },
    { reviewerId: buyers[2].id, breederId: sarahProfile.id, rating: 5, body: "Professional, caring, and clearly passionate about her dogs. Highly recommend Sarah to anyone looking for a responsibly-bred Golden." },

    // James Park reviews
    { reviewerId: buyers[0].id, breederId: jamesProfile.id, rating: 5, body: "Our Maine Coon kitten is stunning and such a gentle giant. James provided a full health record and the transition to our home was smooth. Will definitely return for our next cat!" },
    { reviewerId: buyers[3].id, breederId: jamesProfile.id, rating: 4, body: "Very knowledgeable about Persian care and grooming. The kitten was a little shy at first but that's normal. Beautiful cat, great breeder." },

    // Maria Rodriguez reviews
    { reviewerId: buyers[1].id, breederId: mariaProfile.id, rating: 5, body: "Maria's hand-taming process is incredible. Our Cockatiel stepped up on day one and has been whistling tunes within a week. Couldn't be happier!" },
    { reviewerId: buyers[2].id, breederId: mariaProfile.id, rating: 5, body: "Bought an African Grey from Maria. Exceptional knowledge, bird was healthy and already knew a few words. She provided a detailed care guide and has been super helpful post-purchase." },
    { reviewerId: buyers[3].id, breederId: mariaProfile.id, rating: 4, body: "Great experience overall. The Conure was exactly as described — playful and cuddly. Shipping was a little stressful for the bird but Maria walked us through everything." },

    // Tom Chen reviews
    { reviewerId: buyers[0].id, breederId: tomProfile.id, rating: 5, body: "Tom's Frenchies are top quality. Our brindle boy passed every vet check with flying colors. Tom clearly puts health first — DNA tested, BAER tested, the works." },
    { reviewerId: buyers[3].id, breederId: tomProfile.id, rating: 5, body: "Bought a Pomeranian from Tom and she's the fluffiest, most lovable thing. Great communication throughout the process." },

    // Emma Watson reviews
    { reviewerId: buyers[1].id, breederId: emmaProfile.id, rating: 5, body: "Emma is a rabbit whisperer. Our Holland Lop was already litter-trained and comfortable being held when we picked her up. The starter kit she included was a lovely touch." },
    { reviewerId: buyers[2].id, breederId: emmaProfile.id, rating: 4, body: "Great experience. The Lionhead is healthy and adorable. Emma was very helpful with diet advice after purchase." },

    // David Kim reviews
    { reviewerId: buyers[0].id, breederId: davidProfile.id, rating: 5, body: "David's Bearded Dragon setup knowledge is unmatched. The care guide he provided saved us hours of research. Our beardie is thriving at 8 months old!" },
    { reviewerId: buyers[1].id, breederId: davidProfile.id, rating: 4, body: "Solid reptile breeder. Ball Python arrived healthy, feeding well. David was quick to respond to my newbie questions." },
  ];

  for (const review of reviewsData) {
    await db.review.upsert({
      where: { reviewerId_breederId: { reviewerId: review.reviewerId, breederId: review.breederId } },
      update: {},
      create: review,
    });
  }

  console.log(`✅ Seeded ${breeders.length} breeders, ${listingsData.length} listings, and ${reviewsData.length} reviews.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
