// import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontFamily: 'Helvetica',
//     fontSize: 10,
//     color: '#334155'
//   },
//   // Centered Header Container
//   header: {
//     marginBottom: 20,
//     textAlign: 'center', // Centers the name
//     borderBottom: 1,
//     borderBottomColor: '#e2e8f0',
//     paddingBottom: 12
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#0f172a',
//     letterSpacing: 1,
//     textTransform: 'uppercase',
//     marginBottom: 6
//   },
//   // Centered Contact Row using Flexbox
//   contactRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     flexWrap: 'wrap',
//     gap: 12,
//     color: '#475569',
//     fontSize: 9
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4
//   },
//   icon: {
//     color: '#4f46e5', // Indigo-600 to match your theme
//     fontSize: 10
//   },
//   section: {
//     marginTop: 18
//   },
//   sectionTitle: {
//     fontSize: 9,
//     fontWeight: 'bold',
//     color: '#94a3b8', // Slate-400
//     textTransform: 'uppercase',
//     letterSpacing: 1.5,
//     marginBottom: 6,
//     borderBottom: 0.5,
//     borderBottomColor: '#e2e8f0',
//     paddingBottom: 3
//   },
//   item: {
//     marginBottom: 12
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     marginBottom: 2
//   },
//   bold: {
//     fontWeight: 'bold',
//     color: '#1e293b',
//     fontSize: 11
//   },
//   italic: {
//     fontStyle: 'italic',
//     color: '#64748b',
//     fontSize: 9
//   },
//   text: {
//     lineHeight: 1.5,
//     marginTop: 2,
//     textAlign: 'justify'
//   },
//   skillsBox: {
//     marginTop: 4
//   }
// });

// export const ResumePDF = ({ data }) => (
//   <Document title={`${data.contact?.name || 'Resume'}_Architect`}>
//     <Page size="A4" style={styles.page}>

//       {/* 1. Centered Header */}
//       <View style={styles.header}>
//         <Text style={styles.name}>{data.contact?.name || "YOUR NAME"}</Text>

//         <View style={styles.contactRow}>
//           {data.contact?.email && (
//             <View style={styles.contactItem}>
//               <Text style={styles.icon}>✉</Text>
//               <Text>{data.contact.email}</Text>
//             </View>
//           )}
//           {data.contact?.phone && (
//             <View style={styles.contactItem}>
//               <Text style={styles.icon}>📞</Text>
//               <Text>{data.contact.phone}</Text>
//             </View>
//           )}
//           {data.contact?.location && (
//             <View style={styles.contactItem}>
//               <Text style={styles.icon}>📍</Text>
//               <Text>{data.contact.location}</Text>
//             </View>
//           )}
//           {data.contact?.github && (
//             <View style={styles.contactItem}>
//               <Text style={styles.icon}>🔗</Text>
//               <Text>{data.contact.github.replace("https://", "").replace("www.", "")}</Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* 2. Professional Summary */}
//       {data.summary && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Summary</Text>
//           <Text style={styles.text}>{data.summary}</Text>
//         </View>
//       )}

//       {/* 3. Work Experience */}
//       {data.experience?.some(exp => exp.company || exp.role) && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Experience</Text>
//           {data.experience.map((exp, i) => (
//             <View key={i} style={styles.item}>
//               <View style={styles.itemHeader}>
//                 <Text style={styles.bold}>{exp.role}</Text>
//                 <Text style={styles.italic}>{exp.duration || ''}</Text>
//               </View>
//               <Text style={styles.italic}>{exp.company}</Text>
//               <Text style={styles.text}>{exp.description}</Text>
//             </View>
//           ))}
//         </View>
//       )}

//       {/* 4. Projects */}
//       {data.projects?.some(proj => proj.name) && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Projects</Text>
//           {data.projects.map((proj, i) => (
//             <View key={i} style={styles.item}>
//               <View style={styles.itemHeader}>
//                 <Text style={styles.bold}>{proj.name}</Text>
//                 {proj.link && <Text style={{ color: '#4f46e5', fontSize: 8 }}>{proj.link.replace("https://", "")}</Text>}
//               </View>
//               <Text style={styles.text}>{proj.description}</Text>
//             </View>
//           ))}
//         </View>
//       )}

//       {/* 5. Education */}
//       {data.education?.some(edu => edu.school) && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Education</Text>
//           {data.education.map((edu, i) => (
//             <View key={i} style={styles.item}>
//               <View style={styles.itemHeader}>
//                 <Text style={styles.bold}>{edu.school}</Text>
//                 <Text style={styles.italic}>{edu.year}</Text>
//               </View>
//               <Text style={styles.text}>{edu.degree}</Text>
//             </View>
//           ))}
//         </View>
//       )}

//       {/* 6. Skills */}
//       {data.skills && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Technical Skills</Text>
//           <View style={styles.skillsBox}>
//             <Text style={styles.text}>{data.skills}</Text>
//           </View>
//         </View>
//       )}

//     </Page>
//   </Document>
// );

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 0,
  },
  // Sidebar - Left Column (32% width)
  sidebar: {
    width: "32%",
    backgroundColor: "#F8FAFC",
    padding: 25,
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  // Main - Right Column (68% width)
  main: {
    width: "68%",
    padding: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  role: {
    fontSize: 10,
    color: "#4F46E5",
    fontWeight: "bold",
    marginBottom: 25,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 8,
    marginTop: 18,
    paddingBottom: 2,
  },
  contactItem: {
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  contactValue: {
    fontSize: 8,
    color: "#1E293B",
  },
  entryTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0F172A",
  },
  entrySub: {
    fontSize: 8,
    color: "#64748B",
    marginBottom: 3,
  },
  bodyText: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: "#334155",
  },
})

export const ResumePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* LEFT SIDEBAR */}
      <View style={styles.sidebar}>
        <Text style={styles.name}>{data.contact?.name || "YOUR NAME"}</Text>
        <Text style={styles.role}>{data.contact?.profession}</Text>

        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.contactItem}>
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactValue}>{data.contact?.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Text style={styles.contactLabel}>Phone</Text>
          <Text style={styles.contactValue}>{data.contact?.phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <Text style={styles.contactLabel}>Location</Text>
          <Text style={styles.contactValue}>{data.contact?.location}</Text>
        </View>
        <View style={styles.contactItem}>
          <Text style={styles.contactLabel}>Github</Text>
          <Text style={styles.contactValue}>{data.contact?.github}</Text>
        </View>

        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.bodyText}>{data.skills}</Text>

        <Text style={styles.sectionTitle}>Education</Text>
        {data.education?.map((edu, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <Text style={[styles.entryTitle, { fontSize: 8 }]}>
              {edu.school}
            </Text>
            <Text style={styles.contactValue}>
              {edu.degree} - <Text style={{ color: "#2563eb", fontWeight: "bold" }}>{edu.percentage}</Text>
            </Text>
          </View>
        ))}
      </View>

      {/* RIGHT MAIN CONTENT */}
      <View style={styles.main}>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text style={styles.bodyText}>{data.summary}</Text>

        <Text style={styles.sectionTitle}>Experience</Text>
        {data.experience?.map((exp, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Text style={styles.entryTitle}>{exp.role}</Text>
            <Text style={styles.entrySub}>{exp.company}</Text>
            <Text style={styles.bodyText}>{exp.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Projects</Text>
        {data.projects?.map((proj, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Text style={styles.entryTitle}>{proj.name}</Text>
            <Text style={styles.entrySub}>{proj.link}</Text>
            <Text style={styles.bodyText}>{proj.description}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)
