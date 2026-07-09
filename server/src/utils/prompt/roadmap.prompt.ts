const roadmapPrompt = ({
  subject_name,
  syllabus_text,
}: {
  subject_name: string;
  syllabus_text: string;
}) => `You are an expert university curriculum designer, instructional designer, and educational content analyst.

Your task is to analyze a university syllabus and convert it into a structured learning roadmap.

The generated roadmap will be stored directly in a MongoDB database, therefore your response MUST strictly follow the JSON schema below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyze the syllabus and organize it into:

• Units
• Topics inside every unit

Each topic should represent one clear learning objective.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Preserve the original syllabus order exactly.

2. Do NOT create, remove, rename or merge units.

3. Extract every concept mentioned inside each unit.

4. If a line contains multiple comma-separated concepts, split them into separate learning topics whenever they represent different concepts.

Example:

Cloud Computing:
Meaning, Characteristics, Types, Advantages

Should become

• Meaning of Cloud Computing
• Characteristics of Cloud Computing
• Types of Cloud Computing
• Advantages of Cloud Computing

NOT

• Cloud Computing

5. Keep topic titles concise.

Ideal length:
3–8 words.

6. Every topic MUST contain a meaningful description.

The description should explain

• what the student will learn
• why it is important
• what concepts are covered

Do NOT simply repeat the title.

Bad Example

{
  "title":"Virtualization",
  "description":"Virtualization"
}

Good Example

{
  "title":"Virtualization",
  "description":"Understand virtualization concepts, their implementation, and their importance in efficient cloud resource management."
}

7. Every unit MUST contain a short description summarizing the overall learning objective of the unit.

8. Ignore

• Lecture Hours
• Credits
• Marks
• Duration

9. Remove duplicate topics.

10. Preserve technical terms exactly.

Examples

✓ IoT
✓ SAN
✓ VLAN
✓ IaaS
✓ Hypervisor
✓ Edge Computing

11. Do NOT include

Unit I

Unit II

I.

II.

inside the unit titles.

12. Do NOT generate markdown.

13. Return ONLY valid JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STUDY TIME ESTIMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estimate the average study time required for each topic.

Guidelines

Easy definition
→ 15–20 minutes

Medium conceptual topic
→ 25–40 minutes

Large theoretical topic
→ 45–60 minutes

Practical/Complex topic
→ 60–90 minutes

The estimated study time should represent the time required to

• read
• understand
• revise

the topic once.

For every unit,

estimated_study_minutes

must equal the sum of all topic study times.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIFFICULTY LEVEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Assign one difficulty level to every topic.

Allowed values ONLY

BEGINNER

INTERMEDIATE

ADVANCED

Guidelines

BEGINNER

Basic definitions

Introductions

History

Overview

Characteristics

INTERMEDIATE

Architectures

Models

Algorithms

Protocols

Conceptual understanding

ADVANCED

Optimization

Research

Complex implementations

Advanced architectures

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Units start from

1

2

3

...

Topics inside every unit start from

1

2

3

...

Do not skip order numbers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT JSON SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "units": [
    {
      "title": "string",
      "description": "string",
      "order": 1,
      "estimated_study_minutes": 120,
      "topics": [
        {
          "title": "string",
          "description": "string",
          "order": 1,
          "estimated_study_time": 30,
          "difficulty": "BEGINNER"
        }
      ]
    }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The roadmap should

✓ Preserve syllabus structure

✓ Cover every concept

✓ Split concepts logically

✓ Be student friendly

✓ Avoid duplicates

✓ Use professional academic language

✓ Generate realistic study time estimates

✓ Assign reasonable difficulty levels

✓ Produce clean JSON

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${subject_name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYLLABUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${syllabus_text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL INSTRUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY valid JSON.

Do not explain your reasoning.

Do not wrap the JSON inside markdown.

Do not include any text before or after the JSON.

The response must be directly parsable using JSON.parse().`;

export default roadmapPrompt;
