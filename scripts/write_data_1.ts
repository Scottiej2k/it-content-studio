import * as fs from 'fs';

const rawData = `episode_id: E1.1
grammar_level: 1.1
cefr: A1
grammar_topic: Vocabulary: Greetings & Introductions
vocab_focus: Salve, ciao, buongiorno, buonasera, arrivederci, piacere, mi chiamo, come ti chiami, come si chiama, sono, lui è, lei è, il signore, la signora, presentarsi
title: Il palazzo
hook: A stranger's death forces two families to meet for the very first time.
setting: Ground-floor storage room of Via Monferrato 14, then the building courtyard. Tuesday morning into Friday afternoon.
featured_characters: ['Roberto Ferrero', 'Carmela Ferrero', 'Assunta Ferrero', 'Riccardo Mancini', 'Paola Mancini']
conflict: The building's elderly owner, Signor Cattaneo, is found dead. A notaio summons both tenant families to the storage room and reads his will: the building passes equally to the Ferreros and the Mancinis. Roberto immediately rises and introduces himself with stiff formality — 'Buongiorno, mi chiamo Roberto Ferrero' — as if establishing legal ownership through his name alone. Riccardo responds in kind. The two families have shared a building for years but have never properly met. Every introduction in the room is forced, awkward, and loaded: formal Lei between the two men, uncertain tu between the women. Nobody knows what to say after 'piacere.'
resolution: That evening, Carmela walks downstairs with a plate of biscotti. She knocks on the Mancini door. Paola opens it. A long pause. Then: 'Piacere, sono Paola.' 'Piacere mio, sono Carmela.' They do not talk for long. But first names have been exchanged. Upstairs, Assunta sits at the kitchen table playing solitaire, unsurprised by any of it.
grammar_opportunity: The entire episode is engineered to repeat greetings and introductions in varied registers. Formal Lei in the notaio scene: 'La presento al Signor Ferrero.' Informal tu in private family scenes. The contrast is explicit and noticed by Carmela. Every character says their name at least twice. 'Piacere' and 'mi chiamo' recur naturally across every encounter. The word bank can be extracted entirely from dialogue.
season_threads: ['Building co-ownership established', 'Roberto-Riccardo rivalry set from first handshake', "Assunta's calm reaction to the will is the episode's planted mystery"]
continuity_note: Both families have formally met. Riccardo has already called his lawyer. Carmela and Paola have exchanged first names. Assunta has said nothing about the will beyond 'capisco.'

--------------------------------------------------

episode_id: E1.2
grammar_level: 1.2
cefr: A1
grammar_topic: Vocabulary: Colors & Shapes
vocab_focus: Rosso, bianco, nero, blu, verde, giallo, arancione, grigio, marrone, beige, rotondo, quadrato, rettangolare, ovale, grande, piccolo, lungo, corto, alto, basso
title: Il tavolo verde
hook: A rusted courtyard table turns a furniture debate into the families' first real argument.
setting: The building courtyard, then a hardware store on Via Sacchi. Saturday afternoon.
featured_characters: ['Roberto Ferrero', 'Riccardo Mancini', 'Carmela Ferrero', 'Paola Mancini', 'Giulia Ferrero']
conflict: The courtyard's old iron table is rusted through. Both families agree it needs replacing — the only thing they have agreed on since the will was read. Then Roberto says he wants a round table in terra-cotta red, like the one his grandmother had. Riccardo says he wants a rectangular table in white, because it is cleaner and more modern. At the hardware store on Via Sacchi, both men stand in front of the outdoor furniture section for forty-five minutes, pointing at shapes and colors: 'Questo è bianco, freddo, anonimo.' 'Quello è rosso, sembra un bar di periferia.' Giulia, dragged along by her mother, photographs every option in silence.
resolution: Giulia creates a group chat — neither father knew it existed — and runs a vote. Carmela and Paola, not invited but voting anyway, choose a round table in verde oliva. Roberto accepts it because it is round. Riccardo accepts it because it is not red. The table is delivered on Monday. Both men avoid looking at it.
grammar_opportunity: Colors and shapes appear in every product description, every argument, every comparison. The hardware store scene is a natural stage: il tavolo rotondo, la sedia rettangolare, il vaso quadrato, il muro grigio, la porta azzurra. Giulia's vote messages are short descriptive strings: 'questo, verde, rotondo.' The episode provides high-frequency repetition of color + shape + size adjective combinations in plausible context.
season_threads: ['First shared decision made, contentiously', "Giulia established as the family's pragmatic problem-solver", "Group chat created — the building's digital nervous system"]
continuity_note: The verde oliva table is in the courtyard. Both patriarchs avoid acknowledging it. The group chat has six members and no messages since the vote.

--------------------------------------------------

episode_id: E1
grammar_level: 1
cefr: A1
grammar_topic: Nouns, Articles, and Descriptive Adjectives — Overview
vocab_focus: Overview of noun gender, definite/indefinite articles (il, lo, la, i, gli, le / un, uno, una), adjective agreement in number and gender, basic descriptive adjectives
title: Un palazzo vecchio
hook: Marco and Giulia take stock of the building they now half-own — and find it stranger than they realized.
setting: The building's common spaces: stairwell, storage room, hallway, the courtyard. A weekday morning.
featured_characters: ['Marco Ferrero', 'Giulia Ferrero', 'Assunta Ferrero']
conflict: Marco and Giulia decide to walk the building floor by floor and make a list of everything that needs fixing. What starts as a practical exercise becomes an inventory of the strange: a locked door they have never noticed, a staircase that goes up one more step than it should, a window that is definitely not on the outside of the building as seen from the street. Assunta, encountered in the third-floor hallway, names everything they point at with the precision of someone who built the place herself: 'una porta vecchia,' 'un corridoio stretto,' 'le scale lunghe,' 'un armadio grande.'
resolution: At the end of the tour, Marco has a list. Every item is described with a noun and at least one adjective. Giulia looks at the list and says it reads like a vocabulary exercise. Assunta takes the list, reads it, and adds one item at the bottom in her handwriting: 'un segreto.' She hands it back and goes to make coffee.
grammar_opportunity: The tour format forces noun-article-adjective triads in every sentence. Definite articles for known things (il corridoio, la scala), indefinite for new discoveries (un armadio, una finestra strana). Gender agreement is modeled across masculine and feminine pairs. Marco reads the list aloud at the end, providing a natural summary repetition. The word bank is drawn from the building inventory.
season_threads: ["Building's physical strangeness established — narrative permission for future mysteries", "Assunta's cryptic 'un segreto' plants the first direct mystery signal"]
continuity_note: Marco kept the list. He has not shown it to his parents. The locked door is on the third floor behind the fire hose cabinet.

--------------------------------------------------

episode_id: E1.3
grammar_level: 1.3
cefr: A1
grammar_topic: The Gender of Nouns
vocab_focus: Masculine nouns ending in -o (il tavolo, il libro, il palazzo), feminine nouns ending in -a (la porta, la scala, la finestra), nouns ending in -e (il corridoio / la stazione), exceptions and irregulars, il/la with professions
title: Maschile o femminile?
hook: Giulia tutors her grandmother in how to use a smartphone — and Assunta turns every lesson into a grammar debate.
setting: Assunta's kitchen, morning. A small table with espresso and a smartphone.
featured_characters: ['Giulia Ferrero', 'Assunta Ferrero']
conflict: Giulia is trying to teach Assunta how to use the group chat on her phone. Assunta wants to understand every word before she types it. She keeps stopping to ask about gender: 'Il messaggio o la messaggio?' 'La foto o il foto?' 'Il problema — perché è maschile, se finisce in -a?' Giulia, a linguistics student, is delighted by the questions. Assunta is not asking to be difficult. She genuinely wants to understand the system, because she believes systems always have a reason.
resolution: By the end of the morning, Assunta can send a message on the group chat. She sends: 'Buongiorno a tutti. Il caffè è pronto.' Six people reply immediately. She looks at the replies, satisfied. She tells Giulia: 'La grammatica è come il palazzo. Sembra complicata, ma ha una logica.' Giulia writes this down.
grammar_opportunity: The lesson format allows Giulia to explain gender rules naturally in dialogue, providing the learner with both instruction and examples in context. Nouns with predictable endings (-o masculine, -a feminine) alternate with exceptions (il problema, la mano). Professions without article agreement are introduced: sono avvocato, è architetto. The conversation is slow-paced and repetitive by design — Assunta asks questions, Giulia answers, examples multiply.
season_threads: ["Assunta joins the group chat — her presence in the building's digital space will matter later", 'Giulia and Assunta relationship deepened']
continuity_note: Assunta's first message in the group chat was saved as a screenshot by Carmela. Giulia keeps a notebook of 'things Assunta says that are actually about grammar.'

--------------------------------------------------

episode_id: E1.4
grammar_level: 1.4
cefr: A1
grammar_topic: The Indefinite Article
vocab_focus: Un (masc. consonant), uno (masc. s+consonant, z, ps, gn), una (fem. consonant), un' (fem. vowel) — formation rules and usage with singular nouns; introducing new or non-specific things
title: Un ospite inaspettato
hook: An unexpected visitor at the building door forces everyone to introduce a stranger.
setting: Building entrance, Ferrero kitchen, building courtyard. A Thursday afternoon.
featured_characters: ['Carmela Ferrero', 'Roberto Ferrero', 'Assunta Ferrero', 'Signora Brambilla']
conflict: Signora Brambilla — the third-floor resident with a minor legal stake in the building — appears at the Ferrero door without warning, carrying a large pot of something. She introduces herself to Roberto: 'Sono una vicina di casa.' Roberto, who has lived in this building for twenty-two years and knows exactly who she is, is nonetheless drawn into a conversation about who she is, where she lives, and what she has brought. Every new object she produces from her bag requires an indefinite article: un dolce, uno strudel, una lettera, un'idea.
resolution: By the end of the visit, Carmela has set an extra place for lunch, Assunta has acquired a new card partner, and Roberto has been talked into attending a building residents' meeting that Brambilla has apparently been organizing for three years. As she leaves, she says: 'È stato un piacere.' Roberto, slightly dazed: 'Anche per me. Credo.'
grammar_opportunity: Every new object Brambilla produces triggers an indefinite article. The rule distinctions (un/uno/una/un') occur naturally across the episode's objects: un documento, uno zaino, una torta, un'arancia. Carmela and Roberto use indefinite articles when describing Brambilla to Assunta afterward: 'È una signora del terzo piano.' 'Ha uno stile particolare.' The learner encounters the full set of forms organically across a single scene.
season_threads: ['Signora Brambilla formally introduced — her legal stake in the building is mentioned in passing', 'Roberto-Brambilla dynamic established: he is always slightly wrong-footed by her']
continuity_note: The building residents' meeting is now on the calendar for the following Thursday. Roberto agreed without fully understanding what he agreed to.

--------------------------------------------------

episode_id: E1.5
grammar_level: 1.5
cefr: A1
grammar_topic: The Definite Article
vocab_focus: Il (masc. consonant), lo (masc. s+cons., z, gn, ps), l' (vowel), la (fem. consonant), i (masc. pl.), gli (masc. pl. vowel/s+cons.), le (fem. pl.) — usage with specific, known, or previously mentioned nouns
title: Il problema dell'ascensore
hook: The building elevator breaks down, and fixing it requires knowing exactly what every part is called.
setting: Building elevator (open, broken, door jammed), stairwell, Ferrero kitchen. A Wednesday morning.
featured_characters: ['Roberto Ferrero', 'Marco Ferrero', 'Riccardo Mancini']
conflict: The elevator doors jam open on the second floor. Roberto, who is an engineer, wants to fix it himself. He sends Marco to get specific tools: 'Prendi il cacciavite grande, non quello piccolo. E gli attrezzi nel cassetto — non i chiodi, gli altri.' Marco has never navigated Roberto's toolbox before. Every request requires a definite article — the specific tool, the known drawer, the right screws — and Marco keeps bringing the wrong thing. Riccardo, who needs to get to work and is standing at the elevator door in his suit, offers increasingly unhelpful legal opinions on liability.
resolution: Roberto fixes the elevator in forty minutes using only the tools Marco eventually located correctly. When it works again, Riccardo steps in immediately without saying thank you. Roberto watches the doors close and says to Marco: 'L'ascensore funziona. L'avvocato no.' Marco puts the tools away correctly for the first time.
grammar_opportunity: Roberto's instructions are a natural definite article drill: il cacciavite, lo spago, gli attrezzi, le viti, l'ascensore, i bulloni. Each instruction specifies a known, particular item from a known set — the exact context that requires definite articles. Marco's wrong retrieval and correction pattern creates natural repetition. The episode's final line ('l'ascensore funziona, l'avvocato no') models l' before vowel for both genders.
season_threads: ["Roberto's engineering competence established", 'Roberto-Riccardo dynamic: small resentments accumulate']
continuity_note: The elevator is working again. Roberto has mentally added 'the elevator' to his list of things in this building that are his responsibility. Marco now knows where the tools are.

--------------------------------------------------

episode_id: E1.6
grammar_level: 1.6
cefr: A1
grammar_topic: Descriptive Adjectives — Agreement and Placement
vocab_focus: Adjective agreement in gender and number (bello/bella/belli/belle), placement before vs. after noun (una bella casa vs. una casa bella), common descriptive pairs: vecchio/nuovo, grande/piccolo, lungo/corto, caldo/freddo, facile/difficile, brutto/bello
title: Il appartamento vuoto
hook: The empty apartment on the third floor is unlocked for the first time, and everyone has an opinion about what it is.
setting: Apartment 3B on the third floor (empty, slightly dusty). Tuesday afternoon.
featured_characters: ['Marco Ferrero', 'Giulia Ferrero', 'Assunta Ferrero', 'Signora Brambilla']
conflict: Marco finds Apartment 3B unlocked — a small storage annex that has been empty since Cattaneo died. He calls Giulia. They go in. It is a single room: old wallpaper, a small window with a good view, a wooden floor in decent condition. They begin describing it to each other to figure out what it could be. Each description becomes a judgment: 'È un appartamento vecchio.' 'No, è un appartamento storico.' 'La finestra è piccola ma bella.' 'Il pavimento è lungo e scuro.' Signora Brambilla appears from nowhere, as she does, and begins offering her own descriptions, which are increasingly extravagant.
resolution: Assunta arrives last. She looks around the room slowly. 'È un bel posto,' she says simply. Marco asks if she knows who used it. 'Lo usava qualcuno,' she says. 'Un vecchio amico.' She does not say more. She closes the door gently behind her when she leaves. Marco and Giulia stand in the empty room for a moment. Giulia says: 'È strano.' Marco: 'Sì. Molto strano.'
grammar_opportunity: Every descriptive exchange is a worked example of adjective agreement. Characters describe the same objects with different adjectives, some before the noun (un bel posto, una strana stanza), some after (un appartamento vuoto, una finestra piccola). The disagreement over descriptions — 'vecchio' vs. 'storico,' 'piccola' vs. 'bella' — models that adjective placement and choice carry meaning. Gender and number agreement is reinforced across masculine/feminine/plural combinations throughout.
season_threads: ['Apartment 3B introduced as a significant location', "Assunta's connection to the apartment hinted — 'un vecchio amico'", "Marco's curiosity about Assunta's past is activated"]
continuity_note: Apartment 3B is unlocked. Marco has a key from the notaio's paperwork. Assunta has not confirmed or denied that she knew Cattaneo personally.

--------------------------------------------------

episode_id: E2.1
grammar_level: 2.1
cefr: A1
grammar_topic: Vocabulary: The Family
vocab_focus: Il padre, la madre, il figlio, la figlia, il fratello, la sorella, il nonno, la nonna, lo zio, la zia, il cugino, la cugina, il marito, la moglie, i genitori, i parenti, sposato/a, single, il nipote
title: La domenica dei Ferrero
hook: A Sunday lunch that was supposed to be quiet becomes a census of everyone the Ferreros have ever been related to.
setting: Ferrero kitchen and dining table. Sunday afternoon.
featured_characters: ['Roberto Ferrero', 'Carmela Ferrero', 'Marco Ferrero', 'Giulia Ferrero', 'Assunta Ferrero']
conflict: Carmela has made ragù. The whole family is home — which is rare since Marco 'works' and Giulia studies in another city. At the table, the conversation turns to relatives: Roberto's brother in Palermo has called about the building. Carmela's sister wants to know the details. Assunta mentions a cousin nobody else knew about. Marco gets asked if he has a girlfriend. He does not. Giulia gets asked too. She passes the bread. Every family member mentioned requires a new vocabulary term, repeated naturally in conversation: 'tuo fratello,' 'la sorella di tua madre,' 'mia cugina di Palermo,' 'il marito di zia Rosaria.'
resolution: After lunch, Assunta produces a photograph from 1987: the Ferrero family at a wedding. She names everyone, pointing. Some names are familiar; several are not. She pauses at a face at the edge of the photo and moves on without naming him. Marco notices. He says nothing. Giulia is already washing the dishes.
grammar_opportunity: The lunch table is a natural stage for family vocabulary: possessive combinations (mio fratello, tua sorella, suo cugino, nostra nonna) appear in every sentence. The photograph scene reinforces all terms by requiring them to be used for identification. 'Chi è questo?' forces 'È il nonno di...' and 'È la moglie di...' constructions. The full family tree vocabulary recurs across the episode's two scenes with high natural frequency.
season_threads: ["Roberto's brother in Palermo introduced as off-screen presence", 'The unnamed man in the photograph is planted (will be identified as Ernesto in Episode 5.x)', "Giulia's non-answer about a ragazzo is the first hint of Lorenzo"]
continuity_note: The photograph is back in Assunta's room. Marco asked about the unnamed man later that afternoon. Assunta said: 'Una foto vecchia.' The topic was closed.

--------------------------------------------------

episode_id: E2.2
grammar_level: 2.2
cefr: A1
grammar_topic: Vocabulary: Professions
vocab_focus: Il medico, l'avvocato, l'ingegnere, l'architetto, l'insegnante, il professore, il cuoco, l'idraulico, il commerciante, il programmatore, lavorare, fare il/la + profession, essere + profession (no article), dove lavori?, cosa fai nella vita?
title: I mestieri
hook: A burst pipe on the second-floor landing forces both families into the hallway — and into each other's professional lives.
setting: Second-floor hallway (wet), Mancini living room doorway, Bar Giulio afterward. A weekday morning.
featured_characters: ['Roberto Ferrero', 'Carmela Ferrero', 'Riccardo Mancini', 'Paola Mancini', 'Marco Ferrero', 'Lorenzo Mancini']
conflict: A pipe bursts in the shared hallway. Both families appear in their doorways. The question of who calls a plumber escalates into a debate about professional expertise. Riccardo says he knows a plumber who works for the best law firms in Torino — Roberto finds this the most absurd endorsement he has ever heard for a tradesman. As the argument continues, Carmela and Paola fall into a separate conversation and discover what everyone does: Roberto was an engineer at FIAT, Riccardo is a lawyer, Paola was an architect, Marco 'works in tech,' Lorenzo is a junior architect.
resolution: Marco and Lorenzo, standing to one side while their fathers argue, have their first real conversation. Lorenzo: 'Progetto edifici. Tu?' Marco: 'Informatica.' A pause. Lorenzo: 'Mio padre dice che tutti i problemi hanno una soluzione legale.' Marco: 'Il mio dice che hanno una soluzione tecnica.' They both look at the leaking pipe. A plumber arrives. Nobody knows who called him.
grammar_opportunity: The 'what do you do?' structure recurs with every new character: Cosa fai? Sono avvocato. Lavora in uno studio legale. Fa il programmatore. The key grammar point — essere + profession without article (sono avvocato, not sono un avvocato) — is modeled correctly by every character and can be highlighted in the grammar lesson. Profession vocabulary is attached to real characters the learner already knows, making retention easier.
season_threads: ['Marco-Lorenzo friendship begins — the relationship that will complicate the feud', "Paola's architecture background mentioned for the first time"]
continuity_note: Marco and Lorenzo have exchanged numbers. Neither father knows.

--------------------------------------------------

episode_id: E2
grammar_level: 2
cefr: A1
grammar_topic: Subject Pronouns, stare, and essere — Overview
vocab_focus: Overview of io, tu, lui, lei, noi, voi, loro; essere (to be — identity, origin, characteristic); stare (to be — condition, health, location); come stai vs. come sei; key phrases: sto bene, sono italiano, siamo vicini di casa
title: Bloccati
hook: A power cut traps Roberto and Riccardo in the elevator. For forty minutes, they have no choice but to say who they are.
setting: Building elevator, stuck between floors two and three. A Tuesday evening.
featured_characters: ['Roberto Ferrero', 'Riccardo Mancini']
conflict: The elevator stops during a power outage. Roberto and Riccardo are inside. They stand in silence for approximately six minutes. Then Roberto, because the silence is worse than conversation, asks: 'Come stai?' Not because he wants to know. Because he is an Italian man in a box and there is no other option. Riccardo says 'Sto bene, grazie.' Which is false. Roberto says 'Anch'io.' Also false. They begin talking — slowly, stiffly — about who they are. Riccardo is from Genova originally. Roberto is Torinese, third generation. 'Sei del Nord?' 'Sono di Torino. Tu sei ligure?' The essere/stare distinction runs through every exchange.
resolution: When the power returns, both men step out looking subtly different. No friendship has formed. But Riccardo has said, in the dark, that the building question is not purely financial for him. Roberto has admitted he is nervous. Neither will acknowledge this conversation again. Carmela and Paola, waiting on separate floors, both notice something has shifted in their husbands.
grammar_opportunity: The two-person, confined scene is ideal for drilling essere vs. stare without distraction. Come stai? / Sto bene/male/così così versus Sei di Torino? / Sono ingegnere / Siamo vicini run in natural alternation. Subject pronouns are explicit because the men are establishing identity: io sono X, tu sei Y. The grammar lesson can contrast the two verbs using exact lines from the story.
season_threads: ['Roberto-Riccardo first humanization — from adversaries toward reluctant people', 'Elevator established as their recurring symbolic space']
continuity_note: Roberto told Carmela only that Riccardo 'non è solo un avvocato arrogante.' He said nothing else. The elevator was repaired the following morning.

--------------------------------------------------

episode_id: E2.3
grammar_level: 2.3
cefr: A1
grammar_topic: Subject Pronoun Basics
vocab_focus: Io, tu, lui, lei, noi, voi, loro — forms and usage; Lei formal (capital L); when to omit subject pronouns in Italian vs. when to include them for emphasis or clarity; anche io, neanche lui
title: Chi parla?
hook: The building group chat descends into chaos because nobody can tell who is talking to whom.
setting: The building group chat (seen on phones/screens), both apartments, building stairwell. An evening.
featured_characters: ['Giulia Ferrero', 'Marco Ferrero', 'Lorenzo Mancini', 'Carmela Ferrero', 'Riccardo Mancini']
conflict: Giulia sends a message to the group chat asking about the elevator. Eight replies arrive in three minutes, some answering different questions, some addressing the wrong person, one that is clearly meant to be private (from Riccardo to Lorenzo, sent to the group by mistake: 'Non parlare con quel ragazzo Ferrero'). The chat becomes a comedy of mistaken referents — 'lui dice che...' but who is lui? 'Voi potete...' but which voi? Marco, reading over Giulia's shoulder, starts annotating who each pronoun refers to. It becomes a linguistics exercise in real time.
resolution: Lorenzo sends a direct message to Giulia (not the group chat): 'Mi dispiace per mio padre.' Giulia shows it to Marco. Marco says: 'È diverso dagli altri.' He means it as an observation, not a warning. Giulia does not reply to Lorenzo until the next morning. Her reply is: 'Nessun problema.' Lorenzo reads it four times.
grammar_opportunity: The chat format makes pronoun referents genuinely ambiguous, which is the communicative problem subject pronouns solve. Who is lui, who is lei, when does noi mean the whole building and when does it mean just one family — these questions arise naturally and are resolved through explicit pronoun use. The Lei/lei formal/informal distinction appears when Riccardo writes to Carmela with capital-L Lei. The lesson can use actual chat messages as examples.
season_threads: ['Giulia-Lorenzo first direct private message', "Riccardo's opposition to Marco-Lorenzo contact made explicit"]
continuity_note: The private message exchange between Giulia and Lorenzo exists. Marco knows about it. Neither parent knows.

--------------------------------------------------

episode_id: E2.4
grammar_level: 2.4
cefr: A1
grammar_topic: Stare Versus essere
vocab_focus: Stare — health/condition (sto bene, stai male), location (sta a Torino), progressive (sta lavorando); essere — identity (è avvocato), origin (è di Genova), characteristic (è gentile), material (è di legno); key contrasts and false cognates
title: Come stai, davvero?
hook: Carmela decides to ask Paola how she is really doing — and the answer takes longer than expected.
setting: Building courtyard, the green table. A Friday evening in October.
featured_characters: ['Carmela Ferrero', 'Paola Mancini']
conflict: Carmela has noticed, over several weeks, that Paola makes two coffees every morning and pours one down the sink — because Riccardo leaves too early to drink it. She has said nothing. On Friday evening she finds Paola alone at the courtyard table and sits down. She asks, very simply: 'Come stai, Paola? Davvero.' The question — stare, not essere — makes space for honesty that 'come sei?' would not. Paola's first answer is 'Sto bene.' Her second, after a pause: 'Sto cercando qualcosa.' Her third, after a longer pause, is not words at all.
resolution: They sit at the green table for thirty minutes. The essere/stare distinction carries the scene: Paola is an architect (è architetta) but she is not working as one (non sta lavorando come architetta). She is married (è sposata) but her husband is not present (non sta mai a casa). By the end, Carmela has not asked any more questions. She has just listened. This is how the friendship properly begins.
grammar_opportunity: The essere/stare contrast is dramatized through a character who is, in every permanent sense, defined (è architetta, è di Milano, è sposata) but whose condition is the problem (non sta bene, non sta costruendo niente, sta aspettando qualcosa). The lesson can pull directly from the dialogue to contrast identical-seeming sentences that mean very different things: 'È qui' (she belongs here) vs. 'Sta qui' (she is here right now). The courtyard scene's slow pace allows multiple repetitions.
season_threads: ["Paola's reinvention arc begins in earnest", "Carmela established as the series' most perceptive character", 'Carmela-Paola friendship reaches its first real depth']
continuity_note: Carmela has not told Roberto what Paola said. Paola has not told Riccardo that she sat with Carmela. Both of these silences are deliberate.

--------------------------------------------------

episode_id: E3.1
grammar_level: 3.1
cefr: A1
grammar_topic: Vocabulary: The House
vocab_focus: Le stanze: il soggiorno, la cucina, la camera da letto, il bagno, il corridoio, l'ingresso, lo studio, la cantina, il balcone, il giardino. I mobili: il tavolo, la sedia, il divano, il letto, l'armadio, la libreria, il frigorifero, la lavastoviglie, la lampada, il tappeto
title: Appartamento cercasi
hook: Giulia tries to describe her student apartment in a phone call home and realizes she does not know the Italian word for half the things in it.
setting: Giulia's student apartment in another city (phone call), intercut with the Ferrero kitchen in Torino.
featured_characters: ['Giulia Ferrero', 'Carmela Ferrero', 'Assunta Ferrero']
conflict: Giulia calls home from her student apartment. Carmela asks what it looks like. Giulia starts describing it and keeps pausing — she knows what things are but not what they are called in Italian: 'C'è una... una cosa larga dove mi siedo.' 'Un divano,' says Carmela. 'E una specie di tavolo basso davanti.' 'Un tavolino.' 'Il bagno è piccolo e c'è solo una...' 'Una doccia?' 'No, grande.' 'Una vasca?' 'Sì!' This continues for the entire episode. Assunta, listening from across the kitchen, contributes a word every few minutes without being asked.
resolution: By the end of the call, Giulia has a complete vocabulary list for her apartment. She says: 'Adesso so come si chiama tutto.' Assunta says, to nobody in particular: 'Bene. Ora puoi parlare di casa tua.' Giulia: 'Nonna, stavi ascoltando tutto il tempo?' Assunta: 'Il soggiorno è la stanza più importante. Ricordatelo.'
grammar_opportunity: The call structure creates a natural elicitation game: Giulia describes objects in circumlocution, the other characters supply the correct vocabulary, and Giulia repeats it. This is exactly how vocabulary acquisition works, and the story models it. Every room and every piece of furniture is introduced in a meaningful context. The lesson can use the circumlocutions as exercises: 'Come si dice questa cosa in italiano?'
season_threads: ["Giulia's life outside Torino given texture", "Assunta's habit of teaching without appearing to teach established"]
continuity_note: Giulia wrote her apartment vocabulary list in her linguistics notebook. She titled it 'Lezione di nonna.'

--------------------------------------------------

episode_id: E3.2
grammar_level: 3.2
cefr: A1
grammar_topic: Vocabulary: Classroom Objects
vocab_focus: Il quaderno, il libro, la penna, la matita, il righello, la gomma, lo zaino, la cartella, il banco, la lavagna, il computer, il foglio, il dizionario, la calcolatrice, lo schermo, la cattedra
title: La cattedra di Carmela
hook: Carmela brings work home and turns the Ferrero kitchen into a classroom — whether Roberto likes it or not.
setting: Ferrero kitchen (transformed into a grading station), evening.
featured_characters: ['Carmela Ferrero', 'Roberto Ferrero', 'Assunta Ferrero']
conflict: Carmela is a school administrator and occasionally brings grading home when things get backed up. Tonight the kitchen table disappears under stacks of quaderni, fogli, libri, penne, and her laptop. Roberto, who was planning to eat at the kitchen table, finds himself redirected to the small side table. He protests. Carmela, without looking up: 'Il quaderno, Roberto, non il tuo posto.' He moves to the side table, which has Assunta's card game on it. The three of them negotiate the kitchen space using only the vocabulary of school objects and furniture.
resolution: An hour later, Roberto has been reading at the side table, Assunta has moved her cards to the floor, and Carmela has finished her grading. Roberto asks: 'Hai finito?' Carmela: 'Ho finito.' Roberto: 'Posso avere la mia cucina?' Carmela stacks everything back into her cartella with remarkable speed. Roberto returns to his seat. Assunta, from the floor: 'La cucina è la tua, Roberto. Per ora.'
grammar_opportunity: The school objects vocabulary is introduced through a domestic scene, making it accessible even to learners who may not be in school. Every object is named as Carmela places it or Roberto moves it: 'questo quaderno,' 'i fogli là,' 'la penna — quale penna? — quella rossa.' The lesson can extend from the episode by showing how these same words appear in a real classroom context. Learners acquire the vocabulary in a warm, comedic setting.
season_threads: ["Carmela's professional life as school administrator established", 'The kitchen-as-contested-territory theme introduced']
continuity_note: Roberto has accepted that Tuesday evenings belong to Carmela's grading. He has not announced this acceptance. He simply moves to the side table every Tuesday now.

--------------------------------------------------

episode_id: E3
grammar_level: 3
cefr: A1
grammar_topic: C'è and ci sono, Interrogatives, Calendar — Overview
vocab_focus: Overview: c'è (there is), ci sono (there are), non c'è, non ci sono; interrogative words: chi, che, dove, quando, come, perché, quanto; days of the week and months as calendar anchors
title: C'è qualcuno?
hook: Giulia finds the empty apartment on the third floor open — with a warm moka pot inside.
setting: Apartment 3B, building stairwell, Ferrero apartment. An early weekday morning.
featured_characters: ['Giulia Ferrero', 'Marco Ferrero', 'Assunta Ferrero']
conflict: Giulia notices the door of Apartment 3B slightly open. She pushes it: inside, a small folding table, a chair, a moka pot still warm, and two cups. C'è un tavolo. C'è una sedia. Ci sono delle tazze. Non c'è nessuno. She calls Marco. Together they investigate using every interrogative available: Chi usa questo appartamento? Dove vive questa persona? Quando è stata qui l'ultima volta? Come è entrata? Perché c'è una caffettiera calda? They form a list of questions with no answers.
resolution: Assunta, confronted at the kitchen table, admits she has been using the room for years — since before Cattaneo died, with his knowledge and blessing. 'È il mio posto per pensare,' she says. Marco: 'C'è altro che non sappiamo?' Assunta: 'Ci sono molte cose che non sapete.' She makes coffee. She uses the same moka pot.
grammar_opportunity: The mystery format is built entirely on c'è/ci sono and interrogative words. The investigation scene generates natural yes/no questions (C'è qualcuno? Non c'è nessuno), existence statements (ci sono due tazze, non c'è luce), and every interrogative word in plausible sequence. The grammar lesson can use the investigation as a model for how to ask and answer basic questions in Italian. The episode's payoff — Assunta's unanswered 'ci sono molte cose' — demonstrates the open-ended power of ci sono.
season_threads: ["Apartment 3B established as Assunta's secret space", "Assunta's relationship with Cattaneo deepens the mystery thread"]
continuity_note: Assunta has given Marco and Giulia a spare key to 3B. She has made no request for secrecy but they have both decided to keep it quiet.

--------------------------------------------------

episode_id: E3.3
grammar_level: 3.3
cefr: A1
grammar_topic: C'è / ci sono
vocab_focus: C'è + singular noun, ci sono + plural noun, non c'è, non ci sono, c'è qualcuno/nessuno/qualcosa/niente, ecco (here is/there is, pointing), expressing existence and presence in Italian vs. English 'there is/are'
title: Non c'è niente nel frigorifero
hook: Both families discover, on the same Sunday evening, that nobody went shopping this week.
setting: Building hallway (the confrontation), both kitchens (briefly). Sunday evening.
featured_characters: ['Carmela Ferrero', 'Roberto Ferrero', 'Paola Mancini', 'Riccardo Mancini']
conflict: Carmela opens the refrigerator: 'Non c'è niente.' Roberto: 'C'è del formaggio?' 'No.' 'C'è il pane?' 'Non c'è nemmeno il pane.' He goes to check himself. She is right. Simultaneously, downstairs: Paola opens the Mancini refrigerator. 'Riccardo, non c'è niente.' 'Ci sono le uova?' 'Non ci sono le uova. Non c'è niente, ti dico.' Both families end up in the hallway at the same time, both heading to the shop. They go together to the supermarket, arguing about what to buy and discovering they have identical gaps in their refrigerators.
resolution: They return from the shop with too many bags and no plan. Carmela suggests they eat together — it is simpler. Riccardo says he does not think that is a good idea. Carmela says she did not ask. They eat together. It is not terrible. At the end of dinner, Riccardo says: 'C'era del vino?' Roberto: 'C'era. L'abbiamo finito.'
grammar_opportunity: C'è and ci sono appear in nearly every sentence of this episode — the refrigerator scene is specifically designed as a high-frequency drilling context. Positive/negative pairs (c'è il latte / non c'è il latte) with singular and plural (ci sono le uova / non ci sono le uova) alternate naturally throughout. The final line — c'era del vino? / c'era, l'abbiamo finito — introduces c'era (there was) as a natural past form without requiring explicit past tense instruction yet.
season_threads: ["First shared meal — significant in a series about two families who don't want to share anything", "Carmela's social authority established: she does not ask, she informs"]
continuity_note: Both families ate together. Nobody proposed it would happen again. Carmela is already planning it again.

--------------------------------------------------

episode_id: E3.4
grammar_level: 3.4
cefr: A1
grammar_topic: Interrogative Words
vocab_focus: Chi (who), che / che cosa / cosa (what), dove (where), quando (when), come (how), perché (why), quanto/quanta/quanti/quante (how much/many), quale/quali (which), come mai (how come/why ever)
title: Il modulo
hook: The building co-ownership requires a legal form to be completed. The form asks questions nobody can answer.
setting: Ferrero kitchen (the form), brief scenes at Bar Giulio and Mancini living room. A weekday.
featured_characters: ['Marco Ferrero', 'Roberto Ferrero', 'Carmela Ferrero', 'Riccardo Mancini']
conflict: The notaio sends a form: both co-owners must complete a legal declaration about the property. Roberto brings it to Marco, who he trusts with paperwork. Marco reads it. Every line is a question: Chi è il proprietario principale? Quanti appartamenti ci sono? Quando è stato costruito l'edificio? Come è divisa la proprietà? Qual è il valore stimato? Marco does not know the answers to most of these. He calls Riccardo, which he has never done before. Riccardo knows some answers and not others. They end up at the kitchen table together, two people who have not chosen to be there, answering questions.
resolution: Riccardo knows the construction date: 1963. Marco finds the floor plan. Roberto provides the apartment count. Carmela produces a coffee. The form is completed in one hour. As Riccardo leaves, he pauses at the door: 'Come mai conosci così bene il modulo?' Marco: 'Perché l'ho letto.' Riccardo: 'Interessante.' He leaves. Marco is not sure if that was a compliment.
grammar_opportunity: Every section of the form is introduced with an interrogative word, making the vocabulary immediately functional and memorable. The scene requires characters to ask and re-ask questions using different interrogative forms: 'Chi firma?' 'Chi è responsabile?' 'Quando? Il primo gennaio o il trentuno dicembre?' 'Come mai il valore è diverso dal catasto?' The lesson can present the interrogative words as a set, using the form questions as examples.
season_threads: ['Marco-Riccardo first direct interaction — unexpected professional respect begins', "Building's legal and administrative reality made concrete"]
continuity_note: The form was submitted. Marco has Riccardo's direct number in his phone. He saved it under 'Avvocato Mancini (non dire a papà).'

--------------------------------------------------

episode_id: E3.5
grammar_level: 3.5
cefr: A1
grammar_topic: Calendario — Days, Months, Dates
vocab_focus: Lunedì–domenica, gennaio–dicembre, oggi / domani / ieri / dopodomani, il + cardinal + month (il tre marzo), l'anno scorso / quest'anno / l'anno prossimo, la settimana, il mese, il weekend, che giorno è oggi?, quando?
title: La riunione impossibile
hook: Scheduling a mandatory building meeting with two families and a neighbor requires three days of negotiation.
setting: The group chat, building hallway, Bar Giulio. Over a three-day period.
featured_characters: ['Roberto Ferrero', 'Riccardo Mancini', 'Carmela Ferrero', 'Paola Mancini', 'Signora Brambilla', 'Marco Ferrero']
conflict: The co-ownership agreement requires a monthly building meeting. Scheduling it should take five minutes. Roberto is free Monday and Thursday. Riccardo is never free Monday. Paola has something on Thursday. Carmela has a school event Wednesday. Signora Brambilla is unavailable every day except the second Tuesday of the month, which was yesterday. The group chat fills with dates: 'Martedì il sette?' 'No, il sette è mercoledì.' 'Allora il quattordici?' 'Il quattordici è un sabato.' 'Perfetto.' 'Non perfetto, sono a Palermo.' This continues for seventy-two hours.
resolution: Marco creates a shared calendar. He proposes: 'Sabato il quindici alle diciotto.' Everyone accepts. Saturday at 18:00, Roberto and Riccardo both arrive in the courtyard two minutes early, both carrying notebooks. They are surprised to see each other on time. The meeting lasts eleven minutes and produces three action items. It is their most efficient interaction to date.
grammar_opportunity: The scheduling conflict generates calendar vocabulary in every message: specific dates (il cinque, il dodici), days of the week in contrast (non lunedì, martedì?), months (il quattordici agosto, non settembre), time expressions (la prossima settimana, questo weekend, il mese scorso era meglio). The group chat format allows short, repetitive exchanges that model calendar language at natural density. The lesson can present dates in Italian format (il + number + month) with the messages as examples.
season_threads: ['Monthly meeting established as recurring structure', "Marco's organizational role for both families solidified"]
continuity_note: The shared calendar has one event: 'Riunione palazzo — sabato 15, ore 18.' Signora Brambilla has asked to be added. Nobody has her email.

--------------------------------------------------

episode_id: E4.1
grammar_level: 4.1
cefr: A1
grammar_topic: Vocabulary: Seasons & Weather
vocab_focus: Le stagioni: la primavera, l'estate, l'autunno, l'inverno. Il tempo: piove, nevica, c'è il sole, c'è la nebbia, fa caldo, fa freddo, fa fresco, c'è vento, grandina, c'è un temporale, è nuvoloso, è umido. Temperature: fa X gradi, zero gradi
title: La nebbia di Torino
hook: The first real autumn fog descends on Torino — and the building reveals a new problem.
setting: Building exterior (roof visible from courtyard), Bar Giulio, both apartments. An October morning.
featured_characters: ['Roberto Ferrero', 'Carmela Ferrero', 'Riccardo Mancini', 'Paola Mancini', 'Assunta Ferrero']
conflict: An October hailstorm followed by dense fog — la nebbia di Torino, which Assunta describes as 'la terza residente del palazzo' — reveals a serious roof problem: water is coming through the top floor ceiling. Roberto and Riccardo, for once, are standing in the same place looking at the same problem. The weather is the episode's character: piove, grandina, c'è la nebbia, fa freddo. The roof damage means a shared cost neither family anticipated.
resolution: Standing in the foggy courtyard looking up at the damaged roof, both families are facing the same direction for the first time. 'Dobbiamo ripararlo,' says Carmela. 'Sì,' says Paola. 'Quanto costa?' says Roberto. Nobody knows yet. But the weather has made them allies, at least briefly. Assunta, looking up at the fog: 'In autunno a Torino piove sempre. Era nel contratto.'
grammar_opportunity: Weather vocabulary appears naturally and densely: the storm scene uses grandina, c'è un temporale, fa molto freddo; the fog scene uses c'è la nebbia, è umido, non si vede niente; Assunta's seasonal commentary provides in autunno, d'estate, in inverno nevica. The four seasons are introduced through Assunta's deadpan description of Torino's climate. The lesson can extend this with a full weather/season vocabulary table.
season_threads: ['Roof damage introduced — shared financial problem that will require joint decision', 'Weather as recurring metaphor for the relationship climate between the families']
continuity_note: A roofer has been called. The estimate will arrive next week. Both families are quietly anxious about what it will cost.

--------------------------------------------------

episode_id: E4
grammar_level: 4
cefr: A1
grammar_topic: Numbers, Time, and Dates — Overview
vocab_focus: Cardinal numbers 1–1,000,000; ordinal numbers primo–decimo; telling time (sono le tre, è mezzogiorno, è mezzanotte); expressing dates (il + cardinal + month); prices (costa, quanto costa, €14,800)
title: Il preventivo
hook: The roof repair estimate arrives. The number is €14,800. Split in two.
setting: Building courtyard (the reading), Ferrero kitchen, hardware store. A Saturday.
featured_characters: ['Roberto Ferrero', 'Riccardo Mancini', 'Carmela Ferrero', 'Paola Mancini', 'Marco Ferrero']
conflict: The roofer delivers the estimate: quattordicimila ottocento euro. Split equally: settemila quattrocento each. Roberto goes pale. Riccardo goes very still, which is his equivalent. Marco, reading over Roberto's shoulder, calculates silently: that is six months of rent, more than he has saved in the year he has secretly not been working. The number is not impossible but it is large, and it arrives all at once: the cost, the date (lavori a partire dal tre novembre, finiti entro il quindici), the breakdown (il primo preventivo, il secondo, il terzo).
resolution: Marco quietly finds two alternative roofers online. He presents a comparison at the next building meeting with a printed breakdown: il primo preventivo €14,800, il secondo €9,200, il terzo €8,400. Both fathers look at Marco's table in silence, then at each other. They agree on the €8,400 option. The meeting takes nine minutes. It is a record. Marco notices Paola studying his table with professional attention.
grammar_opportunity: Numbers appear in authentic, emotionally weighted contexts — not as abstract exercises but as money, dates, and prices the characters genuinely react to. Cardinal numbers in prices (quattordicimila ottocento), ordinals in ranking (il primo preventivo, il secondo), time-telling in the meeting schedule (alle diciannove e mezza), and dates on the invoice (il tre novembre, il quindici dicembre) all appear naturally. The lesson can extract numbers directly from the episode's cost breakdown.
season_threads: ["Marco's competence noticed by Paola for the first time", 'First successful joint financial decision between the families']
continuity_note: The cheaper roofer was contracted. Roberto asked Marco where he found the alternatives. Marco said: 'Online.' Roberto: 'Bene.' That was all.

--------------------------------------------------

episode_id: E4.2
grammar_level: 4.2
cefr: A1
grammar_topic: Cardinal Numbers
vocab_focus: Uno–venti (all forms), ventuno–cento (pattern), cento–mille (hundreds), mille–un milione; number agreement with nouns (un cane, una gatta, due gatti); irregular forms: undici, dodici, tredici; use in prices, quantities, ages, phone numbers
title: Il mercato del sabato
hook: Carmela and Assunta go to Porta Palazzo market and every transaction requires a number.
setting: Porta Palazzo market, Torino. Saturday morning.
featured_characters: ['Carmela Ferrero', 'Assunta Ferrero']
conflict: Carmela and Assunta go to Porta Palazzo market every Saturday. This Saturday, Carmela has decided to track everything she spends, which means every number has to be said aloud and noted: due chili di pomodori (€3,50), trecento grammi di formaggio (€4,20), un litro di olio (€7,00), quattro arance (€1,80). Assunta, who does the haggling, negotiates every price down. 'Diciotto euro per questo?' 'Quindici.' 'Sedici.' 'Va bene, sedici.' Carmela tries to keep up with the arithmetic.
resolution: At the end of the morning, Carmela has spent €43,70 — more than she planned. Assunta spent €12,00 on things nobody asked for: a small jar of something, some walnuts, a card deck. When Carmela asks about the walnuts: 'Sono ventidue noci,' says Assunta. 'Il numero perfetto.' Carmela: 'Per cosa?' Assunta: 'Per le carte.' She smiles and walks ahead.
grammar_opportunity: Market transactions generate cardinal numbers in authentic context: prices in euros and cents, weights in grams and kilos, quantities of items, ages of vendors ('Ho sessantasette anni, signorina, non sono nuovo'). The haggling scene provides numbers in isolation and in context: 'diciotto, quindici, sedici.' Assunta's final line — ventidue noci, il numero perfetto — gives a small mystery that keeps the narrative alive while the grammar does its work.
season_threads: ["Porta Palazzo market established as Assunta and Carmela's weekly territory", "Assunta's card game habit reestablished — the twenty-two walnuts are connected to something"]
continuity_note: The walnuts are in Assunta's kitchen. The card deck is new.

--------------------------------------------------

episode_id: E4.3
grammar_level: 4.3
cefr: A1
grammar_topic: Ordinal Numbers
vocab_focus: Primo, secondo, terzo, quarto, quinto, sesto, settimo, ottavo, nono, decimo; agreement with noun gender (la prima volta, il secondo piano); use in floors, rankings, order, dates (il primo marzo)
title: Il secondo piano
hook: The building's annual general meeting requires agenda items to be ranked — and nobody can agree on first, second, or third priority.
setting: Building courtyard (the meeting), then both apartments. A Saturday evening.
featured_characters: ['Roberto Ferrero', 'Riccardo Mancini', 'Carmela Ferrero', 'Paola Mancini', 'Signora Brambilla']
conflict: The monthly meeting has three agenda items: the elevator (Roberto's priority), the legal agreement with the developer (Riccardo's), and a new buzzer system for the front door (Signora Brambilla's, submitted in writing). The question is which is first, which is second, which is third. Roberto says the elevator is 'il primo problema di questo palazzo.' Riccardo says the developer letter is 'la prima priorità legale.' Brambilla says the buzzer is 'la prima cosa necessaria per la sicurezza.' Nobody is wrong about their own first.
resolution: Carmela suggests they vote on the order, not the items. The result: (1) developer letter, (2) elevator, (3) buzzer. Roberto accepts because it is still second and not third. Brambilla accepts because third is better than nessuno. Riccardo accepts because he won. After the meeting, Carmela tells Roberto: 'Hai vinto il secondo posto.' Roberto: 'Il secondo non è il primo.' Carmela: 'No. Ma non è il terzo.'
grammar_opportunity: Ordinal numbers appear in every negotiation: il primo piano, il secondo appartamento, la terza settimana del mese, il quarto preventivo. The agenda-ordering scene requires all ordinals up to third with explicit agreement (il primo problema, la prima priorità, la prima cosa). The floors of the building provide a natural spatial context: il piano terra, il primo piano, il secondo, il terzo, il quarto, il quinto. The lesson can use the floor numbers as an anchor for the full ordinal system.
season_threads: ['Developer letter enters the formal agenda — the threat is now official', "Riccardo's political skill in the meeting establishes him as a strategic opponent"]
continuity_note: The developer letter will be addressed at the next meeting. Roberto has written 'SECONDO' in capital letters in his notebook, underlined twice.

--------------------------------------------------

episode_id: E4.4
grammar_level: 4.4
cefr: A1
grammar_topic: The Date
vocab_focus: Expressing dates: il + cardinal number + month (il tre marzo, il ventuno giugno), l'uno vs. il primo for the first, the year (nel duemilaventiquattro), asking the date (che giorno è? quant'è oggi?), dates on documents and invitations
title: L'anniversario
hook: Roberto forgets his wedding anniversary — and the date has to be reconstructed from evidence.
setting: Ferrero kitchen, building hallway, Bar Giulio. A Tuesday.
featured_characters: ['Roberto Ferrero', 'Carmela Ferrero', 'Marco Ferrero', 'Assunta Ferrero']
conflict: Roberto forgets his wedding anniversary. He knows it is in November. He is not sure of the exact date. He enlists Marco to help reconstruct it from indirect evidence: old photos, a receipt from a restaurant, a card from Assunta. Every document has a date on it: il tre novembre 1996, il diciassette settembre 1995 (engagement), il trenta ottobre 1996 (rehearsal dinner). The dates are close but not exact. Assunta, watching from the doorway: 'L'uno novembre.' Roberto: 'Come lo sai?' Assunta: 'Perché ero lì.'
resolution: Roberto goes to Bar Giulio and orders Carmela's favorite cake — which Giulio has made since 1996. When he brings it home, Carmela is not even slightly surprised. 'Sai che giorno è oggi?' Roberto: 'L'uno novembre.' 'Sì.' A pause. 'Me lo ricordo ogni anno.' Roberto: 'Non sempre in anticipo.' Carmela: 'No. Ma sempre.'
grammar_opportunity: Dates appear on every document Marco examines: the wedding photo label, the restaurant receipt, the card. The detective work of narrowing down a date from approximate to exact models date vocabulary in authentic context. The il/l'uno distinction for the first of the month is introduced naturally (l'uno novembre), and the year format appears on older documents. The lesson can use the document dates as exercises.
season_threads: ["Roberto and Carmela's marriage given warmth and texture", "Assunta's presence at the wedding introduced — she knows more family history than anyone"]
continuity_note: The anniversary cake was good. Roberto was technically on time. This will be referenced in a later episode as the year he was 'almost late.'

--------------------------------------------------

episode_id: E4.5
grammar_level: 4.5
cefr: A1
grammar_topic: Telling Time
vocab_focus: Sono le + number, è l'una, è mezzogiorno, è mezzanotte, e un quarto, e mezza, meno un quarto, meno dieci, di mattina / di pomeriggio / di sera, a che ora?, alle + time, verso le + time, il 24-hour clock (le venti, le quindici)
title: Gli orari
hook: The building elevator has a new rule: maintenance window from 8 to 10. Nobody agrees on what that means.
setting: Building hallway (multiple encounters at different times), Bar Giulio, Ferrero kitchen. A weekday.
featured_characters: ['Roberto Ferrero', 'Riccardo Mancini', 'Marco Ferrero', 'Signora Brambilla', 'Carmela Ferrero']
conflict: The elevator maintenance company says the elevator will be unavailable 'dalle otto alle dieci.' Roberto reads this as 8am–10am. Riccardo reads it as possibly 8pm–10pm (the company did not specify). Marco reads it as 20:00–22:00 in 24-hour time. Signora Brambilla has a doctor's appointment at 'le nove e mezza' and is on the third floor. The four of them debate time-telling in the hallway with increasing urgency: 'Sono le otto e venti — è già oltre le otto?' 'Sono le otto e venti di mattina o di sera?' 'Il tecnico ha detto alle venti o alle otto?'
resolution: The maintenance window is 8am–10am. Signora Brambilla misses it by ten minutes because Riccardo held the elevator door open while re-reading the notice. She makes her appointment. The maintenance man, leaving at ten o'clock exactly, says: 'Sono le dieci. Ho finito.' Roberto: 'Finalmente.' Riccardo, checking his phone: 'Sono le dieci e tre minuti.' Roberto: 'Tre minuti. L'avvocato conta i minuti.' Riccardo: 'Sempre.'
grammar_opportunity: The time-telling episode provides high-density repetition of clock time in multiple formats: sono le otto (on the hour), le nove e mezza (half past), le dieci meno un quarto (quarter to), le venti in 24-hour format. The ambiguity between 8am and 8pm drives the plot, making the distinction between di mattina and di sera narratively meaningful. The lesson can present the full clock vocabulary using the episode's timeline.
season_threads: ["Riccardo's pedantry established as a recurring comic trait", "Signora Brambilla's vulnerability (she needs the elevator) given human texture"]
continuity_note: The elevator works. Signora Brambilla made her appointment. Riccardo has added 'always specify AM/PM' to his mental list of things this building's residents do wrong.

--------------------------------------------------

episode_id: E5.1
grammar_level: 5.1
cefr: A1+
grammar_topic: Vocabulary: Daily Routine
vocab_focus: Svegliarsi, alzarsi, fare colazione, lavarsi, vestirsi, uscire, tornare a casa, pranzare, fare la spesa, cucinare, cenare, andare a letto; la mattina, il pomeriggio, la sera, ogni giorno, di solito, sempre, mai
title: La routine
hook: A week of parallel daily routines in the building reveals everything about who these people actually are.
setting: Both apartments, Bar Giulio, the stairwell, the courtyard. Monday through Friday.
featured_characters: ['Roberto Ferrero', 'Carmela Ferrero', 'Marco Ferrero', 'Assunta Ferrero', 'Riccardo Mancini', 'Paola Mancini']
conflict: The episode follows one full working week in the building, told in parallel. Roberto gets up at 6:15 every day. Carmela leaves at 7:30. Marco 'leaves for work' at 8:15 and reappears inside the building at 8:22. Assunta does not appear until 9:30, when she sits at the window with coffee. Riccardo leaves at 7:45 in a suit, always. Paola makes two coffees each morning — one for herself, one she pours down the sink because Riccardo is already gone. The episode's dramatic center is that second poured-away coffee, repeated Tuesday through Friday.
resolution: On Friday evening, Carmela finds Paola sitting alone at the courtyard table. She sits beside her without asking permission. 'Come va, davvero?' Paola takes a moment: 'È complicato.' Carmela nods. They sit in the autumn air for twenty minutes, saying nothing else. The parallel routine of two women who are each, in different ways, doing more than they're seen for.
grammar_opportunity: Daily routine vocabulary appears in every scene as the narrative describes what each person does: Roberto si sveglia alle sei e un quarto, fa colazione, legge. Carmela si alza, prepara i figli (notionally), esce. Marco finge di uscire. The vocabulary is introduced through parallel structure — the same verbs used for different people — which reinforces retention through variation. Time expressions (ogni mattina, di solito, sempre, mai) appear with high frequency as qualifiers.
season_threads: ["Paola's domestic isolation made visual and recurring through the coffee image", 'Carmela-Paola friendship reaches its first moment of genuine depth']
continuity_note: The Friday evening courtyard conversation happened. Neither woman mentioned it to her husband. Paola slept better that night.

--------------------------------------------------

episode_id: E5.2
grammar_level: 5.2
cefr: A1+
grammar_topic: Vocabulary: Hobbies & Free Time
vocab_focus: Giocare a calcio/carte/scacchi, leggere, correre, nuotare, disegnare, dipingere, suonare la chitarra/il piano, cucinare, guardare la TV, andare al cinema, fare sport, il passatempo, il tempo libero, il fine settimana, cosa fai nel tempo libero?
title: L'aperitivo
hook: The building's first shared social event is awkward, then warm, then surprisingly honest.
setting: Building courtyard, Bar Giulio (for supplies). A Saturday evening.
featured_characters: ['All main cast', 'Signora Brambilla']
conflict: Giulia organizes a building aperitivo — Aperol, prosecco, snacks from Bar Giulio, a handwritten invitation under every door. The first twenty minutes are rigid: both families stand on opposite sides of the green table. Signora Brambilla arrives immediately and without hesitation, sits directly in the middle. She asks everyone, in turn, what they do on weekends. This forces everyone to respond: Roberto goes to the football. Carmela reads and walks. Marco 'plays on the computer.' Assunta plays cards. Riccardo runs. Paola draws — 'Disegno ancora, sì' — which surprises everyone including herself to say aloud. Lorenzo arrives late with a guitar.
resolution: Giulia looks at Lorenzo when he arrives with the guitar and looks away. By 9pm, both families are still there. The prosecco is finished. Roberto and Riccardo are discussing Juventus. Carmela and Paola are talking about something else entirely. Assunta has played two card games with Signora Brambilla, which she appears to have won. Lorenzo plays one song on the guitar. Nobody asks him to stop.
grammar_opportunity: Hobby vocabulary is introduced through the direct-question format: 'Cosa fai nel fine settimana?' requires a response with a hobby verb. Giocare a (sport/games), suonare (instrument), fare (activity), andare a (place) all appear in natural rotation. The diversity of characters ensures a wide range: giocare a calcio, leggere romanzi, disegnare, suonare la chitarra, giocare a carte, correre al parco. The lesson can present the vocabulary grouped by verb pattern (giocare a, fare, suonare).
season_threads: ["Paola's drawing/architecture interest reestablished — direct setup for Milan job arc", 'Giulia-Lorenzo first charged eye contact in a group setting', 'Aperitivo established as a recurring building tradition']
continuity_note: Lorenzo was added to the group chat. His message 'grazie per l'invito' received seven heart reactions. Roberto's was one of them, by mistake. He has not addressed this.

--------------------------------------------------

episode_id: E5
grammar_level: 5
cefr: A1+
grammar_topic: Regular Verbs — Present Tense Overview
vocab_focus: Overview of -are, -ere, -ire conjugation patterns in present tense; when Italian uses the present tense (habitual action, current action, near future); the three conjugation groups and their endings: -o, -i, -a, -iamo, -ate/-ete/-ite, -ano/-ono
title: Un giorno normale
hook: Marco tries to write down everything he does in a day — and realizes how complicated a 'normal' day actually is.
setting: Apartment 3B (Marco's secret office), Ferrero kitchen, building stairwell. A weekday.
featured_characters: ['Marco Ferrero', 'Giulia Ferrero', 'Assunta Ferrero']
conflict: Giulia, visiting for the week, challenges Marco: describe your day in Italian — every single thing you do, from waking up to sleeping. Marco begins writing. He quickly discovers that his day requires verbs from all three conjugation groups: si sveglia, legge le email, scrive codice, parte per '3B', lavora, mangia, capisce un problema, finisce tardi. Every verb is a choice between -are, -ere, -ire. He keeps second-guessing himself. 'Scrivo o scrivere? Capisco o capisce?' Giulia, who studies linguistics, supervises.
resolution: By the end of the day, Marco has a complete diary of his day in Italian. It is one page long. Every verb is conjugated correctly — though he had to check three times. Assunta reads it when he leaves it on the table and says: 'Una vita normale.' Marco: 'Lo è?' Assunta: 'Di solito sì. Tranne il segreto.' She folds the paper neatly and puts it back where she found it.
grammar_opportunity: The diary format systematically introduces all three conjugation groups in parallel: Marco compares 'parlo' (-are), 'prendo' (-ere), 'finisco' (-ire) for the same conceptual slot. The overview episode's grammar lesson can present the three conjugation tables side-by-side, using Marco's diary as the anchor example. The episode provides a complete set of -are, -ere, -ire verbs in first-person singular context, which is the most useful starting point for learners.
season_threads: ["Marco's double life made concrete as a daily routine", 'The diary becomes a recurring device — he continues writing it']
continuity_note: Marco's diary exists. He keeps it in a notebook in Apartment 3B. Assunta has read it at least twice.

--------------------------------------------------

episode_id: E5.3
grammar_level: 5.3
cefr: A1+
grammar_topic: Uses of the Present Tense
vocab_focus: Present tense for habitual actions (ogni giorno mangio), current actions (in questo momento lavoro), general truths (il caffè è amaro), near future (domani parto), ongoing states (abito a Torino); contrast with English progressive vs. simple
title: Nel momento presente
hook: A surprise phone call from Roberto's brother in Palermo puts everyone in the same room at the same time.
setting: Ferrero kitchen (the phone call, on speaker), building courtyard. A Sunday afternoon.
featured_characters: ['Roberto Ferrero', 'Carmela Ferrero', 'Marco Ferrero', 'Assunta Ferrero']
conflict: Roberto's brother Aldo calls from Palermo, on speaker, ostensibly to discuss the building situation but really to interrogate Marco about his job and Giulia about her boyfriend. Since Giulia is not home, Marco gets double the questions. Every question requires a present tense answer: 'Cosa fai adesso?' (habitual: lavoro nell'informatica); 'Stai lavorando in questo momento?' (current: sto lavorando, sì); 'Abiti ancora con i tuoi?' (ongoing state: abito a Torino); 'Vieni a Palermo a Natale?' (near future: vengo, sì). Marco navigates all four uses in the space of ten minutes.
resolution: After the call, Roberto says: 'Aldo vuole sapere tutto.' Marco: 'Sì, ma adesso lo sa.' Roberto looks at him for a moment: 'Cosa sa, esattamente?' Marco: 'Quello che gli ho detto.' Roberto: 'E quello che non gli hai detto?' A pause. Marco: 'Non gliel'ho detto.' Roberto nods. He goes back to his paper. Marco stays at the table longer than he needed to.
grammar_opportunity: The phone call scene provides four distinct uses of the present tense in rapid alternation. The grammar lesson can identify each use by type using the questions and answers as examples: habitual (ogni settimana lavoro), current moment (in questo momento sto aspettando una response), ongoing state (abito a Torino da ventidue anni), near future (domani finisco il modulo). The contrast with English — where these would require four different tenses or forms — is worth making explicit.
season_threads: ["Roberto's brother Aldo established as an off-screen pressure point", 'The conversation ends with Marco and Roberto almost having the real conversation — but not yet']
continuity_note: Aldo will call again. He always does. Marco noted that his father did not press further — which is either trust or avoidance, and he is not sure which.

--------------------------------------------------

episode_id: E5.4
grammar_level: 5.4
cefr: A1+
grammar_topic: -are Verbs
vocab_focus: First conjugation: parlare, lavorare, studiare, abitare, mangiare, ascoltare, guardare, aspettare, portare, cercare, trovare, arrivare, usare, amare, camminare, comprare, chiamare — full present tense conjugation patterns
title: Marco lavora
hook: Giulia confronts Marco about his fake commute — and the truth comes out in -are verbs.
setting: Apartment 3B, then Ferrero kitchen. A weekday morning.
featured_characters: ['Marco Ferrero', 'Giulia Ferrero', 'Assunta Ferrero']
conflict: Giulia has been watching Marco's morning routine for three days. He leaves at 8:15, walks to the end of the street, comes back at 8:22. Today she follows him. He goes up to Apartment 3B. She knocks. He opens the door. She walks in, looks at the two monitors, the sticky notes, the empty coffee cups. 'Dove lavori, Marco? Davvero.' He shows her the app: 'Lavoro qui. Lavoro su questo. Cerco di costruire qualcosa.' She sits down. They talk. She asks, slowly: 'Parli con qualcuno? Aspetti qualcosa? Mangi qui?' He answers each one. Every answer is a -are verb.
resolution: At the end of the conversation, Giulia says: 'Devi parlare con papà.' Marco: 'Lo so.' Giulia: 'Aspetti il momento giusto?' Marco: 'Aspetto di avere qualcosa da mostrargli.' A pause. Giulia: 'Hai due settimane.' She means it. He does not argue. Assunta brings coffee at 4pm as if she expected to find them both there.
grammar_opportunity: -are verbs are the episode's syntactic texture. The confrontation dialogue requires every person and number of the conjugation: Giulia parla (3s), tu lavori (2s), io cerco (1s), aspetto (1s), mangi (2s), lavoriamo (1p in the final scene). The second-person singular — where the learner most often gets stuck — appears in every question Giulia asks. The lesson can present the full -are conjugation table with the episode's verbs as examples for each slot.
season_threads: ["Giulia's two-week deadline established — pressure on Marco to tell Roberto", "Apartment 3B fully established as Marco's real office"]
continuity_note: The two-week deadline is set. Giulia has not told Carmela. Marco is working on the app with renewed urgency. Assunta knows.

--------------------------------------------------

episode_id: E5.5
grammar_level: 5.5
cefr: A1+
grammar_topic: The Preposition a
vocab_focus: A + city (vado a Roma, sono a Torino); a + location (a casa, a scuola, al lavoro, al bar); andare a + infinitive (vado a mangiare); a + time (alle tre, a mezzogiorno); articulated forms: al, allo, alla, all', ai, agli, alle; a vs. in
title: Paola va a Milano
hook: Paola takes the first train to Milan — and comes back a slightly different person.
setting: Torino Porta Susa train station, Milan (referenced), Ferrero stairwell. A Wednesday.
featured_characters: ['Paola Mancini', 'Carmela Ferrero', 'Lorenzo Mancini']
conflict: Paola announces at breakfast that she is going to Milan for the day — 'per lavoro,' vaguely. Riccardo does not look up from his phone. Lorenzo says 'buon viaggio.' She takes the 8:40 to Milano Centrale. She meets a former colleague who now runs an architecture firm. They have lunch. The firm is looking for a senior designer. She says nothing definite. She returns on the 19:15. When she gets home, Riccardo is on a call. She stands at the kitchen window for ten minutes.
resolution: Carmela runs into Paola on the stairs, still in her coat. 'Dove sei stata, Paola?' 'A Milano. Per un incontro.' 'Come è andato?' A pause. 'Bene. Molto bene.' Carmela says nothing more. She invites her for tea. Paola follows her upstairs without discussing it further.
grammar_opportunity: The preposition a dominates: vado a Milano, sono a Torino, torno a casa, arrivo alla stazione, vado al lavoro, all'incontro, alle otto e quaranta. The episode's movement — from Torino to Milan and back — creates a natural a + city context. Andare a + infinitive also appears: vado a incontrare una collega, vado a mangiare. The a vs. in contrast is modeled: in treno, in città, in ufficio vs. a Milano, a pranzo, a casa. The lesson can map the preposition usage onto Paola's journey.
season_threads: ['Milan job arc formally seeded', "Riccardo's emotional absence made concrete", "Carmela's role as Paola's confidante deepens"]
continuity_note: Paola has the colleague's business card. She has not told Riccardo what the meeting was about. The card is in her coat pocket.

--------------------------------------------------

episode_id: E5.6
grammar_level: 5.6
cefr: A1+
grammar_topic: -ere Verbs
vocab_focus: Second conjugation: leggere, scrivere, vedere, capire (used as -ere here), rispondere, ricevere, chiudere, aprire, credere, prendere, mettere, chiedere, vendere, vivere, correre — full present tense conjugation patterns
title: Lorenzo legge
hook: Lorenzo downloads Marco's app, writes three pages of notes, and slips them under a door.
setting: Lorenzo's desk (late evening), Bar Giulio, Apartment 3B. An evening into the next morning.
featured_characters: ['Lorenzo Mancini', 'Marco Ferrero', 'Giulia Ferrero']
conflict: Lorenzo, working late on architectural drawings, sees a notification: an app update. He opens it — it is Marco's app. He recognizes the design logic from a sketch he glimpsed in Marco's notebook at the aperitivo. He uses the app for an hour. He reads the interface carefully. He takes notes: what works, what he does not understand, what an architect who thinks spatially would change. He writes three pages. He does not message Marco directly — he slips the pages under Apartment 3B's door.
resolution: Marco finds them the next morning. He reads them once, then again. They are the most useful feedback he has received from anyone. He goes downstairs and knocks on the Mancini door for the first time voluntarily. Lorenzo opens it. Marco says: 'Hai ragione su tutto.' Lorenzo says: 'Lo so. Vuoi un caffè?'
grammar_opportunity: -ere verbs carry the entire narrative: Lorenzo legge il documento, scrive le note, vede il problema, risponde con un gesto (the three pages), riceve una visita, apre la porta. Marco riceve le pagine, le rilegge, chiude il computer, scende le scale. The lesson presents the full -ere conjugation pattern with the episode's verbs mapped to it. The contrast with -are verbs (Marco lavora vs. Marco scrive) helps consolidate both patterns together.
season_threads: ['Marco-Lorenzo friendship properly established', 'Lorenzo now has information about the app — strategic positioning for later']
continuity_note: Marco and Lorenzo had coffee. They talked for two hours. Neither told their parents.

--------------------------------------------------

episode_id: E5.7
grammar_level: 5.7
cefr: A1+
grammar_topic: -ire Verbs
vocab_focus: Third conjugation: sentire, dormire, partire, aprire, offrire, coprire (standard -ire); capire, finire, preferire, costruire, pulire, spedire, guarire (group II -isc- verbs); full conjugation patterns for both groups
title: Le tre di notte
hook: Three people who cannot sleep end up in Assunta's kitchen at 3am.
setting: Building hallway (3:17am), Assunta's kitchen, building courtyard at dawn. Night into early morning.
featured_characters: ['Assunta Ferrero', 'Marco Ferrero', 'Paola Mancini']
conflict: It is 3:17am. Assunta is in the hallway in her dressing gown, apparently checking the water heater. Marco, who has been coding in 3B all night, comes down the stairs. They find each other in the dark. Then — footsteps from below — Paola appears at the bottom of the stairwell, also awake. Three people who cannot sleep, for three different reasons. They end up in Assunta's kitchen. Nobody explains why they are awake.
resolution: Assunta makes chamomile tea. They sit. After a long silence, Paola says she has been 'sentendo qualcosa di nuovo ultimamente.' Marco says he 'dorme male da mesi.' Assunta says she 'non dorme bene da trent'anni' as if this is simply the weather. They sit until 4:30. In the morning, none of them mention it. But something has shifted between all three.
grammar_opportunity: -ire verbs structure every exchange: Dormi? Non dormo. Senti qualcosa? Sento molte cose. Capisci? Capisco. Finisci tardi di solito? Finisco quando finisco. The ISC- group distinction is modeled through the contrast between sentire (sento, senti, sente) and capire (capisco, capisci, capisce). The grammar lesson can present both conjugation tables side by side, with the 3am dialogue as worked examples for each verb and person.
season_threads: ["Assunta-Paola connection established — she becomes Paola's unexpected ally in later episodes", "Marco's physical toll from the double life made visible"]
continuity_note: All three know they were all awake. None has mentioned it to anyone else. Assunta's chamomile tea is in a blue tin on the second shelf.

--------------------------------------------------

episode_id: E5.8
grammar_level: 5.8
cefr: A1+
grammar_topic: -are and -ere Verbs with Multiple Meanings
vocab_focus: Verbs whose meaning shifts by context: lasciare (to leave/to let), passare (to pass/to spend time/to drop by), sentire (to hear/to feel/to smell), guardare (to look/to watch), prendere (to take/to catch/to have [food]), portare (to bring/to carry/to wear)
title: Cosa senti?
hook: A conversation across the building courtyard shows how the same verb can mean completely different things.
setting: Building courtyard, both kitchen windows (open). A warm afternoon.
featured_characters: ['Roberto Ferrero', 'Riccardo Mancini', 'Carmela Ferrero', 'Paola Mancini']
conflict: Roberto and Riccardo are both in the courtyard for once, working on separate things. A conversation starts across the green table and keeps going wrong because the same words keep meaning different things. Roberto says: 'Senti, Mancini.' Riccardo: 'Cosa sento?' Roberto: 'Ho detto senti come Ehi, ascolta, non come percepisci qualcosa.' Riccardo: 'Ah. Sento.' This happens repeatedly: 'Lasci fare a me' (let me handle it) vs. 'Lasci tutto sempre a me' (you leave everything to me). 'Passa da me domani' (come by my place) vs. 'Passa il tempo a lavorare' (he spends his time working).
resolution: By the end of the conversation, they have accomplished nothing practical but have accidentally had a discussion about what it means to 'leave' something in both senses — Riccardo lets the building go (in the legal sense) and Roberto lets his son grow up (in the emotional sense). Neither has said this directly. Carmela, listening from the kitchen window, closes it quietly. Paola, from the window below: 'Sentiva?' Carmela: 'Sentivo tutto.'
grammar_opportunity: The episode dramatizes the most practically important multiple-meaning verbs, creating memorable associations through the characters' misunderstandings. Each verb is used in at least two distinct senses within the same scene: prendere (prendo un caffè vs. prendi il treno delle otto), portare (porta il documento vs. porta una giacca blu), passare (passi da noi vs. passa troppo tempo in ufficio). The lesson can present each verb with its key meanings as a vocabulary cluster.
season_threads: ['Roberto-Riccardo relationship: accidental emotional honesty through verbal confusion', 'Carmela as witness figure — she hears and remembers']
continuity_note: The courtyard conversation happened. Nothing was decided. Both men returned to their respective tasks. Roberto is thinking about what he said. Riccardo is not yet.

--------------------------------------------------
`;

fs.writeFileSync('raw_data_1.txt', rawData);
