export const zines = [
  {
    id: 1,
    slug: "urban-dreams",
    title: "Urban Dreams",
    author: "Alex Rivera",
    description: "A visual exploration of city life and urban architecture through a dreamy, surreal lens.",
    cover: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1964&auto=format&fit=crop",
    tags: ["photography", "architecture", "urban"],
    pages: [
      {
        title: "The Concrete Canvas",
        content:
          "Cities are living, breathing entities. Each building, each street corner tells a story of human ambition and creativity. The urban landscape is a canvas painted with dreams, struggles, and triumphs.\n\nAs we navigate through the concrete jungle, we become part of its narrative, contributing our own chapters to the ever-evolving story of urban life.",
        quote: "The city is not a concrete jungle, it is a human zoo.",
        background: "https://images.unsplash.com/photo-1494522358652-f30e61a60313?q=80&w=2070&auto=format&fit=crop",
        layout: "cinematic-centered",
        parallaxLayers: [
          {
            image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2065&auto=format&fit=crop",
            depth: 0.3,
            position: "background",
          },
        ],
      },
      {
        title: "Vertical Horizons",
        content:
          "Skyscrapers reach toward the heavens, defying gravity and pushing the boundaries of what's possible. These towering structures are monuments to human ingenuity and technological advancement.\n\nFrom the ground, they appear as giants touching the clouds, creating a vertical horizon that defines the urban skyline. Each one has its own personality, its own story to tell.",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1518005068251-37900150dfca?q=80&w=1965&auto=format&fit=crop",
        layout: "split-layout",
        gallery: [
          "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1454793781512-0fafb0a2cae1?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=2070&auto=format&fit=crop",
        ],
      },
      {
        title: "Urban Rhythm",
        content:
          "The pulse of the city beats in its streets. The flow of traffic, the movement of pedestrians, the changing of traffic lights—all part of an intricate dance that defines urban life.\n\nThere's a rhythm to the city, a cadence that changes with the time of day. Morning rush hours, midday lulls, evening commutes, and the quiet of late night each have their own tempo and character.",
        background: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2065&auto=format&fit=crop",
        layout: "full-bleed",
        interactive: true,
        interactiveType: "emotion",
      },
      {
        title: "Hidden Corners",
        content:
          "Beyond the main thoroughfares lie the hidden gems of the city. Quiet alleys, secret gardens, forgotten spaces that offer respite from the urban chaos.\n\nThese hidden corners are where the true character of a city often reveals itself. Away from the tourist attractions and commercial centers, you'll find authentic local culture and unexpected beauty.",
        background: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=2069&auto=format&fit=crop",
        layout: "grid-layout",
        parallaxLayers: [
          {
            image: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=2069&auto=format&fit=crop",
            depth: 0.2,
            position: "background",
          },
          {
            image: "https://images.unsplash.com/photo-1605128005752-04ef74cf7e3a?q=80&w=1964&auto=format&fit=crop",
            depth: 0.5,
            position: "midground",
          },
        ],
      },
      {
        title: "Night Lights",
        content:
          "As darkness falls, the city transforms. Neon signs, street lamps, and illuminated windows create a tapestry of light against the night sky. The city never truly sleeps; it merely shifts into a different state of being.\n\nThe night brings out a different side of urban life—more mysterious, more intimate, sometimes more dangerous, but always captivating.",
        quote: "The night is a different world, painted with artificial stars.",
        image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2070&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070&auto=format&fit=crop",
        layout: "magazine-style",
        interactive: true,
        interactiveType: "poll",
      },
      {
        title: "Urban Poetry",
        content:
          "The city speaks in a language of its own. The whispers of wind between buildings, the rhythm of footsteps on pavement, the symphony of sounds that rise and fall with the day.\n\nThere is poetry in the urban landscape—in the contrast of old and new, in the juxtaposition of nature and structure, in the stories written on the faces of those who call the city home.",
        quote:
          "Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody.",
        background: "https://images.unsplash.com/photo-1519834089823-af2d966a0648?q=80&w=1964&auto=format&fit=crop",
        layout: "immersive-quote",
        interactive: true,
        interactiveType: "tabs",
      },
      {
        title: "Concrete Dreams",
        content:
          "In the heart of the urban landscape, dreams take shape in concrete and steel. Architects and visionaries transform ideas into structures that define the skyline and shape the human experience.\n\nThe city is a testament to human ambition and creativity—a place where dreams are built, brick by brick, story by story, reaching ever upward toward new possibilities.",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop",
        imageCaption: "The evolving skyline of a modern metropolis",
        layout: "photo-essay",
        interactive: true,
        interactiveType: "reveal",
      },
    ],
    credits: {
      design: "Zinima Design Team",
      content: "Alex Rivera",
      photography: "Various Contributors",
    },
  },
  {
    id: 2,
    slug: "digital-nostalgia",
    title: "Digital Nostalgia",
    author: "Sam Chen",
    description: "A retrospective look at the evolution of digital culture and technology through the decades.",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    tags: ["technology", "retro", "culture"],
    pages: [
      {
        title: "The Pixel Revolution",
        content:
          "From 8-bit graphics to photorealistic rendering, the evolution of digital imagery has transformed how we see and interact with technology.\n\nEach pixel tells a story of technological advancement and artistic expression, creating a visual language that has become integral to our modern experience.",
        background: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
        layout: "cinematic-centered",
        parallaxLayers: [
          {
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
            depth: 0.2,
            position: "background",
          },
        ],
      },
      {
        title: "Sound of the Machine",
        content:
          "The bleeps and bloops of early computing have evolved into rich soundscapes that define our digital experiences.\n\nFrom the dial-up modem's distinctive handshake to the carefully crafted notification sounds of modern devices, audio has always been a crucial part of our relationship with technology.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
        layout: "split-layout",
        gallery: [
          "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?q=80&w=2070&auto=format&fit=crop",
        ],
      },
      {
        title: "Connected Lives",
        content:
          "The internet has rewired human connection, creating new forms of community and communication that transcend physical boundaries.\n\nWhat began as a network for researchers has transformed into a global infrastructure that shapes how we work, play, learn, and relate to one another.",
        background: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=2070&auto=format&fit=crop",
        layout: "full-bleed",
        interactive: true,
        interactiveType: "emotion",
      },
      {
        title: "Virtual Identities",
        content:
          "In digital spaces, we craft and curate versions of ourselves, exploring identity in ways impossible in the physical world.\n\nFrom early chat rooms to modern social media profiles, our online personas reflect, refract, and sometimes reimagine who we are.",
        background: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop",
        layout: "grid-layout",
        interactive: true,
        interactiveType: "tabs",
      },
      {
        title: "Future Retrospective",
        content:
          "Looking back from the future, what will we feel nostalgic about from today's digital landscape? What elements of our current technology will become retro curiosities?\n\nAs the pace of technological change accelerates, the lifecycle of digital nostalgia shortens. Today's cutting-edge innovations may become tomorrow's fond memories.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        layout: "magazine-style",
        interactive: true,
        interactiveType: "poll",
      },
      {
        title: "The Digital Revolution",
        content:
          "Technology has fundamentally changed how we live, work, and connect with one another. This digital revolution continues to reshape our world in ways we're still discovering.\n\nFrom the personal computer to the smartphone, from dial-up internet to 5G, each technological leap has brought new possibilities and challenges.",
        quote: "The future is already here — it's just not evenly distributed.",
        background: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
        layout: "immersive-quote",
        interactive: true,
        interactiveType: "reveal",
      },
      {
        title: "Digital Artifacts",
        content:
          "As technology evolves, we leave behind digital artifacts - software, hardware, and media that capture moments in our technological evolution. These artifacts become touchstones of nostalgia.\n\nFloppy disks, CRT monitors, flip phones, and early websites—these relics tell the story of our digital journey and remind us of how far we've come.",
        image: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=2070&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=2070&auto=format&fit=crop",
        layout: "photo-essay",
        gallery: [
          "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=2070&auto=format&fit=crop",
        ],
      },
    ],
    credits: {
      design: "Zinima Design Team",
      content: "Sam Chen",
      photography: "Various Contributors",
    },
  },
  {
    id: 3,
    slug: "nature-patterns",
    title: "Nature Patterns",
    author: "Jordan Taylor",
    description: "Exploring the mathematical beauty and recurring patterns found in the natural world.",
    cover: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop",
    tags: ["nature", "science", "art"],
    pages: [
      {
        title: "Fibonacci's Garden",
        content:
          "The Fibonacci sequence appears throughout nature, from the spiral of a shell to the arrangement of seeds in a sunflower.\n\nThis mathematical pattern—where each number is the sum of the two preceding ones—creates a harmony and balance that we instinctively recognize as beautiful.",
        background: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop",
        layout: "cinematic-centered",
        parallaxLayers: [
          {
            image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop",
            depth: 0.2,
            position: "background",
          },
        ],
      },
      {
        title: "Fractal Landscapes",
        content:
          "Fractals—patterns that repeat at different scales—can be seen in coastlines, mountains, and river networks.\n\nThese self-similar structures create the complex textures and shapes we see in landscapes, demonstrating how simple mathematical rules can generate incredible complexity.",
        image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2089&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2089&auto=format&fit=crop",
        layout: "split-layout",
        gallery: [
          "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2089&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2070&auto=format&fit=crop",
        ],
      },
      {
        title: "Symmetry in Motion",
        content:
          "From the bilateral symmetry of animals to the radial symmetry of flowers, balance is a fundamental principle of natural design.\n\nSymmetry serves both functional and aesthetic purposes in nature, creating efficient structures that are also pleasing to the eye.",
        background: "https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?q=80&w=2080&auto=format&fit=crop",
        layout: "full-bleed",
        interactive: true,
        interactiveType: "emotion",
      },
      {
        title: "Color Theory",
        content:
          "Nature's palette is not random. The colors of plants, animals, and landscapes serve specific purposes and follow certain principles.\n\nFrom the warning colors of poisonous creatures to the attractive hues of flowers designed to lure pollinators, color in nature is both functional and beautiful.",
        background: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1887&auto=format&fit=crop",
        layout: "grid-layout",
        interactive: true,
        interactiveType: "tabs",
      },
      {
        title: "Biomimicry",
        content:
          "Humans have long drawn inspiration from nature's designs. Today, scientists and engineers look to natural patterns to solve complex problems.\n\nFrom Velcro (inspired by burrs) to bullet trains (modeled after kingfisher beaks), biomimicry demonstrates how nature's time-tested patterns can inform human innovation.",
        image: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=2076&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=2076&auto=format&fit=crop",
        layout: "magazine-style",
        interactive: true,
        interactiveType: "poll",
      },
      {
        title: "The Mathematics of Beauty",
        content:
          "Mathematical principles underlie much of what we find beautiful in nature. The golden ratio, Fibonacci sequences, and fractal patterns create a sense of harmony and balance.\n\nOur aesthetic preferences may have evolved to recognize these mathematical patterns as signals of health, fertility, and environmental stability.",
        quote: "Mathematics is the language in which God has written the universe.",
        background: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
        layout: "immersive-quote",
        interactive: true,
        interactiveType: "reveal",
      },
      {
        title: "Nature's Blueprint",
        content:
          "The patterns we observe in nature are not just aesthetically pleasing—they're functional. These designs have been refined through millions of years of evolution to solve specific problems.\n\nBy studying and understanding these patterns, we gain insight into not only the natural world but also potential solutions to our own design challenges.",
        image: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?q=80&w=2070&auto=format&fit=crop",
        background: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?q=80&w=2070&auto=format&fit=crop",
        layout: "photo-essay",
        gallery: [
          "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
        ],
      },
    ],
    credits: {
      design: "Zinima Design Team",
      content: "Jordan Taylor",
      photography: "Various Contributors",
    },
  },
]
