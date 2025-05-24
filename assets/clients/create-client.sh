#!/bin/bash

# Client Directory Creator - Interactive Mode
# Usage: ./script.sh [country] [type] [client-name]

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

# Header and help
show_help() {
    echo -e "${CYAN}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                 CLIENT DIRECTORY CREATION TOOL                ║
╚═══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo -e "${YELLOW}Usage:"
    echo "Interactive mode:"
    echo -e "${YELLOW}  Command line:  ${NC}$0 [country] [type] [client-name]"
    echo -e "${YELLOW}  Help:          ${NC}$0 help"
}

# List of countries and organization types
COUNTRIES=(
  # Priority 1 – Core Francophone countries or with strong French ties
  morocco france switzerland belgium canada luxembourg monaco

  # Priority 2 – High-trust European & Anglophone partners (economic/tech/linguistic relevance)
  united-kingdom united-states germany netherlands ireland italy

  # Priority 3 – Gulf countries with strong investment/digital potential
  qatar united-arab-emirates saudi-arabia

  # Priority 4 – Regional influence, Francophone or African nations with existing ties
  lebanon spain portugal senegal ivory-coast cameroon madagascar mauritius algeria tunisia burkina-faso gabon egypt israel

  # Priority 5 – Secondary stable European countries (EU, education/tech aligned)
  austria sweden denmark norway finland poland romania greece czech-republic hungary slovenia 
  slovakia estonia lithuania latvia andorra liechtenstein san-marino iceland

  # Priority 6 – High-income but non-francophone Commonwealth/Asian-Pacific countries
  australia new-zealand japan south-korea singapore

  # Priority 7 – Emerging digital markets (BRICS, LATAM, SEA)
  india indonesia china brazil argentina chile mexico colombia peru uruguay 
  costa-rica panama dominican-republic thailand vietnam philippines malaysia south-africa

  # Priority 8 – High-potential African nations with improving infrastructure
  kenya rwanda ghana nigeria tanzania ethiopia

  # Priority 9 – Low probability but possible outliers (historic/cultural/diaspora ties)
  armenia azerbaijan albania bahamas bahrain bangladesh barbados belarus belize benin bhutan bolivia bosnia-and-herzegovina 
  botswana brunei bulgaria cabo-verde cambodia central-african-republic chad comoros congo-brazzaville congo-kinshasa croatia cuba 
  cyprus djibouti dominica ecuador el-salvador equatorial-guinea eritrea eswatini fiji georgia grenada guatemala guinea guinea-bissau 
  guyana haiti honduras iran iraq jamaica jordan kazakhstan kiribati kuwait kyrgyzstan laos lesotho liberia libya malawi maldives
  malta marshall-islands mauritania micronesia moldova mongolia montenegro mozambique myanmar namibia nauru nepal nicaragua niger north-korea 
  north-macedonia oman pakistan palau papua-new-guinea paraguay russia saint-kitts-and-nevis saint-lucia saint-martin saint-vincent-and-the-grenadines 
  samoa sao-tome-and-principe serbia seychelles sierra-leone solomon-islands somalia south-sudan sri-lanka sudan suriname syria taiwan 
  tajikistan timor-leste togo tonga trinidad-and-tobago turkey turkmenistan tuvalu uganda ukraine uzbekistan vanuatu 
  vatican-city venezuela yemen zambia zimbabwe
)


TYPES=("asso" "ste" "coop" "gov" "ngo" "startup" "enterprise")

# Validation functions
validate_country() {
    local country=$(echo "$1" | tr '[:upper:]' '[:lower:]')
    printf '%s\n' "${COUNTRIES[@]}" | grep -qx "^${country}$"
}

validate_type() {
    local type=$(echo "$1" | tr '[:upper:]' '[:lower:]')
    printf '%s\n' "${TYPES[@]}" | grep -qx "^${type}$"
}

# Interactive mode
interactive_mode() {
    show_help
   
    while true; do
        echo -e "\n${YELLOW}Step 1/3 - Country selection\n"
        echo -e "${BLUE}Available countries:${NC} ${COUNTRIES[*]}\n"
        read -p "Enter country name [default= morocco]: " country
        
        # Set "morocco" as default
        country=${country:-morocco}
        
        if validate_country "$country"; then
            break
        fi
        
        echo -e "${RED}Invalid country! ${CYAN}Try: ${COUNTRIES[*]:0:5}...${NC}"
    done

    
    while true; do
        echo -e "\n${YELLOW}Step 2/3 - Organization type"
        echo -e "${BLUE}Available types: ${TYPES[*]}${NC}"
        read -p "Enter organization type: " type
        
        if validate_type "$type"; then
            break
        fi
        
        echo -e "${RED}Invalid type! ${CYAN}Try: ${TYPES[*]}${NC}"
    done
    
    while true; do
        echo -e "\n${YELLOW}Step 3/3 - Client name"
        echo -e "${BLUE}Rules: 2-50 characters, alphanumeric + hyphens only${NC}"
        read -p "Enter client name: " client_name
        
        clean_name=$(echo "$client_name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
        
        if [[ "$clean_name" =~ ^[a-z0-9-]{2,50}$ ]] && [[ ! "$clean_name" =~ -- ]]; then
            client_name="$clean_name"
            break
        fi
        
        echo -e "${RED}Invalid name! Follow the rules.${NC}"
    done
}

# Arguments handling
if [[ $# -gt 0 ]]; then
    case $1 in
        help|--help|-h)
            show_help
            exit 0
            ;;
        *)
            if [[ $# -ne 3 ]]; then
                echo -e "${RED}Error: Exactly 3 arguments required!${NC}"
                show_help
                exit 1
            fi
            country=$1
            type=$2
            client_name=$3
            ;;
    esac
else
    interactive_mode
fi

# Final validation
if ! validate_country "$country"; then
    echo -e "${RED}Invalid country: $country ${NC}"
    exit 2
fi

if ! validate_type "$type"; then
    echo -e "${RED}Invalid type: $type ${NC}"
    exit 3
fi

# Directory creation
base_dir="$(pwd)"
client_path="${base_dir}/${country}/${type}/${client_name}"

echo -e "\n${YELLOW}📁 Creating directory structure for ${client_name}...${NC}"
mkdir -p "${client_path}" || { echo -e "${RED}❌ Directory creation failed!${NC}"; exit 4; }

# Folder list
dirs=(
    identity/logos/v1/sources
    identity/logos/v2/sources
    identity/fonts
    identity/colors
    identity/guidelines
    identity/preview
    identity/preview/og-image
    identity/preview/og-image/v1
    identity/preview/og-image/v1/sources

    marketing/banners/web
    marketing/banners/print
    marketing/banners/social
    marketing/visuals/covers

    media/audio
    media/videos

    team/photos/originals
    team/photos/optimized
    team/relative-documents

    deliverables/exports/flyers
    deliverables/exports/posters
    deliverables/exports/social-kits

    resources/templates/canva
    resources/misc

    other-assets
)

# Create directories and .gitkeep
for dir in "${dirs[@]}"; do
    mkdir -p "${client_path}/${dir}"
    touch "${client_path}/${dir}/.gitkeep"
    echo "to gitkeep" > "${client_path}/${dir}/txt.gitkeep"
done

cat > "${client_path}/README.md" <<EOL
# Client: ${client_name}

<p align="center" style="overflow: hidden; width: 100%; height: 350px; border-radius: 20px; margin: 0;">
<!-- <a href="https://numerimondes.com" target="_blank"> -->
    <img src="https://raw.githubusercontent.com/numerimondes/.github/refs/heads/main/assets/clients/${country}/${type}/${client_name}/marketing/banners/web/full_cover_web_banner.png"
         alt="${client_name} Logo"
         style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 20px; display: block;">
<!-- </a> -->
</p>


This folder contains the public assets (visual identity, media, documents) for client **${client_name}**.

> ⚠️ Never store private or sensitive information here.

## Structure:

- \`identity/\` : logos, fonts, colors, brand guidelines
- \`marketing/\` : banners, visuals
- \`media/\` : videos, audios
- \`team/\` : team members (photos, roles)
- \`deliverables/\` : final exports
- \`resources/\` : templates and auxiliary documents
- \`other-assets/\` : miscellaneous items

---

## Legal Notices and Intellectual Property

### Ownership and License Scope

All contents of this folder—including but not limited to the brand book, visual identity, media files, documents, templates, and all related assets—are the exclusive property of Numerimondes, except where explicitly transferred under contract.

The client is granted an exclusive, non-transferable license to use all assets contained herein strictly within the scope of the contract concluded with Numerimondes.

Any usage or ownership rights outside this scope remain the sole property of Numerimondes.

### Restrictions and Prohibited Uses

Copying, reproducing, distributing, modifying, or otherwise using any part of this folder without prior written consent from Numerimondes is strictly prohibited.

Any unauthorized use will be considered a violation of intellectual property rights and may result in legal action.

### Storage and Operational Use

Storing these assets on platforms such as GitHub or similar services is permitted for operational independence, but does not modify the ownership or licensing terms stated here.

### Sharing with Third Parties

Sharing or providing access to these assets to third parties is allowed only under explicit, controlled conditions as stipulated by the contract.

Third parties must fully comply with all brand guidelines and restrictions, including prohibitions on unauthorized modifications.

Redistribution, retention of copies, or use beyond the agreed contractual period is forbidden and subject to legal penalties.

### Exceptions

Any exception to these terms must be granted in writing by Numerimondes prior to such use.

### Copyright and Compliance

Numerimondes reserves all rights under applicable copyright and intellectual property laws.

The client commits to comply with all such laws in their jurisdiction regarding the use of these assets.

---

© Numerimondes - All rights reserved - 2023-2025

EOL

echo "Directory created successfully:"
echo ""
echo "${client_path}"
echo ""
tree "${client_path}" 2>/dev/null || find "${client_path}" -type d
exit 0