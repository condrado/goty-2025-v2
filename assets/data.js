
// Datos generados automáticamente desde data.txt
const CATEGORIES = [
  {
    id: 'family',
    title: 'Best Family Game',
    titleEs: '(Mejor Juego Familiar)',
    games: [
      { id: 'donkey_kong_bananza', name: 'Donkey Kong Bananza', img: 'assets/images/donkey_kong_bananza.jpg' },
      { id: 'lego_party', name: 'LEGO Party!', img: 'assets/images/lego_party.jpg' },
      { id: 'lego_voyagers', name: 'LEGO Voyagers', img: 'assets/images/lego_voyagers.jpg' },
      { id: 'mario_kart_world', name: 'Mario Kart World', img: 'assets/images/mario_kart_world.jpg' },
      { id: 'sonic_racing_crossworlds', name: 'Sonic Racing: CrossWorlds', img: 'assets/images/sonic_racing_crossworlds.jpg' },
      { id: 'split_fiction', name: 'Split Fiction', img: 'assets/images/split_fiction.jpg' }
    ]
  },
  {
    id: 'mobile',
    title: 'Best Mobile Game',
    titleEs: '(Mejor Juego Móvil)',
    games: [
      { id: 'destiny_rising', name: 'Destiny: Rising', img: 'assets/images/destiny_rising.jpg' },
      { id: 'persona_5_phantom_x', name: 'Persona 5: The Phantom X', img: 'assets/images/persona_5_the_phantom_x.jpg' },
      { id: 'sonic_rumble', name: 'Sonic Rumble', img: 'assets/images/sonic_rumble.jpg' },
      { id: 'umamusume_pretty_derby', name: 'Umamusume: Pretty Derby', img: 'assets/images/umamusume_pretty_derby.jpg' },
      { id: 'wuthering_waves', name: 'Wuthering Waves', img: 'assets/images/wuthering_waves.jpg' }
    ]
  },
  {
    id: 'vr_ar',
    title: 'Best VR / AR Game',
    titleEs: '(Mejor Juego VR / AR)',
    games: [
      { id: 'alien_rogue_incursion', name: 'Alien: Rogue Incursion', img: 'assets/images/alien_rogue_incursion.jpg' },
      { id: 'arken_age', name: 'Arken Age', img: 'assets/images/arken_age.jpg' },
      { id: 'ghost_town', name: 'Ghost Town', img: 'assets/images/ghost_town.jpg' },
      { id: 'marvel_deadpool_vr', name: "Marvel's Deadpool VR", img: 'assets/images/marvels_deadpool_vr.jpg' },
      { id: 'midnight_walk', name: 'The Midnight Walk', img: 'assets/images/the_midnight_walk.jpg' }
    ]
  },
  {
    id: 'fighting',
    title: 'Best Fighting Game',
    titleEs: '(Mejor Juego de Lucha)',
    games: [
      { id: '2xko', name: '2XKO', img: 'assets/images/2xko.jpg' },
      { id: 'capcom_fighting_collection_2', name: 'Capcom Fighting Collection 2', img: 'assets/images/capcom_fighting_collection_2.jpg' },
      { id: 'fatal_fury_city_of_wolves', name: 'Fatal Fury: City of the Wolves', img: 'assets/images/fatal_fury_city_of_the_wolves.jpg' },
      { id: 'mortal_kombat_legacy', name: 'Mortal Kombat: Legacy Kollection', img: 'assets/images/mortal_kombat_legacy_kollection.jpg' },
      { id: 'virtua_fighter_5_revo', name: 'Virtua Fighter 5 R.E.V.O. World Stage', img: 'assets/images/virtua_fighter_5_r.e.v.o._world_stage.jpg' }
    ]
  },
  {
    id: 'performance',
    title: 'Best Performance',
    titleEs: '(Mejor Interpretación)',
    games: [
      { id: 'ben_starr', name: 'Ben Starr – Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'charlie_cox', name: 'Charlie Cox – Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'erika_ishii', name: 'Erika Ishii – Ghost of Yōtei', img: 'assets/images/ghost_of_yotei.jpg' },
      { id: 'jennifer_english', name: 'Jennifer English – Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'konatsu_kato', name: 'Konatsu Kato – Silent Hill f', img: 'assets/images/silent_hill_f.jpg' },
      { id: 'troy_baker', name: 'Troy Baker – Indiana Jones and the Great Circle', img: 'assets/images/indiana_jones_and_the_great_circle.jpg' }
    ]
  },
  {
    id: 'narrative',
    title: 'Best Narrative',
    titleEs: '(Mejor Narrativa)',
    games: [
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'death_stranding_2', name: 'Death Stranding 2: On the Beach', img: 'assets/images/death_stranding_2_on_the_beach.jpg' },
      { id: 'ghost_yotei', name: 'Ghost of Yōtei', img: 'assets/images/ghost_of_yotei.jpg' },
      { id: 'kingdom_come_2', name: 'Kingdom Come: Deliverance II', img: 'assets/images/kingdom_come_deliverance_ii.jpg' },
      { id: 'silent_hill_f', name: 'Silent Hill f', img: 'assets/images/silent_hill_f.jpg' }
    ]
  },
  {
    id: 'action',
    title: 'Best Action Game',
    titleEs: '(Mejor Juego de Acción)',
    games: [
      { id: 'battlefield_6', name: 'Battlefield 6', img: 'assets/images/battlefield_6.jpg' },
      { id: 'doom_dark_ages', name: 'DOOM: The Dark Ages', img: 'assets/images/doom_the_dark_ages.jpg' },
      { id: 'hades_ii', name: 'Hades II', img: 'assets/images/hades_ii.jpg' },
      { id: 'ninja_gaiden_4', name: 'NINJA GAIDEN 4', img: 'assets/images/ninja_gaiden_4.jpg' },
      { id: 'shinobi_art_of_vengeance', name: 'SHINOBI: Art of Vengeance', img: 'assets/images/shinobi_art_of_vengeance.jpg' }
    ]
  },
  {
    id: 'innovation_access',
    title: 'Innovation in Accessibility',
    titleEs: '(Innovación en Accesibilidad)',
    games: [
      { id: 'ac_shadows', name: "Assassin's Creed Shadows", img: 'assets/images/assassins_creed_shadows.jpg' },
      { id: 'atomfall', name: 'Atomfall', img: 'assets/images/atomfall.jpg' },
      { id: 'doom_dark_ages', name: 'DOOM: The Dark Ages', img: 'assets/images/doom_the_dark_ages.jpg' },
      { id: 'ea_fc_26', name: 'EA Sports FC 26', img: 'assets/images/ea_sports_fc_26.jpg' },
      { id: 'south_midnight', name: 'South of Midnight', img: 'assets/images/south_of_midnight.jpg' }
    ]
  },
  {
    id: 'sports_racing',
    title: 'Best Sports / Racing Game',
    titleEs: '(Mejor Juego Deportes / Carreras)',
    games: [
      { id: 'ea_fc_26', name: 'EA Sports FC 26', img: 'assets/images/ea_sports_fc_26.jpg' },
      { id: 'f1_25', name: 'F1 25', img: 'assets/images/f1_25.jpg' },
      { id: 'mario_kart_world', name: 'Mario Kart World', img: 'assets/images/mario_kart_world.jpg' },
      { id: 'rematch', name: 'REMATCH', img: 'assets/images/rematch.jpg' },
      { id: 'sonic_racing_crossworlds', name: 'Sonic Racing: CrossWorlds', img: 'assets/images/sonic_racing_crossworlds.jpg' }
    ]
  },
  {
    id: 'simulation_strategy',
    title: 'Best Simulation / Strategy Game',
    titleEs: '(Mejor Simulación / Estrategia)',
    games: [
      { id: 'the_alters', name: 'The Alters', img: 'assets/images/the_alters.jpg' },
      { id: 'final_fantasy_tactics_ivalice', name: 'Final Fantasy Tactics: The Ivalice Chronicles', img: 'assets/images/final_fantasy_tactics_the_ivalice_chronicles.jpg' },
      { id: 'jurassic_world_evolution_3', name: 'Jurassic World Evolution 3', img: 'assets/images/jurassic_world_evolution_3.jpg' },
      { id: 'civilization_vii', name: "Sid Meier's Civilization VII", img: 'assets/images/sid_meiers_civilization_vii.jpg' },
      { id: 'tempest_rising', name: 'Tempest Rising', img: 'assets/images/tempest_rising.jpg' },
      { id: 'two_point_museum', name: 'Two Point Museum', img: 'assets/images/two_point_museum.jpg' }
    ]
  },
  {
    id: 'multiplayer',
    title: 'Best Multiplayer Game',
    titleEs: '(Mejor Multijugador)',
    games: [
      { id: 'arc_raiders', name: 'ARC Raiders', img: 'assets/images/arc_raiders.jpg' },
      { id: 'battlefield_6', name: 'Battlefield 6', img: 'assets/images/battlefield_6.jpg' },
      { id: 'elden_ring_nightreign', name: 'Elden Ring Nightreign', img: 'assets/images/elden_ring_nightreign.jpg' },
      { id: 'peak', name: 'Peak', img: 'assets/images/peak.jpg' },
      { id: 'split_fiction', name: 'Split Fiction', img: 'assets/images/split_fiction.jpg' }
    ]
  },
  {
    id: 'audio',
    title: 'Best Audio Design',
    titleEs: '(Mejor Diseño de Audio)',
    games: [
      { id: 'battlefield_6', name: 'Battlefield 6', img: 'assets/images/battlefield_6.jpg' },
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'death_stranding_2', name: 'Death Stranding 2: On the Beach', img: 'assets/images/death_stranding_2_on_the_beach.jpg' },
      { id: 'ghost_yotei', name: 'Ghost of Yōtei', img: 'assets/images/ghost_of_yotei.jpg' },
      { id: 'silent_hill_f', name: 'Silent Hill f', img: 'assets/images/silent_hill_f.jpg' }
    ]
  },
  {
    id: 'music',
    title: 'Best Score & Music',
    titleEs: '(Mejor Música / Banda Sonora)',
    games: [
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'death_stranding_2', name: 'Death Stranding 2: On the Beach', img: 'assets/images/death_stranding_2_on_the_beach.jpg' },
      { id: 'ghost_yotei', name: 'Ghost of Yōtei', img: 'assets/images/ghost_of_yotei.jpg' },
      { id: 'hades_ii', name: 'Hades II', img: 'assets/images/hades_ii.jpg' },
      { id: 'hollow_knight_silksong', name: 'Hollow Knight: Silksong', img: 'assets/images/hollow_knight_silksong.jpg' }
    ]
  },
  {
    id: 'games_for_impact',
    title: 'Games for Impact',
    titleEs: '(Juegos con Impacto)',
    games: [
      { id: 'consume_me', name: 'Consume Me', img: 'assets/images/consume_me.jpg' },
      { id: 'despelote', name: 'despelote', img: 'assets/images/despelote.jpg' },
      { id: 'lost_records', name: 'Lost Records: Bloom & Rage', img: 'assets/images/lost_records_bloom_&_rage.jpg' },
      { id: 'south_midnight', name: 'South of Midnight', img: 'assets/images/south_of_midnight.jpg' },
      { id: 'wanderstop', name: 'Wanderstop', img: 'assets/images/wanderstop.jpg' }
    ]
  },
  {
    id: 'community_support',
    title: 'Best Community Support',
    titleEs: '(Mejor Soporte Comunitario)',
    games: [
      { id: 'baldurs_gate_iii', name: "Baldur's Gate III", img: 'assets/images/baldurs_gate_iii.jpg' },
      { id: 'final_fantasy_xiv', name: 'Final Fantasy XIV', img: 'assets/images/final_fantasy_xiv.jpg' },
      { id: 'fortnite', name: 'Fortnite', img: 'assets/images/fortnite.jpg' },
      { id: 'helldivers_ii', name: 'Helldivers II', img: 'assets/images/helldivers_ii.jpg' },
      { id: 'no_mans_sky', name: "No Man's Sky", img: 'assets/images/no_mans_sky.jpg' }
    ]
  },
  {
    id: 'ongoing',
    title: 'Best Ongoing Game',
    titleEs: '(Mejor Juego en Curso)',
    games: [
      { id: 'final_fantasy_xiv', name: 'Final Fantasy XIV', img: 'assets/images/final_fantasy_xiv.jpg' },
      { id: 'fortnite', name: 'Fortnite', img: 'assets/images/fortnite.jpg' },
      { id: 'helldivers_ii', name: 'Helldivers II', img: 'assets/images/helldivers_ii.jpg' },
      { id: 'marvel_rivals', name: 'Marvel Rivals', img: 'assets/images/marvel_rivals.jpg' },
      { id: 'no_mans_sky', name: "No Man's Sky", img: 'assets/images/no_mans_sky.jpg' }
    ]
  },
  {
    id: 'adaptation',
    title: 'Best Adaptation',
    titleEs: '(Mejor Adaptación)',
    games: [
      { id: 'minecraft_movie', name: 'A Minecraft Movie', img: 'assets/images/a_minecraft_movie.jpg' },
      { id: 'devil_may_cry', name: 'Devil May Cry', img: 'assets/images/devil_may_cry.jpg' },
      { id: 'splinter_cell_deathwatch', name: 'Splinter Cell: Deathwatch', img: 'assets/images/splinter_cell_deathwatch.jpg' },
      { id: 'last_of_us_s2', name: 'The Last of Us: Season 2', img: 'assets/images/the_last_of_us_season_2.jpg' },
      { id: 'until_dawn', name: 'Until Dawn', img: 'assets/images/until_dawn.jpg' }
    ]
  },
  {
    id: 'action_adventure',
    title: 'Best Action / Adventure Game',
    titleEs: '(Mejor Juego Acción / Aventura)',
    games: [
      { id: 'death_stranding_2', name: 'Death Stranding 2: On the Beach', img: 'assets/images/death_stranding_2_on_the_beach.jpg' },
      { id: 'ghost_yotei', name: 'Ghost of Yōtei', img: 'assets/images/ghost_of_yotei.jpg' },
      { id: 'indiana_jones_great_circle', name: 'Indiana Jones and the Great Circle', img: 'assets/images/indiana_jones_and_the_great_circle.jpg' },
      { id: 'hollow_knight_silksong', name: 'Hollow Knight: Silksong', img: 'assets/images/hollow_knight_silksong.jpg' },
      { id: 'split_fiction', name: 'Split Fiction', img: 'assets/images/split_fiction.jpg' }
    ]
  },
  {
    id: 'rpg',
    title: 'Best Role-Playing Game',
    titleEs: '(Mejor RPG)',
    games: [
      { id: 'avowed', name: 'Avowed', img: 'assets/images/avowed.jpg' },
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'kingdom_come_2', name: 'Kingdom Come: Deliverance II', img: 'assets/images/kingdom_come_deliverance_ii.jpg' },
      { id: 'monster_hunter_wilds', name: 'Monster Hunter Wilds', img: 'assets/images/monster_hunter_wilds.jpg' },
      { id: 'outer_worlds_2', name: 'The Outer Worlds 2', img: 'assets/images/the_outer_worlds_2.jpg' }
    ]
  },
  {
    id: 'art_direction',
    title: 'Best Art Direction',
    titleEs: '(Mejor Dirección de Arte)',
    games: [
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'death_stranding_2', name: 'Death Stranding 2: On the Beach', img: 'assets/images/death_stranding_2_on_the_beach.jpg' },
      { id: 'ghost_yotei', name: 'Ghost of Yōtei', img: 'assets/images/ghost_of_yotei.jpg' },
      { id: 'hades_ii', name: 'Hades II', img: 'assets/images/hades_ii.jpg' },
      { id: 'hollow_knight_silksong', name: 'Hollow Knight: Silksong', img: 'assets/images/hollow_knight_silksong.jpg' }
    ]
  },
  {
    id: 'debut_indie',
    title: 'Best Debut Indie Game',
    titleEs: '(Mejor Debut Indie)',
    games: [
      { id: 'blue_prince', name: 'Blue Prince', img: 'assets/images/blue_prince.jpg' },
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'despelote', name: 'despelote', img: 'assets/images/despelote.jpg' },
      { id: 'dispatch', name: 'Dispatch', img: 'assets/images/dispatch.jpg' },
      { id: 'megabonk', name: 'Megabonk', img: 'assets/images/megabonk.jpg' }
    ]
  },
  {
    id: 'indie',
    title: 'Best Independent Game',
    titleEs: '(Mejor Juego Independiente)',
    games: [
      { id: 'absolum', name: 'Absolum', img: 'assets/images/absolum.jpg' },
      { id: 'ball_x_pit', name: 'BALL x PIT', img: 'assets/images/ball_x_pit.jpg' },
      { id: 'blue_prince', name: 'Blue Prince', img: 'assets/images/blue_prince.jpg' },
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'hades_ii', name: 'Hades II', img: 'assets/images/hades_ii.jpg' },
      { id: 'hollow_knight_silksong', name: 'Hollow Knight: Silksong', img: 'assets/images/hollow_knight_silksong.jpg' }
    ]
  },
  {
    id: 'most_anticipated',
    title: 'Most Anticipated Game',
    titleEs: '(Juego Más Esperado)',
    games: [
      { id: '007_first_light', name: '007 First Light', img: 'assets/images/007_first_light.jpg' },
      { id: 'gta_vi', name: 'Grand Theft Auto VI', img: 'assets/images/grand_theft_auto_vi.jpg' },
      { id: 'marvel_wolverine', name: "Marvel's Wolverine", img: 'assets/images/marvels_wolverine.jpg' },
      { id: 'resident_evil_requiem', name: 'Resident Evil Requiem', img: 'assets/images/resident_evil_requiem.jpg' },
      { id: 'witcher_iv', name: 'The Witcher IV', img: 'assets/images/the_witcher_iv.jpg' }
    ]
  },
  {
    id: 'game_direction',
    title: 'Best Game Direction',
    titleEs: '(Mejor Dirección de Juego)',
    games: [
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'death_stranding_2', name: 'Death Stranding 2: On the Beach', img: 'assets/images/death_stranding_2_on_the_beach.jpg' },
      { id: 'ghost_yotei', name: 'Ghost of Yōtei', img: 'assets/images/ghost_of_yotei.jpg' },
      { id: 'hades_ii', name: 'Hades II', img: 'assets/images/hades_ii.jpg' },
      { id: 'split_fiction', name: 'Split Fiction', img: 'assets/images/split_fiction.jpg' }
    ]
  },
  {
    id: 'goty',
    title: 'Game of the Year',
    titleEs: '(Juego del Año)',
    games: [
      { id: 'clair_obscur_exp33', name: 'Clair Obscur: Expedition 33', img: 'assets/images/clair_obscur_expedition_33.jpg' },
      { id: 'death_stranding_2', name: 'Death Stranding 2: On the Beach', img: 'assets/images/death_stranding_2_on_the_beach.jpg' },
      { id: 'donkey_kong_bananza', name: 'Donkey Kong Bananza', img: 'assets/images/donkey_kong_bananza.jpg' },
      { id: 'hades_ii', name: 'Hades II', img: 'assets/images/hades_ii.jpg' },
      { id: 'hollow_knight_silksong', name: 'Hollow Knight: Silksong', img: 'assets/images/hollow_knight_silksong.jpg' },
      { id: 'kingdom_come_2', name: 'Kingdom Come: Deliverance II', img: 'assets/images/kingdom_come_deliverance_ii.jpg' }
    ]
  }
];

const VOTERS = [
  { name: 'Conrado', initials: 'CON' },
  { name: 'Javi', initials: 'JAV' },
  { name: 'Jordi', initials: 'JOR' },
  { name: 'Antonio', initials: 'ANT' }
];

const BINGO = [
    {
      "id": 1,
      "categoria": "Vestimenta",
      "texto": "Zapatillas deportivas con traje de gala"
    },
    {
      "id": 2,
      "categoria": "Vestimenta",
      "texto": "Gafas de sol en interiores (Kojima Style)"
    },
    {
      "id": 3,
      "categoria": "Vestimenta",
      "texto": "Pelo teñido de color fantasía/neón"
    },
    {
      "id": 4,
      "categoria": "Vestimenta",
      "texto": "Desarrollador con camiseta de su propio juego"
    },
    {
      "id": 5,
      "categoria": "Vestimenta",
      "texto": "Escote o traje censurable en TV"
    },
    {
      "id": 6,
      "categoria": "Vestimenta",
      "texto": "Chaqueta con lentejuelas o brillo excesivo"
    },
    {
      "id": 7,
      "categoria": "Vestimenta",
      "texto": "Presentador o músico haciendo Cosplay"
    },
    {
      "id": 8,
      "categoria": "Vestimenta",
      "texto": "Geoff Keighley se cambia de ropa a mitad de gala"
    },
    {
      "id": 9,
      "categoria": "Vestimenta",
      "texto": "Alguien lleva sombrero/gorra y no se la quita"
    },
    {
      "id": 10,
      "categoria": "Vestimenta",
      "texto": "Pin o parche con mensaje reivindicativo"
    },
    {
      "id": 11,
      "categoria": "Discursos",
      "texto": "El Séquito: Suben más de 10 personas a recoger un premio"
    },
    {
      "id": 12,
      "categoria": "Discursos",
      "texto": "El Lobo Solitario: Sube solo una persona de un estudio AAA"
    },
    {
      "id": 13,
      "categoria": "Discursos",
      "texto": "Ganador leyendo discurso desde el móvil"
    },
    {
      "id": 14,
      "categoria": "Discursos",
      "texto": "Ganador saca un papel muy arrugado del bolsillo"
    },
    {
      "id": 15,
      "categoria": "Discursos",
      "texto": "Dicen textualmente: 'No me lo esperaba/No preparé nada'"
    },
    {
      "id": 16,
      "categoria": "Discursos",
      "texto": "Llantos reales en el escenario"
    },
    {
      "id": 17,
      "categoria": "Discursos",
      "texto": "Agradecimiento a una mascota (perro/gato)"
    },
    {
      "id": 18,
      "categoria": "Discursos",
      "texto": "Music'd: La orquesta corta el discurso por largo"
    },
    {
      "id": 19,
      "categoria": "Discursos",
      "texto": "Discurso Speedrun por nervios (ininteligible)"
    },
    {
      "id": 20,
      "categoria": "Discursos",
      "texto": "El micrófono está a mala altura (se agachan o estiran)"
    },
    {
      "id": 21,
      "categoria": "Discursos",
      "texto": "Abrazo incómodo o fallido en el escenario"
    },
    {
      "id": 22,
      "categoria": "Producción",
      "texto": "Cámara capta a alguien del público aburrido o en el móvil"
    },
    {
      "id": 23,
      "categoria": "Producción",
      "texto": "Gritos del público exagerados/falsos"
    },
    {
      "id": 24,
      "categoria": "Producción",
      "texto": "Fallo de audio (micrófono apagado o acople)"
    },
    {
      "id": 25,
      "categoria": "Producción",
      "texto": "Zoom dramático a la cara de un perdedor"
    },
    {
      "id": 26,
      "categoria": "Producción",
      "texto": "Seguridad tensa por posible espontáneo (Bill Clinton check)"
    },
    {
      "id": 27,
      "categoria": "Producción",
      "texto": "Actuación musical que no pinta nada con videojuegos"
    },
    {
      "id": 28,
      "categoria": "Producción",
      "texto": "Primer plano al solista de viento (Flute Guy)"
    },
    {
      "id": 29,
      "categoria": "Producción",
      "texto": "Lectura descarada del Teleprompter (ojos moviéndose)"
    },
    {
      "id": 30,
      "categoria": "Producción",
      "texto": "Chiste malo (Cringe) seguido de silencio sepulcral"
    },
    {
      "id": 31,
      "categoria": "Tráilers",
      "texto": "Tráiler 0% Gameplay (Solo CGI)"
    },
    {
      "id": 32,
      "categoria": "Tráilers",
      "texto": "Letra pequeña: 'Captured on PC' / 'Not actual gameplay'"
    },
    {
      "id": 33,
      "categoria": "Tráilers",
      "texto": "Fecha de lanzamiento lejana (2027+) o 'Coming Soon'"
    },
    {
      "id": 34,
      "categoria": "Tráilers",
      "texto": "Anuncio de Remake/Remaster innecesario"
    },
    {
      "id": 35,
      "categoria": "Tráilers",
      "texto": "Juego como Servicio (GaaS) disfrazado de juego normal"
    },
    {
      "id": 36,
      "categoria": "Tráilers",
      "texto": "Juego con estética Anime/Gacha genérica"
    },
    {
      "id": 37,
      "categoria": "Tráilers",
      "texto": "Juego de terror espacial genérico"
    },
    {
      "id": 38,
      "categoria": "Tráilers",
      "texto": "Aparece un Youtuber/Streamer famoso en el juego"
    },
    {
      "id": 39,
      "categoria": "Tráilers",
      "texto": "Tráiler confuso que parece de Kojima pero no lo es"
    },
    {
      "id": 40,
      "categoria": "Tráilers",
      "texto": "Primer plano del logo de Unreal Engine 5"
    },
    {
      "id": 41,
      "categoria": "Geoff y Clichés",
      "texto": "Geoff llama 'My friend' a un famoso"
    },
    {
      "id": 42,
      "categoria": "Geoff y Clichés",
      "texto": "Publicidad encubierta (Bebidas, comida, afeitadoras)"
    },
    {
      "id": 43,
      "categoria": "Geoff y Clichés",
      "texto": "Mención a la 'Inteligencia Artificial' (AI)"
    },
    {
      "id": 44,
      "categoria": "Geoff y Clichés",
      "texto": "Ignoran totalmente la crisis de despidos del sector"
    },
    {
      "id": 45,
      "categoria": "Geoff y Clichés",
      "texto": "Premio importante entregado rápido en el Pre-show"
    },
    {
      "id": 46,
      "categoria": "Geoff y Clichés",
      "texto": "Actor de Hollywood presentando que no sabe dónde está"
    },
    {
      "id": 47,
      "categoria": "Geoff y Clichés",
      "texto": "Shadow Drop: 'Disponible ahora mismo'"
    },
    {
      "id": 48,
      "categoria": "Geoff y Clichés",
      "texto": "Referencia a serie de TV (Fallout, TLOU, Arcane)"
    },
    {
      "id": 49,
      "categoria": "Geoff y Clichés",
      "texto": "Baity se enfada/grita por un ganador injusto"
    },
    {
      "id": 50,
      "categoria": "Geoff y Clichés",
      "texto": "Geoff interrumpe a alguien para seguir con el show"
    }
  ]