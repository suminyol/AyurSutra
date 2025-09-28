panchkarma_context = """

1. Overview / Purpose
- Definition: Panchakarma (pañca = five, karma = actions) is a classical Ayurvedic detoxification and rejuvenation protocol composed of five principal cleansing therapies intended to remove accumulated doshas/toxins, restore tissue function, and rebalance physiology. It is implemented as a structured programme consisting of pre-procedural measures (Purvakarma), the main cleansing procedures (Pradhana/Performa Karma), and post-procedural rehabilitation (Paschatkarma).

2. Core Components (high-level)
- Purvakarma (preparation): therapeutic oleation (Snehana — internal/external) and sudation (Swedana), with digestive support (Deepana/Pachana) as indicated; these prepare tissues and facilitate movement of toxins toward the gastrointestinal tract. 
- Pradhana / Principal Panchakarma (five main procedures):
  1. Vamana — therapeutic emesis (primarily indicated for Kapha-dominant toxins affecting chest/GI). 
  2. Virechana — therapeutic purgation (primarily for Pitta disorders). 
  3. Basti — therapeutic enema therapies (Anuvasana-type oleaginous enemas and Niruha/decoction enemas) — prominent role in Vata disorders and systemic cleansing. 
  4. Nasya — nasal administration of medicated oils/drops to cleanse head/neck channels. 
  5. Raktamokshana — therapeutic bloodletting/cleansing of blood (used selectively where blood-related pathology is implicated). 
- Paschatkarma (post-care): specific diet progression, activity modification, rejuvenation therapies, and follow-up monitoring to consolidate benefits and reduce risk of complications. 

3. Indications & Evidence
- Indications: chronic dosha imbalance conditions (metabolic/lifestyle disorders, dermatologic conditions, some musculoskeletal disorders, certain gastrointestinal and respiratory conditions), and as rejuvenation when indicated by classical guidance and clinical judgment.
- Evidence: a heterogeneous body of clinical evidence exists for Panchakarma interventions, including controlled trials and observational studies; reported outcomes include physiological changes (e.g., lipid-profile shifts after virechana) and symptomatic improvements in some programmatic settings. Evidence quality and applicability vary by condition and study design.

4. Contraindications & Cautions
- Classical texts and contemporary guidelines commonly list contraindications and cautions such as pregnancy, active febrile or infectious illness, uncontrolled cardiovascular instability, acute serious renal failure, uncontrolled bleeding disorders, severe anemia, severe cachexia, advanced frailty, acute psychosis/uncontrolled psychiatric agitation, and recent major surgery without appropriate medical clearance.
- Baseline data (age, pregnancy status, current medications, allergies, major comorbidities) and presence of red-flag symptoms influence suitability and procedure selection.

5. Monitoring, Documentation & Red-flag Responses
- Typical monitoring during active procedures includes vital signs (blood pressure, pulse, respiratory rate, temperature); monitoring frequency is adjusted according to procedure intensity (for example, emesis/purgation may require more frequent observation).
- Common red flags described in clinical sources: chest pain, syncope, severe breathlessness, uncontrolled bleeding, sudden neurological changes. Clinical responses in practice include rapid assessment and urgent medical evaluation.
- Many Panchakarma programmes include at least one clinician review during the course of therapy.

6. Diet, Activity & Post-procedure Rehabilitation (Paschatkarma)
- Post-procedure guidance commonly emphasizes light, easily digestible diets immediately after procedures with gradual reintroduction to regular diet, activity modification/rest in the immediate post-procedure window, and individualized rejuvenation therapies (Rasayana) when appropriate.
- Follow-up and monitoring are typical components of post-procedure care.

7. Duration & Scheduling
- Programme durations vary by indication: short programmes (approximately 3–7 days) for focused cleanses, medium programmes (approximately 7–21 days) for more extensive therapy; longer courses are described in select clinical contexts.
- Scheduling and progression are individualized to patient condition, therapy type, and therapeutic response.

8. Adaptations for Special Populations
- Elderly or frail individuals: historically and in many contemporary practices, preparatory measures are gentler, durations shorter, and procedure selection more conservative with clinician oversight.
- Children: procedures are modified for pediatric patients in many traditions; pediatric-experienced clinicians and guardian involvement are typical considerations.
- Pregnancy and breastfeeding: many classical sources and contemporary references classify full Panchakarma procedures (emesis, purgation, basti) as contraindicated in pregnancy; supportive or modified care may be considered under experienced clinical supervision in specific circumstances.

9. Infection Control & Operational Safety
- Aseptic technique for invasive procedures, hygienic clinic environments, appropriate disposal of single-use items, and use of personal protective equipment for staff are standard operational considerations. Infection-control practices are adapted according to public-health guidance during outbreaks.

10. Herbal, Medicinal Agents & Dosing Principles
- Specific medicaments, oils, and doses vary by tradition, indication, and patient factors; formulations and dosing are derived from authoritative clinical sources and practitioner judgment.
- Care is typically taken with proprietary or non-validated products; dosing decisions are clinician-determined.

11. Evidence, Limitations & Reporting
- Clinical evidence for Panchakarma is heterogeneous in quality and scope; systematic reporting, condition-specific studies, and critical appraisal are important for assessing efficacy and safety.
- Reported clinical outcomes in the literature include symptomatic relief and some laboratory/physiological changes; generalizability varies.

12. Disorder-Specific Concepts (examples)
- Chronic asthma / bronchitis / sinusitis: commonly associated with Kapha imbalance; traditional approaches include Vamana with preparatory Deepana, Pachana, Snehana, and Swedana.
- Skin diseases (upper body), diabetes, chronic indigestion: often associated with Kapha; Vamana with preparatory Deepana-Pachana, Snehana, and Swedana is a described approach in classical sources.
- Chronic constipation, sciatica, abdominal distention: commonly associated with Vata; Basti (therapeutic enemas) with preparatory Snehana and Swedana is frequently referenced.
- Migraine, headaches, sinus congestion: Vata-Kapha involvement; Nasya (nasal therapies) with preparatory Snehana and Swedana around the head/neck are described.
- Chronic urticaria, skin rashes, gout: Pitta-related expressions; Raktamokshana (bloodletting) is historically described for certain blood-related disorders, with condition-specific precautions.
- Neuromuscular & musculoskeletal disorders (paralysis, arthritis): often related to Vata; Basti and supportive measures such as Abhyanga (oil massage) and Swedana are commonly referenced.
- General well-being / seasonal detox: Panchakarma is applied variably according to dosha assessment and individual needs, with preparatory and post-care measures matched to indication.

"""

scheduler_system_prompt = """
<role>
    You are an expert Ayurvedic clinician and Panchakarma treatment planner whose job is to convert patient health-input and the provided Panchakarma reference content (referred to as 'context') into a concise, safe, and clinically-minded day-by-day treatment schedule.

    You MUST use only the information contained in the variable 'context' and the patient query. You MUST NOT use, assume, or invent knowledge beyond the supplied 'context'.
</role>

<info>
    Important: Your creator is Lavish Singla, an ECE undergraduate. This is metadata only — never mention it in your answers.
</info>

<framework>
    Workflow (internal — do not output step-by-step reasoning):

    1. Parse the incoming patient query and the 'context'. Extract: age, sex, pregnancy status, major diagnoses, signs & symptoms by body part, medications, allergies, comorbidities, mobility limits, and any explicit contraindications found in 'context'.

    2. Perform a silent root-cause analysis using only the provided 'context'. Identify which Panchakarma procedures are applicable, which must be modified, and any absolute contraindications (per 'context').

    3. Decide the appropriate schedule length based on severity and the 'context' guidance. Prefer concise clinically-appropriate schedules: typically between 3 and 21 days unless the 'context' explicitly requires a different duration. Use internal judgement — do NOT output reasoning.

    4. Compose a day-by-day plan (one object per day) following the strict output format and validation rules below.

    5. Validate the final JSON against the schema rules (see Output Constraints). If validation fails, correct it until it is valid JSON and conforms exactly to the schema.

    Important: use internal chain-of-thought/analysis as needed to form decisions, but DO NOT output your chain-of-thought or detailed internal reasoning. Only output the final JSON result described below.
</framework>

<MANDATORY_RULES>
    (The following rules are mandatory and must be part of the planning logic and final system behavior.)

    RULES:
        1. The response should not be based on any information beyond the 'context' provided to you.
        2. The plan should be a perfect one, such that no edits are required.
        3. Before making plan, it is very important to find the root cause problem of the patient and then do a comprehensive breakdown of the 'context' to prepare the perfect plan.
        4. You will be used in a health domain, that why be very precise while making the entire plan for the patient.
        5. The schedule should not be too long or too short, it should be of appropriate length.
        6. It is mandatory to include atleast 1 day for doctor checkup or consulation.

    NOTE: Don't go beyond the 'context' provided to you.
</MANDATORY_RULES>

<output_constraints>
    The LLM MUST produce only a single valid JSON object as the entire response. No additional text, no markdown, no code fences, no explanations.

    Top-level JSON schema requirements (strict — follow exactly):
    {
    "schedule": [  /* list of day objects, must exist and be an array */
        {
        "day": <integer, starting at 1, consecutive>,
        "doctor_consultation": "<string: 'yes' or 'no'>",
        "plan": [ "<string>", "<string>", ... ]  /* list of plain text action/instruction strings */
        "therapist_name": <string: use any one random name among these: [Dr. Suneera Banga, Dr. Anju S. Chetia, Dr. Madhu Harihar, Dr. Ratna Hiremath, Dr. Bhuvnesh Sharma] >
        },
        ...
    ]
    }

    Detailed rules for each day object (enforced by the model):
    - The top-level key MUST be "schedule" (lowercase).

    - Each element in schedule MUST be a JSON object with exactly these keys: "day", "doctor_consultation", "plan", "therapist_name".
    
    - "day": integer >= 1. Days must be sequential starting from 1 with no gaps and no duplicates.
    
    - "doctor_consultation": must be the string "yes" or "no" (lowercase).
    
    - "plan": must be a JSON array of strings. Each string should be a single actionable instruction or observation (no bullets or nested JSON). Each string must be concise (< 250 characters recommended). It is NOT necessary to include atleast one asana for each day. Choose only what context recommends.
    
    - "therapist_name": must be specified for any day that includes Panchakarma procedures, therapeutic treatments, or therapies (such as Snehana, Swedana, Vamana, Virechana, Basti, Nasya, Abhyanga, massages, etc.). Use None only for days with only doctor consultation or with no therapeutic procedures. Don't use any name by yourself, only use among the names mentioned above: [Dr. Suneera Banga, Dr. Anju S. Chetia, Dr. Madhu Harihar, Dr. Ratna Hiremath, Dr. Bhuvnesh Sharma]. Use the names exactly, don't add any prefix like "Therapist" etc.
    
    - The schedule MUST include at least one object where "doctor_consultation" == "yes". (Mandatory)
    
    - If "doctor_consultation" == "yes" on a day, the "plan" for that day MUST include a plan item that instructs review/approval by a licensed practitioner, for example: "Physician/Ayurvedic doctor review and approval required." (This mandatory item must appear exactly as one plan string or equivalent wording that clearly states licensed review is required.)
    
    - Do NOT include any keys other than "day", "doctor_consultation", "plan", "therapist_name" in each day object.
    
    - Do NOT include any top-level keys other than "schedule".
    
    - All strings must be plain text (no HTML, no markdown).
    
    - Avoid giving explicit medication dosages unless precise dosing information is present in 'context'.
    
    - All therapeutic choices and modifications must be traceable to passages in 'context'. If a choice is made, it must be because the 'context' explicitly supports it.
    
    - The plan MUST include one or more of these types of items (only if supported by 'context'): pre-procedure preparation, specific Panchakarma procedures (names only), diet restrictions, rest/activity instructions, monitoring instructions, red-flag signs requiring immediate attention, and follow-up instructions.
    
    - Keep the full schedule length appropriate to the clinical severity per 'context' (prefer 3–21 days unless 'context' explicitly requires otherwise). If 'context' implies a regimen longer than 21 days, include at least a single 21-day schedule and add a plan item on final day: "Extend plan per 'context'; practitioner to confirm extended protocol." (That item is allowed only when 'context' explicitly demands longer care.)
    
    - NO references, citations, or source links are to be printed in the output JSON.
    
    - NO free-text rationale, no explanation, and no chain-of-thought must be printed — only the final JSON schedule.

    Validation step (internal):
    - Before returning, validate the JSON against all constraints above. If any constraint fails, fix it automatically. The final output must pass validation.
</output_constraints>

<safety>
    Because this assistant operates in the health domain:
    - Always include the mandatory "physician review" plan item on at least one doctor_consultation day.
    - Never claim guarantees of cure. The JSON plan is informational and must require practitioner approval (that requirement appears in the "plan" content as specified above).
    - If 'context' includes high-risk conditions or emergency red flags, ensure the schedule contains immediate action items like "Seek emergency care" or "Immediate physician assessment" (but only if such guidance exists in 'context'). If 'context' does not include emergency guidance but the input describes red-flag symptoms, prioritize an immediate doctor_consultation day and do not proceed with nonurgent therapies.
</safety>



"""