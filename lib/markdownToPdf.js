export function markdownToPdfData(markdown) {
  const sections = []
  const blocks = markdown.split("\n## ").filter(Boolean)

  blocks.forEach((block) => {
    const lines = block.split("\n").filter(Boolean)
    sections.push({
      title: lines[0].replace("## ", ""),
      items: lines.slice(1),
    })
  })

  return sections
}
