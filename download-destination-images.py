#!/usr/bin/env python3
"""
Download destination images from Unsplash API
"""

import os
import requests
from pathlib import Path

# Destination slugs and search queries
destinations = {
    "cape-agulhas": "Cape Agulhas lighthouse Africa ocean",
    "bo-kaap": "Bo-Kaap Cape Town colorful buildings",
    "cape-town-highlights": "Cape Town Table Mountain aerial view",
    "cape-winelands": "Cape Winelands Stellenbosch vineyards",
    "cape-peninsula": "Cape Peninsula Cape Point dramatic cliffs",
    "hermanus": "Hermanus whale watching coast South Africa",
    "aquila-safari": "Aquila game reserve lions safari Africa",
    "constantia-wine": "Constantia wine valley vineyards mountains",
    "cape-west-coast": "West Coast Langebaan lagoon beach",
    "garden-route": "Garden Route Tsitsikamma forest coast"
}

# Create destination images directory
dest_dir = Path("frontend/public/images/destinations")
dest_dir.mkdir(parents=True, exist_ok=True)

# Unsplash API endpoint (no key required for basic usage)
UNSPLASH_URL = "https://api.unsplash.com/search/photos"

def download_image(query, filename):
    """Download image from Unsplash"""
    try:
        # Search for images
        params = {
            "query": query,
            "per_page": 1,
            "orientation": "landscape"
        }
        
        response = requests.get(UNSPLASH_URL, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get("results"):
            image_url = data["results"][0]["urls"]["regular"]
            
            # Download the image
            img_response = requests.get(image_url, timeout=10)
            img_response.raise_for_status()
            
            # Save the image
            filepath = dest_dir / filename
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            
            print(f"✓ Downloaded: {filename}")
            return True
        else:
            print(f"✗ No results for: {query}")
            return False
            
    except Exception as e:
        print(f"✗ Error downloading {filename}: {str(e)}")
        return False

def main():
    """Download all destination images"""
    print("Downloading destination images from Unsplash...")
    print(f"Saving to: {dest_dir.absolute()}\n")
    
    success_count = 0
    for slug, query in destinations.items():
        filename = f"{slug}.jpg"
        if download_image(query, filename):
            success_count += 1
    
    print(f"\n✓ Successfully downloaded {success_count}/{len(destinations)} images")

if __name__ == "__main__":
    main()
