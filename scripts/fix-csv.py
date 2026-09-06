with open('src/admin/Editor.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the broken csv line
for i, line in enumerate(lines):
    if 'const csv' in line and 'rows.join' in line:
        # Replace with correct line
        lines[i] = '    const csv = "\\uFEFF" + rows.join("\\r\\n");\n'
        # Remove next line if it's a stray continuation
        if i+1 < len(lines) and lines[i+1].strip().startswith('");'):
            lines[i+1] = ''
        break

with open('src/admin/Editor.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Fixed line', i+1)
