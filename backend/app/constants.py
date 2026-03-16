SYSTEM_PROMPT_VERSION = "v1"

SYSTEM_PROMPT = """
You are Aether, the guide of an RPG-style platform that teaches people how to think critically about AI.
Your mission is to help users understand AI systems, limits, risks, and good habits.

Rules:
- explain clearly and simply
- never pretend to know something you do not know
- encourage source checking and critical thinking
- mention risks like hallucinations, bias, privacy leaks, deepfakes, and automation abuse when relevant
- adapt the tone to a game-like learning platform without becoming childish
- finish with one practical action when possible
- answer in the same language as the user when possible
- remember that this platform is meant to raise AI awareness, not just answer blindly
"""

DEFAULT_ACCOUNT_TIERS = [
    {
        "code": "explorer",
        "name": "Explorer",
        "description": "Free tier for new players discovering AI basics.",
        "monthly_message_limit": 40,
        "can_access_advanced_quests": False,
    },
    {
        "code": "ranger",
        "name": "Ranger",
        "description": "Mid-tier account with more chat capacity and deeper quests.",
        "monthly_message_limit": 250,
        "can_access_advanced_quests": True,
    },
    {
        "code": "archmage",
        "name": "Archmage",
        "description": "Top-tier account for power users and advanced content.",
        "monthly_message_limit": 2000,
        "can_access_advanced_quests": True,
    },
]

DEFAULT_LEVELS = [
    {"level": 1, "title": "Initiate", "min_xp": 0, "badge": "seed"},
    {"level": 2, "title": "Scout", "min_xp": 120, "badge": "lantern"},
    {"level": 3, "title": "Analyst", "min_xp": 280, "badge": "lens"},
    {"level": 4, "title": "Sentinel", "min_xp": 520, "badge": "shield"},
    {"level": 5, "title": "Strategist", "min_xp": 900, "badge": "sigil"},
    {"level": 6, "title": "Archon", "min_xp": 1400, "badge": "crown"},
]

DEFAULT_QUESTS = [
    {
        "slug": "hallucination-hunt",
        "title": "Hallucination Hunt",
        "theme": "Reliability",
        "description": "Learn to spot when an AI invents facts or sources.",
        "difficulty": "easy",
        "xp_reward": 120,
        "advanced_only": False,
    },
    {
        "slug": "bias-detector",
        "title": "Bias Detector",
        "theme": "Bias",
        "description": "Train users to identify skewed answers and unfair assumptions.",
        "difficulty": "medium",
        "xp_reward": 180,
        "advanced_only": False,
    },
    {
        "slug": "privacy-guardian",
        "title": "Privacy Guardian",
        "theme": "Privacy",
        "description": "Show which personal data should never be dropped into a model.",
        "difficulty": "medium",
        "xp_reward": 220,
        "advanced_only": True,
    },
    {
        "slug": "deepfake-siege",
        "title": "Deepfake Siege",
        "theme": "Media literacy",
        "description": "Teach users how to question AI-generated audio, images, and video.",
        "difficulty": "hard",
        "xp_reward": 280,
        "advanced_only": True,
    },
]
