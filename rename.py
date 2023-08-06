import os
i=0
for fname in os.listdir():
    os.rename(fname,f"bdg{i}.png")
    i += 1