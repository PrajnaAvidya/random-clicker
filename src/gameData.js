import Big from "big.js";

export default {
    buildings: [
        // cursor
        { name: 0, baseCost: Big(15), baseCps: Big(0.1) },

        // grandma
        { name: 1, baseCost: Big(100), baseCps: Big(1) },

        // farm
        { name: 2, baseCost: Big(1100), baseCps: Big(8) },

        // mine
        { name: 3, baseCost: Big(12000), baseCps: Big(47) },

        // factory
        { name: 4, baseCost: Big(130000), baseCps: Big(260) },

        // bank
        { name: 5, baseCost: Big(1.4E6), baseCps: Big(1400) },

        // temple
        { name: 6, baseCost: Big(20E6), baseCps: Big(7800) },

        // wizard tower
        { name: 7, baseCost: Big(330E6), baseCps: Big(44000) },

        // shipment
        { name: 8, baseCost: Big(5.1E9), baseCps: Big(260000) },

        // alchemy lab
        { name: 9, baseCost: Big(75E9), baseCps: Big(1.6E6) },

        // portal
        { name: 10, baseCost: Big(1E12), baseCps: Big(10E6) },

        // time machine
        { name: 11, baseCost: Big(14E12), baseCps: Big(65E6) },

        // antimatter condenser
        { name: 12, baseCost: Big(170E12), baseCps: Big(430E6) },

        // prism
        { name: 13, baseCost: Big(2.1E15), baseCps: Big(2.9E12) },
    ],

    buildingUpgradeNeeds: [
        // currency type
        [1, 1, 10, 20, 40, 80, 120, 160, 200, 240, 280, 320],

        // everything else
        [1, 5, 25, 50, 100, 150, 200, 250],
    ],

    buildingUpgradeAmounts: [
        // currency type
        ["m2", "m2", "m2", "a0.1", "a0.5", "a5", "a50", "a500", "a5000", "a50000", "a500000", "a5000000"],

        // everything else
        ["m2", "m2", "m2", "m2", "m2", "m2", "m2", "m2"],
    ],

    clickingUpgrades: [
        { needed: Big(1000), cost: Big(50000), multiplier: 1.01 },
        { needed: Big(100000), cost: Big(5E6), multiplier: 1.01 },
        { needed: Big(10E6), cost: Big(500E6), multiplier: 1.01 },
        { needed: Big(1E9), cost: Big(50E9), multiplier: 1.01 },
        { needed: Big(100E9), cost: Big(5E12), multiplier: 1.01 },
        { needed: Big(10E12), cost: Big(500E12), multiplier: 1.01 },
        { needed: Big(1E15), cost: Big(50E15), multiplier: 1.01 },
        { needed: Big(100E15), cost: Big(5E18), multiplier: 1.01 },
        { needed: Big(10E18), cost: Big(500E18), multiplier: 1.01 },
    ],

    tierTwoTypes: [

    ],

    buildingUpgradeCosts: [
        { type: 0, costs: [100, 500, 10000, 100000, 10E6, 100E6, 1E9, 10E9, 10E12, 100E12, 1E15, 10E15] },

        { type: 1, costs: [1000, 5000, 50000, 5E6, 500E6, 50E9, 50E12, 50E15] },

        { type: 2, costs: [11000, 55000, 550000, 55E6, 5.5E9, 550E9, 550E12, 550E15] },

        { type: 3, costs: [120000, 600000, 6E6, 600E6, 60E9, 6E12, 6E15, 6E18] },

        { type: 4, costs: [1.3E6, 6.5E6, 65E6, 6.5E9, 650E9, 65E12, 65E15, 65E18] },

        { type: 5, costs: [14E6, 70E6, 700E6, 70E9, 7E12, 700E12, 700E15, 700E18] },

        { type: 6, costs: [200E6, 1E9, 10E9, 1E12, 100E12, 10E15, 10E18, 10E21] },

        { type: 7, costs: [3.3E9, 16.5E9, 165E9, 16.5E12, 1.65E15, 165E15, 165E18, 165E21] },

        { type: 8, costs: [51E9, 255E9, 2.55E12, 255E12, 25.5E15, 2.55E18, 2.5521, 2.55E24] },

        { type: 9, costs: [750E9, 3.75E12, 37.5E12, 3.75E15, 375E15, 37.5E18, 37.5E21, 37.5E24] },

        { type: 10, costs: [10E12, 50E12, 500E12, 50E15, 5E18, 500E18, 500E21, 500E24] },

        { type: 11, costs: [140E12, 700E12, 7E15, 700E15, 70E18, 7E21, 7E24, 7E27] },

        { type: 12, costs: [1.7E15, 8.5E15, 85E15, 8.5E18, 850E18, 85E21, 85E24, 85E27] },

        { type: 13, costs: [21E15, 105E15, 1.05E18, 105E18, 10.5E21, 1.05E24, 1.05E27, 1.05E30] },
    ],

    buildingAchivements: [
        { type: 0, total: Big(1) },
        { type: 0, total: Big(2) },

        { type: 1, total: Big(1) },
        { type: 1, total: Big(50) }

        // TODO more
    ],

    productionUpgrades: [
        { needed: Big(50000), cost: Big(999999), multiplier: 1.01 },
        { needed: Big(250000), cost: Big(5E6), multiplier: 1.01 },
        { needed: Big(500000), cost: Big(10E6), multiplier: 1.01 },
        { needed: Big(2.5E6), cost: Big(50E6), multiplier: 1.01 },
        { needed: Big(5E6), cost: Big(100E6), multiplier: 1.01 },
        { needed: Big(25E6), cost: Big(500E6), multiplier: 1.02 },
        { needed: Big(50E6), cost: Big(1E9), multiplier: 1.02 },
        { needed: Big(250E6), cost: Big(5E9), multiplier: 1.02 },
        { needed: Big(500E6), cost: Big(10E9), multiplier: 1.02 },
        { needed: Big(2.5E9), cost: Big(50E9), multiplier: 1.02 },
        // TODO 4% etc
    ],

    productionAchievements: [
        // total
        { total: Big(1) },
        { total: Big(1000) },

        // cps
        { cps: Big(1) },
        { cps: Big(10) },

        // clicking
        { clicks: Big(10000) },
        { clicks: Big(100000) },

        // TODO more
    ],

    currencies: ["Baklava", "Biscotti", "Biscuit", "Cake", "Cannoli", "Cracker", "Crisp", "Croissant", "Donut", "Éclair", "Empanada", "Gulab Jamun", "Gingerbread", "Knish", "Macaron", "Macaroon", "Pastry", "Pie", "Pretzel", "Samosa", "Shortbread", "Snickerdoodle", "Stroopwafel", "Strudel", "Wafer"],

    buildingNames: ["Abbey", "A-frame", "Aircraft Hangar", "Airport Terminal", "Amphitheater", "Apartment Building", "Aqueduct", "Arch", "Arena", "Armory", "Assembly Hall", "Barn", "Barracks", "Beach House", "Boathouse", "Boarding House", "Bowling Alley", "Bridge", "Brownstone", "Bungalow", "Bunkhouse", "Bunker", "Cabana", "Cabin", "Capitol", "Carport", "Castle", "Catacomb", "Cathedral", "Chalet", "Chapel", "Chateau", "Church", "Cinema", "City Hall", "Clubhouse", "College", "Compound", "Concert Hall", "Condominium", "Conservatory", "Cottage", "Courthouse", "Crypt", "Depot", "Detached House", "Dock", "Dome", "Dormitory", "Double Wide", "Duplex", "Dwelling", "Embassy", "Exposition Hall", "Factory", "Farm", "Farmhouse", "Ferry Slip", "Ferry Terminal", "Firehouse", "Fire Station", "Folly", "Forge", "Fort", "Fortress", "Foundry", "Gallery", "Garage", "Gas Station", "Gazebo", "Geodesic Dome", "Granary", "Greenhouse", "Gym", "Gymnasium", "Hall", "Hangar", "Haunted House", "Headquarters", "High-rise", "Home", "Hospital", "Hostel", "Hotel", "Hot House", "House", "Houseboat", "Housing Project", "Hunting Lodge", "Hut", "Igloo", "Jail", "Kiosk", "Laboratory", "Lean-to", "Library", "Lighthouse", "Lodge", "Log Cabin", "Longhouse", "Mall", "Manor", "Manse", "Mansion", "Marina", "Market", "Mausoleum", "Meeting Hall", "Mill", "Minaret", "Mobile Home", "Monastery", "Monument", "Mosque", "Motel", "Museum", "Nuclear Power Plant", "Nursing Home", "Observatory", "Office Building", "Opera House", "Outbuilding", "Outhouse", "Pagoda", "Palace", "Parking Garage", "Parliament", "Pavilion", "Plant", "Playhouse", "Police Station", "Pool House", "Post Office", "Power Plant", "Prefab Building", "Prison", "Pump House", "Pyramid", "Quonset Hut", "Railway Station", "Ranch", "Rectory", "Refinery", "Residence", "Restaurant", "Roller Rink", "Roundhouse", "Rowhouse", "School", "Shack", "Shed", "Shelter", "Shopping Center", "Shopping Mall", "Shrine", "Silo", "Skating Rink", "Skyscraper", "Skyway", "Smokestack", "Spire", "Split-level House", "Stable", "Stadium", "State House", "Station", "Steeple", "Store", "Storehouse", "Strip Mall", "Structure", "Studio", "Supermarket", "Symphony", "Synagogue", "Temple", "Tenement", "Tent", "Terminal", "Theater", "Tipi", "Toll House", "Tomb", "Tower", "Townhouse", "Treehouse", "Triplex", "Tudor House", "University", "Vault", "Vicarage", "Villa", "Warehouse", "Watermill", "Workshop", "Yurt"],

    adjectives: ["Aback", "Abaft", "Abandoned", "Abashed", "Aberrant", "Abhorrent", "Abiding", "Abject", "Ablaze", "Able", "Abnormal", "Aboard", "Aboriginal", "Abortive", "Abounding", "Abrasive", "Abrupt", "Absent", "Absolute", "Absorbed", "Absorbing", "Abstracted", "Absurd", "Abundant", "Abusive", "Academic", "Acceptable", "Accessible", "Accidental", "Acclaimed", "Accomplished", "Accurate", "Aching", "Acid", "Acidic", "Acoustic", "Acrid", "Acrobatic", "Active", "Actual", "Actually", "Adamant", "Adaptable", "Addicted", "Adept", "Adhesive", "Adhoc", "Adjoining", "Admirable", "Admired", "Adolescent", "Adorable", "Adored", "Advanced", "Adventurous", "Affectionate", "Afraid", "Aged", "Aggravating", "Aggressive", "Agile", "Agitated", "Agonizing", "Agreeable", "Ahead", "Ajar", "Alarmed", "Alarming", "Alcoholic", "Alert", "Alienated", "Alike", "Alive", "All", "Alleged", "Alluring", "Aloof", "Altruistic", "Amazing", "Ambiguous", "Ambitious", "Amiable", "Ample", "Amuck", "Amused", "Amusing", "Anchored", "Ancient", "Angelic", "Angry", "Anguished", "Animated", "Annoyed", "Annoying", "Annual", "Another", "Antique", "Antsy", "Anxious", "Any", "Apathetic", "Appetizing", "Apprehensive", "Appropriate", "Apt", "Aquatic", "Arctic", "Arid", "Aromatic", "Arrogant", "Artistic", "Ashamed", "Aspiring", "Assorted", "Assured", "Astonishing", "Athletic", "Attached", "Attentive", "Attractive", "Auspicious", "Austere", "Authentic", "Authorized", "Automatic", "Available", "Avaricious", "Average", "Awake", "Aware", "Awesome", "Awful", "Awkward", "Axiomatic", "Babyish", "Back", "Bad", "Baggy", "Barbarous", "Bare", "Barren", "Bashful", "Basic", "Batty", "Bawdy", "Beautiful", "Beefy", "Befitting", "Belated", "Belligerent", "Beloved", "Beneficial", "Bent", "Berserk", "Best", "Better", "Bewildered", "Bewitched", "Big", "Big-Hearted", "Billowy", "Biodegradable", "Bite-Sized", "Biting", "Bitter", "Bizarre", "Black", "Black-And-White", "Bland", "Blank", "Blaring", "Bleak", "Blind", "Blissful", "Blond", "Bloody", "Blue", "Blue-Eyed", "Blushing", "Bogus", "Boiling", "Bold", "Bony", "Boorish", "Bored", "Boring", "Bossy", "Both", "Bouncy", "Boundless", "Bountiful", "Bowed", "Brainy", "Brash", "Brave", "Brawny", "Breakable", "Breezy", "Brief", "Bright", "Brilliant", "Brisk", "Broad", "Broken", "Bronze", "Brown", "Bruised", "Bubbly", "Bulky", "Bumpy", "Buoyant", "Burdensome", "Burly", "Bustling", "Busy", "Buttery", "Buzzing", "Cagey", "Calculating", "Callous", "Calm", "Candid", "Canine", "Capable", "Capital", "Capricious", "Carefree", "Careful", "Careless", "Caring", "Cautious", "Cavernous", "Ceaseless", "Celebrated", "Certain", "Changeable", "Charming", "Cheap", "Cheeky", "Cheerful", "Cheery", "Chemical", "Chief", "Childlike", "Chilly", "Chivalrous", "Chubby", "Chunky", "Circular", "Clammy", "Classic", "Classy", "Clean", "Clear", "Clear-Cut", "Clever", "Cloistered", "Close", "Closed", "Cloudy", "Clueless", "Clumsy", "Cluttered", "Coarse", "Coherent", "Cold", "Colorful", "Colorless", "Colossal", "Combative", "Comfortable", "Common", "Compassionate", "Competent", "Complete", "Complex", "Complicated", "Composed", "Concerned", "Concrete", "Condemned", "Condescending", "Confused", "Conscious", "Considerate", "Constant", "Contemplative", "Content", "Conventional", "Convincing", "Convoluted", "Cooing", "Cooked", "Cool", "Cooperative", "Coordinated", "Corny", "Corrupt", "Costly", "Courageous", "Courteous", "Cowardly", "Crabby", "Crafty", "Craven", "Crazy", "Creamy", "Creative", "Creepy", "Criminal", "Crisp", "Critical", "Crooked", "Crowded", "Cruel", "Crushing", "Cuddly", "Cultivated", "Cultured", "Cumbersome", "Curious", "Curly", "Curved", "Curvy", "Cut", "Cute", "Cylindrical", "Cynical", "Daffy", "Daily", "Damaged", "Damaging", "Damp", "Dangerous", "Dapper", "Daring", "Dark", "Darling", "Dashing", "Dazzling", "Dead", "Deadly", "Deadpan", "Deafening", "Dear", "Dearest", "Debonair", "Decayed", "Deceitful", "Decent", "Decimal", "Decisive", "Decorous", "Deep", "Deeply", "Defeated", "Defective", "Defenseless", "Defensive", "Defiant", "Deficient", "Definite", "Definitive", "Delayed", "Delectable", "Delicate", "Delicious", "Delightful", "Delirious", "Demanding", "Demonic", "Dense", "Dental", "Dependable", "Dependent", "Depraved", "Depressed", "Deranged", "Descriptive", "Deserted", "Despicable", "Detailed", "Determined", "Devilish", "Devoted", "Didactic", "Different", "Difficult", "Digital", "Dilapidated", "Diligent", "Dim", "Diminutive", "Dimpled", "Dimwitted", "Direct", "Direful", "Dirty", "Disagreeable", "Disastrous", "Discreet", "Discrete", "Disfigured", "Disguised", "Disgusted", "Disgusting", "Dishonest", "Disillusioned", "Disloyal", "Dismal", "Dispensable", "Distant", "Distinct", "Distorted", "Distraught", "Distressed", "Disturbed", "Divergent", "Dizzy", "Domineering", "Dopey", "Doting", "Double", "Doubtful", "Downright", "Drab", "Draconian", "Drafty", "Drained", "Dramatic", "Dreary", "Droopy", "Drunk", "Dry", "Dual", "Dull", "Dusty", "Dutiful", "Dynamic", "Dysfunctional", "Each", "Eager", "Early", "Earnest", "Earsplitting", "Earthy", "Easy", "Easy-Going", "Eatable", "Economic", "Ecstatic", "Edible", "Educated", "Efficacious", "Efficient", "Eight", "Elaborate", "Elastic", "Elated", "Elderly", "Electric", "Elegant", "Elementary", "Elfin", "Elite", "Elliptical", "Emaciated", "Embarrassed", "Embellished", "Eminent", "Emotional", "Empty", "Enchanted", "Enchanting", "Encouraging", "Endurable", "Energetic", "Enlightened", "Enormous", "Enraged", "Entertaining", "Enthusiastic", "Entire", "Envious", "Equable", "Equal", "Equatorial", "Erect", "Erratic", "Essential", "Esteemed", "Ethereal", "Ethical", "Euphoric", "Evanescent", "Evasive", "Even", "Evergreen", "Everlasting", "Every", "Evil", "Exalted", "Exasperated", "Excellent", "Excitable", "Excited", "Exciting", "Exclusive", "Exemplary", "Exhausted", "Exhilarated", "Exotic", "Expensive", "Experienced", "Expert", "Extensive", "Extra-Large", "Extra-Small", "Extraneous", "Extroverted", "Exuberant", "Exultant", "Fabulous", "Faded", "Failing", "Faint", "Fair", "Faithful", "Fake", "Fallacious", "False", "Familiar", "Famous", "Fanatical", "Fancy", "Fantastic", "Far", "Far-Flung", "Far-Off", "Faraway", "Fascinated", "Fast", "Fat", "Fatal", "Fatherly", "Faulty", "Favorable", "Favorite", "Fearful", "Fearless", "Feeble", "Feigned", "Feisty", "Feline", "Female", "Feminine", "Fertile", "Festive", "Few", "Fickle", "Fierce", "Filthy", "Fine", "Finicky", "Finished", "Firm", "First", "Firsthand", "Fitting", "Five", "Fixed", "Flagrant", "Flaky", "Flamboyant", "Flashy", "Flat", "Flawed", "Flawless", "Flickering", "Flimsy", "Flippant", "Floppy", "Flowery", "Fluffy", "Flufy", "Fluid", "Flustered", "Fluttering", "Foamy", "Focused", "Fond", "Foolhardy", "Foolish", "Forceful", "Foregoing", "Forgetful", "Forked", "Formal", "Forsaken", "Forthright", "Fortunate", "Four", "Fragile", "Fragrant", "Frail", "Frank", "Frantic", "Frayed", "Free", "Freezing", "French", "Frequent", "Fresh", "Fretful", "Friendly", "Frightened", "Frightening", "Frigid", "Frilly", "Frivolous", "Frizzy", "Front", "Frosty", "Frothy", "Frozen", "Frugal", "Fruitful", "Frustrating", "Full", "Fumbling", "Functional", "Funny", "Furry", "Furtive", "Fussy", "Future", "Futuristic", "Fuzzy", "Gabby", "Gainful", "Gamy", "Gaping", "Gargantuan", "Garrulous", "Gaseous", "Gaudy", "General", "Generous", "Gentle", "Genuine", "Ghastly", "Giant", "Giddy", "Gifted", "Gigantic", "Giving", "Glamorous", "Glaring", "Glass", "Gleaming", "Gleeful", "Glib", "Glistening", "Glittering", "Gloomy", "Glorious", "Glossy", "Glum", "Godly", "Golden", "Good", "Good-Natured", "Goofy", "Gorgeous", "Graceful", "Gracious", "Grand", "Grandiose", "Granular", "Grateful", "Gratis", "Grave", "Gray", "Greasy", "Great", "Greedy", "Green", "Gregarious", "Grey", "Grieving", "Grim", "Grimy", "Gripping", "Grizzled", "Groovy", "Gross", "Grotesque", "Grouchy", "Grounded", "Growing", "Growling", "Grown", "Grubby", "Gruesome", "Grumpy", "Guarded", "Guiltless", "Guilty", "Gullible", "Gummy", "Gusty", "Guttural", "Habitual", "Hairy", "Half", "Hallowed", "Halting", "Handmade", "Handsome", "Handsomely", "Handy", "Hanging", "Hapless", "Happy", "Happy-Go-Lucky", "Hard", "Hard-To-Find", "Harebrained", "Harmful", "Harmless", "Harmonious", "Harsh", "Hasty", "Hateful", "Haunting", "Heady", "Healthy", "Heartbreaking", "Heartfelt", "Hearty", "Heavenly", "Heavy", "Hefty", "Hellish", "Helpful", "Helpless", "Hesitant", "Hidden", "Hideous", "High", "High-Level", "High-Pitched", "Highfalutin", "Hilarious", "Hissing", "Historical", "Hoarse", "Holistic", "Hollow", "Homeless", "Homely", "Honest", "Honorable", "Honored", "Hopeful", "Horrible", "Horrific", "Hospitable", "Hot", "Huge", "Hulking", "Humble", "Humdrum", "Humiliating", "Humming", "Humongous", "Humorous", "Hungry", "Hurried", "Hurt", "Hurtful", "Hushed", "Husky", "Hypnotic", "Hysterical", "Icky", "Icy", "Ideal", "Idealistic", "Identical", "Idiotic", "Idle", "Idolized", "Ignorant", "Ill", "Ill-Fated", "Ill-Informed", "Illegal", "Illiterate", "Illustrious", "Imaginary", "Imaginative", "Immaculate", "Immaterial", "Immediate", "Immense", "Imminent", "Impartial", "Impassioned", "Impeccable", "Imperfect", "Imperturbable", "Impish", "Impolite", "Important", "Imported", "Impossible", "Impractical", "Impressionable", "Impressive", "Improbable", "Impure", "Inborn", "Incandescent", "Incomparable", "Incompatible", "Incompetent", "Incomplete", "Inconclusive", "Inconsequential", "Incredible", "Indelible", "Indolent", "Industrious", "Inexpensive", "Inexperienced", "Infamous", "Infantile", "Infatuated", "Inferior", "Infinite", "Informal", "Innate", "Innocent", "Inquisitive", "Insecure", "Insidious", "Insignificant", "Insistent", "Instinctive", "Instructive", "Insubstantial", "Intelligent", "Intent", "Intentional", "Interesting", "Internal", "International", "Intrepid", "Intrigued", "Invincible", "Irate", "Ironclad", "Irresponsible", "Irritable", "Irritating", "Itchy", "Jaded", "Jagged", "Jam-Packed", "Jaunty", "Jazzy", "Jealous", "Jittery", "Jobless", "Joint", "Jolly", "Jovial", "Joyful", "Joyous", "Jubilant", "Judicious", "Juicy", "Jumbled", "Jumbo", "Jumpy", "Junior", "Juvenile", "Kaleidoscopic", "Kaput", "Keen", "Key", "Kind", "Kindhearted", "Kindly", "Klutzy", "Knobby", "Knotty", "Knowing", "Knowledgeable", "Known", "Kooky", "Kosher", "Labored", "Lackadaisical", "Lacking", "Lame", "Lamentable", "Languid", "Lanky", "Large", "Last", "Lasting", "Late", "Laughable", "Lavish", "Lawful", "Lazy", "Leading", "Leafy", "Lean", "Learned", "Left", "Legal", "Legitimate", "Lethal", "Level", "Lewd", "Light", "Lighthearted", "Likable", "Like", "Likeable", "Likely", "Limited", "Limp", "Limping", "Linear", "Lined", "Liquid", "Literate", "Little", "Live", "Lively", "Livid", "Living", "Loathsome", "Lone", "Lonely", "Long", "Long-Term", "Longing", "Loose", "Lopsided", "Lost", "Loud", "Loutish", "Lovable", "Lovely", "Loving", "Low", "Lowly", "Loyal", "Lucky", "Ludicrous", "Lumbering", "Luminous", "Lumpy", "Lush", "Lustrous", "Luxuriant", "Luxurious", "Lying", "Lyrical", "Macabre", "Macho", "Mad", "Maddening", "Made-Up", "Madly", "Magenta", "Magical", "Magnificent", "Majestic", "Major", "Makeshift", "Male", "Malicious", "Mammoth", "Mammouth", "Maniacal", "Many", "Marked", "Married", "Marvelous", "Masculine", "Massive", "Material", "Materialistic", "Mature", "Meager", "Mealy", "Mean", "Measly", "Meaty", "Medical", "Mediocre", "Medium", "Meek", "Melancholy", "Mellow", "Melodic", "Melted", "Memorable", "Menacing", "Merciful", "Mere", "Merry", "Messy", "Metallic", "Mighty", "Mild", "Military", "Milky", "Mindless", "Miniature", "Minor", "Minty", "Minute", "Miscreant", "Miserable", "Miserly", "Misguided", "Mistaken", "Misty", "Mixed", "Moaning", "Modern", "Modest", "Moist", "Moldy", "Momentous", "Monstrous", "Monthly", "Monumental", "Moody", "Moral", "Mortified", "Motherly", "Motionless", "Mountainous", "Muddled", "Muddy", "Muffled", "Multicolored", "Mundane", "Murky", "Mushy", "Musty", "Mute", "Muted", "Mysterious", "Naive", "Nappy", "Narrow", "Nasty", "Natural", "Naughty", "Nauseating", "Nautical", "Near", "Neat", "Nebulous", "Necessary", "Needless", "Needy", "Negative", "Neglected", "Negligible", "Neighboring", "Neighborly", "Nervous", "New", "Next", "Nice", "Nifty", "Nimble", "Nine", "Nippy", "Nocturnal", "Noiseless", "Noisy", "Nonchalant", "Nondescript", "Nonsensical", "Nonstop", "Normal", "Nostalgic", "Nosy", "Notable", "Noted", "Noteworthy", "Novel", "Noxious", "Null", "Numb", "Numberless", "Numerous", "Nutritious", "Nutty", "Oafish", "Obedient", "Obeisant", "Obese", "Oblivious", "Oblong", "Obnoxious", "Obscene", "Obsequious", "Observant", "Obsolete", "Obtainable", "Obvious", "Occasional", "Oceanic", "Odd", "Oddball", "Offbeat", "Offensive", "Official", "Oily", "Old", "Old-Fashioned", "Omniscient", "One", "Onerous", "Only", "Open", "Opposite", "Optimal", "Optimistic", "Opulent", "Orange", "Orderly", "Ordinary", "Organic", "Original", "Ornate", "Ornery", "Ossified", "Other", "Our", "Outgoing", "Outlandish", "Outlying", "Outrageous", "Outstanding", "Oval", "Overconfident", "Overcooked", "Overdue", "Overjoyed", "Overlooked", "Overrated", "Overt", "Overwrought", "Painful", "Painstaking", "Palatable", "Pale", "Paltry", "Panicky", "Panoramic", "Parallel", "Parched", "Parsimonious", "Partial", "Passionate", "Past", "Pastel", "Pastoral", "Pathetic", "Peaceful", "Penitent", "Peppery", "Perfect", "Perfumed", "Periodic", "Perky", "Permissible", "Perpetual", "Perplexed", "Personal", "Pertinent", "Pesky", "Pessimistic", "Petite", "Petty", "Phobic", "Phony", "Physical", "Picayune", "Piercing", "Pink", "Piquant", "Pitiful", "Placid", "Plain", "Plaintive", "Plant", "Plastic", "Plausible", "Playful", "Pleasant", "Pleased", "Pleasing", "Plucky", "Plump", "Plush", "Pointed", "Pointless", "Poised", "Polished", "Polite", "Political", "Pompous", "Poor", "Popular", "Portly", "Posh", "Positive", "Possessive", "Possible", "Potable", "Powerful", "Powerless", "Practical", "Precious", "Premium", "Present", "Prestigious", "Pretty", "Previous", "Pricey", "Prickly", "Primary", "Prime", "Pristine", "Private", "Prize", "Probable", "Productive", "Profitable", "Profuse", "Proper", "Protective", "Proud", "Prudent", "Psychedelic", "Psychotic", "Public", "Puffy", "Pumped", "Punctual", "Pungent", "Puny", "Pure", "Purple", "Purring", "Pushy", "Putrid", "Puzzled", "Puzzling", "Quack", "Quaint", "Qualified", "Quarrelsome", "Quarterly", "Queasy", "Querulous", "Questionable", "Quick", "Quick-Witted", "Quickest", "Quiet", "Quintessential", "Quirky", "Quixotic", "Quizzical", "Rabid", "Racial", "Radiant", "Ragged", "Rainy", "Rambunctious", "Rampant", "Rapid", "Rare", "Rash", "Raspy", "Ratty", "Raw", "Ready", "Real", "Realistic", "Reasonable", "Rebel", "Recent", "Receptive", "Reckless", "Recondite", "Rectangular", "Red", "Redundant", "Reflecting", "Reflective", "Regal", "Regular", "Reliable", "Relieved", "Remarkable", "Reminiscent", "Remorseful", "Remote", "Repentant", "Repulsive", "Required", "Resolute", "Resonant", "Respectful", "Responsible", "Responsive", "Revolving", "Rewarding", "Rhetorical", "Rich", "Right", "Righteous", "Rightful", "Rigid", "Ringed", "Ripe", "Ritzy", "Roasted", "Robust", "Romantic", "Roomy", "Rosy", "Rotating", "Rotten", "Rotund", "Rough", "Round", "Rowdy", "Royal", "Rubbery", "Ruddy", "Rude", "Rundown", "Runny", "Rural", "Rustic", "Rusty", "Ruthless", "Sable", "Sad", "Safe", "Salty", "Same", "Sandy", "Sane", "Sarcastic", "Sardonic", "Sassy", "Satisfied", "Satisfying", "Savory", "Scaly", "Scandalous", "Scant", "Scarce", "Scared", "Scary", "Scattered", "Scented", "Scholarly", "Scientific", "Scintillating", "Scornful", "Scratchy", "Scrawny", "Screeching", "Second", "Second-Hand", "Secondary", "Secret", "Secretive", "Sedate", "Seemly", "Selective", "Self-Assured", "Self-Reliant", "Selfish", "Sentimental", "Separate", "Serene", "Serious", "Serpentine", "Several", "Severe", "Shabby", "Shadowy", "Shady", "Shaggy", "Shaky", "Shallow", "Shameful", "Shameless", "Sharp", "Shimmering", "Shiny", "Shivering", "Shocked", "Shocking", "Shoddy", "Short", "Short-Term", "Showy", "Shrill", "Shut", "Shy", "Sick", "Silent", "Silky", "Silly", "Silver", "Similar", "Simple", "Simplistic", "Sincere", "Sinful", "Single", "Six", "Sizzling", "Skeletal", "Skillful", "Skinny", "Sleepy", "Slight", "Slim", "Slimy", "Slippery", "Sloppy", "Slow", "Slushy", "Small", "Smarmy", "Smart", "Smelly", "Smiling", "Smoggy", "Smooth", "Smug", "Snappy", "Snarling", "Sneaky", "Sniveling", "Snobbish", "Snoopy", "Snotty", "Sociable", "Soft", "Soggy", "Solid", "Somber", "Some", "Sophisticated", "Sordid", "Sore", "Sorrowful", "Soulful", "Soupy", "Sour", "Spanish", "Sparkling", "Sparse", "Special", "Specific", "Spectacular", "Speedy", "Spherical", "Spicy", "Spiffy", "Spiky", "Spirited", "Spiritual", "Spiteful", "Splendid", "Spooky", "Spotless", "Spotted", "Spotty", "Spry", "Spurious", "Squalid", "Square", "Squeaky", "Squealing", "Squeamish", "Squiggly", "Stable", "Staid", "Stained", "Staking", "Stale", "Standard", "Standing", "Starchy", "Stark", "Starry", "Statuesque", "Steadfast", "Steady", "Steel", "Steep", "Stereotyped", "Sticky", "Stiff", "Stimulating", "Stingy", "Stormy", "Stout", "Straight", "Strange", "Strict", "Strident", "Striking", "Striped", "Strong", "Studious", "Stunning", "Stupendous", "Stupid", "Sturdy", "Stylish", "Subdued", "Submissive", "Subsequent", "Substantial", "Subtle", "Suburban", "Successful", "Succinct", "Succulent", "Sudden", "Sugary", "Sulky", "Sunny", "Super", "Superb", "Superficial", "Superior", "Supportive", "Supreme", "Sure-Footed", "Surprised", "Suspicious", "Svelte", "Swanky", "Sweaty", "Sweet", "Sweltering", "Swift", "Sympathetic", "Symptomatic", "Synonymous", "Taboo", "Tacit", "Tacky", "Talented", "Talkative", "Tall", "Tame", "Tan", "Tangible", "Tangy", "Tart", "Tasteful", "Tasteless", "Tasty", "Tattered", "Taut", "Tawdry", "Tearful", "Tedious", "Teeming", "Teeny", "Teeny-Tiny", "Telling", "Temporary", "Tempting", "Ten", "Tender", "Tense", "Tenuous", "Tepid", "Terrible", "Terrific", "Tested", "Testy", "Thankful", "That", "Therapeutic", "These", "Thick", "Thin", "Thinkable", "Third", "Thirsty", "This", "Thorny", "Thorough", "Those", "Thoughtful", "Thoughtless", "Threadbare", "Threatening", "Three", "Thrifty", "Thundering", "Thunderous", "Tidy", "Tight", "Tightfisted", "Timely", "Tinted", "Tiny", "Tired", "Tiresome", "Toothsome", "Torn", "Torpid", "Total", "Tough", "Towering", "Tragic", "Trained", "Tranquil", "Trashy", "Traumatic", "Treasured", "Tremendous", "Triangular", "Tricky", "Trifling", "Trim", "Trite", "Trivial", "Troubled", "Truculent", "True", "Trusting", "Trustworthy", "Trusty", "Truthful", "Tubby", "Turbulent", "Twin", "Two", "Typical", "Ubiquitous", "Ugliest", "Ugly", "Ultimate", "Ultra", "Unable", "Unacceptable", "Unaccountable", "Unarmed", "Unaware", "Unbecoming", "Unbiased", "Uncomfortable", "Uncommon", "Unconscious", "Uncovered", "Understated", "Understood", "Undesirable", "Unequal", "Unequaled", "Uneven", "Unfinished", "Unfit", "Unfolded", "Unfortunate", "Unhappy", "Unhealthy", "Uniform", "Unimportant", "Uninterested", "Unique", "United", "Unkempt", "Unknown", "Unlawful", "Unlined", "Unlucky", "Unnatural", "Unpleasant", "Unrealistic", "Unripe", "Unruly", "Unselfish", "Unsightly", "Unsteady", "Unsuitable", "Unsung", "Untidy", "Untimely", "Untried", "Untrue", "Unused", "Unusual", "Unwelcome", "Unwieldy", "Unwilling", "Unwitting", "Unwritten", "Upbeat", "Uppity", "Upright", "Upset", "Uptight", "Urban", "Usable", "Used", "Useful", "Useless", "Utilized", "Utopian", "Utter", "Uttermost", "Vacant", "Vacuous", "Vagabond", "Vague", "Vain", "Valid", "Valuable", "Vapid", "Variable", "Various", "Vast", "Velvety", "Venerated", "Vengeful", "Venomous", "Verdant", "Verifiable", "Versed", "Vexed", "Vibrant", "Vicious", "Victorious", "Vigilant", "Vigorous", "Villainous", "Violent", "Violet", "Virtual", "Virtuous", "Visible", "Vital", "Vivacious", "Vivid", "Voiceless", "Volatile", "Voluminous", "Voracious", "Vulgar", "Wacky", "Waggish", "Waiting", "Wakeful", "Wan", "Wandering", "Wanting", "Warlike", "Warm", "Warmhearted", "Warped", "Wary", "Wasteful", "Watchful", "Waterlogged", "Watery", "Wavy", "Weak", "Wealthy", "Weary", "Webbed", "Wee", "Weekly", "Weepy", "Weighty", "Weird", "Welcome", "Well-Documented", "Well-Groomed", "Well-Informed", "Well-Lit", "Well-Made", "Well-Off", "Well-To-Do", "Well-Worn", "Wet", "Which", "Whimsical", "Whirlwind", "Whispered", "Whispering", "White", "Whole", "Wholesale", "Whopping", "Wicked", "Wide", "Wide-Eyed", "Wiggly", "Wild", "Willing", "Wilted", "Winding", "Windy", "Winged", "Wiry", "Wise", "Wistful", "Witty", "Wobbly", "Woebegone", "Woeful", "Womanly", "Wonderful", "Wooden", "Woozy", "Wordy", "Workable", "Worldly", "Worn", "Worried", "Worrisome", "Worse", "Worst", "Worthless", "Worthwhile", "Worthy", "Wrathful", "Wretched", "Writhing", "Wrong", "Wry", "Xenophobic", "Yawning", "Yearly", "Yellow", "Yellowish", "Yielding", "Young", "Youthful", "Yummy", "Zany", "Zealous", "Zesty", "Zigzag", "Zippy", "Zonked"],
}
