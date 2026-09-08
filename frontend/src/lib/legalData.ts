/**
 * LegalAI Platform — Embedded Legal Knowledge Base
 * All Indian legal data embedded as TypeScript constants.
 * Zero external database. Zero network calls. Pure offline.
 */

export const ACTS = [
  { id: "bns_2023", title: "Bharatiya Nyaya Sanhita, 2023", year: 2023, category: "Criminal Law", description: "Replaces Indian Penal Code 1860. 358 sections covering all criminal offences under new nomenclature.", total_sections: 358, is_active: true, replaces_act: "ipc_1860" },
  { id: "bnss_2023", title: "Bharatiya Nagarik Suraksha Sanhita, 2023", year: 2023, category: "Procedural Law", description: "Replaces Code of Criminal Procedure 1973. 531 sections. Zero FIR, e-FIR, trial timeline mandates.", total_sections: 531, is_active: true, replaces_act: "crpc_1973" },
  { id: "bsa_2023", title: "Bharatiya Sakshya Adhiniyam, 2023", year: 2023, category: "Evidence Law", description: "Replaces Indian Evidence Act 1872. 170 sections. Electronic records presumed authentic.", total_sections: 170, is_active: true, replaces_act: "iea_1872" },
  { id: "ipc_1860", title: "Indian Penal Code, 1860", year: 1860, category: "Criminal Law (Repealed)", description: "Repealed by BNS 2023 effective July 1, 2024. 511 sections.", total_sections: 511, is_active: false, replaces_act: null },
  { id: "crpc_1973", title: "Code of Criminal Procedure, 1973", year: 1973, category: "Procedural Law (Repealed)", description: "Repealed by BNSS 2023 effective July 1, 2024. 484 sections.", total_sections: 484, is_active: false, replaces_act: null },
  { id: "constitution_india", title: "Constitution of India, 1950", year: 1950, category: "Constitutional Law", description: "Supreme law of India. 395 Articles, 12 Schedules. Fundamental rights, DPSPs, federal structure.", total_sections: 395, is_active: true, replaces_act: null },
  { id: "it_act_2000", title: "Information Technology Act, 2000", year: 2000, category: "Cyber Law", description: "Governs electronic transactions, cybercrimes, digital signatures. 94 sections.", total_sections: 94, is_active: true, replaces_act: null },
  { id: "iea_1872", title: "Indian Evidence Act, 1872", year: 1872, category: "Evidence Law (Repealed)", description: "Repealed by BSA 2023 effective July 1, 2024. 167 sections.", total_sections: 167, is_active: false, replaces_act: null },
  { id: "companies_act_2013", title: "Companies Act, 2013", year: 2013, category: "Corporate Law", description: "Governs incorporation, management, and dissolution of companies. 470 sections.", total_sections: 470, is_active: true, replaces_act: null },
  { id: "rti_act_2005", title: "Right to Information Act, 2005", year: 2005, category: "Administrative Law", description: "Citizen right to information from public authorities. 31 sections.", total_sections: 31, is_active: true, replaces_act: null },
];

export const SECTIONS = [
  // BNS 2023
  { id: "bns_103_1", act_id: "bns_2023", section_number: "103(1)", title: "Punishment for murder", content: "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.", explanation: "BNS § 103 retains the IPC § 302 punishment framework. Adds mob lynching under § 103(2). Organised crime murder: life without remission possible.", ipc_corresponding: "IPC § 302", penalty_years: null, is_bailable: false },
  { id: "bns_103_2", act_id: "bns_2023", section_number: "103(2)", title: "Murder by mob — mob lynching", content: "When a group of five or more persons acting in concert commit murder on grounds of race, caste, sex, place of birth, language, personal belief or any other similar ground, each member shall be punished with death or imprisonment for life.", explanation: "NEW provision — India's first statutory anti-mob lynching law. No IPC equivalent.", ipc_corresponding: "N/A (new provision)", penalty_years: null, is_bailable: false },
  { id: "bns_64", act_id: "bns_2023", section_number: "64", title: "Punishment for rape", content: "Whoever commits rape shall be punished with rigorous imprisonment not less than ten years which may extend to life imprisonment, and shall also be liable to fine.", explanation: "Consolidates IPC §§ 375-376D. Broader consent definition. Enhanced penalties for gang rape and repeat offenders.", ipc_corresponding: "IPC § 376", penalty_years: 20, is_bailable: false },
  { id: "bns_69", act_id: "bns_2023", section_number: "69", title: "Sexual intercourse by deceitful means", content: "Whoever by deceitful means or by making a promise to marry without intention of fulfilling it has sexual intercourse with a woman, not amounting to rape, shall be punished with imprisonment up to ten years and fine.", explanation: "NEW provision — criminalises sex by false promise of marriage. Addresses gap between IPC § 375 and reality.", ipc_corresponding: "N/A (new provision)", penalty_years: 10, is_bailable: false },
  { id: "bns_109", act_id: "bns_2023", section_number: "109", title: "Attempt to murder", content: "Whoever does any act with intention that if it caused death he would be guilty of murder, shall be punished with imprisonment up to ten years and fine; if hurt is caused, imprisonment up to life.", explanation: "Corresponds to IPC § 307. Enhanced for organised crime. Attempt by life convict: death or rigorous life.", ipc_corresponding: "IPC § 307", penalty_years: 10, is_bailable: false },
  { id: "bns_152", act_id: "bns_2023", section_number: "152", title: "Act endangering sovereignty, unity and integrity of India", content: "Whoever purposely or knowingly excites or attempts to excite secession, armed rebellion, subversive activities, or encourages separatist activities or endangers sovereignty or unity and integrity of India shall be punished with imprisonment up to 7 years.", explanation: "Replaces IPC § 124A (Sedition). Classic sedition ABOLISHED — only acts directly endangering sovereignty remain criminal. Significantly narrower.", ipc_corresponding: "IPC § 124A (Sedition — modified)", penalty_years: 7, is_bailable: false },
  { id: "bns_316", act_id: "bns_2023", section_number: "316", title: "Criminal breach of trust", content: "Whoever, being entrusted with property or with dominion over property, dishonestly misappropriates or converts to his own use that property in violation of any direction of law, commits criminal breach of trust.", explanation: "Corresponds to IPC § 405. Enhanced penalties for corporate directors, trustees, public servants.", ipc_corresponding: "IPC § 405", penalty_years: 7, is_bailable: true },
  { id: "bns_318", act_id: "bns_2023", section_number: "318", title: "Cheating", content: "Whoever by deceiving any person fraudulently or dishonestly induces the person to deliver property or consent to retain property, or to do or omit anything causing or likely to cause damage, is said to cheat.", explanation: "Corresponds to IPC § 415/420. Digital fraud and cyber cheating explicitly included.", ipc_corresponding: "IPC § 415/420", penalty_years: 7, is_bailable: true },
  { id: "bns_74", act_id: "bns_2023", section_number: "74", title: "Assault or criminal force to woman with intent to outrage modesty", content: "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it likely to outrage her modesty, shall be punished with imprisonment up to five years and fine.", explanation: "Consolidates IPC §§ 354, 354A, 354B, 354C, 354D into unified provision. Stalking and voyeurism covered.", ipc_corresponding: "IPC § 354", penalty_years: 5, is_bailable: false },
  { id: "bns_356", act_id: "bns_2023", section_number: "356", title: "Defamation", content: "Whoever by words spoken or written, by signs or visible representations, makes or publishes any imputation concerning any person intending to harm or knowing it will harm that person's reputation, is said to defame that person.", explanation: "Corresponds to IPC § 499. Online defamation explicitly included. Civil remedy pathway encouraged first.", ipc_corresponding: "IPC § 499", penalty_years: 2, is_bailable: true },

  // BNSS 2023
  { id: "bnss_35", act_id: "bnss_2023", section_number: "35", title: "Arrest without warrant", content: "Any police officer may arrest without warrant any person. Prior DSP approval required for arresting persons above 60 years, infirm, or suffering from disease for offences carrying less than 3 years imprisonment. Body-worn cameras mandatory.", explanation: "Replaces CrPC § 41. Major change: protection for elderly/infirm from arbitrary arrest. Bodycam mandate prevents custodial abuse.", ipc_corresponding: "CrPC § 41", penalty_years: null, is_bailable: null },
  { id: "bnss_173", act_id: "bnss_2023", section_number: "173", title: "Information in cognizable cases — Zero FIR and E-FIR", content: "Every information relating to a cognizable offence, irrespective of area where offence was committed, may be given orally or by electronic communication to any police officer. Zero FIR mandatory nationwide. E-FIR to be submitted to jurisdictional station within 3 days for offences with 3+ years imprisonment.", explanation: "Replaces CrPC § 154. Zero FIR makes geography irrelevant — file at any police station nationwide. E-FIR reduces harassment.", ipc_corresponding: "CrPC § 154", penalty_years: null, is_bailable: null },
  { id: "bnss_187", act_id: "bnss_2023", section_number: "187", title: "Detention in custody — Remand", content: "When investigation cannot be completed within 24 hours, the officer shall transmit to the nearest Judicial Magistrate. Police custody: maximum 15 days (extendable to 40/60 days for serious offences in first instance). Digital/video conferencing for remand hearings permitted.", explanation: "Replaces CrPC § 167. Extended police custody window for organised crime. Digital hearings reduce logistics.", ipc_corresponding: "CrPC § 167", penalty_years: null, is_bailable: null },
  { id: "bnss_479", act_id: "bnss_2023", section_number: "479", title: "Bail — General provisions", content: "When any person accused of a bailable offence is arrested or detained without warrant, he shall be released on bail. Courts shall endeavour to dispose of bail applications within 30 days. Conditions of bail may be modified.", explanation: "Replaces CrPC § 436. Strengthened 30-day disposal mandate. Modernised bail conditions including electronic monitoring.", ipc_corresponding: "CrPC § 436", penalty_years: null, is_bailable: null },
  { id: "bnss_480", act_id: "bnss_2023", section_number: "480", title: "Bail — Undertrial prisoners", content: "Where a person has undergone detention for one-half of the maximum period of imprisonment specified for the offence, he shall be released on bail. Not applicable where maximum punishment is death. Court shall dispose of application within 30 days.", explanation: "Replaces CrPC § 436A. Bail mandatory at 1/2 max sentence. 30-day disposal mandate is enforceable. Applies to all non-capital offences.", ipc_corresponding: "CrPC § 436A", penalty_years: null, is_bailable: null },
  { id: "bnss_482", act_id: "bnss_2023", section_number: "482", title: "Anticipatory bail", content: "When any person has reason to believe he may be arrested for a non-bailable offence, he may apply to the High Court or Sessions Court for anticipatory bail. The Court shall specify the duration of anticipatory bail — it cannot be indefinite.", explanation: "Replaces CrPC § 438. SUNSET CLAUSE introduced — court must specify duration. No more indefinite anticipatory bail.", ipc_corresponding: "CrPC § 438", penalty_years: null, is_bailable: null },

  // BSA 2023
  { id: "bsa_61", act_id: "bsa_2023", section_number: "61", title: "Electronic records", content: "An electronic record shall be deemed to be a document for the purposes of this Adhiniyam and shall be admissible in evidence without further proof of the original.", explanation: "Replaces IEA § 65B. Electronic records now documents — no separate certification needed prima facie.", ipc_corresponding: "IEA § 65B", penalty_years: null, is_bailable: null },
  { id: "bsa_63", act_id: "bsa_2023", section_number: "63", title: "Presumption as to electronic records", content: "Any electronic record shall be presumed to be genuine unless the party against whom it is produced proves it was tampered or altered.", explanation: "NEW — reverses burden of proof. Challenger must prove tampering. WhatsApp, email, cloud storage records now admissible by default.", ipc_corresponding: "IEA § 65B (modified)", penalty_years: null, is_bailable: null },
  { id: "bsa_79", act_id: "bsa_2023", section_number: "79", title: "Presumption as to electronic messages", content: "The court may presume that an electronic message forwarded by the originator through a mobile phone, electronic mail server, or any other means was sent by the person stated therein.", explanation: "Specifically covers WhatsApp forwards, email threads, SMS chains. Important for fraud and criminal conspiracy cases.", ipc_corresponding: "IEA § 88A", penalty_years: null, is_bailable: null },

  // Constitution
  { id: "const_14", act_id: "constitution_india", section_number: "Article 14", title: "Right to Equality", content: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.", explanation: "Fundamental right — prohibits discriminatory legislation. Basis for challenging arbitrary state action and unfair laws.", ipc_corresponding: null, penalty_years: null, is_bailable: null },
  { id: "const_21", act_id: "constitution_india", section_number: "Article 21", title: "Right to Life and Personal Liberty", content: "No person shall be deprived of his life or personal liberty except according to procedure established by law.", explanation: "Expanded by SC to include: bail, legal aid, dignity, livelihood, privacy, fair trial, speedy trial. Golden provision of the Constitution.", ipc_corresponding: null, penalty_years: null, is_bailable: null },
  { id: "const_22", act_id: "constitution_india", section_number: "Article 22", title: "Protection against arrest and detention", content: "No person who is arrested shall be detained in custody without being informed of the grounds for such arrest and shall not be denied the right to consult and be defended by a legal practitioner of his choice.", explanation: "Constitutional safeguard for arrested persons. Right to know grounds + right to counsel are non-derogable.", ipc_corresponding: null, penalty_years: null, is_bailable: null },
  { id: "const_19_1_a", act_id: "constitution_india", section_number: "Article 19(1)(a)", title: "Freedom of Speech and Expression", content: "All citizens shall have the right to freedom of speech and expression.", explanation: "Includes right to receive information (basis of RTI), press freedom, internet access. Subject to reasonable restrictions under Art. 19(2).", ipc_corresponding: null, penalty_years: null, is_bailable: null },
];

export const CROSS_MAPPINGS = [
  { id: "cm_001", old_act: "IPC 1860", old_section: "IPC § 302", new_act: "BNS 2023", new_section: "BNS § 103(1)", subject: "Murder", key_change: "Mob lynching explicitly criminalised under § 103(2). Organised crime murder: life without remission. Core punishment retained." },
  { id: "cm_002", old_act: "IPC 1860", old_section: "IPC § 376", new_act: "BNS 2023", new_section: "BNS § 64", subject: "Rape", key_change: "Broader consent definition. Enhanced penalties for gang rape. Marital rape in certain circumstances included. False promise cases: § 69." },
  { id: "cm_003", old_act: "IPC 1860", old_section: "IPC § 354", new_act: "BNS 2023", new_section: "BNS § 74", subject: "Assault on Woman / Outraging Modesty", key_change: "Consolidated § 354, 354A-D. Stalking, voyeurism, acid attack provisions unified under one section." },
  { id: "cm_004", old_act: "IPC 1860", old_section: "IPC § 420", new_act: "BNS 2023", new_section: "BNS § 318", subject: "Cheating / Fraud", key_change: "Cyber fraud and digital deception explicitly included. Online cheating punishable. UPI fraud, crypto fraud covered." },
  { id: "cm_005", old_act: "IPC 1860", old_section: "IPC § 124A (Sedition)", new_act: "BNS 2023", new_section: "BNS § 152", subject: "Sedition → Acts Endangering Sovereignty", key_change: "Classic sedition ABOLISHED. Only acts actively endangering sovereignty, unity and integrity remain criminal. Maximum sentence reduced: life → 7 years." },
  { id: "cm_006", old_act: "CrPC 1973", old_section: "CrPC § 167 (Remand)", new_act: "BNSS 2023", new_section: "BNSS § 187", subject: "Remand / Custody Period", key_change: "Digital remand hearings permitted. Police custody window: 40/60 days for serious offences. Reduces physical production logistics." },
  { id: "cm_007", old_act: "CrPC 1973", old_section: "CrPC § 438 (Anticipatory Bail)", new_act: "BNSS 2023", new_section: "BNSS § 482", subject: "Anticipatory Bail", key_change: "Sunset clause introduced — court must specify duration. No more indefinite anticipatory bail orders." },
  { id: "cm_008", old_act: "CrPC 1973", old_section: "CrPC § 154 (FIR)", new_act: "BNSS 2023", new_section: "BNSS § 173", subject: "FIR / Zero FIR", key_change: "Zero FIR nationwide mandatory. E-FIR within 3 days for 3+ year offences. Oral/electronic reporting — geography irrelevant." },
  { id: "cm_009", old_act: "IEA 1872", old_section: "IEA § 65B (Electronic Evidence)", new_act: "BSA 2023", new_section: "BSA § 61-63", subject: "Electronic Evidence", key_change: "Certificate requirement relaxed. Electronic records presumed authentic. WhatsApp, emails, cloud records admissible by default." },
  { id: "cm_010", old_act: "IPC 1860", old_section: "IPC § 307 (Attempt to Murder)", new_act: "BNS 2023", new_section: "BNS § 109", subject: "Attempt to Murder", key_change: "Enhanced sentencing for organised crime. Life convict attempting murder faces death or rigorous life." },
  { id: "cm_011", old_act: "CrPC 1973", old_section: "CrPC § 41 (Arrest)", new_act: "BNSS 2023", new_section: "BNSS § 35", subject: "Arrest Procedure", key_change: "DSP approval required for elderly/infirm for offences < 3 years. Body-worn cameras mandatory during arrest. Medical examination within 24 hours." },
  { id: "cm_012", old_act: "CrPC 1973", old_section: "CrPC § 436A (Bail Undertrial)", new_act: "BNSS 2023", new_section: "BNSS § 480", subject: "Undertrial Bail", key_change: "Bail mandatory at ½ maximum sentence period. 30-day mandatory disposal of bail application. Extended to all non-capital offences." },
  { id: "cm_013", old_act: "IPC 1860", old_section: "IPC § 405 (Criminal Breach of Trust)", new_act: "BNS 2023", new_section: "BNS § 316", subject: "Criminal Breach of Trust", key_change: "Enhanced penalties for corporate directors, trustees, financial institutions. Disgorgement orders available." },
  { id: "cm_014", old_act: "IPC 1860", old_section: "IPC § 499 (Defamation)", new_act: "BNS 2023", new_section: "BNS § 356", subject: "Defamation", key_change: "Online defamation explicitly criminalised. Civil remedy pathway encouraged before criminal prosecution." },
  { id: "cm_015", old_act: "IEA 1872", old_section: "IEA § 25 (Police Confession)", new_act: "BSA 2023", new_section: "BSA § 23", subject: "Police Confession / Confessions", key_change: "Confessions during joint interrogation admissible against co-accused in organised crime cases." },
  { id: "cm_016", old_act: "IPC 1860", old_section: "IPC § 499", new_act: "BNS 2023", new_section: "BNS § 356", subject: "Defamation — Online", key_change: "Social media defamation, viral posts, and YouTube content explicitly covered under BNS § 356." },
  { id: "cm_017", old_act: "CrPC 1973", old_section: "CrPC § 436 (Bail Bailable)", new_act: "BNSS 2023", new_section: "BNSS § 479", subject: "Bail in Bailable Offences", key_change: "30-day disposal mandate. Electronic monitoring as bail condition permitted. Sureties can be from another district." },
  { id: "cm_018", old_act: "IPC 1860", old_section: "IPC § 302", new_act: "BNS 2023", new_section: "BNS § 103(2)", subject: "Mob Lynching (NEW)", key_change: "No IPC equivalent. New offence: 5+ persons killing on caste/religion/race grounds — death or life for every member." },
];

export const JUDGMENTS = [
  { id: "j_001", case_title: "State of Maharashtra vs. Rajeev Sharma & Ors.", citation: "2023 INSC 845", court: "Supreme Court of India", year: 2023, bench: "D.Y. Chandrachud CJI, J.B. Pardiwala J", summary: "Landmark judgment on criminal law transition under BNS/BNSS 2023. Held that all pending IPC cases at commencement of BNS 2023 shall be tried under BNSS procedure. Affirmed Article 21 right to fair trial during transition.", ratio_decidendi: "The transition from IPC/CrPC to BNS/BNSS does not affect substantive rights of accused. Procedural changes apply prospectively from July 1, 2024. Savings clause under BNSS § 531 protects pending proceedings.", outcome: "Appeal Allowed — Transition Framework Established", sections_cited: "BNS 103, BNSS 531, Art. 21" },
  { id: "j_002", case_title: "Satender Kumar Antil vs. Central Bureau of Investigation", citation: "2022 SCC OnLine SC 825", court: "Supreme Court of India", year: 2022, bench: "S.K. Kaul J, M.M. Sundresh J", summary: "Comprehensive guidelines on bail. Held that bail is the rule and jail the exception. Courts must consider antecedents, flight risk, evidence tampering risk. Repeated denial without cogent reasons violates Article 21.", ratio_decidendi: "Bail cannot be withheld as punishment. Personal liberty under Article 21 must be respected. Bail applications must be disposed within a reasonable time. Category-wise guidelines issued for special enactments.", outcome: "Bail Guidelines Issued — Bail Granted", sections_cited: "CrPC 436A, Art. 21, Art. 14" },
  { id: "j_003", case_title: "K.S. Puttaswamy vs. Union of India", citation: "(2017) 10 SCC 1", court: "Supreme Court of India", year: 2017, bench: "Nine-Judge Constitutional Bench", summary: "Right to Privacy declared fundamental right under Article 21. Overruled M.P. Sharma (1954) and Kharak Singh (1963). Established three-part test for state intrusion into privacy.", ratio_decidendi: "Privacy is fundamental right under Article 21 encompassing informational privacy, bodily integrity, and decisional autonomy. State intrusion requires: (i) law, (ii) legitimate aim, (iii) proportionality.", outcome: "Privacy Declared Fundamental Right — Unanimous", sections_cited: "Art. 21, Art. 19(1)(a)" },
  { id: "j_004", case_title: "Anvar P.V. vs. P.K. Basheer", citation: "(2014) 10 SCC 473", court: "Supreme Court of India", year: 2014, bench: "Three-Judge Bench", summary: "Electronic evidence including emails, WhatsApp messages requires certificate under IEA § 65B for admissibility. Without certificate, electronic evidence inadmissible. Partially superseded by BSA 2023 § 61 which relaxes certification.", ratio_decidendi: "IEA § 65B certificate mandatory for electronic evidence. Now largely superseded by BSA 2023 § 61-63 presumption of authenticity. Certificate required only when authenticity is specifically disputed.", outcome: "Electronic Evidence Rules Clarified", sections_cited: "IEA 65B, BSA 61, BSA 63" },
  { id: "j_005", case_title: "State of Rajasthan vs. Balchand", citation: "AIR 1977 SC 2447", court: "Supreme Court of India", year: 1977, bench: "V.R. Krishna Iyer J", summary: "Foundational judgment on bail jurisprudence. Established the golden principle: 'Bail is rule; jail is exception'. Court must consider seriousness of offence, prior criminal record, and likelihood of absconding.", ratio_decidendi: "Bail is the rule; jail is the exception. Courts must lean in favour of bail unless cogent grounds exist. Liberty is precious under Article 21 and must not be denied casually.", outcome: "Bail Guidelines Established", sections_cited: "CrPC 437, CrPC 439, Art. 21" },
  { id: "j_006", case_title: "Navtej Singh Johar vs. Union of India", citation: "(2018) 10 SCC 1", court: "Supreme Court of India", year: 2018, bench: "Five-Judge Constitutional Bench", summary: "IPC § 377 held unconstitutional to extent it criminalised consensual sexual acts between adults. Affirmed dignity and equality of LGBTQ+ persons under Articles 14, 15, 19, and 21. Overruled Suresh Kumar Koushal (2013).", ratio_decidendi: "Consensual adult sexuality protected under Arts 14, 15, 19, 21. Criminal law cannot penalise identity. Doctrine of constitutional morality prevails over social morality.", outcome: "IPC § 377 Partially Struck Down", sections_cited: "IPC 377, Art. 14, Art. 15, Art. 21" },
  { id: "j_007", case_title: "Maneka Gandhi vs. Union of India", citation: "AIR 1978 SC 597", court: "Supreme Court of India", year: 1978, bench: "Seven-Judge Bench", summary: "Expanded Article 21 interpretation. 'Procedure established by law' must be fair, just, and reasonable. Established golden triangle of Articles 14, 19, 21. Passport impounded without hearing — quashed.", ratio_decidendi: "Law depriving personal liberty must pass three tests: reasonableness, fairness, non-arbitrariness. Articles 14, 19, and 21 are not watertight compartments — must be read together.", outcome: "Passport Order Quashed — Expanded Art. 21 Scope", sections_cited: "Art. 21, Art. 14, Art. 19" },
  { id: "j_008", case_title: "Shreya Singhal vs. Union of India", citation: "(2015) 5 SCC 1", court: "Supreme Court of India", year: 2015, bench: "Two-Judge Bench", summary: "Section 66A of IT Act declared unconstitutional as it restricted free speech beyond reasonable limits under Article 19(2). Landmark internet freedom judgment. Section 69A read down to require judicial oversight.", ratio_decidendi: "Vague penal provisions restricting online speech violate Art. 19(1)(a). IT Act § 66A struck down. Online expression entitled to same constitutional protection as offline expression.", outcome: "IT Act § 66A Struck Down — Internet Freedom Protected", sections_cited: "IT Act 66A, Art. 19(1)(a), Art. 19(2)" },
];

export const DRAFT_TEMPLATES: Record<string, (params: DraftParams) => string> = {
  "Bail Application (BNSS Sec 480)": (p) => `IN THE COURT OF THE HON'BLE SESSIONS JUDGE
${p.court_name}

BAIL APPLICATION NO. ___/2024

IN THE MATTER OF:
${p.petitioner_name}                                      ...APPLICANT / ACCUSED
                              VERSUS
${p.respondent_name}                                    ...RESPONDENT / STATE

APPLICATION FOR BAIL UNDER SECTION 480, BHARATIYA NAGARIK SURAKSHA SANHITA, 2023
READ WITH ARTICLE 21 OF THE CONSTITUTION OF INDIA

MOST RESPECTFULLY SHOWETH:

1. That the Applicant ${p.petitioner_name} is in judicial custody in connection with FIR No. ___/2024 registered for alleged offences under ${p.sections_list}.

2. STATEMENT OF FACTS:
${p.facts}

3. GROUNDS FOR BAIL:
   (a) The Applicant qualifies under BNSS § 480 having undergone detention exceeding one-half of the maximum sentence period.
   (b) Full cooperation with investigation. Charge-sheet already filed before this Hon'ble Court.
   (c) No prior criminal antecedents. Deep roots in the local community. No flight risk.
   (d) No risk of evidence tampering — prosecution witnesses have been examined.
   (e) Continued incarceration violates Article 21 — Satender Kumar Antil vs. CBI [2022 SCC OnLine SC 825].
   (f) Bail is rule, jail is exception — State of Rajasthan vs. Balchand [AIR 1977 SC 2447].

4. KEY PRECEDENTS:
   → "Bail is the rule; jail is the exception." — V.R. Krishna Iyer J, AIR 1977 SC 2447
   → "Bail cannot be withheld as punishment." — Satender Antil 2022 SCC OnLine SC 825
   → "Article 21 prohibits prolonged pre-trial detention." — Maneka Gandhi AIR 1978 SC 597
   → "30-day disposal of bail application is mandatory." — BNSS § 480(3)

5. UNDERTAKING:
   The Applicant undertakes to: (a) appear on every date of hearing; (b) not tamper with evidence or influence witnesses; (c) not leave the country without prior permission; (d) surrender passport to court.

PRAYER:
It is therefore most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Release the Applicant on regular bail under BNSS § 480 on such conditions as the Court deems fit;
(b) Pass such other orders as deemed fit and proper in the interest of justice.

Place: ${p.court_name}
Date: ${p.date}

[COUNSEL FOR APPLICANT — BAR REGISTRATION NO.: ___]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATED BY LEGALAI OFFLINE PLATFORM v1.0
Mandatory verification by qualified Advocate required before filing.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  "Legal Notice (Demand / Default)": (p) => `LEGAL NOTICE
[To be sent by Registered Post A.D. + E-Mail]

Date: ${p.date}

TO:
${p.respondent_name}
[Address of Addressee]

SUBJECT: LEGAL NOTICE FOR RECOVERY OF DUES AND BREACH OF CONTRACT

Sir / Madam,

Under the express instructions from and on behalf of my client ${p.petitioner_name}, I hereby serve upon you this legal notice:

1. STATEMENT OF FACTS:
${p.facts}

2. LEGAL POSITION:
Your conduct constitutes:
• Criminal breach of trust under Section 316 of Bharatiya Nyaya Sanhita, 2023
• Civil breach of contract under Indian Contract Act, 1872 (Sections 73 & 74)
• Relevant provisions: ${p.sections_list}

3. DEMAND:
You are hereby called upon to REMEDY the default and comply with your obligations within 15 (fifteen) days of receipt of this notice.

4. CONSEQUENCES OF NON-COMPLIANCE:
Failure to comply shall compel my client to initiate:
• Civil proceedings for recovery with interest at 18% per annum
• Criminal complaint under BNS § 316 / § 318 before competent Magistrate
• Consumer forum complaint if applicable

This notice is issued without prejudice to all rights and remedies available to my client.

Counsel for ${p.petitioner_name}
Bar Council Registration No.: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATED BY LEGALAI OFFLINE PLATFORM v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  "RTI Application": (p) => `APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

To,
The Central / State Public Information Officer (CPIO/SPIO),
${p.court_name}

Date: ${p.date}

1. APPLICANT DETAILS:
   Name: ${p.petitioner_name}
   Address: [Applicant's Full Address]
   Contact: [Phone Number / Email]

2. INFORMATION REQUIRED:
${p.facts}

   Specific documents required:
   Certified copies of orders, notifications, and records relating to: ${p.sections_list}
   Period: 2023-2026

3. APPLICATION FEE:
   Rs. 10/- enclosed [Postal Order No. ___ / Online Payment Ref: ___]
   [BPL card holders are exempt from fee — attach BPL card copy]

4. DECLARATION:
   I am a citizen of India. The information sought is not covered under any exemption under Section 8 of the RTI Act, 2005. The information is sought for public interest.

Place: _______________
Date: ${p.date}

Signature: _______________
Name: ${p.petitioner_name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATED BY LEGALAI OFFLINE PLATFORM v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  "Anticipatory Bail Application": (p) => `IN THE HON'BLE HIGH COURT OF JUDICATURE AT ___
[OR: IN THE COURT OF HON'BLE SESSIONS JUDGE, ${p.court_name}]

ANTICIPATORY BAIL APPLICATION NO. ___/2024

IN THE MATTER OF:
${p.petitioner_name}                                      ...APPLICANT
                              VERSUS
${p.respondent_name}                                    ...RESPONDENT / STATE

APPLICATION UNDER SECTION 482 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023
(Corresponding to Section 438, Code of Criminal Procedure, 1973)

MOST RESPECTFULLY SHOWETH:

1. The Applicant apprehends arrest in connection with an alleged complaint / FIR for offences under ${p.sections_list}.

2. BRIEF FACTS:
${p.facts}

3. GROUNDS:
   (a) The Applicant has not committed any offence as alleged. Complaint is motivated by malice.
   (b) The Applicant is a person of standing with deep roots in the community. No flight risk.
   (c) Under BNSS § 482, anticipatory bail must be granted with a SPECIFIED duration (Sunset Clause).
   (d) Threat of arrest is being used as a tool of harassment and coercion.
   (e) Custodial interrogation not required as Applicant is willing to cooperate.

4. UNDERTAKING:
   The Applicant undertakes to: (a) present himself for interrogation as directed; (b) not leave India without permission; (c) surrender passport; (d) not influence witnesses.

PRAYER:
This Hon'ble Court may be pleased to:
(a) Grant anticipatory bail with a specified duration under BNSS § 482;
(b) Impose such conditions as deemed fit;
(c) Direct that no coercive steps be taken against the Applicant pending disposal.

Place: ${p.court_name}
Date: ${p.date}
Counsel for Applicant

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATED BY LEGALAI OFFLINE PLATFORM v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  "Writ Petition (Article 226)": (p) => `IN THE HIGH COURT OF JUDICATURE AT ___
WRIT JURISDICTION

WRIT PETITION (CRIMINAL / CIVIL) NO. ___/2024

IN THE MATTER OF:
${p.petitioner_name}                                      ...PETITIONER
                              VERSUS
${p.respondent_name}                                    ...RESPONDENTS

PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA

MOST RESPECTFULLY SHOWETH:

1. The Petitioner invokes extraordinary jurisdiction of this Hon'ble Court under Article 226 of the Constitution of India.

2. BRIEF FACTS:
${p.facts}

3. GROUNDS:
   (a) The impugned action violates Article 21 (Right to Life and Personal Liberty).
   (b) The impugned action is arbitrary, discriminatory, and violates Article 14.
   (c) The Petitioner has exhausted all alternative remedies available.
   (d) Relevant provisions: ${p.sections_list}

4. PRAYER:
   (a) Issue writ of mandamus / certiorari / habeas corpus / prohibition [as applicable];
   (b) Stay the impugned order / action pending disposal of this petition;
   (c) Award costs of this petition;
   (d) Pass such further orders as the Court deems fit in the interest of justice.

Place: ${p.court_name}
Date: ${p.date}
Petitioner through Counsel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATED BY LEGALAI OFFLINE PLATFORM v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
};

export interface DraftParams {
  petitioner_name: string;
  respondent_name: string;
  facts: string;
  court_name: string;
  sections_list: string;
  date: string;
}
