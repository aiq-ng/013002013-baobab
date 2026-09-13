import { Program } from '../models/program';

/**
 * The six active programs shown in the "Active Programs & Theaters" grid
 * (Programs listing and About) and rendered individually at `program/:slug`.
 */
export const PROGRAMS: Program[] = [
  {
    slug: 'liptako-gourma-peace-corridor',
    theater: 'Sahel Central',
    badgeText: 'SAHEL CENTRAL',
    imageUrl: '/images/about/program-liptako-gourma.jpg',
    imageAlt: 'A ceremonial border crossing arch flying Mali and Burkina Faso flags',
    title: 'Liptako-Gourma Peace Corridor',
    description:
      'Establishment of bi-annual customary transit protocols across Mali, Niger, and Burkina Faso, reducing armed…',
    referenceCode: 'REF: BO-LGP-2024-T1',
    clearanceLevel: 'DIPLOMATIC CLEARANCE L1',
    statusTag: 'ACTIVE TRANSIT PROTOCOL',
    subtitle:
      'Bi-annual customary transhumance protocols across the tri-border zone, restoring safe seasonal transit for pastoralist convoys.',
    kpis: [
      { value: '3', label: 'States Bound', unit: 'Systems' },
      { value: '14,280', unit: 'KM', label: 'Secured Transit Corridors' },
      { value: '0', label: 'Armed Clashes', unit: 'Clashes' },
      { value: '184', label: 'Customary Accords', unit: 'Pacts' },
    ],
    doctrineEyebrow: 'STRATEGIC OPERATIONAL DOCTRINE',
    doctrineHeading: 'Codified Transhumance Corridors',
    doctrineParagraphs: [
      'The Liptako-Gourma tri-border zone has historically absorbed the sharpest friction between statutory border enforcement and centuries-old pastoral migration routes, with seasonal convoys routinely caught between armed groups and militarized checkpoints.',
      'The Baobab Group anchored a bi-annual transit protocol jointly ratified by traditional village elders and regional prefectural authorities, converting contested crossing points into monitored, GPS-mapped corridors with shared custodianship.',
    ],
    doctrineImageUrl: '/images/about/program-liptako-gourma.jpg',
    doctrineImageCaption:
      'SECTOR LIPTAKO · TRI-BORDER CROSSING · Joint Corridor Verification Mission',
    doctrineStats: [
      { value: '14,280', unit: 'km', label: 'Secured Corridors' },
      { value: '184', label: 'Village Pacts' },
      { value: '-64%', label: 'Civilian De-escalation' },
    ],
    pillarsEyebrow: 'GOVERNANCE ARCHITECTURE',
    pillarsHeading: 'Codified Operational Pillars',
    pillarsDescription:
      'Tri-partite regulatory foundations binding customary authorities, pastoral syndicates, and sovereign departmental authorities into an immutable transit charter.',
    pillars: [
      {
        icon: '🕒',
        eyebrow: 'PILLAR I',
        title: 'Bi-Annual Transit Windows',
        description:
          'Fixed seasonal corridor-opening dates negotiated jointly by village elders and prefectural liaison officers, eliminating ad hoc crossing disputes.',
        footnote: 'Synchronized with 12 border posts',
      },
      {
        icon: '🤝',
        eyebrow: 'PILLAR II',
        title: 'Elder Corridor Conciliation',
        description:
          'Hereditary customary mediators empowered with expedited Track 1.5 arbitration authority over convoy disputes.',
        footnote: 'Binding customary jurisprudence',
      },
      {
        icon: '🛡️',
        eyebrow: 'PILLAR III',
        title: 'Joint Corridor Monitoring',
        description:
          'Shared civilian vetting checkpoints co-staffed by traditional guards and departmental gendarmerie liaisons.',
        footnote: 'GPS-verified waypoints',
      },
    ],
    timelineEyebrow: 'ACCORD TIMELINE',
    timelineHeading: 'Verified Accord Milestones & Field Chronicle',
    timelineDescription:
      'Chronological documentation of statutory ratifications, traditional plenaries, and regional treaty milestones executed by The Baobab Group.',
    milestones: [
      {
        date: 'October 2024',
        kicker: 'Diplomatic Decree',
        title: 'Tri-Border Transit Charter Ratified',
        description:
          'Formal codification of bi-annual corridor-opening dates across Mali, Niger, and Burkina Faso, with joint custodianship of 12 crossing points.',
        tags: ['12 Border Posts', 'Tri-State Ratification'],
      },
      {
        date: 'May 2024',
        kicker: 'Bilateral Treaty',
        title: 'Convoy Safe-Passage Protocol Signed',
        description:
          'Joint pastoral-military escort framework deployed along the primary transhumance axis ahead of the dry-season migration.',
        tags: ['Zero Clashes Reported'],
      },
      {
        date: 'January 2024',
        kicker: 'Inaugural Plenary',
        title: 'Foundational Corridor Assembly in Gao',
        description:
          'Convened elders, prefectural administrators, and pastoral syndicate leaders to establish the emergency de-escalation charter for the corridor.',
        tags: ['40 Delegates', 'Charter Founded'],
      },
    ],
    dispatchHeading: 'Request Confidential Corridor Addenda & Transit Telemetry',
    dispatchSubtext:
      'Direct access to GPS waypoint coordinates, seasonal convoy schedules, and signed bilateral corridor codices is restricted to accredited diplomatic delegations and international stability partners.',
  },
  {
    slug: 'lake-chad-customary-demobilization',
    theater: 'Lake Chad Basin',
    badgeText: 'LAKE CHAD BASIN',
    imageUrl: '/images/about/program-lake-chad.jpg',
    imageAlt: 'A gathering beneath a large tree near Lake Chad',
    title: 'Lake Chad Customary Demobilization',
    description:
      'Traditional emirate truth-telling circles and reintegration screenings enabling 3,400 former auxiliary fighters to…',
    referenceCode: 'REF: BO-LCB-2024-D1',
    clearanceLevel: 'DIPLOMATIC CLEARANCE L2',
    statusTag: 'ACTIVE REINTEGRATION ACCORD',
    subtitle:
      'Traditional emirate truth-telling circles and reintegration screenings restoring civilian standing to former auxiliary fighters.',
    kpis: [
      { value: '4', label: 'Emirates Bound', unit: 'Systems' },
      { value: '3,400', label: 'Fighters Reintegrated' },
      { value: '0', label: 'Recidivism Cases', unit: 'Clashes' },
      { value: '98%', label: 'Community Acceptance' },
    ],
    doctrineEyebrow: 'STRATEGIC OPERATIONAL DOCTRINE',
    doctrineHeading: 'Codified Truth-Telling & Reintegration',
    doctrineParagraphs: [
      'Decades of insurgent activity around the Lake Chad basin left thousands of former auxiliary fighters with no legitimate path back into civilian life, and state-run demobilization programs lacked standing with the communities that would have to receive them.',
      'The Baobab Group revived customary emirate truth-telling circles as the legitimizing authority for reintegration, pairing traditional restitution rituals with formal civic re-entry screening administered jointly with local ministerial observers.',
    ],
    doctrineImageUrl: '/images/about/program-lake-chad.jpg',
    doctrineImageCaption:
      'SECTOR LAKE CHAD · EMIRATE COUNCIL GROUNDS · Joint Reintegration Mission',
    doctrineStats: [
      { value: '3,400', label: 'Fighters Screened' },
      { value: '4', label: 'Emirate Councils' },
      { value: '98%', label: 'Community Acceptance' },
    ],
    pillarsEyebrow: 'GOVERNANCE ARCHITECTURE',
    pillarsHeading: 'Codified Operational Pillars',
    pillarsDescription:
      'Tri-partite regulatory foundations binding emirate councils, civilian vetting panels, and sovereign security services into a single reintegration charter.',
    pillars: [
      {
        icon: '🗣️',
        eyebrow: 'PILLAR I',
        title: 'Emirate Truth Circles',
        description:
          'Traditional restitution hearings presided over by emirate councils, establishing customary standing before any civic re-entry step begins.',
        footnote: 'Presided by 4 emirate councils',
      },
      {
        icon: '🛡️',
        eyebrow: 'PILLAR II',
        title: 'Civilian Vetting Panels',
        description:
          'Grassroots screening boards combining community elders and demobilization registries to confirm safe re-entry.',
        footnote: 'Community-based civic re-entry',
      },
      {
        icon: '📋',
        eyebrow: 'PILLAR III',
        title: 'Restorative Registry',
        description:
          'Shared demobilization ledger tracking reintegration status, jointly maintained by emirate scribes and departmental observers.',
        footnote: 'Ratified restitution ledger',
      },
    ],
    timelineEyebrow: 'ACCORD TIMELINE',
    timelineHeading: 'Verified Accord Milestones & Field Chronicle',
    timelineDescription:
      'Chronological documentation of statutory ratifications, traditional plenaries, and regional treaty milestones executed by The Baobab Group.',
    milestones: [
      {
        date: 'September 2024',
        kicker: 'Diplomatic Decree',
        title: 'Basin-Wide Reintegration Charter Ratified',
        description:
          'Four emirate councils jointly codified a shared truth-telling and civic re-entry standard for former auxiliary fighters.',
        tags: ['4 Emirate Councils', 'Charter Ratified'],
      },
      {
        date: 'April 2024',
        kicker: 'Bilateral Treaty',
        title: 'Civilian Vetting Panel Protocol Signed',
        description:
          'Grassroots vetting boards deployed across resettlement zones ahead of the first large-scale reintegration cohort.',
        tags: ['Zero Recidivism Reported'],
      },
      {
        date: 'February 2024',
        kicker: 'Inaugural Plenary',
        title: 'Foundational Truth Circle Convened in Diffa',
        description:
          'Emirate elders, ministerial observers, and civil society leaders established the reintegration screening charter.',
        tags: ['35 Delegates', 'Charter Founded'],
      },
    ],
    dispatchHeading: 'Request Confidential Reintegration Addenda & Screening Data',
    dispatchSubtext:
      'Direct access to demobilization registries, screening protocols, and signed emirate restitution codices is restricted to accredited diplomatic delegations and international stability partners.',
  },
  {
    slug: 'gulf-of-guinea-northern-flank',
    theater: 'Gulf of Guinea',
    badgeText: 'LITTORAL BUFFER',
    imageUrl: '/images/about/program-gulf-of-guinea.jpg',
    imageAlt: 'An aerial view of the Gulf of Guinea coastline',
    title: 'Gulf of Guinea Northern Flank',
    description:
      'Pre-emptive dialogue alliances across northern Ghana, Togo, Benin, and Côte d’Ivoire to build sovereign buffers th…',
    referenceCode: 'REF: BO-GOG-2024-N1',
    clearanceLevel: 'DIPLOMATIC CLEARANCE L1',
    statusTag: 'ACTIVE BUFFER ALLIANCE',
    subtitle:
      'Pre-emptive dialogue alliances across the northern littoral frontier to build sovereign buffers ahead of southward spillover.',
    kpis: [
      { value: '4', label: 'States Bound', unit: 'Systems' },
      { value: '9', label: 'Sovereign Mandates', unit: 'States' },
      { value: '0', label: 'Spillover Incidents', unit: 'Clashes' },
      { value: '61', label: 'Local Alliances' },
    ],
    doctrineEyebrow: 'STRATEGIC OPERATIONAL DOCTRINE',
    doctrineHeading: 'Codified Pre-Emptive Buffer Diplomacy',
    doctrineParagraphs: [
      'As Sahelian instability pushed southward, the littoral states of the Gulf of Guinea faced a widening jurisdictional vacuum along their northern frontiers, with local chieftaincy and municipal authorities lacking any formal early-warning channel.',
      'The Baobab Group convened pre-emptive dialogue alliances linking northern district chiefs, municipal governors, and national security liaisons, establishing a standing buffer framework before armed incursion could take hold.',
    ],
    doctrineImageUrl: '/images/about/program-gulf-of-guinea.jpg',
    doctrineImageCaption:
      'SECTOR NORTHERN LITTORAL · FRONTIER DISTRICTS · Joint Buffer Verification Mission',
    doctrineStats: [
      { value: '9', label: 'Sovereign Mandates' },
      { value: '61', label: 'Local Alliances' },
      { value: '100%', label: 'Non-Kinetic Accord' },
    ],
    pillarsEyebrow: 'GOVERNANCE ARCHITECTURE',
    pillarsHeading: 'Codified Operational Pillars',
    pillarsDescription:
      'Tri-partite regulatory foundations binding district chieftaincies, municipal governors, and sovereign security services into a standing early-warning buffer.',
    pillars: [
      {
        icon: '📡',
        eyebrow: 'PILLAR I',
        title: 'Early-Warning Relay',
        description:
          'Standing communication channel between district chiefs and national security liaisons, flagging cross-border movement before escalation.',
        footnote: 'Synchronized with 61 local radios',
      },
      {
        icon: '🤝',
        eyebrow: 'PILLAR II',
        title: 'Frontier Chieftaincy Council',
        description:
          'Joint council of northern district chiefs empowered to mediate cross-border grievances ahead of state intervention.',
        footnote: 'Binding customary jurisprudence',
      },
      {
        icon: '🛡️',
        eyebrow: 'PILLAR III',
        title: 'Municipal Buffer Charter',
        description:
          'Formal resourcing agreement between municipal governors to jointly fund frontier civic infrastructure and patrols.',
        footnote: 'Co-funded by 4 municipalities',
      },
    ],
    timelineEyebrow: 'ACCORD TIMELINE',
    timelineHeading: 'Verified Accord Milestones & Field Chronicle',
    timelineDescription:
      'Chronological documentation of statutory ratifications, traditional plenaries, and regional treaty milestones executed by The Baobab Group.',
    milestones: [
      {
        date: 'November 2024',
        kicker: 'Diplomatic Decree',
        title: 'Northern Flank Buffer Charter Ratified',
        description:
          'Ghana, Togo, Benin, and Côte d’Ivoire jointly codified the standing early-warning and buffer-resourcing framework.',
        tags: ['4-State Ratification', 'Charter Ratified'],
      },
      {
        date: 'June 2024',
        kicker: 'Bilateral Treaty',
        title: 'Frontier Chieftaincy Mediation Protocol Signed',
        description:
          'Joint chieftaincy council granted expedited mediation authority over cross-border grazing and land disputes.',
        tags: ['Zero Spillover Reported'],
      },
      {
        date: 'March 2024',
        kicker: 'Inaugural Plenary',
        title: 'Foundational Buffer Assembly in Tamale',
        description:
          'District chiefs, municipal governors, and security liaisons convened to establish the pre-emptive buffer charter.',
        tags: ['52 Delegates', 'Charter Founded'],
      },
    ],
    dispatchHeading: 'Request Confidential Buffer Addenda & Early-Warning Telemetry',
    dispatchSubtext:
      'Direct access to early-warning relay logs, frontier patrol schedules, and signed municipal buffer codices is restricted to accredited diplomatic delegations and international stability partners.',
  },
  {
    slug: 'gourma-pastoral-wells-demarcation',
    theater: 'Sahel Central',
    badgeText: 'SAHEL CENTRAL',
    imageUrl: '/images/about/program-gourma-wells.jpg',
    imageAlt: 'Pastoral wells at dusk in the Gourma region',
    title: 'Gourma Pastoral Wells & Riparian Demarcation',
    description:
      'Cooperative water point agreements negotiated among Fulani pastoralists and Dogon farming collectives…',
    referenceCode: 'REF: BO-GOU-2024-H2O',
    clearanceLevel: 'DIPLOMATIC CLEARANCE L1',
    statusTag: 'ACTIVE HYDRAULIC ACCORD',
    subtitle:
      'Equitable dry-season water point governance, ancestral aquifer pacts, and GPS-demarcated livestock corridors across central Mali and the Niger bend to preclude agro-pastoral skirmishes.',
    kpis: [
      {
        value: '3',
        label: 'Niger River Bend, Béli Basin, Gourma Ephemeral Ponds',
        unit: 'Systems',
      },
      {
        value: '46',
        label: 'Fulani Pastoralists & Dogon Agrarian Guild Accords',
        unit: 'Boreholes',
      },
      { value: '0', label: 'Across 34 monitored strategic deep boreholes', unit: 'Clashes' },
      { value: '142,000', label: 'Head vaccinated, watered & registered bi-annually' },
    ],
    doctrineEyebrow: 'STRATEGIC OPERATIONAL DOCTRINE',
    doctrineHeading: 'Codified Water Sharing and Seasonal Grazing Harmony',
    doctrineParagraphs: [
      'In the Gourma plains spanning central Mali and the northern arc of the Niger River bend, severe climate shocks, desertification, and localized groundwater depletion historically turned strategic boreholes into severe flashpoints. Mobile Fulani pastoralists seeking survival pastures regularly came into frictional contact with sedentary Dogon and Songhai enclaves protecting essential irrigation basins.',
      'The Baobab Group established an institutional mediation framework anchoring traditional jurisprudence into bilateral municipal law. By reviving the customary authority of the Amirou Ndiyam (Customary Water Masters) and implementing rigorous time-partitioned hydraulic rotational schedules, competitive armed confrontations have been substituted with enforceable community stewardship.',
    ],
    doctrineImageUrl: '/images/about/program-gourma-wells.jpg',
    doctrineImageCaption:
      'SECTOR GOURMA · HOMBORI-DOUENTZA WATER BASIN · Archival Photo Dossier #SVR-2024-GOU · Joint Basin Verification Mission',
    doctrineStats: [
      { value: '420', unit: 'km', label: 'Surveyed Corridors' },
      { value: '34', label: 'Deep Wells Secured' },
      { value: '100%', label: 'Non-Kinetic Accord' },
    ],
    pillarsEyebrow: 'GOVERNANCE ARCHITECTURE',
    pillarsHeading: 'Codified Operational Pillars',
    pillarsDescription:
      'Tri-partite regulatory foundations binding customary customary authorities, pastoral syndicates, and sovereign departmental authorities into an immutable resource charter.',
    pillars: [
      {
        icon: '🕒',
        eyebrow: 'PILLAR I',
        title: 'Hydraulic Rotational Clocks',
        description:
          'Time-partitioned watering windows rigorously allocating dawn to 11:00 for agrarian irrigation canal fill, 11:30 to 17:00 for transhumance livestock access, and evening recharge buffer periods—strictly eliminating cross-community overlap.',
        footnote: 'Synchronized with 18 local radios',
      },
      {
        icon: '🤝',
        eyebrow: 'PILLAR II',
        title: 'Amirou Ndiyam Conciliation',
        description:
          'Hereditary customary water masters empowered with expedited Track 1.5 arbitration authority. Field tribunals are constitutionally mandated to arbitrate agricultural perimeter damage within 6 hours, precluding state judicial delays.',
        footnote: 'Binding customary jurisprudence',
      },
      {
        icon: '🏗️',
        eyebrow: 'PILLAR III',
        title: 'Dual-Use Aquifer Recharge',
        description:
          'Joint pastoral-agrarian committees co-funded by local communes and transhumance transit tariffs to maintain high-yield solar pumping infrastructure, desilt seasonal catchment ponds, and preserve riparian acacia buffers.',
        footnote: 'Solar capacity: 184 kW installed',
      },
    ],
    timelineEyebrow: 'HISTORICAL RECORD',
    timelineHeading: 'Verified Accord Milestones & Field Chronicle',
    timelineDescription:
      'Chronological documentation of statutory ratifications, traditional plenaries, and regional treaty milestones executed by The Baobab Group.',
    milestones: [
      {
        date: 'November 2024',
        kicker: 'Diplomatic Decree',
        title: 'Hombori Basin Water Allocation Framework Ratified',
        description:
          'Formal diplomatic codification establishing demarcation around 18 primary high-flow boreholes. Created mandatory 50-meter livestock buffer zones to protect village vegetable gardens while ensuring cattle trough access lanes are open 24/7.',
        tags: ['Field Protocol Enforced'],
      },
      {
        date: 'June 2024',
        kicker: 'Bilateral Treaty',
        title: 'Béli River Dry-Season Grazing Protocol Demarcated',
        description:
          'Joint bilateral grazing and riparian watering compact concluded across 12 boundary communes. Satellite GIS markers deployed to clearly define seasonal migration corridors and designate transhumance rest camps.',
        tags: ['12 Communes Mapped'],
      },
      {
        date: 'February 2024',
        kicker: 'Inaugural Plenary',
        title: 'Foundational Transhumance & Agrarian Assembly in Sévaré',
        description:
          'Convened over 80 delegates comprising 35 customary chiefs, prefectural administrators, and women water stewards to establish the emergency conflict de-escalation charter for the central delta and Gourma corridor.',
        tags: ['35 Customary Signatures'],
      },
    ],
    dispatchHeading: 'Request Confidential Addenda & Aquifer Telemetry Data',
    dispatchSubtext:
      'Direct access to high-resolution GIS waypoint coordinates, seasonal borehole yield logs, and signed bilateral sub-prefectural peace codices is restricted to accredited diplomatic delegations and international stability partners.',
  },
  {
    slug: 'cross-border-chieftaincy-accords',
    theater: 'Continental ECOWAS',
    badgeText: 'CONTINENTAL ECOWAS',
    imageUrl: '/images/about/program-chieftaincy-accords.jpg',
    imageAlt: 'A formal chieftaincy accord signing ceremony',
    title: 'Cross-Border Chieftaincy Accords',
    description:
      'Institutionalizing customary border jurisdiction, enabling traditional rulers to adjudicate inter-ethnic civil disputes',
    referenceCode: 'REF: BO-CCA-2024-T1',
    clearanceLevel: 'DIPLOMATIC CLEARANCE L1',
    statusTag: 'ACTIVE JURISDICTIONAL ACCORD',
    subtitle:
      'Formal post-colonial borders cut arbitrarily across historically unified monarchies. The Cheiftaincy Accords formalize reciprocal customary legal authority to resolve transhumance disputes long before state police mobilization.',
    kpis: [
      {
        value: '8',
        label: 'ECOWAS Border Corridors & Frontier Prefectures',
        unit: 'Sovereign States',
      },
      {
        value: '58',
        label: 'Fulani Pastoralists & Dogon Agrarian Guild Accords',
        unit: 'Traditional rulers',
      },
      { value: '100%', label: 'Across 34 monitored strategic deep boreholes', unit: 'Non-violent' },
      { value: '3,589', label: 'Bi-annual transhumance ledger', unit: 'km' },
    ],
    doctrineEyebrow: 'STRATEGIC OPERATIONAL DOCTRINE',
    doctrineHeading: 'Codifying Traditional Jurisprudence in Modern Statecraft',
    doctrineParagraphs: [
      'Formal post-colonial borders cut arbitrarily across historically unified monarchies, traditional caliphates, and agro-pastoral communities. This partition created severe statutory vacuums along borderlands where transnational syndicates, cross-border armed raiders, and contraband networks continuously exploit sovereign legal immunity and jurisdictional delays.',
      "The Baobab Group's Cheiftaincy Accords formalize reciprocal customary legal authority between traditional councils across Nigeria, Benin, Niger, Togo, Cameroon, and Ghana. By legally binding customary rulers into a ratified inter-state dispute clearinghouse, paramount chiefs enforce property restitution, transfer fugitives across borders without bureaucratic friction, and resolve transhumance disputes long before state police mobilization.",
    ],
    doctrineImageUrl: '/images/about/program-chieftaincy-accords.jpg',
    doctrineImageCaption:
      'SECTOR GOURMA · HOMBORI-DOUENTZA WATER BASIN · Archival Photo Dossier #SVR-2024-GOU · Joint Basin Verification Mission',
    doctrineStats: [
      { value: '420', unit: 'km', label: 'Surveyed Corridors' },
      { value: '34', label: 'Deep Wells Secured' },
      { value: '100%', label: 'Non-Kinetic Accord' },
    ],
    pillarsEyebrow: 'GOVERNANCE ARCHITECTURE',
    pillarsHeading: 'Codified Operational Pillars',
    pillarsDescription:
      'Tri-partite regulatory foundations binding customary customary authorities, pastoral syndicates, and sovereign departmental authorities into an immutable resource charter.',
    pillars: [
      {
        icon: '🕒',
        eyebrow: 'PILLAR I',
        title: 'Hydraulic Rotational Clocks',
        description:
          'Time-partitioned watering windows rigorously allocating dawn to 11:00 for agrarian irrigation canal fill, 11:30 to 17:00 for transhumance livestock access, and evening recharge buffer periods—strictly eliminating cross-community overlap.',
        footnote: 'Synchronized with 18 local radios',
      },
      {
        icon: '🤝',
        eyebrow: 'PILLAR II',
        title: 'Amirou Ndiyam Conciliation',
        description:
          'Hereditary customary water masters empowered with expedited Track 1.5 arbitration authority. Field tribunals are constitutionally mandated to arbitrate agricultural perimeter damage within 6 hours, precluding state judicial delays.',
        footnote: 'Binding customary jurisprudence',
      },
      {
        icon: '🏗️',
        eyebrow: 'PILLAR III',
        title: 'Dual-Use Aquifer Recharge',
        description:
          'Joint pastoral-agrarian committees co-funded by local communes and transhumance transit tariffs to maintain high-yield solar pumping infrastructure, desilt seasonal catchment ponds, and preserve riparian acacia buffers.',
        footnote: 'Solar capacity: 184 kW installed',
      },
    ],
    timelineEyebrow: 'HISTORICAL RECORD',
    timelineHeading: 'Verified Accord Milestones & Field Chronicle',
    timelineDescription:
      'Chronological documentation of statutory ratifications, traditional plenaries, and regional treaty milestones executed by The Baobab Group.',
    milestones: [
      {
        date: 'December 2024',
        kicker: 'Diplomatic Decree',
        title: 'Nigeria-Benin Cross-Border Chieftaincy Pact Enacted',
        description:
          'Traditional courts in Borgu and Bariba kingdoms granted mutual civil summons recognition, allowing village headmen to directly petition counterpart paramount rulers across the border without waiting for diplomatic ministerial clearance.',
        tags: ['Parakou Accord', 'Mutual Summons Validated', '24 Monarchs Participating'],
      },
      {
        date: 'August 2024',
        kicker: 'Bilateral Treaty',
        title: 'Ghana-Togo Traditional Boundary Peace Charter Signed',
        description:
          'Volta-Plateaux customary reconciliation convention established, settling an eighty-year-old agrarian boundary delineation grievance between Ewe customary rulers on both sides of the frontier.',
        tags: ['Ho-Kpalimé Bench', 'Customary Demarcation', 'Zero Clashes Reported'],
      },
      {
        date: 'March 2024',
        kicker: 'Inaugural Plenary',
        title: 'Foundational ECOWAS Traditional Rulers Synod in Abuja',
        description:
          'Ratified by 40 supreme monarchs and envoys from 6 nations. Established The Baobab Group Secretariat as the permanent technical mediator for cross-border customary disputes.',
        tags: ['Abuja Declaration', '40 Royal Signatures', 'Permanent Chancery Founded'],
      },
    ],
    dispatchHeading: 'Request Confidential Addenda & Aquifer Telemetry Data',
    dispatchSubtext:
      'Direct access to high-resolution GIS waypoint coordinates, seasonal borehole yield logs, and signed bilateral sub-prefectural peace codices is restricted to accredited diplomatic delegations and international stability partners.',
  },
  {
    slug: 'riparian-water-fishery-protocols',
    theater: 'Continental ECOWAS',
    badgeText: 'CONTINENTAL ECOWAS',
    imageUrl: '/images/about/program-riparian-fishery.jpg',
    imageAlt: 'Fishers on a river at dawn',
    title: 'Riparian Water & Fishery Protocols',
    description:
      'Standardized fishing calendar allocations and seasonal tributary conservation zones ratified across Cameroon…',
    referenceCode: 'REF: BO-RWF-2024-F1',
    clearanceLevel: 'DIPLOMATIC CLEARANCE L2',
    statusTag: 'ACTIVE FISHERY ACCORD',
    subtitle:
      'Standardized fishing calendar allocations and seasonal tributary conservation zones ratified jointly with riparian fishing guilds across Cameroon and the wider Lake Chad basin tributaries.',
    kpis: [
      { value: '3', label: 'Tributary Systems', unit: 'Systems' },
      { value: '52', label: 'Fishing Guild Accords' },
      { value: '0', label: 'Guild Clashes', unit: 'Clashes' },
      { value: '76%', label: 'Stock Recovery' },
    ],
    doctrineEyebrow: 'STRATEGIC OPERATIONAL DOCTRINE',
    doctrineHeading: 'Codified Fishing Calendars and Conservation Zones',
    doctrineParagraphs: [
      "Overlapping seasonal fishing claims among riparian guilds along Cameroon's tributary network had driven recurring guild confrontations and unsustainable overfishing during peak spawning windows.",
      'The Baobab Group brokered a standardized fishing calendar, jointly enforced by guild elders and departmental fisheries observers, that allocates tributary access by season and designates permanent conservation zones around spawning grounds.',
    ],
    doctrineImageUrl: '/images/about/program-riparian-fishery.jpg',
    doctrineImageCaption:
      'SECTOR RIPARIAN TRIBUTARIES · CAMEROON BASIN · Joint Fishery Verification Mission',
    doctrineStats: [
      { value: '52', label: 'Guild Accords' },
      { value: '76%', label: 'Stock Recovery' },
      { value: '100%', label: 'Non-Kinetic Accord' },
    ],
    pillarsEyebrow: 'GOVERNANCE ARCHITECTURE',
    pillarsHeading: 'Codified Operational Pillars',
    pillarsDescription:
      'Tri-partite regulatory foundations binding fishing guilds, departmental fisheries observers, and sovereign conservation authorities into a single tributary charter.',
    pillars: [
      {
        icon: '🗓️',
        eyebrow: 'PILLAR I',
        title: 'Standardized Fishing Calendar',
        description:
          'Season-by-season tributary access windows jointly set by guild elders, eliminating overlapping claims during peak spawning periods.',
        footnote: 'Synchronized across 3 tributary systems',
      },
      {
        icon: '🤝',
        eyebrow: 'PILLAR II',
        title: 'Guild Conciliation Bench',
        description:
          'Hereditary guild elders empowered with expedited Track 1.5 arbitration authority over tributary access disputes.',
        footnote: 'Binding customary jurisprudence',
      },
      {
        icon: '🌿',
        eyebrow: 'PILLAR III',
        title: 'Conservation Zone Charter',
        description:
          'Permanent no-fishing buffers around spawning grounds, co-monitored by guild wardens and departmental fisheries staff.',
        footnote: 'Stock recovery: 76% and rising',
      },
    ],
    timelineEyebrow: 'HISTORICAL RECORD',
    timelineHeading: 'Verified Accord Milestones & Field Chronicle',
    timelineDescription:
      'Chronological documentation of statutory ratifications, traditional plenaries, and regional treaty milestones executed by The Baobab Group.',
    milestones: [
      {
        date: 'October 2024',
        kicker: 'Diplomatic Decree',
        title: 'Tributary Fishing Calendar Charter Ratified',
        description:
          'Formal codification of seasonal fishing calendar allocations and permanent conservation zones across 3 tributary systems.',
        tags: ['3 Tributary Systems', 'Charter Ratified'],
      },
      {
        date: 'May 2024',
        kicker: 'Bilateral Treaty',
        title: 'Guild Conciliation Bench Protocol Signed',
        description:
          'Joint guild elder bench granted expedited mediation authority over tributary access disputes ahead of peak season.',
        tags: ['Zero Guild Clashes Reported'],
      },
      {
        date: 'January 2024',
        kicker: 'Inaugural Plenary',
        title: 'Foundational Fishery Assembly Convened',
        description:
          'Guild elders, departmental fisheries observers, and conservation authorities established the tributary charter.',
        tags: ['46 Delegates', 'Charter Founded'],
      },
    ],
    dispatchHeading: 'Request Confidential Fishery Addenda & Stock Telemetry',
    dispatchSubtext:
      'Direct access to tributary yield logs, conservation zone boundaries, and signed guild fishery codices is restricted to accredited diplomatic delegations and international stability partners.',
  },
];

export function findProgramBySlug(slug: string | null): Program | undefined {
  return PROGRAMS.find((program) => program.slug === slug);
}
