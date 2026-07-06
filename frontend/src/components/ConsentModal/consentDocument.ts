// ============================================
// Structured content of src/assets/legal/patient-consent.pdf
// Transcribed verbatim (section/clause text unmodified) for display
// inside ConsentModal. The original file remains the legal source of truth
// and is offered as a download from the modal.
// ============================================

export interface ConsentClause {
    number: string
    text: string
}

export interface ConsentSection {
    id: string
    title: string
    clauses: ConsentClause[]
}

export const CONSENT_DOCUMENT = {
    companyName: 'PHYSOFT LLC',
    documentTitle:
        'Client Terms of Service, Informed Consent, Privacy Policy, Intellectual Property and Liability Protection Agreement',
    documentSubtitle: 'Virginia Fitness, Performance and Movement Analysis Services',
    notice: `IMPORTANT BUSINESS DRAFT. This document is written as a clickwrap-style agreement that may be accepted electronically before services begin. PHYSOFT may connect this document to a separate intake form, invoice, website checkbox, software acceptance screen, QR-code form, or electronic signature platform. This template is not legal advice. Its enforceability depends on applicable law, actual operations, licensing rules, consumer protection rules, and the facts of each case.`,
    effectiveLine: `Effective upon electronic acceptance, booking, payment, account creation, or use of PHYSOFT services.`,

    sections: [
        {
            id: '1',
            title: 'Agreement Structure and Acceptance',
            clauses: [
                { number: '1.1', text: `Binding Agreement. These Terms of Service, Informed Consent, Privacy Policy, Intellectual Property and Liability Protection Agreement (the "Terms") form a binding agreement between the client, user, participant, parent or legal representative, as applicable ("Client"), and PHYSOFT LLC, a Virginia limited liability company ("PHYSOFT," "Company," "we," "us," or "our").` },
                { number: '1.2', text: `Electronic Acceptance. Client accepts these Terms by clicking "I Agree," checking an acceptance box, signing electronically, paying an invoice, booking a service, creating an account, using PHYSOFT software, attending a session, receiving an assessment, or otherwise using any PHYSOFT service. Client agrees that electronic acceptance is intended to have the same effect as a handwritten signature to the maximum extent permitted by applicable law.` },
                { number: '1.3', text: `No Blank Fields Required. These Terms are designed to be incorporated into an electronic intake, booking, account, invoice, or software flow. Client-specific details may be collected separately and incorporated by reference into these Terms.` },
                { number: '1.4', text: `Read Before Use. Client is responsible for reading these Terms before accepting or using the services. If Client does not agree, Client must not book, pay for, access, or use PHYSOFT services.` },
                { number: '1.5', text: `Order of Documents. If PHYSOFT provides a written invoice, service description, program plan, intake form, safety instruction, privacy notice, or separate consent, those documents are incorporated into these Terms. In the event of conflict, the most specific written document for the service controls, unless prohibited by law.` },
                { number: '1.6', text: `No Waiver of Non-Waivable Rights. Nothing in these Terms is intended to waive rights that cannot legally be waived under applicable law. All releases, limitations, refunds, and restrictions apply only to the maximum extent permitted by law.` }
            ]
        },
        {
            id: '2',
            title: 'Description of Services',
            clauses: [
                { number: '2.1', text: `General Scope. PHYSOFT provides fitness, performance, movement analysis, exercise, wellness, technology-supported training, sport-science, mobility, strength, recovery, data analytics, and related educational services.` },
                { number: '2.2', text: `Examples of Services. Services may include movement screening, biomechanical analysis, posture assessment, strength and mobility testing, balance testing, gait analysis, swing or sport movement analysis, EMG-related evaluation, inertial sensor testing, exercise instruction, training programs, fitness coaching, return-to-activity support, recovery strategies, education, and performance reporting.` },
                { number: '2.3', text: `Technology-Supported Services. PHYSOFT may use sensors, cameras, wearable devices, EMG equipment, inertial units, force or balance tools, timing systems, software, spreadsheets, dashboards, artificial intelligence tools, reporting templates, and third-party equipment to support analysis and services.` },
                { number: '2.4', text: `Service Changes. PHYSOFT may modify, add, suspend, or discontinue services, equipment, methods, or procedures at any time for safety, operational, legal, professional, or business reasons.` },
                { number: '2.5', text: `No Emergency Services. PHYSOFT does not provide emergency medical services. Client must call emergency services or seek immediate medical attention for chest pain, severe shortness of breath, fainting, suspected stroke, uncontrolled bleeding, severe allergic reaction, serious injury, or any urgent medical concern.` },
                { number: '2.6', text: `Individual Results Vary. Services may be personalized, but outcomes depend on health status, compliance, training history, sleep, nutrition, injury history, genetics, stress, consistency, and other factors outside PHYSOFT control.` }
            ]
        },
        {
            id: '3',
            title: 'Fitness Company Status and No Medical Advice',
            clauses: [
                { number: '3.1', text: `Fitness and Performance Business. PHYSOFT is structured as a fitness, performance and movement analysis company unless a particular service is expressly provided by a separately licensed professional acting within that professional scope.` },
                { number: '3.2', text: `No Medical Diagnosis. PHYSOFT services are not a substitute for medical diagnosis, medical treatment, physical therapy, occupational therapy, chiropractic care, mental health care, emergency care, or any other licensed healthcare service unless expressly stated in writing by a properly licensed provider.` },
                { number: '3.3', text: `Educational Information. Any information provided by PHYSOFT is for fitness, performance, wellness, movement education, and general informational purposes. Client should consult a physician or licensed healthcare provider before beginning exercise or technology-supported interventions, especially if Client has medical conditions, pain, injury, pregnancy, implants, cardiovascular risk, neurological conditions, metabolic disease, or other concerns.` },
                { number: '3.4', text: `No Physician-Patient Relationship. Use of PHYSOFT services does not create a physician-patient relationship or other licensed healthcare relationship unless a licensed professional separately establishes that relationship in writing.` },
                { number: '3.5', text: `Referral Rights. PHYSOFT may decline, pause, or stop services and recommend that Client seek medical clearance or professional care when PHYSOFT believes doing so is appropriate for safety, scope, or legal reasons.` },
                { number: '3.6', text: `Client Responsibility for Medical Decisions. Client remains responsible for all medical decisions and for following the advice of Client's physicians and healthcare providers.` }
            ]
        },
        {
            id: '4',
            title: 'Client Eligibility and Responsibilities',
            clauses: [
                { number: '4.1', text: `Truthful Information. Client agrees to provide accurate and complete information about health history, pain, injury, surgeries, medications, allergies, implanted devices, pregnancy status, exercise experience, physical limitations, goals, and any other relevant factor.` },
                { number: '4.2', text: `Updates. Client must promptly update PHYSOFT if any condition changes, including new pain, injury, diagnosis, medication, dizziness, fainting, shortness of breath, skin irritation, infection, surgery, pregnancy, or change in medical advice.` },
                { number: '4.3', text: `Following Instructions. Client agrees to follow safety instructions, equipment instructions, exercise instructions, facility rules, clothing requirements, hygiene requirements, and staff directions.` },
                { number: '4.4', text: `Right to Stop. Client must stop and notify PHYSOFT immediately if Client feels pain, dizziness, nausea, numbness, tingling, shortness of breath, chest pressure, unusual fatigue, weakness, confusion, skin burning, electrical discomfort, needle discomfort, or any other concerning symptom.` },
                { number: '4.5', text: `No Misuse. Client may not misuse equipment, software, materials, facilities, or staff time. Client may not interfere with others, act aggressively, harass staff, violate safety rules, or record restricted content.` },
                { number: '4.6', text: `Minors. If services are provided to a minor, the parent or legal guardian must personally accept these Terms on behalf of the minor before services begin. By accepting these Terms on behalf of a minor, the parent or legal guardian personally and individually agrees, on behalf of themselves, the minor, and the minor's heirs and representatives, to the assumption of risk, release, limitation of liability, and indemnification provisions in Sections 5, 14, and 15, to the maximum extent permitted by applicable law. The parent or legal guardian further agrees to personally indemnify and hold PHYSOFT harmless from any claim brought by, or on behalf of, the minor arising from the minor's participation, to the extent permitted by law, and agrees to supervise or authorize participation as required by PHYSOFT policies.` }
            ]
        },
        {
            id: '5',
            title: 'Informed Consent and Assumption of Risk',
            clauses: [
                { number: '5.1', text: `Consent to Participate. Client voluntarily consents to participate in PHYSOFT services, including physical activity, assessments, technology-supported analysis, and training procedures selected for Client's goals and screening information.` },
                { number: '5.2', text: `Inherent Risks. Client understands that exercise, testing, fitness instruction, mobility work, strength work, balance tasks, performance drills, manual cueing, electrical stimulation, sensors, wearable devices, and other services involve inherent risks.` },
                { number: '5.3', text: `Potential Risks. Risks may include soreness, fatigue, skin irritation, bruising, dizziness, falls, muscle strain, joint discomfort, aggravation of existing conditions, temporary performance decrease, emotional frustration, equipment discomfort, electrical sensation, needle discomfort where applicable, and in rare cases serious injury.` },
                { number: '5.4', text: `Assumption of Risk. Client knowingly, voluntarily, and expressly assumes all risks inherent in the services, including risks caused by Client's health status, failure to disclose information, failure to follow instructions, or voluntary participation in physical activity. This assumption of risk is a material inducement for PHYSOFT to provide services to Client and is independent of, and in addition to, any release, limitation of liability, or indemnification elsewhere in these Terms.` },
                { number: '5.5', text: `No Guarantee of Safety. PHYSOFT uses reasonable precautions, but no fitness or performance service can be made risk-free. Client agrees that participation is voluntary and not required.` },
                { number: '5.6', text: `Medical Clearance. PHYSOFT may request medical clearance, but the absence of a clearance request does not mean Client is risk-free. Client remains responsible for determining whether participation is appropriate.` }
            ]
        },
        {
            id: '6',
            title: 'Scientific Training, Technology and Equipment',
            clauses: [
                { number: '6.1', text: `Consent to Scientific Methods. Client consents to PHYSOFT using scientific, data-informed, technology-supported, and performance-based methods to assess movement, compare metrics, guide training, and monitor progress.` },
                { number: '6.2', text: `Equipment May Include. Equipment may include cameras, tablets, phones, sensors, EMG devices, electrical stimulation devices, wearable systems, resistance bands, weights, cable machines, balance tools, mobility tools, force or timing devices, and proprietary or third-party software.` },
                { number: '6.3', text: `Equipment Limitations. Equipment may produce imperfect, incomplete, delayed, or approximate results. Data interpretation depends on placement, calibration, user compliance, environment, software, and professional judgment.` },
                { number: '6.4', text: `No Ownership of Raw Tools. Client does not acquire any right to PHYSOFT equipment, software, templates, formulas, dashboards, proprietary databases, or internal methods by using the services.` },
                { number: '6.5', text: `Third-Party Equipment. PHYSOFT may use or reference equipment, software, or services made by third parties. PHYSOFT does not control all third-party products and is not responsible for third-party outages, updates, limitations, privacy practices, or defects except as required by law.` },
                { number: '6.6', text: `Safety Decisions. PHYSOFT may remove, adjust, substitute, or discontinue any equipment or method for safety, legal, scope, business, or operational reasons.` }
            ]
        },
        {
            id: '7',
            title: 'Electrical Stimulation and Controlled Energy Devices',
            clauses: [
                { number: '7.1', text: `Consent to Controlled Electrical Stimulation. Client consents to the possible use of controlled electrical stimulation or similar devices as part of fitness, activation, recovery, performance, or neuromuscular training when PHYSOFT determines it is appropriate.` },
                { number: '7.2', text: `Possible Device Types. Devices may include NMES, EMS, TENS, FES-like training tools, biofeedback systems, EMG-triggered systems, or other lawful technologies, depending on availability, Client screening, and service scope.` },
                { number: '7.3', text: `Sensations and Risks. Client understands that electrical stimulation may cause tingling, pulsing, muscle contraction, discomfort, redness, temporary soreness, skin irritation, adhesive irritation, fatigue, or aggravation of underlying conditions.` },
                { number: '7.4', text: `Contraindications. Client must disclose pacemakers, implanted defibrillators, implanted electrical devices, pregnancy, seizure history, cancer, blood clots, active infection, open wounds, impaired sensation, uncontrolled heart conditions, metal implants near the application site, recent surgery, or any condition that may affect safety.` },
                { number: '7.5', text: `Right to Refuse. Client may refuse electrical stimulation at any time. Refusal may limit available services, but PHYSOFT may offer alternatives where reasonable.` },
                { number: '7.6', text: `Placement and Intensity. PHYSOFT may adjust electrode placement, intensity, duration, and protocol based on comfort and response. Client must immediately report discomfort, burning, pain, dizziness, or abnormal symptoms.` }
            ]
        },
        {
            id: '8',
            title: 'Needle-Based Techniques and Professional Scope',
            clauses: [
                { number: '8.1', text: `Limited Scope Statement. PHYSOFT will not represent needle-based techniques as available unless the service is legally permitted and performed by a person who is appropriately licensed, trained, authorized, and acting within the lawful scope of practice.` },
                { number: '8.2', text: `Separate Consent May Be Required. If dry needling, acupuncture-like procedures, trigger point needling, or any needle-based service is offered, PHYSOFT may require a separate informed consent and screening process before the technique is performed.` },
                { number: '8.3', text: `Risks. Needle-based techniques may involve discomfort, bleeding, bruising, soreness, skin irritation, infection risk, fainting, dizziness, nerve irritation, pneumothorax risk in certain areas, and other risks explained before the procedure.` },
                { number: '8.4', text: `Client Choice. Client may refuse needle-based techniques without refusing all PHYSOFT services, unless the requested service cannot reasonably be performed without that technique.` },
                { number: '8.5', text: `No Scope Expansion. Nothing in these Terms authorizes PHYSOFT or any person to perform a service that is not permitted by applicable law, licensing rules, or professional standards.` },
                { number: '8.6', text: `Referral. PHYSOFT may refer Client to a physician, physical therapist, acupuncturist, or other licensed provider when needle-based or medical care is outside PHYSOFT's business scope.` }
            ]
        },
        {
            id: '9',
            title: 'Data Collection, Privacy and De-Identified Analytics',
            clauses: [
                { number: '9.1', text: `Data Collected. PHYSOFT may collect identifying data, contact data, scheduling data, payment status, intake responses, movement data, performance metrics, sensor data, video, images, EMG or electrical activity data, notes, program details, progress data, and communication records.` },
                { number: '9.2', text: `Purpose of Collection. PHYSOFT may use data to provide services, create reports, compare progress, improve programs, schedule sessions, process payments, communicate with Client, maintain records, improve safety, develop business operations, and comply with legal obligations.` },
                { number: '9.3', text: `De-Identified and Aggregated Data. Client authorizes PHYSOFT to de-identify, aggregate, anonymize, summarize, transform, or statistically process data so that it is not reasonably intended to identify Client, and to use that information for benchmarking, research development, quality improvement, scientific comparison, product development, artificial intelligence, and business analytics.` },
                { number: '9.4', text: `No Sale of Identifying Data. PHYSOFT does not sell, rent, or trade Client's personally identifying data to third parties as a standalone data product. PHYSOFT may share information with service providers who process data on PHYSOFT's behalf under confidentiality and data-protection obligations, or in connection with a lawful business transfer, merger, acquisition, restructuring, or as otherwise required or permitted by law.` },
                { number: '9.5', text: `Security. PHYSOFT uses commercially reasonable administrative, technical, and operational safeguards. No system is completely secure, and Client acknowledges that data storage and transmission involve unavoidable security risks.` },
                { number: '9.6', text: `Service Providers. PHYSOFT may use third-party platforms for scheduling, payment processing, storage, analytics, communication, artificial intelligence support, document management, and reporting. Those providers may process information as necessary to provide their services.` },
                { number: '9.7', text: `Legal Requests. PHYSOFT may disclose information when required by law, subpoena, court order, regulator, payment processor, insurance matter, safety issue, or to protect rights, property, clients, staff, or the public.` },
                { number: '9.8', text: `Access and Correction. Client may request correction of inaccurate personal information where reasonable. PHYSOFT may retain records as needed for legal, accounting, operational, safety, dispute, and business purposes.` }
            ]
        },
        {
            id: '10',
            title: 'Artificial Intelligence, Benchmarking and Research Development',
            clauses: [
                { number: '10.1', text: `AI and Analytics Use. PHYSOFT may use software, statistical tools, machine learning, artificial intelligence, spreadsheets, dashboards, and internal models to organize data, identify patterns, compare movement, generate insights, draft reports, and improve services.` },
                { number: '10.2', text: `Benchmarking. Client authorizes PHYSOFT to compare Client metrics against internal databases, public reference ranges, sport-specific groups, age groups, anonymized cohorts, previous sessions, and other relevant categories.` },
                { number: '10.3', text: `Model Improvement. De-identified data may be used to improve PHYSOFT models, scoring systems, protocols, reports, training decisions, and scientific development.` },
                { number: '10.4', text: `No Automated Medical Decision. AI or analytics outputs are tools for fitness and performance support and are not medical diagnosis, medical treatment, or a substitute for professional judgment.` },
                { number: '10.5', text: `Imperfect Outputs. Client understands that AI and analytics can produce errors, approximations, bias, incomplete interpretations, or inconsistent outputs. PHYSOFT may revise or disregard outputs when appropriate.` },
                { number: '10.6', text: `Ownership of Derived Insights. PHYSOFT owns its scoring systems, protocols, algorithms, templates, databases, comparative frameworks, classifications, business methods, and derived internal analytics, except for Client's personal information rights as required by law.` }
            ]
        },
        {
            id: '11',
            title: 'Photos, Videos and Recording Restrictions',
            clauses: [
                { number: '11.1', text: `Operational Recording. PHYSOFT may use photos or video when reasonably necessary for movement analysis, posture review, technique review, performance comparison, education, progress documentation, reporting, or safety review.` },
                { number: '11.2', text: `Separate Marketing Consent. PHYSOFT will not use Client's identifiable photo or video for public marketing without separate permission, unless otherwise permitted by law or the content is not identifiable.` },
                { number: '11.3', text: `Client Recording Restriction. Client may not record PHYSOFT sessions, staff, other clients, screens, reports, protocols, software, training methods, or facility areas without prior written permission from PHYSOFT.` },
                { number: '11.4', text: `No Public Posting. Client may not post, publish, sell, distribute, livestream, or share recordings of PHYSOFT proprietary methods, staff instructions, reports, screens, dashboards, documents, or other confidential materials without written authorization.` },
                { number: '11.5', text: `Removal Requests. PHYSOFT may require Client to remove unauthorized recordings, posts, screenshots, or content that violates these Terms or infringes PHYSOFT rights.` },
                { number: '11.6', text: `Security Footage. Facilities used by PHYSOFT may have security cameras controlled by PHYSOFT or third parties. Such footage may be used for safety, security, dispute, or legal purposes.` }
            ]
        },
        {
            id: '12',
            title: 'Intellectual Property, Copyright and Proprietary Methods',
            clauses: [
                { number: '12.1', text: `PHYSOFT Ownership. All PHYSOFT materials, methods, protocols, software, templates, dashboards, reports, scoring systems, graphics, charts, tables, photographs, videos, exercise systems, educational content, branding, logos, business processes, databases, and analytics are owned by PHYSOFT or its licensors.` },
                { number: '12.2', text: `Copyright Protection. PHYSOFT reports, documents, graphics, videos, photographs, worksheets, charts, written materials, software content, templates, and educational resources are protected by copyright and other intellectual property laws. Client receives only a limited personal-use license.` },
                { number: '12.3', text: `Limited Personal License. PHYSOFT grants Client a limited, non-exclusive, non-transferable, revocable license to use Client-facing reports and materials for Client's personal fitness, performance, wellness, or educational purposes only.` },
                { number: '12.4', text: `Prohibited Uses. Client may not copy, reproduce, modify, translate, publish, distribute, sell, sublicense, rent, commercially exploit, upload, scrape, reverse engineer, train competing AI models on, or create derivative works from PHYSOFT materials without written permission.` },
                { number: '12.5', text: `Proprietary Methods. Client agrees that PHYSOFT protocols, sequencing, scoring, terminology, data structures, analysis frameworks, templates, dashboards, comparative methods, and training systems are proprietary business assets and may include trade secrets or confidential information.` },
                { number: '12.6', text: `No Competitive Use. Client may not use PHYSOFT materials or observations from PHYSOFT services to create, improve, market, sell, or support a competing business, software product, assessment system, report template, training protocol, or database without written authorization.` },
                { number: '12.7', text: `Feedback. If Client provides suggestions, ideas, corrections, feedback, requests, or recommendations, Client grants PHYSOFT a perpetual, worldwide, royalty-free right to use that feedback without compensation, unless prohibited by law.` },
                { number: '12.8', text: `Trademark Rights. PHYSOFT names, logos, slogans, product names, report names, program names, and branding are PHYSOFT property. Client may not use PHYSOFT branding in a way that suggests endorsement, partnership, certification, ownership, or authorization without written permission.` },
                { number: '12.9', text: `Enforcement. PHYSOFT may pursue legal and equitable remedies for unauthorized copying, misuse, disclosure, infringement, misappropriation, or commercial exploitation of its intellectual property, including injunctive relief where available.` }
            ]
        },
        {
            id: '13',
            title: 'Payments, Cancellations, Refunds and Chargebacks',
            clauses: [
                { number: '13.1', text: `Payment Obligation. Client agrees to pay all fees, deposits, package costs, subscriptions, technology fees, late fees, administrative fees, cancellation fees, and other charges disclosed by PHYSOFT before or at the time of purchase.` },
                { number: '13.2', text: `Resource Allocation. Client acknowledges that once Client accepts these Terms, books, pays, or confirms services, PHYSOFT may immediately allocate staff, time, facility access, equipment, software, preparation, reporting resources, scheduling capacity, and operational expenses to that specific booking.` },
                { number: '13.3', text: `Basis for Retained Fees. The Parties acknowledge that PHYSOFT's actual losses arising from a late cancellation, late reschedule, or no-show are difficult to calculate precisely at the time of booking. The amount PHYSOFT is entitled to retain under Section 13.4 represents a reasonable, good-faith pre-estimate of PHYSOFT's actual costs and losses from such cancellation, including without limitation: (a) staff time reserved specifically for Client's session that cannot reasonably be rebooked on short notice; (b) equipment, technology, and facility capacity blocked and allocated for Client's session; (c) preparation, scheduling, and administrative work already performed for that specific session; and (d) the lost opportunity to book another client in that reserved time slot. This amount is intended as liquidated damages reflecting these losses, and not as a penalty.` },
                { number: '13.4', text: `Maximum Refund. Unless otherwise required by applicable law or expressly approved in writing by PHYSOFT, the maximum refund available after acceptance and payment shall be forty percent (40%) of the total amount paid for the affected session or service. The remaining sixty percent (60%) shall be retained by PHYSOFT as the liquidated damages described in Section 13.3.` },
                { number: '13.5', text: `No Refund After Full Performance. Once a service, assessment, session, package component, report, consultation, or digital deliverable has been fully provided, no refund is available unless required by applicable law or expressly approved in writing by PHYSOFT.` },
                { number: '13.6', text: `Packages and Unused Sessions. For packages, bundles, memberships, subscriptions, or prepaid services, unused sessions may expire, be subject to scheduling rules, or be refunded only under the disclosed policy and these Terms.` },
                { number: '13.7', text: `Discretionary Exceptions. PHYSOFT may voluntarily issue a greater refund, credit, reschedule, or exception in an individual case without waiving its rights or creating any obligation to do so in the future.` },
                { number: '13.8', text: `Chargebacks and Payment Disputes. Client agrees to contact PHYSOFT in good faith before initiating a credit card chargeback, bank dispute, payment reversal, or payment processor claim. PHYSOFT may provide these Terms, invoices, acceptance records, emails, attendance records, service records, and transaction records to the bank, card issuer, payment processor, or dispute platform.` },
                { number: '13.9', text: `Failed Payments. If a payment fails, is reversed, disputed, or returned, PHYSOFT may suspend services, withhold deliverables, cancel bookings, require alternate payment, recover collection costs where permitted, or pursue other remedies.` },
                { number: '13.10', text: `Taxes and Processing Fees. Prices may not include taxes, payment processing fees, platform fees, currency conversion costs, or bank fees unless stated. Client is responsible for applicable amounts where permitted by law.` }
            ]
        },
        {
            id: '14',
            title: 'Limitation of Liability and Release',
            clauses: [
                { number: '14.1', text: `Assumption of Risk as Primary Basis. Client's express assumption of risk under Section 5 is a material and independent basis for Client's participation in PHYSOFT services, separate from and in addition to the release described in this Section 14. To the fullest extent permitted by applicable law, Client also releases PHYSOFT, its owners, members, managers, employees, contractors, representatives, affiliates, vendors, landlords, facility partners, successors, and assigns from claims arising from the inherent risks of voluntary fitness, performance, technology-supported assessment, exercise, and related activities.` },
                { number: '14.2', text: `Limitation of Damages. To the fullest extent permitted by law, PHYSOFT will not be liable for indirect, incidental, consequential, special, punitive, exemplary, lost profit, lost opportunity, reputational, emotional distress, or data-loss damages arising from or relating to the services.` },
                { number: '14.3', text: `Cap on Liability. To the fullest extent permitted by law, PHYSOFT's total liability for any claim related to services shall not exceed the amount paid by Client to PHYSOFT for the specific service giving rise to the claim during the three months preceding the event, unless a different limit is required by law.` },
                { number: '14.4', text: `No Waiver of Non-Waivable Liability. These Terms do not waive liability for conduct that cannot legally be waived, including intentional misconduct, fraud, or other non-waivable obligations under applicable law.` },
                { number: '14.5', text: `Client-Caused Injury. Client is responsible for injury, loss, or damage caused by Client's failure to disclose information, misuse of equipment, disregard of instructions, unauthorized activity, unsafe conduct, or participation against advice.` },
                { number: '14.6', text: `Third-Party Locations. If services occur at a third-party facility, home, field, gym, club, school, or event, Client acknowledges that PHYSOFT may not control all premises conditions and that premises-related claims may involve third parties.` },
                { number: '14.7', text: `Primacy of Assumption of Risk if Release Is Limited. Client acknowledges that certain jurisdictions, including Virginia, restrict or void contractual releases of liability for ordinary negligence in some circumstances. If any release provision in this Section 14 is found unenforceable in whole or in part for that or any other reason, the Parties intend that Client's express assumption of risk under Section 5 and this Section 14 remain fully effective and enforceable to the maximum extent permitted by law, that the unenforceable portion be severed, and that this Section 14 otherwise be interpreted and enforced to the fullest extent the law allows.` }
            ]
        },
        {
            id: '15',
            title: 'Indemnification and Conduct Rules',
            clauses: [
                { number: '15.1', text: `Indemnification. To the fullest extent permitted by law, Client agrees to indemnify, defend, and hold harmless PHYSOFT and its representatives from claims, losses, liabilities, damages, costs, and expenses arising from Client's misuse of services, breach of these Terms, inaccurate information, unsafe conduct, violation of law, violation of third-party rights, or unauthorized use of PHYSOFT intellectual property. Where services are provided to a minor, this indemnification obligation is also personally assumed by the minor's parent or legal guardian as set forth in Section 4.6.` },
                { number: '15.2', text: `Respectful Conduct. Client must treat staff, contractors, other clients, facility personnel, and partners respectfully. Harassment, threats, discrimination, intimidation, unsafe conduct, or disruptive behavior may result in immediate termination of services without refund where permitted by law.` },
                { number: '15.3', text: `Facility Rules. Client must follow all facility, equipment, hygiene, parking, clothing, safety, and scheduling rules. PHYSOFT may remove Client from a session or facility if rules are not followed.` },
                { number: '15.4', text: `No Unauthorized Guests. Client may not bring guests, film crews, photographers, competitors, or observers to sessions without prior approval.` },
                { number: '15.5', text: `Safety Overrides. PHYSOFT may stop, modify, or refuse any exercise, test, assessment, or service if PHYSOFT believes it is unsafe, inappropriate, beyond scope, or inconsistent with these Terms.` },
                { number: '15.6', text: `Survival. Indemnification, intellectual property, confidentiality, payment, refund, limitation of liability, release, assumption of risk, dispute resolution, and data provisions survive termination or completion of services.` }
            ]
        },
        {
            id: '16',
            title: 'Dispute Resolution, Virginia Law and Fairfax Venue',
            clauses: [
                { number: '16.1', text: `Good-Faith Resolution. Before filing a formal claim, Client agrees to contact PHYSOFT in writing and attempt to resolve the issue in good faith, unless emergency legal relief is necessary or prohibited by law.` },
                { number: '16.2', text: `Governing Law. These Terms and all services are governed by the laws of the Commonwealth of Virginia, without regard to conflict-of-law rules that would apply another jurisdiction's law.` },
                { number: '16.3', text: `Venue. To the fullest extent permitted by law, any court proceeding shall be brought in a court with proper jurisdiction in the Commonwealth of Virginia, and when legally appropriate, in or near Fairfax County, Virginia.` },
                { number: '16.4', text: `Time Limits. Claims must be brought within the shortest limitation period permitted by applicable law. Nothing in this section shortens a limitation period where doing so is prohibited.` },
                { number: '16.5', text: `Attorneys' Fees and Costs. If PHYSOFT must enforce payment, intellectual property, confidentiality, unauthorized recording, chargeback, or misuse provisions, PHYSOFT may seek recovery of reasonable costs and attorneys' fees where permitted by law or contract.` },
                { number: '16.6', text: `Injunctive Relief. Client agrees that unauthorized copying, disclosure, distribution, reverse engineering, or misuse of PHYSOFT intellectual property may cause irreparable harm and that PHYSOFT may seek injunctive or equitable relief where available.` }
            ]
        },
        {
            id: '17',
            title: 'Updates, Termination, Severability and Entire Agreement',
            clauses: [
                { number: '17.1', text: `Updates to Terms. PHYSOFT may update these Terms from time to time. Updated Terms may apply to future bookings, renewals, account use, software access, or continued services after notice or posting.` },
                { number: '17.2', text: `Termination by Client. Client may stop using services at any time, subject to payment, refund, cancellation, package, and scheduling rules.` },
                { number: '17.3', text: `Termination by PHYSOFT. PHYSOFT may terminate, suspend, modify, or refuse services for safety concerns, nonpayment, breach of Terms, misconduct, legal restrictions, staff availability, facility restrictions, scope concerns, or business reasons.` },
                { number: '17.4', text: `Severability. If any provision is found invalid, illegal, or unenforceable, the remaining provisions remain in full force and effect, and the invalid provision shall be interpreted or modified to achieve its intended purpose as closely as permitted by law.` },
                { number: '17.5', text: `No Waiver. PHYSOFT's failure to enforce any provision is not a waiver of that provision or any other right.` },
                { number: '17.6', text: `Assignment. Client may not assign or transfer rights under these Terms without written permission. PHYSOFT may assign these Terms in connection with a merger, acquisition, reorganization, sale of assets, change in ownership, or business transfer.` },
                { number: '17.7', text: `Entire Agreement. These Terms, together with incorporated invoices, policies, service descriptions, intake forms, and written notices, represent the entire agreement between Client and PHYSOFT regarding the services and supersede prior discussions or understandings on the same subject.` }
            ]
        },
        {
            id: '18',
            title: 'Electronic Acceptance Statement',
            clauses: [
                { number: '18.1', text: `Acceptance Language. By clicking "I Agree," checking an acceptance box, signing electronically, paying, booking, creating an account, attending a session, receiving a service, or otherwise using PHYSOFT services, Client confirms that Client has read, understood, and voluntarily accepts these Terms.` },
                { number: '18.2', text: `Consent to Electronic Records. Client consents to receive, review, and accept these Terms electronically and agrees that electronic records, electronic notices, and electronic acceptance may be used in connection with PHYSOFT services.` },
                { number: '18.3', text: `Opportunity to Ask Questions. Client acknowledges that Client may ask PHYSOFT questions before accepting. If Client proceeds without asking questions, Client confirms that Client is choosing to accept based on the information available.` },
                { number: '18.4', text: `Continued Use. Continued use of PHYSOFT services after updated Terms are provided or posted constitutes acceptance of the updated Terms for future services, where permitted by law.` }
            ]
        },
        {
            id: '19',
            title: 'Reports, Deliverables and Client Use',
            clauses: [
                { number: '19.1', text: `Reports Are Interpretive. PHYSOFT reports, dashboards, charts, scores, and recommendations are interpretive fitness and performance tools. They are based on available data, technology, staff observations, and professional judgment at the time of service.` },
                { number: '19.2', text: `Not a Medical Record Unless Required. PHYSOFT reports are not intended to be medical records, medical diagnoses, prescriptions, or treatment plans unless a licensed healthcare professional separately creates such a record within the lawful scope of practice.` },
                { number: '19.3', text: `Client Personal Use. Client may use reports for personal understanding, training decisions, and communication with Client's own coach, physician, or professional advisor, but Client may not publish, sell, repackage, or commercially use the reports without PHYSOFT written authorization.` },
                { number: '19.4', text: `No Reliance by Third Parties. PHYSOFT reports are prepared for the Client only. Third parties may not rely on them unless PHYSOFT expressly agrees in writing.` },
                { number: '19.5', text: `Revision Rights. PHYSOFT may correct, update, revise, or withdraw a report if data error, software error, interpretation issue, client misstatement, equipment issue, or safety concern is discovered.` },
                { number: '19.6', text: `Delivery Format. Deliverables may be provided as PDF, dashboard, email, printed copy, app view, spreadsheet, video review, or verbal explanation. PHYSOFT may choose the delivery format unless otherwise agreed in writing.` }
            ]
        },
        {
            id: '20',
            title: 'Confidential Business Information',
            clauses: [
                { number: '20.1', text: `Confidential Information. PHYSOFT confidential information includes non-public methods, pricing, protocols, exercise progressions, software screens, dashboards, databases, formulas, client comparison systems, staff training, vendor arrangements, business strategy, and operational processes.` },
                { number: '20.2', text: `Client Duty. Client agrees not to disclose, publish, record, copy, photograph, screenshot, distribute, or use PHYSOFT confidential information for any purpose outside Client's personal use of services.` },
                { number: '20.3', text: `Competitive Harm. Client understands that PHYSOFT invests substantial time and resources in its methods and that unauthorized disclosure can cause serious competitive harm.` },
                { number: '20.4', text: `Permitted Disclosure. Client may share Client's own report privately with Client's physician, coach, parent, guardian, attorney, accountant, insurer, or trusted advisor for Client's personal purposes, provided the recipient does not commercially exploit PHYSOFT materials.` },
                { number: '20.5', text: `Continuing Obligation. Confidentiality obligations continue after services end.` },
                { number: '20.6', text: `Equitable Relief. PHYSOFT may seek injunctions, takedowns, account restrictions, damages, and other remedies for unauthorized disclosure or misuse.` }
            ]
        },
        {
            id: '21',
            title: 'Software, Accounts and Digital Access',
            clauses: [
                { number: '21.1', text: `Account Access. If PHYSOFT provides software, portal, dashboard, QR-code form, app access, or digital files, Client receives only a limited, revocable, personal, non-transferable right to access that system for authorized purposes.` },
                { number: '21.2', text: `Account Security. Client is responsible for protecting login credentials and for activity occurring through Client's account, device, email, or acceptance link.` },
                { number: '21.3', text: `Prohibited Digital Conduct. Client may not bypass security, scrape data, overload systems, attempt unauthorized access, share credentials, interfere with software, copy code, extract databases, or use automated tools without permission.` },
                { number: '21.4', text: `Availability. Digital access may be unavailable due to maintenance, outages, updates, vendor issues, security events, internet problems, or business decisions. PHYSOFT does not guarantee uninterrupted access.` },
                { number: '21.5', text: `Beta Features. PHYSOFT may test beta tools, experimental dashboards, early-stage algorithms, or draft reports. Beta outputs may be incomplete, inaccurate, or subject to change.` },
                { number: '21.6', text: `Termination of Access. PHYSOFT may suspend or terminate digital access for nonpayment, misuse, security risk, policy violation, termination of services, or business reasons.` }
            ]
        },
        {
            id: '22',
            title: 'Communications, Notices and Records',
            clauses: [
                { number: '22.1', text: `Electronic Communications. Client consents to communicate electronically through email, text message, phone, portals, scheduling platforms, payment platforms, forms, or other systems used by PHYSOFT.` },
                { number: '22.2', text: `Operational Messages. PHYSOFT may send appointment reminders, invoices, receipts, safety instructions, policy updates, service notices, report notices, and administrative communications.` },
                { number: '22.3', text: `Marketing Messages. PHYSOFT may send marketing communications where permitted by law. Client may opt out of marketing messages, but operational communications may continue when necessary.` },
                { number: '22.4', text: `Recordkeeping. PHYSOFT may keep records of acceptance, communications, attendance, services, payments, reports, data, complaints, disputes, and safety incidents for legal, operational, accounting, insurance, and business purposes.` },
                { number: '22.5', text: `Notice Effectiveness. Notices may be effective when sent to the email, phone, address, portal, or account information Client provided, unless a different method is required by law.` },
                { number: '22.6', text: `Evidence of Acceptance. PHYSOFT may rely on timestamps, checkbox records, payment records, IP logs, account records, email confirmations, device records, signatures, or attendance as evidence of acceptance and use.` }
            ]
        },
        {
            id: '23',
            title: 'Scheduling, Attendance and Service Delivery',
            clauses: [
                { number: '23.1', text: `Appointment Times. Client agrees to arrive on time and prepared. Late arrival may reduce session time without reducing the fee.` },
                { number: '23.2', text: `No-Show. A no-show may be treated as completed or cancelled under PHYSOFT policy, and fees may be retained where permitted by law.` },
                { number: '23.3', text: `Rescheduling. PHYSOFT may reschedule due to staff availability, equipment issues, facility closure, weather, emergency, illness, safety, or other operational reasons.` },
                { number: '23.4', text: `Preparation. Client should wear appropriate clothing, follow hydration and nutrition guidance where given, avoid unsafe substances, and bring required items.` },
                { number: '23.5', text: `Remote Services. If services are provided remotely, Client is responsible for a safe environment, stable internet, appropriate space, proper equipment setup, and stopping if the activity feels unsafe.` },
                { number: '23.6', text: `Home or Off-Site Services. For services at a home, gym, field, club, school, or third-party location, Client is responsible for obtaining required permission and maintaining a safe space unless otherwise agreed in writing.` }
            ]
        },
        {
            id: '24',
            title: 'Health, Safety and Emergency Protocols',
            clauses: [
                { number: '24.1', text: `Screening Is Limited. PHYSOFT screening can reduce risk but cannot detect every medical condition, injury, contraindication, or danger.` },
                { number: '24.2', text: `Stop Conditions. PHYSOFT may stop a session if Client appears ill, unsafe, impaired, aggressive, noncompliant, dehydrated, overexerted, injured, or at risk.` },
                { number: '24.3', text: `Emergency Response. In an emergency, PHYSOFT may contact emergency services, emergency contacts, facility staff, or healthcare providers, and Client is responsible for related costs unless prohibited by law.` },
                { number: '24.4', text: `No Medication Management. PHYSOFT does not manage medications, prescribe medication, or advise Client to stop medication. Client must follow healthcare provider instructions.` },
                { number: '24.5', text: `Communicable Illness. PHYSOFT may refuse or reschedule services if Client has symptoms, infection, fever, contagious illness, open wounds, or hygiene conditions that create risk.` },
                { number: '24.6', text: `Safety Documentation. PHYSOFT may document incidents, symptoms, refusals, modifications, or safety concerns for operational and legal purposes.` }
            ]
        },
        {
            id: '25',
            title: 'Professional Scope, Contractors and Partners',
            clauses: [
                { number: '25.1', text: `Contractors. PHYSOFT may use employees, contractors, consultants, coaches, technicians, analysts, assistants, software providers, and other personnel to provide or support services.` },
                { number: '25.2', text: `Scope Compliance. Each person is expected to act within the role, training, authorization, and lawful scope applicable to that person.` },
                { number: '25.3', text: `Partner Facilities. PHYSOFT may provide services through partner gyms, clubs, schools, teams, fields, homes, studios, or other locations. Facility rules may also apply.` },
                { number: '25.4', text: `Third-Party Professionals. Client may choose to share information with physicians, trainers, therapists, coaches, or other professionals. PHYSOFT is not responsible for third-party advice or actions.` },
                { number: '25.5', text: `No Employment Relationship. Client's use of services does not create an employment, agency, partnership, franchise, or joint venture relationship with PHYSOFT.` },
                { number: '25.6', text: `Independent Judgment. PHYSOFT may accept or reject third-party recommendations when designing fitness or performance services.` }
            ]
        },
        {
            id: '26',
            title: 'Consumer Fairness and Legal Compliance',
            clauses: [
                { number: '26.1', text: `Lawful Interpretation. These Terms are intended to be interpreted in a lawful, fair, and commercially reasonable manner consistent with applicable federal, Virginia, and local requirements.` },
                { number: '26.2', text: `No Unlawful Practice. Nothing in these Terms authorizes PHYSOFT to engage in unlawful practice, false advertising, deceptive conduct, or services outside permitted scope.` },
                { number: '26.3', text: `Client Rights. Client retains any rights that cannot be waived by contract. If a legal requirement gives Client a mandatory right, that mandatory right controls.` },
                { number: '26.4', text: `Policy Transparency. PHYSOFT aims to disclose material payment, cancellation, refund, and service policies before purchase or use.` },
                { number: '26.5', text: `Reasonable Modifications. PHYSOFT may make reasonable modifications to services for safety, disability, facility, equipment, or practical limitations when feasible.` },
                { number: '26.6', text: `Cooperation. Client agrees to cooperate with lawful requests needed to comply with tax, accounting, insurance, safety, payment, legal, or regulatory obligations.` }
            ]
        },
        {
            id: '27',
            title: 'Force Majeure and Operational Events',
            clauses: [
                { number: '27.1', text: `Force Majeure. PHYSOFT is not responsible for delay or failure caused by events beyond reasonable control, including severe weather, power outage, internet outage, equipment failure, illness, epidemic, facility closure, government action, labor disruption, supply issue, security event, or emergency.` },
                { number: '27.2', text: `Substitute Performance. When practical, PHYSOFT may offer rescheduling, remote services, substitute equipment, revised deliverables, credit, or other reasonable alternatives.` },
                { number: '27.3', text: `No Liability for Delays. Operational delays do not create liability for consequential damages, lost opportunity, travel costs, competition outcomes, or third-party expenses unless required by law.` },
                { number: '27.4', text: `Equipment Maintenance. Equipment may need calibration, repair, replacement, software updates, or removal from service.` },
                { number: '27.5', text: `Data Interruptions. Data collection may be limited by technical problems, battery failure, device placement, wireless interference, software updates, or environmental conditions.` },
                { number: '27.6', text: `Business Continuity. PHYSOFT may prioritize safety, legal compliance, and operational continuity over a specific protocol or schedule.` }
            ]
        },
        {
            id: '28',
            title: 'Language, Interpretation and Version Control',
            clauses: [
                { number: '28.1', text: `English Controls. Unless PHYSOFT provides a separate signed or approved translation stating otherwise, the English version of these Terms controls.` },
                { number: '28.2', text: `Plain-English Summaries. Summaries, headings, examples, and explanations are for convenience only and do not limit the legal effect of the full Terms.` },
                { number: '28.3', text: `Version Control. PHYSOFT may identify each Terms version by effective date, file name, acceptance timestamp, platform version, or document ID.` },
                { number: '28.4', text: `Construction. These Terms will not be interpreted against PHYSOFT merely because PHYSOFT drafted them.` },
                { number: '28.5', text: `Headings. Headings are included for organization and convenience and do not change the meaning of the clauses.` },
                { number: '28.6', text: `Counterparts and Copies. Electronic copies, PDF copies, screenshots of acceptance, and platform records may be used as evidence of the Terms and acceptance.` }
            ]
        },
        {
            id: '29',
            title: 'Privacy Limitations for Fitness Operations',
            clauses: [
                { number: '29.1', text: `Fitness Context. PHYSOFT handles information in a fitness, performance, and business context unless a specific service is legally classified otherwise.` },
                { number: '29.2', text: `Sensitive Information. Client understands that intake information may include sensitive health, performance, injury, biometric, image, or movement information. Client should not provide information that Client does not want PHYSOFT to process for service purposes.` },
                { number: '29.3', text: `Minimum Necessary for Service. PHYSOFT may request information reasonably related to safety, service quality, personalization, billing, scheduling, communication, and legal compliance.` },
                { number: '29.4', text: `Retention. PHYSOFT may retain records for as long as reasonably necessary for business, legal, insurance, accounting, tax, dispute, research, analytics, quality improvement, or operational purposes.` },
                { number: '29.5', text: `Deletion Requests. PHYSOFT may consider deletion requests, but may retain information where needed for legal, accounting, insurance, dispute, security, backup, business, or de-identified analytics purposes.` },
                { number: '29.6', text: `Cross-Border Tools. Some software or service providers may store or process data outside Virginia or outside the United States. PHYSOFT may use such providers when reasonably necessary for operations.` }
            ]
        },
        {
            id: '30',
            title: 'Final Integrated Protection Clause',
            clauses: [
                { number: '30.1', text: `Integrated Protection. Client agrees that these Terms are intended to protect PHYSOFT's lawful business operations, safety practices, payment rights, data rights, intellectual property, proprietary systems, staff, contractors, and service delivery.` },
                { number: '30.2', text: `Balanced Enforcement. These Terms should be enforced to the maximum extent permitted by law while preserving any mandatory rights Client has under applicable law.` },
                { number: '30.3', text: `Client Decision. Client is free not to accept these Terms and not to use PHYSOFT services. By accepting, Client confirms a voluntary decision to proceed.` },
                { number: '30.4', text: `Binding Effect. These Terms bind Client and, where permitted, Client's heirs, representatives, successors, assigns, parents, guardians, estate, and anyone claiming through Client.` },
                { number: '30.5', text: `Continuing Effect. Sections relating to payment, refund, chargebacks, intellectual property, data, confidentiality, limitation of liability, release, assumption of risk, indemnification, dispute resolution, and governing law continue after services end.` },
                { number: '30.6', text: `Acceptance Complete. No additional signature line, initials, or handwritten information is required for these Terms to be accepted electronically when incorporated into PHYSOFT's booking, payment, intake, account, or service workflow.` }
            ]
        }
    ] satisfies ConsentSection[],

    appendices: [
        {
            id: 'A',
            title: 'Appendix A - Practical Client Risk Warnings',
            clauses: [
                { number: 'A.1', text: `Exercise Warning. Exercise can involve risk of injury. Client should not participate if Client has been advised by a healthcare provider not to exercise or if Client has symptoms that make exercise unsafe.` },
                { number: 'A.2', text: `Electrical Stimulation Warning. Electrical stimulation should not be used over certain areas or with certain medical conditions. Client must disclose implanted devices, heart conditions, pregnancy, seizure history, cancer, clotting issues, wounds, infection, or impaired sensation.` },
                { number: 'A.3', text: `Sensor and Adhesive Warning. Wearables, electrodes, straps, adhesives, and sensors may cause skin irritation, redness, pressure marks, allergic reaction, discomfort, or inaccurate readings.` },
                { number: 'A.4', text: `Performance Testing Warning. Testing may require effort, repetition, balance, speed, or resistance. Client must stop if symptoms arise.` },
                { number: 'A.5', text: `Data Warning. Performance data can help guide training but is not perfect. It may be affected by equipment, placement, calibration, fatigue, hydration, pain, clothing, environment, and user movement.` },
                { number: 'A.6', text: `Needle Warning. If needle-based techniques are offered by an authorized professional, they involve specific risks and may require separate consent. Client may refuse them.` }
            ]
        },
        {
            id: 'B',
            title: 'Appendix B - Copyright and Confidentiality Notice',
            clauses: [
                { number: 'B.1', text: `PHYSOFT materials are protected by copyright, trademark, trade secret, contract, and other laws. All rights are reserved.` },
                { number: 'B.2', text: `Client-facing reports are for Client's personal use only. They may not be used to build a competing product or service, train another provider, create a competing report template, or develop a commercial dataset.` },
                { number: 'B.3', text: `Screenshots, screen recordings, photographs of reports, videos of staff instructions, copies of templates, or downloads of software content are not permitted unless PHYSOFT gives written authorization.` },
                { number: 'B.4', text: `PHYSOFT may revoke access to materials if Client violates these Terms, misuses information, disputes payment without good-faith communication, or infringes intellectual property rights.` },
                { number: 'B.5', text: `Nothing in these Terms transfers ownership of PHYSOFT intellectual property to Client.` }
            ]
        },
        {
            id: 'C',
            title: 'Appendix C - Plain-English Summary',
            clauses: [
                { number: 'C.1', text: `PHYSOFT provides fitness, performance, movement analysis, and technology-supported training services. It is not promising medical diagnosis or guaranteed results.` },
                { number: 'C.2', text: `By using the services, Client accepts the normal risks of exercise, testing, sensors, electrical stimulation where used, and other performance services.` },
                { number: 'C.3', text: `Client must tell the truth about health history and stop immediately if something feels wrong.` },
                { number: 'C.4', text: `PHYSOFT may collect data to provide services and may use de-identified data to compare, improve, research, and build better systems.` },
                { number: 'C.5', text: `PHYSOFT owns its methods, software, reports, templates, charts, protocols, and content. Client may not copy, sell, record, or use them to create a competing business.` },
                { number: 'C.6', text: `If Client cancels after accepting and paying, the maximum refund is 40% because PHYSOFT has already reserved staff time, equipment, and facility capacity for that session; the remaining 60% covers those real costs. This does not apply if the law requires otherwise or PHYSOFT approves a larger refund. If the service is already fully completed, there is no refund unless required by law.` },
                { number: 'C.7', text: `If a minor receives services, the parent or guardian personally takes on the assumption of risk, release, and indemnification obligations on the minor's behalf.` },
                { number: 'C.8', text: `Virginia law applies to the maximum extent permitted. Because Virginia limits contractual releases of liability for negligence, this Agreement relies primarily on Client's express assumption of risk, with the release applying to the extent additionally allowed by law.` }
            ]
        }
    ] satisfies ConsentSection[],

    documentControlNote: `Document Control Note. Recommended implementation: present this Agreement in an electronic acceptance flow with a required checkbox stating: "I have read and agree to the PHYSOFT Client Terms of Service, Informed Consent, Privacy Policy, Intellectual Property and Liability Protection Agreement." Store timestamp, IP address if available, version number, invoice number, client account, and PDF copy of the accepted Terms.`
}
