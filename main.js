// State
const state = {
    tasks: [
        { id: 't1', title: 'Take morning meds', type: 'med', completed: true },
        { id: 't2', title: 'Follow low-sodium diet', type: 'habit', completed: false },
        { id: 't3', title: 'Confirm follow-up', type: 'appt', completed: false }
    ],
    meds: [
        { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: '8 PM', time: '8:00 PM', taken: false, reminder: false, stock: 5 },
        { id: 2, name: 'Aspirin', dosage: '81mg', frequency: '8 AM', time: '8:00 AM', taken: true, reminder: false, stock: 45 },
        { id: 3, name: 'Metoprolol', dosage: '25mg', frequency: '8 AM & 8 PM', time: '8:00 PM', taken: false, reminder: false, stock: 12 },
    ],
    appts: [
        { id: 1, doctor: 'Dr. Sarah Smith', spec: 'Cardiologist', date: 'Sept 2, 11:30 AM', type: 'In-person', status: 'upcoming' },
        { id: 2, doctor: 'Dr. Alan Chen', spec: 'Pulmonologist', date: 'Sept 8, 2:00 PM', type: 'Telehealth', status: 'upcoming' }
    ],
    timeline: {
        selectedDay: 3,
        days: [1, 2, 3, 4, 5, 6],
        data: {
            1: [{ block: 'Morning', title: 'Hospital Discharge', desc: 'Stable vitals achieved. Discharged with strict instructions for rest and Beta/ACE inhibitors.', opacity: 0.6 }],
            2: [{ block: 'All Day', title: 'Strict Rest', desc: 'Complete bed rest. Hydrate frequently.', opacity: 0.6 }],
            3: [
                { block: 'Morning Block', title: 'At-Home Adjustments', desc: 'Monitor for dizziness upon standing. Ensure sodium intake is < 1500mg. Wear Apple Watch at all times.', opacity: 1 },
                { block: 'Afternoon Block', title: 'Light Mobility', desc: '10 minutes of light walking around the living space. Do not exceed 90 BPM.', opacity: 1 },
                { block: 'Evening Block', title: 'Complete Rest', desc: 'No exertion past 6 PM. Focus on breathing exercises.', opacity: 0.6 }
            ],
            4: [{ block: 'Morning Block', title: 'Telehealth Check', desc: 'Virtual check-in with nurse practitioner at 10:00 AM.', opacity: 1 }, { block: 'Afternoon Block', title: 'Extended Mobility', desc: 'Increase walking to 15 minutes.', opacity: 1 }],
            5: [{ block: 'Morning Block', title: 'Dietary Review', desc: 'Log all meals. Maintain low sodium compliance.', opacity: 1 }],
            6: [{ block: 'All Day', title: 'Monitor Progress', desc: 'Prepare for week 2 adjustments.', opacity: 1 }]
        }
    },
    pastAppts: [
        { id: 'p1', doctor: 'Dr. Emerson', spec: 'Urgent Care', date: 'Aug 24, 2026', type: 'Discharge', notes: 'Patient stabilized post-cardiac arrest. Vitals normalized. Prescribed Lisinopril 10mg.', reports: ['Discharge Summary', 'ECG Report'] },
        { id: 'p2', doctor: 'Dr. Sarah Smith', spec: 'Cardiologist', date: 'Jul 15, 2026', type: 'Routine Checkup', notes: 'Routine hypertension check. BP 130/85. Recommended reducing sodium intake.', reports: ['Lipid Panel'] }
    ],
    chatHistory: [
        { role: 'ai', text: "Hello Andrew, I'm CareLink! How are you feeling today?" }
    ],
    isTyping: false
};

// DOM Elements
const screens = document.querySelectorAll('.screen');
const navItems = document.querySelectorAll('.nav-item');
const bottomNav = document.getElementById('bottom-nav');

// Routing
function navigateTo(screenId) {
    screens.forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');

    if (screenId === 'welcome-screen') {
        bottomNav.classList.add('hidden');
        document.getElementById('desktop-sidebar').classList.add('hidden');
    } else {
        bottomNav.classList.remove('hidden');
        document.getElementById('desktop-sidebar').classList.remove('hidden');
        navItems.forEach(n => {
            if (n.dataset.target === screenId) n.classList.add('active');
            else n.classList.remove('active');
        });
    }

    if (screenId === 'home-screen') renderHome();
    if (screenId === 'meds-screen') renderMeds();
    if (screenId === 'appts-screen') renderAppts();
    if (screenId === 'chat-screen') renderChat();
    if (screenId === 'timeline-screen') renderTimeline();
}

// Onboarding Flow
document.getElementById('onboard-next-0').onclick = () => {
    const val = document.getElementById('patient-id-input').value;
    if (val.length < 2) return alert("Please enter a valid Patient ID");

    document.getElementById('onboard-content-0').classList.add('hidden');
    document.getElementById('onboard-loader-0').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('onboarding-0').classList.add('hidden');
        document.getElementById('onboarding-1').classList.remove('hidden');
    }, 2200);
};

document.getElementById('onboard-next-1').onclick = () => {
    document.getElementById('onboarding-1').classList.add('hidden');
    document.getElementById('onboarding-2').classList.remove('hidden');
};

const goToStep3 = () => {
    document.getElementById('onboarding-2').classList.add('hidden');
    document.getElementById('onboarding-3').classList.remove('hidden');
};
document.getElementById('onboard-skip-2').onclick = goToStep3;
document.getElementById('onboard-next-2').onclick = () => {
    const container = document.getElementById('watch-btn-container');
    container.innerHTML = '<div style="color:white;text-align:center;width:100%;font-weight:bold;">Syncing Bluetooth...</div>';
    document.querySelector('.watch-ping').classList.add('active');

    setTimeout(() => {
        document.getElementById('watch-sync-title').innerText = "Sync Complete.";
        document.getElementById('watch-sync-desc').innerText = "Your vital metrics are now actively monitored.";
        document.querySelector('.watch-ping').classList.remove('active');
        container.innerHTML = '<button class="btn btn-primary full-width" onclick="document.getElementById(\'onboarding-2\').classList.add(\'hidden\');document.getElementById(\'onboarding-3\').classList.remove(\'hidden\');" style="background:var(--white);color:var(--teal-600);">Next</button>';
    }, 2800);
};

const finishOnboard = () => {
    navigateTo('home-screen');
    document.getElementById('desktop-sidebar').classList.remove('locked-nav');
    document.getElementById('bottom-nav').classList.remove('locked-nav');
};
document.getElementById('onboard-next-3').onclick = () => {
    showNotification('INVITE SENT', 'Caregiver invitation sent successfully.');
    const cgBtn = document.getElementById('btn-caregiver');
    if (cgBtn) {
        cgBtn.innerHTML = '<span class="icon" style="transform:none;opacity:1;">📞</span><span>Call Caregiver</span>';
        cgBtn.onclick = () => showNotification("CALLING...", "Connecting to caregiver's mobile line.");
    }
    finishOnboard();
};
document.getElementById('onboard-skip-3').onclick = finishOnboard;

navItems.forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.target));
});

document.getElementById('fab-chat').addEventListener('click', () => {
    navigateTo('chat-screen');
});

// Render Home
function renderHome() {
    const taskList = document.getElementById('home-task-list');
    taskList.innerHTML = '';

    state.tasks.forEach(t => {
        const el = document.createElement('div');
        el.className = `task-item ${t.completed ? 'completed' : ''}`;
        el.innerHTML = `
      <div class="task-checkbox"></div>
      <div class="task-title">${t.title}</div>
    `;
        el.addEventListener('click', () => {
            t.completed = !t.completed;
            // Optional: don't strictly bind morning meds toggle to a single med, just update task state
            if (t.type === 'med') {
                const med = state.meds.find(m => m.id === t.refId);
                if (med) med.taken = t.completed;
            }
            if (t.type === 'appt') {
                // Just task toggle
            }
            renderHome();
        });
        taskList.appendChild(el);
    });

    // Update Stats
    const dueMedsCount = state.meds.filter(m => !m.taken).length;
    document.getElementById('stat-meds').innerText = dueMedsCount;

    const nextAppt = state.appts.find(a => a.status === 'upcoming');
    document.getElementById('sidebar-stat-next-appt').innerText = nextAppt ? nextAppt.date.split(',')[0] : 'Needs Booking';
    document.getElementById('sidebar-stat-meds').innerText = dueMedsCount;
}

// Render Medications
function renderMeds() {
    const container = document.getElementById('meds-list-container');
    container.innerHTML = '';

    let takenCount = 0;
    state.meds.forEach(m => {
        if (m.taken) takenCount++;
        const el = document.createElement('div');
        el.className = 'med-card';
        el.innerHTML = `
      <div class="med-header">
        <div>
          <div class="med-title">${m.name} ${m.dosage}</div>
          <div class="med-meta">${m.frequency} • Due: ${m.time}</div>
        </div>
        <button class="btn ${m.taken ? 'btn-outline' : 'btn-primary'}" style="padding: 0.5rem 1rem; transform: scale(0.9);">${m.taken ? '✓ Taken' : 'Mark Taken'}</button>
      </div>
      <div class="med-actions" style="display:flex; justify-content:space-between; width:100%; align-items:center;">
        <div class="toggle-wrapper" style="flex:1;">
          <div class="toggle ${m.reminder ? 'on' : ''}"></div>
          <span>Reminders</span>
        </div>
        <div style="font-size:0.85rem;color:var(--gray-600);${m.stock <= 7 ? 'color:#ef4444;font-weight:600;' : ''}">${m.stock} pills left</div>
        <button class="btn btn-secondary refill-btn" style="padding:0.4rem 0.8rem;font-size:0.8rem;margin-left:12px;">Refill</button>
      </div>
    `;

        // Toggle Taken
        el.querySelector('.btn').addEventListener('click', () => {
            m.taken = !m.taken;
            // sync task
            const t = state.tasks.find(ts => ts.refId === m.id);
            if (t) t.completed = m.taken;
            renderMeds();
        });

        // Toggle Reminder
        el.querySelector('.toggle').addEventListener('click', () => {
            m.reminder = !m.reminder;
            renderMeds();
        });

        // Refill request
        el.querySelector('.refill-btn').addEventListener('click', () => {
            navigateTo('chat-screen');
            chatInput.value = `I need a refill for ${m.name}.`;
            checkInputState();
            handleSend();
        });

        container.appendChild(el);
    });

    // Progress
    const total = state.meds.length;
    const pct = total === 0 ? 0 : (takenCount / total) * 100;

    const textEl = document.getElementById('meds-progress-text');
    const barEl = document.getElementById('meds-progress-bar');
    if (textEl) textEl.innerText = `${takenCount} of ${total} doses taken`;
    if (barEl) barEl.style.width = `${pct}%`;

    const banner = document.getElementById('celebration-banner');
    if (takenCount === total && total > 0) {
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }
}

// Render Appointments
function renderAppts() {
    const upcomingContainer = document.getElementById('upcoming-appts');
    const pastContainer = document.getElementById('past-appts');
    if (upcomingContainer) upcomingContainer.innerHTML = '';
    if (pastContainer) pastContainer.innerHTML = '';

    const upcoming = state.appts.filter(a => a.status === 'upcoming');

    if (upcoming.length === 0) {
        if (upcomingContainer) upcomingContainer.innerHTML = '<p style="color:var(--gray-600);font-size:0.9rem;text-align:center;padding:1rem;">No upcoming appointments.</p>';
    } else {
        upcoming.forEach(a => {
            const el = document.createElement('div');
            el.className = 'appt-card';
            el.innerHTML = `
        <div class="med-header">
          <div>
            <div class="med-title">${a.doctor} • ${a.spec}</div>
            <div class="med-meta">${a.date} (${a.type})</div>
          </div>
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:1rem;">
          <button class="btn btn-secondary full-width reschedule-btn">Reschedule</button>
          <button class="btn btn-outline full-width cancel-btn" style="color:var(--gray-600);border-color:var(--gray-200);">Cancel</button>
        </div>
      `;
            el.querySelector('.reschedule-btn').addEventListener('click', () => openRescheduleModal(a));
            el.querySelector('.cancel-btn').addEventListener('click', () => {
                if (confirm("Cancel this appointment?")) {
                    state.appts = state.appts.filter(x => x.id !== a.id);
                    renderAppts();
                    showNotification('CANCELLED', 'Appointment cancelled successfully.');
                }
            });
            if (upcomingContainer) upcomingContainer.appendChild(el);
        });
    }

    const bookBtn = document.getElementById('book-appt-btn');
    if (bookBtn) {
        bookBtn.onclick = () => {
            navigateTo('chat-screen');
            const input = document.getElementById('chat-input');
            input.value = "I need to book an appointment";
            input.focus();
            checkInputState();
        };
    }

    if (!pastContainer) return;
    state.pastAppts.forEach(p => {
        const el = document.createElement('div');
        el.className = 'appt-card past';
        el.style.opacity = '0.85';
        el.style.cursor = 'pointer';
        el.onclick = () => renderApptDetails(p.id);
        el.innerHTML = `
        <div style="display:flex; justify-content: space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:var(--gray-800);">${p.date}</div>
            <div style="color:var(--gray-600); font-size:0.85rem; margin-top:2px;">${p.doctor} • ${p.type}</div>
          </div>
          <div style="color:var(--teal-600);font-weight:700;">View &rarr;</div>
        </div>
    `;
        pastContainer.appendChild(el);
    });
}

window.renderApptDetails = function (id) {
    const appt = state.pastAppts.find(a => a.id === id);
    if (!appt) return;

    let reportsHtml = '';
    appt.reports.forEach(r => {
        reportsHtml += `<div style="padding:0.75rem 1rem;background:var(--bg-main);border-radius:8px;border:1px solid var(--gray-200);color:var(--teal-600);font-weight:600;display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;"><div style="display:flex;align-items:center;gap:8px;"><span>📄</span><span>${r}</span></div><span>↓</span></div>`;
    });

    const content = `
      <div class="card" style="margin-top:1rem;margin-bottom:1.5rem;border:1px solid var(--border-color);">
        <h3 style="margin:0 0 0.5rem 0;color:var(--gray-800);">${appt.date}</h3>
        <p style="font-size:1.1rem;font-weight:600;color:var(--teal-600);margin:0;">${appt.doctor}</p>
        <p style="font-size:0.85rem;color:var(--gray-600);margin:4px 0 0 0;">${appt.spec}</p>
        <hr style="border:0;border-top:1px dashed var(--gray-200);margin:1rem 0;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:0.5rem;">
          <div class="avatar" style="border-radius:8px;background:var(--teal-50);color:var(--teal-600);font-size:1rem;">📍</div>
          <div>
            <div style="font-weight:600;font-size:0.9rem;color:var(--gray-800);">Location</div>
            <div style="font-size:0.8rem;color:var(--gray-600);">Main Campus, Suite 402</div>
          </div>
        </div>
      </div>
      
      <h3 style="margin-bottom:0.75rem;">Physician Notes</h3>
      <div class="card" style="margin-bottom:1.5rem;background:var(--teal-50);border:1px solid var(--teal-100);">
        <p style="font-size:0.95rem;line-height:1.6;color:var(--teal-700);margin:0;">"${appt.notes}"</p>
      </div>
      
      <h3 style="margin-bottom:0.75rem;">Issued Documents</h3>
      ${reportsHtml}
    `;

    document.getElementById('appt-det-content').innerHTML = content;
    navigateTo('appt-details-screen');
}

// Reschedule Modal
const modal = document.getElementById('reschedule-modal');
function openRescheduleModal(appt) {
    modal.classList.remove('hidden');
    const slotsContainer = document.getElementById('reschedule-slots');
    slotsContainer.innerHTML = '';
    const slots = ["Sept 5, 9:00 AM", "Sept 6, 1:00 PM", "Sept 7, 10:30 AM"];
    slots.forEach(s => {
        const b = document.createElement('button');
        b.className = 'slot-btn';
        b.innerText = s;
        b.onclick = () => {
            appt.date = s;
            modal.classList.add('hidden');
            renderAppts();
            showNotification("APPOINTMENT UPDATED", `Your appointment with ${appt.doctor} is now on ${s}`);
        };
        slotsContainer.appendChild(b);
    });
}
document.getElementById('close-modal-btn').onclick = () => modal.classList.add('hidden');

// Feedback & Caregiver Modals (V2)
const caregiverModal = document.getElementById('caregiver-modal');
document.getElementById('btn-caregiver').onclick = () => caregiverModal.classList.remove('hidden');
document.getElementById('close-caregiver-btn').onclick = () => caregiverModal.classList.add('hidden');
document.getElementById('submit-caregiver-btn').onclick = () => {
    caregiverModal.classList.add('hidden');
    showNotification("INVITE SENT", "Care plan access invitation sent successfully.");

    // Switch Caregiver button state
    const cgBtn = document.getElementById('btn-caregiver');
    if (cgBtn) {
        cgBtn.innerHTML = '<span class="icon" style="transform:none;opacity:1;">📞</span><span>Call Caregiver</span>';
        cgBtn.onclick = () => {
            showNotification("CALLING...", "Connecting to caregiver's mobile line.");
        };
    }
};

const feedbackModal = document.getElementById('feedback-modal');
document.getElementById('btn-feedback').onclick = () => {
    feedbackModal.classList.remove('hidden');
    // Hide sidebars on mobile if it was triggered
    if (window.innerWidth <= 768 && !bottomNav.classList.contains('hidden')) {
        // Nothing blocks, it overlays
    }
};
document.getElementById('close-feedback-btn').onclick = () => feedbackModal.classList.add('hidden');
document.getElementById('submit-feedback-btn').onclick = () => {
    feedbackModal.classList.add('hidden');
    showNotification("FEEDBACK RECEIVED", "Thank you! Your feedback helps us improve CareLink.");
};

// Notifications
function showNotification(title, body) {
    const overlay = document.getElementById('notification-overlay');
    document.getElementById('push-title').innerText = title;
    document.getElementById('push-body').innerText = body;

    // Set real time
    const d = new Date();
    document.getElementById('lock-time').innerText = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    document.getElementById('lock-date').innerText = d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

    overlay.classList.remove('hidden');
}
document.getElementById('notification-overlay').addEventListener('click', () => {
    document.getElementById('notification-overlay').classList.add('hidden');
});

// Chat Logic
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send-btn');
const chatContainer = document.getElementById('chat-container');
let messageQueue = [];
let isProcessingQueue = false;

function checkInputState() {
    sendBtn.disabled = chatInput.value.trim().length === 0;
}
chatInput.addEventListener('input', checkInputState);
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !sendBtn.disabled) handleSend();
});
sendBtn.addEventListener('click', handleSend);

// Quick Replies bindings
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', e => {
        chatInput.value = e.target.innerText;
        checkInputState();
        handleSend();
    });
});

function renderChat() {
    chatContainer.innerHTML = '';
    state.chatHistory.forEach(msg => appendMessageUI(msg));
    scrollToBottom();
}

function appendMessageUI(msg) {
    if (msg.role === 'typing') {
        const el = document.createElement('div');
        el.className = 'typing-indicator';
        el.id = 'typing-indicator';
        el.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        chatContainer.appendChild(el);
    } else {
        const el = document.createElement('div');
        el.className = `message ${msg.role}`;

        let timeHtml = '';
        if (msg.role === 'user') {
            timeHtml = `<div class="message-time">${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>`;
            el.innerHTML = `<div>${msg.text}</div>${timeHtml}`;
        } else {
            timeHtml = `<div class="message-time">Just now</div>`;
            el.innerHTML = `<div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:0.8rem;color:var(--teal-600);"><div class="avatar" style="width:20px;height:20px;font-size:0.7rem;"></div> CareLink</div><div>${msg.text}</div>${timeHtml}`;
        }
        chatContainer.appendChild(el);
    }
}

function scrollToBottom() {
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 50);
}

function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    checkInputState();

    const userMsg = { role: 'user', text };
    state.chatHistory.push(userMsg);
    appendMessageUI(userMsg);
    scrollToBottom();

    const responseText = processChatLogic(text);

    if (Array.isArray(responseText)) {
        responseText.forEach(r => messageQueue.push(r));
    } else {
        messageQueue.push(responseText);
    }

    processQueue();
}

function processChatLogic(text) {
    const lower = text.toLowerCase();
    const todayAppt = state.appts[0] || { doctor: 'your doctor', date: 'soon' };
    const patientDay = "Day 3";

    // Flow A — Care Plan
    if (lower.match(/care plan|recovery|what should i do|instructions/)) {
        return {
            text: `Hello Andrew! As you are on ${patientDay} of your post-cardiac arrest recovery, your primary focus should be resting and adhering to your medication regimen.\n\nHere is your detailed Care Plan Summary:\n• **Medications**: You must take your Lisinopril for blood pressure, Aspirin to prevent clotting, and Metoprolol twice daily.\n• **Diet**: Strict low-sodium diet (under 1500mg daily) to reduce heart strain.\n• **Activity**: Light walking around the house. Avoid lifting anything over 10 lbs.\n• **Appointments**: You have a critical follow-up with ${todayAppt.doctor} on ${todayAppt.date}.\n\nI am actively monitoring your vitals via your Apple Watch, and everything looks perfectly stable today. Would you like me to explain any specific part of this plan?`
        };
    }

    // Flow B — Medication
    if (lower.match(/lisinopril|medicine|medication|pill|drug/)) {
        return {
            text: `Lisinopril is an ACE inhibitor prescribed to relax your blood vessels, lowering your blood pressure and reducing the workload on your healing heart. Given your recent cardiac event, adhering to this 10mg daily dose at 8 PM is paramount.\n\nYou currently have 5 pills remaining. I can set a daily reminder at 8 PM, or I can contact your pharmacy for a refill. Which would you prefer?`,
            context: 'meds_reminder_offer'
        }
    }

    if ((lower.match(/yes|remind me|sure|reminder/)) && state.lastContext === 'meds_reminder_offer') {
        const med = state.meds[0]; // Lisinopril
        med.reminder = true;
        setTimeout(() => {
            showNotification("REMINDER SET", "Please take your medicine at 8 PM: Lisinopril 10mg.");
        }, 2500);
        return { text: "Consider it done. I've set a strict daily alarm for 8:00 PM on your devices. You'll receive an elevated notification linking straight to your tracker. I am always here to keep you on schedule.", context: 'none' };
    }

    // Flow C — Appointment
    if (lower.match(/appointment|book|schedule|follow up|doctor/)) {
        if (state.appts.length > 0) {
            return { text: `You are already securely booked for an in-person follow-up with ${state.appts[0].doctor} (${state.appts[0].spec}) on ${state.appts[0].date}.\n\nI've already linked this to your calendar and coordinated a ride. If this time no longer works, we can seamlessly reschedule to a different slot.` };
        }
        return {
            text: "Your discharge papers specifically ordered a cardiology follow-up in about 2 weeks. Shall I interface with Dr. Smith's scheduling system to find an open slot for you now?",
            context: 'booking_offer'
        }
    }

    // Flow D — Symptom (Nurse override)
    if (lower.match(/pain|feel|symptom|worry|not well|sick|dizzy|chest/)) {
        return {
            text: `Andrew, please listen to me carefully. Because you are only 3 days post-cardiac arrest, any symptoms of chest pain, severe dizziness, or shortness of breath require immediate medical attention.\n\n**If you are experiencing any of these severe signs right now, please call 911 immediately.**\n\nIf this is mild discomfort, I strongly recommend connecting with the hospital's on-call triage nurse right now so we can document this properly. May I connect you?`,
            context: 'nurse_offer'
        }
    }

    // Flow E — Lab Results
    if (lower.match(/lab|test|results|blood/)) {
        return { text: "I've reviewed the comprehensive metabolic panel sent over from your discharge. Your kidney function (creatinine and GFR) is perfectly normal. However, your potassium levels were slightly low at 3.4 mEq/L.\n\nDr. Smith has actually accounted for this in your current prescribed Lisinopril dosage. No direct action is required from you, but please continue eating potassium-rich foods like bananas or spinach. Would you like me to add a reminder to your calendar for your next blood draw?" };
    }

    // Flow F — Transport (V3)
    if (lower.match(/ride|transport|driver|uber|lyft/)) {
        const cardHtml = `
      <div class="transport-card">
        <div class="transport-map">🗺️</div>
        <div class="transport-details">
          <div style="font-weight:700;">Secure Medical Transport</div>
          <div style="font-size:0.85rem;color:var(--gray-600);margin-top:4px;">Sept 2, 10:45 AM pick-up • Non-emergency vehicle</div>
        </div>
      </div>
    `;
        return { text: `Absolutely. Since you shouldn't be driving yet, I've arranged a door-to-door transportation service to ${todayAppt.doctor}'s office. A vetted driver will arrive 45 minutes prior to your appointment. Does this vehicle need wheelchair accessibility?` + cardHtml, html: true };
    }

    // Flow G — Refill (V3)
    if (lower.match(/refill|stock|more/)) {
        return { text: "I monitor your medication levels closely. I see your Lisinopril is critically low (5 pills remaining). I have successfully transmitted a digital refill request to your registered CVS Pharmacy. They will text you once it's ready for delivery." };
    }

    // Flow H — Routing & Escalatation (V2)
    if (lower.match(/question|problem|escalate|help/)) {
        const ticketHtml = `
      <div class="ticket-card">
        <div class="ticket-title"><span>🩺</span> Care Team Escalation</div>
        <div class="ticket-subtitle">Ticket #842-A created. Dr. Smith's triage team will review your account context and reply within 24hrs.</div>
      </div>
    `;
        return { text: "I completely understand. Because your cardiac recovery requires precise medical oversight, I've bundled your vitals, recent activities, and this question into an escalated priority ticket for your care team." + ticketHtml, html: true };
    }

    // Fallback
    return { text: "That is an excellent question. While I track your specific vitals and care plan, I want to ensure you get the safest, most clinically accurate response regarding your cardiac recovery. I've logged this inquiry—would you like me to flag it directly to the Cardiology triage team for a formal review?" };
}

function processQueue() {
    if (isProcessingQueue || messageQueue.length === 0) return;
    isProcessingQueue = true;

    const responseDesc = messageQueue.shift();
    state.lastContext = responseDesc.context || 'none';

    // Typing indicator
    const typingMsg = { role: 'typing' };
    appendMessageUI(typingMsg);
    scrollToBottom();

    setTimeout(() => {
        // Remove typing
        const ti = document.getElementById('typing-indicator');
        if (ti) ti.remove();

        // Add actual msg
        const aiMsg = { role: 'ai', text: responseDesc.text };
        state.chatHistory.push(aiMsg);
        appendMessageUI(aiMsg);

        // Bind buttons if any
        if (responseDesc.html) {
            document.querySelectorAll('.chat-slot-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const slot = e.target.dataset.slot;
                    e.target.parentNode.innerHTML = `<div style="padding:10px;background:var(--teal-50);color:var(--teal-700);border-radius:8px;font-weight:600;">Selected: ${slot}</div>`;

                    // Apply to state
                    state.appts.push({
                        id: 1, doctor: 'Dr. Smith', spec: 'Primary Care', date: slot, type: 'Virtual', status: 'upcoming'
                    });

                    // Update task t3
                    const t = state.tasks.find(ts => ts.id === 't3');
                    if (t) t.completed = true;

                    messageQueue.push({
                        text: `Excellent! Your appointment with Dr. Smith is confirmed for ${slot}. You'll get a reminder the night before. Anything else I can help with?`
                    });
                    setTimeout(() => {
                        showNotification("REMINDER FOR APPOINTMENT", `You have an appointment with Dr. Smith at ${slot}.`);
                    }, 2500);

                    isProcessingQueue = false;
                    processQueue();
                });
            });
        }

        scrollToBottom();
        isProcessingQueue = false;
        processQueue();

    }, 1200); // 1.2s typing delay
}

// Initial Bootstrap
renderChat();
window.renderTimeline = function () {
    const calContainer = document.getElementById('timeline-calendar-container');
    const cardsContainer = document.getElementById('timeline-cards-container');
    if (!calContainer || !cardsContainer || !state.timeline) return;

    calContainer.innerHTML = '';
    cardsContainer.innerHTML = '';

    state.timeline.days.forEach(d => {
        const isSelected = d === state.timeline.selectedDay;
        const el = document.createElement('div');
        if (isSelected) {
            el.style = "min-width:60px; padding:1rem 0.5rem; text-align:center; border-radius:16px; background:var(--teal-600); color:white; box-shadow:0 6px 12px rgba(13,148,136,0.4); scroll-snap-align: start; cursor:pointer; transition:transform 0.2s;";
        } else {
            el.style = "min-width:60px; padding:1rem 0.5rem; text-align:center; border-radius:16px; background:var(--bg-app); border:1px solid var(--gray-200); color:var(--gray-500); scroll-snap-align: start; cursor:pointer; transition:transform 0.2s;";
            el.onmouseover = () => el.style.transform = "scale(1.05)";
            el.onmouseout = () => el.style.transform = "scale(1)";
        }
        el.onclick = () => {
            state.timeline.selectedDay = d;
            renderTimeline();
        };
        el.innerHTML = `
      <div style="font-size:0.75rem;font-weight:800;">DAY</div>
      <div style="font-size:1.3rem;font-weight:800;margin-top:4px;">${d}</div>
    `;
        calContainer.appendChild(el);
    });

    const cards = state.timeline.data[state.timeline.selectedDay];
    cardsContainer.innerHTML = `<h3 style="margin-bottom:1rem;color:var(--gray-800);">Day ${state.timeline.selectedDay} Agenda</h3>`;

    if (!cards || cards.length === 0) {
        cardsContainer.innerHTML += `<p style="color:var(--gray-500);font-size:0.9rem;">No specific instructions for this day.</p>`;
        return;
    }

    cards.forEach(c => {
        const el = document.createElement('div');
        el.className = 'card';
        el.style = `box-shadow:var(--shadow-md); margin-bottom:1rem; border-left:5px solid var(--teal-500); padding:1.25rem; opacity:${c.opacity || 1}; transition:transform 0.2s;`;
        el.innerHTML = `
       <div style="font-size:0.75rem;color:var(--teal-600);font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${c.block}</div>
       <h4 style="margin:0 0 6px 0;color:var(--gray-800);font-size:1.1rem;">${c.title}</h4>
       <p style="font-size:0.9rem;color:var(--gray-600);line-height:1.6;margin:0;">${c.desc}</p>
    `;
        cardsContainer.appendChild(el);
    });
}
