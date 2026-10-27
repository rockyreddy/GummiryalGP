// Static pages: t = [title en, title te], i = [intro en, intro te], items = [heading en, text en, heading te, text te]. Replace sample values.
export const INFO: Record<string, { t: string[]; i: string[]; items: string[][] }> = {
  schemes: { t: ['Schemes & Certificates', 'పథకాలు & ధృవపత్రాలు'], i: ['Government schemes and how to apply.', 'ప్రభుత్వ పథకాలు, దరఖాస్తు విధానం.'], items: [
    ['Old-age pension', 'Documents: Aadhaar, age proof, bank passbook. (Sample)', 'వృద్ధాప్య పింఛన్', 'పత్రాలు: ఆధార్, వయస్సు ధృవీకరణ, బ్యాంకు పాస్‌బుక్. (నమూనా)'],
    ['MGNREGA job card', 'Apply at the Panchayat office with a family photo and Aadhaar. (Sample)', 'ఉపాధి హామీ జాబ్ కార్డు', 'కుటుంబ ఫోటో, ఆధార్‌తో పంచాయతీ కార్యాలయంలో దరఖాస్తు చేయండి. (నమూనా)'],
    ['Income / residence certificate', 'Apply via the Panchayat secretary. (Sample)', 'ఆదాయ / నివాస ధృవపత్రం', 'పంచాయతీ కార్యదర్శి ద్వారా దరఖాస్తు చేయండి. (నమూనా)']] },
  utilities: { t: ['Utilities & Emergency', 'సేవలు & అత్యవసరం'], i: ['Timings and important numbers.', 'సమయాలు, ముఖ్యమైన నంబర్లు.'], items: [
    ['Water supply', '6 AM – 8 AM daily (sample)', 'నీటి సరఫరా', 'ప్రతిరోజూ ఉదయం 6 – 8 (నమూనా)'],
    ['Ambulance', '108', 'అంబులెన్స్', '108'], ['Police', '100', 'పోలీసు', '100'],
    ['Panchayat office', '00000 00000 (edit)', 'పంచాయతీ కార్యాలయం', '00000 00000 (మార్చండి)']] },
  farmer: { t: ['Farmer Corner', 'రైతు మూల'], i: ['Prices, weather and local services.', 'ధరలు, వాతావరణం, స్థానిక సేవలు.'], items: [
    ['Market prices', 'Connect a mandi-price API or update manually. (Sample)', 'మార్కెట్ ధరలు', 'మండి ధరల API ని అనుసంధానించండి లేదా చేతితో నవీకరించండి. (నమూనా)'],
    ['Local directory', 'Electricians, tractors, transport — add entries. (Sample)', 'స్థానిక డైరెక్టరీ', 'ఎలక్ట్రీషియన్లు, ట్రాక్టర్లు, రవాణా — వివరాలు జోడించండి. (నమూనా)']] },
  transparency: { t: ['Transparency Board', 'పారదర్శకత బోర్డు'], i: ['Funds received and works completed.', 'అందిన నిధులు, పూర్తైన పనులు.'], items: [
    ['Funds received', '₹0 (edit)', 'అందిన నిధులు', '₹0 (మార్చండి)'], ['Works completed', '0 (edit)', 'పూర్తైన పనులు', '0 (మార్చండి)']] },
  contact: { t: ['Contact', 'సంప్రదింపు'], i: ['Reach the Gummiryal Gram Panchayat.', 'గుమ్మిర్యాల్ గ్రామ పంచాయతీని సంప్రదించండి.'], items: [
    ['Office', 'Add address, phone, email', 'కార్యాలయం', 'చిరునామా, ఫోన్, ఇమెయిల్ జోడించండి']] },
};
