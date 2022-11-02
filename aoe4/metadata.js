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
        id: 'mal',
        name: 'Malians',
        shortName: 'Malians',
        altNames: [ 'Mal', 'Malian' ]
    },
    {
        id: 'ott',
        name: 'Ottomans',
        shortName: 'Ottomans',
        altNames: [ 'Ott', 'Otto', 'Ottoman' ]
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
        name: 'Mediterranean',
        altNames: []
    },
    {
        name: 'Oasis',
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
    ended_at: Date.parse("2023-02-15T17:00Z"),
    maps: [ 'Dry Arabia', 'The Pit', 'Hill and Dale', 'Mediterranean', 'Ancient Spires', 'Forest Ponds', 'Lipany' ]
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
