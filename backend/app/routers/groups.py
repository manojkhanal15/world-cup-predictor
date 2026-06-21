from fastapi import APIRouter

router = APIRouter(prefix="/api/groups", tags=["groups"])

# FIFA World Cup 2026 Groups
GROUPS_DATA = {
    "A": {
        "name": "Group A",
        "teams": [
            {"name": "Mexico", "code": "MEX", "flag": "🇲🇽", "confederation": "CONCACAF"},
            {"name": "South Korea", "code": "KOR", "flag": "🇰🇷", "confederation": "AFC"},
            {"name": "South Africa", "code": "RSA", "flag": "🇿🇦", "confederation": "CAF"},
            {"name": "Czechia", "code": "CZE", "flag": "🇨🇿", "confederation": "UEFA"},
        ],
    },
    "B": {
        "name": "Group B",
        "teams": [
            {"name": "Canada", "code": "CAN", "flag": "🇨🇦", "confederation": "CONCACAF"},
            {"name": "Switzerland", "code": "SUI", "flag": "🇨🇭", "confederation": "UEFA"},
            {"name": "Qatar", "code": "QAT", "flag": "🇶🇦", "confederation": "AFC"},
            {"name": "Bosnia and Herzegovina", "code": "BIH", "flag": "🇧🇦", "confederation": "UEFA"},
        ],
    },
    "C": {
        "name": "Group C",
        "teams": [
            {"name": "Brazil", "code": "BRA", "flag": "🇧🇷", "confederation": "CONMEBOL"},
            {"name": "Morocco", "code": "MAR", "flag": "🇲🇦", "confederation": "CAF"},
            {"name": "Scotland", "code": "SCO", "flag": "🏴", "confederation": "UEFA"},
            {"name": "Haiti", "code": "HAI", "flag": "🇭🇹", "confederation": "CONCACAF"},
        ],
    },
    "D": {
        "name": "Group D",
        "teams": [
            {"name": "United States", "code": "USA", "flag": "🇺🇸", "confederation": "CONCACAF"},
            {"name": "Paraguay", "code": "PAR", "flag": "🇵🇾", "confederation": "CONMEBOL"},
            {"name": "Australia", "code": "AUS", "flag": "🇦🇺", "confederation": "AFC"},
            {"name": "Türkiye", "code": "TUR", "flag": "🇹🇷", "confederation": "UEFA"},
        ],
    },
    "E": {
        "name": "Group E",
        "teams": [
            {"name": "Germany", "code": "GER", "flag": "🇩🇪", "confederation": "UEFA"},
            {"name": "Ecuador", "code": "ECU", "flag": "🇪🇨", "confederation": "CONMEBOL"},
            {"name": "Ivory Coast", "code": "CIV", "flag": "🇨🇮", "confederation": "CAF"},
            {"name": "Curacao", "code": "CUW", "flag": "🇨🇼", "confederation": "CONCACAF"},
        ],
    },
    "F": {
        "name": "Group F",
        "teams": [
            {"name": "Netherlands", "code": "NED", "flag": "🇳🇱", "confederation": "UEFA"},
            {"name": "Japan", "code": "JPN", "flag": "🇯🇵", "confederation": "AFC"},
            {"name": "Tunisia", "code": "TUN", "flag": "🇹🇳", "confederation": "CAF"},
            {"name": "Sweden", "code": "SWE", "flag": "🇸🇪", "confederation": "UEFA"},
        ],
    },
    "G": {
        "name": "Group G",
        "teams": [
            {"name": "Belgium", "code": "BEL", "flag": "🇧🇪", "confederation": "UEFA"},
            {"name": "Iran", "code": "IRN", "flag": "🇮🇷", "confederation": "AFC"},
            {"name": "Egypt", "code": "EGY", "flag": "🇪🇬", "confederation": "CAF"},
            {"name": "New Zealand", "code": "NZL", "flag": "🇳🇿", "confederation": "OFC"},
        ],
    },
    "H": {
        "name": "Group H",
        "teams": [
            {"name": "Spain", "code": "ESP", "flag": "🇪🇸", "confederation": "UEFA"},
            {"name": "Uruguay", "code": "URU", "flag": "🇺🇾", "confederation": "CONMEBOL"},
            {"name": "Saudi Arabia", "code": "KSA", "flag": "🇸🇦", "confederation": "AFC"},
            {"name": "Cape Verde", "code": "CPV", "flag": "🇨🇻", "confederation": "CAF"},
        ],
    },
    "I": {
        "name": "Group I",
        "teams": [
            {"name": "France", "code": "FRA", "flag": "🇫🇷", "confederation": "UEFA"},
            {"name": "Senegal", "code": "SEN", "flag": "🇸🇳", "confederation": "CAF"},
            {"name": "Norway", "code": "NOR", "flag": "🇳🇴", "confederation": "UEFA"},
            {"name": "Iraq", "code": "IRQ", "flag": "🇮🇶", "confederation": "AFC"},
        ],
    },
    "J": {
        "name": "Group J",
        "teams": [
            {"name": "Argentina", "code": "ARG", "flag": "🇦🇷", "confederation": "CONMEBOL"},
            {"name": "Austria", "code": "AUT", "flag": "🇦🇹", "confederation": "UEFA"},
            {"name": "Algeria", "code": "ALG", "flag": "🇩🇿", "confederation": "CAF"},
            {"name": "Jordan", "code": "JOR", "flag": "🇯🇴", "confederation": "AFC"},
        ],
    },
    "K": {
        "name": "Group K",
        "teams": [
            {"name": "Portugal", "code": "POR", "flag": "🇵🇹", "confederation": "UEFA"},
            {"name": "Colombia", "code": "COL", "flag": "🇨🇴", "confederation": "CONMEBOL"},
            {"name": "Uzbekistan", "code": "UZB", "flag": "🇺🇿", "confederation": "AFC"},
            {"name": "DR Congo", "code": "COD", "flag": "🇨🇩", "confederation": "CAF"},
        ],
    },
    "L": {
        "name": "Group L",
        "teams": [
            {"name": "England", "code": "ENG", "flag": "🏴", "confederation": "UEFA"},
            {"name": "Croatia", "code": "CRO", "flag": "🇭🇷", "confederation": "UEFA"},
            {"name": "Panama", "code": "PAN", "flag": "🇵🇦", "confederation": "CONCACAF"},
            {"name": "Ghana", "code": "GHA", "flag": "🇬🇭", "confederation": "CAF"},
        ],
    },
}


@router.get("")
async def get_groups():
    return {"groups": GROUPS_DATA}