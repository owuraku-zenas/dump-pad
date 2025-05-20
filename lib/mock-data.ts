// Mock data for idea dump notes
export const initialDumpNotes = [
  {
    id: 1,
    content:
      "# Machine Learning Project Ideas\n\nPossible topics for the final project:\n- Image classification for plant diseases\n- Sentiment analysis on student feedback\n- Recommendation system for study resources\n- Predictive model for exam performance",
    category: "AI Research",
    tags: ["project ideas", "ML", "important"],
    timestamp: "Today, 10:23 AM",
    date: new Date(2023, 4, 9, 10, 23),
    mode: "dump",
    attachments: [],
  },
  {
    id: 2,
    content:
      "Need to review the calculus formulas for the midterm. Focus on:\n- Derivatives\n- Integrals\n- Limits\n- Series",
    category: "Math Notes",
    tags: ["exam prep", "to-review"],
    timestamp: "Yesterday, 3:45 PM",
    date: new Date(2023, 4, 8, 15, 45),
    mode: "dump",
    attachments: [],
  },
  {
    id: 3,
    content:
      "Group project meeting notes:\n1. Sarah will research the background\n2. Michael will prepare the slides\n3. I need to code the demo\n4. Presentation on Friday at 2pm",
    category: "Group Project",
    tags: ["meeting notes", "deadline"],
    timestamp: "May 6, 2:12 PM",
    date: new Date(2023, 4, 6, 14, 12),
    mode: "dump",
    attachments: [],
  },
  {
    id: 4,
    content:
      "# Research Paper Structure\n\nIdeas for my term paper on quantum computing:\n- Introduction to quantum bits\n- Quantum gates and circuits\n- Current limitations\n- Future applications",
    category: "Physics Notes",
    tags: ["research", "paper"],
    timestamp: "May 5, 11:30 AM",
    date: new Date(2023, 4, 5, 11, 30),
    mode: "dump",
    attachments: [{ id: 1, name: "quantum_notes.pdf", type: "pdf" }],
  },
  {
    id: 5,
    content:
      "Interesting resources for the biology assignment:\n- https://www.ncbi.nlm.nih.gov/\n- Khan Academy videos on cell division\n- Professor's slides from last lecture",
    category: "Biology",
    tags: ["resources", "links"],
    timestamp: "May 4, 9:15 AM",
    date: new Date(2023, 4, 4, 9, 15),
    mode: "dump",
    attachments: [],
  },
]

// Mock data for document processing notes
export const initialDocNotes = [
  {
    id: 101,
    title: "Machine Learning Final Project Proposal",
    content:
      "# Machine Learning Final Project Proposal\n\n## Introduction\nThis project aims to develop a machine learning model for plant disease classification using convolutional neural networks.\n\n## Background\nPlant diseases cause significant crop losses worldwide. Early detection through image analysis can help farmers take preventive measures.\n\n## Methodology\n1. Data collection from public datasets\n2. Image preprocessing and augmentation\n3. CNN model development\n4. Training and validation\n5. Performance evaluation\n\n## Timeline\n- Week 1-2: Data collection and preprocessing\n- Week 3-4: Model development\n- Week 5-6: Training and evaluation\n- Week 7-8: Documentation and presentation",
    category: "AI Research",
    tags: ["project", "ML", "CNN", "final"],
    timestamp: "May 7, 1:30 PM",
    date: new Date(2023, 4, 7, 13, 30),
    mode: "doc",
    tasks: [
      { id: 1, text: "Collect dataset", completed: true, deadline: "May 10, 2023" },
      { id: 2, text: "Preprocess images", completed: false, deadline: "May 15, 2023" },
      { id: 3, text: "Implement CNN model", completed: false, deadline: "May 20, 2023" },
    ],
    attachments: [{ id: 1, name: "plant_disease_samples.jpg", type: "image" }],
  },
  {
    id: 102,
    title: "Calculus Midterm Study Guide",
    content:
      "# Calculus Midterm Study Guide\n\n## Derivatives\n- Power rule: $f(x) = x^n \\Rightarrow f'(x) = nx^{n-1}$\n- Product rule: $(fg)' = f'g + fg'$\n- Quotient rule: $(f/g)' = \\frac{f'g - fg'}{g^2}$\n- Chain rule: $(f \\circ g)' = (f' \\circ g) \\cdot g'$\n\n## Integrals\n- Indefinite integrals: $\\int f(x) dx = F(x) + C$\n- Definite integrals: $\\int_{a}^{b} f(x) dx = F(b) - F(a)$\n\n## Limits\n- Definition: $\\lim_{x \\to a} f(x) = L$\n- L'Hôpital's rule for indeterminate forms\n\n## Series\n- Geometric series: $\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1-r}$ for $|r| < 1$\n- Taylor series expansions",
    category: "Math Notes",
    tags: ["study guide", "exam prep", "formulas"],
    timestamp: "May 6, 5:20 PM",
    date: new Date(2023, 4, 6, 17, 20),
    mode: "doc",
    tasks: [
      { id: 1, text: "Practice derivatives problems", completed: true, deadline: "May 8, 2023" },
      { id: 2, text: "Review integration techniques", completed: false, deadline: "May 9, 2023" },
      { id: 3, text: "Complete practice exam", completed: false, deadline: "May 10, 2023" },
    ],
    attachments: [],
  },
  {
    id: 103,
    title: "Group Project Plan: Sustainable Energy Solutions",
    content:
      "# Group Project Plan: Sustainable Energy Solutions\n\n## Project Overview\nOur team will research and present sustainable energy solutions for urban environments, focusing on solar, wind, and geothermal technologies.\n\n## Team Members & Responsibilities\n- Sarah Johnson: Background research and literature review\n- Michael Chen: Presentation slides and visual aids\n- Me: Technical demonstration and implementation examples\n- Jessica Williams: Economic analysis and feasibility study\n\n## Timeline\n- Research phase: May 1-7\n- Draft presentation: May 8-14\n- Finalize materials: May 15-20\n- Presentation: May 21\n\n## Resources Needed\n- Access to university research databases\n- Sample data from the energy department\n- Visualization tools for energy consumption models",
    category: "Group Project",
    tags: ["project plan", "sustainability", "presentation"],
    timestamp: "May 5, 3:45 PM",
    date: new Date(2023, 4, 5, 15, 45),
    mode: "doc",
    tasks: [
      { id: 1, text: "Contact team members", completed: true, deadline: "May 2, 2023" },
      { id: 2, text: "Distribute responsibilities", completed: true, deadline: "May 3, 2023" },
      { id: 3, text: "Begin research phase", completed: true, deadline: "May 7, 2023" },
      { id: 4, text: "Prepare demo code", completed: false, deadline: "May 15, 2023" },
    ],
    attachments: [],
  },
  {
    id: 104,
    title: "Physics Lab Report: Quantum Entanglement",
    content:
      "# Physics Lab Report: Quantum Entanglement\n\n## Abstract\nThis lab report documents our experiment on quantum entanglement using photon pairs. We observed correlations that support the principles of quantum mechanics.\n\n## Introduction\nQuantum entanglement is a phenomenon where particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others.\n\n## Methodology\nWe used a parametric down-conversion crystal to generate entangled photon pairs and measured their polarization states using polarizers and single-photon detectors.\n\n## Results\nOur measurements showed a violation of Bell's inequality with a statistical significance of 5 sigma, confirming the presence of quantum entanglement.\n\n## Discussion\nThe results support the non-local nature of quantum mechanics and demonstrate that quantum entanglement cannot be explained by classical physics.",
    category: "Physics Notes",
    tags: ["lab report", "quantum", "experiment"],
    timestamp: "May 4, 11:20 AM",
    date: new Date(2023, 4, 4, 11, 20),
    mode: "doc",
    tasks: [
      { id: 1, text: "Complete data analysis", completed: true, deadline: "May 3, 2023" },
      { id: 2, text: "Draft report", completed: true, deadline: "May 4, 2023" },
      { id: 3, text: "Submit for review", completed: false, deadline: "May 10, 2023" },
    ],
    attachments: [{ id: 1, name: "entanglement_data.xlsx", type: "spreadsheet" }],
  },
  {
    id: 105,
    title: "Biology Research: Cell Membrane Transport",
    content:
      "# Biology Research: Cell Membrane Transport\n\n## Overview\nThis document compiles research on various cell membrane transport mechanisms, including passive diffusion, facilitated diffusion, and active transport.\n\n## Passive Transport\n- Simple diffusion: Movement of small, nonpolar molecules across the phospholipid bilayer\n- Osmosis: Diffusion of water across a selectively permeable membrane\n- Facilitated diffusion: Transport of specific molecules via channel or carrier proteins\n\n## Active Transport\n- Primary active transport: Direct use of ATP to move molecules against concentration gradient\n- Secondary active transport: Use of ion gradients established by primary active transport\n\n## Endocytosis and Exocytosis\n- Phagocytosis: Cell engulfs solid particles\n- Pinocytosis: Cell engulfs liquid droplets\n- Receptor-mediated endocytosis: Selective uptake of specific molecules\n- Exocytosis: Secretion of molecules from the cell",
    category: "Biology",
    tags: ["research", "cell biology", "transport"],
    timestamp: "May 3, 2:15 PM",
    date: new Date(2023, 4, 3, 14, 15),
    mode: "doc",
    tasks: [
      { id: 1, text: "Research passive transport", completed: true, deadline: "May 1, 2023" },
      { id: 2, text: "Research active transport", completed: true, deadline: "May 2, 2023" },
      { id: 3, text: "Create diagrams", completed: false, deadline: "May 5, 2023" },
      { id: 4, text: "Prepare presentation", completed: false, deadline: "May 10, 2023" },
    ],
    attachments: [{ id: 1, name: "cell_membrane_diagram.png", type: "image" }],
  },
]

// Templates for Document Processing Mode
export const documentTemplates = [
  {
    id: 1,
    name: "Research Paper",
    description: "Academic research paper with sections for introduction, methodology, results, and conclusion",
    defaultTitle: "New Research Paper",
    content:
      "# Research Paper\n\n## Abstract\n[Your abstract here]\n\n## Introduction\n[Introduce your topic and research question]\n\n## Literature Review\n[Review relevant literature]\n\n## Methodology\n[Describe your research methods]\n\n## Results\n[Present your findings]\n\n## Discussion\n[Interpret your results]\n\n## Conclusion\n[Summarize your paper]\n\n## References\n[List your sources]",
  },
  {
    id: 2,
    name: "Project Proposal",
    description: "Structured proposal with project overview, timeline, resources, and expected outcomes",
    defaultTitle: "New Project Proposal",
    content:
      "# Project Proposal\n\n## Project Overview\n[Brief description of the project]\n\n## Objectives\n- [Objective 1]\n- [Objective 2]\n- [Objective 3]\n\n## Methodology\n[Describe your approach]\n\n## Timeline\n- Week 1-2: [Tasks]\n- Week 3-4: [Tasks]\n- Week 5-6: [Tasks]\n\n## Resources Needed\n[List resources required]\n\n## Expected Outcomes\n[Describe expected results]",
  },
  {
    id: 3,
    name: "Study Guide",
    description: "Organized study material with key concepts, formulas, examples, and practice questions",
    defaultTitle: "New Study Guide",
    content:
      "# Study Guide\n\n## Key Concepts\n- [Concept 1]\n- [Concept 2]\n- [Concept 3]\n\n## Formulas\n[List important formulas]\n\n## Examples\n### Example 1\n[Worked example]\n\n### Example 2\n[Worked example]\n\n## Practice Questions\n1. [Question 1]\n2. [Question 2]\n3. [Question 3]",
  },
  {
    id: 4,
    name: "Lab Report",
    description: "Scientific lab report with objectives, materials, procedures, data, and analysis",
    defaultTitle: "New Lab Report",
    content:
      "# Lab Report\n\n## Objectives\n[State the purpose of the experiment]\n\n## Materials\n- [Material 1]\n- [Material 2]\n- [Material 3]\n\n## Procedures\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n## Data\n[Present your data in tables or graphs]\n\n## Analysis\n[Analyze your results]\n\n## Conclusion\n[Summarize your findings]\n\n## References\n[List your sources]",
  },
  {
    id: 5,
    name: "Meeting Notes",
    description: "Structured format for recording meeting discussions, decisions, and action items",
    defaultTitle: "New Meeting Notes",
    content:
      "# Meeting Notes\n\n## Date and Attendees\n**Date:** [Meeting date]\n**Attendees:** [List of attendees]\n\n## Agenda\n1. [Agenda item 1]\n2. [Agenda item 2]\n3. [Agenda item 3]\n\n## Discussion Points\n### [Topic 1]\n[Notes on discussion]\n\n### [Topic 2]\n[Notes on discussion]\n\n## Decisions Made\n- [Decision 1]\n- [Decision 2]\n\n## Action Items\n- [Person 1]: [Task] by [Deadline]\n- [Person 2]: [Task] by [Deadline]\n\n## Next Meeting\n**Date:** [Next meeting date]\n**Agenda:** [Preliminary agenda items]",
  },
]
