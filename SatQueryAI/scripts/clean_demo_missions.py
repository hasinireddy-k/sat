import re

path = r"C:\Users\hasin\Downloads\spiderman\src\data\demoMissions.ts"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Replace Unsplash URLs with real satellite assets
text = text.replace("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "/assets/scenes/cartosat_sample.png")
text = text.replace("https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80", "/assets/scenes/bitemporal_t1.png")
text = text.replace("https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80", "/assets/scenes/bitemporal_t1.png")
text = text.replace("https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80", "/assets/scenes/bitemporal_t2.png")
text = text.replace("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80", "/assets/scenes/optical_vnir.png")
text = text.replace("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80", "/assets/scenes/optical_vnir.png")
text = text.replace("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80", "/assets/scenes/sar_cband.png")

# Any remaining unsplash URLs replaced by real satellite scene
text = re.sub(r"https://images\.unsplash\.com/[^\s\'\"]+", "/assets/scenes/cartosat_sample.png", text)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Remaining unsplash occurrences:", text.count("images.unsplash.com"))
