import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabaseClient";

// ============ CLUES MODE DATA ============
// clues are provided per language; options/answer are proper names (language-agnostic)
const QUESTION_POOL = [
  {
    clues: {
      en: [
        "Born in Madeira, Portugal",
        "Nicknamed 'CR7'",
        "Has played for Sporting CP, Man United, Real Madrid, Juventus and Al Nassr",
      ],
      pt: [
        "Nascido na Madeira, Portugal",
        "Apelidado de 'CR7'",
        "Já jogou por Sporting CP, Man United, Real Madrid, Juventus e Al Nassr",
      ],
      es: [
        "Nacido en Madeira, Portugal",
        "Apodado 'CR7'",
        "Ha jugado en Sporting CP, Man United, Real Madrid, Juventus y Al Nassr",
      ],
    },
    options: ["Cristiano Ronaldo", "Kylian Mbappe", "Karim Benzema", "Luka Modric"],
    answer: "Cristiano Ronaldo",
  },
  {
    clues: {
      en: [
        "Born in Rosario, Argentina",
        "Won the 2022 World Cup with his country",
        "Spent most of his career at Barcelona before joining PSG and Inter Miami",
      ],
      pt: [
        "Nascido em Rosário, Argentina",
        "Venceu a Copa do Mundo de 2022 com seu país",
        "Passou a maior parte da carreira no Barcelona antes de ir para o PSG e o Inter Miami",
      ],
      es: [
        "Nacido en Rosario, Argentina",
        "Ganó la Copa del Mundo de 2022 con su país",
        "Pasó la mayor parte de su carrera en el Barcelona antes de fichar por el PSG y el Inter Miami",
      ],
    },
    options: ["Neymar Jr", "Lionel Messi", "Sergio Aguero", "Angel Di Maria"],
    answer: "Lionel Messi",
  },
  {
    clues: {
      en: [
        "Born in Egypt",
        "Nicknamed the 'Egyptian King'",
        "Prolific winger for Liverpool since 2017",
      ],
      pt: [
        "Nascido no Egito",
        "Apelidado de 'Rei Egípcio'",
        "Ponta-direita prolífico do Liverpool desde 2017",
      ],
      es: [
        "Nacido en Egipto",
        "Apodado el 'Rey Egipcio'",
        "Extremo prolífico del Liverpool desde 2017",
      ],
    },
    options: ["Sadio Mane", "Riyad Mahrez", "Mohamed Salah", "Pierre-Emerick Aubameyang"],
    answer: "Mohamed Salah",
  },
  {
    clues: {
      en: [
        "Born in Bergara, Spain",
        "Long-time goalkeeper for Athletic Bilbao",
        "Known for launching devastatingly accurate long throws",
      ],
      pt: [
        "Nascido em Bergara, Espanha",
        "Goleiro de longa data do Athletic Bilbao",
        "Conhecido por lançamentos longos extremamente precisos",
      ],
      es: [
        "Nacido en Bergara, España",
        "Portero de larga trayectoria en el Athletic Bilbao",
        "Conocido por sus saques largos y muy precisos",
      ],
    },
    options: ["Thibaut Courtois", "Jan Oblak", "Unai Simon", "David de Gea"],
    answer: "Unai Simon",
  },
  {
    clues: {
      en: [
        "Born in Bondoufle, France",
        "Explosive winger who starred at Monaco, PSG and Real Madrid",
        "Youngest scorer in a World Cup final since Pele",
      ],
      pt: [
        "Nascido em Bondoufle, França",
        "Ponta explosivo que brilhou no Monaco, PSG e Real Madrid",
        "Jogador mais jovem a marcar em uma final de Copa do Mundo desde Pelé",
      ],
      es: [
        "Nacido en Bondoufle, Francia",
        "Extremo explosivo que brilló en el Mónaco, el PSG y el Real Madrid",
        "El goleador más joven en una final de Copa del Mundo desde Pelé",
      ],
    },
    options: ["Ousmane Dembele", "Kylian Mbappe", "Antoine Griezmann", "Kingsley Coman"],
    answer: "Kylian Mbappe",
  },
  {
    clues: {
      en: [
        "Born in Leiria, Portugal",
        "Creative playmaker known for his no-look passes",
        "Long-time star for Man City before moving to Al-Ittihad",
      ],
      pt: [
        "Nascido em Leiria, Portugal",
        "Armador criativo conhecido por passes sem olhar",
        "Astro de longa data do Man City antes de se transferir para o Al-Ittihad",
      ],
      es: [
        "Nacido en Leiria, Portugal",
        "Mediocampista creativo conocido por sus pases sin mirar",
        "Estrella de larga trayectoria en el Man City antes de fichar por el Al-Ittihad",
      ],
    },
    options: ["Bruno Fernandes", "Bernardo Silva", "Joao Felix", "Fabinho"],
    answer: "Bernardo Silva",
  },
  {
    clues: {
      en: [
        "Born in Zagreb, Croatia",
        "Won the Ballon d'Or in 2018, breaking Messi/Ronaldo's streak",
        "Midfield metronome for Real Madrid",
      ],
      pt: [
        "Nascido em Zagreb, Croácia",
        "Venceu a Bola de Ouro em 2018, quebrando a sequência de Messi/Ronaldo",
        "Metrônomo do meio-campo do Real Madrid",
      ],
      es: [
        "Nacido en Zagreb, Croacia",
        "Ganó el Balón de Oro en 2018, rompiendo la racha de Messi/Ronaldo",
        "El metrónomo del mediocampo del Real Madrid",
      ],
    },
    options: ["Ivan Rakitic", "Mateo Kovacic", "Luka Modric", "Marcelo Brozovic"],
    answer: "Luka Modric",
  },
  {
    clues: {
      en: [
        "Born in Amsterdam, Netherlands",
        "Towering centre-back with an aggressive, ball-playing style",
        "Captained Ajax before moving to Liverpool",
      ],
      pt: [
        "Nascido em Amsterdã, Holanda",
        "Zagueiro imponente com estilo agressivo e bom com a bola",
        "Foi capitão do Ajax antes de se transferir para o Liverpool",
      ],
      es: [
        "Nacido en Ámsterdam, Países Bajos",
        "Defensor central imponente, con un estilo agresivo y buen manejo de balón",
        "Fue capitán del Ajax antes de fichar por el Liverpool",
      ],
    },
    options: ["Matthijs de Ligt", "Virgil van Dijk", "Stefan de Vrij", "Nathan Ake"],
    answer: "Virgil van Dijk",
  },
  {
    clues: {
      en: [
        "Born in Bagnols-sur-Ceze, France",
        "Deadly striker known for his 'Griezmann celebration' dance",
        "Key part of France's 2018 World Cup win",
      ],
      pt: [
        "Nascido em Bagnols-sur-Cèze, França",
        "Atacante letal conhecido pela dança da 'comemoração Griezmann'",
        "Peça-chave na conquista da Copa do Mundo de 2018 pela França",
      ],
      es: [
        "Nacido en Bagnols-sur-Cèze, Francia",
        "Delantero letal conocido por el baile de 'celebración Griezmann'",
        "Pieza clave en la conquista del Mundial 2018 de Francia",
      ],
    },
    options: ["Olivier Giroud", "Antoine Griezmann", "Karim Benzema", "Alexandre Lacazette"],
    answer: "Antoine Griezmann",
  },
  {
    clues: {
      en: [
        "Born in Munich, Germany",
        "Prolific striker, all-time top scorer of the Bundesliga",
        "Left Bayern Munich for Barcelona in 2022",
      ],
      pt: [
        "Nascido em Munique, Alemanha",
        "Atacante prolífico, maior artilheiro da história da Bundesliga",
        "Deixou o Bayern de Munique para se transferir ao Barcelona em 2022",
      ],
      es: [
        "Nacido en Múnich, Alemania",
        "Delantero prolífico, máximo goleador histórico de la Bundesliga",
        "Dejó el Bayern de Múnich para fichar por el Barcelona en 2022",
      ],
    },
    options: ["Thomas Muller", "Timo Werner", "Robert Lewandowski", "Kai Havertz"],
    answer: "Robert Lewandowski",
  },
  {
    clues: {
      en: [
        "Born in Salto, Uruguay",
        "Known for a fierce bite scandal at the 2014 World Cup",
        "Prolific striker for Liverpool and Barcelona",
      ],
      pt: [
        "Nascido em Salto, Uruguai",
        "Conhecido por um polêmico episódio de mordida na Copa do Mundo de 2014",
        "Atacante prolífico do Liverpool e do Barcelona",
      ],
      es: [
        "Nacido en Salto, Uruguay",
        "Conocido por un polémico mordisco en el Mundial de 2014",
        "Delantero prolífico del Liverpool y el Barcelona",
      ],
    },
    options: ["Edinson Cavani", "Luis Suarez", "Diego Forlan", "Darwin Nunez"],
    answer: "Luis Suarez",
  },
  {
    clues: {
      en: [
        "Born in Sao Paulo, Brazil",
        "Flashy winger famous for his stepovers and celebrations",
        "Left Barcelona in 2017 for a record transfer fee to PSG",
      ],
      pt: [
        "Nascido em São Paulo, Brasil",
        "Ponta habilidoso, famoso por suas embaixadinhas e comemorações",
        "Deixou o Barcelona em 2017 por uma taxa recorde de transferência para o PSG",
      ],
      es: [
        "Nacido en São Paulo, Brasil",
        "Extremo vistoso, famoso por sus regates y celebraciones",
        "Dejó el Barcelona en 2017 por un traspaso récord al PSG",
      ],
    },
    options: ["Neymar Jr", "Vinicius Jr", "Rodrygo", "Gabriel Jesus"],
    answer: "Neymar Jr",
  },
  {
    clues: {
      en: [
        "Born in Sao Goncalo, Brazil",
        "Speedy winger who became a Real Madrid Champions League hero",
        "Wears the number 7 shirt for Real Madrid",
      ],
      pt: [
        "Nascido em São Gonçalo, Brasil",
        "Ponta veloz que se tornou herói do Real Madrid na Champions League",
        "Veste a camisa 7 do Real Madrid",
      ],
      es: [
        "Nacido en São Gonçalo, Brasil",
        "Extremo veloz que se convirtió en héroe del Real Madrid en la Champions League",
        "Viste la camiseta número 7 del Real Madrid",
      ],
    },
    options: ["Rodrygo", "Vinicius Jr", "Endrick", "Neymar Jr"],
    answer: "Vinicius Jr",
  },
  {
    clues: {
      en: [
        "Born in Leipzig, Germany",
        "Versatile forward who can play across the front line",
        "Moved from Chelsea to Bayer Leverkusen and back",
      ],
      pt: [
        "Nascido em Leipzig, Alemanha",
        "Atacante versátil que pode jogar em qualquer posição da linha de frente",
        "Passou do Chelsea para o Bayer Leverkusen e voltou",
      ],
      es: [
        "Nacido en Leipzig, Alemania",
        "Delantero versátil que puede jugar en cualquier posición de la línea ofensiva",
        "Pasó del Chelsea al Bayer Leverkusen y volvió",
      ],
    },
    options: ["Kai Havertz", "Timo Werner", "Serge Gnabry", "Leroy Sane"],
    answer: "Kai Havertz",
  },
  {
    clues: {
      en: [
        "Born in Barcelona, Spain",
        "Teenage midfield sensation who broke through at his boyhood club",
        "Youngest player to win the Golden Boy award",
      ],
      pt: [
        "Nascido em Barcelona, Espanha",
        "Sensação do meio-campo ainda adolescente, revelado no clube de seu coração",
        "Jogador mais jovem a vencer o prêmio Golden Boy",
      ],
      es: [
        "Nacido en Barcelona, España",
        "Sensación del mediocampo en su adolescencia, formado en el club de sus amores",
        "El jugador más joven en ganar el premio Golden Boy",
      ],
    },
    options: ["Gavi", "Pedri", "Fermin Lopez", "Ansu Fati"],
    answer: "Pedri",
  },
  {
    clues: {
      en: [
        "Born in Leeds, England, to Norwegian parents",
        "Prolific striker who set a Premier League goals record in his debut season",
        "Plays for Manchester City",
      ],
      pt: [
        "Nascido em Leeds, Inglaterra, filho de pais noruegueses",
        "Atacante prolífico que bateu o recorde de gols na estreia na Premier League",
        "Joga pelo Manchester City",
      ],
      es: [
        "Nacido en Leeds, Inglaterra, hijo de padres noruegos",
        "Delantero prolífico que batió el récord de goles en su debut en la Premier League",
        "Juega en el Manchester City",
      ],
    },
    options: ["Erling Haaland", "Alexander Isak", "Victor Osimhen", "Darwin Nunez"],
    answer: "Erling Haaland",
  },
  {
    clues: {
      en: [
        "Born in Drongen, Belgium",
        "Widely regarded as one of the best passers of his generation",
        "Long-time midfield engine for Manchester City",
      ],
      pt: [
        "Nascido em Drongen, Bélgica",
        "Considerado um dos melhores passadores de sua geração",
        "Motor do meio-campo do Manchester City por muitos anos",
      ],
      es: [
        "Nacido en Drongen, Bélgica",
        "Considerado uno de los mejores pasadores de su generación",
        "Motor del mediocampo del Manchester City durante muchos años",
      ],
    },
    options: ["Kevin De Bruyne", "Eden Hazard", "Romelu Lukaku", "Youri Tielemans"],
    answer: "Kevin De Bruyne",
  },
  {
    clues: {
      en: [
        "Born in Walthamstow, London",
        "England's all-time record goalscorer",
        "Left Tottenham for Bayern Munich in 2023",
      ],
      pt: [
        "Nascido em Walthamstow, Londres",
        "Maior artilheiro da história da seleção inglesa",
        "Deixou o Tottenham para se transferir ao Bayern de Munique em 2023",
      ],
      es: [
        "Nacido en Walthamstow, Londres",
        "Máximo goleador histórico de la selección inglesa",
        "Dejó el Tottenham para fichar por el Bayern de Múnich en 2023",
      ],
    },
    options: ["Harry Kane", "Marcus Rashford", "Raheem Sterling", "Jack Grealish"],
    answer: "Harry Kane",
  },
  {
    clues: {
      en: [
        "Born in Stourbridge, England",
        "Broke through at Birmingham City before moving to Borussia Dortmund",
        "Became a key midfielder for Real Madrid",
      ],
      pt: [
        "Nascido em Stourbridge, Inglaterra",
        "Revelado no Birmingham City antes de se transferir ao Borussia Dortmund",
        "Tornou-se peça-chave do meio-campo do Real Madrid",
      ],
      es: [
        "Nacido en Stourbridge, Inglaterra",
        "Se reveló en el Birmingham City antes de fichar por el Borussia Dortmund",
        "Se convirtió en pieza clave del mediocampo del Real Madrid",
      ],
    },
    options: ["Jude Bellingham", "Declan Rice", "Mason Mount", "Conor Gallagher"],
    answer: "Jude Bellingham",
  },
  {
    clues: {
      en: [
        "Born in Madrid, Spain",
        "Won the Ballon d'Or in 2024",
        "Defensive midfield anchor for Manchester City",
      ],
      pt: [
        "Nascido em Madri, Espanha",
        "Venceu a Bola de Ouro em 2024",
        "Volante e base do meio-campo do Manchester City",
      ],
      es: [
        "Nacido en Madrid, España",
        "Ganó el Balón de Oro en 2024",
        "Volante y base del mediocampo del Manchester City",
      ],
    },
    options: ["Rodri", "Sergio Busquets", "Fabian Ruiz", "Marcos Llorente"],
    answer: "Rodri",
  },
  {
    clues: {
      en: [
        "Born in Bree, Belgium",
        "Towering goalkeeper known for his shot-stopping",
        "Long-time number one for Real Madrid",
      ],
      pt: [
        "Nascido em Bree, Bélgica",
        "Goleiro alto, conhecido por suas defesas difíceis",
        "Titular de longa data no gol do Real Madrid",
      ],
      es: [
        "Nacido en Bree, Bélgica",
        "Portero de gran estatura, conocido por sus paradas difíciles",
        "Titular de larga data en la portería del Real Madrid",
      ],
    },
    options: ["Thibaut Courtois", "Jan Oblak", "Marc-Andre ter Stegen", "Andriy Lunin"],
    answer: "Thibaut Courtois",
  },
  {
    clues: {
      en: [
        "Born in Madrid, Spain, to Moroccan parents",
        "Explosive attacking full-back",
        "Plays for PSG after spells at Real Madrid, Dortmund and Inter Milan",
      ],
      pt: [
        "Nascido em Madri, Espanha, filho de pais marroquinos",
        "Lateral ofensivo e explosivo",
        "Joga pelo PSG após passagens por Real Madrid, Dortmund e Inter de Milão",
      ],
      es: [
        "Nacido en Madrid, España, hijo de padres marroquíes",
        "Lateral ofensivo y explosivo",
        "Juega en el PSG tras pasos por el Real Madrid, el Dortmund y el Inter de Milán",
      ],
    },
    options: ["Achraf Hakimi", "Nordin Amrabat", "Hakim Ziyech", "Sofyan Amrabat"],
    answer: "Achraf Hakimi",
  },
  {
    clues: {
      en: [
        "Born in Stockport, England",
        "Came through Manchester City's academy",
        "Nicknamed the 'Stockport Iniesta' as a youth player",
      ],
      pt: [
        "Nascido em Stockport, Inglaterra",
        "Revelado nas categorias de base do Manchester City",
        "Apelidado de 'Iniesta de Stockport' quando jovem",
      ],
      es: [
        "Nacido en Stockport, Inglaterra",
        "Se formó en la cantera del Manchester City",
        "Apodado el 'Iniesta de Stockport' cuando era joven",
      ],
    },
    options: ["Phil Foden", "Jack Grealish", "Cole Palmer", "James Maddison"],
    answer: "Phil Foden",
  },
  {
    clues: {
      en: [
        "Born in London, England",
        "Came through Arsenal's youth academy",
        "Key winger in Arsenal's Premier League title challenges",
      ],
      pt: [
        "Nascido em Londres, Inglaterra",
        "Revelado nas categorias de base do Arsenal",
        "Ponta fundamental nas disputas do Arsenal pelo título da Premier League",
      ],
      es: [
        "Nacido en Londres, Inglaterra",
        "Se formó en la cantera del Arsenal",
        "Extremo clave en las luchas del Arsenal por el título de la Premier League",
      ],
    },
    options: ["Bukayo Saka", "Gabriel Martinelli", "Emile Smith Rowe", "Reiss Nelson"],
    answer: "Bukayo Saka",
  },
  {
    clues: {
      en: [
        "Born in Montevideo, Uruguay",
        "Versatile box-to-box midfielder",
        "Known for his powerful long-range shots at Real Madrid",
      ],
      pt: [
        "Nascido em Montevidéu, Uruguai",
        "Meio-campista versátil, atua tanto na marcação quanto no ataque",
        "Conhecido pelos chutes potentes de longa distância no Real Madrid",
      ],
      es: [
        "Nacido en Montevideo, Uruguay",
        "Centrocampista versátil, box-to-box",
        "Conocido por sus disparos potentes de larga distancia en el Real Madrid",
      ],
    },
    options: ["Federico Valverde", "Rodrigo Bentancur", "Nicolas De La Cruz", "Manuel Ugarte"],
    answer: "Federico Valverde",
  },
  {
    clues: {
      en: [
        "Born in Poole, England",
        "Versatile defender who can play centre-back or right-back",
        "Part of Arsenal's Premier League title-challenging squad",
      ],
      pt: [
        "Nascido em Poole, Inglaterra",
        "Defensor versátil, pode jogar como zagueiro ou lateral-direito",
        "Parte do elenco do Arsenal que disputou o título da Premier League",
      ],
      es: [
        "Nacido en Poole, Inglaterra",
        "Defensor versátil, puede jugar de central o lateral derecho",
        "Parte del plantel del Arsenal que peleó el título de la Premier League",
      ],
    },
    options: ["Ben White", "Kieran Trippier", "Trent Alexander-Arnold", "Reece James"],
    answer: "Ben White",
  },
  {
    clues: {
      en: [
        "Born in Sabadell, Spain",
        "Known for his distinctive curly hairstyle",
        "Left-back who joined Chelsea from Brighton",
      ],
      pt: [
        "Nascido em Sabadell, Espanha",
        "Conhecido pelo cabelo cacheado característico",
        "Lateral-esquerdo que chegou ao Chelsea vindo do Brighton",
      ],
      es: [
        "Nacido en Sabadell, España",
        "Conocido por su llamativo cabello rizado",
        "Lateral izquierdo que llegó al Chelsea desde el Brighton",
      ],
    },
    options: ["Marc Cucurella", "Ben Chilwell", "Alejandro Grimaldo", "Junior Firpo"],
    answer: "Marc Cucurella",
  },
  {
    clues: {
      en: [
        "Born in Calgary, Canada, but represents England",
        "Centre-back who came through Chelsea's academy",
        "Moved to Serie A to join AC Milan",
      ],
      pt: [
        "Nascido em Calgary, Canadá, mas representa a Inglaterra",
        "Zagueiro revelado nas categorias de base do Chelsea",
        "Transferiu-se para a Série A para jogar no AC Milan",
      ],
      es: [
        "Nacido en Calgary, Canadá, pero representa a Inglaterra",
        "Defensor central formado en la cantera del Chelsea",
        "Se mudó a la Serie A para jugar en el AC Milan",
      ],
    },
    options: ["Fikayo Tomori", "Marc Guehi", "Levi Colwill", "Axel Disasi"],
    answer: "Fikayo Tomori",
  },
  {
    clues: {
      en: [
        "Born in Salzburg, Austria",
        "Energetic midfielder known for his work rate",
        "Joined Bayern Munich from RB Leipzig",
      ],
      pt: [
        "Nascido em Salzburgo, Áustria",
        "Meio-campista intenso, conhecido pela disposição em campo",
        "Chegou ao Bayern de Munique vindo do RB Leipzig",
      ],
      es: [
        "Nacido en Salzburgo, Austria",
        "Centrocampista enérgico, conocido por su intensidad",
        "Llegó al Bayern de Múnich desde el RB Leipzig",
      ],
    },
    options: ["Konrad Laimer", "Leon Goretzka", "Joshua Kimmich", "Aleksandar Pavlovic"],
    answer: "Konrad Laimer",
  },
  {
    clues: {
      en: [
        "Born in Buhl, Germany",
        "Left-footed centre-back known for his ball-playing ability",
        "Key defender for Borussia Dortmund",
      ],
      pt: [
        "Nascido em Bühl, Alemanha",
        "Zagueiro canhoto, conhecido pela qualidade na saída de bola",
        "Zagueiro titular do Borussia Dortmund",
      ],
      es: [
        "Nacido en Bühl, Alemania",
        "Defensor central zurdo, conocido por su buen manejo de balón",
        "Defensor titular del Borussia Dortmund",
      ],
    },
    options: ["Nico Schlotterbeck", "Mats Hummels", "Niklas Sule", "Waldemar Anton"],
    answer: "Nico Schlotterbeck",
  },
  {
    clues: {
      en: [
        "Born in Ziar nad Hronom, Slovakia",
        "Commanding centre-back known for his tackling",
        "Moved to PSG after years at Inter Milan",
      ],
      pt: [
        "Nascido em Ziar nad Hronom, Eslováquia",
        "Zagueiro imponente, conhecido pelos desarmes",
        "Transferiu-se ao PSG após anos na Inter de Milão",
      ],
      es: [
        "Nacido en Ziar nad Hronom, Eslovaquia",
        "Defensor central imponente, conocido por sus entradas",
        "Se mudó al PSG tras años en el Inter de Milán",
      ],
    },
    options: ["Milan Skriniar", "Marquinhos", "Presnel Kimpembe", "Lucas Hernandez"],
    answer: "Milan Skriniar",
  },
  {
    clues: {
      en: [
        "Born in Duran, Ecuador",
        "Left-footed centre-back with good speed",
        "Moved to Arsenal from Bayer Leverkusen",
      ],
      pt: [
        "Nascido em Durán, Equador",
        "Zagueiro canhoto e veloz",
        "Transferiu-se ao Arsenal vindo do Bayer Leverkusen",
      ],
      es: [
        "Nacido en Durán, Ecuador",
        "Defensor central zurdo y veloz",
        "Se mudó al Arsenal desde el Bayer Leverkusen",
      ],
    },
    options: ["Piero Hincapie", "Willian Pacho", "Robert Arboleda", "Felix Torres"],
    answer: "Piero Hincapie",
  },
  {
    clues: {
      en: [
        "Born in Sint-Pieters-Leeuw, Belgium",
        "Central midfielder known for his long-range shooting",
        "Left Leicester City to join Aston Villa",
      ],
      pt: [
        "Nascido em Sint-Pieters-Leeuw, Bélgica",
        "Meio-campista conhecido pelos chutes de longa distância",
        "Deixou o Leicester City para se transferir ao Aston Villa",
      ],
      es: [
        "Nacido en Sint-Pieters-Leeuw, Bélgica",
        "Centrocampista conocido por sus disparos de larga distancia",
        "Dejó el Leicester City para fichar por el Aston Villa",
      ],
    },
    options: ["Youri Tielemans", "Amadou Onana", "Boubacar Kamara", "Douglas Luiz"],
    answer: "Youri Tielemans",
  },
  {
    clues: {
      en: [
        "Born in Ondarroa, Spain",
        "Became the world's most expensive goalkeeper when he joined Chelsea",
        "Later had loan spells away from Chelsea, including at Real Madrid",
      ],
      pt: [
        "Nascido em Ondarroa, Espanha",
        "Tornou-se o goleiro mais caro da história ao se transferir para o Chelsea",
        "Depois teve empréstimos fora do Chelsea, incluindo no Real Madrid",
      ],
      es: [
        "Nacido en Ondarroa, España",
        "Se convirtió en el portero más caro de la historia al fichar por el Chelsea",
        "Después tuvo cesiones fuera del Chelsea, incluida una en el Real Madrid",
      ],
    },
    options: ["Kepa Arrizabalaga", "David Raya", "Robert Sanchez", "Aaron Ramsdale"],
    answer: "Kepa Arrizabalaga",
  },
  {
    clues: {
      en: [
        "Born in Le Blanc-Mesnil, France, but represents Portugal",
        "Versatile left-back who can also play in midfield",
        "Joined Bayern Munich after years at Borussia Dortmund",
      ],
      pt: [
        "Nascido em Le Blanc-Mesnil, França, mas representa Portugal",
        "Lateral-esquerdo versátil, também pode atuar no meio-campo",
        "Chegou ao Bayern de Munique após anos no Borussia Dortmund",
      ],
      es: [
        "Nacido en Le Blanc-Mesnil, Francia, pero representa a Portugal",
        "Lateral izquierdo versátil, también puede jugar en el mediocampo",
        "Llegó al Bayern de Múnich tras años en el Borussia Dortmund",
      ],
    },
    options: ["Raphael Guerreiro", "Nuno Mendes", "Diogo Dalot", "Antonio Silva"],
    answer: "Raphael Guerreiro",
  },
];

// ============ LINEUP MODE DATA ============
// Nationality is stored in English and translated via NATIONALITY_MAP.
// Clubs are proper nouns, shown as-is in every language.
// funFact is provided per language.
const NATIONALITY_MAP = {
  Spain: { pt: "Espanha", es: "España" },
  Brazil: { pt: "Brasil", es: "Brasil" },
  France: { pt: "França", es: "Francia" },
  Argentina: { pt: "Argentina", es: "Argentina" },
  "Costa Rica": { pt: "Costa Rica", es: "Costa Rica" },
  Germany: { pt: "Alemanha", es: "Alemania" },
  Croatia: { pt: "Croácia", es: "Croacia" },
  Portugal: { pt: "Portugal", es: "Portugal" },
  Wales: { pt: "País de Gales", es: "Gales" },
  Denmark: { pt: "Dinamarca", es: "Dinamarca" },
  England: { pt: "Inglaterra", es: "Inglaterra" },
  Netherlands: { pt: "Holanda", es: "Países Bajos" },
  Norway: { pt: "Noruega", es: "Noruega" },
  Ireland: { pt: "Irlanda", es: "Irlanda" },
  "Trinidad and Tobago": { pt: "Trinidad e Tobago", es: "Trinidad y Tobago" },
  Italy: { pt: "Itália", es: "Italia" },
  "Czech Republic": { pt: "República Tcheca", es: "República Checa" },
  Austria: { pt: "Áustria", es: "Austria" },
  Poland: { pt: "Polônia", es: "Polonia" },
  Finland: { pt: "Finlândia", es: "Finlandia" },
  Cameroon: { pt: "Camarões", es: "Camerún" },
  Serbia: { pt: "Sérvia", es: "Serbia" },
  "Ivory Coast": { pt: "Costa do Marfim", es: "Costa de Marfil" },
  Sweden: { pt: "Suécia", es: "Suecia" },
  Nigeria: { pt: "Nigéria", es: "Nigeria" },
  "South Africa": { pt: "África do Sul", es: "Sudáfrica" },
  Uruguay: { pt: "Uruguai", es: "Uruguay" },
  Switzerland: { pt: "Suíça", es: "Suiza" },
  Ecuador: { pt: "Equador", es: "Ecuador" },
  Georgia: { pt: "Geórgia", es: "Georgia" },
  Morocco: { pt: "Marrocos", es: "Marruecos" },
  Belgium: { pt: "Bélgica", es: "Bélgica" },
  Australia: { pt: "Austrália", es: "Australia" },
};

function translateNationality(nat, lang) {
  if (lang === "en") return nat;
  return NATIONALITY_MAP[nat]?.[lang] || nat;
}

// ============ BRAZIL MODE DATA (Portuguese-only exclusive mode) ============
const BRAZIL_QUESTION_POOL = [
  {
    clues: {
      pt: [
        "Nascido em Três Corações, Minas Gerais",
        "Único jogador a vencer três Copas do Mundo",
        "Marcou seu milésimo gol profissional em 1969",
      ],
    },
    options: ["Pelé", "Garrincha", "Zico", "Romário"],
    answer: "Pelé",
  },
  {
    clues: {
      pt: [
        "Nascido em Pau Grande, Rio de Janeiro",
        "Apelidado de 'Anjo das Pernas Tortas'",
        "Bicampeão mundial ao lado de Pelé, em 1958 e 1962",
      ],
    },
    options: ["Garrincha", "Didi", "Vavá", "Pelé"],
    answer: "Garrincha",
  },
  {
    clues: {
      pt: [
        "Nascido no Rio de Janeiro",
        "Apelidado de 'Galinho de Quintino'",
        "Ídolo histórico do Flamengo",
      ],
    },
    options: ["Zico", "Sócrates", "Careca", "Falcão"],
    answer: "Zico",
  },
  {
    clues: {
      pt: [
        "Nascido em Belém, Pará",
        "Formado em medicina, atuava como meia elegante",
        "Ícone da 'Democracia Corintiana' nos anos 1980",
      ],
    },
    options: ["Sócrates", "Zico", "Falcão", "Careca"],
    answer: "Sócrates",
  },
  {
    clues: {
      pt: [
        "Nascido no Rio de Janeiro",
        "Parte do ataque campeão da Copa de 1994",
        "Um dos poucos jogadores com mais de mil gols alegados na carreira",
      ],
    },
    options: ["Romário", "Bebeto", "Ronaldo", "Edmundo"],
    answer: "Romário",
  },
  {
    clues: {
      pt: [
        "Nascido em Bento Ribeiro, Rio de Janeiro",
        "Apelidado de 'Fenômeno'",
        "Artilheiro decisivo na conquista da Copa de 2002",
      ],
    },
    options: ["Ronaldo", "Romário", "Rivaldo", "Adriano"],
    answer: "Ronaldo",
  },
  {
    clues: {
      pt: [
        "Nascido em Porto Alegre",
        "Conhecido pelo sorriso e pelo drible desconcertante",
        "Eleito Melhor do Mundo pela FIFA em 2004 e 2005",
      ],
    },
    options: ["Ronaldinho", "Robinho", "Kaká", "Adriano"],
    answer: "Ronaldinho",
  },
  {
    clues: {
      pt: [
        "Nascido em Recife, Pernambuco",
        "Parte do ataque campeão da Copa de 2002 ao lado de Ronaldo",
        "Vencedor da Bola de Ouro em 1999",
      ],
    },
    options: ["Rivaldo", "Romário", "Edmundo", "Bebeto"],
    answer: "Rivaldo",
  },
  {
    clues: {
      pt: [
        "Nascido em Garça, São Paulo",
        "Lateral-esquerdo famoso por chutes de longa distância",
        "Fez história jogando pelo Real Madrid nos anos 1990 e 2000",
      ],
    },
    options: ["Roberto Carlos", "Cafu", "Marcelo", "Dani Alves"],
    answer: "Roberto Carlos",
  },
  {
    clues: {
      pt: [
        "Nascido em Araraquara, São Paulo",
        "Formou dupla de ataque famosa com Maradona no Napoli",
        "Artilheiro histórico da seleção brasileira nos anos 1980",
      ],
    },
    options: ["Careca", "Bebeto", "Müller", "Romário"],
    answer: "Careca",
  },
  {
    clues: {
      pt: [
        "Nascido em Porto Alegre",
        "Meio-campista elegante da seleção de 1982",
        "Se tornou ídolo também na Roma, na Itália",
      ],
    },
    options: ["Falcão", "Zico", "Sócrates", "Cerezo"],
    answer: "Falcão",
  },
  {
    clues: {
      pt: [
        "Nascida em Dois Riachos, Alagoas",
        "Eleita a Melhor do Mundo pela FIFA seis vezes",
        "Foi, por sete anos, a maior artilheira da história das Copas do Mundo, entre homens e mulheres",
      ],
    },
    options: ["Marta", "Cristiane", "Formiga", "Debinha"],
    answer: "Marta",
  },
  {
    clues: {
      pt: [
        "Nascido em Caxias, Rio de Janeiro",
        "Marcou gol em todas as partidas da Copa do Mundo de 1970",
        "Fez parte do ataque tricampeão ao lado de Pelé e Tostão",
      ],
    },
    options: ["Jairzinho", "Tostão", "Rivelino", "Gérson"],
    answer: "Jairzinho",
  },
  {
    clues: {
      pt: [
        "Nascido em São Paulo",
        "Apelidado de 'Rei do Drible'",
        "Famoso pelo chute conhecido como 'folha seca'",
      ],
    },
    options: ["Rivelino", "Gérson", "Tostão", "Jairzinho"],
    answer: "Rivelino",
  },
  {
    clues: {
      pt: [
        "Nascido em Belo Horizonte",
        "Camisa 9 do tricampeonato de 1970",
        "Depois de aposentado, se formou em medicina",
      ],
    },
    options: ["Tostão", "Vavá", "Careca", "Bebeto"],
    answer: "Tostão",
  },
  {
    clues: {
      pt: [
        "Nascido em Campos dos Goytacazes",
        "Apelidado de 'Etíope' pela elegância em campo",
        "Um dos criadores do chute conhecido como 'folha seca'",
      ],
    },
    options: ["Didi", "Zito", "Vavá", "Garrincha"],
    answer: "Didi",
  },
  {
    clues: {
      pt: [
        "Nascido no Rio de Janeiro",
        "Lateral-esquerdo bicampeão mundial em 1958 e 1962",
        "Ídolo histórico do Botafogo",
      ],
    },
    options: ["Nilton Santos", "Djalma Santos", "Fontana", "Orlando"],
    answer: "Nilton Santos",
  },
  {
    clues: {
      pt: [
        "Nascido em São Paulo",
        "Lateral-direito tricampeão mundial (1958, 1962 e 1970)",
        "Considerado um dos melhores laterais da história do futebol",
      ],
    },
    options: ["Djalma Santos", "Nilton Santos", "Carlos Alberto Torres", "Everaldo"],
    answer: "Djalma Santos",
  },
  {
    clues: {
      pt: [
        "Nascido no Rio de Janeiro",
        "Ídolo da seleção nos anos 1940 e 1950",
        "Apelidado de 'Mestre Ziza'",
      ],
    },
    options: ["Zizinho", "Ademir de Menezes", "Jair Rosa Pinto", "Leônidas da Silva"],
    answer: "Zizinho",
  },
  {
    clues: {
      pt: [
        "Nascido no Rio de Janeiro",
        "Apelidado de 'Diamante Negro'",
        "Um dos primeiros jogadores a popularizar o chute de bicicleta",
      ],
    },
    options: ["Leônidas da Silva", "Zizinho", "Domingos da Guia", "Ademir de Menezes"],
    answer: "Leônidas da Silva",
  },
  {
    clues: {
      pt: [
        "Nascido em Recife",
        "Artilheiro do bicampeonato mundial de 1958 e 1962",
        "Formou dupla de ataque com Pelé nas duas conquistas",
      ],
    },
    options: ["Vavá", "Didi", "Zagallo", "Garrincha"],
    answer: "Vavá",
  },
  {
    clues: {
      pt: [
        "Nascido em Salvador",
        "Formou dupla de ataque com Romário na Copa de 1994",
        "Ficou famoso pelo gesto de embalar bebê ao comemorar gols",
      ],
    },
    options: ["Bebeto", "Romário", "Careca", "Müller"],
    answer: "Bebeto",
  },
  {
    clues: {
      pt: [
        "Nascido em São Vicente, São Paulo",
        "Foi a transferência mais cara do mundo em 1998, ao se mudar para o Betis",
        "Conhecido pela quantidade impressionante de dribles em campo",
      ],
    },
    options: ["Denílson", "Robinho", "Elano", "Kaká"],
    answer: "Denílson",
  },
  {
    clues: {
      pt: [
        "Nascido no Rio de Janeiro",
        "Apelidado de 'Imperador'",
        "Foi artilheiro pela Inter de Milão em meados dos anos 2000",
      ],
    },
    options: ["Adriano", "Luís Fabiano", "Fred", "Alexandre Pato"],
    answer: "Adriano",
  },
  {
    clues: {
      pt: [
        "Nascido em Ilhabela, São Paulo",
        "Zagueiro e capitão de longa data do PSG",
        "Depois se transferiu para o Chelsea, já mais experiente",
      ],
    },
    options: ["Thiago Silva", "David Luiz", "Miranda", "Marquinhos"],
    answer: "Thiago Silva",
  },
  {
    clues: {
      pt: [
        "Nascido em Novo Hamburgo, Rio Grande do Sul",
        "Goleiro campeão da Champions League pelo Liverpool",
        "Irmão mais novo do também goleiro Muriel",
      ],
    },
    options: ["Alisson Becker", "Ederson", "Weverton", "Cássio"],
    answer: "Alisson Becker",
  },
  {
    clues: {
      pt: [
        "Nascido em São José dos Campos",
        "Volante com cinco títulos de Champions League pelo Real Madrid",
        "Depois se transferiu para o Manchester United",
      ],
    },
    options: ["Casemiro", "Fernandinho", "Fabinho", "Fred"],
    answer: "Casemiro",
  },
];

const LINEUP_POOL = [
  {
    team: "FC Barcelona",
    year: 2011,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Victor Valdes", position: "GK", number: 1, nationality: "Spain", clubs: "Barcelona, Standard Liege, Middlesbrough", funFact: { en: "Started out as a striker before converting to goalkeeper.", pt: "Começou como atacante antes de se converter em goleiro.", es: "Empezó como delantero antes de convertirse en portero." } },
      { name: "Eric Abidal", position: "DF", number: 22, nationality: "France", clubs: "Lyon, Barcelona, Monaco", funFact: { en: "Returned to professional football after a liver transplant.", pt: "Voltou ao futebol profissional após um transplante de fígado.", es: "Volvió al fútbol profesional tras un trasplante de hígado." } },
      { name: "Gerard Pique", position: "DF", number: 3, nationality: "Spain", clubs: "Manchester United, Zaragoza, Barcelona", funFact: { en: "Later co-founded the Kings League 7-a-side format.", pt: "Mais tarde, cofundou a Kings League, formato de futebol 7.", es: "Más tarde cofundó la Kings League, formato de fútbol 7." } },
      { name: "Javier Mascherano", position: "DF", number: 14, nationality: "Argentina", clubs: "River Plate, Liverpool, Barcelona", funFact: { en: "Started at centre-back in the 2011 final after Puyol was sidelined by injury.", pt: "Foi titular na zaga na final de 2011 depois de o Puyol ser barrado por lesão.", es: "Fue titular en la zaga en la final de 2011 tras la baja de Puyol por lesión." } },
      { name: "Dani Alves", position: "DF", number: 2, nationality: "Brazil", clubs: "Sevilla, Barcelona, Juventus, PSG", funFact: { en: "One of the most decorated players in football history.", pt: "Um dos jogadores mais premiados da história do futebol.", es: "Uno de los jugadores más laureados de la historia del fútbol." } },
      { name: "Sergio Busquets", position: "MF", number: 16, nationality: "Spain", clubs: "Barcelona, Inter Miami", funFact: { en: "Known for elite positional awareness over flashy skills.", pt: "Conhecido pela leitura de jogo excepcional, mais do que por habilidade vistosa.", es: "Conocido por su lectura de juego excepcional, más que por su habilidad vistosa." } },
      { name: "Xavi Hernandez", position: "MF", number: 6, nationality: "Spain", clubs: "Barcelona, Al Sadd", shortName: "Xavi", funFact: { en: "Later returned to Barcelona as head coach.", pt: "Mais tarde, retornou ao Barcelona como técnico principal.", es: "Más tarde regresó al Barcelona como entrenador principal." } },
      { name: "Andres Iniesta", position: "MF", number: 8, nationality: "Spain", clubs: "Barcelona, Vissel Kobe", funFact: { en: "Scored the winning goal in the 2010 World Cup final.", pt: "Marcou o gol da vitória na final da Copa do Mundo de 2010.", es: "Marcó el gol de la victoria en la final del Mundial de 2010." } },
      { name: "Pedro Rodriguez", position: "FW", number: 17, nationality: "Spain", clubs: "Barcelona, Chelsea, Roma, Lazio", shortName: "Pedro", funFact: { en: "Won six different trophies in a single calendar year.", pt: "Venceu seis títulos diferentes em um único ano civil.", es: "Ganó seis títulos distintos en un mismo año calendario." } },
      { name: "Lionel Messi", position: "FW", number: 10, nationality: "Argentina", clubs: "Barcelona, PSG, Inter Miami", funFact: { en: "Holds a record eight Ballon d'Or awards.", pt: "Detém o recorde de oito prêmios Bola de Ouro.", es: "Posee el récord de ocho Balones de Oro." } },
      { name: "David Villa", position: "FW", number: 7, nationality: "Spain", clubs: "Valencia, Barcelona, Atletico Madrid, New York City FC", funFact: { en: "Is Spain's all-time record goalscorer.", pt: "É o maior artilheiro da história da seleção espanhola.", es: "Es el máximo goleador histórico de la selección española." } },
    ],
  },
  {
    team: "Real Madrid",
    year: 2017,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Keylor Navas", position: "GK", number: 1, nationality: "Costa Rica", clubs: "Levante, Real Madrid, PSG", funFact: { en: "Started for his country at three different World Cups.", pt: "Foi titular por seu país em três Copas do Mundo diferentes.", es: "Fue titular con su selección en tres Copas del Mundo distintas." } },
      { name: "Marcelo", position: "DF", number: 12, nationality: "Brazil", clubs: "Fluminense, Real Madrid", funFact: { en: "Is the most decorated player in Real Madrid's history.", pt: "É o jogador mais premiado da história do Real Madrid.", es: "Es el jugador más laureado de la historia del Real Madrid." } },
      { name: "Sergio Ramos", position: "DF", number: 4, nationality: "Spain", clubs: "Sevilla, Real Madrid, PSG", funFact: { en: "Holds the record for most red cards in La Liga history.", pt: "Detém o recorde de mais cartões vermelhos na história de La Liga.", es: "Posee el récord de más tarjetas rojas en la historia de La Liga." } },
      { name: "Raphael Varane", position: "DF", number: 5, nationality: "France", clubs: "Lens, Real Madrid, Manchester United", funFact: { en: "Won the World Cup with France in 2018.", pt: "Venceu a Copa do Mundo com a França em 2018.", es: "Ganó el Mundial con Francia en 2018." } },
      { name: "Dani Carvajal", position: "DF", number: 2, nationality: "Spain", clubs: "Real Madrid, Bayer Leverkusen", funFact: { en: "Came through Real Madrid's own youth academy.", pt: "Surgiu nas categorias de base do próprio Real Madrid.", es: "Se formó en la propia cantera del Real Madrid." } },
      { name: "Casemiro", position: "MF", number: 14, nationality: "Brazil", clubs: "Sao Paulo, Real Madrid, Manchester United", funFact: { en: "Nicknamed the 'Wall' for his defensive midfield play.", pt: "Apelidado de 'Muralha' por seu papel defensivo no meio-campo.", es: "Apodado el 'Muro' por su papel defensivo en el mediocampo." } },
      { name: "Toni Kroos", position: "MF", number: 8, nationality: "Germany", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Won the World Cup with Germany in 2014.", pt: "Venceu a Copa do Mundo com a Alemanha em 2014.", es: "Ganó el Mundial con Alemania en 2014." } },
      { name: "Luka Modric", position: "MF", number: 10, nationality: "Croatia", clubs: "Dinamo Zagreb, Tottenham, Real Madrid", funFact: { en: "Won the 2018 Ballon d'Or, ending the Messi-Ronaldo streak.", pt: "Venceu a Bola de Ouro de 2018, encerrando a sequência de Messi e Ronaldo.", es: "Ganó el Balón de Oro de 2018, poniendo fin a la racha de Messi y Ronaldo." } },
      { name: "Karim Benzema", position: "FW", number: 9, nationality: "France", clubs: "Lyon, Real Madrid, Al-Ittihad", funFact: { en: "Won the Ballon d'Or in 2022.", pt: "Venceu a Bola de Ouro em 2022.", es: "Ganó el Balón de Oro en 2022." } },
      { name: "Cristiano Ronaldo", position: "FW", number: 7, nationality: "Portugal", clubs: "Sporting CP, Manchester United, Real Madrid, Juventus, Al Nassr", funFact: { en: "Football's all-time record goalscorer across club and country.", pt: "Maior artilheiro da história do futebol, somando clube e seleção.", es: "Máximo goleador histórico del fútbol, sumando club y selección." } },
      { name: "Isco", position: "AM", number: 22, nationality: "Spain", clubs: "Malaga, Real Madrid, Sevilla", funFact: { en: "Started ahead of Gareth Bale in the 2017 final, playing as a false winger behind the strikers.", pt: "Foi titular no lugar de Gareth Bale na final de 2017, atuando como armador atrás dos atacantes.", es: "Fue titular en lugar de Gareth Bale en la final de 2017, jugando como enganche detrás de los delanteros." } },
    ],
  },
  {
    team: "Manchester United",
    year: 1999,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Peter Schmeichel", position: "GK", number: 1, nationality: "Denmark", clubs: "Brondby, Manchester United, Sporting CP", funFact: { en: "Won the European Championship with Denmark in 1992.", pt: "Venceu a Eurocopa com a Dinamarca em 1992.", es: "Ganó la Eurocopa con Dinamarca en 1992." } },
      { name: "Denis Irwin", position: "DF", number: 3, nationality: "Ireland", clubs: "Manchester United, Oldham Athletic", funFact: { en: "Rarely missed a match, known for his reliability.", pt: "Raramente desfalcava o time, conhecido por sua regularidade.", es: "Rara vez se perdía un partido, conocido por su regularidad." } },
      { name: "Jaap Stam", position: "DF", number: 6, nationality: "Netherlands", clubs: "PSV, Manchester United, Lazio", funFact: { en: "Was one of the most expensive defenders of his era.", pt: "Foi um dos zagueiros mais caros de sua época.", es: "Fue uno de los defensores más caros de su época." } },
      { name: "Ronny Johnsen", position: "DF", number: 5, nationality: "Norway", clubs: "Besiktas, Manchester United", funFact: { en: "Overcame repeated injuries to feature in the 1999 treble run.", pt: "Superou lesões repetidas para atuar na campanha da tríplice coroa de 1999.", es: "Superó lesiones recurrentes para participar en la campaña del triplete de 1999." } },
      { name: "Gary Neville", position: "DF", number: 2, nationality: "England", clubs: "Manchester United", funFact: { en: "Spent his entire career at one club and later became a pundit.", pt: "Passou toda a carreira em um único clube e depois virou comentarista.", es: "Pasó toda su carrera en un solo club y luego se convirtió en comentarista." } },
      { name: "David Beckham", position: "MF", number: 7, nationality: "England", clubs: "Manchester United, Real Madrid, LA Galaxy, PSG", funFact: { en: "Scored a famous goal from inside his own half as a youngster.", pt: "Marcou um gol famoso do seu próprio campo quando ainda era jovem.", es: "Marcó un gol famoso desde su propio campo cuando era joven." } },
      { name: "Jesper Blomqvist", position: "MF", number: 16, nationality: "Sweden", clubs: "Gothenburg, Parma, Milan, Manchester United", funFact: { en: "Started on the left wing after Ryan Giggs moved to the right for the final.", pt: "Foi titular na ponta esquerda depois de Ryan Giggs se deslocar para a direita na final.", es: "Fue titular en el extremo izquierdo después de que Ryan Giggs se moviera a la derecha en la final." } },
      { name: "Nicky Butt", position: "MF", number: 8, nationality: "England", clubs: "Manchester United, Newcastle", funFact: { en: "Part of United's famous 'Class of 92' youth generation.", pt: "Fez parte da famosa geração da base do United, a 'Classe de 92'.", es: "Formó parte de la famosa generación de la cantera del United, la 'Clase del 92'." } },
      { name: "Ryan Giggs", position: "MF", number: 11, nationality: "Wales", clubs: "Manchester United", funFact: { en: "Holds the record for most appearances in the club's history.", pt: "Detém o recorde de mais jogos na história do clube.", es: "Posee el récord de más partidos en la historia del club." } },
      { name: "Dwight Yorke", position: "FW", number: 19, nationality: "Trinidad and Tobago", clubs: "Aston Villa, Manchester United, Blackburn", funFact: { en: "Formed a famous striking partnership with Andy Cole.", pt: "Formou uma dupla de ataque famosa ao lado de Andy Cole.", es: "Formó una dupla de ataque famosa junto a Andy Cole." } },
      { name: "Andy Cole", position: "FW", number: 9, nationality: "England", clubs: "Newcastle, Manchester United, Blackburn", funFact: { en: "Once scored five goals in a single Premier League match.", pt: "Já marcou cinco gols em uma única partida da Premier League.", es: "Llegó a marcar cinco goles en un solo partido de la Premier League." } },
    ],
  },
  {
    team: "AC Milan",
    year: 2007,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Dida", position: "GK", number: 1, nationality: "Brazil", clubs: "Cruzeiro, Corinthians, AC Milan", funFact: { en: "Won the Champions League twice with Milan.", pt: "Venceu a Champions League duas vezes com o Milan.", es: "Ganó la Champions League dos veces con el Milan." } },
      { name: "Marek Jankulovski", position: "DF", number: 18, nationality: "Czech Republic", clubs: "Banik Ostrava, Udinese, AC Milan", funFact: { en: "Converted from a winger into a left-back during his career.", pt: "Converteu-se de ponta para lateral-esquerdo ao longo da carreira.", es: "Se convirtió de extremo a lateral izquierdo a lo largo de su carrera." } },
      { name: "Alessandro Nesta", position: "DF", number: 13, nationality: "Italy", clubs: "Lazio, AC Milan", funFact: { en: "Considered one of the greatest defenders of his generation.", pt: "Considerado um dos maiores zagueiros de sua geração.", es: "Considerado uno de los mejores defensores de su generación." } },
      { name: "Paolo Maldini", position: "DF", number: 3, nationality: "Italy", clubs: "AC Milan", funFact: { en: "Played over 900 matches for Milan across 25 seasons.", pt: "Disputou mais de 900 partidas pelo Milan em 25 temporadas.", es: "Disputó más de 900 partidos con el Milan en 25 temporadas." } },
      { name: "Cafu", position: "DF", number: 2, nationality: "Brazil", clubs: "Sao Paulo, Roma, AC Milan", funFact: { en: "Only player to appear in three consecutive World Cup finals.", pt: "Único jogador a disputar três finais consecutivas de Copa do Mundo.", es: "Único jugador en disputar tres finales consecutivas de Copa del Mundo." } },
      { name: "Massimo Ambrosini", position: "DM", number: 4, nationality: "Italy", clubs: "AC Milan", funFact: { en: "Later served as Milan's club captain.", pt: "Mais tarde, se tornou capitão do Milan.", es: "Más tarde fue capitán del Milan." } },
      { name: "Andrea Pirlo", position: "DM", number: 21, nationality: "Italy", clubs: "Inter Milan, AC Milan, Juventus", funFact: { en: "Reinvented himself from attacking midfielder to deep playmaker.", pt: "Reinventou-se: de meia ofensivo para armador recuado.", es: "Se reinventó: de mediapunta a armador retrasado." } },
      { name: "Clarence Seedorf", position: "AM", number: 10, nationality: "Netherlands", clubs: "Ajax, Real Madrid, Inter Milan, AC Milan", funFact: { en: "Only player to win the Champions League with three different clubs.", pt: "Único jogador a vencer a Champions League por três clubes diferentes.", es: "Único jugador en ganar la Champions League con tres clubes distintos." } },
      { name: "Kaka", position: "AM", number: 22, nationality: "Brazil", clubs: "Sao Paulo, AC Milan, Real Madrid", funFact: { en: "Won the Ballon d'Or in 2007.", pt: "Venceu a Bola de Ouro em 2007.", es: "Ganó el Balón de Oro en 2007." } },
      { name: "Filippo Inzaghi", position: "FW", number: 9, nationality: "Italy", clubs: "Atalanta, Juventus, AC Milan", funFact: { en: "Nicknamed 'Pippo', famous for his predatory instincts in the box.", pt: "Apelidado de 'Pippo', famoso pelo faro de artilheiro dentro da área.", es: "Apodado 'Pippo', famoso por su olfato goleador dentro del área." } },
      { name: "Alberto Gilardino", position: "AM", number: 7, nationality: "Italy", clubs: "Parma, AC Milan, Fiorentina", funFact: { en: "Part of Italy's 2006 World Cup winning squad.", pt: "Fez parte do elenco campeão da Copa do Mundo de 2006 pela Itália.", es: "Formó parte del plantel campeón del Mundial de 2006 con Italia." } },
    ],
  },
  {
    team: "Bayern Munich",
    year: 2013,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Manuel Neuer", position: "GK", number: 1, nationality: "Germany", clubs: "Schalke 04, Bayern Munich", funFact: { en: "Pioneered the modern 'sweeper-keeper' playing style.", pt: "Foi pioneiro no estilo moderno de goleiro-líbero.", es: "Fue pionero en el estilo moderno de portero-líbero." } },
      { name: "David Alaba", position: "DF", number: 27, nationality: "Austria", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Known for his versatility across defense and midfield.", pt: "Conhecido pela versatilidade entre a defesa e o meio-campo.", es: "Conocido por su versatilidad entre la defensa y el mediocampo." } },
      { name: "Jerome Boateng", position: "DF", number: 17, nationality: "Germany", clubs: "Hamburg, Manchester City, Bayern Munich", funFact: { en: "Won the World Cup with Germany in 2014.", pt: "Venceu a Copa do Mundo com a Alemanha em 2014.", es: "Ganó el Mundial con Alemania en 2014." } },
      { name: "Dante", position: "DF", number: 4, nationality: "Brazil", clubs: "Standard Liege, Borussia Monchengladbach, Bayern Munich", funFact: { en: "Represented Brazil at the 2014 World Cup.", pt: "Defendeu o Brasil na Copa do Mundo de 2014.", es: "Representó a Brasil en el Mundial de 2014." } },
      { name: "Philipp Lahm", position: "DF", number: 21, nationality: "Germany", clubs: "Bayern Munich, Stuttgart", funFact: { en: "Could play at the highest level on either side of defense.", pt: "Podia atuar em alto nível nas duas laterais da defesa.", es: "Podía jugar a alto nivel en ambos laterales de la defensa." } },
      { name: "Bastian Schweinsteiger", position: "DM", number: 31, nationality: "Germany", clubs: "Bayern Munich, Manchester United", funFact: { en: "Named man of the match in the 2014 World Cup final.", pt: "Eleito o melhor em campo na final da Copa do Mundo de 2014.", es: "Elegido mejor jugador del partido en la final del Mundial de 2014." } },
      { name: "Javi Martinez", position: "DM", number: 8, nationality: "Spain", clubs: "Athletic Bilbao, Bayern Munich", funFact: { en: "Won the treble in his very first season at Bayern.", pt: "Venceu a tríplice coroa em sua primeira temporada no Bayern.", es: "Ganó el triplete en su primera temporada en el Bayern." } },
      { name: "Thomas Muller", position: "AM", number: 25, nationality: "Germany", clubs: "Bayern Munich", funFact: { en: "Describes his own role as a 'Raumdeuter', or space interpreter.", pt: "Descreve sua própria função como 'Raumdeuter', ou 'intérprete de espaços'.", es: "Describe su propia función como 'Raumdeuter', o 'intérprete de espacios'." } },
      { name: "Arjen Robben", position: "AM", number: 10, nationality: "Netherlands", clubs: "PSV, Chelsea, Real Madrid, Bayern Munich", funFact: { en: "Scored the winning goal in the 2013 Champions League final.", pt: "Marcou o gol da vitória na final da Champions League de 2013.", es: "Marcó el gol de la victoria en la final de la Champions League de 2013." } },
      { name: "Mario Mandzukic", position: "FW", number: 9, nationality: "Croatia", clubs: "Dinamo Zagreb, Bayern Munich, Atletico Madrid, Juventus", funFact: { en: "Scored in a Champions League final for two different clubs.", pt: "Marcou em finais de Champions League por dois clubes diferentes.", es: "Marcó en finales de Champions League con dos clubes distintos." } },
      { name: "Franck Ribery", position: "AM", number: 7, nationality: "France", clubs: "Metz, Marseille, Bayern Munich", funFact: { en: "Was runner-up for the Ballon d'Or in 2013.", pt: "Foi vice-campeão da Bola de Ouro em 2013.", es: "Fue subcampeón del Balón de Oro en 2013." } },
    ],
  },
  {
    team: "Liverpool",
    year: 2005,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Jerzy Dudek", position: "GK", number: 1, nationality: "Poland", clubs: "Feyenoord, Liverpool", funFact: { en: "His 'wobbly legs' penalty save became iconic after the 2005 final.", pt: "Sua defesa de pênalti com as 'pernas bambas' virou icônica após a final de 2005.", es: "Su parada de penalti con las 'piernas de gelatina' se hizo icónica tras la final de 2005." } },
      { name: "Steve Finnan", position: "DF", number: 2, nationality: "Ireland", clubs: "Fulham, Liverpool", funFact: { en: "Earned over 50 caps for the Republic of Ireland.", pt: "Somou mais de 50 partidas pela seleção da Irlanda.", es: "Sumó más de 50 partidos con la selección de Irlanda." } },
      { name: "Jamie Carragher", position: "DF", number: 23, nationality: "England", clubs: "Liverpool", funFact: { en: "Made over 700 appearances, all for Liverpool.", pt: "Disputou mais de 700 partidas, todas pelo Liverpool.", es: "Disputó más de 700 partidos, todos con el Liverpool." } },
      { name: "Sami Hyypia", position: "DF", number: 4, nationality: "Finland", clubs: "Willem II, Liverpool", funFact: { en: "Later managed Bayer Leverkusen in the Bundesliga.", pt: "Mais tarde treinou o Bayer Leverkusen na Bundesliga.", es: "Más tarde dirigió al Bayer Leverkusen en la Bundesliga." } },
      { name: "Djimi Traore", position: "DF", number: 3, nationality: "France", clubs: "Lens, Liverpool", funFact: { en: "Overcame a rocky start to become a key defender in Istanbul.", pt: "Superou um início conturbado para se tornar peça-chave na final de Istambul.", es: "Superó un comienzo complicado para convertirse en pieza clave en la final de Estambul." } },
      { name: "Steven Gerrard", position: "MF", number: 8, nationality: "England", clubs: "Liverpool", funFact: { en: "Scored a famous header to spark the 2005 final comeback.", pt: "Marcou um gol de cabeça famoso que iniciou a virada na final de 2005.", es: "Marcó un cabezazo famoso que inició la remontada en la final de 2005." } },
      { name: "Xabi Alonso", position: "MF", number: 14, nationality: "Spain", clubs: "Real Sociedad, Liverpool, Real Madrid, Bayern Munich", funFact: { en: "Later became a head coach at Bayer Leverkusen.", pt: "Mais tarde, se tornou técnico principal do Bayer Leverkusen.", es: "Más tarde se convirtió en entrenador principal del Bayer Leverkusen." } },
      { name: "Luis Garcia", position: "MF", number: 10, nationality: "Spain", clubs: "Barcelona, Liverpool, Atletico Madrid", funFact: { en: "Scored the controversial 'ghost goal' in the 2005 semifinal.", pt: "Marcou o polêmico 'gol fantasma' na semifinal de 2005.", es: "Marcó el polémico 'gol fantasma' en la semifinal de 2005." } },
      { name: "John Arne Riise", position: "MF", number: 6, nationality: "Norway", clubs: "Monaco, Liverpool", funFact: { en: "Known for one of the hardest shots in football at the time.", pt: "Conhecido por um dos chutes mais fortes do futebol da época.", es: "Conocido por uno de los disparos más potentes del fútbol de su época." } },
      { name: "Milan Baros", position: "FW", number: 9, nationality: "Czech Republic", clubs: "Banik Ostrava, Liverpool, Aston Villa", funFact: { en: "Was the top scorer at Euro 2004.", pt: "Foi o artilheiro da Eurocopa de 2004.", es: "Fue el máximo goleador de la Eurocopa de 2004." } },
      { name: "Harry Kewell", position: "FW", number: 7, nationality: "Australia", clubs: "Leeds United, Liverpool, Galatasaray", funFact: { en: "Started the final but was substituted early through injury.", pt: "Foi titular na final, mas precisou sair substituído cedo por lesão.", es: "Fue titular en la final, pero tuvo que salir sustituido pronto por lesión." } },
    ],
  },
  {
    team: "Inter Milan",
    year: 2010,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Julio Cesar", position: "GK", number: 1, nationality: "Brazil", clubs: "Inter Milan, Queens Park Rangers", funFact: { en: "Was Brazil's starting goalkeeper heading into the 2010 World Cup.", pt: "Era o goleiro titular do Brasil às vésperas da Copa do Mundo de 2010.", es: "Era el portero titular de Brasil de cara al Mundial de 2010." } },
      { name: "Javier Zanetti", position: "DF", number: 4, nationality: "Argentina", clubs: "Inter Milan (only)", funFact: { en: "Holds the record for most appearances in Inter Milan's history.", pt: "Detém o recorde de mais jogos na história da Inter de Milão.", es: "Posee el récord de más partidos en la historia del Inter de Milán." } },
      { name: "Lucio", position: "DF", number: 4, nationality: "Brazil", clubs: "Bayer Leverkusen, Bayern Munich, Inter Milan", funFact: { en: "Won the World Cup with Brazil in 2002.", pt: "Venceu a Copa do Mundo com o Brasil em 2002.", es: "Ganó el Mundial con Brasil en 2002." } },
      { name: "Walter Samuel", position: "DF", number: 15, nationality: "Argentina", clubs: "Roma, Real Madrid, Inter Milan", funFact: { en: "Nicknamed 'The Wall' for his uncompromising defending.", pt: "Apelidado de 'A Muralha' pela marcação implacável.", es: "Apodado 'La Muralla' por su marca implacable." } },
      { name: "Maicon", position: "DF", number: 2, nationality: "Brazil", clubs: "Inter Milan, Manchester City", funFact: { en: "Scored a memorable curling goal against Chelsea in the same campaign.", pt: "Marcou um gol de placa contra o Chelsea na mesma campanha.", es: "Marcó un golazo de rosca ante el Chelsea en la misma campaña." } },
      { name: "Esteban Cambiasso", position: "MF", number: 19, nationality: "Argentina", clubs: "Real Madrid, Inter Milan", funFact: { en: "Won the treble with Inter after a decorated career at Real Madrid.", pt: "Venceu a tríplice coroa pela Inter após passagem de sucesso pelo Real Madrid.", es: "Ganó el triplete con el Inter tras una etapa exitosa en el Real Madrid." } },
      { name: "Thiago Motta", position: "MF", number: 8, nationality: "Italy", clubs: "Barcelona, Inter Milan, PSG", funFact: { en: "Born in Brazil but chose to represent Italy internationally.", pt: "Nasceu no Brasil, mas escolheu representar a Itália na seleção.", es: "Nació en Brasil, pero eligió representar a Italia en la selección." } },
      { name: "Wesley Sneijder", position: "MF", number: 10, nationality: "Netherlands", clubs: "Ajax, Real Madrid, Inter Milan", funFact: { en: "Was a key creative force in Inter's treble-winning season.", pt: "Foi peça-chave na criação de jogadas na temporada da tríplice coroa.", es: "Fue pieza clave en la creación de juego en la temporada del triplete." } },
      { name: "Dejan Stankovic", position: "MF", number: 5, nationality: "Serbia", clubs: "Lazio, Inter Milan", funFact: { en: "Known for his versatility across midfield positions.", pt: "Conhecido pela versatilidade em diferentes posições do meio-campo.", es: "Conocido por su versatilidad en distintas posiciones del mediocampo." } },
      { name: "Diego Milito", position: "FW", number: 22, nationality: "Argentina", clubs: "Genoa, Inter Milan", funFact: { en: "Scored both goals in the 2010 Champions League final.", pt: "Marcou os dois gols na final da Champions League de 2010.", es: "Marcó los dos goles en la final de la Champions League de 2010." } },
      { name: "Samuel Eto'o", position: "FW", number: 9, nationality: "Cameroon", clubs: "Barcelona, Inter Milan, Chelsea", funFact: { en: "Won the Champions League with three different clubs across his career.", pt: "Venceu a Champions League por três clubes diferentes ao longo da carreira.", es: "Ganó la Champions League con tres clubes distintos a lo largo de su carrera." } },
    ],
  },
  {
    team: "Arsenal",
    year: 2004,
    matchLabel: { en: "Most-used XI, unbeaten 2003/04 season", pt: "Escalação mais usada na temporada invicta 2003/04", es: "Alineación más usada en la temporada invicta 2003/04" },
    players: [
      { name: "Jens Lehmann", position: "GK", number: 1, nationality: "Germany", clubs: "Borussia Dortmund, Arsenal", funFact: { en: "Went the entire unbeaten season as Arsenal's first-choice goalkeeper.", pt: "Foi o goleiro titular do Arsenal durante toda a temporada invicta.", es: "Fue el portero titular del Arsenal durante toda la temporada invicta." } },
      { name: "Ashley Cole", position: "DF", number: 3, nationality: "England", clubs: "Arsenal, Chelsea", funFact: { en: "Considered one of the best left-backs of his generation.", pt: "Considerado um dos melhores laterais-esquerdos de sua geração.", es: "Considerado uno de los mejores laterales izquierdos de su generación." } },
      { name: "Sol Campbell", position: "DF", number: 23, nationality: "England", clubs: "Tottenham, Arsenal", funFact: { en: "Anchored the Arsenal defense throughout the Invincibles campaign.", pt: "Foi a base da defesa do Arsenal durante toda a campanha invicta.", es: "Fue la base de la defensa del Arsenal durante toda la campaña invicta." } },
      { name: "Kolo Toure", position: "DF", number: 5, nationality: "Ivory Coast", clubs: "ASEC Mimosas, Arsenal", funFact: { en: "Later captained Ivory Coast at multiple Africa Cup of Nations tournaments.", pt: "Mais tarde foi capitão da Costa do Marfim em diversas Copas Africanas.", es: "Más tarde fue capitán de Costa de Marfil en varias Copas Africanas." } },
      { name: "Lauren", position: "DF", number: 12, nationality: "Cameroon", clubs: "Real Mallorca, Arsenal", funFact: { en: "A converted midfielder who became a reliable right-back.", pt: "Ex-meio-campista convertido em lateral-direito confiável.", es: "Ex-centrocampista reconvertido en un lateral derecho confiable." } },
      { name: "Patrick Vieira", position: "MF", number: 4, nationality: "France", clubs: "Milan, Arsenal, Juventus", funFact: { en: "Captained Arsenal throughout the unbeaten league campaign.", pt: "Foi capitão do Arsenal durante toda a campanha invicta no campeonato.", es: "Fue capitán del Arsenal durante toda la campaña invicta en el campeonato." } },
      { name: "Gilberto Silva", position: "MF", number: 19, nationality: "Brazil", clubs: "Atletico Mineiro, Arsenal", funFact: { en: "Won the World Cup with Brazil in 2002 before joining Arsenal.", pt: "Venceu a Copa do Mundo com o Brasil em 2002 antes de se transferir ao Arsenal.", es: "Ganó el Mundial con Brasil en 2002 antes de fichar por el Arsenal." } },
      { name: "Freddie Ljungberg", position: "MF", number: 8, nationality: "Sweden", clubs: "Halmstad, Arsenal", funFact: { en: "Known for his eye-catching hair and clutch late goals.", pt: "Conhecido pelo cabelo chamativo e por gols decisivos no fim das partidas.", es: "Conocido por su cabello llamativo y sus goles decisivos al final de los partidos." } },
      { name: "Robert Pires", position: "MF", number: 7, nationality: "France", clubs: "Metz, Marseille, Arsenal", funFact: { en: "Won the World Cup and European Championship with France.", pt: "Venceu a Copa do Mundo e a Eurocopa pela seleção francesa.", es: "Ganó el Mundial y la Eurocopa con la selección francesa." } },
      { name: "Thierry Henry", position: "FW", number: 14, nationality: "France", clubs: "Monaco, Juventus, Arsenal, Barcelona", funFact: { en: "Is Arsenal's all-time record goalscorer.", pt: "É o maior artilheiro da história do Arsenal.", es: "Es el máximo goleador histórico del Arsenal." } },
      { name: "Dennis Bergkamp", position: "FW", number: 10, nationality: "Netherlands", clubs: "Ajax, Inter Milan, Arsenal", funFact: { en: "Famous for his close control and a fear of flying that limited his travel.", pt: "Famoso pelo controle de bola refinado e pelo medo de voar, que limitava suas viagens.", es: "Famoso por su control de balón refinado y su miedo a volar, que limitaba sus viajes." } },
    ],
  },
  {
    team: "Chelsea",
    year: 2012,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Petr Cech", position: "GK", number: 1, nationality: "Czech Republic", clubs: "Rennes, Chelsea", funFact: { en: "Known for wearing a protective headguard after a serious head injury.", pt: "Conhecido por usar capacete de proteção após uma grave lesão na cabeça.", es: "Conocido por usar un casco de protección tras una grave lesión en la cabeza." } },
      { name: "Ashley Cole", position: "DF", number: 3, nationality: "England", clubs: "Arsenal, Chelsea", funFact: { en: "Won the Champions League with a second different club in 2012.", pt: "Venceu a Champions League por um segundo clube diferente em 2012.", es: "Ganó la Champions League con un segundo club distinto en 2012." } },
      { name: "Gary Cahill", position: "DF", number: 24, nationality: "England", clubs: "Aston Villa, Bolton, Chelsea", funFact: { en: "Started at centre-back in the final after captain John Terry was suspended.", pt: "Foi titular na zaga na final depois de o capitão John Terry ser suspenso.", es: "Fue titular en la zaga en la final tras la sanción del capitán John Terry." } },
      { name: "David Luiz", position: "DF", number: 4, nationality: "Brazil", clubs: "Benfica, Chelsea, PSG", funFact: { en: "Known for his attacking runs from central defense.", pt: "Conhecido pelas subidas ofensivas saindo da zaga.", es: "Conocido por sus subidas ofensivas desde la zaga." } },
      { name: "Jose Bosingwa", position: "DF", number: 17, nationality: "Portugal", clubs: "Porto, Chelsea, QPR", funFact: { en: "Started at right-back in the final after Ivanovic was suspended.", pt: "Foi titular na lateral-direita na final depois de Ivanovic ser suspenso.", es: "Fue titular en el lateral derecho en la final tras la sanción de Ivanovic." } },
      { name: "Frank Lampard", position: "DM", number: 8, nationality: "England", clubs: "West Ham, Chelsea", funFact: { en: "Is Chelsea's all-time record goalscorer.", pt: "É o maior artilheiro da história do Chelsea.", es: "Es el máximo goleador histórico del Chelsea." } },
      { name: "Jon Obi Mikel", position: "DM", number: 12, nationality: "Nigeria", clubs: "Lyn Oslo, Chelsea", funFact: { en: "Played the deep defensive midfield role throughout the final.", pt: "Atuou na função de volante mais recuado durante toda a final.", es: "Jugó en la posición de volante más retrasado durante toda la final." } },
      { name: "Salomon Kalou", position: "AM", number: 21, nationality: "Ivory Coast", clubs: "Feyenoord, Chelsea, Hertha Berlin", funFact: { en: "Started wide in the final before being replaced by Fernando Torres.", pt: "Foi titular aberto pelo lado na final antes de ser substituído por Fernando Torres.", es: "Fue titular abierto por la banda en la final antes de ser sustituido por Fernando Torres." } },
      { name: "Juan Mata", position: "AM", number: 10, nationality: "Spain", clubs: "Valencia, Chelsea, Manchester United", funFact: { en: "Was Chelsea's Player of the Year in the club's title-winning season.", pt: "Foi eleito o melhor jogador do Chelsea na temporada do título europeu.", es: "Fue elegido mejor jugador del Chelsea en la temporada del título europeo." } },
      { name: "Didier Drogba", position: "FW", number: 11, nationality: "Ivory Coast", clubs: "Marseille, Chelsea, Galatasaray", funFact: { en: "Scored the equalizer and the winning penalty in the 2012 final.", pt: "Marcou o gol de empate e o pênalti decisivo na final de 2012.", es: "Marcó el gol del empate y el penalti decisivo en la final de 2012." } },
      { name: "Ryan Bertrand", position: "AM", number: 34, nationality: "England", clubs: "Chelsea, Southampton", funFact: { en: "A converted full-back who started on the wing in the final, his first senior appearance for the club.", pt: "Lateral de origem que foi titular pela ponta na final, sua primeira partida pelo time principal.", es: "Lateral de origen que fue titular por la banda en la final, su primer partido con el primer equipo." } },
    ],
  },
  {
    team: "FC Porto",
    year: 2004,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Vitor Baia", position: "GK", number: 1, nationality: "Portugal", clubs: "Porto, Barcelona", funFact: { en: "A veteran goalkeeper who returned to Porto after a spell at Barcelona.", pt: "Goleiro veterano que retornou ao Porto após passagem pelo Barcelona.", es: "Portero veterano que regresó al Porto tras un paso por el Barcelona." } },
      { name: "Nuno Valente", position: "DF", number: 16, nationality: "Portugal", clubs: "Boavista, Porto", funFact: { en: "Started at left-back in the 2004 Champions League final.", pt: "Foi titular na lateral-esquerda na final da Champions League de 2004.", es: "Fue titular en el lateral izquierdo en la final de la Champions League de 2004." } },
      { name: "Ricardo Carvalho", position: "DF", number: 15, nationality: "Portugal", clubs: "Porto, Chelsea", funFact: { en: "Also followed Mourinho to Chelsea the following season.", pt: "Também seguiu Mourinho para o Chelsea na temporada seguinte.", es: "También siguió a Mourinho al Chelsea la temporada siguiente." } },
      { name: "Jorge Costa", position: "DF", number: 4, nationality: "Portugal", clubs: "Porto (mostly)", funFact: { en: "Represented Portugal at the 2000 European Championship.", pt: "Defendeu Portugal na Eurocopa de 2000.", es: "Representó a Portugal en la Eurocopa de 2000." } },
      { name: "Paulo Ferreira", position: "DF", number: 25, nationality: "Portugal", clubs: "Vitoria Setubal, Porto", funFact: { en: "Followed his coach Jose Mourinho to Chelsea after this title.", pt: "Seguiu seu técnico José Mourinho para o Chelsea após esse título.", es: "Siguió a su entrenador José Mourinho al Chelsea tras este título." } },
      { name: "Costinha", position: "MF", number: 6, nationality: "Portugal", clubs: "Porto, Dynamo Moscow", funFact: { en: "Scored a late goal in the 2004 semifinal comeback against Deportivo.", pt: "Marcou um gol decisivo na virada da semifinal de 2004 contra o Deportivo.", es: "Marcó un gol decisivo en la remontada de la semifinal de 2004 ante el Deportivo." } },
      { name: "Maniche", position: "MF", number: 8, nationality: "Portugal", clubs: "Benfica, Porto", funFact: { en: "Scored a spectacular long-range goal in the 2004 final.", pt: "Marcou um golaço de longa distância na final de 2004.", es: "Marcó un golazo de larga distancia en la final de 2004." } },
      { name: "Deco", position: "MF", number: 10, nationality: "Portugal", clubs: "Porto, Barcelona, Chelsea", funFact: { en: "Born in Brazil but became a naturalized Portuguese international.", pt: "Nasceu no Brasil, mas se naturalizou português para jogar pela seleção.", es: "Nació en Brasil, pero se naturalizó portugués para jugar con la selección." } },
      { name: "Pedro Mendes", position: "MF", number: 17, nationality: "Portugal", clubs: "Porto, Tottenham", funFact: { en: "A box-to-box midfielder in Mourinho's title-winning squad.", pt: "Meio-campista box-to-box no elenco campeão de Mourinho.", es: "Centrocampista box-to-box en el plantel campeón de Mourinho." } },
      { name: "Derlei", position: "FW", number: 20, nationality: "Brazil", clubs: "Uniao Leiria, Porto", funFact: { en: "Was Porto's top scorer during the Champions League winning campaign.", pt: "Foi o artilheiro do Porto na campanha campeã da Champions League.", es: "Fue el máximo goleador del Porto en la campaña campeona de la Champions League." } },
      { name: "Carlos Alberto", position: "FW", number: 9, nationality: "Brazil", clubs: "Fluminense, Porto, Corinthians", funFact: { en: "Scored the opening goal of the 2004 Champions League final.", pt: "Marcou o primeiro gol da final da Champions League de 2004.", es: "Marcó el primer gol de la final de la Champions League de 2004." } },
    ],
  },
  {
    team: "Ajax",
    year: 1995,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Edwin van der Sar", position: "GK", number: 1, nationality: "Netherlands", clubs: "Ajax, Manchester United", funFact: { en: "Later became one of the most decorated goalkeepers in football history.", pt: "Mais tarde se tornou um dos goleiros mais vitoriosos da história do futebol.", es: "Más tarde se convirtió en uno de los porteros más laureados de la historia del fútbol." } },
      { name: "Michael Reiziger", position: "DF", number: 2, nationality: "Netherlands", clubs: "Ajax, Barcelona, Milan", funFact: { en: "Part of a golden generation developed in Ajax's youth academy.", pt: "Parte de uma geração de ouro revelada nas categorias de base do Ajax.", es: "Parte de una generación dorada formada en la cantera del Ajax." } },
      { name: "Frank de Boer", position: "DF", number: 4, nationality: "Netherlands", clubs: "Ajax, Barcelona", funFact: { en: "Twin brother of teammate Ronald de Boer.", pt: "Irmão gêmeo do companheiro de time Ronald de Boer.", es: "Hermano gemelo de su compañero de equipo Ronald de Boer." } },
      { name: "Danny Blind", position: "DF", number: 10, nationality: "Netherlands", clubs: "Ajax (mostly)", funFact: { en: "Later managed the Netherlands national team.", pt: "Mais tarde treinou a seleção da Holanda.", es: "Más tarde dirigió a la selección de Holanda." } },
      { name: "Winston Bogarde", position: "MF", number: 3, nationality: "Netherlands", clubs: "Ajax, Milan, Chelsea", funFact: { en: "Versatile defender who later played in the Premier League.", pt: "Defensor versátil que depois jogou na Premier League.", es: "Defensor versátil que después jugó en la Premier League." } },
      { name: "Edgar Davids", position: "MF", number: 8, nationality: "Netherlands", clubs: "Ajax, Milan, Juventus", funFact: { en: "Nicknamed 'The Pitbull' for his relentless tackling.", pt: "Apelidado de 'Pitbull' pela marcação implacável.", es: "Apodado 'El Pitbull' por su marca implacable." } },
      { name: "Ronald de Boer", position: "MF", number: 11, nationality: "Netherlands", clubs: "Ajax, Barcelona", funFact: { en: "Twin brother of Frank de Boer, also part of that Ajax generation.", pt: "Irmão gêmeo de Frank de Boer, também parte daquela geração do Ajax.", es: "Hermano gemelo de Frank de Boer, también parte de aquella generación del Ajax." } },
      { name: "Clarence Seedorf", position: "MF", number: 20, nationality: "Netherlands", clubs: "Ajax, Real Madrid, Inter Milan, AC Milan", funFact: { en: "Went on to win the Champions League with three different clubs.", pt: "Depois venceu a Champions League por três clubes diferentes.", es: "Después ganó la Champions League con tres clubes distintos." } },
      { name: "Finidi George", position: "FW", number: 7, nationality: "Nigeria", clubs: "Ajax, Real Betis", funFact: { en: "Nigerian winger who was part of Ajax's dominant mid-90s side.", pt: "Ponta nigeriano que fez parte do Ajax dominante da metade dos anos 90.", es: "Extremo nigeriano que formó parte del Ajax dominante de mediados de los 90." } },
      { name: "Patrick Kluivert", position: "FW", number: 9, nationality: "Netherlands", clubs: "Ajax, Barcelona, Milan", funFact: { en: "Scored the winning goal in the 1995 Champions League final.", pt: "Marcou o gol da vitória na final da Champions League de 1995.", es: "Marcó el gol de la victoria en la final de la Champions League de 1995." } },
      { name: "Jari Litmanen", position: "FW", number: 15, nationality: "Finland", clubs: "Ajax, Barcelona, Liverpool", funFact: { en: "Finland's greatest ever player, key creative force for Ajax.", pt: "Maior jogador da história da Finlândia, peça criativa fundamental do Ajax.", es: "El mejor jugador de la historia de Finlandia, pieza creativa fundamental del Ajax." } },
    ],
  },
  {
    team: "Juventus",
    year: 1996,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Angelo Peruzzi", position: "GK", number: 1, nationality: "Italy", clubs: "Juventus, Inter Milan", funFact: { en: "Reliable goalkeeper throughout Juventus's Champions League run.", pt: "Goleiro confiável durante toda a campanha da Champions League da Juventus.", es: "Portero confiable durante toda la campaña de la Champions League de la Juventus." } },
      { name: "Gianluca Pessotto", position: "DF", number: 3, nationality: "Italy", clubs: "Juventus (mostly)", funFact: { en: "Versatile defender who spent his whole career at Juventus.", pt: "Defensor versátil que passou toda a carreira na Juventus.", es: "Defensor versátil que pasó toda su carrera en la Juventus." } },
      { name: "Ciro Ferrara", position: "DF", number: 5, nationality: "Italy", clubs: "Napoli, Juventus", funFact: { en: "Longtime Juventus defender and later a coach.", pt: "Zagueiro de longa data da Juventus, mais tarde também treinador.", es: "Defensor de larga trayectoria en la Juventus, más tarde también entrenador." } },
      { name: "Sergio Vierchowod", position: "DF", number: 5, nationality: "Italy", clubs: "Sampdoria, Inter Milan, Juventus", funFact: { en: "Won Serie A with Sampdoria in the club's only league title.", pt: "Venceu o Serie A com a Sampdoria, único título de liga do clube.", es: "Ganó la Serie A con la Sampdoria, único título de liga del club." } },
      { name: "Moreno Torricelli", position: "DF", number: 2, nationality: "Italy", clubs: "Juventus", funFact: { en: "Right-back who started the 1996 Champions League final.", pt: "Lateral-direito titular na final da Champions League de 1996.", es: "Lateral derecho titular en la final de la Champions League de 1996." } },
      { name: "Didier Deschamps", position: "MF", number: 6, nationality: "France", clubs: "Marseille, Juventus, Chelsea", funFact: { en: "Later coached France to World Cup glory in 2018.", pt: "Mais tarde treinou a França até o título da Copa do Mundo de 2018.", es: "Más tarde dirigió a Francia hasta el título del Mundial de 2018." } },
      { name: "Paulo Sousa", position: "MF", number: 6, nationality: "Portugal", clubs: "Benfica, Juventus, Inter Milan", funFact: { en: "Later managed the Poland national team.", pt: "Mais tarde treinou a seleção da Polônia.", es: "Más tarde dirigió a la selección de Polonia." } },
      { name: "Antonio Conte", position: "MF", number: 8, nationality: "Italy", clubs: "Juventus (mostly)", funFact: { en: "Later became a successful manager at several top European clubs.", pt: "Mais tarde se tornou um técnico de sucesso em vários grandes clubes europeus.", es: "Más tarde se convirtió en un entrenador exitoso en varios grandes clubes europeos." } },
      { name: "Gianluca Vialli", position: "FW", number: 9, nationality: "Italy", clubs: "Sampdoria, Juventus, Chelsea", funFact: { en: "Veteran striker who started alongside Del Piero and Ravanelli in the 1996 final.", pt: "Atacante veterano, titular ao lado de Del Piero e Ravanelli na final de 1996.", es: "Delantero veterano, titular junto a Del Piero y Ravanelli en la final de 1996." } },
      { name: "Alessandro Del Piero", position: "FW", number: 10, nationality: "Italy", clubs: "Juventus (mostly)", funFact: { en: "Is Juventus's all-time record goalscorer.", pt: "É o maior artilheiro da história da Juventus.", es: "Es el máximo goleador histórico de la Juventus." } },
      { name: "Fabrizio Ravanelli", position: "FW", number: 9, nationality: "Italy", clubs: "Juventus, Middlesbrough", funFact: { en: "Scored in the 1996 Champions League final.", pt: "Marcou na final da Champions League de 1996.", es: "Marcó en la final de la Champions League de 1996." } },
    ],
  },
  {
    team: "FC Barcelona",
    year: 2009,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Victor Valdes", position: "GK", number: 1, nationality: "Spain", clubs: "Barcelona, Standard Liege, Middlesbrough", funFact: { en: "Was Barcelona's goalkeeper throughout the historic treble season.", pt: "Foi o goleiro do Barcelona durante toda a histórica temporada da tríplice coroa.", es: "Fue el portero del Barcelona durante toda la histórica temporada del triplete." } },
            { name: "Sylvinho", position: "DF", number: 12, nationality: "Brazil", clubs: "Corinthians, Arsenal, Barcelona", funFact: { en: "Brazilian left-back who later became a head coach.", pt: "Lateral-esquerdo brasileiro que mais tarde se tornou treinador.", es: "Lateral izquierdo brasileño que más tarde se convirtió en entrenador." } },
      { name: "Gerard Pique", position: "DF", number: 3, nationality: "Spain", clubs: "Manchester United, Zaragoza, Barcelona", funFact: { en: "Returned to Barcelona from Manchester United to win the treble.", pt: "Voltou ao Barcelona vindo do Manchester United para vencer a tríplice coroa.", es: "Regresó al Barcelona desde el Manchester United para ganar el triplete." } },
      { name: "Yaya Toure", position: "DF", number: 24, nationality: "Ivory Coast", clubs: "Barcelona, Manchester City", funFact: { en: "Played as an auxiliary centre-back in the 2009 final, with Puyol shifting to right-back.", pt: "Atuou improvisado na zaga na final de 2009, com Puyol deslocado para a lateral-direita.", es: "Jugó improvisado en la zaga en la final de 2009, con Puyol desplazado al lateral derecho." } },
      { name: "Carles Puyol", position: "DF", number: 5, nationality: "Spain", clubs: "Barcelona", funFact: { en: "Won the World Cup with Spain in 2010.", pt: "Venceu a Copa do Mundo com a Espanha em 2010.", es: "Ganó el Mundial con España en 2010." } },
{ name: "Sergio Busquets", position: "MF", number: 16, nationality: "Spain", clubs: "Barcelona, Inter Miami", funFact: { en: "Broke into the first team the same season as the treble.", pt: "Chegou ao time principal na mesma temporada da tríplice coroa.", es: "Llegó al primer equipo en la misma temporada del triplete." } },
      { name: "Xavi Hernandez", position: "MF", number: 6, nationality: "Spain", clubs: "Barcelona, Al Sadd", shortName: "Xavi", funFact: { en: "Was the orchestrator of Barcelona's possession-based style under Guardiola.", pt: "Foi o maestro do estilo de posse de bola do Barcelona sob o comando de Guardiola.", es: "Fue el orquestador del estilo de posesión del Barcelona bajo Guardiola." } },
      { name: "Andres Iniesta", position: "MF", number: 8, nationality: "Spain", clubs: "Barcelona, Vissel Kobe", funFact: { en: "Key playmaker throughout the historic 2009 treble season.", pt: "Armador fundamental durante toda a histórica temporada da tríplice coroa de 2009.", es: "Armador clave durante toda la histórica temporada del triplete de 2009." } },
      { name: "Lionel Messi", position: "FW", number: 10, nationality: "Argentina", clubs: "Barcelona, PSG, Inter Miami", funFact: { en: "Scored a header in the 2009 Champions League final.", pt: "Marcou de cabeça na final da Champions League de 2009.", es: "Marcó de cabeza en la final de la Champions League de 2009." } },
      { name: "Samuel Eto'o", position: "FW", number: 9, nationality: "Cameroon", clubs: "Barcelona, Inter Milan, Chelsea", funFact: { en: "Opened the scoring in the 2009 Champions League final.", pt: "Abriu o placar na final da Champions League de 2009.", es: "Abrió el marcador en la final de la Champions League de 2009." } },
      { name: "Thierry Henry", position: "FW", number: 14, nationality: "France", clubs: "Monaco, Juventus, Arsenal, Barcelona", funFact: { en: "Joined Barcelona from Arsenal and won the treble in his first season.", pt: "Chegou ao Barcelona vindo do Arsenal e venceu a tríplice coroa na primeira temporada.", es: "Llegó al Barcelona desde el Arsenal y ganó el triplete en su primera temporada." } },
    ],
  },
  {
    team: "Manchester City",
    year: 2023,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Ederson", position: "GK", number: 31, nationality: "Brazil", clubs: "Benfica, Manchester City", funFact: { en: "Brazilian goalkeeper known for his distribution with the ball at his feet.", pt: "Goleiro brasileiro conhecido pela qualidade na saída de bola com os pés.", es: "Portero brasileño conocido por su calidad en la salida de balón con los pies." } },
      { name: "Nathan Ake", position: "DF", number: 6, nationality: "Netherlands", clubs: "Chelsea, Bournemouth, Manchester City", funFact: { en: "Versatile Dutch defender who can play across the back line.", pt: "Zagueiro holandês versátil, capaz de jogar em várias posições da defesa.", es: "Defensor neerlandés versátil, capaz de jugar en varias posiciones de la defensa." } },
      { name: "Ruben Dias", position: "DF", number: 3, nationality: "Portugal", clubs: "Benfica, Manchester City", funFact: { en: "Portuguese centre-back who became a defensive leader at City.", pt: "Zagueiro português que se tornou líder defensivo no City.", es: "Defensor central portugués que se convirtió en líder defensivo del City." } },
      { name: "Manuel Akanji", position: "DF", number: 25, nationality: "Switzerland", clubs: "Borussia Dortmund, Manchester City", funFact: { en: "Swiss defender who joined City midway through the treble season.", pt: "Zagueiro suíço que chegou ao City no meio da temporada da tríplice coroa.", es: "Defensor suizo que llegó al City a mitad de la temporada del triplete." } },
      { name: "Kyle Walker", position: "DF", number: 2, nationality: "England", clubs: "Tottenham, Manchester City", funFact: { en: "Known for his exceptional recovery speed as a full-back.", pt: "Conhecido pela velocidade excepcional de recuperação como lateral.", es: "Conocido por su velocidad excepcional de recuperación como lateral." } },
      { name: "Rodri", position: "MF", number: 16, nationality: "Spain", clubs: "Atletico Madrid, Manchester City", funFact: { en: "Scored the winning goal in the 2023 Champions League final.", pt: "Marcou o gol da vitória na final da Champions League de 2023.", es: "Marcó el gol de la victoria en la final de la Champions League de 2023." } },
      { name: "Bernardo Silva", position: "MF", number: 20, nationality: "Portugal", clubs: "Benfica, Monaco, Manchester City", funFact: { en: "Versatile Portuguese midfielder who can play across the front line.", pt: "Meio-campista português versátil, capaz de jogar em toda a linha ofensiva.", es: "Centrocampista portugués versátil, capaz de jugar en toda la línea ofensiva." } },
      { name: "Kevin De Bruyne", position: "MF", number: 17, nationality: "Belgium", clubs: "Chelsea, Wolfsburg, Manchester City", funFact: { en: "Was forced off injured early in the 2023 Champions League final.", pt: "Precisou sair machucado ainda no início da final da Champions League de 2023.", es: "Tuvo que salir lesionado al inicio de la final de la Champions League de 2023." } },
      { name: "Ilkay Gundogan", position: "MF", number: 8, nationality: "Germany", clubs: "Borussia Dortmund, Manchester City", funFact: { en: "Won the Bundesliga twice with Borussia Dortmund.", pt: "Venceu a Bundesliga duas vezes com o Borussia Dortmund.", es: "Ganó la Bundesliga dos veces con el Borussia Dortmund." } },
      { name: "Erling Haaland", position: "FW", number: 9, nationality: "Norway", clubs: "Molde, Salzburg, Borussia Dortmund, Manchester City", funFact: { en: "Broke the Premier League single-season goals record in 2022-23.", pt: "Bateu o recorde de gols em uma única temporada da Premier League em 2022-23.", es: "Batió el récord de goles en una sola temporada de la Premier League en 2022-23." } },
      { name: "Julian Alvarez", position: "FW", number: 19, nationality: "Argentina", clubs: "River Plate, Manchester City", funFact: { en: "Argentine forward who won the World Cup months before the treble.", pt: "Atacante argentino que venceu a Copa do Mundo meses antes da tríplice coroa.", es: "Delantero argentino que ganó el Mundial meses antes del triplete." } },
    ],
  },
  {
    team: "Paris Saint-Germain",
    year: 2025,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Gianluigi Donnarumma", position: "GK", number: 1, nationality: "Italy", clubs: "AC Milan, PSG", funFact: { en: "Became one of the world's top goalkeepers at a young age with AC Milan.", pt: "Se tornou um dos melhores goleiros do mundo ainda jovem, no AC Milan.", es: "Se convirtió en uno de los mejores porteros del mundo siendo joven, en el AC Milan." } },
      { name: "Nuno Mendes", position: "DF", number: 25, nationality: "Portugal", clubs: "Sporting CP, PSG", funFact: { en: "Portuguese left-back known for his attacking runs down the flank.", pt: "Lateral-esquerdo português conhecido pelas subidas ofensivas pela ponta.", es: "Lateral izquierdo portugués conocido por sus subidas ofensivas por la banda." } },
      { name: "Marquinhos", position: "DF", number: 5, nationality: "Brazil", clubs: "Corinthians, AS Roma, PSG", funFact: { en: "Long-serving Brazilian captain of Paris Saint-Germain.", pt: "Capitão brasileiro de longa data do Paris Saint-Germain.", es: "Capitán brasileño de larga trayectoria en el Paris Saint-Germain." } },
      { name: "Willian Pacho", position: "DF", number: 3, nationality: "Ecuador", clubs: "Independiente del Valle, Eintracht Frankfurt, PSG", funFact: { en: "Ecuadorian centre-back who quickly became a key defender at PSG.", pt: "Zagueiro equatoriano que rapidamente se tornou peça-chave na defesa do PSG.", es: "Defensor ecuatoriano que rápidamente se convirtió en pieza clave en la defensa del PSG." } },
      { name: "Achraf Hakimi", position: "DF", number: 2, nationality: "Morocco", clubs: "Real Madrid, Borussia Dortmund, Inter Milan, PSG", funFact: { en: "Explosive attacking full-back who joined PSG from Inter Milan.", pt: "Lateral ofensivo e explosivo que chegou ao PSG vindo da Inter de Milão.", es: "Lateral ofensivo y explosivo que llegó al PSG desde el Inter de Milán." } },
      { name: "Vitinha", position: "MF", number: 17, nationality: "Portugal", clubs: "Porto, PSG", funFact: { en: "Portuguese midfielder known for his composure in possession.", pt: "Meio-campista português conhecido pela categoria na posse de bola.", es: "Centrocampista portugués conocido por su categoría en la posesión de balón." } },
      { name: "Fabian Ruiz", position: "MF", number: 8, nationality: "Spain", clubs: "Real Betis, Napoli, PSG", funFact: { en: "Spanish midfielder who won the World Cup and European Championship.", pt: "Meio-campista espanhol que venceu a Copa do Mundo e a Eurocopa.", es: "Centrocampista español que ganó el Mundial y la Eurocopa." } },
      { name: "Warren Zaire-Emery", position: "MF", number: 33, nationality: "France", clubs: "PSG (only)", funFact: { en: "Became one of PSG's youngest ever first-team regulars.", pt: "Se tornou um dos jogadores mais jovens a ser titular no time principal do PSG.", es: "Se convirtió en uno de los jugadores más jóvenes en ser titular en el primer equipo del PSG." } },
      { name: "Ousmane Dembele", position: "FW", number: 10, nationality: "France", clubs: "Rennes, Borussia Dortmund, Barcelona, PSG", funFact: { en: "French forward who came through Rennes and Borussia Dortmund before PSG.", pt: "Atacante francês que passou por Rennes e Borussia Dortmund antes do PSG.", es: "Delantero francés que pasó por el Rennes y el Borussia Dortmund antes del PSG." } },
      { name: "Bradley Barcola", position: "FW", number: 29, nationality: "France", clubs: "Lyon, PSG", funFact: { en: "Fast French winger developed in Lyon's academy.", pt: "Ponta francês veloz, revelado nas categorias de base do Lyon.", es: "Extremo francés veloz, formado en la cantera del Lyon." } },
      { name: "Khvicha Kvaratskhelia", position: "FW", number: 7, nationality: "Georgia", clubs: "Dinamo Batumi, Napoli, PSG", funFact: { en: "Georgian winger known for his dribbling, nicknamed 'Kvaradona'.", pt: "Ponta georgiano conhecido pelo drible, apelidado de 'Kvaradona'.", es: "Extremo georgiano conocido por su regate, apodado 'Kvaradona'." } },
    ],
  },
  {
    team: "Real Madrid",
    year: 2014,
    matchLabel: { en: "UEFA Champions League Final (La Décima)", pt: "Final da Champions League (La Décima)", es: "Final de la Champions League (La Décima)" },
    players: [
      { name: "Iker Casillas", position: "GK", number: 1, nationality: "Spain", clubs: "Real Madrid, Porto", funFact: { en: "Captained Spain to World Cup glory in 2010.", pt: "Foi capitão da Espanha na conquista da Copa do Mundo de 2010.", es: "Fue capitán de España en la conquista del Mundial de 2010." } },
      { name: "Dani Carvajal", position: "DF", number: 2, nationality: "Spain", clubs: "Bayer Leverkusen, Real Madrid", funFact: { en: "Came through Real Madrid's academy after a loan spell in Germany.", pt: "Passou pela base do Real Madrid antes de um empréstimo na Alemanha.", es: "Pasó por la cantera del Real Madrid antes de una cesión en Alemania." } },
      { name: "Sergio Ramos", position: "DF", number: 4, nationality: "Spain", clubs: "Sevilla, Real Madrid, PSG", funFact: { en: "Later became president of Sevilla after retiring.", pt: "Mais tarde se tornou presidente do Sevilla após se aposentar.", es: "Más tarde se convirtió en presidente del Sevilla tras retirarse." } },
      { name: "Pepe", position: "DF", number: 3, nationality: "Portugal", clubs: "Porto, Real Madrid", funFact: { en: "Represented Portugal at four different European Championships.", pt: "Defendeu Portugal em quatro Eurocopas diferentes.", es: "Representó a Portugal en cuatro Eurocopas distintas." } },
      { name: "Fabio Coentrao", position: "DF", number: 17, nationality: "Portugal", clubs: "Benfica, Real Madrid", funFact: { en: "Was one of the most expensive full-backs in the world when he signed.", pt: "Foi um dos laterais mais caros do mundo quando foi contratado.", es: "Fue uno de los laterales más caros del mundo cuando fue fichado." } },
      { name: "Xabi Alonso", position: "MF", number: 14, nationality: "Spain", clubs: "Real Sociedad, Liverpool, Real Madrid, Bayern Munich", funFact: { en: "Later became a head coach at Bayer Leverkusen.", pt: "Mais tarde, se tornou técnico principal do Bayer Leverkusen.", es: "Más tarde se convirtió en entrenador principal del Bayer Leverkusen." } },
      { name: "Angel Di Maria", position: "MF", number: 22, nationality: "Argentina", clubs: "Benfica, Real Madrid, Manchester United, PSG", funFact: { en: "Scored the winning goal in Argentina's 2022 World Cup final.", pt: "Marcou o gol da vitória na final da Copa do Mundo de 2022 pela Argentina.", es: "Marcó el gol de la victoria en la final del Mundial de 2022 con Argentina." } },
      { name: "Luka Modric", position: "MF", number: 19, nationality: "Croatia", clubs: "Dinamo Zagreb, Tottenham, Real Madrid", funFact: { en: "Won the Ballon d'Or in 2018.", pt: "Venceu a Bola de Ouro em 2018.", es: "Ganó el Balón de Oro en 2018." } },
      { name: "Cristiano Ronaldo", position: "FW", number: 7, nationality: "Portugal", clubs: "Sporting CP, Manchester United, Real Madrid, Juventus, Al-Nassr", funFact: { en: "Is the all-time top scorer in Champions League history.", pt: "É o maior artilheiro da história da Champions League.", es: "Es el máximo goleador histórico de la Champions League." } },
      { name: "Karim Benzema", position: "FW", number: 9, nationality: "France", clubs: "Lyon, Real Madrid, Al-Ittihad", funFact: { en: "Won the Ballon d'Or in 2022.", pt: "Venceu a Bola de Ouro em 2022.", es: "Ganó el Balón de Oro en 2022." } },
      { name: "Gareth Bale", position: "FW", number: 11, nationality: "Wales", clubs: "Southampton, Tottenham, Real Madrid", funFact: { en: "Scored an iconic overhead kick in the 2018 Champions League final.", pt: "Marcou um gol de bicicleta icônico na final da Champions League de 2018.", es: "Marcó un icónico gol de chilena en la final de la Champions League de 2018." } },
    ],
  },
  {
    team: "Atletico Madrid",
    year: 2014,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Thibaut Courtois", position: "GK", number: 13, nationality: "Belgium", clubs: "Genk, Chelsea, Atletico Madrid, Real Madrid", funFact: { en: "Won the World Cup's Golden Glove award in 2018.", pt: "Venceu a Luva de Ouro da Copa do Mundo de 2018.", es: "Ganó el Guante de Oro del Mundial de 2018." } },
      { name: "Juanfran", position: "DF", number: 20, nationality: "Spain", clubs: "Atletico Madrid (mostly)", funFact: { en: "Spent almost his entire career at Atletico Madrid.", pt: "Passou quase toda a carreira no Atlético de Madrid.", es: "Pasó casi toda su carrera en el Atlético de Madrid." } },
      { name: "Diego Godin", position: "DF", number: 2, nationality: "Uruguay", clubs: "Nacional, Villarreal, Atletico Madrid, Inter Milan", funFact: { en: "Captained Uruguay at three World Cups.", pt: "Foi capitão do Uruguai em três Copas do Mundo.", es: "Fue capitán de Uruguay en tres Mundiales." } },
      { name: "Miranda", position: "DF", number: 3, nationality: "Brazil", clubs: "Sao Paulo, Atletico Madrid, Inter Milan", funFact: { en: "Later won Serie A with Inter Milan.", pt: "Mais tarde venceu o Serie A com a Inter de Milão.", es: "Más tarde ganó la Serie A con el Inter de Milán." } },
      { name: "Filipe Luis", position: "DF", number: 23, nationality: "Brazil", clubs: "Atletico Madrid, Chelsea", funFact: { en: "Later returned to Atletico Madrid as head coach.", pt: "Mais tarde retornou ao Atlético de Madrid como técnico.", es: "Más tarde volvió al Atlético de Madrid como entrenador." } },
      { name: "Gabi", position: "MF", number: 14, nationality: "Spain", clubs: "Real Madrid, Atletico Madrid", funFact: { en: "Captained Atletico Madrid for nearly a decade.", pt: "Foi capitão do Atlético de Madrid por quase uma década.", es: "Fue capitán del Atlético de Madrid durante casi una década." } },
      { name: "Tiago", position: "MF", number: 5, nationality: "Portugal", clubs: "Benfica, Porto, Juventus, Atletico Madrid", funFact: { en: "Won the UEFA Cup with Porto in 2003.", pt: "Venceu a Copa da UEFA pelo Porto em 2003.", es: "Ganó la Copa de la UEFA con el Porto en 2003." } },
      { name: "Koke", position: "MF", number: 6, nationality: "Spain", clubs: "Atletico Madrid (only)", funFact: { en: "Became Atletico Madrid's club captain.", pt: "Se tornou capitão do Atlético de Madrid.", es: "Se convirtió en capitán del Atlético de Madrid." } },
      { name: "Arda Turan", position: "MF", number: 7, nationality: "Turkey", clubs: "Galatasaray, Atletico Madrid, Barcelona", funFact: { en: "Was the first Turkish player to play for Barcelona.", pt: "Foi o primeiro jogador turco a atuar pelo Barcelona.", es: "Fue el primer jugador turco en jugar en el Barcelona." } },
      { name: "Raul Garcia", position: "FW", number: 17, nationality: "Spain", clubs: "Athletic Bilbao, Atletico Madrid", funFact: { en: "Became Athletic Bilbao's captain after returning to the club.", pt: "Se tornou capitão do Athletic Bilbao após retornar ao clube.", es: "Se convirtió en capitán del Athletic Bilbao tras volver al club." } },
      { name: "Diego Costa", position: "FW", number: 19, nationality: "Spain", clubs: "Atletico Madrid, Chelsea", funFact: { en: "Played for Brazil's youth teams before choosing to represent Spain.", pt: "Defendeu as categorias de base do Brasil antes de optar pela Espanha.", es: "Jugó en las categorías juveniles de Brasil antes de optar por España." } },
    ],
  },
  {
    team: "Liverpool",
    year: 2019,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Alisson Becker", position: "GK", number: 1, nationality: "Brazil", clubs: "Internacional, Roma, Liverpool", funFact: { en: "Won the Best FIFA Goalkeeper award in 2019.", pt: "Venceu o prêmio de Melhor Goleiro da FIFA em 2019.", es: "Ganó el premio al Mejor Portero de la FIFA en 2019." } },
      { name: "Trent Alexander-Arnold", position: "DF", number: 66, nationality: "England", clubs: "Liverpool, Real Madrid", funFact: { en: "Came through Liverpool's own academy.", pt: "Foi revelado nas categorias de base do Liverpool.", es: "Se formó en la cantera del Liverpool." } },
      { name: "Virgil van Dijk", position: "DF", number: 4, nationality: "Netherlands", clubs: "Groningen, Celtic, Southampton, Liverpool", funFact: { en: "Was runner-up for the 2019 Ballon d'Or.", pt: "Foi vice-campeão da Bola de Ouro de 2019.", es: "Fue subcampeón del Balón de Oro de 2019." } },
      { name: "Joel Matip", position: "DF", number: 32, nationality: "Cameroon", clubs: "Schalke, Liverpool", funFact: { en: "Chose to represent Cameroon over Germany internationally.", pt: "Optou por defender os Camarões em vez da Alemanha.", es: "Optó por representar a Camerún en lugar de Alemania." } },
      { name: "Andrew Robertson", position: "DF", number: 26, nationality: "Scotland", clubs: "Dundee United, Hull City, Liverpool", funFact: { en: "Captained Scotland's national team.", pt: "Foi capitão da seleção da Escócia.", es: "Fue capitán de la selección de Escocia." } },
      { name: "Fabinho", position: "MF", number: 3, nationality: "Brazil", clubs: "Real Madrid, Monaco, Liverpool, Al-Ittihad", funFact: { en: "Started his career at Real Madrid before being loaned out repeatedly.", pt: "Começou a carreira no Real Madrid antes de ser emprestado várias vezes.", es: "Empezó su carrera en el Real Madrid antes de salir cedido varias veces." } },
      { name: "Georginio Wijnaldum", position: "MF", number: 5, nationality: "Netherlands", clubs: "Feyenoord, PSV, Newcastle, Liverpool", funFact: { en: "Scored a hat-trick to complete a historic comeback against Barcelona.", pt: "Marcou um hat-trick na virada histórica contra o Barcelona.", es: "Marcó un hat-trick en la histórica remontada ante el Barcelona." } },
      { name: "Jordan Henderson", position: "MF", number: 14, nationality: "England", clubs: "Sunderland, Liverpool, Al-Ettifaq", funFact: { en: "Later captained Liverpool to a first league title in 30 years.", pt: "Mais tarde foi capitão do Liverpool na conquista do primeiro título nacional em 30 anos.", es: "Más tarde fue capitán del Liverpool en la conquista del primer título de liga en 30 años." } },
      { name: "Mohamed Salah", position: "FW", number: 11, nationality: "Egypt", clubs: "Basel, Chelsea, Roma, Liverpool", funFact: { en: "Won the Premier League Golden Boot multiple times.", pt: "Venceu a artilharia da Premier League diversas vezes.", es: "Ganó el trofeo de máximo goleador de la Premier League varias veces." } },
      { name: "Roberto Firmino", position: "FW", number: 9, nationality: "Brazil", clubs: "Figueirense, Hoffenheim, Liverpool, Al-Ahli", funFact: { en: "Known for his relentless pressing work rate as a false nine.", pt: "Conhecido pela marcação incansável atuando de falso 9.", es: "Conocido por su presión incansable jugando de falso 9." } },
      { name: "Sadio Mane", position: "FW", number: 10, nationality: "Senegal", clubs: "Metz, Salzburg, Southampton, Liverpool, Bayern Munich, Al-Nassr", funFact: { en: "Was runner-up at the Africa Cup of Nations with Senegal in 2019.", pt: "Foi vice-campeão da Copa Africana de Nações pelo Senegal em 2019.", es: "Fue subcampeón de la Copa Africana de Naciones con Senegal en 2019." } },
    ],
  },
  {
    team: "Tottenham",
    year: 2019,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Hugo Lloris", position: "GK", number: 1, nationality: "France", clubs: "Nice, Lyon, Tottenham", funFact: { en: "Captained France to World Cup glory in 2018.", pt: "Foi capitão da França na conquista da Copa do Mundo de 2018.", es: "Fue capitán de Francia en la conquista del Mundial de 2018." } },
      { name: "Kieran Trippier", position: "DF", number: 2, nationality: "England", clubs: "Manchester City, Burnley, Tottenham, Atletico Madrid", funFact: { en: "Scored a famous free kick against Croatia at the 2018 World Cup.", pt: "Marcou uma falta famosa contra a Croácia na Copa do Mundo de 2018.", es: "Marcó un famoso tiro libre ante Croacia en el Mundial de 2018." } },
      { name: "Toby Alderweireld", position: "DF", number: 4, nationality: "Belgium", clubs: "Ajax, Atletico Madrid, Southampton, Tottenham", funFact: { en: "Was part of Belgium's 'golden generation' at the 2018 World Cup.", pt: "Fez parte da 'geração de ouro' belga na Copa do Mundo de 2018.", es: "Formó parte de la 'generación dorada' belga en el Mundial de 2018." } },
      { name: "Jan Vertonghen", position: "DF", number: 5, nationality: "Belgium", clubs: "Ajax, Tottenham, Benfica", funFact: { en: "Played over 300 matches for Tottenham.", pt: "Disputou mais de 300 partidas pelo Tottenham.", es: "Disputó más de 300 partidos con el Tottenham." } },
      { name: "Danny Rose", position: "DF", number: 3, nationality: "England", clubs: "Leeds United, Tottenham", funFact: { en: "Came through Leeds United's academy before moving to Tottenham.", pt: "Foi revelado na base do Leeds United antes de ir ao Tottenham.", es: "Se formó en la cantera del Leeds United antes de fichar por el Tottenham." } },
      { name: "Moussa Sissoko", position: "MF", number: 17, nationality: "France", clubs: "Toulouse, Newcastle, Tottenham", funFact: { en: "Reached the 2016 European Championship final with France.", pt: "Chegou à final da Eurocopa de 2016 pela França.", es: "Llegó a la final de la Eurocopa de 2016 con Francia." } },
      { name: "Harry Winks", position: "MF", number: 8, nationality: "England", clubs: "Tottenham (only)", funFact: { en: "Came through Tottenham's own youth academy.", pt: "Foi revelado nas categorias de base do próprio Tottenham.", es: "Se formó en la propia cantera del Tottenham." } },
      { name: "Christian Eriksen", position: "MF", number: 23, nationality: "Denmark", clubs: "Ajax, Tottenham, Inter Milan, Manchester United", funFact: { en: "Suffered a cardiac arrest on the pitch in 2021 before making a remarkable return.", pt: "Sofreu uma parada cardíaca em campo em 2021 antes de fazer um retorno notável.", es: "Sufrió un paro cardíaco en el campo en 2021 antes de hacer un regreso notable." } },
      { name: "Son Heung-min", position: "FW", number: 7, nationality: "South Korea", clubs: "Hamburg, Bayer Leverkusen, Tottenham", funFact: { en: "Became the first Asian player to win the Premier League Golden Boot.", pt: "Se tornou o primeiro jogador asiático a vencer a artilharia da Premier League.", es: "Se convirtió en el primer jugador asiático en ganar el trofeo de máximo goleador de la Premier League." } },
      { name: "Dele Alli", position: "FW", number: 20, nationality: "England", clubs: "MK Dons, Tottenham, Everton", funFact: { en: "Won the PFA Young Player of the Year award twice.", pt: "Venceu o prêmio de Jovem Jogador do Ano da PFA duas vezes.", es: "Ganó el premio al Joven Jugador del Año de la PFA dos veces." } },
      { name: "Harry Kane", position: "FW", number: 10, nationality: "England", clubs: "Tottenham, Bayern Munich", funFact: { en: "Is Tottenham's all-time record goalscorer.", pt: "É o maior artilheiro da história do Tottenham.", es: "Es el máximo goleador histórico del Tottenham." } },
    ],
  },
  {
    team: "Bayern Munich",
    year: 2010,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Hans-Jorg Butt", position: "GK", number: 22, nationality: "Germany", clubs: "Hamburg, Bayer Leverkusen, Bayern Munich", funFact: { en: "Was known for scoring goals as a penalty-taking goalkeeper.", pt: "Era conhecido por marcar gols cobrando pênaltis mesmo sendo goleiro.", es: "Era conocido por marcar goles cobrando penales pese a ser portero." } },
      { name: "Philipp Lahm", position: "DF", number: 21, nationality: "Germany", clubs: "Bayern Munich (only)", funFact: { en: "Captained Germany to World Cup glory in 2014.", pt: "Foi capitão da Alemanha na conquista da Copa do Mundo de 2014.", es: "Fue capitán de Alemania en la conquista del Mundial de 2014." } },
      { name: "Martin Demichelis", position: "DF", number: 4, nationality: "Argentina", clubs: "River Plate, Bayern Munich, Malaga, Manchester City", funFact: { en: "Later won the Premier League with Manchester City.", pt: "Mais tarde venceu a Premier League com o Manchester City.", es: "Más tarde ganó la Premier League con el Manchester City." } },
      { name: "Daniel van Buyten", position: "DF", number: 28, nationality: "Belgium", clubs: "Standard Liege, Marseille, Hamburg, Bayern Munich", funFact: { en: "Started his career at Standard Liege in Belgium.", pt: "Começou a carreira no Standard Liege, na Bélgica.", es: "Empezó su carrera en el Standard Lieja, en Bélgica." } },
      { name: "Holger Badstuber", position: "DF", number: 26, nationality: "Germany", clubs: "Bayern Munich, Stuttgart", funFact: { en: "Came through Bayern Munich's own academy.", pt: "Foi revelado nas categorias de base do próprio Bayern de Munique.", es: "Se formó en la propia cantera del Bayern de Múnich." } },
      { name: "Mark van Bommel", position: "MF", number: 17, nationality: "Netherlands", clubs: "Fortuna Sittard, PSV, Barcelona, Bayern Munich, AC Milan", funFact: { en: "Later became a head coach at PSV Eindhoven.", pt: "Mais tarde se tornou técnico principal do PSV Eindhoven.", es: "Más tarde se convirtió en entrenador principal del PSV Eindhoven." } },
      { name: "Bastian Schweinsteiger", position: "MF", number: 31, nationality: "Germany", clubs: "Bayern Munich, Manchester United", funFact: { en: "Won the World Cup with Germany in 2014.", pt: "Venceu a Copa do Mundo com a Alemanha em 2014.", es: "Ganó el Mundial con Alemania en 2014." } },
      { name: "Arjen Robben", position: "FW", number: 10, nationality: "Netherlands", clubs: "Groningen, PSV, Chelsea, Real Madrid, Bayern Munich", funFact: { en: "Scored the winning goal in the 2013 Champions League final.", pt: "Marcou o gol da vitória na final da Champions League de 2013.", es: "Marcó el gol de la victoria en la final de la Champions League de 2013." } },
      { name: "Thomas Muller", position: "FW", number: 25, nationality: "Germany", clubs: "Bayern Munich (only)", funFact: { en: "Won the Golden Boot at the 2010 World Cup.", pt: "Venceu a Chuteira de Ouro na Copa do Mundo de 2010.", es: "Ganó la Bota de Oro en el Mundial de 2010." } },
      { name: "Franck Ribery", position: "FW", number: 7, nationality: "France", clubs: "Boulogne, Galatasaray, Marseille, Bayern Munich", funFact: { en: "Was runner-up for the Ballon d'Or in 2013.", pt: "Foi vice-campeão da Bola de Ouro em 2013.", es: "Fue subcampeón del Balón de Oro en 2013." } },
      { name: "Ivica Olic", position: "FW", number: 11, nationality: "Croatia", clubs: "Hajduk Split, CSKA Moscow, Hamburg, Bayern Munich", funFact: { en: "Represented Croatia at three major tournaments.", pt: "Defendeu a Croácia em três grandes torneios.", es: "Representó a Croacia en tres grandes torneos." } },
    ],
  },
  {
    team: "Manchester United",
    year: 2011,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Edwin van der Sar", position: "GK", number: 1, nationality: "Netherlands", clubs: "Ajax, Juventus, Fulham, Manchester United", funFact: { en: "Retired as the Premier League's all-time clean sheet leader at the time.", pt: "Se aposentou como o líder histórico de jogos sem sofrer gols na Premier League.", es: "Se retiró como el líder histórico de partidos sin recibir goles en la Premier League." } },
      { name: "Fabio", position: "DF", number: 20, nationality: "Brazil", clubs: "Manchester United, Cardiff City", funFact: { en: "Twin brother of fellow Manchester United player Rafael.", pt: "Irmão gêmeo de Rafael, também jogador do Manchester United.", es: "Hermano gemelo de Rafael, también jugador del Manchester United." } },
      { name: "Rio Ferdinand", position: "DF", number: 5, nationality: "England", clubs: "West Ham, Leeds United, Manchester United", funFact: { en: "Won six Premier League titles with Manchester United.", pt: "Venceu seis títulos da Premier League pelo Manchester United.", es: "Ganó seis títulos de la Premier League con el Manchester United." } },
      { name: "Nemanja Vidic", position: "DF", number: 15, nationality: "Serbia", clubs: "Red Star Belgrade, Spartak Moscow, Manchester United", funFact: { en: "Captained Serbia's national team.", pt: "Foi capitão da seleção da Sérvia.", es: "Fue capitán de la selección de Serbia." } },
      { name: "Patrice Evra", position: "DF", number: 3, nationality: "France", clubs: "Monaco, Manchester United, Juventus", funFact: { en: "Won the Champions League with Manchester United in 2008.", pt: "Venceu a Champions League pelo Manchester United em 2008.", es: "Ganó la Champions League con el Manchester United en 2008." } },
      { name: "Michael Carrick", position: "MF", number: 16, nationality: "England", clubs: "West Ham, Tottenham, Manchester United", funFact: { en: "Later became Manchester United's assistant coach and interim manager.", pt: "Mais tarde se tornou auxiliar técnico e treinador interino do Manchester United.", es: "Más tarde se convirtió en asistente técnico y entrenador interino del Manchester United." } },
      { name: "Ryan Giggs", position: "MF", number: 11, nationality: "Wales", clubs: "Manchester United (only)", funFact: { en: "Holds the record for most Premier League appearances at one club.", pt: "Detém o recorde de mais jogos na Premier League por um único clube.", es: "Posee el récord de más partidos en la Premier League con un solo club." } },
      { name: "Park Ji-sung", position: "MF", number: 13, nationality: "South Korea", clubs: "PSV, Manchester United, Queens Park Rangers", funFact: { en: "Was one of the first Asian players to start a Champions League final.", pt: "Foi um dos primeiros jogadores asiáticos titulares em uma final de Champions League.", es: "Fue uno de los primeros jugadores asiáticos titulares en una final de Champions League." } },
      { name: "Antonio Valencia", position: "MF", number: 25, nationality: "Ecuador", clubs: "Villarreal, Wigan Athletic, Manchester United", funFact: { en: "Later became Manchester United's club captain.", pt: "Mais tarde se tornou capitão do Manchester United.", es: "Más tarde se convirtió en capitán del Manchester United." } },
      { name: "Wayne Rooney", position: "FW", number: 10, nationality: "England", clubs: "Everton, Manchester United", funFact: { en: "Won the PFA Young Player of the Year award twice.", pt: "Venceu o prêmio de Jovem Jogador do Ano da PFA duas vezes.", es: "Ganó el premio al Joven Jugador del Año de la PFA dos veces." } },
      { name: "Javier Hernandez", position: "FW", number: 14, nationality: "Mexico", clubs: "Guadalajara, Manchester United, Real Madrid", funFact: { en: "Nicknamed 'Chicharito', became Mexico's all-time leading World Cup scorer.", pt: "Apelidado de 'Chicharito', se tornou o maior artilheiro do México em Copas do Mundo.", es: "Apodado 'Chicharito', se convirtió en el máximo goleador histórico de México en Mundiales." } },
    ],
  },
  {
    team: "Bayern Munich",
    year: 2012,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Manuel Neuer", position: "GK", number: 1, nationality: "Germany", clubs: "Schalke, Bayern Munich", funFact: { en: "Pioneered the modern 'sweeper-keeper' playing style.", pt: "Foi pioneiro no estilo moderno de goleiro-líbero.", es: "Fue pionero en el estilo moderno de portero-líbero." } },
      { name: "Philipp Lahm", position: "DF", number: 21, nationality: "Germany", clubs: "Bayern Munich (only)", funFact: { en: "Was nicknamed 'The Magic Dwarf' by Pep Guardiola for his versatility.", pt: "Foi apelidado de 'O Anão Mágico' por Pep Guardiola pela versatilidade.", es: "Fue apodado 'El Enano Mágico' por Pep Guardiola por su versatilidad." } },
      { name: "Jerome Boateng", position: "DF", number: 17, nationality: "Germany", clubs: "Hamburg, Manchester City, Bayern Munich", funFact: { en: "His younger half-brother Kevin-Prince played for the Ghana national team.", pt: "Seu meio-irmão mais novo, Kevin-Prince, defendeu a seleção de Gana.", es: "Su medio hermano menor, Kevin-Prince, jugó para la selección de Ghana." } },
      { name: "Daniel van Buyten", position: "DF", number: 28, nationality: "Belgium", clubs: "Standard Liege, Marseille, Hamburg, Bayern Munich", funFact: { en: "Played over 100 matches for the Belgium national team.", pt: "Disputou mais de 100 partidas pela seleção da Bélgica.", es: "Disputó más de 100 partidos con la selección de Bélgica." } },
      { name: "David Alaba", position: "DF", number: 27, nationality: "Austria", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Became one of the youngest players to win the Bundesliga.", pt: "Se tornou um dos jogadores mais jovens a vencer a Bundesliga.", es: "Se convirtió en uno de los jugadores más jóvenes en ganar la Bundesliga." } },
      { name: "Bastian Schweinsteiger", position: "MF", number: 31, nationality: "Germany", clubs: "Bayern Munich, Manchester United", funFact: { en: "Later married tennis star Ana Ivanovic.", pt: "Mais tarde se casou com a tenista Ana Ivanovic.", es: "Más tarde se casó con la tenista Ana Ivanovic." } },
      { name: "Toni Kroos", position: "MF", number: 39, nationality: "Germany", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Won the World Cup with Germany in 2014.", pt: "Venceu a Copa do Mundo com a Alemanha em 2014.", es: "Ganó el Mundial con Alemania en 2014." } },
      { name: "Arjen Robben", position: "FW", number: 10, nationality: "Netherlands", clubs: "Groningen, PSV, Chelsea, Real Madrid, Bayern Munich", funFact: { en: "Was known for consistently cutting inside onto his favored left foot.", pt: "Era conhecido por sempre cortar para dentro em direção ao seu pé esquerdo favorito.", es: "Era conocido por siempre cortar hacia adentro hacia su pierna izquierda favorita." } },
      { name: "Thomas Muller", position: "FW", number: 25, nationality: "Germany", clubs: "Bayern Munich (only)", funFact: { en: "Invented his own position name: the 'Raumdeuter' (space investigator).", pt: "Inventou o próprio nome de posição: 'Raumdeuter' (intérprete de espaços).", es: "Inventó su propio nombre de posición: 'Raumdeuter' (intérprete de espacios)." } },
      { name: "Franck Ribery", position: "FW", number: 7, nationality: "France", clubs: "Boulogne, Galatasaray, Marseille, Bayern Munich", funFact: { en: "Has a distinctive facial scar from a childhood car accident.", pt: "Tem uma cicatriz marcante no rosto, resultado de um acidente de carro na infância.", es: "Tiene una cicatriz distintiva en el rostro por un accidente de auto en su infancia." } },
      { name: "Mario Gomez", position: "FW", number: 33, nationality: "Germany", clubs: "Stuttgart, Bayern Munich, Fiorentina, Wolfsburg", funFact: { en: "Was Bayern Munich's top scorer in the 2011-12 season.", pt: "Foi o artilheiro do Bayern de Munique na temporada 2011-12.", es: "Fue el máximo goleador del Bayern de Múnich en la temporada 2011-12." } },
    ],
  },
  {
    team: "Borussia Dortmund",
    year: 2013,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Roman Weidenfeller", position: "GK", number: 1, nationality: "Germany", clubs: "Kaiserslautern, Borussia Dortmund", funFact: { en: "Spent his entire senior career at Borussia Dortmund.", pt: "Passou toda a carreira profissional no Borussia Dortmund.", es: "Pasó toda su carrera profesional en el Borussia Dortmund." } },
      { name: "Lukasz Piszczek", position: "DF", number: 26, nationality: "Poland", clubs: "Zaglebie Lubin, Hertha BSC, Borussia Dortmund", funFact: { en: "Represented Poland at Euro 2012 on home soil.", pt: "Defendeu a Polônia na Eurocopa de 2012, disputada em casa.", es: "Representó a Polonia en la Eurocopa de 2012, disputada en casa." } },
      { name: "Mats Hummels", position: "DF", number: 15, nationality: "Germany", clubs: "Bayern Munich, Borussia Dortmund", funFact: { en: "Later spent three seasons playing for Bayern Munich.", pt: "Mais tarde passou três temporadas jogando pelo Bayern de Munique.", es: "Más tarde pasó tres temporadas jugando para el Bayern de Múnich." } },
      { name: "Neven Subotic", position: "DF", number: 4, nationality: "Serbia", clubs: "Mainz, Borussia Dortmund", funFact: { en: "Was born in Bosnia but chose to represent Serbia internationally.", pt: "Nasceu na Bósnia, mas escolheu representar a Sérvia na seleção.", es: "Nació en Bosnia, pero eligió representar a Serbia en la selección." } },
      { name: "Marcel Schmelzer", position: "DF", number: 29, nationality: "Germany", clubs: "Borussia Dortmund (only)", funFact: { en: "Spent his entire career at Borussia Dortmund.", pt: "Passou toda a carreira no Borussia Dortmund.", es: "Pasó toda su carrera en el Borussia Dortmund." } },
      { name: "Sven Bender", position: "MF", number: 6, nationality: "Germany", clubs: "Borussia Dortmund, Bayer Leverkusen", funFact: { en: "Has a twin brother, Lars, who also played professional football.", pt: "Tem um irmão gêmeo, Lars, que também foi jogador profissional.", es: "Tiene un hermano gemelo, Lars, que también fue futbolista profesional." } },
      { name: "Ilkay Gundogan", position: "MF", number: 8, nationality: "Germany", clubs: "Borussia Dortmund, Manchester City", funFact: { en: "Was born and raised in Gelsenkirchen, Germany.", pt: "Nasceu e cresceu em Gelsenkirchen, na Alemanha.", es: "Nació y creció en Gelsenkirchen, Alemania." } },
      { name: "Jakub Blaszczykowski", position: "MF", number: 16, nationality: "Poland", clubs: "Wisla Krakow, Borussia Dortmund, Fiorentina", funFact: { en: "Nicknamed 'Kuba', became Poland's national team captain.", pt: "Apelidado de 'Kuba', se tornou capitão da seleção da Polônia.", es: "Apodado 'Kuba', se convirtió en capitán de la selección de Polonia." } },
      { name: "Marco Reus", position: "MF", number: 11, nationality: "Germany", clubs: "Borussia Monchengladbach, Borussia Dortmund", funFact: { en: "Missed the 2014 World Cup due to injury just before the tournament.", pt: "Ficou fora da Copa do Mundo de 2014 por lesão pouco antes do torneio.", es: "Se perdió el Mundial de 2014 por lesión justo antes del torneo." } },
      { name: "Kevin Grosskreutz", position: "MF", number: 19, nationality: "Germany", clubs: "Rot Weiss Ahlen, Borussia Dortmund", funFact: { en: "Was a boyhood Borussia Dortmund fan before playing for the club.", pt: "Era torcedor do Borussia Dortmund desde criança antes de jogar pelo clube.", es: "Era hincha del Borussia Dortmund desde niño antes de jugar en el club." } },
      { name: "Robert Lewandowski", position: "FW", number: 9, nationality: "Poland", clubs: "Znicz Pruszkow, Lech Poznan, Borussia Dortmund, Bayern Munich, Barcelona", funFact: { en: "Later broke the Bundesliga single-season scoring record.", pt: "Mais tarde quebrou o recorde de gols em uma única temporada da Bundesliga.", es: "Más tarde batió el récord de goles en una sola temporada de la Bundesliga." } },
    ],
  },
  {
    team: "FC Barcelona",
    year: 2015,
    matchLabel: { en: "UEFA Champions League Final (treble)", pt: "Final da Champions League (tríplice coroa)", es: "Final de la Champions League (triplete)" },
    players: [
      { name: "Marc-Andre ter Stegen", position: "GK", number: 1, nationality: "Germany", clubs: "Borussia Monchengladbach, Barcelona", funFact: { en: "Became Barcelona's undisputed starting goalkeeper for over a decade.", pt: "Se tornou o goleiro titular absoluto do Barcelona por mais de uma década.", es: "Se convirtió en el portero titular indiscutido del Barcelona durante más de una década." } },
      { name: "Dani Alves", position: "DF", number: 2, nationality: "Brazil", clubs: "Sevilla, Barcelona, Juventus, PSG", funFact: { en: "Won the Copa America with Brazil in 2019.", pt: "Venceu a Copa América com o Brasil em 2019.", es: "Ganó la Copa América con Brasil en 2019." } },
      { name: "Gerard Pique", position: "DF", number: 3, nationality: "Spain", clubs: "Manchester United, Zaragoza, Barcelona", funFact: { en: "Started his career at Manchester United's academy.", pt: "Começou a carreira nas categorias de base do Manchester United.", es: "Empezó su carrera en la cantera del Manchester United." } },
      { name: "Javier Mascherano", position: "DF", number: 14, nationality: "Argentina", clubs: "River Plate, Liverpool, Barcelona", funFact: { en: "Represented Argentina at four World Cups.", pt: "Defendeu a Argentina em quatro Copas do Mundo.", es: "Representó a Argentina en cuatro Mundiales." } },
      { name: "Jordi Alba", position: "DF", number: 18, nationality: "Spain", clubs: "Valencia, Barcelona", funFact: { en: "Won a gold medal at the 2012 Olympics with Spain.", pt: "Venceu a medalha de ouro nos Jogos Olímpicos de 2012 pela Espanha.", es: "Ganó la medalla de oro en los Juegos Olímpicos de 2012 con España." } },
      { name: "Sergio Busquets", position: "MF", number: 5, nationality: "Spain", clubs: "Barcelona, Inter Miami", funFact: { en: "Later moved to Inter Miami to play alongside Messi.", pt: "Mais tarde se transferiu ao Inter Miami para jogar ao lado de Messi.", es: "Más tarde se fue al Inter Miami para jugar junto a Messi." } },
      { name: "Ivan Rakitic", position: "MF", number: 4, nationality: "Croatia", clubs: "Sevilla, Barcelona", funFact: { en: "Started his career at Basel before moving to Schalke.", pt: "Começou a carreira no Basel antes de se transferir ao Schalke.", es: "Empezó su carrera en el Basilea antes de fichar por el Schalke." } },
      { name: "Andres Iniesta", position: "MF", number: 8, nationality: "Spain", clubs: "Barcelona, Vissel Kobe", funFact: { en: "Spent the final years of his career playing in Japan.", pt: "Passou os últimos anos da carreira jogando no Japão.", es: "Pasó los últimos años de su carrera jugando en Japón." } },
      { name: "Lionel Messi", position: "FW", number: 10, nationality: "Argentina", clubs: "Barcelona, PSG, Inter Miami", funFact: { en: "Holds a record eight Ballon d'Or awards.", pt: "Detém o recorde de oito prêmios Bola de Ouro.", es: "Posee el récord de ocho Balones de Oro." } },
      { name: "Neymar", position: "FW", number: 11, nationality: "Brazil", clubs: "Santos, Barcelona, PSG, Al-Hilal", funFact: { en: "Became the most expensive transfer in football history when he joined PSG.", pt: "Se tornou a transferência mais cara da história do futebol ao ir para o PSG.", es: "Se convirtió en el fichaje más caro de la historia del fútbol al fichar por el PSG." } },
      { name: "Luis Suarez", position: "FW", number: 9, nationality: "Uruguay", clubs: "Ajax, Liverpool, Barcelona, Atletico Madrid", funFact: { en: "Is Uruguay's all-time record goalscorer.", pt: "É o maior artilheiro da história do Uruguai.", es: "Es el máximo goleador histórico de Uruguay." } },
    ],
  },
  {
    team: "Juventus",
    year: 2015,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Gianluigi Buffon", position: "GK", number: 1, nationality: "Italy", clubs: "Parma, Juventus, PSG", funFact: { en: "Represented Italy at five different World Cups.", pt: "Defendeu a Itália em cinco Copas do Mundo diferentes.", es: "Representó a Italia en cinco Mundiales distintos." } },
      { name: "Stephan Lichtsteiner", position: "DF", number: 26, nationality: "Switzerland", clubs: "Lugano, Lille, Juventus", funFact: { en: "Won seven straight Serie A titles with Juventus.", pt: "Venceu sete Serie A seguidas pela Juventus.", es: "Ganó siete Serie A consecutivas con la Juventus." } },
      { name: "Leonardo Bonucci", position: "DF", number: 19, nationality: "Italy", clubs: "Inter Milan, Bari, Juventus, AC Milan", funFact: { en: "Later returned to Juventus after a season at AC Milan.", pt: "Mais tarde retornou à Juventus após uma temporada no AC Milan.", es: "Más tarde regresó a la Juventus tras una temporada en el AC Milan." } },
      { name: "Giorgio Chiellini", position: "DF", number: 3, nationality: "Italy", clubs: "Fiorentina, Juventus", funFact: { en: "Spent nearly his entire career at Juventus.", pt: "Passou quase toda a carreira na Juventus.", es: "Pasó casi toda su carrera en la Juventus." } },
      { name: "Patrice Evra", position: "DF", number: 33, nationality: "France", clubs: "Monaco, Manchester United, Juventus", funFact: { en: "Won the Champions League with Manchester United in 2008.", pt: "Venceu a Champions League pelo Manchester United em 2008.", es: "Ganó la Champions League con el Manchester United en 2008." } },
      { name: "Arturo Vidal", position: "MF", number: 23, nationality: "Chile", clubs: "Colo-Colo, Bayer Leverkusen, Juventus, Bayern Munich", funFact: { en: "Later won the treble with Bayern Munich in 2013.", pt: "Mais tarde venceu a tríplice coroa com o Bayern de Munique em 2013.", es: "Más tarde ganó el triplete con el Bayern de Múnich en 2013." } },
      { name: "Andrea Pirlo", position: "MF", number: 21, nationality: "Italy", clubs: "AC Milan, Juventus, New York City FC", funFact: { en: "Famous for his deep-lying playmaker role and free kicks.", pt: "Famoso pela função de armador recuado e pelas cobranças de falta.", es: "Famoso por su rol de armador recostado y por sus tiros libres." } },
      { name: "Claudio Marchisio", position: "MF", number: 8, nationality: "Italy", clubs: "Juventus (only)", funFact: { en: "Nicknamed 'The Little Prince' by Juventus fans.", pt: "Apelidado de 'O Pequeno Príncipe' pelos torcedores da Juventus.", es: "Apodado 'El Principito' por los hinchas de la Juventus." } },
      { name: "Kwadwo Asamoah", position: "MF", number: 22, nationality: "Ghana", clubs: "Udinese, Juventus, Inter Milan", funFact: { en: "Known for his versatility across midfield and wing-back.", pt: "Conhecido pela versatilidade no meio-campo e como ala.", es: "Conocido por su versatilidad en el mediocampo y como carrilero." } },
      { name: "Carlos Tevez", position: "FW", number: 10, nationality: "Argentina", clubs: "Boca Juniors, West Ham, Manchester United, Manchester City, Juventus", funFact: { en: "Won the Premier League with two different Manchester clubs.", pt: "Venceu a Premier League pelos dois clubes de Manchester.", es: "Ganó la Premier League con los dos clubes de Manchester." } },
      { name: "Alvaro Morata", position: "FW", number: 9, nationality: "Spain", clubs: "Real Madrid, Juventus, Chelsea, Atletico Madrid", funFact: { en: "Scored twice against his boyhood club Real Madrid in a Champions League semifinal.", pt: "Marcou duas vezes contra o Real Madrid, time de seu coração, numa semifinal da Champions.", es: "Marcó dos veces ante el Real Madrid, el equipo de su infancia, en una semifinal de la Champions." } },
    ],
  },
  {
    team: "Real Madrid",
    year: 2016,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Keylor Navas", position: "GK", number: 1, nationality: "Costa Rica", clubs: "Levante, Real Madrid, PSG", funFact: { en: "Started for his country at three different World Cups.", pt: "Foi titular por seu país em três Copas do Mundo diferentes.", es: "Fue titular con su selección en tres Mundiales distintos." } },
      { name: "Dani Carvajal", position: "DF", number: 2, nationality: "Spain", clubs: "Bayer Leverkusen, Real Madrid", funFact: { en: "Won five Champions League titles with Real Madrid.", pt: "Venceu cinco Champions League pelo Real Madrid.", es: "Ganó cinco Champions League con el Real Madrid." } },
      { name: "Sergio Ramos", position: "DF", number: 4, nationality: "Spain", clubs: "Sevilla, Real Madrid, PSG", funFact: { en: "Scored a dramatic late equalizer to force penalties in this final.", pt: "Marcou um gol de empate dramático no fim para levar essa final aos pênaltis.", es: "Marcó un dramático gol de empate al final para llevar esta final a los penales." } },
      { name: "Pepe", position: "DF", number: 3, nationality: "Portugal", clubs: "Porto, Real Madrid", funFact: { en: "Later returned to Porto after leaving Real Madrid.", pt: "Mais tarde retornou ao Porto após deixar o Real Madrid.", es: "Más tarde volvió al Porto tras dejar el Real Madrid." } },
      { name: "Marcelo", position: "DF", number: 12, nationality: "Brazil", clubs: "Fluminense, Real Madrid", funFact: { en: "Is the most decorated player in Real Madrid's history.", pt: "É o jogador mais premiado da história do Real Madrid.", es: "Es el jugador más laureado de la historia del Real Madrid." } },
      { name: "Casemiro", position: "MF", number: 14, nationality: "Brazil", clubs: "Sao Paulo, Real Madrid, Manchester United", funFact: { en: "Later moved to Manchester United after eight years at Real Madrid.", pt: "Mais tarde se transferiu ao Manchester United após oito anos no Real Madrid.", es: "Más tarde fichó por el Manchester United tras ocho años en el Real Madrid." } },
      { name: "Toni Kroos", position: "MF", number: 8, nationality: "Germany", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Won the World Cup with Germany in 2014.", pt: "Venceu a Copa do Mundo com a Alemanha em 2014.", es: "Ganó el Mundial con Alemania en 2014." } },
      { name: "Luka Modric", position: "MF", number: 19, nationality: "Croatia", clubs: "Dinamo Zagreb, Tottenham, Real Madrid", funFact: { en: "Won the Ballon d'Or in 2018.", pt: "Venceu a Bola de Ouro em 2018.", es: "Ganó el Balón de Oro en 2018." } },
      { name: "Gareth Bale", position: "FW", number: 11, nationality: "Wales", clubs: "Southampton, Tottenham, Real Madrid", funFact: { en: "Scored a memorable solo goal in the 2014 Copa del Rey final.", pt: "Marcou um gol de placa em jogada individual na final da Copa do Rei de 2014.", es: "Marcó un golazo en jugada individual en la final de la Copa del Rey de 2014." } },
      { name: "Cristiano Ronaldo", position: "FW", number: 7, nationality: "Portugal", clubs: "Sporting CP, Manchester United, Real Madrid, Juventus, Al-Nassr", funFact: { en: "Won the Champions League five times in his career.", pt: "Venceu a Champions League cinco vezes na carreira.", es: "Ganó la Champions League cinco veces en su carrera." } },
      { name: "Karim Benzema", position: "FW", number: 9, nationality: "France", clubs: "Lyon, Real Madrid, Al-Ittihad", funFact: { en: "Won the Champions League four times with Real Madrid.", pt: "Venceu a Champions League quatro vezes pelo Real Madrid.", es: "Ganó la Champions League cuatro veces con el Real Madrid." } },
    ],
  },
  {
    team: "Atletico Madrid",
    year: 2016,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Jan Oblak", position: "GK", number: 13, nationality: "Slovenia", clubs: "Olimpija Ljubljana, Benfica, Atletico Madrid", funFact: { en: "Became one of the best-paid goalkeepers in the world at Atletico.", pt: "Se tornou um dos goleiros mais bem pagos do mundo no Atlético.", es: "Se convirtió en uno de los porteros mejor pagados del mundo en el Atlético." } },
      { name: "Juanfran", position: "DF", number: 20, nationality: "Spain", clubs: "Atletico Madrid (mostly)", funFact: { en: "Made over 350 appearances for Atletico Madrid.", pt: "Disputou mais de 350 partidas pelo Atlético de Madrid.", es: "Disputó más de 350 partidos con el Atlético de Madrid." } },
      { name: "Diego Godin", position: "DF", number: 2, nationality: "Uruguay", clubs: "Nacional, Villarreal, Atletico Madrid, Inter Milan", funFact: { en: "Later played for Inter Milan and Cagliari in Serie A.", pt: "Mais tarde jogou pela Inter de Milão e pelo Cagliari, na Serie A.", es: "Más tarde jugó en el Inter de Milán y en el Cagliari, en la Serie A." } },
      { name: "Jose Gimenez", position: "DF", number: 5, nationality: "Uruguay", clubs: "Danubio, Atletico Madrid", funFact: { en: "Became one of the youngest centre-backs to establish himself in La Liga.", pt: "Se tornou um dos zagueiros mais jovens a se firmar na La Liga.", es: "Se convirtió en uno de los centrales más jóvenes en asentarse en La Liga." } },
      { name: "Filipe Luis", position: "DF", number: 23, nationality: "Brazil", clubs: "Atletico Madrid, Chelsea", funFact: { en: "Represented Brazil at the 2014 World Cup on home soil.", pt: "Defendeu o Brasil na Copa do Mundo de 2014, disputada em casa.", es: "Representó a Brasil en el Mundial de 2014, disputado en casa." } },
      { name: "Gabi", position: "MF", number: 14, nationality: "Spain", clubs: "Real Madrid, Atletico Madrid", funFact: { en: "Started his career at Real Madrid's academy.", pt: "Começou a carreira nas categorias de base do Real Madrid.", es: "Empezó su carrera en la cantera del Real Madrid." } },
      { name: "Saul Niguez", position: "MF", number: 8, nationality: "Spain", clubs: "Atletico Madrid (mostly)", funFact: { en: "Came through Atletico Madrid's own academy.", pt: "Foi revelado nas categorias de base do próprio Atlético de Madrid.", es: "Se formó en la propia cantera del Atlético de Madrid." } },
      { name: "Koke", position: "MF", number: 6, nationality: "Spain", clubs: "Atletico Madrid (only)", funFact: { en: "Was part of Spain's youth teams before becoming a senior international.", pt: "Passou pelas categorias de base da Espanha antes de virar titular na seleção principal.", es: "Pasó por las categorías juveniles de España antes de ser titular en la selección absoluta." } },
      { name: "Yannick Carrasco", position: "MF", number: 21, nationality: "Belgium", clubs: "Monaco, Atletico Madrid, Dalian Yifang", funFact: { en: "Later moved to the Chinese Super League mid-career.", pt: "Mais tarde se transferiu para a liga chinesa em meio à carreira.", es: "Más tarde se fue a la liga china en plena carrera." } },
      { name: "Antoine Griezmann", position: "FW", number: 7, nationality: "France", clubs: "Real Sociedad, Atletico Madrid, Barcelona", funFact: { en: "Won the World Cup with France in 2018.", pt: "Venceu a Copa do Mundo com a França em 2018.", es: "Ganó el Mundial con Francia en 2018." } },
      { name: "Fernando Torres", position: "FW", number: 9, nationality: "Spain", clubs: "Atletico Madrid, Liverpool, Chelsea, AC Milan", funFact: { en: "Won the European Championship twice with Spain.", pt: "Venceu a Eurocopa duas vezes pela Espanha.", es: "Ganó la Eurocopa dos veces con España." } },
    ],
  },
  {
    team: "Juventus",
    year: 2017,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Gianluigi Buffon", position: "GK", number: 1, nationality: "Italy", clubs: "Parma, Juventus, PSG", funFact: { en: "Was runner-up for the Ballon d'Or in 2006.", pt: "Foi vice-campeão da Bola de Ouro em 2006.", es: "Fue subcampeón del Balón de Oro en 2006." } },
      { name: "Dani Alves", position: "DF", number: 20, nationality: "Brazil", clubs: "Sevilla, Barcelona, Juventus, PSG", funFact: { en: "Won a domestic treble in his only season at Juventus.", pt: "Venceu a tríplice coroa nacional em sua única temporada na Juventus.", es: "Ganó el triplete nacional en su única temporada en la Juventus." } },
      { name: "Giorgio Chiellini", position: "DF", number: 3, nationality: "Italy", clubs: "Fiorentina, Juventus", funFact: { en: "Represented Italy at four European Championships.", pt: "Defendeu a Itália em quatro Eurocopas.", es: "Representó a Italia en cuatro Eurocopas." } },
      { name: "Leonardo Bonucci", position: "DF", number: 19, nationality: "Italy", clubs: "Inter Milan, Bari, Juventus, AC Milan", funFact: { en: "Won the European Championship with Italy in 2021.", pt: "Venceu a Eurocopa com a Itália em 2021.", es: "Ganó la Eurocopa con Italia en 2021." } },
      { name: "Alex Sandro", position: "DF", number: 12, nationality: "Brazil", clubs: "Porto, Juventus", funFact: { en: "Started his career at Porto before moving to Juventus.", pt: "Começou a carreira no Porto antes de se transferir à Juventus.", es: "Empezó su carrera en el Porto antes de fichar por la Juventus." } },
      { name: "Miralem Pjanic", position: "MF", number: 5, nationality: "Bosnia", clubs: "Metz, Lyon, Roma, Juventus, Barcelona", funFact: { en: "Later moved to Barcelona in a swap deal with Arthur.", pt: "Mais tarde se transferiu ao Barcelona numa troca envolvendo o Arthur.", es: "Más tarde fichó por el Barcelona en un intercambio con Arthur." } },
      { name: "Sami Khedira", position: "MF", number: 6, nationality: "Germany", clubs: "Stuttgart, Real Madrid, Juventus", funFact: { en: "Won the World Cup with Germany in 2014.", pt: "Venceu a Copa do Mundo com a Alemanha em 2014.", es: "Ganó el Mundial con Alemania en 2014." } },
      { name: "Claudio Marchisio", position: "MF", number: 8, nationality: "Italy", clubs: "Juventus (only)", funFact: { en: "Made over 300 appearances for Juventus.", pt: "Disputou mais de 300 partidas pela Juventus.", es: "Disputó más de 300 partidos con la Juventus." } },
      { name: "Juan Cuadrado", position: "MF", number: 16, nationality: "Colombia", clubs: "Independiente Medellin, Fiorentina, Chelsea, Juventus", funFact: { en: "Converted from a winger into an attacking wing-back at Juventus.", pt: "Foi convertido de ponta para ala ofensivo na Juventus.", es: "Fue reconvertido de extremo a carrilero ofensivo en la Juventus." } },
      { name: "Gonzalo Higuain", position: "FW", number: 9, nationality: "Argentina", clubs: "River Plate, Real Madrid, Napoli, Juventus", funFact: { en: "Scored over 300 career club goals.", pt: "Marcou mais de 300 gols na carreira por clubes.", es: "Marcó más de 300 goles en su carrera con clubes." } },
      { name: "Paulo Dybala", position: "FW", number: 10, nationality: "Argentina", clubs: "Instituto, Palermo, Juventus, Roma", funFact: { en: "Became known as 'La Joya' (The Jewel) at Juventus.", pt: "Ficou conhecido como 'La Joya' (A Joia) na Juventus.", es: "Se hizo conocido como 'La Joya' en la Juventus." } },
    ],
  },
  {
    team: "Real Madrid",
    year: 2018,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Keylor Navas", position: "GK", number: 1, nationality: "Costa Rica", clubs: "Levante, Real Madrid, PSG", funFact: { en: "Won three consecutive Champions League titles as Real Madrid's goalkeeper.", pt: "Venceu três Champions League seguidas como goleiro do Real Madrid.", es: "Ganó tres Champions League seguidas como portero del Real Madrid." } },
      { name: "Dani Carvajal", position: "DF", number: 2, nationality: "Spain", clubs: "Bayer Leverkusen, Real Madrid", funFact: { en: "Was named in the UEFA Champions League Team of the Season multiple times.", pt: "Foi eleito para o Time da Temporada da Champions League da UEFA várias vezes.", es: "Fue elegido para el Equipo de la Temporada de la Champions League de la UEFA varias veces." } },
      { name: "Raphael Varane", position: "DF", number: 5, nationality: "France", clubs: "Lens, Real Madrid, Manchester United", funFact: { en: "Won the World Cup with France in 2018, weeks after this final.", pt: "Venceu a Copa do Mundo com a França em 2018, semanas depois dessa final.", es: "Ganó el Mundial con Francia en 2018, semanas después de esta final." } },
      { name: "Sergio Ramos", position: "DF", number: 4, nationality: "Spain", clubs: "Sevilla, Real Madrid, PSG", funFact: { en: "Became Real Madrid's all-time appearance leader.", pt: "Se tornou o jogador com mais partidas na história do Real Madrid.", es: "Se convirtió en el jugador con más partidos en la historia del Real Madrid." } },
      { name: "Marcelo", position: "DF", number: 12, nationality: "Brazil", clubs: "Fluminense, Real Madrid", funFact: { en: "Won more trophies than almost any other player in Real Madrid's history.", pt: "Venceu mais títulos do que quase qualquer outro jogador na história do Real Madrid.", es: "Ganó más títulos que casi cualquier otro jugador en la historia del Real Madrid." } },
      { name: "Casemiro", position: "MF", number: 14, nationality: "Brazil", clubs: "Sao Paulo, Real Madrid, Manchester United", funFact: { en: "Won the Champions League five times with Real Madrid.", pt: "Venceu a Champions League cinco vezes pelo Real Madrid.", es: "Ganó la Champions League cinco veces con el Real Madrid." } },
      { name: "Toni Kroos", position: "MF", number: 8, nationality: "Germany", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Played for Bayern Munich before joining Real Madrid in 2014.", pt: "Jogou pelo Bayern de Munique antes de se transferir ao Real Madrid em 2014.", es: "Jugó en el Bayern de Múnich antes de fichar por el Real Madrid en 2014." } },
      { name: "Luka Modric", position: "MF", number: 19, nationality: "Croatia", clubs: "Dinamo Zagreb, Tottenham, Real Madrid", funFact: { en: "Started his career at Dinamo Zagreb before moving to Tottenham.", pt: "Começou a carreira no Dinamo Zagreb antes de se transferir ao Tottenham.", es: "Empezó su carrera en el Dinamo Zagreb antes de fichar por el Tottenham." } },
      { name: "Isco", position: "MF", number: 22, nationality: "Spain", clubs: "Valencia, Malaga, Real Madrid, Sevilla", funFact: { en: "Won the Under-21 European Championship with Spain.", pt: "Venceu a Eurocopa Sub-21 pela Espanha.", es: "Ganó la Eurocopa Sub-21 con España." } },
      { name: "Cristiano Ronaldo", position: "FW", number: 7, nationality: "Portugal", clubs: "Sporting CP, Manchester United, Real Madrid, Juventus, Al-Nassr", funFact: { en: "Left Real Madrid for Juventus shortly after this final.", pt: "Deixou o Real Madrid rumo à Juventus pouco depois dessa final.", es: "Dejó el Real Madrid rumbo a la Juventus poco después de esta final." } },
      { name: "Karim Benzema", position: "FW", number: 9, nationality: "France", clubs: "Lyon, Real Madrid, Al-Ittihad", funFact: { en: "Became Real Madrid's second-highest goalscorer of all time.", pt: "Se tornou o segundo maior artilheiro da história do Real Madrid.", es: "Se convirtió en el segundo máximo goleador de la historia del Real Madrid." } },
    ],
  },
  {
    team: "Liverpool",
    year: 2018,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Loris Karius", position: "GK", number: 1, nationality: "Germany", clubs: "Manchester City, Mainz, Liverpool", funFact: { en: "Started his career in Germany before moving to the Premier League.", pt: "Começou a carreira na Alemanha antes de se transferir à Premier League.", es: "Empezó su carrera en Alemania antes de fichar por la Premier League." } },
      { name: "Trent Alexander-Arnold", position: "DF", number: 66, nationality: "England", clubs: "Liverpool, Real Madrid", funFact: { en: "Was handed his first England call-up the same year.", pt: "Recebeu sua primeira convocação para a seleção da Inglaterra no mesmo ano.", es: "Recibió su primera convocatoria a la selección de Inglaterra ese mismo año." } },
      { name: "Dejan Lovren", position: "DF", number: 6, nationality: "Croatia", clubs: "Dinamo Zagreb, Lyon, Southampton, Liverpool", funFact: { en: "Reached the World Cup final with Croatia in 2018.", pt: "Chegou à final da Copa do Mundo pela Croácia em 2018.", es: "Llegó a la final del Mundial con Croacia en 2018." } },
      { name: "Virgil van Dijk", position: "DF", number: 4, nationality: "Netherlands", clubs: "Groningen, Celtic, Southampton, Liverpool", funFact: { en: "Joined Liverpool in a then-record fee for a defender.", pt: "Chegou ao Liverpool por uma taxa que era recorde para um zagueiro na época.", es: "Llegó al Liverpool por un traspaso que era récord para un defensor en ese momento." } },
      { name: "Andrew Robertson", position: "DF", number: 26, nationality: "Scotland", clubs: "Dundee United, Hull City, Liverpool", funFact: { en: "Started his career on loan at Scottish club Dundee United.", pt: "Começou a carreira emprestado ao clube escocês Dundee United.", es: "Empezó su carrera cedido en el club escocés Dundee United." } },
      { name: "Jordan Henderson", position: "MF", number: 14, nationality: "England", clubs: "Sunderland, Liverpool, Al-Ettifaq", funFact: { en: "Was booed by some fans early in his Liverpool career before becoming captain.", pt: "Foi vaiado por alguns torcedores no início da carreira no Liverpool antes de virar capitão.", es: "Fue abucheado por algunos hinchas al inicio de su etapa en el Liverpool antes de ser capitán." } },
      { name: "Georginio Wijnaldum", position: "MF", number: 5, nationality: "Netherlands", clubs: "Feyenoord, PSV, Newcastle, Liverpool", funFact: { en: "Started his career at Feyenoord's academy in Rotterdam.", pt: "Começou a carreira nas categorias de base do Feyenoord, em Roterdã.", es: "Empezó su carrera en la cantera del Feyenoord, en Róterdam." } },
      { name: "James Milner", position: "MF", number: 7, nationality: "England", clubs: "Leeds United, Newcastle, Aston Villa, Manchester City, Liverpool", funFact: { en: "Made more Premier League appearances than almost any player of his generation.", pt: "Disputou mais partidas na Premier League do que quase qualquer jogador de sua geração.", es: "Disputó más partidos en la Premier League que casi cualquier jugador de su generación." } },
      { name: "Mohamed Salah", position: "FW", number: 11, nationality: "Egypt", clubs: "Basel, Chelsea, Roma, Liverpool", funFact: { en: "Won the African Footballer of the Year award multiple times.", pt: "Venceu o prêmio de Jogador Africano do Ano diversas vezes.", es: "Ganó el premio al Futbolista Africano del Año varias veces." } },
      { name: "Roberto Firmino", position: "FW", number: 9, nationality: "Brazil", clubs: "Figueirense, Hoffenheim, Liverpool, Al-Ahli", funFact: { en: "Started his career at Brazilian club Figueirense.", pt: "Começou a carreira no Figueirense, no Brasil.", es: "Empezó su carrera en el Figueirense, de Brasil." } },
      { name: "Sadio Mane", position: "FW", number: 10, nationality: "Senegal", clubs: "Metz, Salzburg, Southampton, Liverpool, Bayern Munich, Al-Nassr", funFact: { en: "Was the first Senegalese player to start a Champions League final.", pt: "Foi o primeiro jogador senegalês a ser titular numa final de Champions League.", es: "Fue el primer jugador senegalés en ser titular en una final de Champions League." } },
    ],
  },
  {
    team: "Bayern Munich",
    year: 2020,
    matchLabel: { en: "UEFA Champions League Final (treble)", pt: "Final da Champions League (tríplice coroa)", es: "Final de la Champions League (triplete)" },
    players: [
      { name: "Manuel Neuer", position: "GK", number: 1, nationality: "Germany", clubs: "Schalke, Bayern Munich", funFact: { en: "Has played his entire senior career for Bayern Munich.", pt: "Jogou toda a carreira profissional pelo Bayern de Munique.", es: "Jugó toda su carrera profesional en el Bayern de Múnich." } },
      { name: "Joshua Kimmich", position: "DF", number: 32, nationality: "Germany", clubs: "RB Leipzig, Bayern Munich", funFact: { en: "Started his career at RB Leipzig before their promotion to the Bundesliga.", pt: "Começou a carreira no RB Leipzig antes da promoção do clube à Bundesliga.", es: "Empezó su carrera en el RB Leipzig antes del ascenso del club a la Bundesliga." } },
      { name: "Jerome Boateng", position: "DF", number: 17, nationality: "Germany", clubs: "Hamburg, Manchester City, Bayern Munich", funFact: { en: "Won the World Cup with Germany in 2014.", pt: "Venceu a Copa do Mundo com a Alemanha em 2014.", es: "Ganó el Mundial con Alemania en 2014." } },
      { name: "David Alaba", position: "DF", number: 27, nationality: "Austria", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Later joined Real Madrid on a free transfer.", pt: "Mais tarde se transferiu ao Real Madrid sem custo.", es: "Más tarde fichó por el Real Madrid como agente libre." } },
      { name: "Alphonso Davies", position: "DF", number: 19, nationality: "Canada", clubs: "Vancouver Whitecaps, Bayern Munich", funFact: { en: "Became the first Canadian to play in a Champions League final.", pt: "Se tornou o primeiro canadense a jogar uma final de Champions League.", es: "Se convirtió en el primer canadiense en jugar una final de Champions League." } },
      { name: "Thiago Alcantara", position: "MF", number: 6, nationality: "Spain", clubs: "Barcelona, Bayern Munich, Liverpool", funFact: { en: "Later moved to Liverpool from Bayern Munich.", pt: "Mais tarde se transferiu ao Liverpool vindo do Bayern de Munique.", es: "Más tarde fichó por el Liverpool procedente del Bayern de Múnich." } },
      { name: "Leon Goretzka", position: "MF", number: 18, nationality: "Germany", clubs: "Bochum, Schalke, Bayern Munich", funFact: { en: "Recovered from a serious injury to become a Bayern regular.", pt: "Se recuperou de uma lesão grave para se firmar como titular no Bayern.", es: "Se recuperó de una lesión grave para consolidarse como titular en el Bayern." } },
      { name: "Serge Gnabry", position: "FW", number: 22, nationality: "Germany", clubs: "Arsenal, West Bromwich Albion, Werder Bremen, Bayern Munich", funFact: { en: "Scored four goals in a single Champions League match against Tottenham.", pt: "Marcou quatro gols numa única partida de Champions League contra o Tottenham.", es: "Marcó cuatro goles en un solo partido de Champions League ante el Tottenham." } },
      { name: "Thomas Muller", position: "FW", number: 25, nationality: "Germany", clubs: "Bayern Munich (only)", funFact: { en: "Has won the Champions League six times.", pt: "Já venceu a Champions League seis vezes.", es: "Ya ha ganado la Champions League seis veces." } },
      { name: "Kingsley Coman", position: "FW", number: 29, nationality: "France", clubs: "Paris Saint-Germain, Juventus, Bayern Munich", funFact: { en: "Scored the winning goal in this Champions League final against his boyhood club.", pt: "Marcou o gol da vitória nessa final da Champions League contra o clube que torcia quando criança.", es: "Marcó el gol de la victoria en esta final de la Champions League ante el club del que era hincha de niño." } },
      { name: "Robert Lewandowski", position: "FW", number: 9, nationality: "Poland", clubs: "Znicz Pruszkow, Lech Poznan, Borussia Dortmund, Bayern Munich, Barcelona", funFact: { en: "Once scored five goals in nine minutes off the bench in the Bundesliga.", pt: "Certa vez marcou cinco gols em nove minutos saindo do banco, na Bundesliga.", es: "Una vez marcó cinco goles en nueve minutos entrando desde el banco, en la Bundesliga." } },
    ],
  },
  {
    team: "Paris Saint-Germain",
    year: 2020,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Keylor Navas", position: "GK", number: 1, nationality: "Costa Rica", clubs: "Levante, Real Madrid, PSG", funFact: { en: "Left Real Madrid for PSG in 2019 despite winning three Champions Leagues.", pt: "Deixou o Real Madrid rumo ao PSG em 2019, mesmo tendo vencido três Champions League.", es: "Dejó el Real Madrid rumbo al PSG en 2019, pese a haber ganado tres Champions League." } },
      { name: "Thilo Kehrer", position: "DF", number: 15, nationality: "Germany", clubs: "Schalke, PSG", funFact: { en: "Started his career at Schalke's academy in Germany.", pt: "Começou a carreira nas categorias de base do Schalke, na Alemanha.", es: "Empezó su carrera en la cantera del Schalke, en Alemania." } },
      { name: "Presnel Kimpembe", position: "DF", number: 3, nationality: "France", clubs: "PSG (only)", funFact: { en: "Came through PSG's own youth academy.", pt: "Foi revelado nas categorias de base do próprio PSG.", es: "Se formó en la propia cantera del PSG." } },
      { name: "Marquinhos", position: "DF", number: 5, nationality: "Brazil", clubs: "Corinthians, AS Roma, PSG", funFact: { en: "Started his career at Corinthians in Brazil.", pt: "Começou a carreira no Corinthians, no Brasil.", es: "Empezó su carrera en el Corinthians, de Brasil." } },
      { name: "Juan Bernat", position: "DF", number: 14, nationality: "Spain", clubs: "Valencia, Bayern Munich, PSG", funFact: { en: "Won the Champions League with Bayern Munich before joining PSG.", pt: "Venceu a Champions League pelo Bayern de Munique antes de ir ao PSG.", es: "Ganó la Champions League con el Bayern de Múnich antes de fichar por el PSG." } },
      { name: "Idrissa Gueye", position: "MF", number: 27, nationality: "Senegal", clubs: "Lille, Aston Villa, Everton, PSG", funFact: { en: "Was known as one of the best ball-winning midfielders of his generation.", pt: "Era conhecido como um dos melhores volantes de recomposição de sua geração.", es: "Era conocido como uno de los mejores mediocentros de recuperación de su generación." } },
      { name: "Marco Verratti", position: "MF", number: 6, nationality: "Italy", clubs: "Pescara, PSG", funFact: { en: "Joined PSG as a teenager from Italian club Pescara.", pt: "Chegou ao PSG ainda adolescente, vindo do Pescara, da Itália.", es: "Llegó al PSG siendo adolescente, procedente del Pescara, de Italia." } },
      { name: "Ander Herrera", position: "MF", number: 21, nationality: "Spain", clubs: "Real Zaragoza, Athletic Bilbao, Manchester United, PSG", funFact: { en: "Won the Europa League with Manchester United in 2017.", pt: "Venceu a Liga Europa pelo Manchester United em 2017.", es: "Ganó la Europa League con el Manchester United en 2017." } },
      { name: "Angel Di Maria", position: "FW", number: 11, nationality: "Argentina", clubs: "Benfica, Real Madrid, Manchester United, PSG", funFact: { en: "Was named Man of the Match in the 2014 Champions League final.", pt: "Foi eleito o melhor em campo na final da Champions League de 2014.", es: "Fue elegido el mejor jugador del partido en la final de la Champions League de 2014." } },
      { name: "Kylian Mbappe", position: "FW", number: 7, nationality: "France", clubs: "Monaco, PSG, Real Madrid", funFact: { en: "Won the World Cup with France as a teenager in 2018.", pt: "Venceu a Copa do Mundo com a França ainda adolescente, em 2018.", es: "Ganó el Mundial con Francia siendo adolescente, en 2018." } },
      { name: "Neymar", position: "FW", number: 10, nationality: "Brazil", clubs: "Santos, Barcelona, PSG, Al-Hilal", funFact: { en: "Is Brazil's all-time record goalscorer.", pt: "É o maior artilheiro da história da seleção brasileira.", es: "Es el máximo goleador histórico de la selección brasileña." } },
    ],
  },
  {
    team: "Chelsea",
    year: 2021,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Edouard Mendy", position: "GK", number: 16, nationality: "Senegal", clubs: "Cherbourg, Reims, Rennes, Chelsea", funFact: { en: "Was named the Best FIFA Goalkeeper in 2021.", pt: "Foi eleito o Melhor Goleiro da FIFA em 2021.", es: "Fue elegido el Mejor Portero de la FIFA en 2021." } },
      { name: "Reece James", position: "DF", number: 24, nationality: "England", clubs: "Chelsea (only)", funFact: { en: "Came through Chelsea's own academy.", pt: "Foi revelado nas categorias de base do próprio Chelsea.", es: "Se formó en la propia cantera del Chelsea." } },
      { name: "Thiago Silva", position: "DF", number: 6, nationality: "Brazil", clubs: "Fluminense, AC Milan, PSG, Chelsea", funFact: { en: "Captained Brazil's national team for many years.", pt: "Foi capitão da seleção brasileira por muitos anos.", es: "Fue capitán de la selección brasileña durante muchos años." } },
      { name: "Antonio Rudiger", position: "DF", number: 2, nationality: "Germany", clubs: "VfB Stuttgart, AS Roma, Chelsea, Real Madrid", funFact: { en: "Later joined Real Madrid on a free transfer.", pt: "Mais tarde se transferiu ao Real Madrid sem custo.", es: "Más tarde fichó por el Real Madrid como agente libre." } },
      { name: "Ben Chilwell", position: "DF", number: 21, nationality: "England", clubs: "Leicester City, Chelsea", funFact: { en: "Started his career at Leicester City's academy.", pt: "Começou a carreira nas categorias de base do Leicester City.", es: "Empezó su carrera en la cantera del Leicester City." } },
      { name: "N'Golo Kante", position: "MF", number: 7, nationality: "France", clubs: "Boulogne, Caen, Leicester City, Chelsea", funFact: { en: "Won the Premier League with two different clubs in consecutive seasons.", pt: "Venceu a Premier League por dois clubes diferentes em temporadas seguidas.", es: "Ganó la Premier League con dos clubes distintos en temporadas consecutivas." } },
      { name: "Jorginho", position: "MF", number: 5, nationality: "Italy", clubs: "Hellas Verona, Napoli, Chelsea, Arsenal", funFact: { en: "Won the European Championship with Italy in 2021.", pt: "Venceu a Eurocopa com a Itália em 2021.", es: "Ganó la Eurocopa con Italia en 2021." } },
      { name: "Mateo Kovacic", position: "MF", number: 17, nationality: "Croatia", clubs: "Dinamo Zagreb, Inter Milan, Real Madrid, Chelsea, Manchester City", funFact: { en: "Won the Champions League with Real Madrid before joining Chelsea.", pt: "Venceu a Champions League pelo Real Madrid antes de ir ao Chelsea.", es: "Ganó la Champions League con el Real Madrid antes de fichar por el Chelsea." } },
      { name: "Mason Mount", position: "FW", number: 19, nationality: "England", clubs: "Chelsea, Manchester United", funFact: { en: "Was named Chelsea's Player of the Year in his breakout season.", pt: "Foi eleito o Jogador do Ano do Chelsea em sua temporada de estreia como titular.", es: "Fue elegido Jugador del Año del Chelsea en su temporada de consagración." } },
      { name: "Timo Werner", position: "FW", number: 11, nationality: "Germany", clubs: "VfB Stuttgart, RB Leipzig, Chelsea", funFact: { en: "Was known for his blistering pace up front.", pt: "Era conhecido pela velocidade impressionante no ataque.", es: "Era conocido por su velocidad impresionante en el ataque." } },
      { name: "Kai Havertz", position: "FW", number: 29, nationality: "Germany", clubs: "Bayer Leverkusen, Chelsea", funFact: { en: "Scored the only goal of this Champions League final.", pt: "Marcou o único gol dessa final da Champions League.", es: "Marcó el único gol de esta final de la Champions League." } },
    ],
  },
  {
    team: "Manchester City",
    year: 2021,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Ederson", position: "GK", number: 31, nationality: "Brazil", clubs: "Rio Ave, Benfica, Manchester City", funFact: { en: "Was one of the most expensive goalkeepers in history when he signed.", pt: "Foi um dos goleiros mais caros da história quando foi contratado.", es: "Fue uno de los porteros más caros de la historia cuando fue fichado." } },
      { name: "Kyle Walker", position: "DF", number: 2, nationality: "England", clubs: "Sheffield United, Tottenham, Manchester City", funFact: { en: "Was part of England's run to the 2018 World Cup semifinal.", pt: "Fez parte da campanha da Inglaterra até a semifinal da Copa de 2018.", es: "Formó parte de la campaña de Inglaterra hasta la semifinal del Mundial de 2018." } },
      { name: "Ruben Dias", position: "DF", number: 3, nationality: "Portugal", clubs: "Benfica, Manchester City", funFact: { en: "Won Portuguese Primeira Liga Player of the Year before moving to England.", pt: "Foi eleito o Jogador do Ano da Primeira Liga portuguesa antes de ir à Inglaterra.", es: "Fue elegido Jugador del Año de la Primeira Liga portuguesa antes de irse a Inglaterra." } },
      { name: "John Stones", position: "DF", number: 5, nationality: "England", clubs: "Barnsley, Everton, Manchester City", funFact: { en: "Came through Barnsley's academy before his big-money move to Everton.", pt: "Foi revelado nas categorias de base do Barnsley antes da transferência milionária ao Everton.", es: "Se formó en la cantera del Barnsley antes de su millonario traspaso al Everton." } },
      { name: "Oleksandr Zinchenko", position: "DF", number: 11, nationality: "Ukraine", clubs: "Shakhtar Donetsk, Manchester City, Arsenal", funFact: { en: "Converted from a midfielder into a left-back at Manchester City.", pt: "Foi convertido de meio-campista para lateral-esquerdo no Manchester City.", es: "Fue reconvertido de centrocampista a lateral izquierdo en el Manchester City." } },
      { name: "Ilkay Gundogan", position: "MF", number: 8, nationality: "Germany", clubs: "Borussia Dortmund, Manchester City", funFact: { en: "Later became Manchester City's club captain.", pt: "Mais tarde se tornou capitão do Manchester City.", es: "Más tarde se convirtió en capitán del Manchester City." } },
      { name: "Rodri", position: "MF", number: 16, nationality: "Spain", clubs: "Villarreal, Atletico Madrid, Manchester City", funFact: { en: "Won the Ballon d'Or in 2024.", pt: "Venceu a Bola de Ouro em 2024.", es: "Ganó el Balón de Oro en 2024." } },
      { name: "Phil Foden", position: "MF", number: 47, nationality: "England", clubs: "Manchester City (only)", funFact: { en: "Came through Manchester City's own academy as a highly rated prospect.", pt: "Foi revelado nas categorias de base do próprio Manchester City como grande promessa.", es: "Se formó en la propia cantera del Manchester City como gran promesa." } },
      { name: "Riyad Mahrez", position: "FW", number: 26, nationality: "Algeria", clubs: "Le Havre, Leicester City, Manchester City, Al-Ahli", funFact: { en: "Won the Premier League title with a small-budget Leicester City in 2016.", pt: "Venceu a Premier League por um Leicester City de orçamento modesto, em 2016.", es: "Ganó la Premier League con un Leicester City de presupuesto modesto, en 2016." } },
      { name: "Raheem Sterling", position: "FW", number: 7, nationality: "England", clubs: "Queens Park Rangers, Liverpool, Manchester City, Chelsea", funFact: { en: "Represented England at three major tournaments.", pt: "Defendeu a Inglaterra em três grandes torneios.", es: "Representó a Inglaterra en tres grandes torneos." } },
      { name: "Kevin De Bruyne", position: "MF", number: 17, nationality: "Belgium", clubs: "Genk, Chelsea, Wolfsburg, Manchester City", funFact: { en: "Was previously let go by Chelsea before starring at Manchester City.", pt: "Foi dispensado pelo Chelsea antes de brilhar no Manchester City.", es: "Fue descartado por el Chelsea antes de brillar en el Manchester City." } },
    ],
  },
  {
    team: "Real Madrid",
    year: 2022,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Thibaut Courtois", position: "GK", number: 1, nationality: "Belgium", clubs: "Genk, Chelsea, Atletico Madrid, Real Madrid", funFact: { en: "Was named UEFA's Goalkeeper of the Season.", pt: "Foi eleito o Goleiro da Temporada pela UEFA.", es: "Fue elegido el Portero de la Temporada por la UEFA." } },
      { name: "Dani Carvajal", position: "DF", number: 2, nationality: "Spain", clubs: "Bayer Leverkusen, Real Madrid", funFact: { en: "Has spent his entire senior career at Real Madrid.", pt: "Passou toda a carreira profissional no Real Madrid.", es: "Pasó toda su carrera profesional en el Real Madrid." } },
      { name: "Eder Militao", position: "DF", number: 3, nationality: "Brazil", clubs: "Sao Paulo, Porto, Real Madrid", funFact: { en: "Started his career at Sao Paulo before a brief spell at Porto.", pt: "Começou a carreira no São Paulo antes de uma passagem breve pelo Porto.", es: "Empezó su carrera en el São Paulo antes de un breve paso por el Porto." } },
      { name: "David Alaba", position: "DF", number: 4, nationality: "Austria", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Won league titles in three different countries.", pt: "Venceu campeonatos nacionais em três países diferentes.", es: "Ganó ligas nacionales en tres países distintos." } },
      { name: "Ferland Mendy", position: "DF", number: 23, nationality: "France", clubs: "Le Havre, Lyon, Real Madrid", funFact: { en: "Started his career at French club Le Havre.", pt: "Começou a carreira no clube francês Le Havre.", es: "Empezó su carrera en el club francés Le Havre." } },
      { name: "Casemiro", position: "MF", number: 14, nationality: "Brazil", clubs: "Sao Paulo, Real Madrid, Manchester United", funFact: { en: "Later moved to Manchester United in 2022.", pt: "Mais tarde se transferiu ao Manchester United em 2022.", es: "Más tarde fichó por el Manchester United en 2022." } },
      { name: "Toni Kroos", position: "MF", number: 8, nationality: "Germany", clubs: "Bayern Munich, Real Madrid", funFact: { en: "Was part of Germany's World Cup winning squad in 2014.", pt: "Fez parte do elenco campeão do mundo pela Alemanha em 2014.", es: "Formó parte del plantel campeón del mundo con Alemania en 2014." } },
      { name: "Luka Modric", position: "MF", number: 10, nationality: "Croatia", clubs: "Dinamo Zagreb, Tottenham, Real Madrid", funFact: { en: "Was named the best player at the 2018 World Cup.", pt: "Foi eleito o melhor jogador da Copa do Mundo de 2018.", es: "Fue elegido el mejor jugador del Mundial de 2018." } },
      { name: "Federico Valverde", position: "MF", number: 15, nationality: "Uruguay", clubs: "Penarol, Real Madrid", funFact: { en: "Started his career at Uruguayan club Penarol.", pt: "Começou a carreira no Peñarol, do Uruguai.", es: "Empezó su carrera en Peñarol, de Uruguay." } },
      { name: "Vinicius Junior", position: "FW", number: 20, nationality: "Brazil", clubs: "Flamengo, Real Madrid", funFact: { en: "Scored the winning goal in this Champions League final.", pt: "Marcou o gol da vitória nessa final da Champions League.", es: "Marcó el gol de la victoria en esta final de la Champions League." } },
      { name: "Karim Benzema", position: "FW", number: 9, nationality: "France", clubs: "Lyon, Real Madrid, Al-Ittihad", funFact: { en: "Won the Ballon d'Or in 2022.", pt: "Venceu a Bola de Ouro em 2022.", es: "Ganó el Balón de Oro en 2022." } },
    ],
  },
  {
    team: "Liverpool",
    year: 2022,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Alisson Becker", position: "GK", number: 1, nationality: "Brazil", clubs: "Internacional, Roma, Liverpool", funFact: { en: "Scored a dramatic injury-time header for Liverpool against West Brom.", pt: "Marcou um gol de cabeça dramático nos acréscimos contra o West Brom.", es: "Marcó un dramático gol de cabeza en el descuento ante el West Brom." } },
      { name: "Trent Alexander-Arnold", position: "DF", number: 66, nationality: "England", clubs: "Liverpool, Real Madrid", funFact: { en: "Is known for his exceptional passing range from right-back.", pt: "É conhecido pela qualidade de passe fora do comum jogando como lateral-direito.", es: "Es conocido por su calidad de pase fuera de lo común jugando de lateral derecho." } },
      { name: "Virgil van Dijk", position: "DF", number: 4, nationality: "Netherlands", clubs: "Groningen, Celtic, Southampton, Liverpool", funFact: { en: "Was runner-up for the 2019 Ballon d'Or.", pt: "Foi vice-campeão da Bola de Ouro de 2019.", es: "Fue subcampeón del Balón de Oro de 2019." } },
      { name: "Ibrahima Konate", position: "DF", number: 5, nationality: "France", clubs: "Sochaux, RB Leipzig, Liverpool", funFact: { en: "Started his career at French club Sochaux.", pt: "Começou a carreira no clube francês Sochaux.", es: "Empezó su carrera en el club francés Sochaux." } },
      { name: "Andrew Robertson", position: "DF", number: 26, nationality: "Scotland", clubs: "Dundee United, Hull City, Liverpool", funFact: { en: "Became Liverpool's vice-captain.", pt: "Se tornou vice-capitão do Liverpool.", es: "Se convirtió en vicecapitán del Liverpool." } },
      { name: "Fabinho", position: "MF", number: 3, nationality: "Brazil", clubs: "Real Madrid, Monaco, Liverpool, Al-Ittihad", funFact: { en: "Was nicknamed 'The Lighthouse' for his calm presence in midfield.", pt: "Foi apelidado de 'O Farol' pela presença calma no meio-campo.", es: "Fue apodado 'El Faro' por su presencia calmada en el mediocampo." } },
      { name: "Jordan Henderson", position: "MF", number: 14, nationality: "England", clubs: "Sunderland, Liverpool, Al-Ettifaq", funFact: { en: "Later moved to Saudi Arabia's league.", pt: "Mais tarde se transferiu para a liga saudita.", es: "Más tarde se fue a la liga saudí." } },
      { name: "Thiago Alcantara", position: "MF", number: 6, nationality: "Spain", clubs: "Barcelona, Bayern Munich, Liverpool", funFact: { en: "Won the treble with Bayern Munich in 2020.", pt: "Venceu a tríplice coroa com o Bayern de Munique em 2020.", es: "Ganó el triplete con el Bayern de Múnich en 2020." } },
      { name: "Mohamed Salah", position: "FW", number: 11, nationality: "Egypt", clubs: "Basel, Chelsea, Roma, Liverpool", funFact: { en: "Scored over 200 goals for Liverpool.", pt: "Marcou mais de 200 gols pelo Liverpool.", es: "Marcó más de 200 goles con el Liverpool." } },
      { name: "Sadio Mane", position: "FW", number: 10, nationality: "Senegal", clubs: "Metz, Salzburg, Southampton, Liverpool, Bayern Munich, Al-Nassr", funFact: { en: "Later joined Bayern Munich from Liverpool.", pt: "Mais tarde se transferiu ao Bayern de Munique vindo do Liverpool.", es: "Más tarde fichó por el Bayern de Múnich procedente del Liverpool." } },
      { name: "Luis Diaz", position: "FW", number: 23, nationality: "Colombia", clubs: "Barranquilla, Junior, Porto, Liverpool", funFact: { en: "Joined Liverpool midway through this Champions League campaign.", pt: "Chegou ao Liverpool no meio dessa campanha de Champions League.", es: "Llegó al Liverpool a mitad de esta campaña de Champions League." } },
    ],
  },
  {
    team: "Inter Milan",
    year: 2023,
    matchLabel: { en: "UEFA Champions League Final", pt: "Final da Champions League", es: "Final de la Champions League" },
    players: [
      { name: "Andre Onana", position: "GK", number: 24, nationality: "Cameroon", clubs: "Barcelona, Ajax, Inter Milan, Manchester United", funFact: { en: "Later moved to Manchester United from Inter Milan.", pt: "Mais tarde se transferiu ao Manchester United vindo da Inter de Milão.", es: "Más tarde fichó por el Manchester United procedente del Inter de Milán." } },
      { name: "Denzel Dumfries", position: "DF", number: 2, nationality: "Netherlands", clubs: "Heerenveen, PSV, Inter Milan", funFact: { en: "Known for his explosive pace as an attacking wing-back.", pt: "Conhecido pela velocidade explosiva como ala ofensivo.", es: "Conocido por su velocidad explosiva como carrilero ofensivo." } },
      { name: "Francesco Acerbi", position: "DF", number: 15, nationality: "Italy", clubs: "AC Milan, Chievo, Sassuolo, Lazio, Inter Milan", funFact: { en: "Overcame testicular cancer early in his career.", pt: "Superou um câncer testicular no início da carreira.", es: "Superó un cáncer testicular al inicio de su carrera." } },
      { name: "Alessandro Bastoni", position: "DF", number: 95, nationality: "Italy", clubs: "Atalanta, Inter Milan", funFact: { en: "Wears one of the highest squad numbers in professional football.", pt: "Usa um dos números de camisa mais altos do futebol profissional.", es: "Usa uno de los números de camiseta más altos del fútbol profesional." } },
      { name: "Federico Dimarco", position: "DF", number: 32, nationality: "Italy", clubs: "Inter Milan (mostly)", funFact: { en: "Came through Inter Milan's own youth academy.", pt: "Foi revelado nas categorias de base da própria Inter de Milão.", es: "Se formó en la propia cantera del Inter de Milán." } },
      { name: "Nicolo Barella", position: "MF", number: 23, nationality: "Italy", clubs: "Cagliari, Inter Milan", funFact: { en: "Became a key player for Italy's national team.", pt: "Se tornou peça-chave na seleção da Itália.", es: "Se convirtió en pieza clave en la selección de Italia." } },
      { name: "Hakan Calhanoglu", position: "MF", number: 20, nationality: "Turkey", clubs: "Karlsruhe, Hamburg, Bayer Leverkusen, AC Milan, Inter Milan", funFact: { en: "Previously played for rivals AC Milan before joining Inter.", pt: "Já jogou pelo rival AC Milan antes de se transferir à Inter.", es: "Ya jugó para el rival AC Milan antes de fichar por el Inter." } },
      { name: "Marcelo Brozovic", position: "MF", number: 77, nationality: "Croatia", clubs: "Dinamo Zagreb, Inter Milan, Al-Nassr", funFact: { en: "Later moved to Saudi Arabia's league.", pt: "Mais tarde se transferiu para a liga saudita.", es: "Más tarde se fue a la liga saudí." } },
      { name: "Robin Gosens", position: "DF", number: 28, nationality: "Germany", clubs: "Vitesse, Heracles, Atalanta, Inter Milan", funFact: { en: "Was part of Atalanta's surprise Champions League run in 2020.", pt: "Fez parte da surpreendente campanha da Atalanta na Champions League de 2020.", es: "Formó parte de la sorprendente campaña del Atalanta en la Champions League de 2020." } },
      { name: "Lautaro Martinez", position: "FW", number: 10, nationality: "Argentina", clubs: "Racing Club, Inter Milan", funFact: { en: "Became Inter Milan's captain and top scorer.", pt: "Se tornou capitão e artilheiro da Inter de Milão.", es: "Se convirtió en capitán y máximo goleador del Inter de Milán." } },
      { name: "Edin Dzeko", position: "FW", number: 9, nationality: "Bosnia", clubs: "Wolfsburg, Manchester City, Roma, Inter Milan", funFact: { en: "Is Bosnia and Herzegovina's all-time record goalscorer.", pt: "É o maior artilheiro da história da seleção da Bósnia e Herzegovina.", es: "Es el máximo goleador histórico de la selección de Bosnia y Herzegovina." } },
    ],
  },
];

// ============ BRAZIL LINEUP MODE DATA (Portuguese-only exclusive mode) ============
// nationality and funFact are stored ready-to-display in Portuguese (no per-language object needed)
const BRAZIL_LINEUP_POOL = [
  {
    team: "São Paulo FC",
    year: 2005,
    matchLabel: "Final do Mundial de Clubes",
    players: [
      { name: "Rogério Ceni", position: "GK", number: 1, nationality: "Brasil", clubs: "São Paulo FC (carreira toda)", funFact: "Recordista histórico de gols marcados por um goleiro." },
      { name: "Cicinho", position: "DF", number: 2, nationality: "Brasil", clubs: "São Paulo FC, Real Madrid", funFact: "Lateral-direito veloz que se transferiu ao Real Madrid logo após o título mundial." },
      { name: "Diego Lugano", position: "DF", number: 3, nationality: "Uruguai", clubs: "São Paulo FC, Fenerbahce", funFact: "Zagueiro uruguaio, peça-chave da defesa tricampeã." },
      { name: "Edcarlos", position: "DF", number: 4, nationality: "Brasil", clubs: "São Paulo FC, Juventude", funFact: "Zagueiro revelado nas categorias de base do clube." },
      { name: "Fabão", position: "DF", number: 6, nationality: "Brasil", clubs: "São Paulo FC, Cruzeiro", funFact: "Lateral-esquerdo de longa passagem pelo futebol brasileiro." },
      { name: "Josué", position: "MF", number: 5, nationality: "Brasil", clubs: "São Paulo FC, Werder Bremen", funFact: "Volante que se destacou depois na Bundesliga alemã." },
      { name: "Mineiro", position: "MF", number: 8, nationality: "Brasil", clubs: "São Paulo FC", funFact: "Meio-campista de marcação, peça regular do time campeão." },
      { name: "Danilo", position: "MF", number: 20, nationality: "Brasil", clubs: "São Paulo FC, Porto", funFact: "Meia habilidoso que depois brilhou no futebol português." },
      { name: "Júnior", position: "MF", number: 10, nationality: "Brasil", clubs: "São Paulo FC", funFact: "Meio-campista do time tricampeão mundial." },
      { name: "Aloísio", position: "FW", number: 9, nationality: "Brasil", clubs: "São Paulo FC", funFact: "Deu a assistência para o gol do título na final de 2005." },
      { name: "Amoroso", position: "FW", number: 11, nationality: "Brasil", clubs: "São Paulo FC, Borussia Dortmund", funFact: "Atacante experiente, também artilheiro na Alemanha antes de voltar ao Brasil." },
    ],
  },
  {
    team: "Internacional",
    year: 2006,
    matchLabel: "Final do Mundial de Clubes",
    players: [
      { name: "Clemer", position: "GK", number: 1, nationality: "Brasil", clubs: "Internacional (carreira toda)", funFact: "Goleiro símbolo do título mundial diante do Barcelona." },
      { name: "Wendell", position: "DF", number: 6, nationality: "Brasil", clubs: "Internacional", funFact: "Lateral-esquerdo do elenco campeão mundial." },
      { name: "Fabiano Eller", position: "DF", number: 4, nationality: "Brasil", clubs: "Internacional", funFact: "Zagueiro titular na histórica vitória de 2006." },
      { name: "Índio", position: "DF", number: 3, nationality: "Brasil", clubs: "Internacional", funFact: "Zagueiro que formou a dupla de defesa daquele título." },
      { name: "Ceará", position: "DF", number: 2, nationality: "Brasil", clubs: "Internacional, Al-Hilal", funFact: "Lateral-direito de grande atuação na campanha mundial." },
      { name: "Alex", position: "MF", number: 10, nationality: "Brasil", clubs: "Internacional, Chelsea (empréstimo)", funFact: "Camisa 10 e principal armador da equipe." },
      { name: "Edinho", position: "MF", number: 8, nationality: "Brasil", clubs: "Internacional", funFact: "Volante de marcação do time de 2006." },
      { name: "Iarley", position: "MF", number: 11, nationality: "Brasil", clubs: "Internacional, Coritiba", funFact: "Ponta habilidoso, um dos ídolos colorados da época." },
      { name: "Rafael Sóbis", position: "MF", number: 19, nationality: "Brasil", clubs: "Internacional, Real Betis", funFact: "Jovem promissor que também defendeu clubes na Europa." },
      { name: "Fernandão", position: "FW", number: 9, nationality: "Brasil", clubs: "Internacional, Palmeiras", funFact: "Atacante de área, decisivo em vários jogos da campanha." },
      { name: "Adriano Gabiru", position: "FW", number: 7, nationality: "Brasil", clubs: "Internacional", funFact: "Marcou o gol que decidiu o Mundial de Clubes de 2006." },
    ],
  },
  {
    team: "Corinthians",
    year: 2012,
    matchLabel: "Final do Mundial de Clubes",
    players: [
      { name: "Cássio", position: "GK", number: 12, nationality: "Brasil", clubs: "Corinthians (carreira toda)", funFact: "Fez defesas decisivas na campanha da Libertadores e do Mundial." },
      { name: "Alessandro", position: "DF", number: 6, nationality: "Brasil", clubs: "Corinthians, São Paulo FC", funFact: "Lateral-esquerdo e capitão em diversas partidas do título." },
      { name: "Chicão", position: "DF", number: 4, nationality: "Brasil", clubs: "Corinthians, Werder Bremen", funFact: "Zagueiro veterano, peça-chave na defesa daquele time." },
      { name: "Léo", position: "DF", number: 3, nationality: "Brasil", clubs: "Corinthians, Fenerbahçe", funFact: "Zagueiro que formou dupla sólida de defesa em 2012." },
      { name: "Fábio Santos", position: "DF", number: 24, nationality: "Brasil", clubs: "Corinthians, Atlético Mineiro", funFact: "Lateral-esquerdo com boa qualidade de cruzamento." },
      { name: "Ralf", position: "DM", number: 15, nationality: "Brasil", clubs: "Corinthians, Salzburg", funFact: "Volante de marcação forte no meio-campo." },
      { name: "Paulinho", position: "DM", number: 18, nationality: "Brasil", clubs: "Corinthians, Tottenham, Barcelona", funFact: "Chegou a jogar depois no Tottenham e no Barcelona." },
      { name: "Elias", position: "AM", number: 14, nationality: "Brasil", clubs: "Corinthians, Atlético Mineiro", funFact: "Meio-campista de perfil box-to-box, sempre presente no ataque." },
      { name: "Danilo", position: "AM", number: 30, nationality: "Brasil", clubs: "Corinthians, Porto", funFact: "Meia criativo, importante na construção das jogadas." },
      { name: "Emerson Sheik", position: "AM", number: 11, nationality: "Brasil", clubs: "Corinthians, diversos clubes asiáticos", funFact: "Conhecido por suas comemorações criativas em campo." },
      { name: "Paolo Guerrero", position: "FW", number: 9, nationality: "Peru", clubs: "Corinthians, Bayern Munique", funFact: "Artilheiro peruano, decisivo na final do Mundial de Clubes." },
    ],
  },
  {
    team: "Flamengo",
    year: 2019,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "Diego Alves", position: "GK", number: 1, nationality: "Brasil", clubs: "Flamengo, Valencia", funFact: "Um dos goleiros mais eficientes em defesas de pênalti do futebol mundial." },
      { name: "Filipe Luís", position: "DF", number: 6, nationality: "Brasil", clubs: "Flamengo, Atlético Madrid, Chelsea", funFact: "Lateral experiente, voltou ao Brasil após anos na Europa." },
      { name: "Rodrigo Caio", position: "DF", number: 3, nationality: "Brasil", clubs: "Flamengo, São Paulo FC", funFact: "Zagueiro titular na virada histórica contra o River Plate." },
      { name: "Pablo Marí", position: "DF", number: 25, nationality: "Espanha", clubs: "Flamengo, Arsenal", funFact: "Zagueiro espanhol que se firmou no time campeão." },
      { name: "Rafinha", position: "DF", number: 13, nationality: "Brasil", clubs: "Flamengo, Bayern Munique", funFact: "Lateral-direito que voltou ao Brasil após anos vencedores na Alemanha." },
      { name: "Willian Arão", position: "MF", number: 5, nationality: "Brasil", clubs: "Flamengo", funFact: "Volante versátil, atuava também como zagueiro em alguns jogos." },
      { name: "Gerson", position: "MF", number: 8, nationality: "Brasil", clubs: "Flamengo, Olympique de Marseille", funFact: "Meio-campista revelado no Fluminense antes de brilhar no Flamengo." },
      { name: "Éverton Ribeiro", position: "MF", number: 7, nationality: "Brasil", clubs: "Flamengo, Al-Ahli", funFact: "Camisa 7 habilidoso, ídolo da torcida rubro-negra." },
      { name: "Bruno Henrique", position: "FW", number: 27, nationality: "Brasil", clubs: "Flamengo, Santos", funFact: "Ponta veloz, artilheiro em vários jogos decisivos daquele ano." },
      { name: "Gabigol", position: "FW", number: 9, nationality: "Brasil", clubs: "Flamengo, Inter de Milão", funFact: "Marcou os dois gols na virada mágica contra o River Plate." },
      { name: "Giorgian de Arrascaeta", position: "FW", number: 14, nationality: "Uruguai", clubs: "Flamengo, Cruzeiro", funFact: "Meia uruguaio que deu as assistências para os dois gols da final." },
    ],
  },
  {
    team: "Palmeiras",
    year: 2021,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "Weverton", position: "GK", number: 21, nationality: "Brasil", clubs: "Palmeiras, Atlético Paranaense", funFact: "Goleiro titular em duas conquistas seguidas da Libertadores." },
      { name: "Piquerez", position: "DF", number: 19, nationality: "Uruguai", clubs: "Palmeiras, Fluminense", funFact: "Lateral-esquerdo uruguaio que se firmou no time titular." },
      { name: "Luan", position: "DF", number: 4, nationality: "Brasil", clubs: "Palmeiras", funFact: "Zagueiro peça-chave na defesa do bicampeonato." },
      { name: "Renan", position: "DF", number: 25, nationality: "Brasil", clubs: "Palmeiras", funFact: "Zagueiro que formou dupla de defesa na final de 2021." },
      { name: "Marcos Rocha", position: "DF", number: 13, nationality: "Brasil", clubs: "Palmeiras, Atlético Mineiro", funFact: "Lateral-direito de bom rendimento ofensivo e defensivo." },
      { name: "Danilo", position: "MF", number: 15, nationality: "Brasil", clubs: "Palmeiras, Nottingham Forest", funFact: "Volante de força física, importante na marcação do meio-campo." },
      { name: "Zé Rafael", position: "MF", number: 8, nationality: "Brasil", clubs: "Palmeiras, Botafogo", funFact: "Meio-campista versátil, atuava tanto na armação quanto na marcação." },
      { name: "Raphael Veiga", position: "MF", number: 23, nationality: "Brasil", clubs: "Palmeiras, Atlético Mineiro", funFact: "Camisa 10, principal armador e cobrador de pênaltis do time." },
      { name: "Rony", position: "FW", number: 10, nationality: "Brasil", clubs: "Palmeiras, Athletico Paranaense", funFact: "Atacante rápido e decisivo em jogos de mata-mata." },
      { name: "Deyverson", position: "FW", number: 9, nationality: "Brasil", clubs: "Palmeiras, diversos clubes espanhóis", funFact: "Marcou o gol do título na final da Libertadores de 2021." },
      { name: "Breno Lopes", position: "FW", number: 29, nationality: "Brasil", clubs: "Palmeiras, Fortaleza", funFact: "Ficou marcado por decidir finais de Libertadores saindo do banco." },
    ],
  },
  {
    team: "Cruzeiro",
    year: 2003,
    matchLabel: "Elenco campeão do Brasileirão",
    players: [
      { name: "Fábio", position: "GK", number: 1, nationality: "Brasil", clubs: "Cruzeiro, Fluminense", funFact: "Um dos goleiros mais longevos e vitoriosos do futebol brasileiro." },
      { name: "Fabiano", position: "DF", number: 2, nationality: "Brasil", clubs: "Cruzeiro", funFact: "Lateral-direito do time que dominou o Brasileirão daquele ano." },
      { name: "Anderson", position: "DF", number: 3, nationality: "Brasil", clubs: "Cruzeiro", funFact: "Zagueiro titular na campanha vitoriosa de 2003." },
      { name: "Gustavo Nery", position: "DF", number: 6, nationality: "Brasil", clubs: "Cruzeiro, Betis", funFact: "Lateral-esquerdo que também defendeu clubes na Espanha." },
      { name: "Val", position: "DF", number: 4, nationality: "Brasil", clubs: "Cruzeiro", funFact: "Zagueiro que completava a defesa daquele elenco." },
      { name: "Marques", position: "MF", number: 8, nationality: "Brasil", clubs: "Cruzeiro", funFact: "Volante de marcação do meio-campo cruzeirense." },
      { name: "Ricardinho", position: "MF", number: 10, nationality: "Brasil", clubs: "Cruzeiro, Corinthians", funFact: "Meia habilidoso, um dos destaques ofensivos do time." },
      { name: "Alex", position: "MF", number: 7, nationality: "Brasil", clubs: "Cruzeiro, PSV", funFact: "Armador criativo, peça central no futebol daquele Cruzeiro." },
      { name: "Fernandinho", position: "MF", number: 5, nationality: "Brasil", clubs: "Cruzeiro, Shakhtar Donetsk", funFact: "Mais tarde se tornou um dos grandes volantes do futebol europeu." },
      { name: "Euller", position: "FW", number: 9, nationality: "Brasil", clubs: "Cruzeiro", funFact: "Atacante de área, artilheiro da campanha vitoriosa." },
      { name: "Basílio", position: "FW", number: 11, nationality: "Brasil", clubs: "Cruzeiro", funFact: "Formou dupla de ataque naquele time dominante." },
    ],
  },
  {
    team: "Grêmio",
    year: 2017,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "Marcelo Grohe", position: "GK", number: 1, nationality: "Brasil", clubs: "Grêmio (carreira toda)", funFact: "Goleiro símbolo da conquista da Libertadores de 2017." },
      { name: "Bruno Cortez", position: "DF", number: 6, nationality: "Brasil", clubs: "Grêmio", funFact: "Lateral-esquerdo do time campeão da Libertadores de 2017." },
      { name: "Kannemann", position: "DF", number: 4, nationality: "Argentina", clubs: "Grêmio", funFact: "Zagueiro argentino que se tornou ídolo na torcida gremista." },
      { name: "Geromel", position: "DF", number: 3, nationality: "Brasil", clubs: "Grêmio", funFact: "Zagueiro e capitão, um dos pilares defensivos do time." },
      { name: "Edilson", position: "DF", number: 13, nationality: "Brasil", clubs: "Grêmio", funFact: "Lateral-direito daquele elenco campeão continental." },
      { name: "Jailson", position: "DM", number: 5, nationality: "Brasil", clubs: "Grêmio", funFact: "Volante de marcação forte no meio-campo gremista." },
      { name: "Arthur", position: "DM", number: 8, nationality: "Brasil", clubs: "Grêmio, Barcelona", funFact: "Volante que viria a se destacar mais tarde no Barcelona." },
      { name: "Fernandinho", position: "AM", number: 17, nationality: "Brasil", clubs: "Grêmio", funFact: "Ponta-esquerda daquele setor ofensivo do Grêmio." },
      { name: "Luan", position: "AM", number: 7, nationality: "Brasil", clubs: "Grêmio", funFact: "Camisa 7 criativo, um dos destaques da campanha." },
      { name: "Ramiro", position: "AM", number: 27, nationality: "Brasil", clubs: "Grêmio", funFact: "Ponta-direita, box-to-box importante na conquista." },
      { name: "Lucas Barrios", position: "FW", number: 19, nationality: "Paraguai", clubs: "Grêmio, Borussia Dortmund", funFact: "Centroavante paraguaio, artilheiro decisivo na campanha de 2017." },
    ],
  },
  {
    team: "Atlético Mineiro",
    year: 2013,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "Victor", position: "GK", number: 22, nationality: "Brasil", clubs: "Atlético Mineiro", funFact: "Fez a defesa decisiva no pênalti que garantiu o título." },
      { name: "Júnior César", position: "DF", number: 6, nationality: "Brasil", clubs: "Atlético Mineiro", funFact: "Lateral-esquerdo daquele elenco campeão continental." },
      { name: "Réver", position: "DF", number: 4, nationality: "Brasil", clubs: "Atlético Mineiro, Internacional", funFact: "Zagueiro e capitão, ergueu a taça da Libertadores de 2013." },
      { name: "Leonardo Silva", position: "DF", number: 3, nationality: "Brasil", clubs: "Atlético Mineiro", funFact: "Zagueiro ídolo, formou dupla de defesa histórica com Réver." },
      { name: "Marcos Rocha", position: "DF", number: 2, nationality: "Brasil", clubs: "Atlético Mineiro, Palmeiras", funFact: "Lateral-direito que depois seguiu carreira vitoriosa no Palmeiras." },
      { name: "Pierre", position: "DM", number: 5, nationality: "Brasil", clubs: "Atlético Mineiro", funFact: "Volante de contenção, parceiro de Leandro Donizete no meio-campo." },
      { name: "Ronaldinho Gaúcho", position: "AM", number: 10, nationality: "Brasil", clubs: "Atlético Mineiro, Barcelona, Milan", shortName: "Ronaldinho", funFact: "Camisa 10, armador solto atrás do ataque na conquista da Libertadores de 2013." },
      { name: "Leandro Donizete", position: "DM", number: 8, nationality: "Brasil", clubs: "Atlético Mineiro, Santos", funFact: "Volante experiente, fazia dupla de proteção à defesa no time campeão." },
      { name: "Bernard", position: "FW", number: 7, nationality: "Brasil", clubs: "Atlético Mineiro, Shakhtar Donetsk", funFact: "Ponta esquerdo talentoso, se transferiu para a Europa logo após o título." },
      { name: "Jô", position: "FW", number: 9, nationality: "Brasil", clubs: "Atlético Mineiro, Manchester City", funFact: "Centroavante do time, referência do ataque campeão." },
      { name: "Diego Tardelli", position: "FW", number: 11, nationality: "Brasil", clubs: "Atlético Mineiro", funFact: "Atuava aberto pela direita no trio ofensivo do time campeão." },
    ],
  },
  {
    team: "Fluminense",
    year: 2023,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "Fábio", position: "GK", number: 1, nationality: "Brasil", clubs: "Fluminense, Cruzeiro", funFact: "Aos mais de 40 anos, foi peça-chave na conquista da primeira Libertadores do clube." },
      { name: "Marcelo", position: "DF", number: 12, nationality: "Brasil", clubs: "Fluminense, Real Madrid", funFact: "Voltou ao clube que o revelou para encerrar a carreira com o título continental." },
      { name: "Nino", position: "DF", number: 15, nationality: "Brasil", clubs: "Fluminense", funFact: "Zagueiro de destaque, um dos pilares defensivos do título." },
      { name: "Marlon", position: "DF", number: 4, nationality: "Brasil", clubs: "Fluminense, Sassuolo", funFact: "Zagueiro que completava a dupla de defesa daquele elenco." },
      { name: "Samuel Xavier", position: "DF", number: 14, nationality: "Brasil", clubs: "Fluminense, Corinthians", funFact: "Lateral-direito titular na campanha histórica de 2023." },
      { name: "André", position: "MF", number: 7, nationality: "Brasil", clubs: "Fluminense", funFact: "Volante revelação, destaque do meio-campo campeão." },
      { name: "Martinelli", position: "MF", number: 5, nationality: "Brasil", clubs: "Fluminense", funFact: "Volante de perfil defensivo, parceiro de André no meio-campo." },
      { name: "Ganso", position: "MF", number: 10, nationality: "Brasil", clubs: "Fluminense, São Paulo FC, Sevilla", funFact: "Camisa 10 e principal armador das jogadas ofensivas do time." },
      { name: "Jhon Arias", position: "MF", number: 21, nationality: "Colômbia", clubs: "Fluminense, América de Cali", funFact: "Meia-atacante colombiano, um dos destaques da campanha." },
      { name: "Germán Cano", position: "FW", number: 14, nationality: "Argentina", clubs: "Fluminense, Vasco da Gama", funFact: "Artilheiro argentino, decisivo em toda a campanha da Libertadores." },
      { name: "Keno", position: "FW", number: 11, nationality: "Brasil", clubs: "Fluminense, Atlético Mineiro", funFact: "Ponta veloz, importante nas jogadas de ataque do time campeão." },
    ],
  },
  {
    team: "Vasco da Gama",
    year: 2000,
    matchLabel: "Final do Mundial de Clubes",
    players: [
      { name: "Helton", position: "GK", number: 1, nationality: "Brasil", clubs: "Vasco da Gama, Porto", funFact: "Goleiro que mais tarde se destacou também no futebol português." },
      { name: "Odvan", position: "DF", number: 2, nationality: "Brasil", clubs: "Vasco da Gama", funFact: "Lateral-direito daquele elenco ofensivo do Vasco." },
      { name: "Gonçalves", position: "DF", number: 4, nationality: "Brasil", clubs: "Vasco da Gama", funFact: "Zagueiro titular no vice-campeonato mundial de clubes de 2000." },
      { name: "Ramon", position: "DF", number: 3, nationality: "Brasil", clubs: "Vasco da Gama", funFact: "Zagueiro que compunha a defesa do Vasco naquela temporada." },
      { name: "Cáceres", position: "DF", number: 6, nationality: "Paraguai", clubs: "Vasco da Gama", funFact: "Zagueiro paraguaio que reforçou o elenco vascaíno." },
      { name: "Vampeta", position: "MF", number: 5, nationality: "Brasil", clubs: "Vasco da Gama, Corinthians", funFact: "Volante daquele time, mais tarde também passou por grandes clubes brasileiros." },
      { name: "Juninho Pernambucano", position: "MF", number: 8, nationality: "Brasil", clubs: "Vasco da Gama, Olympique Lyonnais", shortName: "Juninho", funFact: "Um dos maiores cobradores de falta da história do futebol." },
      { name: "Pedrinho", position: "MF", number: 10, nationality: "Brasil", clubs: "Vasco da Gama", funFact: "Meio-campista daquele elenco ofensivo do Vasco." },
      { name: "Viola", position: "MF", number: 7, nationality: "Brasil", clubs: "Vasco da Gama", funFact: "Meia que compunha o setor criativo do time." },
      { name: "Romário", position: "FW", number: 11, nationality: "Brasil", clubs: "Vasco da Gama, Barcelona", funFact: "Um dos maiores artilheiros da história do futebol brasileiro." },
      { name: "Edmundo", position: "FW", number: 9, nationality: "Brasil", clubs: "Vasco da Gama, Fiorentina", funFact: "Apelidado de 'Animal', atacante decisivo daquele Vasco ofensivo." },
    ],
  },
  {
    team: "Santos",
    year: 2011,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "Rafael", position: "GK", number: 1, nationality: "Brasil", clubs: "Santos", funFact: "Goleiro daquele Santos jovem e ofensivo campeão da Libertadores." },
      { name: "Léo", position: "DF", number: 6, nationality: "Brasil", clubs: "Santos", funFact: "Lateral-esquerdo experiente daquele elenco." },
      { name: "Edu Dracena", position: "DF", number: 3, nationality: "Brasil", clubs: "Santos", funFact: "Zagueiro e um dos capitães do time campeão." },
      { name: "Durval", position: "DF", number: 4, nationality: "Brasil", clubs: "Santos", funFact: "Zagueiro que formou dupla de defesa com Edu Dracena." },
      { name: "Danilo", position: "DF", number: 2, nationality: "Brasil", clubs: "Santos, Porto", funFact: "Lateral-direito revelado nas categorias de base do Santos." },
      { name: "Arouca", position: "MF", number: 5, nationality: "Brasil", clubs: "Santos, Corinthians", funFact: "Volante de marcação, parceiro de Adriano no meio-campo." },
      { name: "Adriano", position: "MF", number: 8, nationality: "Brasil", clubs: "Santos", funFact: "Volante que dava equilíbrio ao setor criativo do time." },
      { name: "Elano", position: "MF", number: 7, nationality: "Brasil", clubs: "Santos, Manchester City", funFact: "Meia experiente, com passagens também pelo futebol europeu." },
      { name: "Ganso", position: "MF", number: 10, nationality: "Brasil", clubs: "Santos, São Paulo FC, Sevilla", funFact: "Camisa 10 talentoso, um dos destaques do time campeão." },
      { name: "Neymar", position: "FW", number: 11, nationality: "Brasil", clubs: "Santos, Barcelona, PSG", funFact: "Foi eleito o melhor jogador da Libertadores de 2011." },
      { name: "Borges", position: "FW", number: 9, nationality: "Brasil", clubs: "Santos", funFact: "Atacante artilheiro da campanha santista." },
    ],
  },
  {
    team: "Corinthians",
    year: 2000,
    matchLabel: "Final do Mundial de Clubes",
    players: [
      { name: "Dida", position: "GK", number: 1, nationality: "Brasil", clubs: "Corinthians, AC Milan", funFact: "Foi campeão do mundo com a seleção brasileira em 2002." },
      { name: "Zé Maria", position: "DF", number: 6, nationality: "Brasil", clubs: "Corinthians", funFact: "Lateral-esquerdo daquele elenco de 2000." },
      { name: "Fábio Luciano", position: "DF", number: 3, nationality: "Brasil", clubs: "Corinthians", funFact: "Zagueiro titular na conquista do primeiro Mundial de Clubes." },
      { name: "Índio", position: "DF", number: 4, nationality: "Brasil", clubs: "Corinthians", funFact: "Zagueiro que compunha a defesa do time campeão." },
      { name: "Rogério", position: "DF", number: 2, nationality: "Brasil", clubs: "Corinthians", funFact: "Lateral-direito daquele elenco corintiano." },
      { name: "Vampeta", position: "MF", number: 5, nationality: "Brasil", clubs: "Corinthians, Vasco da Gama", funFact: "Volante daquele Corinthians, ídolo em diferentes clubes brasileiros." },
      { name: "Giovanni", position: "MF", number: 8, nationality: "Brasil", clubs: "Corinthians, Barcelona", funFact: "Meio-campista habilidoso, depois seguiu carreira no futebol europeu." },
      { name: "Marcelinho Carioca", position: "MF", number: 10, nationality: "Brasil", clubs: "Corinthians", shortName: "Marcelinho", funFact: "Camisa 10 e ídolo, famoso pelos chutes de longa distância." },
      { name: "Ricardinho", position: "MF", number: 11, nationality: "Brasil", clubs: "Corinthians, Cruzeiro", funFact: "Meia criativo do elenco campeão mundial." },
      { name: "Luizão", position: "FW", number: 9, nationality: "Brasil", clubs: "Corinthians", funFact: "Artilheiro decisivo na conquista do título mundial." },
      { name: "Edilson", position: "FW", number: 7, nationality: "Brasil", clubs: "Corinthians", funFact: "Atacante habilidoso, parte do ataque daquele Corinthians." },
    ],
  },
  {
    team: "Palmeiras",
    year: 1999,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "Marcos", position: "GK", number: 1, nationality: "Brasil", clubs: "Palmeiras", funFact: "Foi o goleiro titular do Brasil na conquista do pentacampeonato em 2002." },
      { name: "Arce", position: "DF", number: 2, nationality: "Brasil", clubs: "Palmeiras", funFact: "Lateral daquele elenco palmeirense." },
      { name: "Roque Júnior", position: "DF", number: 4, nationality: "Brasil", clubs: "Palmeiras", funFact: "Zagueiro titular na conquista continental de 1999." },
      { name: "Júnior", position: "DF", number: 3, nationality: "Brasil", clubs: "Palmeiras", funFact: "Zagueiro que completava a defesa do time campeão." },
      { name: "Cléber", position: "DF", number: 6, nationality: "Brasil", clubs: "Palmeiras", funFact: "Lateral que compunha a defesa daquele Palmeiras." },
      { name: "César Sampaio", position: "MF", number: 5, nationality: "Brasil", clubs: "Palmeiras", funFact: "Volante de marcação, um dos pilares do meio-campo." },
      { name: "Zinho", position: "MF", number: 8, nationality: "Brasil", clubs: "Palmeiras", funFact: "Meio-campista experiente do elenco campeão." },
      { name: "Franco", position: "MF", number: 10, nationality: "Argentina", clubs: "Palmeiras", funFact: "Meio-campista argentino que reforçou o Palmeiras naquela época." },
      { name: "Galeano", position: "MF", number: 11, nationality: "Paraguai", clubs: "Palmeiras", funFact: "Meia paraguaio, peça importante do time de 1999." },
      { name: "Euller", position: "FW", number: 9, nationality: "Brasil", clubs: "Palmeiras", funFact: "Atacante daquele elenco campeão da Libertadores." },
      { name: "Oséas", position: "FW", number: 7, nationality: "Brasil", clubs: "Palmeiras", funFact: "Atacante conhecido pela finalização precisa dentro da área." },
    ],
  },
  {
    team: "Internacional",
    year: 2010,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "Muriel", position: "GK", number: 1, nationality: "Brasil", clubs: "Internacional", funFact: "Goleiro titular na segunda conquista da Libertadores do Internacional." },
      { name: "Marcão", position: "DF", number: 6, nationality: "Brasil", clubs: "Internacional", funFact: "Lateral-esquerdo daquele elenco campeão." },
      { name: "Índio", position: "DF", number: 4, nationality: "Brasil", clubs: "Internacional", funFact: "Zagueiro que também fez parte do título de 2006 e seguiu no clube." },
      { name: "Bolívar", position: "DF", number: 3, nationality: "Bolívia", clubs: "Internacional", funFact: "Zagueiro boliviano, peça importante da defesa em 2010." },
      { name: "Kléber", position: "DF", number: 2, nationality: "Brasil", clubs: "Internacional", funFact: "Lateral-direito daquele elenco colorado." },
      { name: "Elton", position: "MF", number: 5, nationality: "Brasil", clubs: "Internacional", funFact: "Volante de marcação do meio-campo colorado." },
      { name: "Andrezinho", position: "MF", number: 8, nationality: "Brasil", clubs: "Internacional", funFact: "Meio-campista daquele elenco de 2010." },
      { name: "D'Alessandro", position: "MF", number: 10, nationality: "Argentina", clubs: "Internacional", funFact: "Camisa 10 argentino, ídolo histórico do Internacional." },
      { name: "Taison", position: "MF", number: 11, nationality: "Brasil", clubs: "Internacional, Shakhtar Donetsk", funFact: "Ponta talentoso, revelado naquele Internacional." },
      { name: "Alecsandro", position: "FW", number: 9, nationality: "Brasil", clubs: "Internacional", funFact: "Atacante de área, artilheiro da campanha de 2010." },
      { name: "Giuliano", position: "FW", number: 7, nationality: "Brasil", clubs: "Internacional", funFact: "Meia-atacante jovem daquele elenco." },
    ],
  },
  {
    team: "Botafogo",
    year: 2024,
    matchLabel: "Final da Libertadores",
    players: [
      { name: "John", position: "GK", number: 1, nationality: "Brasil", clubs: "Botafogo", funFact: "Goleiro titular na histórica conquista da Libertadores de 2024." },
      { name: "Alex Telles", position: "DF", number: 6, nationality: "Brasil", clubs: "Botafogo, Manchester United", funFact: "Lateral-esquerdo experiente, com passagens pela Europa." },
      { name: "Bastos", position: "DF", number: 4, nationality: "Angola", clubs: "Botafogo", funFact: "Zagueiro angolano, um dos pilares da defesa campeã." },
      { name: "Adryelson", position: "DF", number: 3, nationality: "Brasil", clubs: "Botafogo", funFact: "Zagueiro que formou a dupla de defesa em 2024." },
      { name: "Mateo Ponte", position: "DF", number: 2, nationality: "Uruguai", clubs: "Botafogo", funFact: "Lateral uruguaio que reforçou o elenco alvinegro." },
      { name: "Marlon Freitas", position: "MF", number: 5, nationality: "Brasil", clubs: "Botafogo", funFact: "Volante e capitão do time campeão da Libertadores." },
      { name: "Gregore", position: "MF", number: 8, nationality: "Brasil", clubs: "Botafogo", funFact: "Volante de marcação forte no meio-campo botafoguense." },
      { name: "Danilo Barbosa", position: "MF", number: 25, nationality: "Brasil", clubs: "Botafogo", funFact: "Meio-campista que completava o trio de volantes." },
      { name: "Savarino", position: "FW", number: 11, nationality: "Venezuela", clubs: "Botafogo", funFact: "Ponta venezuelano, um dos destaques ofensivos do time." },
      { name: "Tiquinho Soares", position: "FW", number: 9, nationality: "Brasil", clubs: "Botafogo", shortName: "Tiquinho", funFact: "Artilheiro decisivo na campanha histórica de 2024." },
      { name: "Luiz Henrique", position: "FW", number: 7, nationality: "Brasil", clubs: "Botafogo, Zenit", funFact: "Ponta rápido, importante nas jogadas ofensivas do título." },
    ],
  },
];

// ============ CLUBS MODE DATA ============
// clubs are shown upfront (proper nouns, language-neutral); hints are optional, per language
// ============ YEAR MODE DATA ============
const YEAR_QUESTION_POOL = [
  {
    fact: {
      en: "Neymar left Barcelona for PSG in what was, at the time, the most expensive transfer in football history.",
      pt: "Neymar deixou o Barcelona rumo ao PSG na transferência mais cara da história do futebol até então.",
      es: "Neymar dejó el Barcelona rumbo al PSG en el traspaso más caro de la historia del fútbol hasta entonces.",
    },
    options: [2015, 2016, 2017, 2018],
    answer: 2017,
  },
  {
    fact: {
      en: "Leicester City won the Premier League title as one of the biggest underdog stories in sports history.",
      pt: "O Leicester City venceu a Premier League, uma das maiores zebras da história do esporte.",
      es: "El Leicester City ganó la Premier League, una de las mayores sorpresas de la historia del deporte.",
    },
    options: [2014, 2015, 2016, 2017],
    answer: 2016,
  },
  {
    fact: {
      en: "France won its first World Cup title, hosting the tournament on home soil.",
      pt: "A França conquistou seu primeiro título mundial, sediando o torneio em casa.",
      es: "Francia ganó su primer título mundial, siendo anfitriona del torneo.",
    },
    options: [1994, 1998, 2002, 2006],
    answer: 1998,
  },
  {
    fact: {
      en: "Cristiano Ronaldo scored a famous overhead-kick goal against Juventus in the Champions League quarterfinals.",
      pt: "Cristiano Ronaldo marcou um gol de bicicleta famoso contra a Juventus nas quartas de final da Champions League.",
      es: "Cristiano Ronaldo marcó un famoso gol de chilena ante la Juventus en los cuartos de final de la Champions League.",
    },
    options: [2016, 2017, 2018, 2019],
    answer: 2018,
  },
  {
    fact: {
      en: "Lionel Messi won his very first Ballon d'Or award.",
      pt: "Lionel Messi venceu sua primeira Bola de Ouro.",
      es: "Lionel Messi ganó su primer Balón de Oro.",
    },
    options: [2008, 2009, 2010, 2011],
    answer: 2009,
  },
  {
    fact: {
      en: "Spain won its first World Cup title, beating the Netherlands in the final.",
      pt: "A Espanha conquistou seu primeiro título mundial, vencendo a Holanda na final.",
      es: "España ganó su primer título mundial, venciendo a los Países Bajos en la final.",
    },
    options: [2008, 2010, 2012, 2014],
    answer: 2010,
  },
  {
    fact: {
      en: "Argentina won the World Cup in Qatar, with Messi lifting the trophy at last.",
      pt: "A Argentina venceu a Copa do Mundo no Catar, com Messi finalmente erguendo a taça.",
      es: "Argentina ganó el Mundial de Catar, con Messi levantando por fin el trofeo.",
    },
    options: [2018, 2019, 2022, 2026],
    answer: 2022,
  },
  {
    fact: {
      en: "Zinedine Zidane was sent off for a headbutt in his final match as a player, the World Cup final.",
      pt: "Zinedine Zidane foi expulso por uma cabeçada em sua última partida como jogador, a final da Copa do Mundo.",
      es: "Zinedine Zidane fue expulsado por un cabezazo en su último partido como jugador, la final del Mundial.",
    },
    options: [2002, 2006, 2010, 2014],
    answer: 2006,
  },
  {
    fact: {
      en: "Barcelona overturned a 4-0 first-leg deficit to beat PSG 6-1, in a comeback known as 'La Remontada'.",
      pt: "O Barcelona virou um placar de 4 a 0 do jogo de ida para vencer o PSG por 6 a 1, virada conhecida como 'La Remontada'.",
      es: "El Barcelona remontó un 4-0 del partido de ida para vencer al PSG 6-1, remontada conocida como 'La Remontada'.",
    },
    options: [2015, 2016, 2017, 2018],
    answer: 2017,
  },
  {
    fact: {
      en: "Real Madrid completed an unprecedented three consecutive Champions League titles.",
      pt: "O Real Madrid completou uma sequência inédita de três títulos consecutivos da Champions League.",
      es: "El Real Madrid completó una racha inédita de tres títulos consecutivos de la Champions League.",
    },
    options: [2016, 2017, 2018, 2019],
    answer: 2018,
  },
  {
    fact: {
      en: "Liverpool won an all-English Champions League final against Tottenham.",
      pt: "O Liverpool venceu uma final da Champions League totalmente inglesa, contra o Tottenham.",
      es: "El Liverpool ganó una final de la Champions League totalmente inglesa, ante el Tottenham.",
    },
    options: [2018, 2019, 2020, 2021],
    answer: 2019,
  },
  {
    fact: {
      en: "Manchester City won the first Champions League title in the club's history.",
      pt: "O Manchester City conquistou o primeiro título da Champions League da história do clube.",
      es: "El Manchester City conquistó el primer título de la Champions League en la historia del club.",
    },
    options: [2021, 2022, 2023, 2024],
    answer: 2023,
  },
  {
    fact: {
      en: "Diego Maradona scored both the 'Hand of God' goal and the 'Goal of the Century' in the same World Cup match.",
      pt: "Diego Maradona marcou o gol da 'Mão de Deus' e o 'Gol do Século' na mesma partida de Copa do Mundo.",
      es: "Diego Maradona marcó el gol de la 'Mano de Dios' y el 'Gol del Siglo' en el mismo partido del Mundial.",
    },
    options: [1982, 1986, 1990, 1994],
    answer: 1986,
  },
  {
    fact: {
      en: "Portugal won its first major international title, the European Championship.",
      pt: "Portugal conquistou seu primeiro grande título internacional, a Eurocopa.",
      es: "Portugal ganó su primer gran título internacional, la Eurocopa.",
    },
    options: [2012, 2014, 2016, 2018],
    answer: 2016,
  },
  {
    fact: {
      en: "Zlatan Ibrahimovic scored an overhead-kick goal for Sweden that was voted goal of the year.",
      pt: "Zlatan Ibrahimović marcou um gol de bicicleta pela Suécia que foi eleito o gol do ano.",
      es: "Zlatan Ibrahimović marcó un gol de chilena con Suecia que fue elegido gol del año.",
    },
    options: [2010, 2012, 2014, 2016],
    answer: 2012,
  },
];

// ============ BRAZIL YEAR MODE DATA (Portuguese-only exclusive mode) ============
const BRAZIL_YEAR_QUESTION_POOL = [
  {
    fact: "O Brasil conquistou seu quinto título mundial, disputado no Japão e na Coreia do Sul.",
    options: [1998, 2002, 2006, 2010],
    answer: 2002,
  },
  {
    fact: "A Alemanha goleou o Brasil por 7 a 1 numa semifinal chocante de Copa do Mundo, em solo brasileiro.",
    options: [2010, 2014, 2018, 2022],
    answer: 2014,
  },
  {
    fact: "O Flamengo venceu a Copa Libertadores com uma virada dramática nos minutos finais contra o River Plate.",
    options: [2017, 2018, 2019, 2020],
    answer: 2019,
  },
  {
    fact: "O Corinthians venceu o primeiro Mundial de Clubes da FIFA, batendo o Vasco da Gama nos pênaltis.",
    options: [1998, 2000, 2002, 2004],
    answer: 2000,
  },
  {
    fact: "Pelé marcou seu milésimo gol na carreira profissional.",
    options: [1966, 1969, 1972, 1975],
    answer: 1969,
  },
  {
    fact: "O Uruguai surpreendeu o Brasil anfitrião e venceu a final da Copa do Mundo no Maracanã, resultado ainda lembrado como o 'Maracanaço'.",
    options: [1946, 1950, 1954, 1958],
    answer: 1950,
  },
  {
    fact: "O Brasil conquistou seu quarto título mundial, vencendo a Itália nos pênaltis, nos Estados Unidos.",
    options: [1990, 1994, 1998, 2002],
    answer: 1994,
  },
  {
    fact: "O Brasil venceu sua segunda Copa do Mundo consecutiva, disputada no Chile.",
    options: [1958, 1962, 1966, 1970],
    answer: 1962,
  },
  {
    fact: "Pelé se tornou o campeão mundial mais jovem da história, aos 17 anos, na Suécia.",
    options: [1954, 1958, 1962, 1966],
    answer: 1958,
  },
  {
    fact: "O Santos, com Pelé em campo, venceu a Copa Intercontinental pela segunda vez consecutiva.",
    options: [1961, 1962, 1963, 1964],
    answer: 1963,
  },
  {
    fact: "O São Paulo venceu o Mundial de Clubes da FIFA, batendo o Liverpool na final.",
    options: [2003, 2004, 2005, 2006],
    answer: 2005,
  },
  {
    fact: "O Grêmio conquistou a Copa Libertadores sob o comando de Renato Gaúcho.",
    options: [2015, 2016, 2017, 2018],
    answer: 2017,
  },
  {
    fact: "O Botafogo venceu a Copa Libertadores pela primeira vez na história do clube.",
    options: [2022, 2023, 2024, 2025],
    answer: 2024,
  },
  {
    fact: "Neymar fez sua estreia pela seleção brasileira principal.",
    options: [2009, 2010, 2011, 2012],
    answer: 2010,
  },
  {
    fact: "Zico teve um gol polêmico anulado contra a França em um jogo memorável de quartas de final de Copa do Mundo.",
    options: [1982, 1986, 1990, 1994],
    answer: 1986,
  },
];


const CLUBS_QUESTION_POOL = [
  {
    name: "Zinedine Zidane",
    clubs: ["Cannes", "Bordeaux", "Juventus", "Real Madrid"],
    hints: {
      en: ["Nationality: France", "Position: Attacking midfielder", "Won the World Cup in 1998", "Scored a famous volley in the 2002 Champions League final", "Later became a very successful head coach"],
      pt: ["Nacionalidade: França", "Posição: Meia-atacante", "Venceu a Copa do Mundo de 1998", "Marcou um voleio famoso na final da Champions League de 2002", "Mais tarde se tornou um técnico muito bem-sucedido"],
      es: ["Nacionalidad: Francia", "Posición: Mediapunta", "Ganó el Mundial de 1998", "Marcó una volea famosa en la final de la Champions League de 2002", "Más tarde se convirtió en un entrenador muy exitoso"],
    },
  },
  {
    name: "Ronaldinho",
    clubs: ["Gremio", "PSG", "Barcelona", "AC Milan", "Flamengo", "Atletico Mineiro", "Queretaro", "Fluminense"],
    hints: {
      en: ["Nationality: Brazil", "Position: Forward / winger", "Won the World Cup in 2002", "Won the Ballon d'Or in 2005", "Famous for his skill, flair, and constant smile"],
      pt: ["Nacionalidade: Brasil", "Posição: Atacante / ponta", "Venceu a Copa do Mundo de 2002", "Venceu a Bola de Ouro em 2005", "Famoso pela habilidade, criatividade e sorriso constante"],
      es: ["Nacionalidad: Brasil", "Posición: Delantero / extremo", "Ganó el Mundial de 2002", "Ganó el Balón de Oro en 2005", "Famoso por su habilidad, creatividad y sonrisa constante"],
    },
  },
  {
    name: "Andrea Pirlo",
    clubs: ["Brescia", "Inter Milan", "AC Milan", "Juventus", "New York City FC"],
    hints: {
      en: ["Nationality: Italy", "Position: Deep-lying playmaker", "Won the World Cup in 2006", "Reinvented his career at Juventus after leaving Milan", "Famous for his elegant, pinpoint passing range"],
      pt: ["Nacionalidade: Itália", "Posição: Armador recuado", "Venceu a Copa do Mundo de 2006", "Reinventou a carreira na Juventus após sair do Milan", "Famoso pelos passes elegantes e precisos de longa distância"],
      es: ["Nacionalidad: Italia", "Posición: Armador retrasado", "Ganó el Mundial de 2006", "Reinventó su carrera en la Juventus tras dejar el Milan", "Famoso por sus pases elegantes y precisos de larga distancia"],
    },
  },
  {
    name: "Didier Drogba",
    clubs: ["Le Mans", "Guingamp", "Marseille", "Chelsea", "Shanghai Shenhua", "Galatasaray", "Montreal Impact"],
    hints: {
      en: ["Nationality: Ivory Coast", "Position: Striker", "Scored the winning penalty in the 2012 Champions League final", "Chelsea's iconic number 11 for many years", "Widely credited with helping ease tensions during Ivory Coast's civil conflict"],
      pt: ["Nacionalidade: Costa do Marfim", "Posição: Atacante", "Marcou o pênalti decisivo na final da Champions League de 2012", "Camisa 11 icônico do Chelsea por muitos anos", "Amplamente reconhecido por ajudar a aliviar tensões durante o conflito civil na Costa do Marfim"],
      es: ["Nacionalidad: Costa de Marfil", "Posición: Delantero", "Marcó el penalti decisivo en la final de la Champions League de 2012", "Dorsal 11 icónico del Chelsea durante muchos años", "Ampliamente reconocido por ayudar a aliviar tensiones durante el conflicto civil en Costa de Marfil"],
    },
  },
  {
    name: "Andres Iniesta",
    clubs: ["Barcelona", "Vissel Kobe", "Emirates Club"],
    hints: {
      en: ["Nationality: Spain", "Position: Central midfielder", "Scored the winning goal in the 2010 World Cup final", "Won the treble with Barcelona in 2009", "Known for his close control and calm dribbling under pressure"],
      pt: ["Nacionalidade: Espanha", "Posição: Meio-campista central", "Marcou o gol da vitória na final da Copa do Mundo de 2010", "Venceu a tríplice coroa com o Barcelona em 2009", "Conhecido pelo controle de bola refinado e drible calmo sob pressão"],
      es: ["Nacionalidad: España", "Posición: Centrocampista central", "Marcó el gol de la victoria en la final del Mundial de 2010", "Ganó el triplete con el Barcelona en 2009", "Conocido por su control de balón refinado y su regate calmado bajo presión"],
    },
  },
  {
    name: "Luis Figo",
    clubs: ["Sporting CP", "Barcelona", "Real Madrid", "Inter Milan"],
    hints: {
      en: ["Nationality: Portugal", "Position: Winger", "His controversial transfer between two rivals shocked football in 2000", "Won the Ballon d'Or in 2000", "Was famously pelted with objects, including a pig's head, on his return to his old club"],
      pt: ["Nacionalidade: Portugal", "Posição: Ponta", "Sua transferência polêmica entre dois rivais chocou o futebol em 2000", "Venceu a Bola de Ouro em 2000", "Ficou famoso por ser alvo de objetos, incluindo uma cabeça de porco, ao retornar ao antigo clube"],
      es: ["Nacionalidad: Portugal", "Posición: Extremo", "Su polémico traspaso entre dos rivales conmocionó al fútbol en 2000", "Ganó el Balón de Oro en 2000", "Fue célebremente blanco de objetos, incluida una cabeza de cerdo, al regresar a su antiguo club"],
    },
  },
  {
    name: "Xabi Alonso",
    clubs: ["Real Sociedad", "Liverpool", "Real Madrid", "Bayern Munich"],
    hints: {
      en: ["Nationality: Spain", "Position: Deep-lying midfielder", "Won the 2005 Champions League final after being 3-0 down at half-time", "Later became a head coach", "Known for his precise long diagonal passes"],
      pt: ["Nacionalidade: Espanha", "Posição: Meio-campista recuado", "Venceu a final da Champions League de 2005 após estar perdendo por 3 a 0 no intervalo", "Mais tarde se tornou técnico", "Conhecido pelos passes longos e precisos na diagonal"],
      es: ["Nacionalidad: España", "Posición: Centrocampista retrasado", "Ganó la final de la Champions League de 2005 tras ir perdiendo 3-0 al descanso", "Más tarde se convirtió en entrenador", "Conocido por sus pases largos y precisos en diagonal"],
    },
  },
  {
    name: "Hernan Crespo",
    clubs: ["River Plate", "Parma", "Lazio", "Inter Milan", "Chelsea", "AC Milan"],
    hints: {
      en: ["Nationality: Argentina", "Position: Striker", "Once broke the world transfer record fee for a player", "Scored two goals in the 2005 Champions League final for Milan", "Played for an unusually large number of major European clubs"],
      pt: ["Nacionalidade: Argentina", "Posição: Atacante", "Já bateu o recorde mundial de valor de transferência para um jogador", "Marcou dois gols na final da Champions League de 2005 pelo Milan", "Jogou por um número incomum de grandes clubes europeus"],
      es: ["Nacionalidad: Argentina", "Posición: Delantero", "Llegó a batir el récord mundial de traspaso más caro para un jugador", "Marcó dos goles en la final de la Champions League de 2005 con el Milan", "Jugó en un número inusualmente grande de grandes clubes europeos"],
    },
  },
  {
    name: "Michael Essien",
    clubs: ["Bastia", "Lyon", "Chelsea", "Real Madrid", "AC Milan"],
    hints: {
      en: ["Nationality: Ghana", "Position: Box-to-box midfielder", "Nicknamed 'The Bison' for his physical power", "Known for thunderous long-range shots", "Key part of Chelsea's dominant mid-2000s midfield"],
      pt: ["Nacionalidade: Gana", "Posição: Meio-campista box-to-box", "Apelidado de 'O Bisão' pela força física", "Conhecido pelos chutes potentes de longa distância", "Peça-chave do meio-campo dominante do Chelsea em meados dos anos 2000"],
      es: ["Nacionalidad: Ghana", "Posición: Centrocampista box-to-box", "Apodado 'El Bisonte' por su fuerza física", "Conocido por sus disparos potentes de larga distancia", "Pieza clave del mediocampo dominante del Chelsea a mediados de los años 2000"],
    },
  },
  {
    name: "Robinho",
    clubs: ["Santos", "Real Madrid", "Manchester City", "AC Milan"],
    hints: {
      en: ["Nationality: Brazil", "Position: Forward", "Hyped as Ronaldinho's heir when he joined Real Madrid", "Was Manchester City's first marquee signing after its 2008 takeover", "Known for flashy dribbling and quick feet"],
      pt: ["Nacionalidade: Brasil", "Posição: Atacante", "Chegou ao Real Madrid com a fama de herdeiro do Ronaldinho", "Foi a primeira grande contratação do Manchester City após a compra do clube em 2008", "Conhecido pelo drible vistoso e pés rápidos"],
      es: ["Nacionalidad: Brasil", "Posición: Delantero", "Llegó al Real Madrid con la fama de heredero de Ronaldinho", "Fue el primer gran fichaje del Manchester City tras la compra del club en 2008", "Conocido por su regate vistoso y pies rápidos"],
    },
  },
  {
    name: "Samuel Eto'o",
    clubs: ["Real Madrid", "Mallorca", "Barcelona", "Inter Milan", "Anzhi Makhachkala", "Chelsea", "Everton", "Sampdoria"],
    hints: {
      en: ["Nationality: Cameroon", "Position: Striker", "Won the Champions League with three different clubs", "Four-time African Footballer of the Year", "Known for his blistering pace and clinical finishing"],
      pt: ["Nacionalidade: Camarões", "Posição: Atacante", "Venceu a Champions League por três clubes diferentes", "Eleito quatro vezes o melhor jogador africano", "Conhecido pela velocidade impressionante e finalização precisa"],
      es: ["Nacionalidad: Camerún", "Posición: Delantero", "Ganó la Champions League con tres clubes distintos", "Elegido cuatro veces mejor futbolista africano", "Conocido por su velocidad impresionante y definición precisa"],
    },
  },
  {
    name: "Wesley Sneijder",
    clubs: ["Ajax", "Real Madrid", "Inter Milan", "Galatasaray", "Nice"],
    hints: {
      en: ["Nationality: Netherlands", "Position: Attacking midfielder", "Reached three Champions League finals with three different clubs", "Was runner-up for the Ballon d'Or in 2010", "Later became a hugely popular star in Turkey"],
      pt: ["Nacionalidade: Holanda", "Posição: Meia-atacante", "Chegou a três finais de Champions League por três clubes diferentes", "Foi vice na Bola de Ouro de 2010", "Depois se tornou um astro muito popular na Turquia"],
      es: ["Nacionalidad: Países Bajos", "Posición: Mediapunta", "Llegó a tres finales de Champions League con tres clubes distintos", "Fue subcampeón del Balón de Oro en 2010", "Después se convirtió en una estrella muy popular en Turquía"],
    },
  },
  {
    name: "David Villa",
    clubs: ["Sporting Gijon", "Valencia", "Barcelona", "Atletico Madrid", "New York City FC"],
    hints: {
      en: ["Nationality: Spain", "Position: Striker", "Is Spain's all-time record goalscorer", "Won the World Cup in 2010", "Later became a pioneer for Spanish players in Major League Soccer"],
      pt: ["Nacionalidade: Espanha", "Posição: Atacante", "É o maior artilheiro da história da seleção espanhola", "Venceu a Copa do Mundo de 2010", "Mais tarde se tornou pioneiro entre espanhóis na Major League Soccer"],
      es: ["Nacionalidad: España", "Posición: Delantero", "Es el máximo goleador histórico de la selección española", "Ganó el Mundial de 2010", "Después se convirtió en pionero entre españoles en la Major League Soccer"],
    },
  },
  {
    name: "Carlos Tevez",
    clubs: ["Boca Juniors", "West Ham", "Manchester United", "Manchester City", "Juventus"],
    hints: {
      en: ["Nationality: Argentina", "Position: Striker", "Nicknamed 'El Apache'", "Won league titles in four different countries", "Known for his relentless work rate and passionate celebrations"],
      pt: ["Nacionalidade: Argentina", "Posição: Atacante", "Apelidado de 'El Apache'", "Venceu campeonatos nacionais em quatro países diferentes", "Conhecido pela entrega em campo e comemorações passionais"],
      es: ["Nacionalidad: Argentina", "Posición: Delantero", "Apodado 'El Apache'", "Ganó ligas nacionales en cuatro países distintos", "Conocido por su entrega en el campo y celebraciones apasionadas"],
    },
  },
  {
    name: "Robin van Persie",
    clubs: ["Feyenoord", "Arsenal", "Manchester United", "Fenerbahce"],
    hints: {
      en: ["Nationality: Netherlands", "Position: Striker", "Won the Premier League Golden Boot twice", "Scored a famous diving header against Spain at the 2014 World Cup", "Left-footed finisher known for his technique"],
      pt: ["Nacionalidade: Holanda", "Posição: Atacante", "Venceu a artilharia da Premier League duas vezes", "Marcou um famoso gol de cabeça voando contra a Espanha na Copa de 2014", "Finalizador canhoto conhecido pela técnica"],
      es: ["Nacionalidad: Países Bajos", "Posición: Delantero", "Ganó el máximo goleador de la Premier League dos veces", "Marcó un famoso gol de cabeza volando ante España en el Mundial de 2014", "Finalizador zurdo conocido por su técnica"],
    },
  },
  {
    name: "Angel Di Maria",
    clubs: ["Rosario Central", "Benfica", "Real Madrid", "Manchester United", "PSG", "Juventus"],
    hints: {
      en: ["Nationality: Argentina", "Position: Winger", "Scored the winning goal in the 2014 Champions League final", "Won the World Cup with Argentina in 2022", "Known for his pace and delivery from wide areas"],
      pt: ["Nacionalidade: Argentina", "Posição: Ponta", "Marcou o gol da vitória na final da Champions League de 2014", "Venceu a Copa do Mundo com a Argentina em 2022", "Conhecido pela velocidade e cruzamentos precisos pelas pontas"],
      es: ["Nacionalidad: Argentina", "Posición: Extremo", "Marcó el gol de la victoria en la final de la Champions League de 2014", "Ganó el Mundial con Argentina en 2022", "Conocido por su velocidad y centros precisos desde las bandas"],
    },
  },
  {
    name: "Radamel Falcao",
    clubs: ["River Plate", "Porto", "Atletico Madrid", "Monaco", "Manchester United", "Galatasaray"],
    hints: {
      en: ["Nationality: Colombia", "Position: Striker", "Nicknamed 'El Tigre'", "Prolific scorer in the Europa League with two different clubs", "Missed the 2014 World Cup through injury despite being one of the world's top strikers"],
      pt: ["Nacionalidade: Colômbia", "Posição: Atacante", "Apelidado de 'El Tigre'", "Artilheiro prolífico da Liga Europa por dois clubes diferentes", "Ficou fora da Copa de 2014 por lesão apesar de ser um dos melhores atacantes do mundo"],
      es: ["Nacionalidad: Colombia", "Posición: Delantero", "Apodado 'El Tigre'", "Goleador prolífico de la Europa League con dos clubes distintos", "Se perdió el Mundial de 2014 por lesión pese a ser uno de los mejores delanteros del mundo"],
    },
  },
  {
    name: "Edinson Cavani",
    clubs: ["Danubio", "Palermo", "Napoli", "PSG", "Manchester United", "Valencia"],
    hints: {
      en: ["Nationality: Uruguay", "Position: Striker", "Held PSG's all-time scoring record for years, until Mbappe surpassed him in 2023", "Nicknamed 'El Matador'", "Known for his acrobatic finishing and scissor-kick goals"],
      pt: ["Nacionalidade: Uruguai", "Posição: Atacante", "Foi o maior artilheiro da história do Paris Saint-Germain por anos, até ser superado por Mbappé em 2023", "Apelidado de 'El Matador'", "Conhecido pelas finalizações acrobáticas e gols de bicicleta"],
      es: ["Nacionalidad: Uruguay", "Posición: Delantero", "Fue el máximo goleador histórico del Paris Saint-Germain durante años, hasta que Mbappé lo superó en 2023", "Apodado 'El Matador'", "Conocido por sus definiciones acrobáticas y goles de chilena"],
    },
  },
  {
    name: "Diego Forlan",
    clubs: ["Independiente", "Manchester United", "Villarreal", "Atletico Madrid", "Inter Milan"],
    hints: {
      en: ["Nationality: Uruguay", "Position: Striker", "Won the Golden Ball as best player of the 2010 World Cup", "Won the European Golden Shoe twice with two different clubs", "Comes from a family of professional footballers and racing drivers"],
      pt: ["Nacionalidade: Uruguai", "Posição: Atacante", "Venceu a Bola de Ouro de melhor jogador da Copa de 2010", "Venceu a Chuteira de Ouro europeia duas vezes por dois clubes diferentes", "Vem de uma família de jogadores profissionais e pilotos de corrida"],
      es: ["Nacionalidad: Uruguay", "Posición: Delantero", "Ganó el Balón de Oro al mejor jugador del Mundial de 2010", "Ganó la Bota de Oro europea dos veces con dos clubes distintos", "Viene de una familia de futbolistas profesionales y pilotos de carreras"],
    },
  },
  {
    name: "Javier Mascherano",
    clubs: ["River Plate", "Corinthians", "West Ham", "Liverpool", "Barcelona"],
    hints: {
      en: ["Nationality: Argentina", "Position: Defensive midfielder", "Converted from midfielder to centre-back later in his career at Barcelona", "Won the treble with Barcelona in 2015", "Known for his relentless tackling and leadership"],
      pt: ["Nacionalidade: Argentina", "Posição: Volante", "Converteu-se de volante para zagueiro mais tarde no Barcelona", "Venceu a tríplice coroa com o Barcelona em 2015", "Conhecido pela marcação implacável e liderança em campo"],
      es: ["Nacionalidad: Argentina", "Posición: Volante", "Se reconvirtió de volante a defensor central más tarde en el Barcelona", "Ganó el triplete con el Barcelona en 2015", "Conocido por su marca implacable y liderazgo en el campo"],
    },
  },
  {
    name: "Zlatan Ibrahimovic",
    clubs: ["Malmo", "Ajax", "Juventus", "Inter Milan", "Barcelona", "AC Milan", "PSG", "Manchester United", "LA Galaxy"],
    hints: {
      en: ["Nationality: Sweden", "Position: Striker", "Played for a remarkable number of major European giants", "Scored a famous bicycle-kick voted goal of the year for Sweden", "Known for outspoken confidence and quotable statements"],
      pt: ["Nacionalidade: Suécia", "Posição: Atacante", "Jogou por um número impressionante de gigantes europeus", "Marcou um gol de bicicleta famoso pela Suécia, eleito gol do ano", "Conhecido pela confiança extrema e frases marcantes"],
      es: ["Nacionalidad: Suecia", "Posición: Delantero", "Jugó en un número impresionante de gigantes europeos", "Marcó un gol de chilena famoso con Suecia, elegido gol del año", "Conocido por su confianza extrema y frases memorables"],
    },
  },
  {
    name: "Thierry Henry",
    clubs: ["Monaco", "Juventus", "Arsenal", "Barcelona", "New York Red Bulls"],
    hints: {
      en: ["Nationality: France", "Position: Striker", "Is Arsenal's all-time record goalscorer", "Won the World Cup in 1998", "Part of Arsenal's unbeaten 'Invincibles' season"],
      pt: ["Nacionalidade: França", "Posição: Atacante", "É o maior artilheiro da história do Arsenal", "Venceu a Copa do Mundo de 1998", "Fez parte da temporada invicta dos 'Invencíveis' do Arsenal"],
      es: ["Nacionalidad: Francia", "Posición: Delantero", "Es el máximo goleador histórico del Arsenal", "Ganó el Mundial de 1998", "Formó parte de la temporada invicta de los 'Invencibles' del Arsenal"],
    },
  },
  {
    name: "Ronaldo Nazario",
    clubs: ["Cruzeiro", "PSV", "Barcelona", "Inter Milan", "Real Madrid", "AC Milan", "Corinthians"],
    hints: {
      en: ["Nationality: Brazil", "Position: Striker", "Nicknamed 'The Phenomenon'", "Won the World Cup in 1994 and 2002", "Suffered serious knee injuries that interrupted his prime years"],
      pt: ["Nacionalidade: Brasil", "Posição: Atacante", "Apelidado de 'Fenômeno'", "Venceu a Copa do Mundo de 1994 e 2002", "Sofreu graves lesões no joelho que interromperam seu auge"],
      es: ["Nacionalidad: Brasil", "Posición: Delantero", "Apodado 'El Fenómeno'", "Ganó el Mundial de 1994 y 2002", "Sufrió graves lesiones de rodilla que interrumpieron su mejor etapa"],
    },
  },
  {
    name: "Roberto Carlos",
    clubs: ["Palmeiras", "Inter Milan", "Real Madrid", "Fenerbahce", "Corinthians"],
    hints: {
      en: ["Nationality: Brazil", "Position: Left-back", "Famous for a physics-defying free kick against France in 1997", "Won the Champions League three times", "Known for his powerful long-range shots"],
      pt: ["Nacionalidade: Brasil", "Posição: Lateral-esquerdo", "Famoso por uma cobrança de falta contra a França em 1997 que desafiava a física", "Venceu a Champions League três vezes", "Conhecido pelos chutes potentes de longa distância"],
      es: ["Nacionalidad: Brasil", "Posición: Lateral izquierdo", "Famoso por un tiro libre ante Francia en 1997 que desafiaba la física", "Ganó la Champions League tres veces", "Conocido por sus disparos potentes de larga distancia"],
    },
  },
  {
    name: "Deco",
    clubs: ["Nacional", "Benfica", "Porto", "Barcelona", "Chelsea"],
    hints: {
      en: ["Nationality: Portugal (born in Brazil)", "Position: Attacking midfielder", "Won the Champions League with two different clubs", "Naturalized as Portuguese to play for the national team", "Was a Ballon d'Or contender multiple times without ever winning it"],
      pt: ["Nacionalidade: Portugal (nascido no Brasil)", "Posição: Meia-atacante", "Venceu a Champions League por dois clubes diferentes", "Naturalizou-se português para jogar pela seleção", "Ficou entre os favoritos à Bola de Ouro várias vezes sem nunca vencer"],
      es: ["Nacionalidad: Portugal (nacido en Brasil)", "Posición: Mediapunta", "Ganó la Champions League con dos clubes distintos", "Se naturalizó portugués para jugar con la selección", "Estuvo entre los favoritos al Balón de Oro varias veces sin ganarlo nunca"],
    },
  },
  {
    name: "Michael Ballack",
    clubs: ["Chemnitzer", "Kaiserslautern", "Bayer Leverkusen", "Bayern Munich", "Chelsea"],
    hints: {
      en: ["Nationality: Germany", "Position: Midfielder", "Reached three different Champions League finals with three different clubs, losing all three", "Captained Germany at a World Cup", "Known for his powerful long-range shooting and aerial ability"],
      pt: ["Nacionalidade: Alemanha", "Posição: Meio-campista", "Chegou a três finais de Champions League por três clubes diferentes, perdendo todas", "Foi capitão da Alemanha em uma Copa do Mundo", "Conhecido pelo chute forte de longa distância e força no jogo aéreo"],
      es: ["Nacionalidad: Alemania", "Posición: Centrocampista", "Llegó a tres finales de Champions League con tres clubes distintos, perdiendo las tres", "Fue capitán de Alemania en un Mundial", "Conocido por su disparo potente de larga distancia y fuerza en el juego aéreo"],
    },
  },
  {
    name: "Alessandro Nesta",
    clubs: ["Lazio", "AC Milan", "Montreal Impact"],
    hints: {
      en: ["Nationality: Italy", "Position: Centre-back", "Won the World Cup in 2006", "Considered one of the finest defenders of his generation", "Later became a Major League Soccer head coach"],
      pt: ["Nacionalidade: Itália", "Posição: Zagueiro", "Venceu a Copa do Mundo de 2006", "Considerado um dos melhores zagueiros de sua geração", "Mais tarde se tornou técnico na Major League Soccer"],
      es: ["Nacionalidad: Italia", "Posición: Defensor central", "Ganó el Mundial de 2006", "Considerado uno de los mejores defensores de su generación", "Después se convirtió en entrenador en la Major League Soccer"],
    },
  },
  {
    name: "Gianluigi Buffon",
    clubs: ["Parma", "Juventus", "PSG"],
    hints: {
      en: ["Nationality: Italy", "Position: Goalkeeper", "Won the World Cup in 2006", "Holds the record for most Serie A appearances", "Played at a top level into his 40s"],
      pt: ["Nacionalidade: Itália", "Posição: Goleiro", "Venceu a Copa do Mundo de 2006", "Detém o recorde de mais jogos na história da Série A", "Jogou em alto nível até depois dos 40 anos"],
      es: ["Nacionalidad: Italia", "Posición: Portero", "Ganó el Mundial de 2006", "Posee el récord de más partidos en la historia de la Serie A", "Jugó a alto nivel hasta pasados los 40 años"],
    },
  },
  {
    name: "Petr Cech",
    clubs: ["Chmel Blsany", "Sparta Prague", "Rennes", "Chelsea", "Arsenal"],
    hints: {
      en: ["Nationality: Czech Republic", "Position: Goalkeeper", "Known for wearing a protective headguard after a serious head injury", "Holds a Premier League record for clean sheets", "Later worked in an ice hockey-related front office role after retiring"],
      pt: ["Nacionalidade: República Tcheca", "Posição: Goleiro", "Conhecido por usar capacete de proteção após uma grave lesão na cabeça", "Detém um recorde da Premier League de jogos sem sofrer gols", "Depois de aposentado, trabalhou em uma função ligada ao hóquei no gelo"],
      es: ["Nacionalidad: República Checa", "Posición: Portero", "Conocido por usar un casco de protección tras una grave lesión en la cabeza", "Posee un récord de la Premier League de partidos sin recibir goles", "Tras retirarse, trabajó en un puesto relacionado con el hockey sobre hielo"],
    },
  },
  {
    name: "Fernando Torres",
    clubs: ["Atletico Madrid", "Liverpool", "Chelsea", "AC Milan", "Sagan Tosu"],
    hints: {
      en: ["Nationality: Spain", "Position: Striker", "Won the World Cup in 2010 and two European Championships", "Was one of the most expensive transfers in football history", "Nicknamed 'El Nino' early in his career"],
      pt: ["Nacionalidade: Espanha", "Posição: Atacante", "Venceu a Copa do Mundo de 2010 e duas Eurocopas", "Foi uma das transferências mais caras da história do futebol", "Apelidado de 'El Niño' no início da carreira"],
      es: ["Nacionalidad: España", "Posición: Delantero", "Ganó el Mundial de 2010 y dos Eurocopas", "Fue uno de los traspasos más caros de la historia del fútbol", "Apodado 'El Niño' al inicio de su carrera"],
    },
  },
  {
    name: "Pele",
    clubs: ["Santos", "New York Cosmos"],
    hints: {
      en: ["Nationality: Brazil", "Position: Forward", "Won three World Cups with Brazil (1958, 1962, 1970)", "Widely regarded as one of the greatest players in football history", "Scored over 1,000 career goals"],
      pt: ["Nacionalidade: Brasil", "Posição: Atacante", "Venceu três Copas do Mundo com o Brasil (1958, 1962 e 1970)", "Amplamente considerado um dos maiores jogadores da história do futebol", "Marcou mais de 1.000 gols na carreira"],
      es: ["Nacionalidad: Brasil", "Posición: Delantero", "Ganó tres Mundiales con Brasil (1958, 1962 y 1970)", "Ampliamente considerado uno de los mejores jugadores de la historia del fútbol", "Marcó más de 1.000 goles en su carrera"],
    },
  },
  {
    name: "Diego Maradona",
    clubs: ["Argentinos Juniors", "Boca Juniors", "Barcelona", "Napoli", "Sevilla", "Newell's Old Boys"],
    hints: {
      en: ["Nationality: Argentina", "Position: Attacking midfielder / forward", "Won the World Cup with Argentina in 1986", "Scored the 'Hand of God' and 'Goal of the Century' in the same match", "Became a legendary figure at Napoli in Italy"],
      pt: ["Nacionalidade: Argentina", "Posição: Meia-atacante / atacante", "Venceu a Copa do Mundo com a Argentina em 1986", "Marcou o gol da 'Mão de Deus' e o 'Gol do Século' na mesma partida", "Tornou-se uma figura lendária no Napoli, na Itália"],
      es: ["Nacionalidad: Argentina", "Posición: Mediapunta / delantero", "Ganó el Mundial con Argentina en 1986", "Marcó el gol de la 'Mano de Dios' y el 'Gol del Siglo' en el mismo partido", "Se convirtió en una figura legendaria en el Napoli, en Italia"],
    },
  },
  {
    name: "Lionel Messi",
    clubs: ["Barcelona", "PSG", "Inter Miami"],
    hints: {
      en: ["Nationality: Argentina", "Position: Forward", "Won the World Cup with Argentina in 2022", "Holds a record eight Ballon d'Or awards", "Spent most of his career at Barcelona"],
      pt: ["Nacionalidade: Argentina", "Posição: Atacante", "Venceu a Copa do Mundo com a Argentina em 2022", "Detém o recorde de oito prêmios Bola de Ouro", "Passou a maior parte da carreira no Barcelona"],
      es: ["Nacionalidad: Argentina", "Posición: Delantero", "Ganó el Mundial con Argentina en 2022", "Posee el récord de ocho Balones de Oro", "Pasó la mayor parte de su carrera en el Barcelona"],
    },
  },
  {
    name: "Cristiano Ronaldo",
    clubs: ["Sporting CP", "Manchester United", "Real Madrid", "Juventus", "Al-Nassr"],
    hints: {
      en: ["Nationality: Portugal", "Position: Forward", "Won the European Championship with Portugal in 2016", "Football's all-time record goalscorer across club and country", "Won the Champions League with two different clubs"],
      pt: ["Nacionalidade: Portugal", "Posição: Atacante", "Venceu a Eurocopa com Portugal em 2016", "Maior artilheiro da história do futebol, somando clube e seleção", "Venceu a Champions League por dois clubes diferentes"],
      es: ["Nacionalidad: Portugal", "Posición: Delantero", "Ganó la Eurocopa con Portugal en 2016", "Máximo goleador histórico del fútbol, sumando club y selección", "Ganó la Champions League con dos clubes distintos"],
    },
  },
  {
    name: "Kaka",
    clubs: ["Sao Paulo", "AC Milan", "Real Madrid", "Orlando City"],
    hints: {
      en: ["Nationality: Brazil", "Position: Attacking midfielder", "Won the World Cup with Brazil in 2002", "Won the Ballon d'Or in 2007", "Won the Champions League with AC Milan"],
      pt: ["Nacionalidade: Brasil", "Posição: Meia-atacante", "Venceu a Copa do Mundo com o Brasil em 2002", "Venceu a Bola de Ouro em 2007", "Venceu a Champions League pelo AC Milan"],
      es: ["Nacionalidad: Brasil", "Posición: Mediapunta", "Ganó el Mundial con Brasil en 2002", "Ganó el Balón de Oro en 2007", "Ganó la Champions League con el AC Milan"],
    },
  },
  {
    name: "David Beckham",
    clubs: ["Manchester United", "Real Madrid", "LA Galaxy", "AC Milan", "PSG"],
    hints: {
      en: ["Nationality: England", "Position: Midfielder", "Known for his precise crossing and free kicks", "Won the Champions League with Manchester United in 1999", "Became a global icon after moving to Real Madrid and LA Galaxy"],
      pt: ["Nacionalidade: Inglaterra", "Posição: Meio-campista", "Conhecido pelos cruzamentos precisos e cobranças de falta", "Venceu a Champions League pelo Manchester United em 1999", "Tornou-se um ícone global após passagens por Real Madrid e LA Galaxy"],
      es: ["Nacionalidad: Inglaterra", "Posición: Centrocampista", "Conocido por sus centros precisos y sus tiros libres", "Ganó la Champions League con el Manchester United en 1999", "Se convirtió en un ícono global tras pasar por el Real Madrid y el LA Galaxy"],
    },
  },
  {
    name: "Xavi Hernandez",
    clubs: ["Barcelona", "Al Sadd"],
    hints: {
      en: ["Nationality: Spain", "Position: Central midfielder", "Won the World Cup with Spain in 2010", "Was the orchestrator of Barcelona's possession-based style under Guardiola", "Later returned to Barcelona as head coach"],
      pt: ["Nacionalidade: Espanha", "Posição: Meio-campista central", "Venceu a Copa do Mundo com a Espanha em 2010", "Foi o maestro do estilo de posse de bola do Barcelona sob Guardiola", "Mais tarde retornou ao Barcelona como técnico"],
      es: ["Nacionalidad: España", "Posición: Centrocampista central", "Ganó el Mundial con España en 2010", "Fue el orquestador del estilo de posesión del Barcelona bajo Guardiola", "Más tarde regresó al Barcelona como entrenador"],
    },
  },
  {
    name: "Paolo Maldini",
    clubs: ["AC Milan"],
    hints: {
      en: ["Nationality: Italy", "Position: Defender", "Played his entire career at a single club", "Won the Champions League five times", "Considered one of the greatest defenders in football history"],
      pt: ["Nacionalidade: Itália", "Posição: Zagueiro / lateral", "Jogou toda a carreira em um único clube", "Venceu a Champions League cinco vezes", "Considerado um dos maiores zagueiros da história do futebol"],
      es: ["Nacionalidad: Italia", "Posición: Defensor", "Jugó toda su carrera en un solo club", "Ganó la Champions League cinco veces", "Considerado uno de los mejores defensores de la historia del fútbol"],
    },
  },
  {
    name: "Cafu",
    clubs: ["Sao Paulo", "Zaragoza", "Juventude", "Roma", "AC Milan"],
    hints: {
      en: ["Nationality: Brazil", "Position: Right-back", "Only player to appear in three consecutive World Cup finals", "Won the World Cup with Brazil in 1994 and 2002", "Won the Champions League with AC Milan"],
      pt: ["Nacionalidade: Brasil", "Posição: Lateral-direito", "Único jogador a disputar três finais consecutivas de Copa do Mundo", "Venceu a Copa do Mundo com o Brasil em 1994 e 2002", "Venceu a Champions League pelo AC Milan"],
      es: ["Nacionalidad: Brasil", "Posición: Lateral derecho", "Único jugador en disputar tres finales consecutivas de Copa del Mundo", "Ganó el Mundial con Brasil en 1994 y 2002", "Ganó la Champions League con el AC Milan"],
    },
  },
  {
    name: "Rivaldo",
    clubs: ["Corinthians", "Palmeiras", "Deportivo La Coruna", "Barcelona", "AC Milan", "Cruzeiro", "Olympiacos"],
    hints: {
      en: ["Nationality: Brazil", "Position: Forward / attacking midfielder", "Won the World Cup with Brazil in 2002", "Won the Ballon d'Or in 1999", "Known for his powerful left foot and spectacular goals"],
      pt: ["Nacionalidade: Brasil", "Posição: Atacante / meia-atacante", "Venceu a Copa do Mundo com o Brasil em 2002", "Venceu a Bola de Ouro em 1999", "Conhecido pela perna esquerda potente e gols espetaculares"],
      es: ["Nacionalidad: Brasil", "Posición: Delantero / mediapunta", "Ganó el Mundial con Brasil en 2002", "Ganó el Balón de Oro en 1999", "Conocido por su pierna izquierda potente y sus goles espectaculares"],
    },
  },
  {
    name: "Clarence Seedorf",
    clubs: ["Ajax", "Sampdoria", "Real Madrid", "Inter Milan", "AC Milan", "Botafogo"],
    hints: {
      en: ["Nationality: Netherlands", "Position: Midfielder", "Only player to win the Champions League with three different clubs", "Known for his versatility across midfield positions", "Later became a head coach at AC Milan"],
      pt: ["Nacionalidade: Holanda", "Posição: Meio-campista", "Único jogador a vencer a Champions League por três clubes diferentes", "Conhecido pela versatilidade em diferentes posições do meio-campo", "Mais tarde se tornou técnico do AC Milan"],
      es: ["Nacionalidad: Países Bajos", "Posición: Centrocampista", "Único jugador en ganar la Champions League con tres clubes distintos", "Conocido por su versatilidad en distintas posiciones del mediocampo", "Más tarde se convirtió en entrenador del AC Milan"],
    },
  },
  {
    name: "Frank Lampard",
    clubs: ["West Ham", "Chelsea", "Manchester City", "New York City FC"],
    hints: {
      en: ["Nationality: England", "Position: Midfielder", "Is Chelsea's all-time record goalscorer", "Won the Champions League with Chelsea in 2012", "Known for his late runs into the box and long-range shooting"],
      pt: ["Nacionalidade: Inglaterra", "Posição: Meio-campista", "É o maior artilheiro da história do Chelsea", "Venceu a Champions League pelo Chelsea em 2012", "Conhecido pelas chegadas na área e chutes de longa distância"],
      es: ["Nacionalidad: Inglaterra", "Posición: Centrocampista", "Es el máximo goleador histórico del Chelsea", "Ganó la Champions League con el Chelsea en 2012", "Conocido por sus llegadas al área y sus disparos de larga distancia"],
    },
  },
  {
    name: "Steven Gerrard",
    clubs: ["Liverpool", "LA Galaxy"],
    hints: {
      en: ["Nationality: England", "Position: Midfielder", "Captained Liverpool for over a decade", "Led Liverpool's dramatic comeback in the 2005 Champions League final", "Spent almost his entire career at a single club"],
      pt: ["Nacionalidade: Inglaterra", "Posição: Meio-campista", "Foi capitão do Liverpool por mais de uma década", "Liderou a virada dramática do Liverpool na final da Champions League de 2005", "Passou quase toda a carreira em um único clube"],
      es: ["Nacionalidad: Inglaterra", "Posición: Centrocampista", "Fue capitán del Liverpool durante más de una década", "Lideró la remontada dramática del Liverpool en la final de la Champions League de 2005", "Pasó casi toda su carrera en un solo club"],
    },
  },
  {
    name: "Wayne Rooney",
    clubs: ["Everton", "Manchester United", "DC United", "Derby County"],
    hints: {
      en: ["Nationality: England", "Position: Forward", "Is Manchester United's all-time record goalscorer", "Broke into the Premier League as a teenage sensation at Everton", "Also played Major League Soccer in the United States"],
      pt: ["Nacionalidade: Inglaterra", "Posição: Atacante", "É o maior artilheiro da história do Manchester United", "Estreou na Premier League ainda adolescente, como sensação do Everton", "Também jogou na Major League Soccer, nos Estados Unidos"],
      es: ["Nacionalidad: Inglaterra", "Posición: Delantero", "Es el máximo goleador histórico del Manchester United", "Debutó en la Premier League siendo adolescente, como sensación del Everton", "También jugó en la Major League Soccer, en Estados Unidos"],
    },
  },
  {
    name: "Andriy Shevchenko",
    clubs: ["Dynamo Kyiv", "AC Milan", "Chelsea"],
    hints: {
      en: ["Nationality: Ukraine", "Position: Striker", "Won the Ballon d'Or in 2004", "Won the Champions League with AC Milan", "One of the greatest goalscorers in Ukrainian football history"],
      pt: ["Nacionalidade: Ucrânia", "Posição: Atacante", "Venceu a Bola de Ouro em 2004", "Venceu a Champions League pelo AC Milan", "Um dos maiores artilheiros da história do futebol ucraniano"],
      es: ["Nacionalidad: Ucrania", "Posición: Delantero", "Ganó el Balón de Oro en 2004", "Ganó la Champions League con el AC Milan", "Uno de los máximos goleadores de la historia del fútbol ucraniano"],
    },
  },
  {
    name: "Raul Gonzalez",
    clubs: ["Real Madrid", "Schalke 04", "Al Sadd", "New York Cosmos"],
    hints: {
      en: ["Nationality: Spain", "Position: Forward", "Was Real Madrid's all-time record goalscorer for many years", "Won the Champions League three times with Real Madrid", "Captained Real Madrid for several seasons"],
      pt: ["Nacionalidade: Espanha", "Posição: Atacante", "Foi o maior artilheiro da história do Real Madrid por muitos anos", "Venceu a Champions League três vezes pelo Real Madrid", "Foi capitão do Real Madrid por diversas temporadas"],
      es: ["Nacionalidad: España", "Posición: Delantero", "Fue el máximo goleador histórico del Real Madrid durante muchos años", "Ganó la Champions League tres veces con el Real Madrid", "Fue capitán del Real Madrid durante varias temporadas"],
    },
  },
  {
    name: "Francesco Totti",
    clubs: ["AS Roma"],
    hints: {
      en: ["Nationality: Italy", "Position: Forward / attacking midfielder", "Played his entire 25-year career at a single club", "Won the World Cup with Italy in 2006", "Is AS Roma's all-time record goalscorer"],
      pt: ["Nacionalidade: Itália", "Posição: Atacante / meia-atacante", "Jogou toda a carreira de 25 anos em um único clube", "Venceu a Copa do Mundo com a Itália em 2006", "É o maior artilheiro da história da AS Roma"],
      es: ["Nacionalidad: Italia", "Posición: Delantero / mediapunta", "Jugó toda su carrera de 25 años en un solo club", "Ganó el Mundial con Italia en 2006", "Es el máximo goleador histórico de la AS Roma"],
    },
  },
  {
    name: "Pavel Nedved",
    clubs: ["Sparta Prague", "Lazio", "Juventus"],
    hints: {
      en: ["Nationality: Czech Republic", "Position: Midfielder", "Won the Ballon d'Or in 2003", "Known for his relentless running and long hair", "Missed the 2003 Champions League final through suspension"],
      pt: ["Nacionalidade: República Tcheca", "Posição: Meio-campista", "Venceu a Bola de Ouro em 2003", "Conhecido pela corrida incansável e cabelo comprido", "Ficou fora da final da Champions League de 2003 por suspensão"],
      es: ["Nacionalidad: República Checa", "Posición: Centrocampista", "Ganó el Balón de Oro en 2003", "Conocido por su carrera incansable y su cabello largo", "Se perdió la final de la Champions League de 2003 por sanción"],
    },
  },
  {
    name: "Roberto Baggio",
    clubs: ["Vicenza", "Fiorentina", "Juventus", "AC Milan", "Bologna", "Inter Milan", "Brescia"],
    hints: {
      en: ["Nationality: Italy", "Position: Forward / attacking midfielder", "Won the Ballon d'Or in 1993", "Nicknamed the 'Divine Ponytail'", "Missed a decisive penalty in the 1994 World Cup final"],
      pt: ["Nacionalidade: Itália", "Posição: Atacante / meia-atacante", "Venceu a Bola de Ouro em 1993", "Apelidado de 'Codinho Divino'", "Perdeu um pênalti decisivo na final da Copa do Mundo de 1994"],
      es: ["Nacionalidad: Italia", "Posición: Delantero / mediapunta", "Ganó el Balón de Oro en 1993", "Apodado la 'Coletta Divina'", "Falló un penal decisivo en la final del Mundial de 1994"],
    },
  },
  {
    name: "Fabio Cannavaro",
    clubs: ["Napoli", "Parma", "Inter Milan", "Juventus", "Real Madrid"],
    hints: {
      en: ["Nationality: Italy", "Position: Centre-back", "Won the World Cup with Italy in 2006", "Won the Ballon d'Or that same year, a rare feat for a defender", "Captained Italy's title-winning squad"],
      pt: ["Nacionalidade: Itália", "Posição: Zagueiro", "Venceu a Copa do Mundo com a Itália em 2006", "Venceu a Bola de Ouro no mesmo ano, feito raro para um zagueiro", "Foi capitão da seleção italiana campeã"],
      es: ["Nacionalidad: Italia", "Posición: Defensor central", "Ganó el Mundial con Italia en 2006", "Ganó el Balón de Oro ese mismo año, algo poco común para un defensor", "Fue capitán de la selección italiana campeona"],
    },
  },
  {
    name: "Luka Modric",
    clubs: ["Dinamo Zagreb", "Tottenham", "Real Madrid", "AC Milan"],
    hints: {
      en: ["Nationality: Croatia", "Position: Midfielder", "Won the Ballon d'Or in 2018, ending the Messi-Ronaldo streak", "Led Croatia to the World Cup final in 2018", "Won the Champions League multiple times with Real Madrid"],
      pt: ["Nacionalidade: Croácia", "Posição: Meio-campista", "Venceu a Bola de Ouro em 2018, encerrando a sequência de Messi e Ronaldo", "Levou a Croácia à final da Copa do Mundo de 2018", "Venceu a Champions League diversas vezes pelo Real Madrid"],
      es: ["Nacionalidad: Croacia", "Posición: Centrocampista", "Ganó el Balón de Oro en 2018, poniendo fin a la racha de Messi y Ronaldo", "Llevó a Croacia a la final del Mundial de 2018", "Ganó la Champions League varias veces con el Real Madrid"],
    },
  },
  {
    name: "Gareth Bale",
    clubs: ["Southampton", "Tottenham", "Real Madrid", "LAFC"],
    hints: {
      en: ["Nationality: Wales", "Position: Winger / forward", "Scored an overhead kick in the 2018 Champions League final", "Was one of the most expensive transfers in football history", "Led Wales to the semifinals of Euro 2016"],
      pt: ["Nacionalidade: País de Gales", "Posição: Ponta / atacante", "Marcou um gol de bicicleta na final da Champions League de 2018", "Foi uma das transferências mais caras da história do futebol", "Levou o País de Gales às semifinais da Eurocopa de 2016"],
      es: ["Nacionalidad: Gales", "Posición: Extremo / delantero", "Marcó un gol de chilena en la final de la Champions League de 2018", "Fue uno de los traspasos más caros de la historia del fútbol", "Llevó a Gales a las semifinales de la Eurocopa de 2016"],
    },
  },
  {
    name: "Sergio Ramos",
    clubs: ["Sevilla", "Real Madrid", "PSG", "Monterrey"],
    hints: {
      en: ["Nationality: Spain", "Position: Centre-back", "Won the World Cup with Spain in 2010", "Holds the record for most red cards in La Liga history", "Won the Champions League five times with Real Madrid"],
      pt: ["Nacionalidade: Espanha", "Posição: Zagueiro", "Venceu a Copa do Mundo com a Espanha em 2010", "Detém o recorde de mais cartões vermelhos na história de La Liga", "Venceu a Champions League cinco vezes pelo Real Madrid"],
      es: ["Nacionalidad: España", "Posición: Defensor central", "Ganó el Mundial con España en 2010", "Posee el récord de más tarjetas rojas en la historia de La Liga", "Ganó la Champions League cinco veces con el Real Madrid"],
    },
  },
  {
    name: "Iker Casillas",
    clubs: ["Real Madrid", "Porto"],
    hints: {
      en: ["Nationality: Spain", "Position: Goalkeeper", "Won the World Cup with Spain in 2010", "Captained both Real Madrid and Spain for years", "Won the Champions League three times with Real Madrid"],
      pt: ["Nacionalidade: Espanha", "Posição: Goleiro", "Venceu a Copa do Mundo com a Espanha em 2010", "Foi capitão do Real Madrid e da seleção espanhola por anos", "Venceu a Champions League três vezes pelo Real Madrid"],
      es: ["Nacionalidad: España", "Posición: Portero", "Ganó el Mundial con España en 2010", "Fue capitán del Real Madrid y de la selección española durante años", "Ganó la Champions League tres veces con el Real Madrid"],
    },
  },
  {
    name: "Arjen Robben",
    clubs: ["Groningen", "PSV", "Chelsea", "Real Madrid", "Bayern Munich"],
    hints: {
      en: ["Nationality: Netherlands", "Position: Winger", "Scored the winning goal in the 2013 Champions League final", "Known for cutting inside onto his favored left foot", "Part of Bayern Munich's treble-winning squad"],
      pt: ["Nacionalidade: Holanda", "Posição: Ponta", "Marcou o gol da vitória na final da Champions League de 2013", "Conhecido por cortar para dentro em direção à perna esquerda", "Fez parte do elenco do Bayern campeão da tríplice coroa"],
      es: ["Nacionalidad: Países Bajos", "Posición: Extremo", "Marcó el gol de la victoria en la final de la Champions League de 2013", "Conocido por recortar hacia adentro hacia su pierna izquierda", "Formó parte del plantel del Bayern campeón del triplete"],
    },
  },
  {
    name: "Franck Ribery",
    clubs: ["Metz", "Marseille", "Bayern Munich", "Fiorentina", "Salernitana"],
    hints: {
      en: ["Nationality: France", "Position: Winger", "Won the treble with Bayern Munich in 2013", "Was runner-up for the Ballon d'Or that same year", "Known for his dribbling and crossing from the left flank"],
      pt: ["Nacionalidade: França", "Posição: Ponta", "Venceu a tríplice coroa com o Bayern de Munique em 2013", "Foi vice-campeão da Bola de Ouro no mesmo ano", "Conhecido pelo drible e cruzamentos pelo lado esquerdo"],
      es: ["Nacionalidad: Francia", "Posición: Extremo", "Ganó el triplete con el Bayern de Múnich en 2013", "Fue subcampeón del Balón de Oro ese mismo año", "Conocido por su regate y sus centros desde la banda izquierda"],
    },
  },
  {
    name: "Ruud van Nistelrooy",
    clubs: ["Heerenveen", "PSV", "Manchester United", "Real Madrid", "Hamburger SV"],
    hints: {
      en: ["Nationality: Netherlands", "Position: Striker", "Was one of the most clinical goalscorers of his generation", "Top scorer in the Champions League on multiple occasions", "Later became a head coach, including at Manchester United"],
      pt: ["Nacionalidade: Holanda", "Posição: Atacante", "Foi um dos artilheiros mais eficientes de sua geração", "Artilheiro da Champions League em mais de uma ocasião", "Mais tarde se tornou técnico, incluindo uma passagem pelo Manchester United"],
      es: ["Nacionalidad: Países Bajos", "Posición: Delantero", "Fue uno de los goleadores más eficientes de su generación", "Máximo goleador de la Champions League en más de una ocasión", "Más tarde se convirtió en entrenador, incluyendo un paso por el Manchester United"],
    },
  },
  {
    name: "Kylian Mbappe",
    clubs: ["Monaco", "PSG", "Real Madrid"],
    hints: {
      en: ["Nationality: France", "Position: Forward", "Won the World Cup with France in 2018", "Was the youngest scorer in a World Cup final since Pele", "Moved to Real Madrid after years at PSG"],
      pt: ["Nacionalidade: França", "Posição: Atacante", "Venceu a Copa do Mundo com a França em 2018", "Foi o jogador mais jovem a marcar em uma final de Copa do Mundo desde Pelé", "Transferiu-se ao Real Madrid após anos no PSG"],
      es: ["Nacionalidad: Francia", "Posición: Delantero", "Ganó el Mundial con Francia en 2018", "Fue el goleador más joven en una final de Copa del Mundo desde Pelé", "Se mudó al Real Madrid tras años en el PSG"],
    },
  },
  {
    name: "Erling Haaland",
    clubs: ["Molde", "Salzburg", "Borussia Dortmund", "Manchester City"],
    hints: {
      en: ["Nationality: Norway", "Position: Striker", "Broke the Premier League single-season goals record", "Won the treble with Manchester City in 2023", "Known for his exceptional physical power and finishing"],
      pt: ["Nacionalidade: Noruega", "Posição: Atacante", "Bateu o recorde de gols em uma única temporada da Premier League", "Venceu a tríplice coroa com o Manchester City em 2023", "Conhecido pelo poder físico excepcional e finalização"],
      es: ["Nacionalidad: Noruega", "Posición: Delantero", "Batió el récord de goles en una sola temporada de la Premier League", "Ganó el triplete con el Manchester City en 2023", "Conocido por su poder físico excepcional y su definición"],
    },
  },
  {
    name: "Luis Suarez",
    clubs: ["Nacional", "Groningen", "Ajax", "Liverpool", "Barcelona", "Atletico Madrid", "Inter Miami"],
    hints: {
      en: ["Nationality: Uruguay", "Position: Striker", "Known for a fierce bite scandal at the 2014 World Cup", "Prolific striker for Liverpool and Barcelona", "Won the treble with Barcelona in 2015"],
      pt: ["Nacionalidade: Uruguai", "Posição: Atacante", "Conhecido por um polêmico episódio de mordida na Copa do Mundo de 2014", "Atacante prolífico do Liverpool e do Barcelona", "Venceu a tríplice coroa com o Barcelona em 2015"],
      es: ["Nacionalidad: Uruguay", "Posición: Delantero", "Conocido por un polémico mordisco en el Mundial de 2014", "Delantero prolífico del Liverpool y el Barcelona", "Ganó el triplete con el Barcelona en 2015"],
    },
  },
  {
    name: "Sergio Aguero",
    clubs: ["Independiente", "Atletico Madrid", "Manchester City", "Barcelona"],
    hints: {
      en: ["Nationality: Argentina", "Position: Striker", "Scored a dramatic last-minute goal to win Manchester City's first Premier League title", "Is Manchester City's all-time record goalscorer", "Won Olympic gold with Argentina in 2008"],
      pt: ["Nacionalidade: Argentina", "Posição: Atacante", "Marcou um gol dramático nos acréscimos que deu o primeiro título da Premier League ao Manchester City", "É o maior artilheiro da história do Manchester City", "Venceu o ouro olímpico com a Argentina em 2008"],
      es: ["Nacionalidad: Argentina", "Posición: Delantero", "Marcó un gol dramático en el descuento que le dio al Manchester City su primer título de la Premier League", "Es el máximo goleador histórico del Manchester City", "Ganó el oro olímpico con Argentina en 2008"],
    },
  },
  {
    name: "Neymar Jr",
    clubs: ["Santos", "Barcelona", "PSG", "Al-Hilal"],
    hints: {
      en: ["Nationality: Brazil", "Position: Forward", "Won Olympic gold with Brazil in 2016", "Was part of Barcelona's treble-winning MSN attacking trio", "Became the most expensive transfer in football history when he joined PSG"],
      pt: ["Nacionalidade: Brasil", "Posição: Atacante", "Venceu o ouro olímpico com o Brasil em 2016", "Fez parte do trio ofensivo MSN do Barcelona, campeão da tríplice coroa", "Tornou-se a transferência mais cara da história do futebol ao se mudar para o PSG"],
      es: ["Nacionalidad: Brasil", "Posición: Delantero", "Ganó el oro olímpico con Brasil en 2016", "Formó parte del trío ofensivo MSN del Barcelona, campeón del triplete", "Se convirtió en el traspaso más caro de la historia del fútbol al fichar por el PSG"],
    },
  },
  {
    name: "Vinicius Junior",
    clubs: ["Flamengo", "Real Madrid"],
    hints: {
      en: ["Nationality: Brazil", "Position: Winger", "Became a Champions League final hero for Real Madrid", "Wears the number 7 shirt at Real Madrid", "Known for his explosive pace and dribbling"],
      pt: ["Nacionalidade: Brasil", "Posição: Ponta", "Tornou-se herói de finais de Champions League pelo Real Madrid", "Veste a camisa 7 do Real Madrid", "Conhecido pela velocidade explosiva e drible"],
      es: ["Nacionalidad: Brasil", "Posición: Extremo", "Se convirtió en héroe de finales de Champions League con el Real Madrid", "Viste la camiseta número 7 del Real Madrid", "Conocido por su velocidad explosiva y su regate"],
    },
  },
  {
    name: "Rodrygo Goes",
    clubs: ["Santos", "Real Madrid"],
    hints: {
      en: ["Nationality: Brazil", "Position: Forward / winger", "Scored crucial late goals in Real Madrid's 2022 Champions League run", "Came through Santos' youth academy", "Known for his composure in big moments"],
      pt: ["Nacionalidade: Brasil", "Posição: Atacante / ponta", "Marcou gols decisivos no fim de jogos na campanha do Real Madrid na Champions League de 2022", "Foi revelado nas categorias de base do Santos", "Conhecido pela frieza em momentos decisivos"],
      es: ["Nacionalidad: Brasil", "Posición: Delantero / extremo", "Marcó goles decisivos al final de partidos en la campaña del Real Madrid en la Champions League de 2022", "Se formó en la cantera del Santos", "Conocido por su frialdad en los momentos decisivos"],
    },
  },
  {
    name: "Jude Bellingham",
    clubs: ["Birmingham City", "Borussia Dortmund", "Real Madrid"],
    hints: {
      en: ["Nationality: England", "Position: Midfielder", "Broke through at Birmingham City as a teenager", "Became a key midfielder for Real Madrid", "Known for his goal-scoring runs from midfield"],
      pt: ["Nacionalidade: Inglaterra", "Posição: Meio-campista", "Revelou-se no Birmingham City ainda adolescente", "Tornou-se peça-chave do meio-campo do Real Madrid", "Conhecido pelas chegadas com gol saindo do meio-campo"],
      es: ["Nacionalidad: Inglaterra", "Posición: Centrocampista", "Se reveló en el Birmingham City siendo adolescente", "Se convirtió en pieza clave del mediocampo del Real Madrid", "Conocido por sus llegadas con gol desde el mediocampo"],
    },
  },
  {
    name: "Ansu Fati",
    clubs: ["Barcelona", "Brighton"],
    hints: {
      en: ["Nationality: Spain", "Position: Winger", "Became Barcelona's youngest ever goalscorer in La Liga", "Had a loan spell in the Premier League with Brighton", "Seen as one of Barcelona's brightest young talents"],
      pt: ["Nacionalidade: Espanha", "Posição: Ponta", "Tornou-se o mais jovem artilheiro da história do Barcelona em La Liga", "Teve uma passagem de empréstimo na Premier League pelo Brighton", "Visto como uma das grandes joias da base do Barcelona"],
      es: ["Nacionalidad: España", "Posición: Extremo", "Se convirtió en el goleador más joven de la historia del Barcelona en La Liga", "Tuvo un préstamo en la Premier League con el Brighton", "Visto como una de las grandes joyas de la cantera del Barcelona"],
    },
  },
  {
    name: "Alphonso Davies",
    clubs: ["Vancouver Whitecaps", "Bayern Munich"],
    hints: {
      en: ["Nationality: Canada", "Position: Left-back", "Started his professional career with Vancouver Whitecaps", "Became a key left-back for Bayern Munich", "Won the treble with Bayern Munich in 2020"],
      pt: ["Nacionalidade: Canadá", "Posição: Lateral-esquerdo", "Iniciou a carreira profissional no Vancouver Whitecaps", "Tornou-se lateral-esquerdo titular do Bayern de Munique", "Venceu a tríplice coroa com o Bayern em 2020"],
      es: ["Nacionalidad: Canadá", "Posición: Lateral izquierdo", "Inició su carrera profesional en el Vancouver Whitecaps", "Se convirtió en lateral izquierdo titular del Bayern de Múnich", "Ganó el triplete con el Bayern en 2020"],
    },
  },
  {
    name: "Mason Mount",
    clubs: ["Chelsea", "Manchester United"],
    hints: {
      en: ["Nationality: England", "Position: Midfielder", "Came through Chelsea's academy after a loan spell in the Netherlands", "Won the Champions League with Chelsea in 2021", "Moved to Manchester United in a big-money transfer"],
      pt: ["Nacionalidade: Inglaterra", "Posição: Meio-campista", "Foi revelado nas categorias de base do Chelsea, após empréstimo na Holanda", "Venceu a Champions League pelo Chelsea em 2021", "Transferiu-se ao Manchester United por valor alto"],
      es: ["Nacionalidad: Inglaterra", "Posición: Centrocampista", "Se formó en la cantera del Chelsea, tras un préstamo en los Países Bajos", "Ganó la Champions League con el Chelsea en 2021", "Se mudó al Manchester United en un traspaso de alto valor"],
    },
  },
  {
    name: "Declan Rice",
    clubs: ["West Ham", "Arsenal"],
    hints: {
      en: ["Nationality: England", "Position: Defensive midfielder", "Captained West Ham United before a big-money move", "Became a key holding midfielder for Arsenal", "Known for his composure and defensive discipline"],
      pt: ["Nacionalidade: Inglaterra", "Posição: Volante", "Foi capitão do West Ham antes de uma transferência de alto valor", "Tornou-se volante titular do Arsenal", "Conhecido pela frieza e disciplina defensiva"],
      es: ["Nacionalidad: Inglaterra", "Posición: Volante", "Fue capitán del West Ham antes de un traspaso de alto valor", "Se convirtió en volante titular del Arsenal", "Conocido por su frialdad y disciplina defensiva"],
    },
  },
  {
    name: "Eduardo Camavinga",
    clubs: ["Rennes", "Real Madrid"],
    hints: {
      en: ["Nationality: France", "Position: Midfielder", "Became Rennes' youngest ever debutant as a teenager", "Moved to Real Madrid at just 18 years old", "Known for his versatility across midfield and defense"],
      pt: ["Nacionalidade: França", "Posição: Meio-campista", "Tornou-se o estreante mais jovem da história do Rennes, ainda adolescente", "Transferiu-se ao Real Madrid com apenas 18 anos", "Conhecido pela versatilidade entre o meio-campo e a defesa"],
      es: ["Nacionalidad: Francia", "Posición: Centrocampista", "Se convirtió en el debutante más joven de la historia del Rennes, siendo adolescente", "Se mudó al Real Madrid con apenas 18 años", "Conocido por su versatilidad entre el mediocampo y la defensa"],
    },
  },
  {
    name: "Aurelien Tchouameni",
    clubs: ["Monaco", "Real Madrid"],
    hints: {
      en: ["Nationality: France", "Position: Defensive midfielder", "Broke through at Monaco before a big transfer to Real Madrid", "Known for his physical presence and passing range", "Part of France's World Cup final squad in 2022"],
      pt: ["Nacionalidade: França", "Posição: Volante", "Se destacou no Monaco antes de uma grande transferência ao Real Madrid", "Conhecido pela presença física e qualidade de passe", "Fez parte do elenco da França na final da Copa de 2022"],
      es: ["Nacionalidad: Francia", "Posición: Volante", "Se destacó en el Mónaco antes de un gran traspaso al Real Madrid", "Conocido por su presencia física y su calidad de pase", "Formó parte del plantel de Francia en la final del Mundial de 2022"],
    },
  },
  {
    name: "Serge Gnabry",
    clubs: ["Arsenal", "Werder Bremen", "Bayern Munich"],
    hints: {
      en: ["Nationality: Germany", "Position: Winger", "Started his career in England with Arsenal", "Scored four goals in a single Champions League match for Bayern", "Won the treble with Bayern Munich in 2020"],
      pt: ["Nacionalidade: Alemanha", "Posição: Ponta", "Começou a carreira na Inglaterra, pelo Arsenal", "Marcou quatro gols em uma única partida de Champions League pelo Bayern", "Venceu a tríplice coroa com o Bayern em 2020"],
      es: ["Nacionalidad: Alemania", "Posición: Extremo", "Comenzó su carrera en Inglaterra, en el Arsenal", "Marcó cuatro goles en un solo partido de Champions League con el Bayern", "Ganó el triplete con el Bayern en 2020"],
    },
  },
  {
    name: "Leroy Sane",
    clubs: ["Schalke 04", "Manchester City", "Bayern Munich"],
    hints: {
      en: ["Nationality: Germany", "Position: Winger", "Won multiple Premier League titles with Manchester City", "Moved to Bayern Munich in 2020", "Known for his pace and left-footed finishing"],
      pt: ["Nacionalidade: Alemanha", "Posição: Ponta", "Venceu vários títulos da Premier League pelo Manchester City", "Transferiu-se ao Bayern de Munique em 2020", "Conhecido pela velocidade e finalização com a perna esquerda"],
      es: ["Nacionalidad: Alemania", "Posición: Extremo", "Ganó varios títulos de la Premier League con el Manchester City", "Se mudó al Bayern de Múnich en 2020", "Conocido por su velocidad y su definición de pierna izquierda"],
    },
  },
  {
    name: "Kingsley Coman",
    clubs: ["PSG", "Juventus", "Bayern Munich"],
    hints: {
      en: ["Nationality: France", "Position: Winger", "Scored the winning goal in the 2020 Champions League final", "Won the World Cup with France in 2018", "Known for his pace and dribbling on the wing"],
      pt: ["Nacionalidade: França", "Posição: Ponta", "Marcou o gol da vitória na final da Champions League de 2020", "Venceu a Copa do Mundo com a França em 2018", "Conhecido pela velocidade e drible pela ponta"],
      es: ["Nacionalidad: Francia", "Posición: Extremo", "Marcó el gol de la victoria en la final de la Champions League de 2020", "Ganó el Mundial con Francia en 2018", "Conocido por su velocidad y su regate por la banda"],
    },
  },
  {
    name: "Bastian Schweinsteiger",
    clubs: ["Bayern Munich", "Manchester United", "Chicago Fire"],
    hints: {
      en: ["Nationality: Germany", "Position: Midfielder", "Won the World Cup with Germany in 2014", "Was named man of the match in that World Cup final", "Spent most of his career at Bayern Munich"],
      pt: ["Nacionalidade: Alemanha", "Posição: Meio-campista", "Venceu a Copa do Mundo com a Alemanha em 2014", "Foi eleito o melhor em campo naquela final de Copa do Mundo", "Passou a maior parte da carreira no Bayern de Munique"],
      es: ["Nacionalidad: Alemania", "Posición: Centrocampista", "Ganó el Mundial con Alemania en 2014", "Fue elegido mejor jugador del partido en aquella final del Mundial", "Pasó la mayor parte de su carrera en el Bayern de Múnich"],
    },
  },
  {
    name: "Dirk Kuyt",
    clubs: ["Feyenoord", "Liverpool"],
    hints: {
      en: ["Nationality: Netherlands", "Position: Forward / winger", "Known for his relentless work rate on and off the ball", "Scored a hat-trick against Manchester United for Liverpool", "Returned to Feyenoord to win a league title late in his career"],
      pt: ["Nacionalidade: Holanda", "Posição: Atacante / ponta", "Conhecido pela entrega incansável dentro de campo", "Marcou um hat-trick contra o Manchester United pelo Liverpool", "Voltou ao Feyenoord e venceu um título nacional no fim da carreira"],
      es: ["Nacionalidad: Países Bajos", "Posición: Delantero / extremo", "Conocido por su entrega incansable en el campo", "Marcó un hat-trick ante el Manchester United con el Liverpool", "Regresó al Feyenoord y ganó un título de liga al final de su carrera"],
    },
  },
  {
    name: "Sander Westerveld",
    clubs: ["Feyenoord", "Liverpool", "Sparta Rotterdam"],
    hints: {
      en: ["Nationality: Netherlands", "Position: Goalkeeper", "Won the UEFA Cup and FA Cup with Liverpool in the same season", "Started his career at Feyenoord", "Later played for Real Sociedad and Portsmouth"],
      pt: ["Nacionalidade: Holanda", "Posição: Goleiro", "Venceu a Copa da UEFA e a FA Cup pelo Liverpool na mesma temporada", "Iniciou a carreira no Feyenoord", "Depois jogou por Real Sociedad e Portsmouth"],
      es: ["Nacionalidad: Países Bajos", "Posición: Portero", "Ganó la Copa de la UEFA y la FA Cup con el Liverpool en la misma temporada", "Inició su carrera en el Feyenoord", "Después jugó en la Real Sociedad y el Portsmouth"],
    },
  },
  {
    name: "Jaap Stam",
    clubs: ["PSV", "Manchester United", "Lazio", "AC Milan", "Ajax"],
    hints: {
      en: ["Nationality: Netherlands", "Position: Centre-back", "Won the treble with Manchester United in 1999", "Was one of the most expensive defenders of his era", "Later became a head coach in the Netherlands"],
      pt: ["Nacionalidade: Holanda", "Posição: Zagueiro", "Venceu a tríplice coroa com o Manchester United em 1999", "Foi um dos zagueiros mais caros de sua época", "Mais tarde se tornou técnico na Holanda"],
      es: ["Nacionalidad: Países Bajos", "Posición: Defensor central", "Ganó el triplete con el Manchester United en 1999", "Fue uno de los defensores más caros de su época", "Más tarde se convirtió en entrenador en los Países Bajos"],
    },
  },
  {
    name: "Pepe",
    clubs: ["Porto", "Real Madrid", "Besiktas"],
    hints: {
      en: ["Nationality: Portugal", "Position: Centre-back", "Born in Brazil but became a naturalized Portuguese international", "Won the Champions League multiple times with Real Madrid", "Won the European Championship with Portugal in 2016"],
      pt: ["Nacionalidade: Portugal", "Posição: Zagueiro", "Nasceu no Brasil, mas se naturalizou português para jogar pela seleção", "Venceu a Champions League diversas vezes pelo Real Madrid", "Venceu a Eurocopa com Portugal em 2016"],
      es: ["Nacionalidad: Portugal", "Posición: Defensor central", "Nació en Brasil, pero se naturalizó portugués para jugar con la selección", "Ganó la Champions League varias veces con el Real Madrid", "Ganó la Eurocopa con Portugal en 2016"],
    },
  },
];

const CLUBS_QUESTION_POOL_BRAZIL = [
  {
    name: "Raphinha",
    clubs: ["Avai", "Vitoria de Guimaraes", "Sporting CP", "Rennes", "Leeds United", "Barcelona"],
    hints: ["Nascido em Porto Alegre, Rio Grande do Sul", "Posição: Ponta", "Se destacou na Premier League pelo Leeds United", "Tornou-se ponta titular do Barcelona", "Conhecido pela entrega em campo e cobranças de bola parada"],
  },
  {
    name: "Gabriel Jesus",
    clubs: ["Palmeiras", "Manchester City", "Arsenal"],
    hints: ["Nascido em São Paulo", "Posição: Atacante", "Foi revelado nas categorias de base do Palmeiras", "Venceu vários títulos da Premier League pelo Manchester City", "Transferiu-se ao Arsenal em 2022"],
  },
  {
    name: "Richarlison",
    clubs: ["America Mineiro", "Fluminense", "Watford", "Everton", "Tottenham"],
    hints: ["Nascido no Espírito Santo", "Posição: Atacante", "Conhecido pela comemoração do 'pombo'", "Tornou-se artilheiro do Everton", "Transferiu-se ao Tottenham em 2022"],
  },
  {
    name: "Roberto Firmino",
    clubs: ["Figueirense", "Hoffenheim", "Liverpool", "Al-Ahli"],
    hints: ["Nascido em Maceió, Alagoas", "Posição: Atacante", "Fez parte do famoso trio ofensivo do Liverpool ao lado de Salah e Mané", "Venceu a Champions League pelo Liverpool em 2019", "Conhecido pelo estilo de falso 9"],
  },
  {
    name: "Philippe Coutinho",
    clubs: ["Vasco da Gama", "Inter Milan", "Espanyol", "Liverpool", "Barcelona", "Bayern Munich", "Aston Villa"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Meia-atacante", "Tornou-se armador titular do Liverpool", "Transferiu-se ao Barcelona por valor alto", "Conhecido pelos chutes de longa distância"],
  },
  {
    name: "Lucas Paqueta",
    clubs: ["Flamengo", "AC Milan", "Lyon", "West Ham"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Meia-atacante", "Venceu uma tríplice coroa nacional pelo Flamengo", "Jogou pelo AC Milan antes de se mudar para a Inglaterra", "Tornou-se meio-campista titular do West Ham"],
  },
  {
    name: "Bruno Guimaraes",
    clubs: ["Athletico Paranaense", "Lyon", "Newcastle United"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Meio-campista", "Tornou-se ídolo e futuro capitão do Newcastle United", "Conhecido pela qualidade de passe e liderança", "Jogou na França pelo Lyon antes de se mudar para a Inglaterra"],
  },
  {
    name: "Casemiro",
    clubs: ["Sao Paulo", "Real Madrid", "Porto", "Manchester United"],
    hints: ["Nascido em São José dos Campos, São Paulo", "Posição: Volante", "Venceu cinco títulos da Champions League pelo Real Madrid", "Apelidado de 'Muralha' por seu papel defensivo no meio-campo", "Transferiu-se ao Manchester United em 2022"],
  },
  {
    name: "Fabinho",
    clubs: ["Fluminense", "Rio Ave", "Monaco", "Liverpool", "Al-Ittihad"],
    hints: ["Nascido em Campinas, São Paulo", "Posição: Volante", "Apelidado de 'Farol' pela posição defensiva inteligente", "Venceu a Champions League pelo Liverpool em 2019", "Transferiu-se para a Arábia Saudita mais tarde na carreira"],
  },
  {
    name: "Fred",
    clubs: ["Internacional", "Shakhtar Donetsk", "Manchester United", "Fenerbahce"],
    hints: ["Nascido em Teófilo Otoni, Minas Gerais", "Posição: Meio-campista", "Se destacou no Shakhtar Donetsk antes de uma grande mudança à Inglaterra", "Tornou-se meio-campista regular no Manchester United", "Depois se transferiu para o Fenerbahçe"],
  },
  {
    name: "Douglas Luiz",
    clubs: ["Vasco da Gama", "Manchester City", "Girona", "Aston Villa", "Juventus"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Meio-campista", "Se transferiu ao Manchester City ainda adolescente, mas nunca jogou pelo time principal", "Tornou-se meio-campista titular do Aston Villa", "Depois se transferiu para a Juventus"],
  },
  {
    name: "Arthur Melo",
    clubs: ["Gremio", "Barcelona", "Juventus", "Liverpool", "Fiorentina", "Girona"],
    hints: ["Nascido em Goiânia, Goiás", "Posição: Meio-campista", "Foi revelado nas categorias de base do Grêmio", "Transferiu-se ao Barcelona por valor alto", "Depois foi trocado por Miralem Pjanic em negociação com a Juventus"],
  },
  {
    name: "Gerson",
    clubs: ["Fluminense", "Roma", "Fiorentina", "Flamengo", "Marseille"],
    hints: ["Nascido em Brasília", "Posição: Meio-campista", "Venceu a Copa Libertadores pelo Flamengo", "Jogou na Itália por Roma e Fiorentina", "Conhecido pela qualidade de passe e chutes de longa distância"],
  },
  {
    name: "Oscar",
    clubs: ["Sao Paulo", "Internacional", "Chelsea", "Shanghai Port"],
    hints: ["Revelado nas categorias de base do São Paulo", "Posição: Meia-atacante", "Venceu a Champions League pelo Chelsea em 2012", "Fez uma transferência surpreendente ao futebol chinês ainda jovem", "Conhecido pela visão de jogo e cobranças de bola parada"],
  },
  {
    name: "Willian",
    clubs: ["Corinthians", "Shakhtar Donetsk", "Anzhi Makhachkala", "Chelsea", "Arsenal", "Fulham"],
    hints: ["Nascido em Ribeirão Pires, São Paulo", "Posição: Ponta", "Venceu a Champions League pelo Chelsea em 2021", "Conhecido pela entrega em campo e cobranças de falta", "Também jogou por Shakhtar Donetsk e Arsenal"],
  },
  {
    name: "Everton Cebolinha",
    clubs: ["Gremio", "Benfica", "Flamengo"],
    hints: ["Nascido em Vitória da Conquista, Bahia", "Posição: Ponta", "Apelidado de 'Cebolinha' por causa de um personagem de desenho", "Venceu a Copa Libertadores pelo Flamengo em 2019", "Teve uma passagem em Portugal pelo Benfica"],
  },
  {
    name: "David Neres",
    clubs: ["Sao Paulo", "Ajax", "Shakhtar Donetsk", "Benfica", "Napoli"],
    hints: ["Nascido em São Paulo", "Posição: Ponta", "Se destacou no Ajax durante a famosa campanha da Champions League de 2019", "Conhecido pelo drible e velocidade", "Depois jogou em Portugal pelo Benfica"],
  },
  {
    name: "Antony",
    clubs: ["Sao Paulo", "Ajax", "Manchester United", "Real Betis"],
    hints: ["Nascido em Osasco, São Paulo", "Posição: Ponta", "Seguiu seu ex-técnico do Ajax para o Manchester United", "Conhecido pelo drible característico de virada de corpo na ponta", "Depois teve um empréstimo no Real Betis"],
  },
  {
    name: "Malcom",
    clubs: ["Corinthians", "Bordeaux", "Barcelona", "Zenit", "Al-Hilal"],
    hints: ["Nascido em Salvador, Bahia", "Posição: Ponta", "Marcou um gol dramático nos acréscimos na final da Liga Europa pelo Zenit", "Jogou na França pelo Bordeaux antes do Barcelona", "Depois se transferiu para a Arábia Saudita"],
  },
  {
    name: "Hulk",
    clubs: ["Vitoria", "Kawasaki Frontale", "Consadole Sapporo", "Tokyo Verdy", "Porto", "Zenit", "Shanghai SIPG", "Atletico Mineiro"],
    hints: ["Nascido em Campina Grande, Paraíba", "Posição: Atacante", "Apelidado em referência ao super-herói dos quadrinhos, pela força física", "Se destacou no Porto antes de grandes transferências para Rússia e China", "Conhecido pelos chutes potentes de longa distância"],
  },
  {
    name: "Douglas Costa",
    clubs: ["Gremio", "Shakhtar Donetsk", "Bayern Munich", "Juventus", "LA Galaxy", "Fluminense", "Sydney FC"],
    hints: ["Nascido em Sapucaia do Sul, Rio Grande do Sul", "Posição: Ponta", "Conhecido por ser um dos jogadores mais rápidos do futebol", "Venceu títulos tanto pelo Bayern de Munique quanto pela Juventus", "Jogou na Ucrânia pelo Shakhtar Donetsk"],
  },
  {
    name: "Lucas Moura",
    clubs: ["Sao Paulo", "PSG", "Tottenham"],
    hints: ["Nascido em São Paulo", "Posição: Ponta", "Marcou um hat-trick dramático que levou o Tottenham à final da Champions League", "Jogou pelo PSG antes de se mudar para a Inglaterra", "Conhecido pela velocidade e drible"],
  },
  {
    name: "Adriano",
    clubs: ["Flamengo", "Inter Milan", "Fiorentina", "Parma", "Sao Paulo", "Athletico Paranaense"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Atacante", "Apelidado de 'Imperador'", "Foi um atacante prolífico da Inter de Milão em meados dos anos 2000", "Retornou ao Brasil após dificuldades fora de campo"],
  },
  {
    name: "Alexandre Pato",
    clubs: ["Internacional", "AC Milan", "Corinthians", "Sao Paulo", "Chelsea", "Tianjin Quanjian", "Orlando City"],
    hints: ["Nascido em Pato Branco, Paraná", "Posição: Atacante", "Tornou-se o mais jovem artilheiro da história do AC Milan, ainda adolescente", "Apelidado de 'Pato' desde criança", "Também jogou na China pelo Tianjin"],
  },
  {
    name: "Dani Alves",
    clubs: ["Bahia", "Sevilla", "Barcelona", "Juventus", "PSG", "Sao Paulo", "Pumas UNAM"],
    hints: ["Nascido em Juazeiro, Bahia", "Posição: Lateral-direito", "Um dos jogadores mais premiados da história do futebol", "Venceu a tríplice coroa com o Barcelona em 2015", "Teve um final de carreira controverso"],
  },
  {
    name: "Marcelo",
    clubs: ["Fluminense", "Real Madrid", "Olympiacos"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Lateral-esquerdo", "É o jogador mais premiado da história do Real Madrid", "Venceu a Champions League cinco vezes pelo Real Madrid", "Conhecido pelo talento ofensivo saindo da lateral-esquerda"],
  },
  {
    name: "Alex Sandro",
    clubs: ["Athletico Paranaense", "Santos", "Porto", "Juventus", "Flamengo"],
    hints: ["Nascido em Piracicaba, São Paulo", "Posição: Lateral-esquerdo", "Tornou-se lateral-esquerdo de longa data da Juventus", "Venceu vários títulos da Serie A na Itália", "Iniciou a carreira europeia no Porto"],
  },
  {
    name: "Danilo",
    clubs: ["America Mineiro", "Santos", "Porto", "Real Madrid", "Manchester City", "Juventus", "Flamengo"],
    hints: ["Nascido em Bicas, Minas Gerais", "Posição: Lateral-direito", "Venceu a Champions League pelo Real Madrid", "Também jogou pelo Manchester City antes de se transferir para a Juventus", "Conhecido pela versatilidade em diferentes posições da defesa"],
  },
  {
    name: "Alex Telles",
    clubs: ["Juventude", "Gremio", "Galatasaray", "Inter Milan", "Porto", "Manchester United", "Sevilla", "Al-Nassr"],
    hints: ["Nascido em Caxias do Sul, Rio Grande do Sul", "Posição: Lateral-esquerdo", "Venceu vários títulos pelo Porto, em Portugal", "Transferiu-se ao Manchester United em 2020", "Conhecido pelos cruzamentos e cobranças de falta"],
  },
  {
    name: "Marquinhos",
    clubs: ["Corinthians", "Roma", "PSG"],
    hints: ["Nascido em São Paulo", "Posição: Zagueiro", "Capitão brasileiro de longa data do Paris Saint-Germain", "Chegou ainda muito jovem ao futebol europeu, pela Roma", "Conhecido pela categoria e leitura de jogo"],
  },
  {
    name: "Thiago Silva",
    clubs: ["Juventude", "Porto", "Dinamo Moscow", "Fluminense", "AC Milan", "PSG", "Chelsea"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Zagueiro", "Foi capitão e líder defensivo do PSG por anos", "Depois se transferiu ao Chelsea já com quase 40 anos", "Considerado um dos melhores zagueiros de sua geração"],
  },
  {
    name: "David Luiz",
    clubs: ["Vitoria", "Benfica", "Chelsea", "PSG", "Arsenal", "Flamengo"],
    hints: ["Nascido em Diadema, São Paulo", "Posição: Zagueiro", "Conhecido pelas subidas ofensivas e cabelo comprido", "Venceu a Champions League pelo Chelsea em 2012", "Também jogou por PSG e Arsenal"],
  },
  {
    name: "Eder Militao",
    clubs: ["Sao Paulo", "Porto", "Real Madrid"],
    hints: ["Nascido em Sertãozinho, São Paulo", "Posição: Zagueiro", "Venceu a Champions League diversas vezes pelo Real Madrid", "Jogou brevemente pelo Porto antes da grande transferência para a Espanha", "Conhecido pela velocidade e força física"],
  },
  {
    name: "Bremer",
    clubs: ["Atletico Mineiro", "Torino", "Juventus"],
    hints: ["Nascido em Itapetininga, São Paulo", "Posição: Zagueiro", "Se destacou na Serie A pelo Torino", "Transferiu-se para a Juventus em um negócio de peso", "Conhecido pela força física e marcação individual"],
  },
  {
    name: "Alisson",
    clubs: ["Internacional", "Roma", "Liverpool"],
    hints: ["Nascido em Novo Hamburgo, Rio Grande do Sul", "Posição: Goleiro", "Venceu a Champions League pelo Liverpool em 2019", "Jogou pela Roma, na Itália, antes de se mudar para a Inglaterra", "Conhecido pelas defesas e boa saída de bola"],
  },
  {
    name: "Ederson",
    clubs: ["Sao Paulo", "Rio Ave", "Benfica", "Manchester City"],
    hints: ["Nascido em Osasco, São Paulo", "Posição: Goleiro", "Conhecido pelos lançamentos longos e qualidade com os pés", "Venceu vários títulos da Premier League pelo Manchester City", "Jogou em Portugal pelo Benfica antes de se mudar para a Inglaterra"],
  },
  {
    name: "Weverton",
    clubs: ["Corinthians", "Portuguesa", "Botafogo-SP", "Athletico Paranaense", "Palmeiras"],
    hints: ["Nascido em Ipatinga, Minas Gerais", "Posição: Goleiro", "Venceu duas Libertadores seguidas pelo Palmeiras", "Tornou-se goleiro da seleção brasileira", "Conhecido pela habilidade em defender pênaltis"],
  },
  {
    name: "Julio Cesar",
    clubs: ["Flamengo", "Chievo", "Inter Milan", "QPR", "Toronto FC", "Benfica"],
    hints: ["Revelado nas categorias de base do Flamengo", "Posição: Goleiro", "Venceu a tríplice coroa com a Inter de Milão em 2010", "Era o goleiro titular do Brasil às vésperas da Copa do Mundo de 2010", "Depois jogou na Inglaterra e na América do Norte"],
  },
  {
    name: "Diego Alves",
    clubs: ["Atletico Mineiro", "Almeria", "Valencia", "Flamengo", "Celta de Vigo"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Goleiro", "Foi reconhecido como um dos melhores goleiros da Europa em defender pênaltis", "Passou muitos anos no Valencia, na Espanha", "Venceu a Copa Libertadores pelo Flamengo em 2019"],
  },
  {
    name: "Diego Ribas",
    clubs: ["Santos", "Porto", "Werder Bremen", "Juventus", "Wolfsburg", "Atletico Madrid", "Fenerbahce", "Flamengo"],
    hints: ["Nascido em Ribeirão Preto, São Paulo", "Posição: Meia-atacante", "Venceu o campeonato alemão pelo Wolfsburg", "Jogou por diversos grandes clubes europeus ao longo da carreira", "Conhecido apenas pelo primeiro nome, Diego"],
  },
  {
    name: "Renato Augusto",
    clubs: ["Flamengo", "Bayer Leverkusen", "Corinthians", "Beijing Guoan", "Fluminense"],
    hints: ["Revelado nas categorias de base do Flamengo", "Posição: Meio-campista", "Jogou na Bundesliga pelo Bayer Leverkusen", "Teve uma passagem lucrativa pelo futebol chinês no Beijing Guoan", "Conhecido pela qualidade de passe e chegadas com gol"],
  },
  {
    name: "Paulinho",
    clubs: ["Bragantino", "Corinthians", "Tottenham", "Guangzhou Evergrande", "Barcelona", "Al-Ahli"],
    hints: ["Revelado nas categorias de base do Bragantino", "Posição: Meio-campista", "Transferiu-se ao Barcelona após uma passagem pelo futebol chinês", "Também jogou na Premier League pelo Tottenham", "Conhecido pelas chegadas com gol saindo do meio-campo"],
  },
  {
    name: "Fernandinho",
    clubs: ["Athletico Paranaense", "Shakhtar Donetsk", "Manchester City"],
    hints: ["Nascido em Londrina, Paraná", "Posição: Volante", "Foi volante titular do Manchester City por uma década", "Venceu vários títulos da Premier League", "Iniciou a carreira no Shakhtar Donetsk, na Ucrânia"],
  },
  {
    name: "Everton Ribeiro",
    clubs: ["Corinthians", "Sao Caetano", "Coritiba", "Cruzeiro", "Al-Ahli", "Flamengo", "Bahia"],
    hints: ["Revelado nas categorias de base do Corinthians", "Posição: Meia-atacante", "Venceu a Copa Libertadores pelo Flamengo em 2019", "Teve uma passagem na Arábia Saudita pelo Al-Ahli", "Conhecido pelo drible elegante e passes precisos"],
  },
  {
    name: "Vinicius Junior",
    clubs: ["Flamengo", "Real Madrid"],
    hints: ["Nascido em São Gonçalo, Rio de Janeiro", "Posição: Ponta", "Tornou-se herói de finais de Champions League pelo Real Madrid", "Veste a camisa 7 do Real Madrid", "Conhecido pela velocidade explosiva e drible"],
  },
  {
    name: "Rodrygo Goes",
    clubs: ["Santos", "Real Madrid"],
    hints: ["Nascido em Osasco, São Paulo", "Posição: Atacante / ponta", "Marcou gols decisivos no fim de jogos na campanha do Real Madrid na Champions League de 2022", "Foi revelado nas categorias de base do Santos", "Conhecido pela frieza em momentos decisivos"],
  },
  {
    name: "Pele",
    clubs: ["Santos", "New York Cosmos"],
    hints: ["Nascido em Três Corações, Minas Gerais", "Posição: Atacante", "Venceu três Copas do Mundo com o Brasil (1958, 1962 e 1970)", "Amplamente considerado um dos maiores jogadores da história do futebol", "Marcou mais de 1.000 gols na carreira"],
  },
  {
    name: "Ronaldo Nazario",
    clubs: ["Cruzeiro", "PSV", "Barcelona", "Inter Milan", "Real Madrid", "AC Milan", "Corinthians"],
    hints: ["Nascido no Rio de Janeiro", "Posição: Atacante", "Apelidado de 'Fenômeno'", "Venceu a Copa do Mundo de 1994 e 2002", "Sofreu graves lesões no joelho que interromperam seu auge"],
  },
  {
    name: "Ronaldinho",
    clubs: ["Gremio", "PSG", "Barcelona", "AC Milan", "Flamengo", "Atletico Mineiro", "Queretaro", "Fluminense"],
    hints: ["Nascido em Porto Alegre, Rio Grande do Sul", "Posição: Atacante / ponta", "Venceu a Copa do Mundo de 2002", "Venceu a Bola de Ouro em 2005", "Famoso pela habilidade, criatividade e sorriso constante"],
  },
  {
    name: "Kaka",
    clubs: ["Sao Paulo", "AC Milan", "Real Madrid"],
    hints: ["Nascido em Brasília", "Posição: Meia-atacante", "Venceu a Copa do Mundo com o Brasil em 2002", "Venceu a Bola de Ouro em 2007", "Venceu a Champions League pelo AC Milan"],
  },
  {
    name: "Neymar Jr",
    clubs: ["Santos", "Barcelona", "PSG", "Al-Hilal"],
    hints: ["Nascido em Mogi das Cruzes, São Paulo", "Posição: Atacante", "Venceu o ouro olímpico com o Brasil em 2016", "Fez parte do trio ofensivo MSN do Barcelona, campeão da tríplice coroa", "Tornou-se a transferência mais cara da história do futebol ao se mudar para o PSG"],
  },
  {
    name: "Roberto Carlos",
    clubs: ["Palmeiras", "Inter Milan", "Real Madrid", "Fenerbahce", "Corinthians"],
    hints: ["Nascido em Garça, São Paulo", "Posição: Lateral-esquerdo", "Famoso por uma cobrança de falta contra a França em 1997 que desafiava a física", "Venceu a Champions League três vezes", "Conhecido pelos chutes potentes de longa distância"],
  },
  {
    name: "Cafu",
    clubs: ["Sao Paulo", "Zaragoza", "Juventude", "Roma", "AC Milan"],
    hints: ["Nascido em São Paulo", "Posição: Lateral-direito", "Único jogador a disputar três finais consecutivas de Copa do Mundo", "Venceu a Copa do Mundo com o Brasil em 1994 e 2002", "Venceu a Champions League pelo AC Milan"],
  },
  {
    name: "Rivaldo",
    clubs: ["Corinthians", "Palmeiras", "Deportivo La Coruna", "Barcelona", "AC Milan", "Cruzeiro", "Olympiacos"],
    hints: ["Nascido em Recife, Pernambuco", "Posição: Atacante / meia-atacante", "Venceu a Copa do Mundo com o Brasil em 2002", "Venceu a Bola de Ouro em 1999", "Conhecido pela perna esquerda potente e gols espetaculares"],
  },
];

const CLUES_ROUND_SECONDS = 20;
const QUESTIONS_PER_GAME = 10;
const LINEUP_ROUND_SECONDS = 60;
const LINEUPS_PER_GAME = 10;
const MAX_HINTS = 3;
const HINT_SCORE_FACTORS = [1, 0.75, 0.5, 0.25]; // index = hints used
const CLUBS_ROUND_SECONDS = 30;
const CLUBS_PER_GAME = 10;
const MAX_CLUBS_HINTS = 5;
const CLUBS_HINT_SCORE_FACTORS = [1, 0.85, 0.7, 0.55, 0.4, 0.25]; // index = hints used (0-5)
const YEAR_ROUND_SECONDS = 20;
const YEARS_PER_GAME = 10;
const RANDOM_PER_GAME = 10;

// ============ TRANSLATIONS (UI chrome) ============
const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
];

const TRANSLATIONS = {
  en: {
    eyebrow: "KICKOFF QUIZ",
    title: "GUESS THE PLAYER",
    chooseMode: "Choose a mode to start playing.",
    singlePlayerTitle: "Single Player",
    singlePlayerDesc: "Test your football knowledge across 5 solo game modes.",
    singlePlayerCta: "PLAY SOLO",
    singlePlayerEyebrow: "SINGLE PLAYER",
    singlePlayerHeading: "Choose Your Mode",
    cluesModeTitle: "Clues Mode",
    cluesModeDesc: "Read three clues, pick the player from four options.",
    playClues: "PLAY CLUES MODE",
    lineupModeTitle: "Lineup Mode",
    lineupModeDesc: "Guess the missing player in a famous lineup. Up to 3 hints available.",
    playLineup: "PLAY LINEUP MODE",
    clubsModeTitle: "Clubs Mode",
    clubsModeDesc: "Guess the player from the clubs on their career. Up to 5 hints available.",
    playClubsMode: "PLAY CLUBS MODE",
    clubsLabel: "CLUBS",
    clubsGuessPlaceholder: "Type the player's name",
    yearModeTitle: "Year Mode",
    yearModeDesc: "Read a football fact and guess the year it happened, from four options.",
    randomModeTitle: "Random Mode",
    randomModeDesc: "A mix of all four modes — clues, lineups, clubs, and years — in one 10-question game.",
    playRandomMode: "PLAY RANDOM MODE",
    playYearMode: "PLAY YEAR MODE",
    multiplayerTitle: "Multiplayer",
    multiplayerDesc: "Challenge a random opponent to a live 1v1 duel.",
    multiplayerCta: "LIVE",
    multiplayerComingTitle: "1V1 DUELS",
    multiplayerComingDesc:
      "Sign in, pick a nickname, and get matched instantly with another player for a live 10-question duel.",
    authEmailLabel: "Email",
    authPasswordLabel: "Password",
    showPasswordLabel: "Show password",
    hidePasswordLabel: "Hide password",
    authLoginBtn: "LOG IN",
    authSignupBtn: "CREATE ACCOUNT",
    authToggleToSignup: "No account yet? Create one",
    authToggleToLogin: "Already have an account? Log in",
    authSignupHeading: "CREATE ACCOUNT",
    authSignupHeadingDesc: "Pick an email and password to get started.",
    authLoginHeading: "LOG IN",
    authLoginHeadingDesc: "Enter your account to continue.",
    authGoogleBtn: "Continue with Google",
    authOr: "or",
    authCheckEmail: "Check your inbox to confirm your account.",
    authGenericError: "Something went wrong. Try again.",
    authLoggedInAs: "Signed in as",
    authLogoutBtn: "LOG OUT",
    authMatchmakingNote: "Matchmaking isn't ready yet - hang tight!",
    nicknameLabel: "Pick a nickname",
    nicknamePlaceholder: "Your nickname",
    nicknameSaveBtn: "SAVE AND CONTINUE",
    changeNicknameBtn: "Change nickname",
    findMatchBtn: "FIND RANDOM MATCH",
    searchingText: "Looking for an opponent...",
    cancelSearchBtn: "CANCEL",
    matchFoundText: "Match found! Opponent:",
    inviteComingSoon: "Inviting a friend is coming soon.",
    duelYouLabel: "YOU",
    duelOpponentLabel: "OPPONENT",
    duelWaitingTitle: "Waiting for opponent...",
    duelWaitingDesc: "You finished! Hang tight while your opponent wraps up.",
    duelEndWin: "You won! 🏆",
    duelEndLose: "You lost",
    duelEndDraw: "It's a draw",
    duelBackBtn: "BACK TO MULTIPLAYER",
    duelGetReady: "GET READY",
    duelVsWord: "vs",
    roomOrLabel: "or invite friends",
    createRoomBtn: "CREATE ROOM",
    joinRoomBtn: "JOIN WITH CODE",
    pickModeLabel: "Choose a mode for the room",
    pickRegionLabel: "World or Brazil?",
    roomModesEyebrow: "NEW ROOM",
    roomModesHeading: "Choose a Mode",
    roomModesSubtitle: "Choose a mode to play with your friends.",
    roomCodePlaceholder: "6-digit code",
    joinRoomSubmitBtn: "JOIN",
    roomNotFound: "Room not found or already started.",
    roomCodeLabel: "ROOM CODE",
    roomShareHint: "Share this code with your friends",
    roomCopyBtn: "COPY CODE",
    roomCodeCopiedMsg: "Copied!",
    roomPlayersLabel: "PLAYERS",
    roomWaitingHostLabel: "Waiting for the host to start the game...",
    roomEndWaitInfo:
      "Stick around to see if the host starts another round - leaving removes you from the room.",
    roomStartBtn: "START GAME",
    roomLeaveBtn: "LEAVE ROOM",
    currentModeLabel: "Mode:",
    changeModeBtn: "CHANGE MODE",
    roomReadyBtn: "I'M READY",
    roomUnreadyBtn: "✓ READY (TAP TO UNDO)",
    roomReadyBadgeShort: "READY",
    roomNotReadyBadgeShort: "WAITING",
    roomHostBadgeShort: "HOST",
    roomWaitingForReady: "Waiting for everyone to be ready...",
    roomReadyCountSuffix: "players ready",
    roomWaitingTitle: "Waiting for everyone to finish...",
    roomEndTitle: "FINAL RESULTS",
    roomPlayAgainBtn: "PLAY AGAIN (SAME CODE)",
    roomRestartTitle: "The host wants to play another round!",
    roomStayBtn: "STAY IN THE ROOM",
    yearLabel: "EVENT",
    score: "SCORE",
    question: "QUESTION",
    time: "TIME",
    lineupLabel: "LINEUP",
    cluesLabel: "CLUES",
    submitAnswer: "SUBMIT ANSWER",
    skipBtn: "SKIP - I DON'T KNOW",
    correct: "Correct! ⚽",
    answerLabel: "Answer:",
    missingPlayer: "Missing player:",
    hintsLabel: "HINTS",
    nationality: "Nationality:",
    clubs: "Clubs:",
    guessPlaceholder: "Type the missing player's name",
    submit: "SUBMIT",
    getHint: "GET A HINT ({used}/{max} used — lowers points)",
    noMoreHints: "NO MORE HINTS",
    fullTime: "FULL TIME",
    niceReading: "Nice reading of the game.",
    playAgain: "PLAY AGAIN",
    changeMode: "CHANGE MODE",
    menu: "← MENU",
    settingsTab: "Settings",
    settingsTitle: "Settings",
    settingsDesc: "Adjust how the game behaves.",
    soundLabel: "Sound effects",
    soundDesc: "Play a sound when you answer correctly or incorrectly.",
    soundOn: "ON",
    soundOff: "OFF",
    statChallenge: "Challenge\nYourself",
    statPoints: "Earn\nPoints",
    statStreak: "Get on a\nStreak",
    statPlay: "Play\nAnytime",
  },
  pt: {
    eyebrow: "PONTAPÉ INICIAL",
    title: "ADIVINHE O JOGADOR",
    chooseMode: "Escolha um modo para começar a jogar.",
    singlePlayerTitle: "Um Jogador",
    singlePlayerDesc: "Teste seu conhecimento de futebol em 5 modos solo.",
    singlePlayerCta: "JOGAR SOZINHO",
    singlePlayerEyebrow: "UM JOGADOR",
    singlePlayerHeading: "Escolha seu Modo",
    cluesModeTitle: "Modo Pistas",
    cluesModeDesc: "Leia três pistas e escolha o jogador entre quatro opções.",
    playClues: "JOGAR MODO PISTAS",
    lineupModeTitle: "Modo Escalação",
    lineupModeDesc: "Adivinhe o jogador que falta numa escalação famosa. Até 3 dicas.",
    playLineup: "JOGAR MODO ESCALAÇÃO",
    clubsModeTitle: "Modo Clubes",
    clubsModeDesc: "Adivinhe o jogador pelos clubes da carreira dele. Até 5 dicas.",
    playClubsMode: "JOGAR MODO CLUBES",
    clubsLabel: "CLUBES",
    clubsGuessPlaceholder: "Digite o nome do jogador",
    yearModeTitle: "Modo Ano",
    yearModeDesc: "Leia um fato do futebol e adivinhe em que ano ele aconteceu, entre quatro opções.",
    randomModeTitle: "Modo Aleatório",
    randomModeDesc: "Uma mistura dos quatro modos — pistas, escalações, clubes e anos — em uma partida de 10 perguntas.",
    playRandomMode: "JOGAR MODO ALEATÓRIO",
    playYearMode: "JOGAR MODO ANO",
    multiplayerTitle: "Multiplayer",
    multiplayerDesc: "Desafie um oponente aleatório num duelo 1x1 ao vivo.",
    multiplayerCta: "AO VIVO",
    multiplayerComingTitle: "DUELOS 1X1",
    multiplayerComingDesc:
      "Entre, escolha um apelido e seja pareado na hora com outro jogador pra um duelo ao vivo de 10 perguntas.",
    authEmailLabel: "Email",
    authPasswordLabel: "Senha",
    showPasswordLabel: "Mostrar senha",
    hidePasswordLabel: "Esconder senha",
    authLoginBtn: "ENTRAR",
    authSignupBtn: "CRIAR CONTA",
    authToggleToSignup: "Não tem conta? Criar uma",
    authToggleToLogin: "Já tem conta? Entrar",
    authSignupHeading: "CRIAR CONTA",
    authSignupHeadingDesc: "Escolha um email e senha para começar.",
    authLoginHeading: "ENTRAR",
    authLoginHeadingDesc: "Entre na sua conta para continuar.",
    authGoogleBtn: "Continuar com Google",
    authOr: "ou",
    authCheckEmail: "Confira seu email pra confirmar a conta.",
    authGenericError: "Algo deu errado. Tenta de novo.",
    authLoggedInAs: "Logado como",
    authLogoutBtn: "SAIR",
    authMatchmakingNote: "As partidas ainda não estão prontas - aguenta aí!",
    nicknameLabel: "Escolha um apelido",
    nicknamePlaceholder: "Seu apelido",
    nicknameSaveBtn: "SALVAR E CONTINUAR",
    changeNicknameBtn: "Trocar apelido",
    findMatchBtn: "BUSCAR PARTIDA ALEATÓRIA",
    searchingText: "Procurando um oponente...",
    cancelSearchBtn: "CANCELAR",
    matchFoundText: "Partida encontrada! Oponente:",
    inviteComingSoon: "Convidar um amigo vem em breve.",
    duelYouLabel: "VOCÊ",
    duelOpponentLabel: "OPONENTE",
    duelWaitingTitle: "Aguardando oponente...",
    duelWaitingDesc: "Você terminou! Aguenta aí enquanto seu oponente termina.",
    duelEndWin: "Você venceu! 🏆",
    duelEndLose: "Você perdeu",
    duelEndDraw: "Empate",
    duelBackBtn: "VOLTAR AO MULTIPLAYER",
    duelGetReady: "PREPARA AÍ",
    duelVsWord: "vs",
    roomOrLabel: "ou convide amigos",
    createRoomBtn: "CRIAR SALA",
    joinRoomBtn: "ENTRAR COM CÓDIGO",
    pickModeLabel: "Escolha um modo pra sala",
    pickRegionLabel: "Mundo ou Brasil?",
    roomModesEyebrow: "NOVA SALA",
    roomModesHeading: "Escolha um Modo",
    roomModesSubtitle: "Escolha um modo para jogar com seus amigos.",
    roomCodePlaceholder: "código de 6 dígitos",
    joinRoomSubmitBtn: "ENTRAR",
    roomNotFound: "Sala não encontrada ou já começou.",
    roomCodeLabel: "CÓDIGO DA SALA",
    roomShareHint: "Compartilhe esse código com seus amigos",
    roomCopyBtn: "COPIAR CÓDIGO",
    roomCodeCopiedMsg: "Copiado!",
    roomPlayersLabel: "JOGADORES",
    roomWaitingHostLabel: "Aguardando o anfitrião iniciar a partida...",
    roomEndWaitInfo:
      "Fique aqui para ver se o anfitrião começa outra rodada - sair remove você da sala.",
    roomStartBtn: "INICIAR PARTIDA",
    roomLeaveBtn: "SAIR DA SALA",
    currentModeLabel: "Modo:",
    changeModeBtn: "TROCAR MODO",
    roomReadyBtn: "ESTOU PRONTO",
    roomUnreadyBtn: "✓ PRONTO (TOQUE PARA DESMARCAR)",
    roomReadyBadgeShort: "PRONTO",
    roomNotReadyBadgeShort: "AGUARDANDO",
    roomHostBadgeShort: "ANFITRIÃO",
    roomWaitingForReady: "Aguardando todos ficarem prontos...",
    roomReadyCountSuffix: "jogadores prontos",
    roomWaitingTitle: "Aguardando todo mundo terminar...",
    roomEndTitle: "RESULTADO FINAL",
    roomPlayAgainBtn: "JOGAR DE NOVO (MESMO CÓDIGO)",
    roomRestartTitle: "O anfitrião quer jogar outra rodada!",
    roomStayBtn: "FICAR NA SALA",
    yearLabel: "ACONTECIMENTO",
    score: "PONTOS",
    question: "PERGUNTA",
    time: "TEMPO",
    lineupLabel: "ESCALAÇÃO",
    cluesLabel: "PISTAS",
    submitAnswer: "ENVIAR RESPOSTA",
    skipBtn: "PULAR - NÃO SEI",
    correct: "Correto! ⚽",
    answerLabel: "Resposta:",
    missingPlayer: "Jogador que faltava:",
    hintsLabel: "DICAS",
    nationality: "Nacionalidade:",
    clubs: "Clubes:",
    guessPlaceholder: "Digite o nome do jogador que falta",
    submit: "ENVIAR",
    getHint: "PEDIR DICA ({used}/{max} usadas — reduz pontos)",
    noMoreHints: "SEM MAIS DICAS",
    fullTime: "FIM DE JOGO",
    niceReading: "Boa leitura de jogo.",
    playAgain: "JOGAR NOVAMENTE",
    changeMode: "TROCAR MODO",
    menu: "← MENU",
    settingsTab: "Configurações",
    settingsTitle: "Configurações",
    settingsDesc: "Ajuste como o jogo se comporta.",
    soundLabel: "Efeitos sonoros",
    soundDesc: "Toca um som quando você acerta ou erra uma resposta.",
    soundOn: "LIGADO",
    soundOff: "DESLIGADO",
    statChallenge: "Desafie-se",
    statPoints: "Ganhe\nPontos",
    statStreak: "Entre em\nSequência",
    statPlay: "Jogue\nQuando Quiser",
  },
  es: {
    eyebrow: "SAQUE INICIAL",
    title: "ADIVINA AL JUGADOR",
    chooseMode: "Elige un modo para empezar a jugar.",
    singlePlayerTitle: "Un Jugador",
    singlePlayerDesc: "Pon a prueba tu conocimiento de fútbol en 5 modos individuales.",
    singlePlayerCta: "JUGAR SOLO",
    singlePlayerEyebrow: "UN JUGADOR",
    singlePlayerHeading: "Elige tu Modo",
    cluesModeTitle: "Modo Pistas",
    cluesModeDesc: "Lee tres pistas y elige al jugador entre cuatro opciones.",
    playClues: "JUGAR MODO PISTAS",
    lineupModeTitle: "Modo Alineación",
    lineupModeDesc: "Adivina al jugador que falta en una alineación famosa. Hasta 3 pistas.",
    playLineup: "JUGAR MODO ALINEACIÓN",
    clubsModeTitle: "Modo Clubes",
    clubsModeDesc: "Adivina al jugador por los clubes de su carrera. Hasta 5 pistas.",
    playClubsMode: "JUGAR MODO CLUBES",
    clubsLabel: "CLUBES",
    clubsGuessPlaceholder: "Escribe el nombre del jugador",
    yearModeTitle: "Modo Año",
    yearModeDesc: "Lee un dato del fútbol y adivina en qué año ocurrió, entre cuatro opciones.",
    randomModeTitle: "Modo Aleatorio",
    randomModeDesc: "Una mezcla de los cuatro modos — pistas, alineaciones, clubes y años — en una partida de 10 preguntas.",
    playRandomMode: "JUGAR MODO ALEATORIO",
    playYearMode: "JUGAR MODO AÑO",
    multiplayerTitle: "Multijugador",
    multiplayerDesc: "Desafía a un oponente aleatorio a un duelo 1v1 en vivo.",
    multiplayerCta: "EN VIVO",
    multiplayerComingTitle: "DUELOS 1V1",
    multiplayerComingDesc:
      "Inicia sesión, elige un apodo y emparéjate al instante con otro jugador para un duelo en vivo de 10 preguntas.",
    authEmailLabel: "Correo",
    authPasswordLabel: "Contraseña",
    showPasswordLabel: "Mostrar contraseña",
    hidePasswordLabel: "Ocultar contraseña",
    authLoginBtn: "INICIAR SESIÓN",
    authSignupBtn: "CREAR CUENTA",
    authToggleToSignup: "¿No tienes cuenta? Crea una",
    authToggleToLogin: "¿Ya tienes cuenta? Inicia sesión",
    authSignupHeading: "CREAR CUENTA",
    authSignupHeadingDesc: "Elige un email y contraseña para empezar.",
    authLoginHeading: "INICIAR SESIÓN",
    authLoginHeadingDesc: "Ingresa a tu cuenta para continuar.",
    authGoogleBtn: "Continuar con Google",
    authOr: "o",
    authCheckEmail: "Revisa tu correo para confirmar la cuenta.",
    authGenericError: "Algo salió mal. Intenta de nuevo.",
    authLoggedInAs: "Conectado como",
    authLogoutBtn: "CERRAR SESIÓN",
    authMatchmakingNote: "Las partidas todavía no están listas - ¡espera un poco!",
    nicknameLabel: "Elige un apodo",
    nicknamePlaceholder: "Tu apodo",
    nicknameSaveBtn: "GUARDAR Y CONTINUAR",
    changeNicknameBtn: "Cambiar apodo",
    findMatchBtn: "BUSCAR PARTIDA ALEATORIA",
    searchingText: "Buscando un oponente...",
    cancelSearchBtn: "CANCELAR",
    matchFoundText: "¡Partida encontrada! Oponente:",
    inviteComingSoon: "Invitar a un amigo llega pronto.",
    duelYouLabel: "TÚ",
    duelOpponentLabel: "OPONENTE",
    duelWaitingTitle: "Esperando al oponente...",
    duelWaitingDesc: "¡Terminaste! Espera un poco mientras tu oponente termina.",
    duelEndWin: "¡Ganaste! 🏆",
    duelEndLose: "Perdiste",
    duelEndDraw: "Empate",
    duelBackBtn: "VOLVER A MULTIJUGADOR",
    duelGetReady: "PREPÁRATE",
    duelVsWord: "vs",
    roomOrLabel: "o invita amigos",
    createRoomBtn: "CREAR SALA",
    joinRoomBtn: "UNIRSE CON CÓDIGO",
    pickModeLabel: "Elige un modo para la sala",
    pickRegionLabel: "¿Mundo o Brasil?",
    roomModesEyebrow: "SALA NUEVA",
    roomModesHeading: "Elige un Modo",
    roomModesSubtitle: "Elige un modo para jugar con tus amigos.",
    roomCodePlaceholder: "código de 6 dígitos",
    joinRoomSubmitBtn: "UNIRSE",
    roomNotFound: "Sala no encontrada o ya comenzó.",
    roomCodeLabel: "CÓDIGO DE SALA",
    roomShareHint: "Comparte este código con tus amigos",
    roomCopyBtn: "COPIAR CÓDIGO",
    roomCodeCopiedMsg: "¡Copiado!",
    roomPlayersLabel: "JUGADORES",
    roomWaitingHostLabel: "Esperando a que el anfitrión inicie la partida...",
    roomEndWaitInfo:
      "Quédate para ver si el anfitrión empieza otra ronda - salir te quita de la sala.",
    roomStartBtn: "INICIAR PARTIDA",
    roomLeaveBtn: "SALIR DE LA SALA",
    currentModeLabel: "Modo:",
    changeModeBtn: "CAMBIAR MODO",
    roomReadyBtn: "ESTOY LISTO",
    roomUnreadyBtn: "✓ LISTO (TOCA PARA CANCELAR)",
    roomReadyBadgeShort: "LISTO",
    roomNotReadyBadgeShort: "ESPERANDO",
    roomHostBadgeShort: "ANFITRIÓN",
    roomWaitingForReady: "Esperando a que todos estén listos...",
    roomReadyCountSuffix: "jugadores listos",
    roomWaitingTitle: "Esperando a que todos terminen...",
    roomEndTitle: "RESULTADO FINAL",
    roomPlayAgainBtn: "JUGAR DE NUEVO (MISMO CÓDIGO)",
    roomRestartTitle: "¡El anfitrión quiere jugar otra ronda!",
    roomStayBtn: "QUEDARME EN LA SALA",
    yearLabel: "ACONTECIMIENTO",
    score: "PUNTOS",
    question: "PREGUNTA",
    time: "TIEMPO",
    lineupLabel: "ALINEACIÓN",
    cluesLabel: "PISTAS",
    submitAnswer: "ENVIAR RESPUESTA",
    skipBtn: "SALTAR - NO SÉ",
    correct: "¡Correcto! ⚽",
    answerLabel: "Respuesta:",
    missingPlayer: "Jugador que faltaba:",
    hintsLabel: "PISTAS",
    nationality: "Nacionalidad:",
    clubs: "Clubes:",
    guessPlaceholder: "Escribe el nombre del jugador que falta",
    submit: "ENVIAR",
    getHint: "PEDIR PISTA ({used}/{max} usadas — reduce puntos)",
    noMoreHints: "SIN MÁS PISTAS",
    fullTime: "FIN DEL PARTIDO",
    niceReading: "Buena lectura del partido.",
    playAgain: "JUGAR DE NUEVO",
    changeMode: "CAMBIAR MODO",
    menu: "← MENÚ",
    settingsTab: "Ajustes",
    settingsTitle: "Ajustes",
    settingsDesc: "Ajusta cómo se comporta el juego.",
    soundLabel: "Efectos de sonido",
    soundDesc: "Reproduce un sonido cuando aciertas o fallas una respuesta.",
    soundOn: "ACTIVADO",
    soundOff: "DESACTIVADO",
    statChallenge: "Desafíate",
    statPoints: "Gana\nPuntos",
    statStreak: "Entra en\nRacha",
    statPlay: "Juega\nCuando Quieras",
  },
};

// ============ HELPERS ============
// Every correct answer is worth up to 10 points (never 0), scaled down by
// how much time was left and, where relevant, how many hints were used -
// so a full round of 10 questions always tops out at a simple 100.
function questionScore(timeLeft, roundSeconds, hintFactor = 1) {
  const timeFactor = 0.4 + 0.6 * Math.max(0, Math.min(1, timeLeft / roundSeconds));
  return Math.max(1, Math.round(10 * timeFactor * hintFactor));
}
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeName(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function isCloseEnough(guess, answer, altName) {
  const g = normalizeName(guess);
  const a = normalizeName(answer);
  if (!g) return false;
  if (g === a) return true;
  const parts = a.split(" ").filter(Boolean);
  // Accept a match against any individual part of the name (first name,
  // last name, or a middle nickname), since many players are known by
  // just one part — not necessarily the last word. Skip very short
  // connector words (van, de, da...) as standalone matches unless the
  // name is genuinely just one word.
  for (const part of parts) {
    if (part.length < 3 && parts.length > 1) continue;
    if (g === part) return true;
    const dist = part.length <= 6 ? 1 : 2;
    if (levenshtein(g, part) <= dist) return true;
  }
  if (altName) {
    const alt = normalizeName(altName);
    if (g === alt) return true;
    if (levenshtein(g, alt) <= (alt.length <= 6 ? 1 : 2)) return true;
  }
  const maxDist = a.length <= 6 ? 1 : 2;
  if (levenshtein(g, a) <= maxDist) return true;
  return false;
}

// Strips common club prefixes/suffixes (FC Porto vs Porto, AC Milan vs
// Milan) so the same club matches regardless of which form the data uses.
function normalizeClubName(name) {
  return (name || "")
    .toLowerCase()
    .replace(/\b(fc|cf|ac|afc|sc|cd)\b\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// The "Clubs" hint in Lineup mode lists a player's career clubs, but
// the current team is already shown on the pitch above - repeating it
// in the hint gives the answer away for free. Drop it from the list.
function otherClubsHint(clubsStr, currentTeam) {
  if (!clubsStr) return clubsStr;
  const normTeam = normalizeClubName(currentTeam);
  const filtered = clubsStr
    .split(",")
    .map((c) => c.trim())
    .filter((c) => normalizeClubName(c) !== normTeam);
  return filtered.length > 0 ? filtered.join(", ") : clubsStr;
}

const MODE_ACCENTS = {
  clues: { solid: "#1CB0F6", dark: "#0A91D1" },
  lineup: { solid: "#FF9600", dark: "#E07C00" },
  clubs: { solid: "#58CC02", dark: "#46A302" },
  year: { solid: "#FF4B4B", dark: "#E23636" },
  random: { solid: "#00C2B8", dark: "#009C94" },
  mundo: { solid: "#1CB0F6", dark: "#0A91D1" },
  brasil: { solid: "#FFC94D", dark: "#E0A82E" },
  multiplayer: { solid: "#1CB0F6", dark: "#0A91D1" },
  singlePlayer: { solid: "#22C744", dark: "#0B6F27" },
};

const TEAM_KIT = {
  "AC Milan": { bg: "#D81920", text: "#FFFFFF" },
  Ajax: { bg: "#D2122E", text: "#FFFFFF" },
  Arsenal: { bg: "#EF0107", text: "#FFFFFF" },
  "Atlético Mineiro": { bg: "#1A1A1A", text: "#FFFFFF" },
  "Atletico Madrid": { bg: "#CB3524", text: "#FFFFFF" },
  "Bayern Munich": { bg: "#DC052D", text: "#FFFFFF" },
  Botafogo: { bg: "#1A1A1A", text: "#FFFFFF" },
  "Borussia Dortmund": { bg: "#FDE100", text: "#101820" },
  Chelsea: { bg: "#034694", text: "#FFFFFF" },
  Corinthians: { bg: "#FFFFFF", text: "#101820" },
  Cruzeiro: { bg: "#003DA5", text: "#FFFFFF" },
  "FC Barcelona": { bg: "#A50044", text: "#FFFFFF" },
  "FC Porto": { bg: "#003399", text: "#FFFFFF" },
  Flamengo: { bg: "#E30613", text: "#FFFFFF" },
  Fluminense: { bg: "#8A1538", text: "#FFFFFF" },
  "Grêmio": { bg: "#0033A0", text: "#FFFFFF" },
  "Inter Milan": { bg: "#0068A8", text: "#FFFFFF" },
  Internacional: { bg: "#C8102E", text: "#FFFFFF" },
  Juventus: { bg: "#1A1A1A", text: "#FFFFFF" },
  Liverpool: { bg: "#C8102E", text: "#FFFFFF" },
  "Manchester City": { bg: "#6CABDD", text: "#101820" },
  "Manchester United": { bg: "#DA291C", text: "#FFFFFF" },
  Palmeiras: { bg: "#006437", text: "#FFFFFF" },
  "Paris Saint-Germain": { bg: "#004170", text: "#FFFFFF" },
  "Real Madrid": { bg: "#FFFFFF", text: "#101820" },
  Santos: { bg: "#FFFFFF", text: "#101820" },
  "São Paulo FC": { bg: "#FFFFFF", text: "#B0121A" },
  Tottenham: { bg: "#FFFFFF", text: "#132257" },
  "Vasco da Gama": { bg: "#1A1A1A", text: "#FFFFFF" },
};

function getTeamKit(team) {
  return TEAM_KIT[team] || { bg: "#FFFFFF", text: "#0B6F27" };
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#0F1D16" strokeWidth="1.8" />
      <path
        d="M19.4 13.5a7.97 7.97 0 000-3l1.8-1.4-2-3.4-2.1.7a8 8 0 00-2.6-1.5L14 2.5h-4l-.5 2.4a8 8 0 00-2.6 1.5l-2.1-.7-2 3.4L4.6 10.5a8 8 0 000 3l-1.8 1.4 2 3.4 2.1-.7a8 8 0 002.6 1.5l.5 2.4h4l.5-2.4a8 8 0 002.6-1.5l2.1.7 2-3.4-1.8-1.4z"
        stroke="#0F1D16"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function GlobeIcon({ accent = "#0B6F27" }) {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="24" fill="#FFFFFF" />
      <path
        d="M22 16c-3 5-3 14 0 19s6 9 4 16c-6-2-11-8-13-16-2-9 2-16 9-19z"
        fill={accent}
      />
      <path
        d="M42 20c3 4 4 10 1 15-2 4-1 9 2 12 4-3 7-9 6-15-1-6-5-10-9-12z"
        fill={accent}
      />
      <path
        d="M32 8v48M8 32h48M12 18c8 6 32 6 40 0M12 46c8-6 32-6 40 0"
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
        opacity="0.35"
      />
    </svg>
  );
}
function FlagIcon() {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <rect x="9" y="15" width="46" height="34" rx="6" fill="#0B6F27" />
      <polygon points="32,20 50,32 32,44 14,32" fill="#F4C542" />
      <circle cx="32" cy="32" r="8" fill="#173F8A" />
      <path
        d="M25 30a9 9 0 0114 0"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}
function PersonQuestionIcon({ accent = "#0B6F27" }) {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <path d="M12 54c2-11 9.5-17 20-17s18 6 20 17" fill="#FFFFFF" />
      <circle cx="32" cy="24" r="12" fill="#FFFFFF" />
      <circle cx="44" cy="46" r="11" fill={accent} />
      <text
        x="44"
        y="51"
        fontSize="15"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Baloo 2, sans-serif"
        fontWeight="700"
      >
        ?
      </text>
    </svg>
  );
}
function XIIcon({ accent = "#0B6F27" }) {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <rect
        x="12"
        y="12"
        width="40"
        height="40"
        rx="6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
      />
      <line x1="12" y1="32" x2="52" y2="32" stroke="#FFFFFF" strokeWidth="2.4" />
      <circle cx="32" cy="32" r="7" fill="none" stroke="#FFFFFF" strokeWidth="2.4" />
      <circle cx="20" cy="42" r="3.4" fill={accent} />
      <circle cx="32" cy="46" r="3.4" fill={accent} />
      <circle cx="44" cy="42" r="3.4" fill={accent} />
      <circle cx="32" cy="19" r="3.4" fill={accent} />
    </svg>
  );
}
function ShirtIcon({ accent = "#0B6F27" }) {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <path
        d="M22 8L10 16l4 9 6-3v33h24V22l6 3 4-9L42 8l-6 5H28l-6-5z"
        fill="#FFFFFF"
      />
      <rect x="26" y="10" width="12" height="5" rx="2.5" fill={accent} />
      <circle cx="32" cy="34" r="7" fill={accent} />
      <text
        x="32"
        y="39"
        fontSize="10"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Baloo 2, sans-serif"
        fontWeight="700"
      >
        ?
      </text>
    </svg>
  );
}
function CalendarIcon({ accent = "#0B6F27" }) {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <rect x="20" y="6" width="6" height="14" rx="3" fill={accent} />
      <rect x="38" y="6" width="6" height="14" rx="3" fill={accent} />
      <rect x="9" y="13" width="46" height="45" rx="9" fill="#FFFFFF" />
      <rect x="9" y="13" width="46" height="16" rx="9" fill={accent} />
      <rect x="9" y="22" width="46" height="7" fill={accent} />
      <g fill="rgba(255,255,255,0.4)">
        <rect x="16" y="34" width="9" height="8" rx="2" />
        <rect x="27.5" y="34" width="9" height="8" rx="2" />
        <rect x="16" y="45" width="9" height="8" rx="2" />
      </g>
      <rect x="39" y="34" width="9" height="19" rx="2" fill={accent} />
      <rect x="27.5" y="45" width="9" height="8" rx="2" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}
function DiceIcon({ accent = "#0B6F27" }) {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <rect x="20" y="20" width="34" height="34" rx="8" fill="#FFFFFF" opacity="0.35" />
      <rect x="10" y="10" width="34" height="34" rx="8" fill="#FFFFFF" />
      <circle cx="19" cy="19" r="3.4" fill={accent} />
      <circle cx="35" cy="19" r="3.4" fill={accent} />
      <circle cx="19" cy="35" r="3.4" fill={accent} />
      <circle cx="35" cy="35" r="3.4" fill={accent} />
      <circle cx="27" cy="27" r="3.4" fill={accent} />
    </svg>
  );
}
function VersusIcon({ accent = "#0B6F27" }) {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <circle cx="17" cy="20" r="9" fill="#FFFFFF" />
      <path d="M2 54c1.5-9 7-14 15-14s13.5 5 15 14" fill="#FFFFFF" />
      <circle cx="47" cy="20" r="9" fill="#FFFFFF" opacity="0.75" />
      <path d="M32 54c1.5-9 7-14 15-14s13.5 5 15 14" fill="#FFFFFF" opacity="0.75" />
      <circle cx="32" cy="34" r="11" fill={accent} />
      <text
        x="32"
        y="39"
        fontSize="11"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Baloo 2, sans-serif"
        fontWeight="700"
      >
        VS
      </text>
    </svg>
  );
}
function EyeIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
        stroke="#5F666B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="#5F666B" strokeWidth="2" />
      {!open && (
        <line
          x1="3"
          y1="21"
          x2="21"
          y2="3"
          stroke="#5F666B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
function SoloIcon({ accent = "#0B6F27" }) {
  return (
    <svg width="78" height="78" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="21" r="13" fill="#FFFFFF" />
      <path d="M10 56c2-13 10-20 22-20s20 7 22 20" fill="#FFFFFF" />
      <circle cx="47" cy="46" r="10" fill={accent} />
      <path
        d="M43 46l3 3 6-6"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function LightCard({
  icon,
  iconImage,
  imageScale,
  title,
  desc,
  cta,
  onClick,
  accent = MODE_ACCENTS.random,
}) {
  return (
    <div style={{ ...styles.lightCard, borderColor: `${accent.solid}33` }}>
      <div style={styles.lightCardIconCircle}>
        {iconImage ? (
          <img
            src={iconImage}
            alt=""
            style={{
              ...styles.lightCardIconImage,
              transform: imageScale ? `scale(${imageScale})` : undefined,
            }}
          />
        ) : (
          <div
            style={{
              ...styles.lightCardIconBadge,
              background: accent.solid,
              boxShadow: `inset 0 -7px 0 ${accent.dark}`,
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div style={styles.lightCardBody}>
        <div style={styles.lightCardTitleRow}>
          <div style={styles.lightCardTitle}>{title}</div>
          <span style={{ ...styles.lightCardChevron, color: accent.dark }}>
            ›
          </span>
        </div>
        <p style={styles.lightCardDesc}>{desc}</p>
        <button
          style={{
            ...styles.lightCardBtn,
            background: accent.solid,
            boxShadow: `0 4px 0 ${accent.dark}`,
          }}
          onClick={onClick}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
function StatItem({ icon, label }) {
  return (
    <div style={styles.statItem}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function RoomLeaderboard({
  players,
  myUserId,
  medals = false,
  showReady = false,
  hostId = null,
  readyLabel = "",
  notReadyLabel = "",
  hostLabel = "",
}) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  return (
    <div style={styles.roomLeaderboard}>
      {sorted.map((p, i) => (
        <div
          key={p.id}
          style={{
            ...styles.roomLeaderboardRow,
            ...(p.user_id === myUserId ? styles.roomLeaderboardRowMe : {}),
          }}
        >
          <span style={styles.roomLeaderboardRank}>
            {medals && i === 0
              ? "🥇"
              : medals && i === 1
              ? "🥈"
              : medals && i === 2
              ? "🥉"
              : `${i + 1}.`}
          </span>
          <span style={styles.roomLeaderboardName}>{p.nickname}</span>
          {showReady ? (
            p.user_id === hostId ? (
              <span style={styles.roomReadyBadge}>{hostLabel}</span>
            ) : (
              <span
                style={{
                  ...styles.roomReadyBadge,
                  ...(p.ready ? styles.roomReadyBadgeActive : {}),
                }}
              >
                {p.ready ? readyLabel : notReadyLabel}
              </span>
            )
          ) : (
            <span style={styles.roomLeaderboardScore}>{p.score}/100</span>
          )}
        </div>
      ))}
    </div>
  );
}

function buildLineupRound(pool = LINEUP_POOL) {
  return shuffle(pool)
    .slice(0, LINEUPS_PER_GAME)
    .map((team) => ({
      ...team,
      hiddenIndex: Math.floor(Math.random() * team.players.length),
    }));
}

function buildRandomRound(
  cluesPool = QUESTION_POOL,
  lineupPool = LINEUP_POOL,
  clubsPool = CLUBS_QUESTION_POOL,
  yearPool = YEAR_QUESTION_POOL
) {
  const types = shuffle([
    "clues", "clues", "clues",
    "lineup", "lineup", "lineup",
    "clubs", "clubs",
    "year", "year",
  ]);
  const cluesPicks = shuffle(cluesPool)
    .slice(0, 3)
    .map((q) => ({ ...q, options: shuffle(q.options) }));
  const lineupPicks = shuffle(lineupPool)
    .slice(0, 3)
    .map((team) => ({
      ...team,
      hiddenIndex: Math.floor(Math.random() * team.players.length),
    }));
  const clubsPicks = shuffle(clubsPool).slice(0, 2);
  const yearPicks = shuffle(yearPool)
    .slice(0, 2)
    .map((y) => ({ ...y, options: shuffle(y.options) }));

  let ci = 0, li = 0, cli = 0, yi = 0;
  return types.map((kind) => {
    if (kind === "clues") return { kind, data: cluesPicks[ci++] };
    if (kind === "lineup") return { kind, data: lineupPicks[li++] };
    if (kind === "clubs") return { kind, data: clubsPicks[cli++] };
    return { kind, data: yearPicks[yi++] };
  });
}

// Wraps any single mode's pool into the same {kind, data} shape
// buildRandomRound() produces, so room games can reuse the same
// "random" screen rendering regardless of which mode the host picked.
function buildRoomQuestions(selectedMode) {
  const isBrazil = selectedMode.endsWith("-br");
  const baseMode = isBrazil ? selectedMode.slice(0, -3) : selectedMode;
  if (baseMode === "clues") {
    return shuffle(isBrazil ? BRAZIL_QUESTION_POOL : QUESTION_POOL)
      .slice(0, QUESTIONS_PER_GAME)
      .map((q) => ({ kind: "clues", data: { ...q, options: shuffle(q.options) } }));
  }
  if (baseMode === "lineup") {
    return buildLineupRound(isBrazil ? BRAZIL_LINEUP_POOL : LINEUP_POOL).map((team) => ({
      kind: "lineup",
      data: team,
    }));
  }
  if (baseMode === "clubs") {
    return shuffle(isBrazil ? CLUBS_QUESTION_POOL_BRAZIL : CLUBS_QUESTION_POOL)
      .slice(0, CLUBS_PER_GAME)
      .map((q) => ({ kind: "clubs", data: q }));
  }
  if (baseMode === "year") {
    return shuffle(isBrazil ? BRAZIL_YEAR_QUESTION_POOL : YEAR_QUESTION_POOL)
      .slice(0, YEARS_PER_GAME)
      .map((q) => ({ kind: "year", data: { ...q, options: shuffle(q.options) } }));
  }
  return isBrazil
    ? buildRandomRound(
        BRAZIL_QUESTION_POOL,
        BRAZIL_LINEUP_POOL,
        CLUBS_QUESTION_POOL_BRAZIL,
        BRAZIL_YEAR_QUESTION_POOL
      )
    : buildRandomRound();
}

export default function SoccerQuiz() {
  const [screen, setScreen] = useState("start"); // start | clues | lineup | roundEnd
  const [mode, setMode] = useState("clues");
  const [score, setScore] = useState(0);
  const [lang, setLang] = useState("en");
  const t = TRANSLATIONS[lang];

  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);

  // --- Multiplayer auth state ---
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setAuthBusy(true);
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            emailRedirectTo: window.location.origin + window.location.pathname,
          },
        });
        if (error) throw error;
        setAuthMessage(t.authCheckEmail);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
      }
    } catch (err) {
      setAuthError(err.message || t.authGenericError);
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setAuthError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    if (error) setAuthError(error.message || t.authGenericError);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // --- Multiplayer profile + matchmaking state ---
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [nicknameInput, setNicknameInput] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [searching, setSearching] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState("");
  const [currentMatch, setCurrentMatch] = useState(null);
  const [opponentProfile, setOpponentProfile] = useState(null);
  const [duelActive, setDuelActive] = useState(false);
  const [myPlayerSlot, setMyPlayerSlot] = useState(null); // "player1" | "player2"
  const [duelCountdown, setDuelCountdown] = useState(3);
  const [pendingDuelMatch, setPendingDuelMatch] = useState(null);

  // --- Friend rooms (Kahoot-style, N players) ---
  const [room, setRoom] = useState(null);
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [isRoomHost, setIsRoomHost] = useState(false);
  const [roomBusy, setRoomBusy] = useState(false);
  const [roomError, setRoomError] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [roomModeRegion, setRoomModeRegion] = useState(null); // null | "world" | "brazil" (pt only)
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [roomCodeCopied, setRoomCodeCopied] = useState(false);
  const [roomActive, setRoomActive] = useState(false);
  const [roomCountdown, setRoomCountdown] = useState(3);
  const [pendingRoomQuestions, setPendingRoomQuestions] = useState(null);

  useEffect(() => {
    if (!authUser) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data ?? null);
        setProfileLoading(false);
      });
  }, [authUser]);

  async function handleSaveNickname(e) {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    setProfileBusy(true);
    setProfileError("");
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: authUser.id, nickname: nicknameInput.trim() })
      .select()
      .single();
    setProfileBusy(false);
    if (error) {
      setProfileError(error.message || t.authGenericError);
      return;
    }
    setProfile(data);
    setEditingNickname(false);
  }

  async function findRandomMatch() {
    setMatchmakingError("");
    setSearching(true);
    const { data, error } = await supabase.rpc("try_match", { p_mode: "random" });
    if (error) {
      setMatchmakingError(error.message || t.authGenericError);
      setSearching(false);
      return;
    }
    if (data) {
      // We're the one who just paired with a waiting opponent - we own
      // generating the shared question set for this duel.
      const queue = buildRandomRound();
      await supabase.from("matches").update({ questions: queue }).eq("id", data);
      openMatch(data);
    }
    // If data is null, we're now waiting in the queue - the realtime
    // subscription below picks up the match once an opponent joins.
  }

  async function cancelSearch() {
    setSearching(false);
    if (authUser) {
      await supabase.from("match_queue").delete().eq("user_id", authUser.id);
    }
  }

  async function openMatch(matchId) {
    setSearching(false);
    const { data: match } = await supabase
      .from("matches")
      .select("*")
      .eq("id", matchId)
      .maybeSingle();
    if (!match) return;
    setCurrentMatch(match);
    const opponentId = match.player1_id === authUser.id ? match.player2_id : match.player1_id;
    const { data: opp } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", opponentId)
      .maybeSingle();
    setOpponentProfile(opp ?? null);
  }

  useEffect(() => {
    if (!authUser || !profile) return;
    const channel = supabase
      .channel(`matches-${authUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `player1_id=eq.${authUser.id}`,
        },
        (payload) => openMatch(payload.new.id)
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `player2_id=eq.${authUser.id}`,
        },
        (payload) => openMatch(payload.new.id)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUser, profile]);

  // Live updates for the current match row: question set arriving,
  // opponent's live score/progress, and the finished/winner state.
  useEffect(() => {
    if (!currentMatch?.id) return;
    const channel = supabase
      .channel(`match-row-${currentMatch.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${currentMatch.id}`,
        },
        (payload) => {
          setCurrentMatch(payload.new);
          maybeFinishMatch(payload.new);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentMatch?.id]);

  // Once the shared question set lands on the match row, kick off the
  // pre-duel countdown.
  useEffect(() => {
    if (duelActive || screen === "duelCountdown") return;
    if (currentMatch?.questions?.length > 0) {
      startDuel(currentMatch);
    }
  }, [currentMatch, duelActive, screen]);

  // Ticks the "3, 2, 1" countdown, then starts play.
  useEffect(() => {
    if (screen !== "duelCountdown") return;
    if (duelCountdown <= 0) {
      const goTimer = setTimeout(() => {
        if (pendingDuelMatch) beginDuelMatch(pendingDuelMatch);
      }, 400);
      return () => clearTimeout(goTimer);
    }
    const tickTimer = setTimeout(() => setDuelCountdown((c) => c - 1), 800);
    return () => clearTimeout(tickTimer);
  }, [screen, duelCountdown]);

  // Once both players have finished, move from "waiting" to the result screen.
  useEffect(() => {
    if (duelActive && currentMatch?.status === "finished" && screen !== "duelEnd") {
      setScreen("duelEnd");
    }
  }, [currentMatch?.status, duelActive]);

  function generateRoomCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async function handleCreateRoom(selectedMode) {
    if (!authUser || !profile) return;
    setRoomBusy(true);
    setRoomError("");
    const code = generateRoomCode();
    const { data: newRoom, error } = await supabase
      .from("rooms")
      .insert({ code, mode: selectedMode, host_id: authUser.id })
      .select()
      .single();
    if (error || !newRoom) {
      setRoomBusy(false);
      setRoomError(error?.message || t.authGenericError);
      return;
    }
    await supabase
      .from("room_players")
      .insert({ room_id: newRoom.id, user_id: authUser.id, nickname: profile.nickname });
    setRoomBusy(false);
    setRoom(newRoom);
    setIsRoomHost(true);
    setRoomModeRegion(null);
    setScreen("roomLobby");
  }

  async function handleJoinRoom(e) {
    e.preventDefault();
    if (!authUser || !profile) return;
    setRoomBusy(true);
    setRoomError("");
    const code = roomCodeInput.trim();
    const { data: foundRoom } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .maybeSingle();
    // "active" means a round is in progress - only block joining then.
    // "waiting" and "finished" (the host hasn't restarted yet) both let
    // someone rejoin with the same code instead of the room disappearing
    // the moment the round ends.
    if (!foundRoom || foundRoom.status === "active") {
      setRoomBusy(false);
      setRoomError(t.roomNotFound);
      return;
    }
    const { error: joinError } = await supabase
      .from("room_players")
      .upsert(
        { room_id: foundRoom.id, user_id: authUser.id, nickname: profile.nickname, ready: false },
        { onConflict: "room_id,user_id" }
      );
    setRoomBusy(false);
    if (joinError) {
      setRoomError(joinError.message || t.authGenericError);
      return;
    }
    setRoom(foundRoom);
    setIsRoomHost(foundRoom.host_id === authUser.id);
    setShowJoinRoom(false);
    setRoomCodeInput("");
    setScreen("roomLobby");
  }

  function allPlayersReady() {
    if (!room) return true;
    const others = roomPlayers.filter((p) => p.user_id !== room.host_id);
    return others.length === 0 || others.every((p) => p.ready);
  }

  async function handleStartRoom() {
    if (!isRoomHost || !room || !allPlayersReady()) return;
    const qs = buildRoomQuestions(room.mode);
    await supabase.from("rooms").update({ questions: qs, status: "active" }).eq("id", room.id);
  }

  async function toggleReady() {
    if (!room || !authUser) return;
    const me = roomPlayers.find((p) => p.user_id === authUser.id);
    if (!me) return;
    await supabase
      .from("room_players")
      .update({ ready: !me.ready })
      .eq("room_id", room.id)
      .eq("user_id", authUser.id);
  }

  async function copyRoomCode() {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(room.code);
      setRoomCodeCopied(true);
      setTimeout(() => setRoomCodeCopied(false), 1500);
    } catch (e) {
      // clipboard unsupported/blocked — ignore
    }
  }

  async function leaveRoom() {
    if (room && authUser) {
      await supabase.from("room_players").delete().eq("room_id", room.id).eq("user_id", authUser.id);
      if (room.status === "active") {
        const { data: remaining } = await supabase
          .from("room_players")
          .select("*")
          .eq("room_id", room.id);
        // Down to one player (or none) mid-game - end it instead of
        // leaving them stuck waiting for someone who already left.
        if ((remaining?.length ?? 0) <= 1) {
          await supabase
            .from("rooms")
            .update({ status: "finished" })
            .eq("id", room.id)
            .eq("status", "active");
        }
      }
    }
    setRoomActive(false);
    setIsRoomHost(false);
    setRoom(null);
    setRoomPlayers([]);
    setPendingRoomQuestions(null);
    setRoomCountdown(3);
    setShowJoinRoom(false);
    setRoomModeRegion(null);
    setRoomError("");
    setScreen("multiplayer");
  }

  // Shared cards for picking a room mode - for Portuguese, adds a first
  // "Mundo ou Brasil?" step before the actual mode cards, mirroring the
  // Single Player flow's world/brazil split. Used both when creating a
  // room and when the host restarts one for another round.
  function renderModeCards(onPick) {
    const showRegionStep = lang === "pt";
    if (showRegionStep && !roomModeRegion) {
      return (
        <>
          <LightCard
            icon={<GlobeIcon accent={MODE_ACCENTS.mundo.dark} />}
            accent={MODE_ACCENTS.mundo}
            title="🌍 Mundo"
            desc="Craques e clubes do futebol mundial."
            cta="ENTRAR"
            onClick={() => setRoomModeRegion("world")}
          />
          <LightCard
            icon={<FlagIcon />}
            accent={MODE_ACCENTS.brasil}
            title="🇧🇷 Brasil"
            desc="Ídolos e clubes do futebol brasileiro."
            cta="ENTRAR"
            onClick={() => setRoomModeRegion("brazil")}
          />
        </>
      );
    }
    const suffix = showRegionStep && roomModeRegion === "brazil" ? "-br" : "";
    return (
      <>
        <LightCard
          icon={<PersonQuestionIcon accent={MODE_ACCENTS.clues.dark} />}
          accent={MODE_ACCENTS.clues}
          title={t.cluesModeTitle}
          desc={t.cluesModeDesc}
          cta={t.playClues}
          onClick={() => onPick("clues" + suffix)}
        />
        <LightCard
          icon={<XIIcon accent={MODE_ACCENTS.lineup.dark} />}
          accent={MODE_ACCENTS.lineup}
          title={t.lineupModeTitle}
          desc={t.lineupModeDesc}
          cta={t.playLineup}
          onClick={() => onPick("lineup" + suffix)}
        />
        <LightCard
          icon={<ShirtIcon accent={MODE_ACCENTS.clubs.dark} />}
          accent={MODE_ACCENTS.clubs}
          title={t.clubsModeTitle}
          desc={t.clubsModeDesc}
          cta={t.playClubsMode}
          onClick={() => onPick("clubs" + suffix)}
        />
        <LightCard
          icon={<CalendarIcon accent={MODE_ACCENTS.year.dark} />}
          accent={MODE_ACCENTS.year}
          title={t.yearModeTitle}
          desc={t.yearModeDesc}
          cta={t.playYearMode}
          onClick={() => onPick("year" + suffix)}
        />
        <LightCard
          icon={<DiceIcon accent={MODE_ACCENTS.random.dark} />}
          accent={MODE_ACCENTS.random}
          title={t.randomModeTitle}
          desc={t.randomModeDesc}
          cta={t.playRandomMode}
          onClick={() => onPick("random" + suffix)}
        />
      </>
    );
  }

  async function restartRoom(selectedMode) {
    if (!isRoomHost || !room) return;
    setRoomBusy(true);
    setRoomError("");
    const { error } = await supabase.rpc("restart_room", {
      p_room_id: room.id,
      p_mode: selectedMode,
    });
    setRoomBusy(false);
    if (error) {
      setRoomError(error.message || t.authGenericError);
      return;
    }
    setRoomActive(false);
    setPendingRoomQuestions(null);
    setRoomCountdown(3);
    setRoomModeRegion(null);
    setScreen("roomLobby");
  }

  function roomModeLabel(mode) {
    if (!mode) return "";
    const isBrazil = mode.endsWith("-br");
    const baseMode = isBrazil ? mode.slice(0, -3) : mode;
    const titles = {
      clues: t.cluesModeTitle,
      lineup: t.lineupModeTitle,
      clubs: t.clubsModeTitle,
      year: t.yearModeTitle,
      random: t.randomModeTitle,
    };
    const title = titles[baseMode] || baseMode;
    return isBrazil ? `🇧🇷 ${title}` : title;
  }

  async function changeRoomMode(selectedMode) {
    if (!isRoomHost || !room) return;
    setRoomBusy(true);
    setRoomError("");
    const { data: updatedRoom, error } = await supabase
      .from("rooms")
      .update({ mode: selectedMode })
      .eq("id", room.id)
      .select()
      .single();
    setRoomBusy(false);
    if (error) {
      setRoomError(error.message || t.authGenericError);
      return;
    }
    setRoom(updatedRoom);
    setRoomModeRegion(null);
    setScreen("roomLobby");
  }

  function stayInRoom() {
    setRoomActive(false);
    setPendingRoomQuestions(null);
    setRoomCountdown(3);
    setScreen("roomLobby");
  }

  // Live updates for the current room row: questions arriving, status changes.
  useEffect(() => {
    if (!room?.id) return;
    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${room.id}` },
        (payload) => setRoom(payload.new)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id]);

  // Live player list + live scores for the current room.
  useEffect(() => {
    if (!room?.id) return;
    let cancelled = false;
    function refetchPlayers() {
      Promise.all([
        supabase.from("room_players").select("*").eq("room_id", room.id).order("joined_at"),
        supabase.from("rooms").select("*").eq("id", room.id).maybeSingle(),
      ]).then(([{ data: players }, { data: freshRoom }]) => {
        if (cancelled) return;
        setRoomPlayers(players ?? []);
        if (freshRoom) maybeFinishRoom(freshRoom, players ?? []);
      });
    }
    refetchPlayers();
    const channel = supabase
      .channel(`room-players-${room.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${room.id}` },
        refetchPlayers
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [room?.id]);

  // Once the host starts the room, kick off the pre-game countdown for everyone.
  useEffect(() => {
    if (roomActive || screen === "roomCountdown") return;
    if (room?.status === "active" && room?.questions?.length > 0) {
      setPendingRoomQuestions(room.questions);
      setRoomCountdown(3);
      setScreen("roomCountdown");
    }
  }, [room, roomActive, screen]);

  // Ticks the room's "3, 2, 1" countdown, then starts play.
  useEffect(() => {
    if (screen !== "roomCountdown") return;
    if (roomCountdown <= 0) {
      const goTimer = setTimeout(() => {
        if (pendingRoomQuestions) beginRoomMatch(pendingRoomQuestions);
      }, 400);
      return () => clearTimeout(goTimer);
    }
    const tickTimer = setTimeout(() => setRoomCountdown((c) => c - 1), 800);
    return () => clearTimeout(tickTimer);
  }, [screen, roomCountdown]);

  // Once everyone has finished, move from "waiting" to the final standings.
  useEffect(() => {
    if (roomActive && room?.status === "finished" && screen !== "roomEnd") {
      setScreen("roomEnd");
    }
  }, [room?.status, roomActive]);

  // Host restarted the room for another round - everyone else gets to
  // choose whether to stay for it or leave.
  useEffect(() => {
    if (screen === "roomEnd" && room?.status === "waiting" && !isRoomHost) {
      setScreen("roomRestartPrompt");
    }
  }, [room?.status, screen, isRoomHost]);

  // --- Clues mode state ---
  const [questions, setQuestions] = useState(() =>
    shuffle(QUESTION_POOL).slice(0, QUESTIONS_PER_GAME)
  );
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [cluesTimeLeft, setCluesTimeLeft] = useState(CLUES_ROUND_SECONDS);
  const [flipped, setFlipped] = useState(false);
  const cluesTimerRef = useRef(null);
  const cluesAdvanceRef = useRef(null);

  // --- Lineup mode state ---
  const [lineups, setLineups] = useState(() => buildLineupRound());
  const [lIndex, setLIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [lAnswered, setLAnswered] = useState(false);
  const [lCorrect, setLCorrect] = useState(false);
  const [lTimeLeft, setLTimeLeft] = useState(LINEUP_ROUND_SECONDS);
  const [hintsUsed, setHintsUsed] = useState(0);
  const lineupTimerRef = useRef(null);
  const lineupAdvanceRef = useRef(null);

  // --- Clubs mode state ---
  const [clubsQuestions, setClubsQuestions] = useState(() =>
    shuffle(CLUBS_QUESTION_POOL).slice(0, CLUBS_PER_GAME)
  );
  const [cqIndex, setCqIndex] = useState(0);
  const [clubsGuess, setClubsGuess] = useState("");
  const [clubsAnswered, setClubsAnswered] = useState(false);
  const [clubsCorrect, setClubsCorrect] = useState(false);
  const [clubsTimeLeft, setClubsTimeLeft] = useState(CLUBS_ROUND_SECONDS);
  const [clubsHintsUsed, setClubsHintsUsed] = useState(0);
  const clubsTimerRef = useRef(null);
  const clubsAdvanceRef = useRef(null);

  // --- Year mode state ---
  const [yearQuestions, setYearQuestions] = useState(() =>
    shuffle(YEAR_QUESTION_POOL).slice(0, YEARS_PER_GAME)
  );
  const [yqIndex, setYqIndex] = useState(0);
  const [yearPicked, setYearPicked] = useState(null);
  const [yearSelected, setYearSelected] = useState(null);
  const [yearAnswered, setYearAnswered] = useState(false);
  const [yearTimeLeft, setYearTimeLeft] = useState(YEAR_ROUND_SECONDS);
  const yearTimerRef = useRef(null);
  const yearAdvanceRef = useRef(null);

  // --- Random mode state (mixes all four question types) ---
  const [randomQueue, setRandomQueue] = useState(() => buildRandomRound());
  const [rIndex, setRIndex] = useState(0);
  const [randomPicked, setRandomPicked] = useState(null);
  const [randomGuess, setRandomGuess] = useState("");
  const [randomAnswered, setRandomAnswered] = useState(false);
  const [randomCorrect, setRandomCorrect] = useState(false);
  const [randomTimeLeft, setRandomTimeLeft] = useState(CLUES_ROUND_SECONDS);
  const [randomHintsUsed, setRandomHintsUsed] = useState(0);
  const randomTimerRef = useRef(null);
  const randomAdvanceRef = useRef(null);

  const currentQuestion = questions[qIndex];
  const currentLineup = lineups[lIndex];
  const hiddenPlayerObj = currentLineup
    ? currentLineup.players[currentLineup.hiddenIndex]
    : null;
  const currentClubsQuestion = clubsQuestions[cqIndex];
  const currentYearQuestion = yearQuestions[yqIndex];
  const currentRandomItem = randomQueue[rIndex];
  function timeForKind(kind) {
    if (kind === "lineup") return LINEUP_ROUND_SECONDS;
    if (kind === "clubs") return CLUBS_ROUND_SECONDS;
    return CLUES_ROUND_SECONDS; // clues & year share the same 20s
  }

  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.width = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    document.body.style.display = "block";
    document.body.style.placeItems = "unset";
    document.body.style.minWidth = "0";
    const root = document.getElementById("root");
    if (root) {
      root.style.maxWidth = "none";
      root.style.margin = "0";
      root.style.padding = "0";
      root.style.textAlign = "left";
      root.style.width = "100%";
    }
  }, []);

  useEffect(() => {
    if (screen !== "clues") return;
    if (answered) return;
    if (cluesTimeLeft <= 0) {
      handleClueAnswer(picked);
      return;
    }
    cluesTimerRef.current = setTimeout(() => setCluesTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(cluesTimerRef.current);
  }, [cluesTimeLeft, screen, answered]);

  useEffect(() => {
    if (screen !== "clues" || !answered) return;
    cluesAdvanceRef.current = setTimeout(() => nextClueQuestion(), 900);
    return () => clearTimeout(cluesAdvanceRef.current);
  }, [answered]);

  useEffect(() => {
    if (screen !== "lineup") return;
    if (lAnswered) return;
    if (lTimeLeft <= 0) {
      submitLineupGuess();
      return;
    }
    lineupTimerRef.current = setTimeout(() => setLTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(lineupTimerRef.current);
  }, [lTimeLeft, screen, lAnswered]);

  useEffect(() => {
    if (screen !== "lineup" || !lAnswered) return;
    lineupAdvanceRef.current = setTimeout(() => nextLineupQuestion(), 1600);
    return () => clearTimeout(lineupAdvanceRef.current);
  }, [lAnswered]);

  useEffect(() => {
    if (screen !== "clubs") return;
    if (clubsAnswered) return;
    if (clubsTimeLeft <= 0) {
      submitClubsGuess();
      return;
    }
    clubsTimerRef.current = setTimeout(() => setClubsTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(clubsTimerRef.current);
  }, [clubsTimeLeft, screen, clubsAnswered]);

  useEffect(() => {
    if (screen !== "clubs" || !clubsAnswered) return;
    clubsAdvanceRef.current = setTimeout(() => nextClubsQuestion(), 1600);
    return () => clearTimeout(clubsAdvanceRef.current);
  }, [clubsAnswered]);

  useEffect(() => {
    if (screen !== "year") return;
    if (yearAnswered) return;
    if (yearTimeLeft <= 0) {
      handleYearAnswer(yearPicked);
      return;
    }
    yearTimerRef.current = setTimeout(() => setYearTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(yearTimerRef.current);
  }, [yearTimeLeft, screen, yearAnswered]);

  useEffect(() => {
    if (screen !== "year" || !yearAnswered) return;
    yearAdvanceRef.current = setTimeout(() => nextYearQuestion(), 900);
    return () => clearTimeout(yearAdvanceRef.current);
  }, [yearAnswered]);

  useEffect(() => {
    if (screen !== "random") return;
    if (randomAnswered) return;
    if (randomTimeLeft <= 0) {
      submitRandomAnswer();
      return;
    }
    randomTimerRef.current = setTimeout(() => setRandomTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(randomTimerRef.current);
  }, [randomTimeLeft, screen, randomAnswered]);

  useEffect(() => {
    if (screen !== "random" || !randomAnswered) return;
    randomAdvanceRef.current = setTimeout(() => nextRandomQuestion(), 1400);
    return () => clearTimeout(randomAdvanceRef.current);
  }, [randomAnswered]);

  // --- Sound effects (generated tones, no audio files needed) ---
  function getAudioContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  function playTone(freqs, duration = 0.12, type = "sine") {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + i * duration;
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (e) {
      // audio unsupported or blocked — fail silently
    }
  }
  function playCorrectSound() {
    playTone([523.25, 659.25, 783.99], 0.1);
  }
  function playWrongSound() {
    playTone([220, 164.81], 0.16, "sawtooth");
  }

  function startClues(pool = QUESTION_POOL) {
    setMode(pool === BRAZIL_QUESTION_POOL ? "brazil" : "clues");
    const chosenQuestions = shuffle(pool).slice(0, QUESTIONS_PER_GAME);
    const withShuffledOptions = chosenQuestions.map((q) => ({
      ...q,
      options: shuffle(q.options),
    }));
    setQuestions(withShuffledOptions);
    setScreen("clues");
    setQIndex(0);
    setScore(0);
    setPicked(null);
    setSelected(null);
    setAnswered(false);
    setCluesTimeLeft(CLUES_ROUND_SECONDS);
    setFlipped(false);
  }

  function handleClueAnswer(option) {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    setFlipped(true);
    if (option === currentQuestion.answer) {
      setScore((s) => s + questionScore(cluesTimeLeft, CLUES_ROUND_SECONDS));
      playCorrectSound();
    } else {
        playWrongSound();
    }
  }

  function nextClueQuestion() {
    if (qIndex + 1 >= questions.length) {
      setScreen("roundEnd");
      return;
    }
    setQIndex((i) => i + 1);
    setPicked(null);
    setSelected(null);
    setAnswered(false);
    setFlipped(false);
    setCluesTimeLeft(CLUES_ROUND_SECONDS);
  }

  function startLineup(pool = LINEUP_POOL) {
    setMode(pool === BRAZIL_LINEUP_POOL ? "brazilLineup" : "lineup");
    setLineups(buildLineupRound(pool));
    setScreen("lineup");
    setLIndex(0);
    setScore(0);
    setGuess("");
    setLAnswered(false);
    setLCorrect(false);
    setLTimeLeft(LINEUP_ROUND_SECONDS);
    setHintsUsed(0);
  }

  function requestHint() {
    if (hintsUsed >= MAX_HINTS || lAnswered) return;
    setHintsUsed((h) => h + 1);
  }

  function submitLineupGuess() {
    if (lAnswered) return;
    const hiddenPlayerData = currentLineup.players[currentLineup.hiddenIndex];
    const correct = isCloseEnough(guess, hiddenPlayerData.name, hiddenPlayerData.shortName);
    setLCorrect(correct);
    setLAnswered(true);
    if (correct) {
      const factor = HINT_SCORE_FACTORS[Math.min(hintsUsed, MAX_HINTS)];
      setScore((s) => s + questionScore(lTimeLeft, LINEUP_ROUND_SECONDS, factor));
      playCorrectSound();
    } else {
        playWrongSound();
    }
  }

  function nextLineupQuestion() {
    if (lIndex + 1 >= lineups.length) {
      setScreen("roundEnd");
      return;
    }
    setLIndex((i) => i + 1);
    setGuess("");
    setLAnswered(false);
    setLCorrect(false);
    setLTimeLeft(LINEUP_ROUND_SECONDS);
    setHintsUsed(0);
  }

  function startClubsMode(pool = CLUBS_QUESTION_POOL) {
    setMode(pool === CLUBS_QUESTION_POOL_BRAZIL ? "brazilClubs" : "clubs");
    setClubsQuestions(shuffle(pool).slice(0, CLUBS_PER_GAME));
    setScreen("clubs");
    setCqIndex(0);
    setScore(0);
    setClubsGuess("");
    setClubsAnswered(false);
    setClubsCorrect(false);
    setClubsTimeLeft(CLUBS_ROUND_SECONDS);
    setClubsHintsUsed(0);
  }

  function requestClubsHint() {
    if (clubsHintsUsed >= MAX_CLUBS_HINTS || clubsAnswered) return;
    setClubsHintsUsed((h) => h + 1);
  }

  function submitClubsGuess() {
    if (clubsAnswered) return;
    const correct = isCloseEnough(clubsGuess, currentClubsQuestion.name);
    setClubsCorrect(correct);
    setClubsAnswered(true);
    if (correct) {
      const factor = CLUBS_HINT_SCORE_FACTORS[Math.min(clubsHintsUsed, MAX_CLUBS_HINTS)];
      setScore((s) => s + questionScore(clubsTimeLeft, CLUBS_ROUND_SECONDS, factor));
      playCorrectSound();
    } else {
        playWrongSound();
    }
  }

  function nextClubsQuestion() {
    if (cqIndex + 1 >= clubsQuestions.length) {
      setScreen("roundEnd");
      return;
    }
    setCqIndex((i) => i + 1);
    setClubsGuess("");
    setClubsAnswered(false);
    setClubsCorrect(false);
    setClubsTimeLeft(CLUBS_ROUND_SECONDS);
    setClubsHintsUsed(0);
  }

  function startYearMode(pool = YEAR_QUESTION_POOL) {
    setMode(pool === BRAZIL_YEAR_QUESTION_POOL ? "brazilYear" : "year");
    const chosenQuestions = shuffle(pool).slice(0, YEARS_PER_GAME);
    const withShuffledOptions = chosenQuestions.map((q) => ({
      ...q,
      options: shuffle(q.options),
    }));
    setYearQuestions(withShuffledOptions);
    setScreen("year");
    setYqIndex(0);
    setScore(0);
    setYearPicked(null);
    setYearSelected(null);
    setYearAnswered(false);
    setYearTimeLeft(YEAR_ROUND_SECONDS);
  }

  function handleYearAnswer(option) {
    if (yearAnswered) return;
    setYearSelected(option);
    setYearAnswered(true);
    if (option === currentYearQuestion.answer) {
      setScore((s) => s + questionScore(yearTimeLeft, YEAR_ROUND_SECONDS));
      playCorrectSound();
    } else {
        playWrongSound();
    }
  }

  function nextYearQuestion() {
    if (yqIndex + 1 >= yearQuestions.length) {
      setScreen("roundEnd");
      return;
    }
    setYqIndex((i) => i + 1);
    setYearPicked(null);
    setYearSelected(null);
    setYearAnswered(false);
    setYearTimeLeft(YEAR_ROUND_SECONDS);
  }

  function startRandomMode(brazilVariant = false) {
    setMode(brazilVariant ? "brazilRandom" : "random");
    const queue = brazilVariant
      ? buildRandomRound(
          BRAZIL_QUESTION_POOL,
          BRAZIL_LINEUP_POOL,
          CLUBS_QUESTION_POOL_BRAZIL,
          BRAZIL_YEAR_QUESTION_POOL
        )
      : buildRandomRound();
    setRandomQueue(queue);
    setScreen("random");
    setRIndex(0);
    setScore(0);
    setRandomPicked(null);
    setRandomGuess("");
    setRandomAnswered(false);
    setRandomCorrect(false);
    setRandomTimeLeft(timeForKind(queue[0].kind));
    setRandomHintsUsed(0);
  }

  function submitRandomAnswer() {
    if (randomAnswered || !currentRandomItem) return;
    const item = currentRandomItem;
    let correct = false;
    if (item.kind === "clues" || item.kind === "year") {
      correct = randomPicked === item.data.answer;
    } else if (item.kind === "lineup") {
      const hiddenPlayerData = item.data.players[item.data.hiddenIndex];
      correct = isCloseEnough(randomGuess, hiddenPlayerData.name, hiddenPlayerData.shortName);
    } else if (item.kind === "clubs") {
      correct = isCloseEnough(randomGuess, item.data.name);
    }
    setRandomCorrect(correct);
    setRandomAnswered(true);
    let gained = 0;
    if (correct) {
      let factor = 1;
      if (item.kind === "lineup") factor = HINT_SCORE_FACTORS[Math.min(randomHintsUsed, MAX_HINTS)];
      if (item.kind === "clubs") factor = CLUBS_HINT_SCORE_FACTORS[Math.min(randomHintsUsed, MAX_CLUBS_HINTS)];
      gained = questionScore(randomTimeLeft, timeForKind(item.kind), factor);
      setScore((s) => s + gained);
      playCorrectSound();
    } else {
      playWrongSound();
    }
    if (duelActive) pushDuelState(score + gained, rIndex);
    if (roomActive) pushRoomState(score + gained, rIndex);
  }

  function requestRandomHint() {
    if (!currentRandomItem || randomAnswered) return;
    const max = currentRandomItem.kind === "lineup" ? MAX_HINTS : MAX_CLUBS_HINTS;
    if (randomHintsUsed >= max) return;
    setRandomHintsUsed((h) => h + 1);
  }

  function nextRandomQuestion() {
    if (rIndex + 1 >= randomQueue.length) {
      if (duelActive) {
        setScreen("duelWaiting");
        finishDuel();
      } else if (roomActive) {
        setScreen("roomWaiting");
        finishRoomPlayer();
      } else {
        setScreen("roundEnd");
      }
      return;
    }
    const nextItem = randomQueue[rIndex + 1];
    setRIndex((i) => i + 1);
    setRandomPicked(null);
    setRandomGuess("");
    setRandomAnswered(false);
    setRandomCorrect(false);
    setRandomTimeLeft(timeForKind(nextItem.kind));
    setRandomHintsUsed(0);
    if (duelActive) pushDuelState(score, rIndex + 1);
    if (roomActive) pushRoomState(score, rIndex + 1);
  }

  function startDuel(match) {
    const slot = match.player1_id === authUser.id ? "player1" : "player2";
    setMyPlayerSlot(slot);
    setPendingDuelMatch(match);
    setDuelCountdown(3);
    setScreen("duelCountdown");
  }

  function beginDuelMatch(match) {
    setMode("random");
    setRandomQueue(match.questions);
    setRIndex(0);
    setScore(0);
    setRandomPicked(null);
    setRandomGuess("");
    setRandomAnswered(false);
    setRandomCorrect(false);
    setRandomTimeLeft(timeForKind(match.questions[0].kind));
    setRandomHintsUsed(0);
    setDuelActive(true);
    setScreen("random");
  }

  async function pushDuelState(scoreVal, indexVal, extra = {}) {
    if (!currentMatch || !myPlayerSlot) return;
    const scoreCol = myPlayerSlot === "player1" ? "player1_score" : "player2_score";
    const indexCol = myPlayerSlot === "player1" ? "player1_index" : "player2_index";
    await supabase
      .from("matches")
      .update({ [scoreCol]: scoreVal, [indexCol]: indexVal, ...extra })
      .eq("id", currentMatch.id);
  }

  async function finishDuel() {
    await pushDuelState(score, randomQueue.length);
    const { data: freshMatch } = await supabase
      .from("matches")
      .select("*")
      .eq("id", currentMatch.id)
      .maybeSingle();
    if (freshMatch) {
      setCurrentMatch(freshMatch);
      maybeFinishMatch(freshMatch);
    }
  }

  async function maybeFinishMatch(match) {
    if (!match || match.status === "finished") return;
    const total = match.questions?.length ?? 0;
    if (total > 0 && match.player1_index >= total && match.player2_index >= total) {
      const winner =
        match.player1_score === match.player2_score
          ? null
          : match.player1_score > match.player2_score
          ? match.player1_id
          : match.player2_id;
      await supabase
        .from("matches")
        .update({ status: "finished", winner_id: winner })
        .eq("id", match.id)
        .eq("status", "active");
    }
  }

  async function leaveDuel() {
    if (currentMatch && currentMatch.status !== "finished" && myPlayerSlot) {
      const opponentId =
        myPlayerSlot === "player1" ? currentMatch.player2_id : currentMatch.player1_id;
      await supabase
        .from("matches")
        .update({ status: "finished", winner_id: opponentId })
        .eq("id", currentMatch.id)
        .eq("status", "active");
    }
    setDuelActive(false);
    setMyPlayerSlot(null);
    setCurrentMatch(null);
    setOpponentProfile(null);
    setPendingDuelMatch(null);
    setDuelCountdown(3);
    setScreen("multiplayer");
  }

  function beginRoomMatch(qs) {
    setMode("random");
    setRandomQueue(qs);
    setRIndex(0);
    setScore(0);
    setRandomPicked(null);
    setRandomGuess("");
    setRandomAnswered(false);
    setRandomCorrect(false);
    setRandomTimeLeft(timeForKind(qs[0].kind));
    setRandomHintsUsed(0);
    setRoomActive(true);
    setScreen("random");
  }

  async function pushRoomState(scoreVal, indexVal) {
    if (!room || !authUser) return;
    await supabase
      .from("room_players")
      .update({ score: scoreVal, q_index: indexVal })
      .eq("room_id", room.id)
      .eq("user_id", authUser.id);
  }

  async function finishRoomPlayer() {
    await pushRoomState(score, randomQueue.length);
    const [{ data: freshRoom }, { data: players }] = await Promise.all([
      supabase.from("rooms").select("*").eq("id", room.id).maybeSingle(),
      supabase.from("room_players").select("*").eq("room_id", room.id),
    ]);
    if (freshRoom && players) {
      setRoom(freshRoom);
      setRoomPlayers(players);
      maybeFinishRoom(freshRoom, players);
    }
  }

  async function maybeFinishRoom(roomRow, players) {
    if (!roomRow || roomRow.status === "finished") return;
    const total = roomRow.questions?.length ?? 0;
    if (total === 0 || players.length === 0) return;
    const allDone = players.every((p) => p.q_index >= total);
    if (allDone) {
      await supabase
        .from("rooms")
        .update({ status: "finished" })
        .eq("id", roomRow.id)
        .eq("status", "active");
    }
  }

  function changeLang(code) {
    setLang(code);
    setScreen("start");
  }

  function goToMenuFromGame() {
    if (duelActive) {
      leaveDuel();
      return;
    }
    if (roomActive) {
      leaveRoom();
      return;
    }
    if (lang !== "pt") {
      setScreen("singlePlayer");
      return;
    }
    setScreen(mode.startsWith("brazil") ? "brazilModes" : "worldModes");
  }

  function playAgain() {
    if (mode === "clues") startClues(QUESTION_POOL);
    else if (mode === "brazil") startClues(BRAZIL_QUESTION_POOL);
    else if (mode === "brazilLineup") startLineup(BRAZIL_LINEUP_POOL);
    else if (mode === "clubs") startClubsMode(CLUBS_QUESTION_POOL);
    else if (mode === "brazilClubs") startClubsMode(CLUBS_QUESTION_POOL_BRAZIL);
    else if (mode === "year") startYearMode(YEAR_QUESTION_POOL);
    else if (mode === "brazilYear") startYearMode(BRAZIL_YEAR_QUESTION_POOL);
    else if (mode === "random") startRandomMode(false);
    else if (mode === "brazilRandom") startRandomMode(true);
    else startLineup(LINEUP_POOL);
  }

  return (
    <div
      style={
        [
          "start",
          "clues",
          "lineup",
          "clubs",
          "year",
          "random",
          "worldModes",
          "brazilModes",
          "settings",
          "roundEnd",
          "multiplayer",
          "singlePlayer",
          "duelWaiting",
          "duelEnd",
          "duelCountdown",
          "roomLobby",
          "roomCountdown",
          "roomWaiting",
          "roomEnd",
          "roomRestartPrompt",
          "roomCreateModes",
          "roomRestartModes",
          "roomChangeMode",
        ].includes(screen)
          ? styles.pageLight
          : styles.page
      }
    >
      <style>{fontImport}</style>
      {![
        "start",
        "clues",
        "lineup",
        "clubs",
        "year",
        "random",
        "worldModes",
        "brazilModes",
        "settings",
        "roundEnd",
        "multiplayer",
        "singlePlayer",
        "roomLobby",
        "roomCountdown",
        "roomWaiting",
        "roomEnd",
        "roomRestartPrompt",
        "roomCreateModes",
        "roomRestartModes",
        "roomChangeMode",
      ].includes(screen) && <div style={styles.turfOverlay} />}

      {screen === "start" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={() => setScreen("settings")}
              aria-label={t.settingsTab}
            >
              <GearIcon />
            </button>
            <div style={styles.lightLangRow}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  style={{
                    ...styles.lightLangPill,
                    ...(lang === l.code ? styles.lightLangPillActive : {}),
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>{t.eyebrow}</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1 style={styles.lightTitle}>
            {t.title.split(" ")[0]}
            <br />
            <span style={styles.lightTitleAccent}>
              {t.title.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p style={styles.lightSubtitle}>{t.chooseMode}</p>
          <div style={styles.lightSubtitleRule} />

          <div className="gtpModeGrid">
            <LightCard
              icon={<SoloIcon accent={MODE_ACCENTS.singlePlayer.dark} />}
              accent={MODE_ACCENTS.singlePlayer}
              title={t.singlePlayerTitle}
              desc={t.singlePlayerDesc}
              cta={t.singlePlayerCta}
              onClick={() => setScreen("singlePlayer")}
            />
            <LightCard
              icon={<VersusIcon accent={MODE_ACCENTS.multiplayer.dark} />}
              accent={MODE_ACCENTS.multiplayer}
              title={t.multiplayerTitle}
              desc={t.multiplayerDesc}
              cta={t.multiplayerCta}
              onClick={() => setScreen("multiplayer")}
            />
          </div>
        </div>
      )}

      {screen === "singlePlayer" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={() => setScreen("start")}
              aria-label={t.menu}
            >
              <span style={{ fontSize: 22, color: "#101820" }}>‹</span>
            </button>
            <div style={styles.lightLangRow}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  style={{
                    ...styles.lightLangPill,
                    ...(lang === l.code ? styles.lightLangPillActive : {}),
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>{t.singlePlayerEyebrow}</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1 style={styles.lightTitle}>{t.singlePlayerHeading}</h1>
          <p style={styles.lightSubtitle}>{t.chooseMode}</p>
          <div style={styles.lightSubtitleRule} />

          <div className="gtpModeGrid">
            {lang === "pt" ? (
              <>
                <LightCard
                  icon={<GlobeIcon accent={MODE_ACCENTS.mundo.dark} />}
                  accent={MODE_ACCENTS.mundo}
                  title="🌍 Mundo"
                  desc="Craques e clubes do futebol mundial."
                  cta="ENTRAR"
                  onClick={() => setScreen("worldModes")}
                />
                <LightCard
                  icon={<FlagIcon />}
                  accent={MODE_ACCENTS.brasil}
                  title="🇧🇷 Brasil"
                  desc="Ídolos e clubes do futebol brasileiro."
                  cta="ENTRAR"
                  onClick={() => setScreen("brazilModes")}
                />
              </>
            ) : (
              <>
                <LightCard
                  icon={<PersonQuestionIcon accent={MODE_ACCENTS.clues.dark} />}
                  accent={MODE_ACCENTS.clues}
                  title={t.cluesModeTitle}
                  desc={t.cluesModeDesc}
                  cta={t.playClues}
                  onClick={() => startClues(QUESTION_POOL)}
                />
                <LightCard
                  icon={<XIIcon accent={MODE_ACCENTS.lineup.dark} />}
                  accent={MODE_ACCENTS.lineup}
                  title={t.lineupModeTitle}
                  desc={t.lineupModeDesc}
                  cta={t.playLineup}
                  onClick={() => startLineup(LINEUP_POOL)}
                />
                <LightCard
                  icon={<ShirtIcon accent={MODE_ACCENTS.clubs.dark} />}
                  accent={MODE_ACCENTS.clubs}
                  title={t.clubsModeTitle}
                  desc={t.clubsModeDesc}
                  cta={t.playClubsMode}
                  onClick={() => startClubsMode(CLUBS_QUESTION_POOL)}
                />
                <LightCard
                  icon={<CalendarIcon accent={MODE_ACCENTS.year.dark} />}
                  accent={MODE_ACCENTS.year}
                  title={t.yearModeTitle}
                  desc={t.yearModeDesc}
                  cta={t.playYearMode}
                  onClick={() => startYearMode(YEAR_QUESTION_POOL)}
                />
                <LightCard
                  icon={<DiceIcon accent={MODE_ACCENTS.random.dark} />}
                  accent={MODE_ACCENTS.random}
                  title={t.randomModeTitle}
                  desc={t.randomModeDesc}
                  cta={t.playRandomMode}
                  onClick={() => startRandomMode(false)}
                />
              </>
            )}
          </div>
        </div>
      )}



      {screen === "worldModes" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={() => setScreen("singlePlayer")}
              aria-label={t.menu}
            >
              <span style={{ fontSize: 22, color: "#101820" }}>‹</span>
            </button>
            <div style={styles.lightLangRow}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  style={{
                    ...styles.lightLangPill,
                    ...(lang === l.code ? styles.lightLangPillActive : {}),
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>🌍 MUNDO</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1 style={styles.lightTitle}>
            MODOS
            <br />
            <span style={styles.lightTitleAccent}>MUNDIAIS</span>
          </h1>
          <p style={styles.lightSubtitle}>Craques e clubes do futebol mundial.</p>
          <div style={styles.lightSubtitleRule} />


          <div className="gtpModeGrid">
            <LightCard
              icon={<PersonQuestionIcon accent={MODE_ACCENTS.clues.dark} />}
              accent={MODE_ACCENTS.clues}
              title={t.cluesModeTitle}
              desc={t.cluesModeDesc}
              cta={t.playClues}
              onClick={() => startClues(QUESTION_POOL)}
            />
            <LightCard
              icon={<XIIcon accent={MODE_ACCENTS.lineup.dark} />}
              accent={MODE_ACCENTS.lineup}
              title={t.lineupModeTitle}
              desc={t.lineupModeDesc}
              cta={t.playLineup}
              onClick={() => startLineup(LINEUP_POOL)}
            />
            <LightCard
              icon={<ShirtIcon accent={MODE_ACCENTS.clubs.dark} />}
              accent={MODE_ACCENTS.clubs}
              title={t.clubsModeTitle}
              desc={t.clubsModeDesc}
              cta={t.playClubsMode}
              onClick={() => startClubsMode(CLUBS_QUESTION_POOL)}
            />
            <LightCard
              icon={<CalendarIcon accent={MODE_ACCENTS.year.dark} />}
              accent={MODE_ACCENTS.year}
              title={t.yearModeTitle}
              desc={t.yearModeDesc}
              cta={t.playYearMode}
              onClick={() => startYearMode(YEAR_QUESTION_POOL)}
            />
            <LightCard
              icon={<DiceIcon accent={MODE_ACCENTS.random.dark} />}
              accent={MODE_ACCENTS.random}
              title={t.randomModeTitle}
              desc={t.randomModeDesc}
              cta={t.playRandomMode}
              onClick={() => startRandomMode(false)}
            />
          </div>

          <button style={styles.menuBtn} onClick={() => setScreen("singlePlayer")}>
            {t.menu}
          </button>
        </div>
      )}

      {screen === "brazilModes" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={() => setScreen("singlePlayer")}
              aria-label={t.menu}
            >
              <span style={{ fontSize: 22, color: "#101820" }}>‹</span>
            </button>
            <div style={styles.lightLangRow}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  style={{
                    ...styles.lightLangPill,
                    ...(lang === l.code ? styles.lightLangPillActive : {}),
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>🇧🇷 BRASIL</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1 style={styles.lightTitle}>
            MODOS
            <br />
            <span style={styles.lightTitleAccent}>BRASIL</span>
          </h1>
          <p style={styles.lightSubtitle}>Craques e clubes do futebol brasileiro.</p>
          <div style={styles.lightSubtitleRule} />


          <div className="gtpModeGrid">
            <LightCard
              icon={<PersonQuestionIcon accent={MODE_ACCENTS.clues.dark} />}
              accent={MODE_ACCENTS.clues}
              title="Modo Pistas"
              desc="Leia três pistas e adivinhe o craque brasileiro."
              cta="JOGAR MODO PISTAS"
              onClick={() => startClues(BRAZIL_QUESTION_POOL)}
            />
            <LightCard
              icon={<XIIcon accent={MODE_ACCENTS.lineup.dark} />}
              accent={MODE_ACCENTS.lineup}
              title="Modo Escalação"
              desc="Falta um jogador na escalação. Digite o nome. Até 3 dicas."
              cta="JOGAR MODO ESCALAÇÃO"
              onClick={() => startLineup(BRAZIL_LINEUP_POOL)}
            />
            <LightCard
              icon={<CalendarIcon accent={MODE_ACCENTS.year.dark} />}
              accent={MODE_ACCENTS.year}
              title="Modo Ano"
              desc="Adivinhe o ano de um fato marcante do futebol brasileiro."
              cta="JOGAR MODO ANO"
              onClick={() => startYearMode(BRAZIL_YEAR_QUESTION_POOL)}
            />
            <LightCard
              icon={<ShirtIcon accent={MODE_ACCENTS.clubs.dark} />}
              accent={MODE_ACCENTS.clubs}
              title="Modo Clubes"
              desc="Adivinhe o craque pelos clubes da carreira dele. Até 5 dicas."
              cta="JOGAR MODO CLUBES"
              onClick={() => startClubsMode(CLUBS_QUESTION_POOL_BRAZIL)}
            />
            <LightCard
              icon={<DiceIcon accent={MODE_ACCENTS.random.dark} />}
              accent={MODE_ACCENTS.random}
              title={t.randomModeTitle}
              desc={t.randomModeDesc}
              cta={t.playRandomMode}
              onClick={() => startRandomMode(true)}
            />
          </div>

          <button style={styles.menuBtn} onClick={() => setScreen("singlePlayer")}>
            {t.menu}
          </button>
        </div>
      )}

      {screen === "multiplayer" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={{ ...styles.lightTopRow, justifyContent: "flex-start" }}>
            <button
              style={{ ...styles.lightIconBtn, fontSize: 22, color: "#101820" }}
              onClick={() => setScreen("start")}
              aria-label={t.menu}
            >
              ‹
            </button>
          </div>

          <div style={styles.comingSoonWrap}>
            <div
              style={{
                ...styles.lightCardIconBadge,
                width: 148,
                height: 148,
                background: MODE_ACCENTS.multiplayer.solid,
                boxShadow: `inset 0 -8px 0 ${MODE_ACCENTS.multiplayer.dark}`,
              }}
            >
              <VersusIcon accent={MODE_ACCENTS.multiplayer.dark} />
            </div>
            <span style={styles.comingSoonBadge}>{t.multiplayerCta}</span>
            <h1 style={{ ...styles.lightTitle, fontSize: "clamp(28px, 8vw, 44px)" }}>
              {t.multiplayerComingTitle}
            </h1>
            <p style={{ ...styles.lightSubtitle, maxWidth: 340 }}>
              {t.multiplayerComingDesc}
            </p>

            {authLoading || (authUser && profileLoading) ? null : authUser && !profile ? (
              <form style={styles.authForm} onSubmit={handleSaveNickname}>
                <span style={styles.authMessage}>{t.nicknameLabel}</span>
                <input
                  type="text"
                  required
                  maxLength={20}
                  placeholder={t.nicknamePlaceholder}
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  style={styles.authInput}
                />
                {profileError && <div style={styles.authError}>{profileError}</div>}
                <button
                  type="submit"
                  disabled={profileBusy}
                  style={{
                    ...styles.authSubmitBtn,
                    opacity: profileBusy ? 0.6 : 1,
                    cursor: profileBusy ? "not-allowed" : "pointer",
                  }}
                >
                  {t.nicknameSaveBtn}
                </button>
              </form>
            ) : authUser && profile ? (
              <div style={styles.authLoggedInCard}>
                <span style={styles.authMessage}>{t.authLoggedInAs}</span>
                {editingNickname ? (
                  <form
                    style={{ ...styles.authForm, marginTop: 4 }}
                    onSubmit={handleSaveNickname}
                  >
                    <input
                      type="text"
                      required
                      maxLength={20}
                      value={nicknameInput}
                      onChange={(e) => setNicknameInput(e.target.value)}
                      style={styles.authInput}
                      autoFocus
                    />
                    {profileError && <div style={styles.authError}>{profileError}</div>}
                    <div style={{ display: "flex", gap: 8, width: "100%" }}>
                      <button
                        type="submit"
                        disabled={profileBusy}
                        style={{
                          ...styles.authSubmitBtn,
                          marginTop: 0,
                          flex: 1,
                          opacity: profileBusy ? 0.6 : 1,
                        }}
                      >
                        {t.nicknameSaveBtn}
                      </button>
                      <button
                        type="button"
                        style={{
                          ...styles.authSubmitBtn,
                          marginTop: 0,
                          flex: 1,
                          background: "#AAB4BE",
                        }}
                        onClick={() => {
                          setEditingNickname(false);
                          setProfileError("");
                        }}
                      >
                        {t.cancelSearchBtn}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <strong>{profile.nickname}</strong>
                    <button
                      type="button"
                      style={styles.authToggleLink}
                      onClick={() => {
                        setNicknameInput(profile.nickname);
                        setEditingNickname(true);
                      }}
                    >
                      {t.changeNicknameBtn}
                    </button>
                  </>
                )}

                {currentMatch ? (
                  <>
                    <p style={{ ...styles.authMessage, marginTop: 4 }}>
                      {t.matchFoundText} {opponentProfile?.nickname ?? "..."}
                    </p>
                  </>
                ) : searching ? (
                  <>
                    <p style={{ ...styles.authMessage, marginTop: 4 }}>
                      {t.searchingText}
                    </p>
                    <button
                      style={{ ...styles.authSubmitBtn, marginTop: 8, background: "#AAB4BE" }}
                      onClick={cancelSearch}
                    >
                      {t.cancelSearchBtn}
                    </button>
                  </>
                ) : (
                  <>
                    {matchmakingError && (
                      <div style={styles.authError}>{matchmakingError}</div>
                    )}
                    <button
                      style={{ ...styles.authSubmitBtn, marginTop: 4 }}
                      onClick={findRandomMatch}
                    >
                      {t.findMatchBtn}
                    </button>

                    <div style={styles.authDivider}>
                      <span style={styles.authDividerLine} />
                      {t.roomOrLabel}
                      <span style={styles.authDividerLine} />
                    </div>

                    {!showJoinRoom && (
                      <div style={{ display: "flex", gap: 8, width: "100%" }}>
                        <button
                          style={{
                            ...styles.authSubmitBtn,
                            marginTop: 0,
                            flex: 1,
                            background: MODE_ACCENTS.multiplayer.dark,
                          }}
                          onClick={() => {
                            setRoomModeRegion(null);
                            setScreen("roomCreateModes");
                          }}
                        >
                          {t.createRoomBtn}
                        </button>
                        <button
                          style={{
                            ...styles.authSubmitBtn,
                            marginTop: 0,
                            flex: 1,
                            background: "transparent",
                            color: MODE_ACCENTS.multiplayer.dark,
                            boxShadow: "none",
                            border: `2px solid ${MODE_ACCENTS.multiplayer.dark}`,
                          }}
                          onClick={() => setShowJoinRoom(true)}
                        >
                          {t.joinRoomBtn}
                        </button>
                      </div>
                    )}

                    {showJoinRoom && (
                      <form style={styles.authForm} onSubmit={handleJoinRoom}>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          inputMode="numeric"
                          placeholder={t.roomCodePlaceholder}
                          value={roomCodeInput}
                          onChange={(e) => setRoomCodeInput(e.target.value.replace(/\D/g, ""))}
                          style={styles.authInput}
                        />
                        {roomError && <div style={styles.authError}>{roomError}</div>}
                        <button
                          type="submit"
                          disabled={roomBusy}
                          style={{
                            ...styles.authSubmitBtn,
                            opacity: roomBusy ? 0.6 : 1,
                            cursor: roomBusy ? "not-allowed" : "pointer",
                          }}
                        >
                          {t.joinRoomSubmitBtn}
                        </button>
                        <button
                          type="button"
                          style={styles.authToggleLink}
                          onClick={() => {
                            setShowJoinRoom(false);
                            setRoomError("");
                            setRoomCodeInput("");
                          }}
                        >
                          {t.cancelSearchBtn}
                        </button>
                      </form>
                    )}
                  </>
                )}

                <button
                  style={{ ...styles.authToggleLink, marginTop: 4 }}
                  onClick={handleLogout}
                >
                  {t.authLogoutBtn}
                </button>
              </div>
            ) : (
              <>
                <div style={{ ...styles.lightEyebrowRow, marginTop: 8 }}>
                  <span style={styles.lightEyebrowLine} />
                  <span style={styles.lightEyebrow}>
                    {authMode === "signup" ? t.authSignupHeading : t.authLoginHeading}
                  </span>
                  <span style={styles.lightEyebrowLine} />
                </div>
                <p style={{ ...styles.lightSubtitle, marginTop: 0, maxWidth: 320 }}>
                  {authMode === "signup" ? t.authSignupHeadingDesc : t.authLoginHeadingDesc}
                </p>
                <form style={styles.authForm} onSubmit={handleAuthSubmit}>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t.authEmailLabel}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  style={styles.authInput}
                />
                <div style={styles.passwordFieldWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                    placeholder={t.authPasswordLabel}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ ...styles.authInput, paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    style={styles.passwordToggleBtn}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t.hidePasswordLabel : t.showPasswordLabel}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {authError && <div style={styles.authError}>{authError}</div>}
                {authMessage && <div style={styles.authMessage}>{authMessage}</div>}
                <button
                  type="submit"
                  disabled={authBusy}
                  style={{
                    ...styles.authSubmitBtn,
                    opacity: authBusy ? 0.6 : 1,
                    cursor: authBusy ? "not-allowed" : "pointer",
                  }}
                >
                  {authMode === "signup" ? t.authSignupBtn : t.authLoginBtn}
                </button>
                <button
                  type="button"
                  style={styles.authToggleLink}
                  onClick={() => {
                    setAuthMode((m) => (m === "signup" ? "login" : "signup"));
                    setAuthError("");
                    setAuthMessage("");
                  }}
                >
                  {authMode === "signup" ? t.authToggleToLogin : t.authToggleToSignup}
                </button>

                <div style={styles.authDivider}>
                  <span style={styles.authDividerLine} />
                  {t.authOr}
                  <span style={styles.authDividerLine} />
                </div>

                <button
                  type="button"
                  style={styles.authGoogleBtn}
                  onClick={handleGoogleLogin}
                >
                  {t.authGoogleBtn}
                </button>
                </form>
              </>
            )}
          </div>

          <button style={styles.menuBtn} onClick={() => setScreen("start")}>
            {t.menu}
          </button>
        </div>
      )}

      {screen === "settings" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={() => setScreen("start")}
              aria-label={t.menu}
            >
              <span style={{ fontSize: 22, color: "#101820" }}>‹</span>
            </button>
            <div style={{ width: 42 }} />
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>{t.settingsTab}</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1 style={styles.lightTitle}>{t.settingsTitle}</h1>
          <p style={styles.lightSubtitle}>{t.settingsDesc}</p>
          <div style={styles.lightSubtitleRule} />

          <div style={{ ...styles.modeCard, textAlign: "left" }}>
            <div style={styles.modeTitle}>{t.soundLabel}</div>
            <p style={styles.modeDesc}>{t.soundDesc}</p>
            <div style={styles.langRow}>
              <button
                style={{
                  ...styles.langBtn,
                  ...(soundEnabled ? styles.langBtnActive : {}),
                  flex: 1,
                }}
                onClick={() => setSoundEnabled(true)}
              >
                🔊 {t.soundOn}
              </button>
              <button
                style={{
                  ...styles.langBtn,
                  ...(!soundEnabled ? styles.langBtnActive : {}),
                  flex: 1,
                }}
                onClick={() => setSoundEnabled(false)}
              >
                🔇 {t.soundOff}
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === "clues" && currentQuestion && (
        <div style={styles.gameWrap}>
          <button style={styles.menuBtn} onClick={goToMenuFromGame}>
            {t.menu}
          </button>
          <div style={styles.scoreboard}>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.score}</div>
              <div style={styles.scoreboardValue}>{score}/100</div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.question}</div>
              <div style={styles.scoreboardValue}>
                {qIndex + 1}/{questions.length}
              </div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.time}</div>
              <div
                style={{
                  ...styles.scoreboardValue,
                  color: cluesTimeLeft <= 5 ? "#D9432E" : "#0B6F27",
                }}
              >
                {cluesTimeLeft}
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, ...(flipped ? styles.cardFlipped : {}) }}>
            <div style={styles.cardLabel}>{t.cluesLabel}</div>
            <div style={styles.cluesList}>
              {(currentQuestion.clues[lang] || currentQuestion.clues.pt).map((c, i) => (
                <div key={i} style={styles.clueRow}>
                  <span style={styles.clueNumber}>{i + 1}</span>
                  <span style={styles.clueText}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.optionsGrid}>
            {currentQuestion.options.map((opt) => {
              const isCorrect = opt === currentQuestion.answer;
              const isPicked = opt === picked;
              const isSelected = opt === selected;
              let bg = "#FFFFFF";
              let border = "rgba(11,111,39,0.18)";
              if (answered) {
                if (isCorrect) {
                  bg = "#E7F7EA";
                  border = "#0B6F27";
                } else if (isSelected) {
                  bg = "#FDEAEA";
                  border = "#D9432E";
                }
              } else if (isPicked) {
                bg = "#EAF7EC";
                border = "#159533";
              }
              return (
                <button
                  key={opt}
                  onClick={() => !answered && setPicked(opt)}
                  disabled={answered}
                  className={answered && isCorrect ? "correctPulse" : ""}
                  style={{
                    ...styles.optionBtn,
                    background: bg,
                    borderColor: border,
                    borderWidth: isPicked && !answered ? 2 : 1,
                    cursor: answered ? "default" : "pointer",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {!answered && (
            <button
              style={{
                ...styles.primaryBtn,
                opacity: picked ? 1 : 0.4,
                cursor: picked ? "pointer" : "not-allowed",
              }}
              onClick={() => picked && handleClueAnswer(picked)}
              disabled={!picked}
            >
              {t.submitAnswer}
            </button>
          )}

          {!answered && (
            <button style={styles.skipBtn} onClick={() => handleClueAnswer(null)}>
              {t.skipBtn}
            </button>
          )}

          {answered && (
            <div className="fadeInUp" style={styles.feedbackText}>
              {selected === currentQuestion.answer
                ? t.correct
                : `${t.answerLabel} ${currentQuestion.answer}`}
            </div>
          )}
        </div>
      )}

      {screen === "lineup" && currentLineup && (
        <div style={styles.gameWrap}>
          <button style={styles.menuBtn} onClick={goToMenuFromGame}>
            {t.menu}
          </button>
          <div style={styles.scoreboard}>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.score}</div>
              <div style={styles.scoreboardValue}>{score}/100</div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.lineupLabel}</div>
              <div style={styles.scoreboardValue}>
                {lIndex + 1}/{lineups.length}
              </div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.time}</div>
              <div
                style={{
                  ...styles.scoreboardValue,
                  color: lTimeLeft <= 8 ? "#D9432E" : "#0B6F27",
                }}
              >
                {lTimeLeft}
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, padding: "18px" }}>
            <div style={{ ...styles.cardLabel, marginBottom: 4 }}>
              {currentLineup.team.toUpperCase()} — {currentLineup.year}
            </div>
            <div style={styles.matchLabelText}>
              {typeof currentLineup.matchLabel === "string"
                ? currentLineup.matchLabel
                : currentLineup.matchLabel[lang]}
            </div>
            <div style={styles.pitch}>
              <div style={styles.pitchCenterCircle} />
              <div style={styles.pitchHalfwayLine} />
              <div style={styles.pitchCenterSpot} />
              {["FW", "AM", "MF", "DM", "DF", "GK"]
                .filter((posKey) =>
                  currentLineup.players.some((p) => p.position === posKey)
                )
                .map((posKey) => (
                <div key={posKey} style={styles.pitchRow}>
                  {currentLineup.players
                    .map((p, i) => ({ ...p, i }))
                    .filter((p) => p.position === posKey)
                    .map((p) => {
                      const isHidden = p.i === currentLineup.hiddenIndex;
                      const showAsWrong = isHidden && lAnswered && !lCorrect;
                      const showAsRight = isHidden && lAnswered && lCorrect;
                      const lastName = p.shortName || p.name.split(" ").slice(-1)[0];
                      const kit = getTeamKit(currentLineup.team);
                      return (
                        <div key={p.i} style={styles.chipWrap}>
                          <div
                            className={showAsRight ? "correctPulse" : ""}
                            style={{
                              ...styles.chip,
                              background: kit.bg,
                              color: kit.text,
                              ...(isHidden ? styles.chipHidden : {}),
                              ...(showAsRight ? styles.chipCorrect : {}),
                              ...(showAsWrong ? styles.chipWrong : {}),
                            }}
                          >
                            {isHidden && !lAnswered ? "?" : p.number}
                          </div>
                          <div style={styles.chipLabel}>
                            {isHidden && !lAnswered ? "???" : lastName}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          {!lAnswered && hintsUsed > 0 && (
            <div style={styles.card}>
              <div style={styles.cardLabel}>{t.hintsLabel}</div>
              <div style={styles.cluesList}>
                {hintsUsed >= 1 && (
                  <div style={styles.clueRow}>
                    <span style={styles.clueNumber}>1</span>
                    <span style={styles.clueText}>
                      {t.nationality} {translateNationality(hiddenPlayerObj.nationality, lang)}
                    </span>
                  </div>
                )}
                {hintsUsed >= 2 && (
                  <div style={styles.clueRow}>
                    <span style={styles.clueNumber}>2</span>
                    <span style={styles.clueText}>
                      {t.clubs} {otherClubsHint(hiddenPlayerObj.clubs, currentLineup.team)}
                    </span>
                  </div>
                )}
                {hintsUsed >= 3 && (
                  <div style={styles.clueRow}>
                    <span style={styles.clueNumber}>3</span>
                    <span style={styles.clueText}>
                      {typeof hiddenPlayerObj.funFact === "string"
                        ? hiddenPlayerObj.funFact
                        : hiddenPlayerObj.funFact[lang]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!lAnswered && (
            <>
              <div style={styles.guessRow}>
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitLineupGuess();
                  }}
                  placeholder={t.guessPlaceholder}
                  style={styles.guessInput}
                  autoFocus
                />
                <button
                  style={{
                    ...styles.primaryBtn,
                    marginTop: 0,
                    width: "auto",
                    opacity: guess.trim() ? 1 : 0.4,
                    cursor: guess.trim() ? "pointer" : "not-allowed",
                  }}
                  onClick={submitLineupGuess}
                  disabled={!guess.trim()}
                >
                  {t.submit}
                </button>
              </div>

              <button
                style={{
                  ...styles.hintBtn,
                  opacity: hintsUsed >= MAX_HINTS ? 0.4 : 1,
                  cursor: hintsUsed >= MAX_HINTS ? "not-allowed" : "pointer",
                }}
                onClick={requestHint}
                disabled={hintsUsed >= MAX_HINTS}
              >
                {hintsUsed >= MAX_HINTS
                  ? t.noMoreHints
                  : t.getHint
                      .replace("{used}", hintsUsed)
                      .replace("{max}", MAX_HINTS)}
              </button>

              <button style={styles.skipBtn} onClick={submitLineupGuess}>
                {t.skipBtn}
              </button>
            </>
          )}

          {lAnswered && (
            <div className="fadeInUp" style={styles.feedbackText}>
              {lCorrect
                ? t.correct
                : `${t.missingPlayer} ${currentLineup.players[currentLineup.hiddenIndex].name}`}
            </div>
          )}
        </div>
      )}

      {screen === "clubs" && currentClubsQuestion && (
        <div style={styles.gameWrap}>
          <button style={styles.menuBtn} onClick={goToMenuFromGame}>
            {t.menu}
          </button>
          <div style={styles.scoreboard}>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.score}</div>
              <div style={styles.scoreboardValue}>{score}/100</div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.question}</div>
              <div style={styles.scoreboardValue}>
                {cqIndex + 1}/{clubsQuestions.length}
              </div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.time}</div>
              <div
                style={{
                  ...styles.scoreboardValue,
                  color: clubsTimeLeft <= 8 ? "#D9432E" : "#0B6F27",
                }}
              >
                {clubsTimeLeft}
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>{t.clubsLabel}</div>
            <div style={styles.cluesList}>
              {currentClubsQuestion.clubs.map((c, i) => (
                <div key={i} style={styles.clueRow}>
                  <span style={styles.clueNumber}>{i + 1}</span>
                  <span style={styles.clueText}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {!clubsAnswered && clubsHintsUsed > 0 && (
            <div style={styles.card}>
              <div style={styles.cardLabel}>{t.hintsLabel}</div>
              <div style={styles.cluesList}>
                {(Array.isArray(currentClubsQuestion.hints)
                  ? currentClubsQuestion.hints
                  : currentClubsQuestion.hints[lang]
                )
                  .slice(0, clubsHintsUsed)
                  .map((hintText, i) => (
                    <div key={i} style={styles.clueRow}>
                      <span style={styles.clueNumber}>{i + 1}</span>
                      <span style={styles.clueText}>{hintText}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {!clubsAnswered && (
            <>
              <div style={styles.guessRow}>
                <input
                  type="text"
                  value={clubsGuess}
                  onChange={(e) => setClubsGuess(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitClubsGuess();
                  }}
                  placeholder={t.clubsGuessPlaceholder}
                  style={styles.guessInput}
                  autoFocus
                />
                <button
                  style={{
                    ...styles.primaryBtn,
                    marginTop: 0,
                    width: "auto",
                    opacity: clubsGuess.trim() ? 1 : 0.4,
                    cursor: clubsGuess.trim() ? "pointer" : "not-allowed",
                  }}
                  onClick={submitClubsGuess}
                  disabled={!clubsGuess.trim()}
                >
                  {t.submit}
                </button>
              </div>

              <button
                style={{
                  ...styles.hintBtn,
                  opacity: clubsHintsUsed >= MAX_CLUBS_HINTS ? 0.4 : 1,
                  cursor: clubsHintsUsed >= MAX_CLUBS_HINTS ? "not-allowed" : "pointer",
                }}
                onClick={requestClubsHint}
                disabled={clubsHintsUsed >= MAX_CLUBS_HINTS}
              >
                {clubsHintsUsed >= MAX_CLUBS_HINTS
                  ? t.noMoreHints
                  : t.getHint
                      .replace("{used}", clubsHintsUsed)
                      .replace("{max}", MAX_CLUBS_HINTS)}
              </button>

              <button style={styles.skipBtn} onClick={submitClubsGuess}>
                {t.skipBtn}
              </button>
            </>
          )}

          {clubsAnswered && (
            <div className="fadeInUp" style={styles.feedbackText}>
              {clubsCorrect ? t.correct : `${t.answerLabel} ${currentClubsQuestion.name}`}
            </div>
          )}
        </div>
      )}

      {screen === "year" && currentYearQuestion && (
        <div style={styles.gameWrap}>
          <button style={styles.menuBtn} onClick={goToMenuFromGame}>
            {t.menu}
          </button>
          <div style={styles.scoreboard}>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.score}</div>
              <div style={styles.scoreboardValue}>{score}/100</div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.question}</div>
              <div style={styles.scoreboardValue}>
                {yqIndex + 1}/{yearQuestions.length}
              </div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.time}</div>
              <div
                style={{
                  ...styles.scoreboardValue,
                  color: yearTimeLeft <= 5 ? "#D9432E" : "#0B6F27",
                }}
              >
                {yearTimeLeft}
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>{t.yearLabel}</div>
            <p style={styles.clueText}>
              {typeof currentYearQuestion.fact === "string"
                ? currentYearQuestion.fact
                : currentYearQuestion.fact[lang]}
            </p>
          </div>

          <div style={styles.optionsGrid}>
            {currentYearQuestion.options.map((opt) => {
              const isCorrect = opt === currentYearQuestion.answer;
              const isPicked = opt === yearPicked;
              const isSelected = opt === yearSelected;
              let bg = "#FFFFFF";
              let border = "rgba(11,111,39,0.18)";
              if (yearAnswered) {
                if (isCorrect) {
                  bg = "#E7F7EA";
                  border = "#0B6F27";
                } else if (isSelected) {
                  bg = "#FDEAEA";
                  border = "#D9432E";
                }
              } else if (isPicked) {
                bg = "#EAF7EC";
                border = "#159533";
              }
              return (
                <button
                  key={opt}
                  onClick={() => !yearAnswered && setYearPicked(opt)}
                  disabled={yearAnswered}
                  className={yearAnswered && isCorrect ? "correctPulse" : ""}
                  style={{
                    ...styles.optionBtn,
                    background: bg,
                    borderColor: border,
                    borderWidth: isPicked && !yearAnswered ? 2 : 1,
                    cursor: yearAnswered ? "default" : "pointer",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {!yearAnswered && (
            <button
              style={{
                ...styles.primaryBtn,
                opacity: yearPicked ? 1 : 0.4,
                cursor: yearPicked ? "pointer" : "not-allowed",
              }}
              onClick={() => yearPicked && handleYearAnswer(yearPicked)}
              disabled={!yearPicked}
            >
              {t.submitAnswer}
            </button>
          )}

          {!yearAnswered && (
            <button style={styles.skipBtn} onClick={() => handleYearAnswer(null)}>
              {t.skipBtn}
            </button>
          )}

          {yearAnswered && (
            <div className="fadeInUp" style={styles.feedbackText}>
              {yearSelected === currentYearQuestion.answer
                ? t.correct
                : `${t.answerLabel} ${currentYearQuestion.answer}`}
            </div>
          )}
        </div>
      )}

      {screen === "random" && currentRandomItem && (
        <div style={styles.gameWrap}>
          <button style={styles.menuBtn} onClick={goToMenuFromGame}>
            {t.menu}
          </button>
          {duelActive && (
            <div style={styles.duelScoreRow}>
              <div style={styles.duelScoreBlock}>
                <div style={styles.scoreboardLabel}>{profile?.nickname ?? t.duelYouLabel}</div>
                <div style={styles.scoreboardValue}>{score}/100</div>
              </div>
              <div style={styles.duelScoreDivider}>VS</div>
              <div style={styles.duelScoreBlock}>
                <div style={styles.scoreboardLabel}>
                  {opponentProfile?.nickname ?? t.duelOpponentLabel}
                </div>
                <div style={styles.scoreboardValue}>
                  {(myPlayerSlot === "player1"
                    ? currentMatch?.player2_score
                    : currentMatch?.player1_score) ?? 0}
                  /100
                </div>
              </div>
            </div>
          )}
          {roomActive && (
            <RoomLeaderboard players={roomPlayers} myUserId={authUser?.id} />
          )}
          <div style={styles.scoreboard}>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.score}</div>
              <div style={styles.scoreboardValue}>{score}/100</div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.question}</div>
              <div style={styles.scoreboardValue}>
                {rIndex + 1}/{randomQueue.length}
              </div>
            </div>
            <div style={styles.scoreboardItem}>
              <div style={styles.scoreboardLabel}>{t.time}</div>
              <div
                style={{
                  ...styles.scoreboardValue,
                  color: randomTimeLeft <= 8 ? "#D9432E" : "#0B6F27",
                }}
              >
                {randomTimeLeft}
              </div>
            </div>
          </div>

          {/* ---- CLUES or YEAR: clue/fact text + 4 options ---- */}
          {(currentRandomItem.kind === "clues" || currentRandomItem.kind === "year") && (
            <>
              <div style={styles.card}>
                <div style={styles.cardLabel}>
                  {currentRandomItem.kind === "clues" ? t.cluesLabel : t.yearLabel}
                </div>
                {currentRandomItem.kind === "clues" ? (
                  <div style={styles.cluesList}>
                    {(currentRandomItem.data.clues[lang] || currentRandomItem.data.clues.pt).map(
                      (c, i) => (
                        <div key={i} style={styles.clueRow}>
                          <span style={styles.clueNumber}>{i + 1}</span>
                          <span style={styles.clueText}>{c}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p style={styles.clueText}>
                    {typeof currentRandomItem.data.fact === "string"
                      ? currentRandomItem.data.fact
                      : currentRandomItem.data.fact[lang]}
                  </p>
                )}
              </div>

              <div style={styles.optionsGrid}>
                {currentRandomItem.data.options.map((opt) => {
                  const isCorrect = opt === currentRandomItem.data.answer;
                  const isPicked = opt === randomPicked;
                  let bg = "#FFFFFF";
                  let border = "rgba(11,111,39,0.18)";
                  if (randomAnswered) {
                    if (isCorrect) {
                      bg = "#E7F7EA";
                      border = "#0B6F27";
                    } else if (isPicked) {
                      bg = "#FDEAEA";
                      border = "#D9432E";
                    }
                  } else if (isPicked) {
                    bg = "#EAF7EC";
                    border = "#159533";
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => !randomAnswered && setRandomPicked(opt)}
                      disabled={randomAnswered}
                      className={randomAnswered && isCorrect ? "correctPulse" : ""}
                      style={{
                        ...styles.optionBtn,
                        background: bg,
                        borderColor: border,
                        borderWidth: isPicked && !randomAnswered ? 2 : 1,
                        cursor: randomAnswered ? "default" : "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!randomAnswered && (
                <button
                  style={{
                    ...styles.primaryBtn,
                    opacity: randomPicked !== null ? 1 : 0.4,
                    cursor: randomPicked !== null ? "pointer" : "not-allowed",
                  }}
                  onClick={submitRandomAnswer}
                  disabled={randomPicked === null}
                >
                  {t.submitAnswer}
                </button>
              )}
            </>
          )}

          {/* ---- LINEUP: pitch + text guess ---- */}
          {currentRandomItem.kind === "lineup" && (
            <>
              <div style={{ ...styles.card, padding: "18px" }}>
                <div style={{ ...styles.cardLabel, marginBottom: 4 }}>
                  {currentRandomItem.data.team.toUpperCase()} — {currentRandomItem.data.year}
                </div>
                <div style={styles.matchLabelText}>
                  {typeof currentRandomItem.data.matchLabel === "string"
                    ? currentRandomItem.data.matchLabel
                    : currentRandomItem.data.matchLabel[lang]}
                </div>
                <div style={styles.pitch}>
                  <div style={styles.pitchCenterCircle} />
                  <div style={styles.pitchHalfwayLine} />
                  <div style={styles.pitchCenterSpot} />
                  {["FW", "AM", "MF", "DM", "DF", "GK"]
                    .filter((posKey) =>
                      currentRandomItem.data.players.some((p) => p.position === posKey)
                    )
                    .map((posKey) => (
                      <div key={posKey} style={styles.pitchRow}>
                        {currentRandomItem.data.players
                          .map((p, i) => ({ ...p, i }))
                          .filter((p) => p.position === posKey)
                          .map((p) => {
                            const isHidden = p.i === currentRandomItem.data.hiddenIndex;
                            const showAsWrong = isHidden && randomAnswered && !randomCorrect;
                            const showAsRight = isHidden && randomAnswered && randomCorrect;
                            const lastName = p.shortName || p.name.split(" ").slice(-1)[0];
                            const kit = getTeamKit(currentRandomItem.data.team);
                            return (
                              <div key={p.i} style={styles.chipWrap}>
                                <div
                                  className={showAsRight ? "correctPulse" : ""}
                                  style={{
                                    ...styles.chip,
                                    background: kit.bg,
                                    color: kit.text,
                                    ...(isHidden ? styles.chipHidden : {}),
                                    ...(showAsRight ? styles.chipCorrect : {}),
                                    ...(showAsWrong ? styles.chipWrong : {}),
                                  }}
                                >
                                  {isHidden && !randomAnswered ? "?" : p.number}
                                </div>
                                <div style={styles.chipLabel}>
                                  {isHidden && !randomAnswered ? "???" : lastName}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                </div>
              </div>

              {!randomAnswered && randomHintsUsed > 0 && (() => {
                const hiddenP =
                  currentRandomItem.data.players[currentRandomItem.data.hiddenIndex];
                return (
                  <div style={styles.card}>
                    <div style={styles.cardLabel}>{t.hintsLabel}</div>
                    <div style={styles.cluesList}>
                      {randomHintsUsed >= 1 && (
                        <div style={styles.clueRow}>
                          <span style={styles.clueNumber}>1</span>
                          <span style={styles.clueText}>
                            {t.nationality} {translateNationality(hiddenP.nationality, lang)}
                          </span>
                        </div>
                      )}
                      {randomHintsUsed >= 2 && (
                        <div style={styles.clueRow}>
                          <span style={styles.clueNumber}>2</span>
                          <span style={styles.clueText}>
                            {t.clubs} {otherClubsHint(hiddenP.clubs, currentRandomItem.data.team)}
                          </span>
                        </div>
                      )}
                      {randomHintsUsed >= 3 && (
                        <div style={styles.clueRow}>
                          <span style={styles.clueNumber}>3</span>
                          <span style={styles.clueText}>
                            {typeof hiddenP.funFact === "string"
                              ? hiddenP.funFact
                              : hiddenP.funFact[lang]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {!randomAnswered && (
                <>
                  <div style={styles.guessRow}>
                    <input
                      type="text"
                      value={randomGuess}
                      onChange={(e) => setRandomGuess(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitRandomAnswer();
                      }}
                      placeholder={t.guessPlaceholder}
                      style={styles.guessInput}
                      autoFocus
                    />
                    <button
                      style={{
                        ...styles.primaryBtn,
                        marginTop: 0,
                        width: "auto",
                        opacity: randomGuess.trim() ? 1 : 0.4,
                        cursor: randomGuess.trim() ? "pointer" : "not-allowed",
                      }}
                      onClick={submitRandomAnswer}
                      disabled={!randomGuess.trim()}
                    >
                      {t.submit}
                    </button>
                  </div>
                  <button
                    style={{
                      ...styles.hintBtn,
                      opacity: randomHintsUsed >= MAX_HINTS ? 0.4 : 1,
                      cursor: randomHintsUsed >= MAX_HINTS ? "not-allowed" : "pointer",
                    }}
                    onClick={requestRandomHint}
                    disabled={randomHintsUsed >= MAX_HINTS}
                  >
                    {randomHintsUsed >= MAX_HINTS
                      ? t.noMoreHints
                      : t.getHint.replace("{used}", randomHintsUsed).replace("{max}", MAX_HINTS)}
                  </button>
                </>
              )}
            </>
          )}

          {/* ---- CLUBS: club list + text guess ---- */}
          {currentRandomItem.kind === "clubs" && (
            <>
              <div style={styles.card}>
                <div style={styles.cardLabel}>{t.clubsLabel}</div>
                <div style={styles.cluesList}>
                  {currentRandomItem.data.clubs.map((c, i) => (
                    <div key={i} style={styles.clueRow}>
                      <span style={styles.clueNumber}>{i + 1}</span>
                      <span style={styles.clueText}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!randomAnswered && randomHintsUsed > 0 && (
                <div style={styles.card}>
                  <div style={styles.cardLabel}>{t.hintsLabel}</div>
                  <div style={styles.cluesList}>
                    {(Array.isArray(currentRandomItem.data.hints)
                      ? currentRandomItem.data.hints
                      : currentRandomItem.data.hints[lang]
                    )
                      .slice(0, randomHintsUsed)
                      .map((hintText, i) => (
                        <div key={i} style={styles.clueRow}>
                          <span style={styles.clueNumber}>{i + 1}</span>
                          <span style={styles.clueText}>{hintText}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {!randomAnswered && (
                <>
                  <div style={styles.guessRow}>
                    <input
                      type="text"
                      value={randomGuess}
                      onChange={(e) => setRandomGuess(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitRandomAnswer();
                      }}
                      placeholder={t.clubsGuessPlaceholder}
                      style={styles.guessInput}
                      autoFocus
                    />
                    <button
                      style={{
                        ...styles.primaryBtn,
                        marginTop: 0,
                        width: "auto",
                        opacity: randomGuess.trim() ? 1 : 0.4,
                        cursor: randomGuess.trim() ? "pointer" : "not-allowed",
                      }}
                      onClick={submitRandomAnswer}
                      disabled={!randomGuess.trim()}
                    >
                      {t.submit}
                    </button>
                  </div>
                  <button
                    style={{
                      ...styles.hintBtn,
                      opacity: randomHintsUsed >= MAX_CLUBS_HINTS ? 0.4 : 1,
                      cursor: randomHintsUsed >= MAX_CLUBS_HINTS ? "not-allowed" : "pointer",
                    }}
                    onClick={requestRandomHint}
                    disabled={randomHintsUsed >= MAX_CLUBS_HINTS}
                  >
                    {randomHintsUsed >= MAX_CLUBS_HINTS
                      ? t.noMoreHints
                      : t.getHint
                          .replace("{used}", randomHintsUsed)
                          .replace("{max}", MAX_CLUBS_HINTS)}
                  </button>
                </>
              )}
            </>
          )}

          {!randomAnswered && (
            <button style={styles.skipBtn} onClick={submitRandomAnswer}>
              {t.skipBtn}
            </button>
          )}

          {randomAnswered && (
            <div className="fadeInUp" style={styles.feedbackText}>
              {randomCorrect
                ? t.correct
                : currentRandomItem.kind === "clues" || currentRandomItem.kind === "year"
                ? `${t.answerLabel} ${currentRandomItem.data.answer}`
                : currentRandomItem.kind === "lineup"
                ? `${t.missingPlayer} ${
                    currentRandomItem.data.players[currentRandomItem.data.hiddenIndex].name
                  }`
                : `${t.answerLabel} ${currentRandomItem.data.name}`}
            </div>
          )}
        </div>
      )}

      {screen === "roundEnd" && (
        <div style={styles.centerCol}>
          <div style={styles.eyebrow}>{t.fullTime}</div>
          <div className="trophyGlow" style={styles.trophyEmoji}>
            {score >= 80 ? "🏆" : score >= 50 ? "⚽" : "🎯"}
          </div>
          <h1 className="fadeInUp" style={styles.title}>{score}/100</h1>
          <p style={styles.subtitle}>{t.niceReading}</p>

          <button style={styles.primaryBtn} onClick={playAgain}>
            {t.playAgain}
          </button>
          <button
            style={{
              ...styles.primaryBtn,
              background: "transparent",
              color: "#0B6F27",
              boxShadow: "none",
              border: "1px solid #0B6F27",
            }}
            onClick={() => goToMenuFromGame()}
          >
            {t.changeMode}
          </button>
        </div>
      )}

      {screen === "duelWaiting" && (
        <div style={styles.centerCol}>
          <div className="trophyGlow" style={styles.trophyEmoji}>
            ⏳
          </div>
          <h1 className="fadeInUp" style={styles.title}>
            {t.duelWaitingTitle}
          </h1>
          <p style={styles.subtitle}>{t.duelWaitingDesc}</p>
          <div style={styles.duelScoreRow}>
            <div style={styles.duelScoreBlock}>
              <div style={styles.scoreboardLabel}>{profile?.nickname ?? t.duelYouLabel}</div>
              <div style={styles.scoreboardValue}>{score}/100</div>
            </div>
            <div style={styles.duelScoreDivider}>VS</div>
            <div style={styles.duelScoreBlock}>
              <div style={styles.scoreboardLabel}>
                {opponentProfile?.nickname ?? t.duelOpponentLabel}
              </div>
              <div style={styles.scoreboardValue}>
                {(myPlayerSlot === "player1"
                  ? currentMatch?.player2_score
                  : currentMatch?.player1_score) ?? 0}
                /100
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "duelEnd" && currentMatch && (
        <div style={{ ...styles.centerCol, minHeight: "70vh", justifyContent: "center" }}>
          <div className="trophyGlow" style={styles.trophyEmoji}>
            {currentMatch.winner_id === authUser?.id
              ? "🏆"
              : currentMatch.winner_id
              ? "😔"
              : "🤝"}
          </div>
          <h1
            className="fadeInUp"
            style={{ ...styles.title, fontSize: "clamp(26px, 7vw, 38px)" }}
          >
            {currentMatch.winner_id === authUser?.id
              ? t.duelEndWin
              : currentMatch.winner_id
              ? t.duelEndLose
              : t.duelEndDraw}
          </h1>
          <div style={styles.duelScoreRow}>
            <div style={styles.duelScoreBlock}>
              <div style={styles.scoreboardLabel}>{profile?.nickname ?? t.duelYouLabel}</div>
              <div style={styles.scoreboardValue}>
                {myPlayerSlot === "player1" ? currentMatch.player1_score : currentMatch.player2_score}
                /100
              </div>
            </div>
            <div style={styles.duelScoreDivider}>VS</div>
            <div style={styles.duelScoreBlock}>
              <div style={styles.scoreboardLabel}>
                {opponentProfile?.nickname ?? t.duelOpponentLabel}
              </div>
              <div style={styles.scoreboardValue}>
                {myPlayerSlot === "player1" ? currentMatch.player2_score : currentMatch.player1_score}
                /100
              </div>
            </div>
          </div>
          <button style={styles.primaryBtn} onClick={leaveDuel}>
            {t.duelBackBtn}
          </button>
        </div>
      )}

      {screen === "duelCountdown" && (
        <div style={styles.centerCol}>
          <div style={styles.eyebrow}>{t.duelGetReady}</div>
          {opponentProfile && (
            <p style={styles.subtitle}>
              {profile?.nickname ?? t.duelYouLabel} {t.duelVsWord} {opponentProfile.nickname}
            </p>
          )}
          <div
            key={duelCountdown}
            className="trophyGlow fadeInUp"
            style={{ ...styles.trophyEmoji, fontSize: 88 }}
          >
            {duelCountdown > 0 ? duelCountdown : "⚽"}
          </div>
        </div>
      )}

      {screen === "roomCreateModes" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={() => {
                if (lang === "pt" && roomModeRegion) {
                  setRoomModeRegion(null);
                } else {
                  setRoomModeRegion(null);
                  setScreen("multiplayer");
                }
              }}
              aria-label={t.menu}
            >
              <span style={{ fontSize: 22, color: "#101820" }}>‹</span>
            </button>
            <div style={{ width: 42 }} />
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>{t.roomModesEyebrow}</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1 style={styles.lightTitle}>{t.roomModesHeading}</h1>
          <p style={styles.lightSubtitle}>{t.roomModesSubtitle}</p>
          <div style={styles.lightSubtitleRule} />

          {roomError && <div style={styles.authError}>{roomError}</div>}
          <div className="gtpModeGrid">{renderModeCards(handleCreateRoom)}</div>
        </div>
      )}

      {screen === "roomRestartModes" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={() => {
                if (lang === "pt" && roomModeRegion) {
                  setRoomModeRegion(null);
                } else {
                  setRoomModeRegion(null);
                  setScreen("roomEnd");
                }
              }}
              aria-label={t.menu}
            >
              <span style={{ fontSize: 22, color: "#101820" }}>‹</span>
            </button>
            <div style={{ width: 42 }} />
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>{t.roomModesEyebrow}</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1 style={styles.lightTitle}>{t.roomModesHeading}</h1>
          <p style={styles.lightSubtitle}>{t.roomModesSubtitle}</p>
          <div style={styles.lightSubtitleRule} />

          {roomError && <div style={styles.authError}>{roomError}</div>}
          <div className="gtpModeGrid">{renderModeCards(restartRoom)}</div>
        </div>
      )}

      {screen === "roomChangeMode" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={() => {
                if (lang === "pt" && roomModeRegion) {
                  setRoomModeRegion(null);
                } else {
                  setRoomModeRegion(null);
                  setScreen("roomLobby");
                }
              }}
              aria-label={t.menu}
            >
              <span style={{ fontSize: 22, color: "#101820" }}>‹</span>
            </button>
            <div style={{ width: 42 }} />
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>{t.roomModesEyebrow}</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1 style={styles.lightTitle}>{t.roomModesHeading}</h1>
          <p style={styles.lightSubtitle}>{t.roomModesSubtitle}</p>
          <div style={styles.lightSubtitleRule} />

          {roomError && <div style={styles.authError}>{roomError}</div>}
          <div className="gtpModeGrid">{renderModeCards(changeRoomMode)}</div>
        </div>
      )}

      {screen === "roomLobby" && room && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.lightTopRow}>
            <button
              style={styles.lightIconBtn}
              onClick={leaveRoom}
              aria-label={t.menu}
            >
              <span style={{ fontSize: 22, color: "#101820" }}>‹</span>
            </button>
            <div style={{ width: 42 }} />
            <div style={{ width: 42 }} />
          </div>

          <div style={styles.lightEyebrowRow}>
            <span style={styles.lightEyebrowLine} />
            <span style={styles.lightEyebrow}>{t.roomCodeLabel}</span>
            <span style={styles.lightEyebrowLine} />
          </div>
          <h1
            className="fadeInUp"
            style={{ ...styles.lightTitle, letterSpacing: "0.06em" }}
          >
            {room.code}
          </h1>
          <p style={styles.lightSubtitle}>{t.roomShareHint}</p>
          <div style={styles.lightSubtitleRule} />

          <button
            style={{
              ...styles.primaryBtn,
              background: "transparent",
              color: MODE_ACCENTS.multiplayer.dark,
              boxShadow: "none",
              border: `2px solid ${MODE_ACCENTS.multiplayer.dark}`,
            }}
            onClick={copyRoomCode}
          >
            {roomCodeCopied ? t.roomCodeCopiedMsg : t.roomCopyBtn}
          </button>

          <div style={{ ...styles.lightEyebrow, fontSize: 13, marginTop: 24 }}>
            {t.currentModeLabel}
          </div>
          <div style={{ ...styles.modeCard, textAlign: "left" }}>
            <div style={{ ...styles.modeTitle, marginBottom: 0 }}>
              {roomModeLabel(room.mode)}
            </div>
          </div>

          <div style={{ ...styles.lightEyebrow, fontSize: 13 }}>
            {t.roomPlayersLabel} ({roomPlayers.length})
          </div>
          <div style={{ marginBottom: 16 }}>
            <RoomLeaderboard
              players={roomPlayers}
              myUserId={authUser?.id}
              showReady
              hostId={room.host_id}
              readyLabel={t.roomReadyBadgeShort}
              notReadyLabel={t.roomNotReadyBadgeShort}
              hostLabel={t.roomHostBadgeShort}
            />
          </div>

          {isRoomHost ? (
            <>
              <button
                style={{
                  ...styles.primaryBtn,
                  opacity: allPlayersReady() ? 1 : 0.5,
                  cursor: allPlayersReady() ? "pointer" : "not-allowed",
                }}
                onClick={handleStartRoom}
                disabled={!allPlayersReady()}
              >
                {t.roomStartBtn}
              </button>
              {!allPlayersReady() && (
                <p style={{ ...styles.lightSubtitle, marginTop: 4, marginBottom: 0 }}>
                  {t.roomWaitingForReady}
                  <br />
                  {roomPlayers.filter((p) => p.user_id !== room.host_id && p.ready).length}/
                  {roomPlayers.filter((p) => p.user_id !== room.host_id).length}{" "}
                  {t.roomReadyCountSuffix}
                </p>
              )}
              <button
                style={{
                  ...styles.primaryBtn,
                  marginTop: 8,
                  background: "transparent",
                  color: MODE_ACCENTS.multiplayer.dark,
                  boxShadow: "none",
                  border: `2px solid ${MODE_ACCENTS.multiplayer.dark}`,
                }}
                onClick={() => {
                  setRoomModeRegion(null);
                  setScreen("roomChangeMode");
                }}
              >
                {t.changeModeBtn}
              </button>
            </>
          ) : (
            <>
              <button
                style={{
                  ...styles.primaryBtn,
                  ...(roomPlayers.find((p) => p.user_id === authUser?.id)?.ready
                    ? {
                        background: "transparent",
                        color: MODE_ACCENTS.multiplayer.dark,
                        boxShadow: "none",
                        border: `2px solid ${MODE_ACCENTS.multiplayer.dark}`,
                      }
                    : {}),
                }}
                onClick={toggleReady}
              >
                {roomPlayers.find((p) => p.user_id === authUser?.id)?.ready
                  ? t.roomUnreadyBtn
                  : t.roomReadyBtn}
              </button>
              <p style={styles.lightSubtitle}>{t.roomWaitingHostLabel}</p>
            </>
          )}
          <button
            style={{ ...styles.authToggleLink, marginTop: 8 }}
            onClick={leaveRoom}
          >
            {t.roomLeaveBtn}
          </button>
        </div>
      )}

      {screen === "roomCountdown" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.comingSoonWrap}>
            <div style={styles.lightEyebrowRow}>
              <span style={styles.lightEyebrowLine} />
              <span style={styles.lightEyebrow}>{t.duelGetReady}</span>
              <span style={styles.lightEyebrowLine} />
            </div>
            <p style={{ ...styles.lightSubtitle, margin: 0 }}>
              {roomPlayers.length} {t.roomPlayersLabel}
            </p>
            <div
              key={roomCountdown}
              className="trophyGlow fadeInUp"
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 800,
                fontSize: 96,
                color: MODE_ACCENTS.multiplayer.dark,
              }}
            >
              {roomCountdown > 0 ? roomCountdown : "⚽"}
            </div>
          </div>
        </div>
      )}

      {screen === "roomWaiting" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.comingSoonWrap}>
            <div
              className="trophyGlow"
              style={{
                ...styles.lightCardIconBadge,
                width: 110,
                height: 110,
                background: MODE_ACCENTS.multiplayer.solid,
                boxShadow: `inset 0 -6px 0 ${MODE_ACCENTS.multiplayer.dark}`,
              }}
            >
              <span style={{ fontSize: 46 }}>⏳</span>
            </div>
            <h1
              className="fadeInUp"
              style={{ ...styles.lightTitle, fontSize: "clamp(26px, 7vw, 38px)" }}
            >
              {t.roomWaitingTitle}
            </h1>
            <RoomLeaderboard players={roomPlayers} myUserId={authUser?.id} />
          </div>
        </div>
      )}

      {screen === "roomEnd" && room && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.comingSoonWrap}>
            <div
              className="trophyGlow"
              style={{
                ...styles.lightCardIconBadge,
                width: 110,
                height: 110,
                background: MODE_ACCENTS.multiplayer.solid,
                boxShadow: `inset 0 -6px 0 ${MODE_ACCENTS.multiplayer.dark}`,
              }}
            >
              <span style={{ fontSize: 48 }}>🏆</span>
            </div>
            <h1
              className="fadeInUp"
              style={{ ...styles.lightTitle, fontSize: "clamp(26px, 7vw, 38px)" }}
            >
              {t.roomEndTitle}
            </h1>
            <RoomLeaderboard players={roomPlayers} myUserId={authUser?.id} medals />
            {isRoomHost && (
              <button
                style={{ ...styles.primaryBtn, opacity: roomBusy ? 0.6 : 1 }}
                onClick={() => {
                  setRoomModeRegion(null);
                  setScreen("roomRestartModes");
                }}
                disabled={roomBusy}
              >
                {t.roomPlayAgainBtn}
              </button>
            )}
            {!isRoomHost && (
              <p style={{ ...styles.lightSubtitle, marginTop: 12, maxWidth: 320 }}>
                {t.roomEndWaitInfo}
              </p>
            )}
            {roomError && <div style={styles.authError}>{roomError}</div>}
            <button
              style={{
                ...styles.primaryBtn,
                background: "transparent",
                color: "#0B6F27",
                boxShadow: "none",
                border: "1px solid #0B6F27",
              }}
              onClick={leaveRoom}
            >
              {t.roomLeaveBtn}
            </button>
          </div>
        </div>
      )}

      {screen === "roomRestartPrompt" && (
        <div style={styles.lightPage} className="gtpDesktopPage">
          <div style={styles.comingSoonWrap}>
            <div
              className="trophyGlow"
              style={{
                ...styles.lightCardIconBadge,
                width: 110,
                height: 110,
                background: MODE_ACCENTS.multiplayer.solid,
                boxShadow: `inset 0 -6px 0 ${MODE_ACCENTS.multiplayer.dark}`,
              }}
            >
              <span style={{ fontSize: 48 }}>🔄</span>
            </div>
            <h1
              className="fadeInUp"
              style={{ ...styles.lightTitle, fontSize: "clamp(24px, 6.5vw, 34px)" }}
            >
              {t.roomRestartTitle}
            </h1>
            <button style={styles.primaryBtn} onClick={stayInRoom}>
              {t.roomStayBtn}
            </button>
            <button
              style={{
                ...styles.primaryBtn,
                background: "transparent",
                color: "#0B6F27",
                boxShadow: "none",
                border: "1px solid #0B6F27",
              }}
              onClick={leaveRoom}
            >
              {t.roomLeaveBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Baloo+2:wght@600;700;800&family=Oswald:wght@500;700&family=Inter:wght@400;500&display=swap');

  @keyframes correctPulse {
    0% { transform: scale(1); }
    35% { transform: scale(1.06); }
    100% { transform: scale(1); }
  }
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes trophyGlow {
    0%, 100% { text-shadow: 0 0 12px rgba(11,111,39,0.30), 0 0 0 rgba(11,111,39,0); transform: scale(1); }
    50% { text-shadow: 0 0 28px rgba(11,111,39,0.55), 0 0 40px rgba(34,199,68,0.35); transform: scale(1.06); }
  }
  @keyframes splashPulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.08) rotate(4deg); }
  }
  .correctPulse { animation: correctPulse 0.4s ease; }
  .fadeInUp { animation: fadeInUp 0.35s ease; }
  .trophyGlow { display: inline-block; animation: trophyGlow 1.8s ease-in-out infinite; }
  button { transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; touch-action: manipulation; }
  button:active:not(:disabled) { transform: scale(0.97); }
  input, textarea, select { font-size: 16px !important; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 100%; }
  html { overflow-y: scroll; }
  body { display: block !important; place-items: unset !important; }
  #root {
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    text-align: left !important;
    width: 100%;
  }
  @media (min-width: 900px) {
    .gtpDesktopPage { max-width: 880px !important; }
    .gtpModeGrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: stretch;
    }
    .gtpModeGrid > div { margin-bottom: 0 !important; }
  }
  @media (max-width: 380px) {
    .statsGrid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .fadeInUp, .correctPulse, .trophyGlow { animation: none !important; }
  }
`;

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "repeating-linear-gradient(90deg, #14532B 0px, #14532B 60px, #17632F 60px, #17632F 120px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px",
    boxSizing: "border-box",
  },
  cornerIcons: {
    position: "absolute",
    top: 18,
    right: 18,
    display: "flex",
    gap: 8,
    zIndex: 5,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "rgba(15,40,24,0.75)",
    border: "1px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    cursor: "pointer",
    backdropFilter: "blur(2px)",
  },
  turfOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 50% 0%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)",
  },
  centerCol: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    maxWidth: 420,
    gap: 8,
  },
  pageLight: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(180deg, #FBFAF6 0%, #F4F1EA 100%)",
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
    padding: "16px 16px 32px",
    paddingTop: "calc(env(safe-area-inset-top, 0px) + 48px)",
  },
  lightPage: {
    width: "100%",
    maxWidth: 480,
    marginLeft: "auto",
    marginRight: "auto",
  },
  heroSpacer: {
    height: 260,
  },
  heroFlowContent: {
    position: "relative",
    zIndex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  lightTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  lightIconBtn: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#FFFFFF",
    border: "1px solid #E4E0D4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    cursor: "pointer",
    flexShrink: 0,
  },
  lightLangRow: {
    display: "inline-flex",
    background: "#EDEAE0",
    borderRadius: 999,
    padding: 4,
    gap: 2,
  },
  lightLangPill: {
    border: "none",
    background: "transparent",
    color: "#5B5B52",
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "0.04em",
    minWidth: 40,
    minHeight: 36,
    padding: "8px 14px",
    borderRadius: 999,
    cursor: "pointer",
    touchAction: "manipulation",
  },
  lightLangPillActive: {
    background: "linear-gradient(180deg, #22C744, #0B6F27)",
    color: "#FFFFFF",
    boxShadow: "0 5px 10px rgba(11,111,39,0.2)",
  },
  lightEyebrowRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  lightEyebrowLine: {
    height: 1,
    width: 28,
    background: "#0B6F27",
    opacity: 0.5,
  },
  lightEyebrow: {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 500,
    fontSize: "clamp(13px, 3.6vw, 16px)",
    letterSpacing: "7px",
    textTransform: "uppercase",
    color: "#0B6F27",
  },
  lightTitle: {
    fontFamily: "'Baloo 2', sans-serif",
    fontSize: "clamp(36px, 11vw, 72px)",
    fontWeight: 800,
    lineHeight: 0.98,
    color: "#101820",
    margin: 0,
    textAlign: "center",
  },
  lightTitleAccent: {
    color: "#58CC02",
  },
  lightSubtitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(15px, 4vw, 20px)",
    color: "#555555",
    lineHeight: 1.3,
    textAlign: "center",
    margin: "16px 0 0",
  },
  lightSubtitleRule: {
    width: 52,
    height: 3,
    background: "#159533",
    borderRadius: 999,
    margin: "10px auto 28px",
  },
  ballWrap: {
    position: "relative",
    height: 190,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  ballImage: {
    height: "100%",
    width: "auto",
    maxWidth: "100%",
    objectFit: "contain",
  },
  ballSwooshA: {
    position: "absolute",
    width: 260,
    height: 90,
    background: "linear-gradient(90deg, #2F8B52 0%, #1F6D3F 100%)",
    opacity: 0.9,
    transform: "rotate(-6deg) translateY(-6px)",
    clipPath:
      "polygon(2% 35%, 20% 5%, 45% 20%, 65% 0%, 85% 25%, 100% 10%, 96% 60%, 78% 85%, 55% 65%, 35% 95%, 15% 70%, 0% 90%)",
  },
  ballSwooshB: {
    position: "absolute",
    width: 190,
    height: 60,
    background: "#5CC888",
    opacity: 0.55,
    transform: "rotate(4deg) translateY(24px) translateX(6px)",
    clipPath:
      "polygon(0% 30%, 25% 0%, 50% 25%, 75% 5%, 100% 30%, 90% 70%, 65% 95%, 40% 70%, 15% 100%, 0% 65%)",
  },
  confettiA: {
    position: "absolute",
    top: 4,
    left: "18%",
    width: 8,
    height: 16,
    background: "#2F8B52",
    opacity: 0.7,
    transform: "rotate(25deg)",
    borderRadius: 2,
  },
  confettiB: {
    position: "absolute",
    bottom: 8,
    right: "20%",
    width: 7,
    height: 14,
    background: "#1F6D3F",
    opacity: 0.6,
    transform: "rotate(-20deg)",
    borderRadius: 2,
  },
  confettiC: {
    position: "absolute",
    top: "30%",
    right: "12%",
    width: 6,
    height: 12,
    background: "#5CC888",
    opacity: 0.7,
    transform: "rotate(40deg)",
    borderRadius: 2,
  },
  ballEmoji: {
    position: "relative",
    fontSize: 72,
    filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.25))",
  },
  lightCard: {
    width: "100%",
    margin: "0 0 18px 0",
    background: "#FFFFFF",
    borderRadius: 24,
    border: "2px solid",
    padding: "22px 24px",
    display: "flex",
    alignItems: "flex-start",
    gap: 20,
    boxShadow: "0 3px 0 rgba(16,24,32,0.08)",
  },
  lightCardIconCircle: {
    position: "relative",
    width: 140,
    height: 140,
    minWidth: 132,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  lightCardIconImage: {
    width: 132,
    height: 132,
    objectFit: "contain",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
  },
  lightCardIconBadge: {
    position: "relative",
    width: 124,
    height: 124,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  lightCardBody: { flex: 1, minWidth: 0 },
  lightCardTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  lightCardTitle: {
    fontFamily: "'Baloo 2', sans-serif",
    fontWeight: 800,
    fontSize: 22,
    lineHeight: 1.15,
    color: "#101820",
  },
  lightCardChevron: {
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1,
    marginLeft: 8,
  },
  lightCardDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#5F666B",
    margin: 0,
    marginBottom: 18,
  },
  lightCardBtn: {
    width: "100%",
    height: 46,
    color: "#FFFFFF",
    border: "none",
    borderRadius: 14,
    padding: "0 20px",
    fontFamily: "'Baloo 2', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "transform 100ms ease, box-shadow 100ms ease",
  },
  statsBar: {
    marginTop: 8,
    background: "#0F2818",
    border: "1px solid #1F6D3F",
    borderRadius: 16,
    padding: "16px 8px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 6,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statLabel: {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 600,
    fontSize: 10,
    letterSpacing: "0.02em",
    color: "#CFEAD9",
    lineHeight: 1.3,
    whiteSpace: "pre-line",
  },
  langRow: {
    display: "flex",
    gap: 8,
    marginBottom: 14,
  },
  langBtn: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#5F666B",
    background: "#FFFFFF",
    border: "1px solid rgba(11,111,39,0.18)",
    borderRadius: 999,
    padding: "6px 14px",
    cursor: "pointer",
  },
  langBtnActive: {
    color: "#FFFFFF",
    background: "linear-gradient(180deg, #22C744, #0B6F27)",
    border: "1px solid #0B6F27",
  },
  eyebrow: {
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: "0.3em",
    fontSize: 13,
    color: "#0B6F27",
    marginBottom: 8,
  },
  trophyEmoji: {
    fontSize: 52,
    marginBottom: 18,
    marginTop: 4,
  },
  title: {
    fontFamily: "'Anton', sans-serif",
    fontStyle: "italic",
    fontWeight: 900,
    fontSize: 40,
    color: "#101820",
    letterSpacing: "-1px",
    textTransform: "uppercase",
    margin: "0 0 12px 0",
    transform: "skewX(-6deg)",
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    color: "#5F666B",
    fontSize: 15,
    marginBottom: 20,
  },
  modeCard: {
    width: "100%",
    background: "#FFFFFF",
    border: "2px solid #E4E0D4",
    borderRadius: 22,
    padding: "18px 20px",
    marginBottom: 16,
    textAlign: "left",
    boxShadow: "0 3px 0 rgba(16,24,32,0.08)",
  },
  modeTitle: {
    fontFamily: "'Baloo 2', sans-serif",
    fontWeight: 800,
    fontSize: 18,
    color: "#101820",
    marginBottom: 6,
  },
  modeDesc: {
    fontFamily: "'Inter', sans-serif",
    color: "#5F666B",
    fontSize: 13.5,
    lineHeight: 1.5,
    margin: "0 0 14px 0",
  },
  primaryBtn: {
    fontFamily: "'Baloo 2', sans-serif",
    background: "#22C744",
    color: "#FFFFFF",
    border: "none",
    padding: "14px 32px",
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 4px 0 #0B6F27",
    width: "100%",
  },
  hintBtn: {
    fontFamily: "'Oswald', sans-serif",
    background: "transparent",
    color: "#0B6F27",
    border: "1px dashed #0B6F27",
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 12.5,
    fontWeight: 700,
    letterSpacing: "0.03em",
  },
  comingSoonWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 14,
    padding: "40px 16px 48px",
  },
  comingSoonBadge: {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.08em",
    color: "#FFFFFF",
    background: MODE_ACCENTS.multiplayer.dark,
    padding: "6px 16px",
    borderRadius: 999,
  },
  authForm: {
    width: "100%",
    maxWidth: 340,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
  authInput: {
    width: "100%",
    height: 48,
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    color: "#101820",
    background: "#FFFFFF",
    border: "2px solid #E4E0D4",
    borderRadius: 12,
    padding: "0 14px",
    boxSizing: "border-box",
  },
  passwordFieldWrap: {
    position: "relative",
    width: "100%",
  },
  passwordToggleBtn: {
    position: "absolute",
    right: 4,
    top: "50%",
    transform: "translateY(-50%)",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  authSubmitBtn: {
    width: "100%",
    height: 48,
    background: MODE_ACCENTS.multiplayer.solid,
    color: "#FFFFFF",
    border: "none",
    borderRadius: 14,
    fontFamily: "'Baloo 2', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: `0 4px 0 ${MODE_ACCENTS.multiplayer.dark}`,
  },
  authToggleLink: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#0B6F27",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "center",
    padding: "4px 0",
  },
  skipBtn: {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.05em",
    color: "#5F666B",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "center",
    width: "100%",
    padding: "10px 0 0",
    textDecoration: "underline",
  },
  authError: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: "#D9432E",
    textAlign: "center",
  },
  authMessage: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: "#0B6F27",
    textAlign: "center",
  },
  authDivider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#5F666B",
    fontFamily: "'Oswald', sans-serif",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  authDividerLine: {
    flex: 1,
    height: 1,
    background: "#E4E0D4",
  },
  authGoogleBtn: {
    width: "100%",
    height: 48,
    background: "#FFFFFF",
    color: "#101820",
    border: "2px solid #E4E0D4",
    borderRadius: 14,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  authLoggedInCard: {
    width: "100%",
    maxWidth: 340,
    background: "#FFFFFF",
    border: "2px solid #E4E0D4",
    borderRadius: 16,
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  menuBtn: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.05em",
    color: "#5F666B",
    background: "transparent",
    border: "none",
    padding: "4px 2px",
    alignSelf: "flex-start",
    cursor: "pointer",
  },
  gameWrap: {
    position: "relative",
    width: "100%",
    maxWidth: 480,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  scoreboard: {
    display: "flex",
    justifyContent: "space-between",
    background: "#FFFFFF",
    border: "2px solid #E4E0D4",
    borderRadius: 18,
    padding: "12px 20px",
    boxShadow: "0 3px 0 rgba(16,24,32,0.08)",
  },
  scoreboardItem: { textAlign: "center", flex: 1 },
  duelScoreRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    background: "#FFFFFF",
    border: "2px solid #E4E0D4",
    borderRadius: 18,
    padding: "14px 16px",
    boxShadow: "0 3px 0 rgba(16,24,32,0.08)",
  },
  duelScoreBlock: { textAlign: "center", minWidth: 76 },
  duelScoreDivider: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: "#AAB4BE",
    letterSpacing: "0.1em",
  },
  roomLeaderboard: {
    width: "100%",
    maxWidth: 340,
    background: "#FFFFFF",
    border: "2px solid #E4E0D4",
    borderRadius: 18,
    padding: "8px 6px",
    boxShadow: "0 3px 0 rgba(16,24,32,0.08)",
    maxHeight: 320,
    overflowY: "auto",
  },
  roomLeaderboardRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 12,
  },
  roomLeaderboardRowMe: {
    background: "rgba(28,176,246,0.12)",
  },
  roomLeaderboardRank: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: "#5F666B",
    minWidth: 22,
  },
  roomLeaderboardName: {
    flex: 1,
    fontFamily: "'Baloo 2', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: "#101820",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  roomLeaderboardScore: {
    fontFamily: "'Baloo 2', sans-serif",
    fontSize: 15,
    fontWeight: 800,
    color: "#101820",
  },
  roomReadyBadge: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#8A8F94",
    background: "#EDEAE0",
    padding: "4px 10px",
    borderRadius: 999,
    flexShrink: 0,
  },
  roomReadyBadgeActive: {
    color: "#FFFFFF",
    background: "linear-gradient(180deg, #22C744, #0B6F27)",
  },
  scoreboardLabel: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#5F666B",
  },
  scoreboardValue: {
    fontFamily: "'Baloo 2', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    color: "#101820",
  },
  card: {
    background: "#FFFFFF",
    border: "2px solid #E4E0D4",
    borderRadius: 22,
    padding: "22px 24px",
    boxShadow: "0 3px 0 rgba(16,24,32,0.08)",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  },
  cardFlipped: {
    transform: "scale(0.98)",
  },
  cardLabel: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#0B6F27",
    marginBottom: 12,
  },
  matchLabelText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: "#5F666B",
    marginBottom: 12,
  },
  cluesList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  clueRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  clueNumber: {
    fontFamily: "'Baloo 2', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color: "#FFFFFF",
    background: "#22C744",
    boxShadow: "inset 0 -3px 0 #0B6F27",
    minWidth: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  clueText: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: 15.5,
    color: "#101820",
    lineHeight: 1.5,
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  feedbackText: {
    fontFamily: "'Baloo 2', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#0B6F27",
    textAlign: "center",
    letterSpacing: "0.02em",
  },
  optionBtn: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    color: "#101820",
    border: "2px solid",
    borderRadius: 14,
    padding: "14px 10px",
    transition: "all 0.2s ease",
  },
  pitch: {
    position: "relative",
    background: "#0B6F27",
    border: "2px solid #E4E0D4",
    borderRadius: 16,
    padding: "18px 4px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 14,
    minHeight: 380,
    overflow: "hidden",
  },
  pitchHalfwayLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    background: "rgba(255,255,255,0.45)",
  },
  pitchCenterCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 70,
    height: 70,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.45)",
    transform: "translate(-50%, -50%)",
  },
  pitchCenterSpot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.55)",
    transform: "translate(-50%, -50%)",
  },
  pitchRow: {
    position: "relative",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-start",
    flexWrap: "nowrap",
    gap: 2,
    zIndex: 1,
  },
  chipWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    minWidth: 0,
    flex: "1 1 0",
  },
  chip: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#FFFFFF",
    border: "2px solid #FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Baloo 2', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: "#0B6F27",
    boxShadow: "0 2px 0 rgba(0,0,0,0.15)",
    flexShrink: 0,
  },
  chipHidden: {
    background: "#FFFFFF",
    border: `2px dashed ${MODE_ACCENTS.lineup.solid}`,
    color: MODE_ACCENTS.lineup.dark,
  },
  chipCorrect: {
    background: "#E7F7EA",
    border: "2px solid #0B6F27",
  },
  chipWrong: {
    background: "#FDEAEA",
    border: "2px solid #D9432E",
    color: "#D9432E",
  },
  chipLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 9,
    fontWeight: 600,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 1.15,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  guessRow: {
    display: "flex",
    gap: 10,
  },
  guessInput: {
    flex: 1,
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    color: "#101820",
    background: "#FFFFFF",
    border: "1px solid rgba(11,111,39,0.18)",
    borderRadius: 12,
    padding: "0 14px",
  },
};
