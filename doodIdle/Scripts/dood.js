//==========================================GLOBAL VARIABLES====================================
var screen; //variable that stores the current viewed page
var Pclass; //Player class variable
var battling = false; //battle status
var Mainloop; //The main game loop
var battloop; //The battle loop
var battlearea = 0; //The current area
var skillmindam = 0; //minimum damage done by seleceted skill
var skillmaxdam = 0; //maximum skill damage
var lose = false; //checks if player lost
var estatpoints = 0;
var Rebirth = false;


// Class stat total should be 20. Mana gain counts for 1 point.
// Base stat total is the sum of the Strength, Accuracy, Armor, and Reflexes stats.
// Stat modifiers should total 6(7 if no mana gain). 1 is normal growth, 2 is faster growth, and 0 is no growth. Higher numbers are allowed and will be accepted.
// Currently not in use: CritRate, abbrev(may delete).
// New variables may be added without affecting anything currently in place.

// Strength is maximum damage roll
// Accuracy is minimum damage roll and hit rate
// Armor is maxumum defense roll
// Reflexes is minimum defense roll and evasion rate

// Damage calculation is: attacker damage roll * (attacker damage roll / (attacker damage roll + defender defense roll))
// Hit chance is: attacker accuracy/defender reflexes

var classes = [
	{PHealth :	50,	PHealthMod :	1,	PStrength :	6,	PStrMod :	2,	PAccuracy :	3,	PAccMod :	1,	PArmor : 5,	PArmMod :	1,	PReflexes : 5,	PRefMod :	2, PMaxMana :	40,	PManagain :	1,	PManagainAK :	0,	PCritrate : 1,	Pgoldmult :	10,	Pdefname :	"Bob",		Pname :	"Adventurer",	abbrev :	"Adv",	FocusStats :	["StrengthPts", "ReflexesPts"],					AvoidedStat: [""]},
	{PHealth :	60,	PHealthMod :	1,	PStrength :	8,	PStrMod :	2,	PAccuracy :	1,	PAccMod :	2,	PArmor : 6,	PArmMod :	2,	PReflexes : 5,	PRefMod :	1, PMaxMana :	20,	PManagain : 0,	PManagainAK :	20,	PCritrate : 1,	Pgoldmult :	10,	Pdefname :	"Thognok",	Pname : "Barbarian",	abbrev :	"Bar",	FocusStats :	["StrengthPts", "AccuracyPts", "ArmorPts"],		AvoidedStat: [""]},
	{PHealth :	40,	PHealthMod :	1,	PStrength :	5,	PStrMod :	2,	PAccuracy :	5,	PAccMod :	2,	PArmor : 3,	PArmMod :	1,	PReflexes : 5,	PRefMod :	1, PMaxMana :	70,	PManagain : 2,	PManagainAK :	0,	PCritrate : 1,	Pgoldmult :	10,	Pdefname :	"Malkior",	Pname : "Mage",			abbrev :	"Mag",	FocusStats :	["StrengthPts", "AccuracyPts"],					AvoidedStat: [""]},
	{PHealth :	60,	PHealthMod :	1,	PStrength :	8,	PStrMod :	2,	PAccuracy : 1,	PAccMod :	1,	PArmor : 8,	PArmMod :	2,	PReflexes : 2,	PRefMod :	1, PMaxMana :	60,	PManagain : 1,	PManagainAK :	0,	PCritrate : 1,	Pgoldmult :	10,	Pdefname :	"Paul",		Pname : "Paladin",	 	abbrev :	"Pal",	FocusStats :	["StrengthPts",	"ArmorPts"],					AvoidedStat: [""]},
	{PHealth :	40,	PHealthMod :	1,	PStrength :	8,	PStrMod :	2,	PAccuracy : 6,	PAccMod :	2,	PArmor : 1,	PArmMod :	1,	PReflexes : 5,	PRefMod :	2, PMaxMana :	20,	PManagain : 0,	PManagainAK :	20,	PCritrate : 1,	Pgoldmult :	10,	Pdefname :	"Bowner",	Pname : "Archer",	 	abbrev :	"Arc",	FocusStats :	["StrengthPts", "AccuracyPts", "ReflexesPts"],	AvoidedStat: [""]},
	{PHealth :	90,	PHealthMod :	2,	PStrength :	15,	PStrMod :	2,	PAccuracy : 15,	PAccMod :	1,	PArmor : 1,	PArmMod :	1,	PReflexes : 20,	PRefMod :	2, PMaxMana :	15,	PManagain : 0,	PManagainAK :	35,	PCritrate : 1,	Pgoldmult :	35,	Pdefname :	"Grognak",	Pname : "Demon",	 	abbrev :	"Dik",	FocusStats :	["StrengthPts", "ReflexesPts", "HealthPts"],	AvoidedStat: [""]}

];
 // Enemy base stat total should be 10 unless it is a boss. If a boss, it should be 16.
 // 
var enemies = [
	{EHealth :	50,	EStrength : 5,	EStrMod :	2,	EAccuracy :	1,	EAccMod :	1,	EArmor :	5,	EArmMod :	2,	EReflexes : 1,	ERefMod :	1,	EManagain : 1, ECritrate : 1,	ExpValue:	3,	Ename : "Boss"		,	abbrev :	"Bos",	Element : 	"Fire",		FocusStats :	["Str", "Arm"],	AvoidedStat:	[""],		BonusOnDefeat:	["HealthPts","StrengthPts","AccuracyPts","ArmorPts","ReflexesPts"]},
	{EHealth :	25,	EStrength : 5,	EStrMod :	2,	EAccuracy : 1,	EAccMod :	1,	EArmor :	1,	EArmMod :	0,	EReflexes : 1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Goblin"	,	abbrev :	"Gob",	Element : 	"Fire",		FocusStats :	["Str"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	20,	EStrength : 1,	EStrMod :	0,	EAccuracy : 1,	EAccMod :	1,	EArmor :	1,	EArmMod :	0,	EReflexes :	1,	ERefMod :	1,	EManagain : 1, ECritrate : 1,	ExpValue:	1,	Ename : "Warlock"	,	abbrev :	"War",	Element : 	"Fire",		FocusStats :	["Str"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	[""]},
	{EHealth :	50,	EStrength : 5,	EStrMod :	2,	EAccuracy : 2,	EAccMod :	1,	EArmor :	2,	EArmMod :	1,	EReflexes :	1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Dragon"	,	abbrev :	"Dra",	Element : 	"Fire",		FocusStats :	["Str"],		AvoidedStat:	["Ref"],	BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	30,	EStrength : 5,	EStrMod :	2,	EAccuracy : 3,	EAccMod :	2,	EArmor :	1,	EArmMod :	1,	EReflexes :	1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Snek"		,	abbrev :	"Sne",	Element : 	"Fire",		FocusStats :	["Str"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	50,	EStrength : 3,	EStrMod :	1,	EAccuracy : 3,	EAccMod :	1,	EArmor :	1,	EArmMod :	1,	EReflexes :	3,	ERefMod :	2,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Phoenix"	,	abbrev :	"Pho",	Element : 	"Fire",		FocusStats :	["Str"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["HealthPts"]},
	{EHealth :	50,	EStrength : 3,	EStrMod :	2,	EAccuracy : 3,	EAccMod :	1,	EArmor :	2,	EArmMod :	1,	EReflexes :	2,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Chupacabra",	abbrev :	"Chu",	Element : 	"Fire",		FocusStats :	["Str"],		AvoidedStat:	["Ref"],	BonusOnDefeat:	["AccuracyPts"]},
	{EHealth :	50,	EStrength : 5,	EStrMod :	2,	EAccuracy : 1,	EAccMod :	1,	EArmor :	2,	EArmMod :	1,	EReflexes :	2,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Werewolf"	,	abbrev :	"Wer",	Element : 	"Fire",		FocusStats :	["Str"],		AvoidedStat:	["Ref"],	BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	50,	EStrength : 5,	EStrMod :	2,	EAccuracy : 3,	EAccMod :	1,	EArmor :	1,	EArmMod :	1,	EReflexes :	1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Cerberus"	,	abbrev :	"Cer",	Element : 	"Fire",		FocusStats :	["Str"],		AvoidedStat:	["Ref"],	BonusOnDefeat:	["StrengthPts"]},
		
	{EHealth :	50,	EStrength : 3,	EStrMod :	1,	EAccuracy : 3,	EAccMod :	1,	EArmor :	2,	EArmMod :	1,	EReflexes :	2,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Shark"		,			abbrev :	"Shk",	Element : 	"Water",	FocusStats :	["Health", "Str"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	40,	EStrength : 4,	EStrMod :	1,	EAccuracy : 2,	EAccMod :	1,	EArmor :	1,	EArmMod :	1,	EReflexes :	3,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Orca"		,			abbrev :	"Orc",	Element : 	"Water",	FocusStats :	["Health"],				AvoidedStat:	["Acc"],	BonusOnDefeat:	["HealthPts"]},	
	{EHealth :	20,	EStrength : 2,	EStrMod :	0,	EAccuracy : 3,	EAccMod :	1,	EArmor :	5,	EArmMod :	2,	EReflexes : 1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Turtle"	,			abbrev :	"Tur",	Element : 	"Water",	FocusStats :	["Health", "Arm"],		AvoidedStat:	["Str"],	BonusOnDefeat:	["ArmorPts"]},
	{EHealth :	50,	EStrength : 4,	EStrMod :	2,	EAccuracy : 1,	EAccMod :	1,	EArmor :	3,	EArmMod :	1,	EReflexes : 2,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Hippo"		,			abbrev :	"Tur",	Element : 	"Water",	FocusStats :	["Health"],				AvoidedStat:	["Ref"],	BonusOnDefeat:	["HealthPts"]},
	{EHealth :	30,	EStrength : 3,	EStrMod :	1,	EAccuracy : 3,	EAccMod :	2,	EArmor :	2,	EArmMod :	1,	EReflexes : 2,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Octopus"	,			abbrev :	"Tur",	Element : 	"Water",	FocusStats :	["Health", "Acc"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["AccuracyPts"]},
	{EHealth :	50,	EStrength : 5,	EStrMod :	2,	EAccuracy : 1,	EAccMod :	1,	EArmor :	4,	EArmMod :	1,	EReflexes : 1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Loch Ness Monster"	,	abbrev :	"Tur",	Element : 	"Water",	FocusStats :	["Health", "Str"],		AvoidedStat:	["Ref"],	BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	40,	EStrength : 3,	EStrMod :	2,	EAccuracy : 2,	EAccMod :	1,	EArmor :	4,	EArmMod :	2,	EReflexes : 1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Zombie"	,			abbrev :	"Tur",	Element : 	"Water",	FocusStats :	["Health", "Arm"],		AvoidedStat:	["Ref"],	BonusOnDefeat:	["ArmorPts"]},
	{EHealth :	30,	EStrength : 4,	EStrMod :	2,	EAccuracy : 3,	EAccMod :	1,	EArmor :	1,	EArmMod :	1,	EReflexes : 2,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Wraith"	,			abbrev :	"Tur",	Element : 	"Water",	FocusStats :	["Health", "Acc"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["AccuracyPts"]},
	{EHealth :	40,	EStrength : 2,	EStrMod :	1,	EAccuracy : 3,	EAccMod :	2,	EArmor :	2,	EArmMod :	1,	EReflexes : 3,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Mermaid"	,			abbrev :	"Tur",	Element : 	"Water",	FocusStats :	["Health", "Ref"],		AvoidedStat:	["Acc"],	BonusOnDefeat:	["ReflexesPts"]},
	
	
	{EHealth :	30,	EStrength : 3,	EStrMod :	1,	EAccuracy : 3,	EAccMod :	2,	EArmor :	2,	EArmMod :	0,	EReflexes : 2,	ERefMod :	2,	EManagain : 0, ECritrate : 2,	ExpValue:	1,	Ename : "Cat"		,	abbrev :	"Cat",	Element : 	"Nature",	FocusStats :	["Ref", "Acc"],	AvoidedStat:	["Arm"],	BonusOnDefeat:	["ReflexesPts"]},
	{EHealth :	20,	EStrength : 5,	EStrMod :	2,	EAccuracy : 2,	EAccMod :	1,	EArmor :	2,	EArmMod :	1,	EReflexes : 1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Skeleton"	,	abbrev :	"Ske",	Element : 	"Nature",	FocusStats :	["Ref", "Str"],	AvoidedStat:	[""],		BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	20,	EStrength : 1,	EStrMod :	1,	EAccuracy : 3,	EAccMod :	1,	EArmor :	1,	EArmMod :	0,	EReflexes :	5,	ERefMod :	2,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Fairy"		,	abbrev :	"Fai",	Element : 	"Nature",	FocusStats :	["Ref"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["ReflexesPts"]},
	{EHealth :	30,	EStrength : 3,	EStrMod :	1,	EAccuracy : 3,	EAccMod :	2,	EArmor :	1,	EArmMod :	1,	EReflexes :	3,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Llama"		,	abbrev :	"Lla",	Element : 	"Nature",	FocusStats :	["Ref", "Acc"],	AvoidedStat:	["Arm"],	BonusOnDefeat:	["AccuracyPts"]},
	{EHealth :	40,	EStrength :	3,	EStrMod :	1,	EAccuracy : 2,	EAccMod :	1,	EArmor :	2,	EArmMod :	1,	EReflexes :	3,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Wolf"		,	abbrev :	"Wol",	Element : 	"Nature",	FocusStats :	["Ref", "Str"],	AvoidedStat:	["Arm"],	BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	40,	EStrength : 4,	EStrMod :	2,	EAccuracy : 3,	EAccMod :	1,	EArmor :	1,	EArmMod :	1,	EReflexes :	2,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Centaur"	,	abbrev :	"Cen",	Element : 	"Nature",	FocusStats :	["Ref"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["ReflexesPts"]},
	{EHealth :	30,	EStrength : 4,	EStrMod :	2,	EAccuracy : 3,	EAccMod :	1,	EArmor :	1,	EArmMod :	1,	EReflexes :	2,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Vampire"	,	abbrev :	"Vam",	Element : 	"Nature",	FocusStats :	["Ref", "Str"],	AvoidedStat:	["Arm"],	BonusOnDefeat:	["StrengthPts"]},
	{EHealth :	30,	EStrength : 2,	EStrMod :	1,	EAccuracy : 3,	EAccMod :	1,	EArmor :	1,	EArmMod :	1,	EReflexes :	5,	ERefMod :	2,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Unicorn"	,	abbrev :	"Uni",	Element : 	"Nature",	FocusStats :	["Ref"],		AvoidedStat:	["Arm"],	BonusOnDefeat:	["ReflexesPts"]},
	{EHealth :	50,	EStrength : 5,	EStrMod :	2,	EAccuracy : 1,	EAccMod :	1,	EArmor :	3,	EArmMod :	1,	EReflexes :	1,	ERefMod :	1,	EManagain : 0, ECritrate : 1,	ExpValue:	1,	Ename : "Ogre"	,		abbrev :	"Ogr",	Element : 	"Nature",	FocusStats :	["Ref", "Str"],	AvoidedStat:	["Ref"],	BonusOnDefeat:	["StrengthPts"]},
	
	
];

// items and item attributes can be added without affecting current setup
var items= [
	{Type :	"weapon",	Name :	"sword",	AtkBoost :	2,		AccBoost :	1.5,	ArmBoost :	0.5,	RefBoost :	0,	HealthBoost: 0,	ManaBoost: 0,	BannedClass :	["Archer" , "Mage"],				BoostedClass :	["Adventurer", "Barbarian", "Paladin"]},
	{Type :	"weapon",	Name :	"bow",		AtkBoost :	1.5,	AccBoost :	1.5,	ArmBoost :	0,		RefBoost :	1,	HealthBoost: 0,	ManaBoost: 0,	BannedClass :	["Mage", "Barbarian", "Paladin"],	BoostedClass :	["Archer", "Adventurer"]}, 
	{Type :	"armor",	Name :	"leather",	AtkBoost :	0,		AccBoost :	0,		ArmBoost :	1.5,	RefBoost :	1,	HealthBoost: 0,	ManaBoost: 0,	BannedClass :	["None"],							BoostedClass :	["Adventurer", "Barbarian", "Paladin", "Archer"]},
	{Type :	"armor",	Name :	"steel",	AtkBoost :	0,		AccBoost :	0,		ArmBoost :	2,		RefBoost :	0,	HealthBoost: 0,	ManaBoost: 0,	BannedClass :	["Mage"],							BoostedClass :	["Adventurer", "Barbarian", "Paladin"]},
	{Type :	"potion",	Name :	"health",	AtkBoost :	0,		AccBoost :	0,		ArmBoost :	0,		RefBoost :	0,	HealthBoost: 1,	ManaBoost: 0,	BannedClass :	["None"],							BoostedClass :	""},
	{Type :	"potion",	Name :	"mana",		AtkBoost :	0,		AccBoost :	0,		ArmBoost :	0,		RefBoost :	0,	HealthBoost: 0,	ManaBoost: 1,	BannedClass :	["Archer" , "Barbarian"],			BoostedClass :	""},
	
	];

//need to add a value to each to signify chance to be found
var itemquality = [
	{Quality: "crude",		BoostRate :	.5,		GradeRank:	0},
	{Quality: "standard",	BoostRate :	1,		GradeRank:	1},
	{Quality: "fine",		BoostRate :	1.5,	GradeRank:	2},
	{Quality: "legendary",	BoostRate :	2,		GradeRank:	3},
	{Quality: "epic",		BoostRate :	3,		GradeRank:	4},
]

// the stats that will be set when the character is rebirthed
var Defaultplayerstats = {
	PlayerName: "Boogaloo",
	Nam: "Class",
	Abr: "aaa",
	Element: "Fire",
	statmult: 1, //the amount stats are multiplied by due to rebirth
	RebirthLevel: 100, // the base level for rebirth
	
	stats: { //most of the below is overridden during character creation
		Health:				0,
		HealthPts:			0,
		HealthPtsCost:		100, //base cost to manually upgrade
		HealthPtsUpgNum:	0,
		HealthMod:			0,
		CurrentHealth:		0,
		BaseHealth:			0,
		Str: 				0,
		StrengthPts: 		0,
		StrengthPtsCost:	100,
		StrengthPtsUpgNum:	0,
		ItemsStrMod:		0,
		StrMod:				0,
		Acc: 				0,
		AccuracyPts:		0,
		AccuracyPtsCost:	100,
		AccuracyPtsUpgNum:	0,
		HitChance:			0,
		ItemsAccMod:		0,
		AccMod:				0,
		Arm:				0,
		ArmorPts:			0,
		ArmorPtsCost:		100,
		ArmorPtsUpgNum:		0,
		ItemsArmMod:		0,
		ArmMod:				0,
		Ref:				0,
		ReflexesPts:		0,
		ReflexesPtsCost:	100,
		ReflexesPtsUpgNum:	0,
		ItemsRefMod:		0,
		RefMod:				0,
		Mana:				0,
		MaxMana:			0,
		Managain:			0,
		ManagainAK:			0,
		ItemsManMod:		0,
		Cri:				0,
		ItemsCriMod:		0,
		Exp:				0,
		Level:				1,
		StatPts:			0,
		StatTotal:			0,
		Damage:				0,
		DamageDealt:		0,
		FocusStats:			[],
		AvoidedStat:		[],

		
	},
	Status: {
		poisoned: 	false,
		poisondamage:	0,
		
		burned:		false,
		burndamage:	0,
		burnweak:	0,

		weakened:	false,
		weakweak:	0,
	},
	
	inv: { //new item types can be added(shield is an unused item type added as an example)
		healthpotcount:	0,
		manapotcount:	0,
		Gold:			0,
		weapon: {
			Quality: 	"",
			QualityRank: 0,
			Name:		"",
			AtkBst:		0,
			AccBst: 	0,
			ArmBst: 	0,
			RefBst: 	0,
		},
		armor: {
			Quality: 	"",
			QualityRank: 0,
			Name:		"",
			AtkBst:		0,
			AccBst: 	0,
			ArmBst: 	0,
			RefBst: 	0,
		},
		shield: {
			Quality: 	"",
			QualityRank: 0,
			Name:		"",
			AtkBst:		0,
			AccBst: 	0,
			ArmBst: 	0,
			RefBst: 	0,		
		},
	}	
}
// player variables
var playerstats = {
	PlayerName: "Boogaloo",
	Nam: "Class",
	Abr: "aaa",
	Element: "Fire",
	statmult: 1,
	RebirthLevel: 100,
	
	stats: {
		Health:				0,
		HealthPts:			0,
		HealthPtsCost:		100,
		HealthPtsUpgNum:	0,
		HealthMod:			0,
		CurrentHealth:		0,
		BaseHealth:			0,
		Str: 				0,
		StrengthPts: 		0,
		StrengthPtsCost:	100,
		StrengthPtsUpgNum:	0,
		ItemsStrMod:		0,
		StrMod:				0,
		Acc: 				0,
		AccuracyPts:		0,
		AccuracyPtsCost:	100,
		AccuracyPtsUpgNum:	0,
		HitChance:			0,
		ItemsAccMod:		0,
		AccMod:				0,
		Arm:				0,
		ArmorPts:			0,
		ArmorPtsCost:		100,
		ArmorPtsUpgNum:		0,
		ItemsArmMod:		0,
		ArmMod:				0,
		Ref:				0,
		ReflexesPts:		0,
		ReflexesPtsCost:	100,
		ReflexesPtsUpgNum:	0,
		ItemsRefMod:		0,
		RefMod:				0,
		Mana:				0,
		MaxMana:			0,
		Managain:			0,
		ManagainAK:			0,
		ItemsManMod:		0,
		Cri:				0,
		ItemsCriMod:		0,
		Exp:				0,
		Level:				1,
		StatPts:			0,
		StatTotal:			0,
		Damage:				0,
		DamageDealt:		0,
		FocusStats:			[],
		AvoidedStat:		[],
		goldmultiplier:		10,

		
	},
	Status: {
		poisoned: 	false,
		poisontime:		0,
		poisondamage:	0,
		
		burned:		false,
		burntime:	0,
		burndamage:	0,
		burnweak:	0,
		
		lvlup:		false,
		weakened:	false,
		weaktime:	0,
		weakweak:	0,
	},
	
	inv: {
		healthpotcount:	0,
		manapotcount:	0,
		Gold:			0,
		weapon: {
			Quality: 	"",
			QualityRank: 0,
			Name:		"",
			AtkBst:		0,
			AccBst: 	0,
			ArmBst: 	0,
			RefBst: 	0,
		},
		armor: {
			Quality: 	"",
			QualityRank: 0,
			Name:		"",
			AtkBst:		0,
			AccBst: 	0,
			ArmBst: 	0,
			RefBst: 	0,
		},
		shield: {
			Quality: 	"",
			QualityRank: 0,
			Name:		"",
			AtkBst:		0,
			AccBst: 	0,
			ArmBst: 	0,
			RefBst: 	0,		
		},
	}	
}

// list of skills(will require the addition of a button to fully integrate new skills)
var skills = [
	{AName :	"Basic Attack",		DamMult :	1,		ManaCost :	0,	HealMult :	0,	UpgCost :	100,	UpgNum :	0,	AvailableClass :	["Adventurer","Barbarian","Mage","Paladin","Archer","Demon"],	BoostedClass :	"Adventurer"},
	{AName :	"Power Attack", 	DamMult :	1.5,	ManaCost :	3,	HealMult :	0,	UpgCost :	100,	UpgNum :	0,	AvailableClass :	["Adventurer","Barbarian","Mage","Paladin","Archer","Demon"],	BoostedClass :	["Barbarian","Paladin","Archer"]},
	{AName :	"Magic Attack",		DamMult :	1.5,	ManaCost :	3,	HealMult :	0,	UpgCost :	100,	UpgNum :	0,	AvailableClass :	["Adventurer","Mage","Paladin"],						BoostedClass :	["Mage"]},
	{AName :	"Magic Power", 		DamMult :	2,		ManaCost :	5,	HealMult :	0,	UpgCost :	100,	UpgNum :	0,	AvailableClass :	["Adventurer","Mage","Paladin"],						BoostedClass :	["Mage"]},
	{AName :	"Heal", 			DamMult :	0,		ManaCost :	5,	HealMult :	1,	UpgCost :	100,	UpgNum :	0,	AvailableClass :	["Adventurer","Barbarian","Mage","Paladin","Archer","Demon"],	BoostedClass :	["Paladin"]},
	
];

// list of learned skills
var playerskills = [
	{AName: ""},
	{AName:	""},
	{AName:	""},
	{AName:	""},
	{AName:	""},
]

var Defaultenemystats = {
	Nam: "Class",
	Abr: "aaa",
	Element: "",
	
	stats: {
		Health:				0,
		HealthPts:			0,
		CurrentHealth:		0,
		Str: 				0,
		StrMod:				0,
		StrengthPts: 		0,
		Acc: 				0,
		AccMod:				0,
		AccuracyPts:		0,
		HitChance:			0,
		Arm:				0,
		ArmMod:				0,
		ArmorPts:			0,
		Ref:				0,
		RefMod:				0,
		ReflexesPts:		0,
		Man:				0,
		Cri:				0,
		Damage:				0,
		DamageDealt:		0,
		FocusStats:			[],
		AvoidedStat:		[],
		BonusOnDefeat:		[],
	},
	Status: {
		poisoned: 	false,
		poisontime:		0,
		poisondamage:	0,
		
		burned:		false,
		burntime:		0,
		burndamage:		0,
		burnweak:		0,
		
		weakened:	false,
		weaktime:		0,
		weakweak:		0,
	}
}
 
var enemystats = {
	Nam: "Class",
	Abr: "aaa",
	Element: "",
	
	stats: {
		Health:				0,
		HealthPts:			0,
		CurrentHealth:		0,
		Str: 				0,
		StrMod:				0,
		StrengthPts: 		0,
		Acc: 				0,
		AccMod:				0,
		AccuracyPts:		0,
		HitChance:			0,
		Arm:				0,
		ArmMod:				0,
		ArmorPts:			0,
		Ref:				0,
		RefMod:				0,
		ReflexesPts:		0,
		Man:				0,
		Cri:				0,
		Damage:				0,
		DamageDealt:		0,
		FocusStats:			[],
		AvoidedStat:		[],
		BonusOnDefeat:		[],
	},
	Status: {
		poisoned: 	false,
		poisontime:		0,
		poisondamage:	0,
		
		burned:		false,
		burntime:		0,
		burndamage:		0,
		burnweak:		0,
		
		weakened:	false,
		weaktime:		0,
		weakweak:		0,
	}
}
 
//Click attack variables
var ManualAttack = {
	CName:	"Basic Click",	
	ClickStr:	1, //Base click damage
	DamMult:	1, //Damage increase value
	CostMult:	1.7, // Cost increase amount (Upgcost *= UpgCost)
	BaseCost:	100, // Cost for first buy
	UpgCost:	100, // Current cost
	UpgNum:		1, // Upgrade level
	
}
 
// new areas can easily be added, just need to assign a name and add an image with the name in the Sprites folder
var areas = [
	{name:	"Meadow",		ElPreferred:	["Fire", "Water", "Nature"]},
	{name:	"Ocean",		ElPreferred:	["Water"]},
	{name:	"Volcano",		ElPreferred:	["Fire"]},
	{name:	"Forest",		ElPreferred:	["Nature"]},
	{name:	"Island",		ElPreferred:	["Water", "Nature"]},
	{name:	"Hot Springs",	ElPreferred:	["Fire", "Water"]},
	{name:	"California",	ElPreferred:	["Fire", "Nature"]},
]

 
 //================================End of arrays===========================
 
function ResetGame() {//Resets stats to level 1
	ChangeScene('Start');
	document.getElementById("ActLog").value = "";
	playerstats.Nam = Defaultplayerstats.Nam;
	playerstats.Element = Defaultplayerstats.Element;
	playerstats.stats.HealthPts = 0;
	playerstats.stats.StrengthPts = 0;
	playerstats.stats.AccuracyPts = 0;
	playerstats.stats.ArmorPts = 0;
	playerstats.stats.ReflexesPts = 0;

	Object.assign(playerstats.Status, Defaultplayerstats.Status);
	Object.assign(playerstats.inv, Defaultplayerstats.inv);
	console.log(playerstats.Nam);
	console.log(playerstats.stats.Str);
	battling = false;
	Pclass = classes.find(item => item.Pname === playerstats.Nam);
	Rebirth = true;
	calculate_Pstats();
}

function Startload() {//loads start page on page load
	var divs = document.getElementsByTagName("div");
	for (var i = 0; i < divs.length; i++) {
		divs[i].style.display = 'none';
	}
	document.getElementById('Start').style.display = "block";
	screen = "Start";
}

function Savegame() {//unused save function
	if(confirm('Override saved stats?')) {
		savedplayerstats = playerstats;
		saved = true;
	}
	else{
		
	}
}

function LoadGame() {//unused load function
	if(confirm('Load saved stats?')) {
		playerstats = savedplayerstats;
		document.getElementById('PStrlabel').textContent = 'Strength: ' + playerstats.stats.Str;
		document.getElementById('PAcclabel').textContent = 'Accuracy: ' + playerstats.stats.Acc;
		document.getElementById('PArmlabel').textContent = 'Armor: ' 	+ playerstats.stats.Arm;
		document.getElementById('PReflabel').textContent = 'Reflexes: ' + playerstats.stats.Ref;
		
		document.getElementById('ElemImg').src = 'Sprites/' + savedplayerstats.Element + ".svg";
		document.getElementById('ElementGroup').style.display = "block";
		document.getElementById('CharImg').src = 'Sprites/' + savedplayerstats.Nam + ".svg";
		document.getElementById('CharImg').style.display = "block";
	}
	else{
		
	}
}

function ClassHelp() {//changes page to help screen
	ChangeScene("Help");
}

function ClassSet(choice) {//sets playerstats to match the chosen class
		Pselect = choice;
		document.getElementById('ElementGroup').style.display = "block";
		document.getElementById('CharImg').src = 'Sprites/' + choice + ".svg";
		document.getElementById('CharImg').style.display = "block";
		playerstats.Nam = choice;
	calculate_Pstats();
	

}

function ElementSet(choice) {//sets the element to match chosen element
		playerstats.Element = choice;
		document.getElementById('gamestartbutt').style.display = "block";
		document.getElementById('ElemImg').src = 'Sprites/' + playerstats.Element + ".svg";
		document.getElementById('ElemImg').style.display = "block";
		playerstats.Element = choice;
		if(choice == "Fire"){
			playerstats.stats.StrMod += 1;
			playerstats.stats.StrMod = Pclass.StrMod;
			playerstats.stats.HealthMod = Pclass.PHealthMod;
		}
		if(choice == "Water"){
			playerstats.stats.HealthMod +=1;
			playerstats.stats.StrMod = Pclass.StrMod;
			playerstats.stats.RefMod = Pclass.RefMod;
		}
		if(choice == "Nature"){
			playerstats.stats.RefMod +=1;
			playerstats.stats.StrMod = Pclass.StrMod;
			playerstats.stats.HealthMod = Pclass.PHealthMod;
		}
		
}

function calculate_Pstats() {//sets player stats based on chosen class, element, and assigned stat points
	if(Rebirth == false){
		Pclass = classes.find(item => item.Pname === Pselect);
	}

	//mods pull from class object due to the values remaining the same throughout.(this may change)
	playerstats.stats.StrMod = Pclass.PStrMod;
	if(playerstats.Element == "Fire"){playerstats.stats.StrMod = Pclass.PStrMod + 1;}
	playerstats.stats.AccMod = Pclass.PAccMod;
	playerstats.stats.ArmMod = Pclass.PArmMod;
	playerstats.stats.RefMod = Pclass.PRefMod;
	if(playerstats.Element == "Nature"){playerstats.stats.RefMod = Pclass.PRefMod + 1;}
	playerstats.stats.HealthMod = Pclass.PHealthMod;
	if(playerstats.Element == "Water"){playerstats.stats.HealthMod = Pclass.PHealthMod + 1;}
	playerstats.Nam = Pclass.Pname;
	
	//sets stat values
	playerstats.stats.BaseHealth = Pclass.PHealth
	playerstats.stats.Health = Math.floor((playerstats.stats.BaseHealth		+	(playerstats.stats.HealthPts 		* Pclass.PHealth * playerstats.stats.HealthMod)) * playerstats.statmult);
	playerstats.stats.CurrentHealth = Math.floor(playerstats.stats.Health	-	playerstats.stats.DamageDealt);
	playerstats.stats.Str = Math.floor((Pclass.PStrength 					+	(playerstats.stats.StrengthPts 		* playerstats.stats.StrMod)	+ playerstats.stats.ItemsStrMod + playerstats.inv.armor.AtkBst + playerstats.inv.weapon.AtkBst) * playerstats.statmult);
	playerstats.stats.Acc = Math.floor((Pclass.PAccuracy 					+	(playerstats.stats.AccuracyPts 		* playerstats.stats.AccMod)	+ playerstats.stats.ItemsAccMod + playerstats.inv.armor.AccBst + playerstats.inv.weapon.AccBst) * playerstats.statmult);
	playerstats.stats.Arm = Math.floor((Pclass.PArmor 						+	(playerstats.stats.ArmorPts 		* playerstats.stats.ArmMod)	+ playerstats.stats.ItemsArmMod + playerstats.inv.armor.ArmBst + playerstats.inv.weapon.ArmBst) * playerstats.statmult);
	playerstats.stats.Ref = Math.floor((Pclass.PReflexes 					+	(playerstats.stats.ReflexesPts 		* playerstats.stats.RefMod)	+ playerstats.stats.ItemsRefMod + playerstats.inv.armor.RefBst + playerstats.inv.weapon.RefBst) * playerstats.statmult);
	playerstats.stats.MaxMana = Pclass.PMaxMana;
	playerstats.stats.Managain = Pclass.PManagain;
	playerstats.stats.ManagainAK = Pclass.PManagainAK;
	playerstats.stats.Cri = Pclass.PCritrate					+	playerstats.stats.ItemsCriMod;
	playerstats.stats.goldmultiplier = Pclass.Pgoldmult;
						
	playerstats.Abr = Pclass.abbrev;//unused. not sure if it will ever be


		//all classes get Basic Attack and Power Attack by default
		playerskills[0] = skills[0]
		
		playerskills[1] = skills[1]
		
		//for testing purposes all available skills are unlocked at the point of character creation
		if(skills[2].AvailableClass.includes(playerstats.Nam) == true){
			playerskills[2] = skills[2]
		}
		if(skills[3].AvailableClass.includes(playerstats.Nam) == true){
			playerskills[3] = skills[3]
		}
		if(skills[4].AvailableClass.includes(playerstats.Nam) == true){
			playerskills[4] = skills[4]
		}
		
		
		
}

function calculate_Estats() {//calculates enemy stats
	var Etype = enemies[Math.floor(Math.random()*enemies.length)];
	while(areas[battlearea].ElPreferred.includes(Etype.Element) == false){Etype = enemies[Math.floor(Math.random()*enemies.length)];}
	
	//resets stat points in preparation for below calculation
	enemystats.stats.HealthPts = 0;
	enemystats.stats.StrengthPts = 0;
	enemystats.stats.AccuracyPts = 0;
	enemystats.stats.ArmorPts = 0;
	enemystats.stats.ReflexesPts = 0;


	//the bonus given when defeated
	enemystats.stats.BonusOnDefeat = Etype.BonusOnDefeat;
	//assigns name and element
	enemystats.Element = Etype.Element;
	enemystats.Nam = Etype.Ename;
	enemystats.Abr = Etype.abbrev;

	//assigns stat modifiers
	enemystats.stats.StrMod = Etype.EStrMod;
	enemystats.stats.AccMod = Etype.EAccMod;
	enemystats.stats.ArmMod = Etype.EArmMod;
	enemystats.stats.RefMod = Etype.ERefMod;
	
	//chooses stat point allocation
	if(playerstats.stats.Level > 1){
		var i = 0;
		estatpoints = playerstats.stats.Level - 1;
		estatpoints = Math.floor(estatpoints * Math.pow(1.030, playerstats.stats.Level));
		
		for(i = 1; i < estatpoints; i++){
				var StatPrefChk = Math.floor(Math.random()*100)+1;
				if(StatPrefChk <= 66){
					var GetStatToRaise = Math.floor(Math.random()*Etype.FocusStats.length);
						enemystats.stats[Etype.FocusStats[GetStatToRaise]]++;
						
				}else{
						var stat = Math.floor(Math.random()*6)+1;
						if(stat == 1 && Etype.AvoidedStat.includes("Health") == false){
							enemystats.stats.HealthPts++;
						}
						if(stat == 2 && Etype.AvoidedStat.includes("Str") == false){
							enemystats.stats.StrengthPts++;
						}
						if(stat == 3 && Etype.AvoidedStat.includes("Acc") == false){
							enemystats.stats.AccuracyPts++;							
						}
						if(stat == 4 && Etype.AvoidedStat.includes("Arm") == false){
							enemystats.stats.ArmorPts++;							
						}
						if(stat == 5 && Etype.AvoidedStat.includes("Ref") == false){
							enemystats.stats.ReflexesPts++;
						}
					}
									
			}
		}
	
		//calculates stats
	enemystats.stats.Health = Etype.EHealth + (Etype.EHealth * enemystats.stats.HealthPts);
	enemystats.stats.Str = Etype.EStrength + (enemystats.stats.StrMod * enemystats.stats.StrengthPts);
	enemystats.stats.Acc = Etype.EAccuracy + (enemystats.stats.AccMod * enemystats.stats.AccuracyPts);
	enemystats.stats.Arm = Etype.EArmor + (enemystats.stats.ArmMod * enemystats.stats.ArmorPts);
	enemystats.stats.Ref = Etype.EReflexes + (enemystats.stats.RefMod * enemystats.stats.ReflexesPts);	
	enemystats.Element = Etype.Element;

	
	
}

function ChangeScene(scene){//selects which scene(div) to load
	screen=scene;
	var divs = document.getElementsByTagName("div");
	for (var i = 0; i < divs.length; i++) {
		divs[i].style.display = 'none';
	}
	document.getElementById(scene).style.display = 'block';
	if(scene == "Main"){
		calculate_Pstats;
		Main();
	}
}
			
function itemstats(){//calculates found item stats
	
	var itemtype = items[Math.floor(Math.random()*items.length)];
	while(itemtype.BannedClass.includes(playerstats.Nam) == true){itemtype = items[Math.floor(Math.random()*items.length)];}
	
	if(itemtype.Type != "potion"){//only assigns stats to non-potion items
		var itemname = itemtype.Name;
		var itemqualityget = Math.floor(Math.random()*itemquality.length);
		var quality = itemquality[itemqualityget];
		var qualityname = itemquality.Quality;
		var itemlevel = playerstats.stats.Level - Math.floor(Math.random()*4);
		if(itemlevel < 1){itemlevel = 1;}
		if(itemtype.Type == "armor"){
			if(itemlevel < playerstats.Level || quality.GradeRank >= playerstats.inv.armor.QualityRank){
				playerstats.inv.armor.Quality = quality.Quality;
				playerstats.inv.armor.QualityRank = quality.GradeRank;
				if(itemtype.AtkBoost > 0){
					playerstats.inv.armor.AtkBst = (Math.floor(itemtype.AtkBoost * quality.BoostRate) + itemlevel);
					playerstats.inv.armor.AtkBst = Math.floor(playerstats.inv.armor.AtkBst * Math.pow(1.017, itemlevel));
				}
				if(itemtype.AccBoost > 0){
					playerstats.inv.armor.AccBst = Math.floor(itemtype.AccBoost * quality.BoostRate) + itemlevel;
					playerstats.inv.armor.AccBst = Math.floor(playerstats.inv.armor.AccBst * Math.pow(1.017, itemlevel));
				}
				if(itemtype.ArmBoost > 0){
					playerstats.inv.armor.ArmBst = Math.floor(itemtype.ArmBoost * quality.BoostRate) + itemlevel;
					playerstats.inv.armor.ArmBst = Math.floor(playerstats.inv.armor.ArmBst * Math.pow(1.017, itemlevel));
				}
				if(itemtype.RefBoost > 0){
					playerstats.inv.armor.RefBst = Math.floor(itemtype.RefBoost * quality.BoostRate) + itemlevel;
					playerstats.inv.armor.RefBst = Math.floor(playerstats.inv.armor.RefBst * Math.pow(1.017, itemlevel));
				}
				calculate_Pstats();
				drawbattlescreen();
				document.getElementById("ActLog").value += '\n' + "_____________________________";
				document.getElementById("ActLog").value += '\n' + "Found a " + playerstats.inv.armor.Quality + " " + itemtype.Name + " armor";
				document.getElementById("ActLog").value += '\n' + "Strength Boost: " + playerstats.inv.armor.AtkBst;
				document.getElementById("ActLog").value += '\n' + "Accuracy Boost: " + playerstats.inv.armor.AccBst;
				document.getElementById("ActLog").value += '\n' + "Armor Boost: " + playerstats.inv.armor.ArmBst;
				document.getElementById("ActLog").value += '\n' + "Reflexes Boost: " + playerstats.inv.armor.RefBst;
				document.getElementById("ActLog").value += '\n' + "_____________________________";
				document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight ;
			}	
		}
		if(itemtype.Type == "weapon" && quality.GradeRank > playerstats.inv.weapon.QualityRank){
			playerstats.inv.weapon.Quality = quality.Quality;
			playerstats.inv.weapon.QualityRank = quality.GradeRank;
			if(itemtype.AtkBoost > 0){
				playerstats.inv.weapon.AtkBst = Math.floor(itemtype.AtkBoost * quality.BoostRate) + itemlevel;
				playerstats.inv.weapon.AtkBst = Math.floor(playerstats.inv.armor.AtkBst * Math.pow(1.017, itemlevel));
			}
			if(itemtype.AccBoost > 0){
				playerstats.inv.weapon.AccBst = Math.floor(itemtype.AccBoost * quality.BoostRate) + itemlevel;
				playerstats.inv.weapon.AccBst = Math.floor(playerstats.inv.armor.AccBst * Math.pow(1.017, itemlevel));
			}
			if(itemtype.ArmBoost > 0){
				playerstats.inv.weapon.ArmBst = Math.floor(itemtype.ArmBoost * quality.BoostRate) + itemlevel;
				playerstats.inv.weapon.ArmBst = Math.floor(playerstats.inv.armor.ArmBst * Math.pow(1.017, itemlevel));
			}
			if(itemtype.RefBoost > 0){
				playerstats.inv.weapon.RefBst = Math.floor(itemtype.RefBoost * quality.BoostRate) + itemlevel;
				playerstats.inv.weapon.RefBst = Math.floor(playerstats.inv.armor.RefBst * Math.pow(1.017, itemlevel));
			}

			calculate_Pstats();
			drawbattlescreen();
			document.getElementById("ActLog").value += '\n' + "_____________________________";
			document.getElementById("ActLog").value += '\n' + "Found a " + playerstats.inv.weapon.Quality + " " + itemtype.Name;
			document.getElementById("ActLog").value += '\n' + "Strength Boost: " + playerstats.inv.weapon.AtkBst;
			document.getElementById("ActLog").value += '\n' + "Accuracy Boost: " + playerstats.inv.weapon.AccBst;
			document.getElementById("ActLog").value += '\n' + "Armor Boost: " + playerstats.inv.weapon.ArmBst;
			document.getElementById("ActLog").value += '\n' + "Reflexes Boost: " + playerstats.inv.weapon.RefBst;
			document.getElementById("ActLog").value += '\n' + "_____________________________";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight ;
		}
	}else{
		if(itemtype.Name == "health"){
			document.getElementById("ActLog").value += '\n' + "Found Health Potion.";
			if(playerstats.stats.CurrentHealth <= playerstats.stats.Health * .5){
				playerstats.stats.DamageDealt -= Math.floor(playerstats.stats.Health * .30);
				if(playerstats.stats.DamageDealt <= 0){playerstats.stats.DamageDealt = 0; playerstats.inv.healthpotcount--;} 
			}else{playerstats.inv.healthpotcount++;}
			document.getElementById("ActLog").value += '\n' + playerstats.inv. healthpotcount + " Health potions in inventory.";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
		}
		if(itemtype.Name == "mana"){
			document.getElementById("ActLog").value += '\n' + "Found Mana Potion!";
			playerstats.inv.manapotcount++;
			document.getElementById("ActLog").value += '\n' + playerstats.inv.manapotcount + " Mana potions in inventory.";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
		}
	}

}	

function battlescreen(){//prepares the battle area once battle is started
	if(playerstats.stats.Level == 1){battlearea == 0;}
	if(playerstats.stats.Level % 10 === 0){
		battlearea = Math.floor(Math.random()*areas.length);

		document.getElementById("ActLog").value += '\n' + "Arrived in " + areas[battlearea].name + "!";
		document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
		
	}
	playerstats.stats.CurrentHealth = playerstats.stats.Health - playerstats.stats.DamageDealt;
	calculate_Estats();
	battling = true;
	document.getElementById("ActLog").value += '\n' + "Encountered an enemy " + enemystats.Nam + "!";
	document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
	enemystats.stats.CurrentHealth = enemystats.stats.Health;
	clearInterval(Mainloop);
	
	var skill1 = playerskills[0];
	var skill2 = playerskills[1];
	var skill3 = playerskills[2];
	var skill4 = playerskills[3];
	var skill5 = playerskills[4];
	
		if(skill1.BoostedClass.indexOf(playerstats.Nam) > -1){
			if((playerstats.stats.Str * 1.5 * skill1.DamMult) > enemystats.stats.Arm){
				PMaxDamskill1 = (playerstats.stats.Str * 1.5 * skill1.DamMult) - enemystats.stats.Arm;
				if(playerstats.stats.Acc > enemystats.stats.Arm){
					PMinDamskill1 = (playerstats.stats.Acc * 1.5 * skill1.DamMult) - enemystats.stats.Arm;
				}else{
					PMinDamskill1 = 1;
				}
			}else{
				PMaxDamskill1 = 1;
				PMinDamskill1 = 1;
			}	
		}else{
			if((playerstats.stats.Str * skill1.DamMult) > enemystats.stats.Arm){
				PMaxDamskill1 = (playerstats.stats.Str * skill1.DamMult) - enemystats.stats.Arm;
				if(playerstats.stats.Acc > enemystats.stats.Arm){
					PMinDamskill1 = playerstats.stats.Acc - enemystats.stats.Arm;
				}else{
					PMinDamskill1 = 1;
				}
			}else{
				PMaxDamskill1 = 1;
				PMinDamskill1 = 1;	
			}
		}
		if(skill2.BoostedClass.indexOf(playerstats.Nam) > -1){
			if((playerstats.stats.Str * 1.5 * skill2.DamMult) > enemystats.stats.Arm){
				PMaxDamskill2 = (playerstats.stats.Str * 1.5 * skill2.DamMult) - enemystats.stats.Arm;
				if(playerstats.stats.Acc > enemystats.stats.Arm){
					PMinDamskill2 = (playerstats.stats.Acc * 1.5 * skill2.DamMult) - enemystats.stats.Arm;
				}else{
					PMinDamskill2 = 1;
				}
			}else{
				PMaxDamskill2 = 1;
				PMinDamskill2 = 1;
			}	
		}else{
			if((playerstats.stats.Str * skill2.DamMult) > enemystats.stats.Arm){
				PMaxDamskill2 = (playerstats.stats.Str * skill2.DamMult) - enemystats.stats.Arm;
				if(playerstats.stats.Acc > enemystats.stats.Arm){
					PMinDamskill2 = playerstats.stats.Acc - enemystats.stats.Arm;
				}else{
					PMinDamskill2 = 1;
				}
			}else{
				PMaxDamskill2 = 1;
				PMinDamskill2 = 1;	
			}
		}
	
	if(skills[0].AvailableClass.includes(playerstats.Nam) == true){
		document.getElementById("Basic Attack").style.display="block";
		document.getElementById("Basic AttackDam").style.display="block";
	}else{
		document.getElementById("Basic Attack").style.display="none";
		document.getElementById("Basic AttackDam").style.display="none";
	}
	if(skills[1].AvailableClass.includes(playerstats.Nam) == true){
		document.getElementById("Power Attack").style.display="block";
		document.getElementById("Power AttackDam").style.display="block";
	}else{
		document.getElementById("Power Attack").style.display="none";
		document.getElementById("Power AttackDam").style.display="none";
	}
	if(skills[2].AvailableClass.includes(playerstats.Nam) == true){
		document.getElementById("Magic Attack").style.display="block";
		document.getElementById("Magic AttackDam").style.display="block";
	}else{
		document.getElementById("Magic Attack").style.display="none";
		document.getElementById("Magic AttackDam").style.display="none";
	}
	if(skills[3].AvailableClass.includes(playerstats.Nam) == true){
		document.getElementById("Magic Power").style.display="block";
		document.getElementById("Magic PowerDam").style.display="block";
	}else{
		document.getElementById("Magic Power").style.display="none";
		document.getElementById("Magic PowerDam").style.display="none";
	}
	if(skills[4].AvailableClass.includes(playerstats.Nam) == true){
		document.getElementById("Heal").style.display="block";
		document.getElementById("HealDam").style.display="block";
	}else{
		document.getElementById("Heal").style.display="none";
		document.getElementById("HealDam").style.display="none";
	}
	
	
	if(playerskills[0].AName != ""){
		
		MinMaxDam("Basic Attack");

		document.getElementById("Basic AttackDam").innerHTML = "Damage Range: " + skillmindam + "-" + skillmaxdam + " Mana Cost: " + playerskills[0].ManaCost;
	}
	
	if(playerskills[1].AName != ""){
		MinMaxDam("Power Attack")
		document.getElementById("Power AttackDam").innerHTML = "Damage Range: " + skillmindam + "-" + skillmaxdam + " Mana Cost: " + playerskills[1].ManaCost;
	}
	if(playerskills[2].AName != ""){
		MinMaxDam("Magic Attack")
		document.getElementById("Magic AttackDam").innerHTML = "Damage Range: " + skillmindam + "-" + skillmaxdam + " Mana Cost: " + playerskills[2].ManaCost;
	}
	if(playerskills[3].AName != ""){
		MinMaxDam("Magic Power")
		document.getElementById("Magic PowerDam").innerHTML = "Damage Range: " + skillmindam + "-" + skillmaxdam + " Mana Cost: " + playerskills[3].ManaCost;
	}
	if(playerskills[4].AName != ""){
		MinMaxDam("Heal")
		document.getElementById("HealDam").innerHTML = "Heal Amount: " + Math.ceil(playerskills[4].HealMult * (playerstats.stats.Health * .3)) + " Mana Cost: " + playerskills[4].ManaCost;
	}
	drawbattlescreen();

	battle();

}

function getattack(Edef){//selects the skill to use
	chkattack = Math.floor(Math.random()*playerskills.length);
	while(playerskills[chkattack].AName == "" || playerstats.stats.Mana < playerskills[chkattack].ManaCost){
		chkattack = Math.floor(Math.random()*playerskills.length);
	}
	if(playerskills[chkattack].DamMult > 0){
		PDamagecalc(chkattack, Edef);
	}else{
		Healskill(chkattack);
	}
}

function Healskill(chkattack){
	if(skills.BoostedClass == playerstats.Nam){
		var HealAmount = playerskills[chkattack].HealMult * (playerstats.stats.Health * .3)*1.5;
	}else{
		var HealAmount = playerskills[chkattack].HealMult * (playerstats.stats.Health * .3);
	}
	playerstats.stats.DamageDealt -= HealAmount;
	if(playerstats.stats.DamageDealt < 0){
		playerstats.stats.DamageDealt = 0;
	}
	playerstats.stats.Mana -= skills[4].ManaCost;
}

function checkadvantage(Aelem, Delem){//checks elemental advantage and assigns a damage multiplier

	if(Aelem == "Fire"){
		if(Delem == "Fire"){Aelemdammult = 1;}
		if(Delem == "Water"){Aelemdammult = .66;}
		if(Delem == "Nature"){Aelemdammult = 1.5;}
	}
	if(Aelem == "Water"){
		if(Delem == "Fire"){Aelemdammult = 1.5;}
		if(Delem == "Water"){Aelemdammult = 1;}
		if(Delem == "Nature"){Aelemdammult = .66;}
	}
	if(Aelem == "Nature"){
		if(Delem == "Fire"){Aelemdammult = .66;}
		if(Delem == "Water"){Aelemdammult = 1.5;}
		if(Delem == "Nature"){Aelemdammult = 1;}
	}
	return Aelemdammult;

}

function defensechk(){
	//calculate player def roll
	if(playerstats.stats.Arm > playerstats.stats.Ref){
		Pdef = Math.ceil(Math.random()*(playerstats.stats.Arm - playerstats.stats.Ref) * playerstats.stats.Ref);
	}else{
		Pdef = playerstats.stats.Arm;
	}
	//calculate enemy def roll
	if(enemystats.stats.Arm > enemystats.stats.Ref){
		Edef = Math.ceil(Math.random()*(enemystats.stats.Arm - enemystats.stats.Ref) * enemystats.stats.Ref);
	}else{
		Edef = enemystats.stats.Arm;
	}
	getattack(Edef);
	Edamagecalc(Pdef);
}

function PDamagecalc(skill, Edef){
	
	attack = playerskills[skill].AName; //gets skill name
	PAdvChk = checkadvantage(playerstats.Element, enemystats.Element); //checks element advantage
	var attacking = playerskills.find(item => item.AName === attack); //assigns a variable for skill
	playerstats.stats.HitChance = Math.floor((playerstats.stats.Acc / enemystats.stats.Ref) * 100); //gets chance to hit
	if(playerstats.stats.HitChance > 100){playerstats.stats.HitChance = 100;}//sets hit chance to 100 if greater than 100
	var PHitCheck = Math.floor(Math.random()*100)+1; 
	
	
	//check for player hit
	if (PHitCheck <= playerstats.stats.HitChance){
		var Statuschk = Math.floor(Math.random()*100)+1;
		if(Statuschk <= 10){
			ApplyStatus(playerstats.Element, enemystats, enemystats.Nam);
		}
		if(playerstats.stats.Str > playerstats.stats.Acc){
			//base damage calc
			if(attacking.BoostedClass == playerstats.Nam){
				Pdam = Math.floor(((Math.floor(Math.random()*(playerstats.stats.Str - playerstats.stats.Acc + 1)) + playerstats.stats.Acc) * attacking.DamMult * PAdvChk)*1.5);
			}else{
				Pdam = Math.floor((Math.floor(Math.random()*(playerstats.stats.Str - playerstats.stats.Acc + 1)) + playerstats.stats.Acc) * attacking.DamMult * PAdvChk);
			}
		}else{
			if(attacking.BoostedClass == playerstats.Nam){
				Pdam = Math.floor((playerstats.stats.Str * attacking.DamMult * PAdvChk) * 1.5);
			}else{
				Pdam = Math.floor(playerstats.stats.Str * attacking.DamMult * PAdvChk);
			}
		}
		Pdam -= Math.floor((Pdam * playerstats.Status.weakweak) + (Pdam * playerstats.Status.burnweak)); 
		//calculate damage multiplier
		PdamMult = Pdam / (Pdam + Edef);
		//calculate damage dealt
		PdamTot = Math.ceil(Pdam * PdamMult);
		playerstats.stats.Damage = PdamTot;
		//store damage to enemy
		enemystats.stats.DamageDealt += playerstats.stats.Damage;
	}
	playerstats.stats.Mana -= attacking.ManaCost;
	if(playerstats.Status.weakened == true){
		var curechk = Math.floor(Math.random()*100)+1;
		if(curechk <= 10){
			playerstats.Status.weakened = false;
			document.getElementById("ActLog").value += '\n' + playerstats.PlayerName + " was cured of weakness!";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
		}
	}
}

function Edamagecalc(Pdef){
var EAdvChk = checkadvantage(enemystats.Element, playerstats.Element);
	enemystats.stats.HitChance = Math.floor((enemystats.stats.Acc / playerstats.stats.Ref) * 100);
	if(enemystats.stats.HitChance > 100){enemystats.stats.HitChance = 100;}
	var EHitCheck = Math.floor(Math.random()*100)+1;
	if (EHitCheck <= enemystats.stats.HitChance){
		var Statuschk = Math.floor(Math.random()*100)+1;
		if(Statuschk <= 10){
			ApplyStatus(enemystats.Element, playerstats, playerstats.PlayerName);
		}
		if(enemystats.stats.Str > enemystats.stats.Acc){
			var Edam = Math.floor((Math.floor(Math.random() * (enemystats.stats.Str - enemystats.stats.Acc +1)) + enemystats.stats.Acc) * EAdvChk);
		}else{
			Edam = Math.floor(enemystats.stats.Str  * EAdvChk);
		}
		Edam -= Math.floor((Edam * enemystats.Status.weakweak) + (Edam * enemystats.Status.burnweak));

			EdamMult = Edam / (Edam + Pdef);
			EdamTot = Math.ceil(Edam *EdamMult);
			enemystats.stats.Damage = EdamTot;
			playerstats.stats.DamageDealt += enemystats.stats.Damage;
	}
	if(enemystats.Status.weakened == true){
		var curechk = Math.floor(Math.random()*100)+1;
		if(curechk <= 10){
			enemystats.Status.weakened = false;
			document.getElementById("ActLog").value += '\n' + enemystats.Nam + " was cured of weakness!";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
		}
	}
}

function ApplyStatus(AElement, Eff, Afflicted){
	if(AElement == "Fire" && Eff.Status.burned == false){
		Eff.Status.burned = true;

		Eff.Status.burnweak = .05;
		Eff.Status.burndamage = .05;
		document.getElementById("ActLog").value += '\n' + Afflicted + " was burned!";
		document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
	}
	if(AElement == "Water" && Eff.Status.weakened == false){
		Eff.Status.weakened = true;

		Eff.Status.weakweak = .1;
		document.getElementById("ActLog").value += '\n' + Afflicted + " was weakened!";
		document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
	}
	if(AElement == "Nature" && Eff.Status.poisoned == false){
		Eff.Status.poisoned = true;

		Eff.Status.poisondamage = .1;
		document.getElementById("ActLog").value += '\n' + Afflicted + " was poisoned!";
		document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
	}
}

function battle(){
	while(playerstats.stats.CurrentHealth > 0 && enemystats.stats.CurrentHealth > 0){
	if(playerstats.stats.CurrentHealth <= playerstats.stats.Health * .5){
		if(playerstats.stats.Mana >= skills[4].ManaCost && playerskills[4].AName != ""){
			Healskill(4);
		}else{
			if(playerstats.inv.healthpotcount > 0){
				playerstats.stats.DamageDealt -= Math.floor(playerstats.stats.Health * .30);
				if(playerstats.stats.DamageDealt <= 0){playerstats.stats.DamageDealt = 0;} 
				playerstats.inv.healthpotcount--;
				document.getElementById("ActLog").value += '\n' + "Health Potion used! " + playerstats.inv.healthpotcount + " potions remaining";
				document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
			}
		}

	}
	if(playerstats.stats.Mana <= playerstats.stats.MaxMana * .5 && playerstats.inv.manapotcount > 0){
		playerstats.stats.Mana += Math.floor(playerstats.stats.MaxMana * .3);
		playerstats.inv.manapotcount--;
		document.getElementById("ActLog").value += '\n' + "Mana Potion used! " + playerstats.inv.manapotcount + " potions remaining";
		document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
	}
	defensechk();
	
	if(playerstats.Status.poisoned == true){
		playerstats.stats.DamageDealt += Math.floor(playerstats.stats.CurrentHealth * playerstats.Status.poisondamage);
		var curechk = Math.floor(Math.random()*100)+1;
		if(curechk <= 10){
			playerstats.Status.poisoned = false;
			document.getElementById("ActLog").value += '\n' + playerstats.PlayerName + " was cured of posioning!";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;			
		}
	}
	if(enemystats.Status.poisoned == true){
		enemystats.stats.DamageDealt += Math.floor(enemystats.stats.CurrentHealth * enemystats.Status.poisondamage);
		var curechk = Math.floor(Math.random()*100)+1;
		if(curechk <= 10){
			enemystats.Status.poisoned = false;
			document.getElementById("ActLog").value += '\n' + enemystats.Nam + " was cured of poisoning!";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
		}
	}
	if(playerstats.Status.burned == true){
		playerstats.stats.DamageDealt += Math.floor(playerstats.stats.CurrentHealth * playerstats.Status.burndamage);
		var curechk = Math.floor(Math.random()*100)+1;
		if(curechk <= 10){
			playerstats.Status.burned = false;
			document.getElementById("ActLog").value += '\n' + playerstats.PlayerName + " was cured of their burn!";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;			
		}
	}
	if(enemystats.Status.burned == true){
		enemystats.stats.DamageDealt += Math.floor(enemystats.stats.CurrentHealth * enemystats.Status.burndamage);
		var curechk = Math.floor(Math.random()*100)+1;
		if(curechk <= 10){
			enemystats.Status.burned = false;
			document.getElementById("ActLog").value += '\n' + enemystats.Nam + " was cured of their burn!";
			document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;			
		}
	}
	
	playerstats.stats.CurrentHealth = playerstats.stats.Health - playerstats.stats.DamageDealt;
	enemystats.stats.CurrentHealth = enemystats.stats.Health - enemystats.stats.DamageDealt;
	if(playerstats.stats.Mana < playerstats.stats.MaxMana){
		playerstats.stats.Mana += playerstats.stats.Managain;
	}
	calculate_Pstats();
	var Etype = enemies.find(item => item.Ename === enemystats.Nam);
	enemystats.stats.Health = Etype.EHealth + (Etype.EHealth * enemystats.stats.HealthPts);
	drawbattlescreen();
	if(enemystats.stats.CurrentHealth <= 0){
		WinBattle();
	}
	if(playerstats.stats.CurrentHealth <= 0){
		battling = false;
		clearInterval(Mainloop);
		clearTimeout(battloop);
		clearTimeout(battanim);
		Mainloop = null;
		battloop = null;
		battanim = null;
		LoseBattle();
	}
		if(battling == true){
		battloop = setTimeout(battle,500);
		battanim = setTimeout(battanimation,500);
		clearInterval(Mainloop);
	}
	drawbattlescreen();
	
	}
}

function Statup(){

	while(playerstats.stats.StatPts > 0){
		StatPrefChk = Math.floor(Math.random()*100)+1;
		if(StatPrefChk <= 66){
			var GetStatToRaise = Math.floor(Math.random()*Pclass.FocusStats.length);
				playerstats.stats[Pclass.FocusStats[GetStatToRaise]]++;
				playerstats.stats.StatPts--;
		}else{
				var stat = Math.floor(Math.random()*6)+1;
				if(stat == 1 && Pclass.AvoidedStat.includes("PHealth") == false){
					playerstats.stats.HealthPts++;
					playerstats.stats.StatPts--;
				}
				if(stat == 2 && Pclass.AvoidedStat.includes("PStrength") == false){
					playerstats.stats.StrengthPts++;
					playerstats.stats.StatPts--;
				}
				if(stat == 3 && Pclass.AvoidedStat.includes("PAccuracy") == false){
					playerstats.stats.AccuracyPts++;
					playerstats.stats.StatPts--;
				}
				if(stat == 4 && Pclass.AvoidedStat.includes("PArmor") == false){
					playerstats.stats.ArmorPts++;
					playerstats.stats.StatPts--;
				}
				if(stat == 5 && Pclass.AvoidedStat.includes("PReflexes") == false){
					playerstats.stats.ReflexesPts++;
					playerstats.stats.StatPts--;
				}
			}
	}
	calculate_Pstats();
}

function NamePlayer(){
	playerstats.PlayerName = Pclass.Pdefname;
	playerstats.PlayerName = prompt("Name Your Dood",playerstats.PlayerName);
}

function CheckEvent(){
	if(playerstats.stats.Level == playerstats.RebirthLevel){
		document.getElementById("RebirthButt").style.display = "block";
		rebirth();
	}
	if(battling == false && lose == false){
	var eventchk = Math.floor(Math.random()*100)+1;
	if (eventchk <= 75){
		var eventType = Math.floor(Math.random()*3)+1;
		if(eventType == 3){
			itemstats();
		}
		if(eventType == 2){
			battlescreen();
		}
		if(eventType == 1){
			goldGet();
		}
	}
	}
}

function goldGet(){
	var goldmult = playerstats.stats.Level * (Math.floor(Math.random()* playerstats.stats.goldmultiplier)+1);
	var goldgained = Math.floor(Math.pow(1.03, playerstats.stats.Level) * (((Math.random()*3)+1) * goldmult));
	playerstats.inv.Gold += goldgained;
	document.getElementById("ActLog").value += '\n' + 'Found ' + goldgained + ' gold';
	document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
	document.getElementById("CurGold").innerHTML = "Current Gold: " + playerstats.inv.Gold;
}

function WinBonus(){
	
	if(enemystats.stats.BonusOnDefeat.includes("HealthPts") && Pclass.AvoidedStat.includes("PHealth")==false){
		playerstats.stats.HealthPts++
	}
	if(enemystats.stats.BonusOnDefeat.includes("StrengthPts") && Pclass.AvoidedStat.includes("PStrength")==false){
		playerstats.stats.StrengthPts++
	}
	if(enemystats.stats.BonusOnDefeat.includes("AccuracyPts") && Pclass.AvoidedStat.includes("PAccuracy")==false){
		playerstats.stats.AccuracyPts++
	}
	if(enemystats.stats.BonusOnDefeat.includes("ArmorPts") && Pclass.AvoidedStat.includes("PArmor")==false){
		playerstats.stats.ArmorPts++
	}
	if(enemystats.stats.BonusOnDefeat.includes("ReflexesPts") && Pclass.AvoidedStat.includes("PReflexes")==false){
		playerstats.stats.ReflexesPts++
	}
	calculate_Pstats();
	drawbattlescreen();
	
}

function ClickAttack(){
	if(battling == true){
		var clickDam = ManualAttack.ClickStr * ManualAttack.DamMult;
		enemystats.stats.DamageDealt += clickDam;
		enemystats.stats.CurrentHealth = enemystats.stats.Health - enemystats.stats.DamageDealt;
		var Etype = enemies.find(item => item.Ename === enemystats.Nam);
		enemystats.stats.Health = Etype.EHealth + (Etype.EHealth * enemystats.stats.HealthPts);
		drawbattlescreen();
		if(enemystats.stats.CurrentHealth <= 0){
			WinBattle();
		}
	}
}

function UpgradeClickAtk(){
		if(playerstats.inv.Gold >= ManualAttack.UpgCost){
			ManualAttack.ClickStr++;
			document.getElementById("ClkAtk").innerHTML = "Click Damage: " + ManualAttack.ClickStr;
			playerstats.inv.Gold -= ManualAttack.UpgCost;
			ManualAttack.UpgCost += Math.floor(ManualAttack.BaseCost * Math.pow(ManualAttack.CostMult, ManualAttack.UpgNum));
			document.getElementById("UpgradeButt").innerHTML = "Upgrade Click:" + ManualAttack.UpgCost + ". + 1 Click Damage";
			document.getElementById("CurGold").innerHTML = "Current Gold: " + playerstats.inv.Gold;
			

		}
}
 
function WinBattle(){
	
	enemystats.stats.DamageDealt = 0;
	playerstats.stats.StatPts++;
	playerstats.stats.Level++;
	document.title = "DOOD " + playerstats.stats.Level;
	if(playerstats.stats.Mana < playerstats.stats.MaxMana){
		playerstats.stats.Mana += playerstats.stats.ManagainAK;
	}
	playerstats.stats.StrengthPts++;
	playerstats.stats.HealthPts++;
	playerstats.stats.AccuracyPts++;
	playerstats.stats.ArmorPts++;
	playerstats.stats.ReflexesPts++;
	enemystats.Status.burned = false;
	enemystats.Status.weakened = false;
	enemystats.Status.posioned = false;
	enemystats.Status.burntime = 0;
	enemystats.Status.poisontime = 0;
	enemystats.Status.weaktime = 0;
	Statup();
	WinBonus();
	battling = false;
	document.getElementById("ActLog").value += '\n' + 'Enemy Defeated!';
	document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
	Mainloop = setInterval(function(){idleanim();CheckEvent();}, 500);
	
	clearTimeout(battloop);
 }
 
function LoseBattle(){
	battling = false;
	lose = true;
	document.getElementById("ActLog").value += '\n' + 'You Were Defeated by a ' + enemystats.Nam;
	document.getElementById("ActLog").scrollTop = document.getElementById("ActLog").scrollHeight;
		clearInterval(Mainloop);
		clearTimeout(battloop);
		clearTimeout(battanimation);
		Mainloop = null;
		battloop = null;
		battanimation = null;
	document.title = "YOU LOSE " + playerstats.stats.Level;
 }

function ManualStats(stat){
	if(playerstats.inv.Gold >= playerstats['stats'][stat + 'Cost']){
		var manstatup = Math.floor((playerstats['stats'][stat + 'UpgNum'])/5)+1;	
		
		playerstats['stats'][stat] += manstatup;
		calculate_Pstats();
		drawbattlescreen();
		playerstats.inv.Gold -= playerstats['stats'][stat + 'Cost'];
		playerstats['stats'][stat + 'Cost'] += Math.floor(100 * Math.pow(1.01, playerstats['stats'][stat + 'UpgNum']));
		playerstats['stats'][stat + 'UpgNum']++;
		manstatup = Math.floor((playerstats['stats'][stat + 'UpgNum'])/5)+1;
		
		var statname = stat.replace("Pts","");
		if(statname == "Health"){
			boostamount = Pclass.PHealth * playerstats.stats.HealthMod * manstatup;
		}
		if(statname == "Strength"){
			boostamount = playerstats.stats.StrMod * manstatup;
		}
		if(statname == "Accuracy"){
			boostamount = playerstats.stats.AccMod * manstatup;
		}
		if(statname == "Armor"){
			boostamount = playerstats.stats.ArmMod * manstatup;
		}
		if(statname == "Reflexes"){
			boostamount = playerstats.stats.RefMod * manstatup;
		}
		
		document.getElementById(stat).innerHTML = "Upgrade " + statname + ": " + playerstats['stats'][stat + 'Cost'] + " Gold + " + boostamount + " " + statname;
		document.getElementById("CurGold").innerHTML = "Current Gold: " + playerstats.inv.Gold;

	}
 }
 
function AtkUpgrade(Atk){
	var Skill = playerskills.find(item => item.AName === Atk);
	var index = skills.findIndex(item => item.AName === Atk);

	if(Skill == undefined && skills[index].UpgCost <= playerstats.inv.Gold){
		var Skillfind = skills.find(item => item.AName === Atk);
		playerskills[index] = Skillfind;
		playerskills[index].Level = 1;
		if(playerskills[index].DamMult > 0){
			document.getElementById(Atk).innerHTML = "Upgrade " + Atk + ": " + playerskills[index].UpgCost + " gold + 10% Damage";
		}
		else{
			document.getElementById(Atk).innerHTML = "Upgrade " + Atk + ": " + playerskills[index].UpgCost + " gold + 10% Healing"
		}
		playerstats.inv.Gold -= playerskills[index].UpgCost;
	}else{
		if(playerskills[index].UpgCost <= playerstats.inv.Gold){
			playerskills[index].UpgNum++;
			playerskills[index].UpgCost += Math.floor(100 * Math.pow(1.01, playerskills[index].UpgNum));
			if(playerskills[index].DamMult > 0){
				playerskills[index].DamMult += (playerskills[index].DamMult * .1);
				document.getElementById(Atk).innerHTML = "Upgrade " + Atk + ": " + playerskills[index].UpgCost + " gold + 10% Damage";
				MinMaxDam(playerskills[index].AName);
				document.getElementById(Atk+'Dam').innerHTML = "Damage Range:" + skillmindam + "-" + skillmaxdam + " Mana Cost: " + playerskills[index].ManaCost;
			}
			else{
				playerskills[index].HealMult += (playerskills[index].HealMult * .1);
				document.getElementById(Atk).innerHTML = "Upgrade " + Atk + ": " + playerskills[index].UpgCost + " gold + 10% Healing";
				document.getElementById(Atk+'Dam').innerHTML = "Heal Amount:" + Math.floor((playerstats.stats.Health * .3) * playerskills[index].HealMult) + " Mana Cost: " + playerskills[index].ManaCost;
			}
			playerstats.inv.Gold -= playerskills[index].UpgCost;
			
		}
	}
	document.getElementById("CurGold").innerHTML = "Current Gold: " + playerstats.inv.Gold;

}
 
function MinMaxDam(skill){
	var skillchk = playerskills.find(item => item.AName === skill)
	if(enemystats.Element != ""){
	var PAdvChk = checkadvantage(playerstats.Element, enemystats.Element);
	}else{
		PAdvChk = 1;
	}
	maxskilldamchk = playerstats.stats.Str * skillchk.DamMult * PAdvChk;
	minskilldamchk = playerstats.stats.Acc * skillchk.DamMult * PAdvChk;
	if(skillchk.BoostedClass == playerstats.Nam){
		maxskilldamchk *= 1.5;
		minskilldamchk *= 1.5;
	}
	if(enemystats.stats.Arm <= enemystats.stats.Ref){
		var dammult = maxskilldamchk / (maxskilldamchk + enemystats.stats.Arm);
		skillmaxdam = Math.ceil(maxskilldamchk * dammult);
	}else{
		var dammult = maxskilldamchk / (maxskilldamchk + enemystats.stats.Ref);
		skillmaxdam = Math.ceil(maxskilldamchk * dammult);
	}
	if(playerstats.stats.Str <= playerstats.stats.Acc){
		skillmindam = skillmaxdam;
	}else{
		dammult = minskilldamchk / (minskilldamchk + enemystats.stats.Arm);
		skillmindam = Math.ceil(minskilldamchk * dammult);
	}
}

function rebirth(){
	if(confirm('Reset to Level 1? stats will increase faster!')){
		battling = false;
		clearInterval(Mainloop);
		clearTimeout(battloop);
		clearTimeout(battanimation);
		playerstats.stats.Level = 1;
		playerstats.stats.HealthPts = 0;
		playerstats.stats.StrengthPts = 0;
		playerstats.stats.AccuracyPts = 0;
		playerstats.stats.ArmorPts = 0;
		playerstats.stats.ReflexesPts = 0;
		playerstats.DamageDealt = 0;
		calculate_Pstats();
		Object.assign(playerstats.Status, Defaultplayerstats.Status);
		Object.assign(playerstats.inv, Defaultplayerstats.inv);
		playerstats.statmult *= 1.2;
		playerstats.RebirthLevel *= 1.2;
		enemystats.stats.DamageDealt = 0;
		battling = false;
		document.getElementById("RebirthButt").style.display = "none";
		document.getElementById("ActLog").value = "";
		Mainloop = setInterval(function(){idleanim();CheckEvent();}, 500);
		
	}
	else{
		
	}
}

 
//==============================End of gameplay============================

//==============================Begin Drawing==============================


// Canvas Image Initiation
var ClasImg = new Image();
var ClasElem = new Image();
var EnemImg = new Image();
var EnemElem = new Image();
var BckgImg = new Image();

var c;
var ctx;
var c2;
var ctx2;

var c3;
var ctx3;
var c4;
var ctx4;
//playerstats
var PBattHealth;
var PBattHealthtx;
var PBattStr;
var PBattStrtx;
var PBattAcc;
var PBattAcctx;
var PBattArm;
var PBattArmtx;
var PBattRef;
var PBattReftx;
var PBattMan;
var PBattMantx;
var StatBkg;
var StatBkgtx;
var NamBkg;
var NamBkgtx;
var EnemyCan;
var EnemyCantx;
var c6;
var ctx6;

//Canvas Image Variables

//Player Image
var ClasX = 0;
var ClasY = 25;
var ClasW = 200;
var ClasH = 200;

//Enemy Image
var EnemX = 600;
var EnemY = 25;
var EnemW = 200;
var EnemH = 200;

//Background Image
var BckgX = 0;
var BckgY = 0;
var BckgW = 800;
var BckgH = 250;

function Main(){

	c = document.getElementById("BattleScreen");
	ctx = c.getContext("2d");
	c2 = document.getElementById("BattleScreenBkg");
	ctx2 = c2.getContext("2d");
	c3 = document.getElementById("Charnames");
	ctx3 = c3.getContext("2d");
	//c4 = document.getElementById("Enemynames");
	//ctx4 = c4.getContext("2d");
	//c5 = document.getElementById("EnemyStats");
	//ctx5 = c5.getContext("2d");
	EnemyCan = document.getElementById("EnemyCanvas");	
	EnemyCantx = EnemyCan.getContext("2d");


	PBattHealth = document.getElementById("PBattHealth");
	PBattHealthtx = PBattHealth.getContext("2d");
	PBattStr = document.getElementById("PBattStr");
	PBattStrtx = PBattStr.getContext("2d");
	PBattAcc = document.getElementById("PBattAcc");
	PBattAcctx = PBattAcc.getContext("2d");
	PBattArm = document.getElementById("PBattArm");
	PBattArmtx = PBattArm.getContext("2d");
	PBattRef = document.getElementById("PBattRef");
	PBattReftx = PBattRef.getContext("2d");
	PBattMan = document.getElementById("PBattMan");
	PBattMantx = PBattMan.getContext("2d");
	PBattElem = document.getElementById("PBattElem");
	PBattElemtx = PBattElem.getContext("2d");
	
	EBattHealth = document.getElementById("EBattHealth");
	EBattHealthtx = EBattHealth.getContext("2d");
	EBattStr = document.getElementById("EBattStr");
	EBattStrtx = EBattStr.getContext("2d");
	EBattAcc = document.getElementById("EBattAcc");
	EBattAcctx = EBattAcc.getContext("2d");
	EBattArm = document.getElementById("EBattArm");
	EBattArmtx = EBattArm.getContext("2d");
	EBattRef = document.getElementById("EBattRef");
	EBattReftx = EBattRef.getContext("2d");
	EBattElem = document.getElementById("EBattElem");
	EBattElemtx = EBattElem.getContext("2d");
	
	
	StatBkg = document.getElementById("StatBkg");
	StatBkgtx = StatBkg.getContext("2d");
	NamBkg = document.getElementById("NamBkg");
	NamBkgtx = NamBkg.getContext("2d");
	
	drawbattlescreen();
	/*
	if(battling == false && lose == false){
		Mainloop = setInterval(function(){idleanim();CheckEvent();}, 500);
	}else{
		clearInterval(Mainloop);
		Mainloop = null;
	}
	*/
	//this is for rapid testing
	
	while(battling == false && lose == false){
		CheckEvent();
	}
}



function drawbattlescreen(){
	ClasY = 15;
	ctx3.clearRect(0,0,800,40);
	
	EBattHealthtx.clearRect(0,0,350,40);
	EBattStrtx.clearRect(0,0,350,40);
	EBattAcctx.clearRect(0,0,350,40);
	EBattArmtx.clearRect(0,0,350,40);
	EBattReftx.clearRect(0,0,350,40);
	if(battling == false){
		EBattElemtx.clearRect(0,0,250,250);
	}
	
	PBattHealthtx.clearRect(0,0,350,40);
	PBattStrtx.clearRect(0,0,350,40);
	PBattAcctx.clearRect(0,0,350,40);
	PBattArmtx.clearRect(0,0,350,40);
	PBattReftx.clearRect(0,0,350,40);
	PBattMantx.clearRect(0,0,350,40);

	
	
	
	
	ClasImg.src = 'Sprites/' + playerstats.Nam + '.svg';
	ClasImg.onload = function(){
		ctx.drawImage(ClasImg, ClasX,ClasY,ClasW,ClasH);
	}
	ClasElem.src = 'Sprites/' + playerstats.Element + '.svg'
	ClasElem.onload = function(){
		PBattElemtx.drawImage(ClasElem,0,0,250,250);
	}
	
	if(battling == false && lose == false){EnemImg.src = ''; EnemElem.src = '';}
	else{EnemImg.src = 'Sprites/' + enemystats.Nam + '.svg'; 
		EnemElem.src = 'Sprites/' + enemystats.Element + '.svg';

	}
	
	EnemImg.onload=function(){
		EnemyCantx.drawImage(EnemImg, EnemX,EnemY,EnemW,EnemH);
	}
	
	EnemElem.onload=function(){
		EBattElemtx.drawImage(EnemElem,0,0,250,250);
	}
	
	
	
	BckgImg.src = 'Sprites/' + areas[battlearea].name +  '.jpg';
	BckgImg.onload=function(){
		ctx2.drawImage(BckgImg, BckgX,BckgY,BckgW,BckgH);
	}
	StatBkgtx.fillStyle = "rgb(70,75,85)";
	StatBkgtx.fillRect(0,0,800,500);
	NamBkgtx.fillStyle = "rgb(70,75,85)";
	NamBkgtx.fillRect(0,0,800,40);

	
	//name Bar Text
	ctx3.font = "30px Arial";
	ctx3.fillStyle = 'white';
	
	
	ctx3.fillText(playerstats.PlayerName + " Level " + playerstats.stats.Level + " " + playerstats.Nam, 5,30);
	ctx3.strokeText(playerstats.PlayerName + " Level " + playerstats.stats.Level + " " + playerstats.Nam, 5,30);
	
	//Character Stats	
	PBattStrtx.font = "40px Arial";
	if(playerstats.stats.StrMod >= 2){PBattStrtx.fillStyle = "green";};
	if(playerstats.stats.StrMod == 1){PBattStrtx.fillStyle = "white";};
	if(playerstats.stats.StrMod == 0){PBattStrtx.fillStyle = "red";};
	
	PBattAcctx.font = "40px Arial";
	if(playerstats.stats.AccMod >= 2){PBattAcctx.fillStyle = "green";};
	if(playerstats.stats.AccMod == 1){PBattAcctx.fillStyle = "white";};
	if(playerstats.stats.AccMod == 0){PBattAcctx.fillStyle = "red";};

	PBattArmtx.font = "40px Arial";
	if(playerstats.stats.ArmMod >= 2){PBattArmtx.fillStyle = "green";};
	if(playerstats.stats.ArmMod == 1){PBattArmtx.fillStyle = "white";};
	if(playerstats.stats.ArmMod == 0){PBattArmtx.fillStyle = "red";};

	PBattReftx.font = "40px Arial";
	if(playerstats.stats.RefMod >= 2){PBattReftx.fillStyle = "green";};
	if(playerstats.stats.RefMod == 1){PBattReftx.fillStyle = "white";};
	if(playerstats.stats.RefMod == 0){PBattReftx.fillStyle = "red";};
	
	PBattMantx.font = "40px Arial";
	PBattMantx.fillStyle = "white";

	
	PBattHealthtx.font = "40px Arial";
	PBattHealthtx.fillStyle = 'white';
	
	PBattHealthtx.fillText("Health: " + playerstats.stats.CurrentHealth, 5,30);
	PBattHealthtx.strokeText("Health: " + playerstats.stats.CurrentHealth, 5,30);
	
	PBattStrtx.fillText("Strength: " + playerstats.stats.Str, 5,30);
	PBattStrtx.strokeText("Strength: " + playerstats.stats.Str, 5,30);

	PBattAcctx.fillText("Accuracy: " + playerstats.stats.Acc, 5,30);
	PBattAcctx.strokeText("Accuracy: " + playerstats.stats.Acc, 5,30);	
	
	PBattArmtx.fillText("Armor: " + playerstats.stats.Arm, 5,30);
	PBattArmtx.strokeText("Armor: " + playerstats.stats.Arm, 5,30);	
	
	PBattReftx.fillText("Reflexes: " + playerstats.stats.Ref, 5,30);
	PBattReftx.strokeText("Reflexes: " + playerstats.stats.Ref, 5,30);
	
	PBattMantx.fillText("Mana: " + playerstats.stats.Mana + "/" + playerstats.stats.MaxMana, 5,30);
	PBattMantx.strokeText("Mana: " + playerstats.stats.Mana + "/" + playerstats.stats.MaxMana, 5,30);

	
	//Enemy Stats
	EBattStrtx.font = "40px Arial";
	EBattStrtx.fillStyle = "white";
	
	EBattAcctx.font = "40px Arial";
	EBattAcctx.fillStyle = "white";

	EBattArmtx.font = "40px Arial";
	EBattArmtx.fillStyle = "white";

	EBattReftx.font = "40px Arial";
	EBattReftx.fillStyle = "white";



	EBattHealthtx.font = "40px Arial";
	EBattHealthtx.fillStyle = 'white';
	
	EBattHealthtx.fillText("Health: " + enemystats.stats.CurrentHealth, 5,30);
	EBattHealthtx.strokeText("Health: " + enemystats.stats.CurrentHealth, 5,30);
	
	EBattStrtx.fillText("Strength: " + enemystats.stats.Str, 5,30);
	EBattStrtx.strokeText("Strength: " + enemystats.stats.Str, 5,30);

	EBattAcctx.fillText("Accuracy: " + enemystats.stats.Acc, 5,30);
	EBattAcctx.strokeText("Accuracy: " + enemystats.stats.Acc, 5,30);	
	
	EBattArmtx.fillText("Armor: " + enemystats.stats.Arm, 5,30);
	EBattArmtx.strokeText("Armor: " + enemystats.stats.Arm, 5,30);	
	
	EBattReftx.fillText("Reflexes: " + enemystats.stats.Ref, 5,30);
	EBattReftx.strokeText("Reflexes: " + enemystats.stats.Ref, 5,30);

	ctx.stroke();

}

function idleanim(){
	ctx.clearRect(0,0,c.width,c.height);
	ClasY = 15;
	ctx.drawImage(ClasImg, ClasX,ClasY,ClasW,ClasH);
	ctx.drawImage(EnemImg, EnemX,EnemY,EnemW,EnemH);
	setTimeout(function(){

	ctx.clearRect(0,0,c.width,c.height);
	ClasY = 25;
	ctx.drawImage(ClasImg, ClasX,ClasY,ClasW,ClasH);
	ctx.drawImage(EnemImg, EnemX,EnemY,EnemW,EnemH);
	},250);
	
	
	
}

function battanimation(){
	ClasY = 15;
	ctx.clearRect(0,0,c.width,c.height);
	ClasX += 100;
	EnemX -= 100;
	ctx.drawImage(ClasImg, ClasX,ClasY,ClasW,ClasH);
	ctx.drawImage(EnemImg, EnemX,EnemY,EnemW,EnemH);
	setTimeout(function(){

	ctx.clearRect(0,0,c.width,c.height);
	ClasX -= 100;
	EnemX += 100;
	ctx.drawImage(ClasImg, ClasX,ClasY,ClasW,ClasH);
	ctx.drawImage(EnemImg, EnemX,EnemY,EnemW,EnemH);
	},250);
}


function PdamDraw(){
	
}

function EdamDraw(){
	
}
