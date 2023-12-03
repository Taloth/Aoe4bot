const civs = [
    {
        id: 'abbasid_dynasty',
        name: 'Abbasid Dynasty',
        shortName: 'Abbasid',
        altNames: []
    },
    {
        id: 'chinese',
        name: 'Chinese',
        shortName: 'Chinese',
        altNames: []
    },
    {
        id: 'delhi_sultanate',
        name: 'Delhi Sultanate',
        shortName: 'Delhi',
        altNames: [ 'Del' ]
    },
    {
        id: 'english',
        name: 'English',
        shortName: 'English',
        altNames: [ 'Eng' ]
    },
    {
        id: 'french',
        name: 'French',
        shortName: 'French',
        altNames: [ 'Fr' ]
    },
    {
        id: 'holy_roman_empire',
        name: 'Holy Roman Empire',
        shortName: 'HRE',
        altNames: [ 'Holy' ]
    },
    {
        id: 'mongols',
        name: 'Mongols',
        shortName: 'Mongols',
        altNames: [ 'Mon', 'Mongol' ]
    },
    {
        id: 'rus',
        name: 'Rus',
        shortName: 'Rus',
        altNames: [ 'Rus' ]
    },
    {
        id: 'malians',
        name: 'Malians',
        shortName: 'Malians',
        altNames: [ 'Mal', 'Malian' ]
    },
    {
        id: 'ottomans',
        name: 'Ottomans',
        shortName: 'Ottomans',
        altNames: [ 'Ott', 'Otto', 'Ottoman' ]
    },
    {
        id: 'ayyubids',
        name: 'Ayyubids',
        shortName: 'Ayyubids',
        altNames: [ 'Ayy', 'Ayu', 'Ayyubid' ]
    },
    {
        id: 'byzantines',
        name: 'Byzantines',
        shortName: 'Byzantines',
        altNames: [ 'Byz', 'Byzantine' ]
    },
    {
        id: 'japanese',
        name: 'Japanese',
        shortName: 'Japanese',
        altNames: [ 'Jap', 'Jpn' ]
    },
    {
        id: 'jeanne_darc',
        name: 'Jeanne d\'Arc',
        shortName: 'Jeanne d\'Arc',
        altNames: [ 'JDA', 'JD', 'Jeanne', 'John Dark' ]
    },
    {
        id: 'order_of_the_dragon',
        name: 'Order of the Dragon',
        shortName: 'OotD',
        altNames: [ 'OTD' ]
    },
    {
        id: 'zhu_xis_legacy',
        name: 'Zhu Xi\'s Legacy',
        shortName: 'Zhu Xi',
        altNames: [ 'Zhu', 'Zhuxi' ]
    }
];

const maps = [
    {
        name: 'Dry Arabia',
        altNames: []
    },
    {
        name: 'High View',
        altNames: []
    },
    {
        name: 'Hill and Dale',
        altNames: [ 'Hill', 'Hill&Dale' ]
    },
    {
        name: 'King of the Hill',
        altNames: [ 'KotH' ]
    },
    {
        name: 'Altai',
        altNames: []
    },
    {
        name: 'Lipany',
        altNames: []
    },
    {
        name: 'Mountain Pass',
        altNames: []
    },
    {
        name: 'Mongolian Heights',
        altNames: [ 'Mongolian', 'Mongolian Height' ]
    },
    {
        name: 'Ancient Spires',
        altNames: []
    },
    {
        name: 'Danube River',
        altNames: [ 'Danube' ]
    },
    {
        name: 'Nagari',
        altNames: []
    },
    {
        name: 'French Pass',
        altNames: []
    },
    {
        name: 'Forest Ponds',
        altNames: []
    },
    {
        name: 'Hideout',
        altNames: []
    },
    {
        name: 'Mountain Clearing',
        altNames: []
    },
    {
        name: 'Wetlands',
        altNames: []
    },
    {
        name: 'Prairie',
        altNames: []
    },
    {
        name: 'Waterholes',
        altNames: []
    },
    {
        name: 'Baltic',
        altNames: []
    },
    {
        name: 'Oasis',
        altNames: []
    },
    // S4
    {
        name: 'Continental',
        altNames: []
    },
    {
        name: 'Marshland',
        altNames: []
    },
    {
        name: 'Four Lakes',
        altNames: []
    },
    // S5
    {
        name: 'Migration',
        altNames: []
    },
    {
        name: 'Volcanic Island',
        altNames: []
    },
    {
        name: 'Golden Heights',
        altNames: []
    },
    // S6
    {
        name: 'African Waters',
        altNames: []
    },
    {
        name: 'Thickets',
        altNames: []
    },
    {
        name: 'Golden Pit',
        altNames: []
    },
    {
        name: 'Cliffside',
        altNames: []
    },
    {
        name: 'Gorge',
        altNames: []
    },
    {
        name: 'Canal',
        altNames: []
    },
    {
        name: 'Glade',
        altNames: []
    },
    {
        name: 'Haywire',
        altNames: []
    },
    {
        name: 'Turtle Ridge',
        altNames: []
    },
    {
        name: 'Rocky River',
        altNames: []
    },
    {
        name: 'Himeyama',
        altNames: []
    },
    {
        name: 'Forts',
        altNames: []
    },
    {
        name: 'Hidden Valley',
        altNames: []
    },
];

const seasons = [
  {
    number: 1,
    name: "Festival of Ages",
    started_at: Date.parse("2022-04-13T17:00Z"),
    ended_at: Date.parse("2022-06-30T17:00Z"),
    maps: [ 'Altai', 'Dry Arabia', 'High View', 'Hill and Dale', 'Lipany', 'Mongolian Heights' ]
  },
  {
    number: 2,
    name: "Map Monsters",
    started_at: Date.parse("2022-07-14T17:00Z"),
    ended_at: Date.parse("2022-10-25T07:00Z"),
    maps: [ 'Altai', 'Dry Arabia', 'High View', 'Hill and Dale', 'Lipany', 'Mongolian Heights', 'King of the Hill', 'Ancient Spires', 'The Pit' ]
  },
  {
    number: 3,
    name: "Anniversary",
    started_at: Date.parse("2022-10-26T17:00Z"),
    ended_at: Date.parse("2023-02-16T17:59Z"),
    maps: [ 'Dry Arabia', 'The Pit', 'Hill and Dale', 'Mediterranean', 'Ancient Spires', 'Forest Ponds', 'Lipany' ]
  },
  {
    number: 4,
    name: "Enchanted Grove",
    started_at: Date.parse("2023-02-17T18:00Z"),
    ended_at: Date.parse("2023-06-15T06:55Z"),
    maps: [ 'Dry Arabia', 'Prairie', 'Lipany', 'Ancient Spires', 'Wetlands', 'Oasis', 'Altai', 'Boulder Bay', 'Waterholes' ]
  },
  {
    number: 5,
    name: "Map Monsters Summer",
    started_at: Date.parse("2023-06-16T17:00Z"),
    ended_at: Date.parse("2023-11-14T07:59Z"),
    maps: [ 'Boulder Bay', 'Dry Arabia', 'Golden Heights', 'Hideout', 'High View', 'Hill and Dale', 'Marshland', 'The Pit', 'Volcanic Island' ]
  },
  {
    number: 6,
    name: "Fireside",
    started_at: Date.parse("2023-11-15T18:00Z"),
    ended_at: Date.parse("2024-03-14T06:59Z"),
    maps: [ 'Dry Arabia', 'Canal', 'Cliffside', 'Golden Heights', 'Golden Pit', 'Gorge', 'Hidden Valley', 'Himeyama', 'Rocky River' ]
  }
];

function parseCiv(civ) {
  civ = civ.toLowerCase();
  const item = civs.filter(v =>
    v.id == civ ||
    v.name.toLowerCase() == civ ||
    v.shortName.toLowerCase() == civ ||
    v.altNames.filter(d => d.toLowerCase() == civ
    ).length)[0];
  if (item) {
    return item;
  }
  return null;
}

function parseMap(map) {
  map = map.toLowerCase();
  const item = maps.filter(v =>
    v.name.toLowerCase() == map ||
    v.altNames.filter(d => d.toLowerCase() == map
    ).length)[0];
  if (item) {
    return item;
  }
  return null;
}

module.exports = { civs, maps, seasons, parseCiv, parseMap };
