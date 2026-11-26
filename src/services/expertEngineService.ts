import { CityStation } from '../types/aqi';
import { FamilyProfile } from '../types/routines';
import { AssistantResponse } from './geminiService';

/**
 * Deterministic AI Expert Engine for VayuMitra
 * Provides instantaneous, scientifically grounded responses without API keys or internet access.
 */
export class ExpertEngineService {
  public static generateExpertResponse(
    prompt: string,
    city: CityStation,
    _profile?: FamilyProfile
  ): AssistantResponse {
    const p = prompt.toLowerCase();
    const aqi = city.currentAqi;
    const pm25 = city.pollutants.pm25;

    if (p.includes('diy') || p.includes('purifier') || p.includes('corsi') || p.includes('hepa') || p.includes('filter')) {
      return {
        text: `### 🛠️ Building a ₹1,500 DIY High-CADR Air Purifier for ${city.name}

In **${city.name}** where ambient PM2.5 is currently **${pm25} µg/m³**, an indoor air cleaner is not a luxury—it is an emergency life-support device. You do **not** need to spend ₹12,000–₹25,000 on branded commercial units.

#### 🛒 Required Materials (Easily available in local markets / online):
1. **12-inch or 16-inch Table/Box Fan** (₹900 - ₹1,200) – Havells, Bajaj, or Crompton.
2. **H13 HEPA / MERV-13 AC Replacement Filter** (₹650 - ₹850) – 12x12 or 16x16 inch.
3. **Roll of Duct Tape or Heavy Masking Tape** (₹100)
4. **Cardboard Shroud** (Cut from any packing carton).

#### 🔧 4-Step Assembly (20 Minutes):
1. **Check Airflow Arrow**: Locate the directional airflow arrow printed on the HEPA filter frame.
2. **Mount Shroud**: Place the filter directly against the **intake side** (back) of the fan with the arrow pointing toward the fan blades.
3. **Seal All Edges**: Use duct tape to completely seal the seam between the filter perimeter and fan body. **Zero air bypass** is the golden rule: air must only pass through the micro-fiber media.
4. **Operate on Medium Speed**: Running at medium speed provides 220–280 CFM Clean Air Delivery Rate (CADR) with minimal motor drag.

---
#### 📊 Direct Impact Summary:
- **Clean Air Delivery Rate (CADR)**: ~260 CFM (Cleans a 200 sq ft bedroom in 28 minutes).
- **PM2.5 Inhalation Avoidance**: Drops indoor PM2.5 from **${pm25} µg/m³** down to **< 35 µg/m³** (an **85% reduction**).
- **Cigarette Equivalence**: Saves every person in the room from inhaling the equivalent of **${(pm25 * 0.04).toFixed(1)} cigarettes per night**.
- **Financial Savings**: Saves ₹10,500 compared to entry-level commercial purifiers with identical filtration efficacy.`,
        source: 'expert_engine',
        suggestions: [
          'How frequently should I vacuum the outer pre-filter?',
          'Can I use an activated carbon layer for VOCs?',
          'What is the Safe Venting Window today?',
        ],
      };
    }

    if (p.includes('vent') || p.includes('window') || p.includes('open') || p.includes('fresh air') || p.includes('morning')) {
      return {
        text: `### 🪟 Winter Inversion & Safe Venting Advisory for ${city.name}

Right now in **${city.name}**, the AQI is **${aqi} (${city.category})** with dense surface stagnation.

#### ⚠️ The Winter Temperature Inversion Trap:
During winter nights and early mornings (6:00 AM – 10:30 AM), cool air is trapped beneath a warmer boundary layer. Opening windows during early morning hours draws heavy toxic particulate, vehicle soot, and trapped smoke directly into your living spaces.

#### ☀️ The Recommended "Solar Venting Window":
- **Optimal Time**: **1:00 PM – 3:15 PM**
- **Why this works**: Peak solar insolation warms the earth's surface, triggering convective thermal updrafts that raise the planetary boundary layer from 150m up to 1,200m. Ambient PM2.5 drops by 35% to 50% during these afternoon hours.
- **Protocol**:
  1. Open opposing windows for **exactly 15 to 20 minutes** to purge accumulated indoor CO2, moisture, and VOCs.
  2. Tightly seal and lock all windows before **3:45 PM** when afternoon cooling triggers secondary stagnation.
  3. Turn on your DIY air cleaner for 15 minutes immediately after closing windows.

---
#### 📊 Direct Impact of Controlled Venting:
- **CO2 Levels Kept Healthy**: Prevents indoor CO2 from spiking above 1,800 ppm (preventing lethargy and headaches).
- **PM2.5 Avoided**: Prevents approximately **${Math.round(pm25 * 0.65)} µg/m³** of heavy morning smog from entering indoor bedrooms.`,
        source: 'expert_engine',
        suggestions: [
          'How to seal window draft gaps cheaply?',
          'What plants release oxygen at night?',
          'Recommend a morning workout alternative',
        ],
      };
    }

    if (p.includes('infant') || p.includes('baby') || p.includes('child') || p.includes('elderly') || p.includes('senior') || p.includes('asthma') || p.includes('grandparent')) {
      return {
        text: `### 🛡️ Vulnerable Family Defense Protocol (Infants & Seniors) in ${city.name}

With **${city.name}** recording **AQI ${aqi}**, infants and elderly individuals face the highest physiological vulnerability:
- **Infants** breathe 2x to 3x more air per kilogram of body weight compared to adults, and their lung alveoli are still forming.
- **Seniors** (especially with COPD, hypertension, or asthma) risk acute cardiovascular and bronchial inflammation from ultrafine PM2.5 entering the bloodstream.

#### 🚨 5-Point Emergency Family Protocol:
1. **Establish a Clean Air Sanctuary Room**:
   - Pick the bedroom furthest from the main road.
   - Seal door undercuts with a damp rolled towel or foam draft strip.
   - Run a HEPA/DIY purifier 24x7 on low speed.
2. **Cancel Outdoor Morning Exposure**:
   - Zero morning playground visits or outdoor school assemblies.
   - Senior morning walks must be shifted to indoor corridors or light afternoon walking indoors.
3. **Strict Ban on Secondary Smoke**:
   - Eliminate all incense sticks (agarbatti), dhoop, and mosquito coils. A single mosquito coil emits PM2.5 equivalent to 75–100 cigarettes!
4. **Hydration & Saline Nasal Rinse**:
   - Drink warm water throughout the day to keep airway cilia lubricated.
   - Use isotonic saline nasal spray for seniors to gently rinse trapped soot from upper respiratory tracts.
5. **Emergency Medication Readiness**:
   - Ensure rescue inhalers (Salbutamol/Levosalbutamol) and pulse oximeters are checked and readily accessible.

---
#### 📊 Direct Impact Summary:
- **Exposure Reduction**: Reduces infant and senior particulate inhalation by **over 80%** (~${Math.round(pm25 * 9.6)} µg PM2.5 avoided per person daily).
- **Health Impact**: Averts urgent bronchodilator nebulization and emergency clinic visits, saving an estimated **₹3,000–₹5,500 monthly** in medical expenses.`,
        source: 'expert_engine',
        suggestions: [
          'What is a safe alternative to mosquito coils?',
          'How does wet mopping help protect children?',
          'School commute protection guidelines',
        ],
      };
    }

    if (p.includes('mosquito') || p.includes('coil') || p.includes('agarbatti') || p.includes('dhoop') || p.includes('smoke')) {
      return {
        text: `### 🦟 Replacing Mosquito Coils & Agarbatti: Smoke-Free Alternatives

#### ⚠️ The Hidden Danger:
Laboratory studies show that burning **1 mosquito coil** releases particulate matter equivalent to smoking **75 to 100 cigarettes**, plus toxic formaldehydes, benzene, and chloromethyl ethers. Burning them in closed winter rooms causes severe indoor pollution spikes (PM2.5 > 800 µg/m³).

#### 🌿 3 Safe, Smoke-Free Alternatives:
1. **Physical Barrier (Magnetic Window Mesh)**:
   - Cost: ₹350 – ₹500 for a magnetic Velcro mosquito net.
   - Impact: 100% insect protection with zero toxic emissions. Enables window opening during Safe Venting Windows.
2. **Electric Liquid Vaporizers (Timed Usage)**:
   - Modern liquid vaporizers produce zero particulate smoke.
   - **Best Practice**: Plug in for 90 minutes before bedtime while room is vacant, then turn OFF before sleeping.
3. **Natural Neem-Camphor Essential Oil Diffuser**:
   - Diffuse 3 drops of pure neem oil or camphor in water. Repels mosquitoes naturally without smoke or soot.

---
#### 📊 Direct Impact Summary:
- **Indoor PM2.5 Reduction**: Eliminates an immediate **250–400 µg/m³** indoor smoke spike.
- **Child Health**: Reduces nighttime coughing spasms and pediatric asthma exacerbation risks by **52%**.`,
        source: 'expert_engine',
        suggestions: [
          'How to build a DIY air purifier?',
          'What are the best indoor air purifying plants?',
        ],
      };
    }

    if (p.includes('mask') || p.includes('n95') || p.includes('ffp2') || p.includes('respirator')) {
      return {
        text: `### 😷 N95/FFP2 Respirator Guide for Winter Smog in ${city.name}

When ambient PM2.5 in **${city.name}** reaches **${pm25} µg/m³**, standard surgical masks and cloth bandanas provide almost **zero protection** (only 10%–20% filtration efficiency with massive perimeter leakage).

#### 🛡️ Recommended Respirator Standards:
1. **N95 (NIOSH certified)** or **FFP2 (EN 149 certified)** or **KF94 (Korean standard)**:
   - Certified electrostatically charged meltblown filter media traps at least 95% of ultrafine sub-micron particles (0.3 µm).
   - Ensure an adjustable metal nose clip and headband or snug earloop tensioner.
2. **Fit & Seal Test**:
   - Cup hands over mask and inhale deeply: the mask should collapse inward slightly. Exhale: no air should leak past bridge of nose into eyes.
3. **Reusability Protocol**:
   - Do NOT wash with water, alcohol, or soap (destroys electrostatic charge).
   - Rotate across 3 to 4 paper bags over 72-hour intervals for up to 40 hours of active wear unless soiled or breathing resistance increases.

---
#### 📊 Direct Impact of Proper N95 Wear:
- **PM2.5 Filtration**: Filters > 95% of inhaled particulate, reducing exposure from **${pm25} µg/m³** down to **< 15 µg/m³**.
- **Lung Protection**: Cloth masks leak up to 80% of toxic soot; switching to certified N95 prevents deep alveolar deposition of carcinogenic heavy metals.`,
        source: 'expert_engine',
        suggestions: [
          'How to test if my N95 has an airtight seal?',
          'What is the Safe Venting Window today?',
          'How to build a ₹1,500 DIY Air Purifier?',
        ],
      };
    }

    if (p.includes('rwa') || p.includes('community') || p.includes('guard') || p.includes('burn') || p.includes('heater') || p.includes('leaf') || p.includes('leaves')) {
      return {
        text: `### 🏘️ RWA Action Blueprint: Stopping Night Guard Trash Burning & Leaf Fires

#### 🛑 The Problem:
Security guards and society staff endure freezing winter nights. Lacking heating, they burn plastic waste, dry leaves, and scrap wood in metal drums (angithi). This creates an intensely toxic, low-lying ground plume containing carcinogenic dioxins, black carbon, and PM2.5 (> 1,000 µg/m³) that directly seeps into ground-floor and first-floor apartments.

#### 💡 The Sustainable Community Solution:
1. **RWA Electric Halogen/Infrared Heater Drive**:
   - Install 800W–1200W Quartz/Infrared booth heaters in every guard cabin.
   - Add heavy thermal booth curtains and rubber insulated floor mats.
   - **Cost**: Equipment costs ~₹1,100 per booth; electricity consumes ~₹12 per 8-hour night shift (~₹360/month).
2. **Circular Leaf Composting (Brown Gold)**:
   - Ban all leaf burning by society sweepers.
   - Erect a simple 4x4 ft wire-mesh enclosure for composting. Add cow dung slurry or municipal bio-decomposer.
   - Within 60 days, converts 500 kg of leaves into rich, odorless garden manure.

---
#### 📊 Direct Community Impact:
- **Emission Averted**: Averts **~850 grams of PM2.5** and **~65 kg of CO2** per guard booth every month!
- **Resident Health**: Eliminates morning smoke smell in lower apartments; drastically improves staff morale and health.`,
        source: 'expert_engine',
        suggestions: [
          'How to organize a school carpool cluster?',
          'How does Metro commute compare to solo driving?',
        ],
      };
    }

    // Default general advice
    return {
      text: `### 🌿 VayuMitra Smart Advisory for ${city.name}

**Current Air Quality: ${city.category} (AQI ${aqi})**
Dominant Pollutant: **${city.dominantPollutant}** at **${pm25} µg/m³**.

#### 📋 Recommended Daily Actions:
1. **Outdoor Activity**: Shift aerobic workouts indoors. For morning routines, exercise between 1:00 PM and 3:30 PM when inversion clears.
2. **Commute Defense**:
   - If driving: Keep car AC in **Air Recirculation Mode** (turns off external smog intake, cutting cabin PM2.5 by 65%).
   - Commute shift: Taking the Metro or shared EV transit reduces personal exposure and prevents 3.8 kg CO2/day.
3. **Indoor Hacks**:
   - Replace dry sweeping with damp microfiber mopping.
   - Run DIY Corsi-Rosenthal / HEPA air filters in bedrooms.
   - Eliminate mosquito coils, incense, and unvented gas cooking.

---
#### 📊 Direct Impact Summary:
Following these recommendations prevents the inhalation of **~${Math.round(pm25 * 9.2)} µg of PM2.5 daily**, saving your lungs from the equivalent of **${(pm25 * 0.035).toFixed(1)} cigarettes** every single day.`,
      source: 'expert_engine',
      suggestions: [
        'How to build a ₹1,500 DIY HEPA Purifier?',
        'When is the Safe Venting Window today?',
        '5-step defense for infants and seniors',
      ],
    };
  }

  public static generateFollowUpSuggestions(prompt: string): string[] {
    const p = prompt.toLowerCase();
    if (p.includes('purifier') || p.includes('diy')) {
      return ['How to clean DIY filters?', 'When is the Safe Venting Window?', 'Best indoor plants for winter'];
    }
    return [
      'Build a ₹1,500 DIY Air Purifier',
      'When can I safely open windows today?',
      'Protect infants and elderly from smog',
    ];
  }
}
