import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#000",
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    marginBottom: 3,
    lineHeight: 1.4,
  },
})

export default function ResumePDF({ content, name }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>{name}</Text>

        {content.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.title}>{section.title}</Text>
            {section.items.map((line, j) => (
              <Text key={j} style={styles.text}>
                {line}
              </Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  )
}
