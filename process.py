import sys
from collections import deque
from PIL import Image

def process(filepath):
    print("Opening image...")
    img = Image.open(filepath).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    start_x = width // 2
    start_y = height // 2
    
    print(f"Start fill from {start_x}, {start_y}")
    
    visited = set()
    queue = deque()
    
    queue.append((start_x, start_y))
    visited.add((start_x, start_y))
    
    filled_count = 0
    
    while queue:
        cx, cy = queue.popleft()
        
        # Make transparent
        pixels[cx, cy] = (255, 255, 255, 0)
        filled_count += 1
        
        # Check neighbors
        for dx, dy in [(0,1), (1,0), (0,-1), (-1,0)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    visited.add((nx, ny))
                    r, g, b, a = pixels[nx, ny]
                    if r > 230 and g > 230 and b > 230:
                        queue.append((nx, ny))
                        
    print(f"Filled {filled_count} pixels")
    img.save(filepath, "PNG")

if __name__ == "__main__":
    process("public/frames/nature.png")
