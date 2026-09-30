const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'elevate-secret-key-2026',
    resave: false,
    saveUninitialized: true
}));

const users = {};
const workouts = {};
const completedWorkouts = {};
const userProfiles = {};
const userMeasurements = {};
const coachingRequests = [];

const workoutTemplates = {
    upper: [
        { exercise: 'chest press', note: 'Bröst', sets: [{ set: '1', prev: '25 kg × 10', kg: 25, reps: 10, completed: false }, { set: '2', prev: '25 kg × 10', kg: 25, reps: 10, completed: false }, { set: '3', prev: '25 kg × 8', kg: 25, reps: 8, completed: false }] },
        { exercise: 'shoulder press', note: 'Axlar', sets: [{ set: '1', prev: '20 kg × 10', kg: 20, reps: 10, completed: false }, { set: '2', prev: '20 kg × 10', kg: 20, reps: 10, completed: false }, { set: '3', prev: '20 kg × 8', kg: 20, reps: 8, completed: false }] },
        { exercise: 'biceps', note: 'Armar', sets: [{ set: '1', prev: '14 kg × 12', kg: 14, reps: 12, completed: false }, { set: '2', prev: '14 kg × 10', kg: 14, reps: 10, completed: false }, { set: '3', prev: '14 kg × 10', kg: 14, reps: 10, completed: false }] },
        { exercise: 'triceps', note: 'Armar', sets: [{ set: '1', prev: '20 kg × 12', kg: 20, reps: 12, completed: false }, { set: '2', prev: '20 kg × 10', kg: 20, reps: 10, completed: false }, { set: '3', prev: '20 kg × 10', kg: 20, reps: 10, completed: false }] },
        { exercise: 'Lateral raise', note: 'Axlar', sets: [{ set: '1', prev: '10 kg × 12', kg: 10, reps: 12, completed: false }, { set: '2', prev: '10 kg × 12', kg: 10, reps: 12, completed: false }, { set: '3', prev: '10 kg × 10', kg: 10, reps: 10, completed: false }] },
        { exercise: 'pulldown', note: 'Rygg', sets: [{ set: '1', prev: '50 kg × 10', kg: 50, reps: 10, completed: false }, { set: '2', prev: '50 kg × 10', kg: 50, reps: 10, completed: false }, { set: '3', prev: '50 kg × 8', kg: 50, reps: 8, completed: false }] }
    ],
    lower: [
        { exercise: 'leg press', note: 'Ben', sets: [{ set: '1', prev: '120 kg × 10', kg: 120, reps: 10, completed: false }, { set: '2', prev: '120 kg × 10', kg: 120, reps: 10, completed: false }, { set: '3', prev: '120 kg × 10', kg: 120, reps: 10, completed: false }] },
        { exercise: 'leg extension', note: 'Framsida lår', sets: [{ set: '1', prev: '60 kg × 12', kg: 60, reps: 12, completed: false }, { set: '2', prev: '60 kg × 10', kg: 60, reps: 10, completed: false }, { set: '3', prev: '60 kg × 10', kg: 60, reps: 10, completed: false }] },
        { exercise: 'hamstring curls', note: 'Baksida lår', sets: [{ set: '1', prev: '45 kg × 12', kg: 45, reps: 12, completed: false }, { set: '2', prev: '45 kg × 10', kg: 45, reps: 10, completed: false }, { set: '3', prev: '45 kg × 10', kg: 45, reps: 10, completed: false }] },
        { exercise: 'calf raise', note: 'Vader', sets: [{ set: '1', prev: '50 kg × 15', kg: 50, reps: 15, completed: false }, { set: '2', prev: '50 kg × 15', kg: 50, reps: 15, completed: false }, { set: '3', prev: '50 kg × 12', kg: 50, reps: 12, completed: false }] }
    ],
    full: [
        { exercise: 'leg press', note: 'Ben', sets: [{ set: '1', prev: '120 kg × 10', kg: 120, reps: 10, completed: false }, { set: '2', prev: '120 kg × 10', kg: 120, reps: 10, completed: false }, { set: '3', prev: '120 kg × 10', kg: 120, reps: 10, completed: false }] },
        { exercise: 'chest press', note: 'Bröst', sets: [{ set: '1', prev: '25 kg × 10', kg: 25, reps: 10, completed: false }, { set: '2', prev: '25 kg × 10', kg: 25, reps: 10, completed: false }, { set: '3', prev: '25 kg × 8', kg: 25, reps: 8, completed: false }] },
        { exercise: 'pulldown', note: 'Rygg', sets: [{ set: '1', prev: '50 kg × 10', kg: 50, reps: 10, completed: false }, { set: '2', prev: '50 kg × 10', kg: 50, reps: 10, completed: false }, { set: '3', prev: '50 kg × 8', kg: 50, reps: 8, completed: false }] },
        { exercise: 'shoulder press', note: 'Axlar', sets: [{ set: '1', prev: '20 kg × 10', kg: 20, reps: 10, completed: false }, { set: '2', prev: '20 kg × 10', kg: 20, reps: 10, completed: false }, { set: '3', prev: '20 kg × 8', kg: 20, reps: 8, completed: false }] },
        { exercise: 'biceps', note: 'Armar', sets: [{ set: '1', prev: '14 kg × 12', kg: 14, reps: 12, completed: false }, { set: '2', prev: '14 kg × 10', kg: 14, reps: 10, completed: false }] }
    ]
};

function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Elevate - Logga In</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .card { background: #1e293b; padding: 30px; border-radius: 12px; width: 320px; border: 1px solid #334155; text-align: center; }
                .logo-box { border: 2px solid #ff5500; display: inline-block; padding: 4px 12px; font-weight: 900; color: #ff5500; letter-spacing: 2px; margin-bottom: 15px; text-decoration: none; }
                input, select { width: 100%; padding: 10px; margin: 8px 0 16px 0; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #fff; box-sizing: border-box; }
                button { width: 100%; padding: 12px; background: #ff5500; border: none; color: white; font-weight: bold; border-radius: 6px; cursor: pointer; }
                .link { text-align: center; margin-top: 15px; font-size: 0.9rem; }
                .link a { color: #ff5500; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="card">
                <a href="/login" class="logo-box">ELEVATE</a>
                <form action="/login" method="POST" style="text-align: left;">
                    <label>Användarnamn</label>
                    <input type="text" name="username" placeholder="Ange användarnamn" required>
                    <label>Lösenord</label>
                    <input type="password" name="password" placeholder="Ange lösenord" required>
                    <button type="submit">Logga In</button>
                </form>
                <div class="link">Har du inget konto? <a href="/register">Skapa konto här</a></div>
            </div>
        </body>
        </html>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (user && user.password === password) {
        req.session.user = { username, role: user.role, name: user.name };
        return res.redirect(user.role === 'admin' ? '/admin' : '/dashboard');
    }
    res.redirect('/login?error=1');
});

app.get('/register', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Elevate - Skapa Konto</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .card { background: #1e293b; padding: 30px; border-radius: 12px; width: 320px; border: 1px solid #334155; text-align: center; }
                .logo-box { border: 2px solid #ff5500; display: inline-block; padding: 4px 12px; font-weight: 900; color: #ff5500; letter-spacing: 2px; margin-bottom: 15px; text-decoration: none; }
                input, select { width: 100%; padding: 10px; margin: 8px 0 16px 0; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #fff; box-sizing: border-box; }
                button { width: 100%; padding: 12px; background: #16a34a; border: none; color: white; font-weight: bold; border-radius: 6px; cursor: pointer; }
                .link { text-align: center; margin-top: 15px; font-size: 0.9rem; }
                .link a { color: #ff5500; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="card">
                <a href="/login" class="logo-box">ELEVATE</a>
                <form action="/register" method="POST" style="text-align: left;">
                    <label>Namn</label>
                    <input type="text" name="name" placeholder="Ditt namn" required>
                    <label>Användarnamn</label>
                    <input type="text" name="username" placeholder="Välj användarnamn" required>
                    <label>Lösenord</label>
                    <input type="password" name="password" placeholder="Välj lösenord" required>
                    <label>Kontotyp</label>
                    <select name="role">
                        <option value="client">Klient</option>
                        <option value="admin">Admin / Tränare</option>
                    </select>
                    <button type="submit">Registrera Konto</button>
                </form>
                <div class="link">Har du redan ett konto? <a href="/login">Logga in här</a></div>
            </div>
        </body>
        </html>
    `);
});

app.post('/register', (req, res) => {
    const { name, username, password, role } = req.body;
    if (users[username]) return res.redirect('/register?error=1');

    users[username] = { name, password, role };
    if (role === 'client') {
        workouts[username] = { currentName: 'upperbody', data: JSON.parse(JSON.stringify(workoutTemplates.upper)) };
        userProfiles[username] = { notes: '' };
        userMeasurements[username] = { height: '', weight: '' };
        completedWorkouts[username] = [];
    }
    res.redirect('/login?registered=1');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/about', requireAuth, (req, res) => {
    res.send(renderClientLayout(req.session.user.name, `
        <div style="max-width: 600px; margin: 0 auto; background: #172133; padding: 28px; border-radius: 16px; border: 1px solid #2a364f; text-align: center;">
            <div style="border: 2px solid #ff5500; display: inline-block; padding: 6px 16px; font-weight: 900; color: #ff5500; letter-spacing: 3px; font-size: 1.4rem; margin-bottom: 15px;">ELEVATE</div>
            
            <h2 style="color: #38bdf8; font-size: 1.5rem; margin-top: 10px; margin-bottom: 10px;">Elevate is all about elevation to the next level.</h2>
            
            <p style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.6; margin-bottom: 25px;">
                Varje pass, varje set och varje repetition är en byggsten för din utveckling. Elevate skapades för att ge dig verktygen, strukturen och motivationen du behöver för att bryta dina gränser och nå dina mål.
            </p>

            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; border: 1px solid #3b4d6c; margin-bottom: 25px;">
                <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/g-jwWYX7Jlo" title="Motivation Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>

            <a href="/dashboard" style="display: inline-block; background: #ff5500; color: #fff; font-weight: bold; padding: 12px 28px; border-radius: 25px; text-decoration: none; transition: 0.2s;">Tillbaka till träningen 🔥</a>
        </div>
    `, 'about'));
});

// KLIENTSIDA: Dashboard för alla träningsscheman (vänsterställt)
app.get('/dashboard', requireAuth, (req, res) => {
    if (req.session.user.role === 'admin') return res.redirect('/admin');

    const username = req.session.user.username;
    const clientWorkout = workouts[username] || { currentName: 'upperbody', data: JSON.parse(JSON.stringify(workoutTemplates.upper)) };

    let exercisesHtml = clientWorkout.data.map((ex, exIndex) => {
        let setRows = ex.sets.map((s, setIndex) => `
            <tr>
                <td style="padding: 6px 4px; text-align: center; font-weight: bold; color: ${s.set === 'W' ? '#f59e0b' : '#f8fafc'};">${s.set}</td>
                <td style="padding: 6px 4px; text-align: center; color: #94a3b8; font-size: 0.85rem;">${s.prev}</td>
                <td style="padding: 6px 4px; text-align: center;"><input type="number" value="${s.kg}" style="width: 48px; background: #0d1527; border: 1px solid #2e3a52; color: #fff; text-align: center; padding: 4px; border-radius: 4px;"></td>
                <td style="padding: 6px 4px; text-align: center;"><input type="number" value="${s.reps}" style="width: 48px; background: #0d1527; border: 1px solid #2e3a52; color: #fff; text-align: center; padding: 4px; border-radius: 4px;"></td>
                <td style="padding: 6px 4px; text-align: center;">
                    <form action="/toggle-set" method="POST" style="margin: 0;">
                        <input type="hidden" name="exIndex" value="${exIndex}">
                        <input type="hidden" name="setIndex" value="${setIndex}">
                        <button type="submit" class="check-btn ${s.completed ? 'completed' : ''}">${s.completed ? '✓' : ''}</button>
                    </form>
                </td>
            </tr>
        `).join('');

        return `
            <div style="margin-bottom: 22px; text-align: center;">
                <h3 style="margin: 0 0 8px 0; color: #ffffff; font-size: 1.25rem; font-weight: 600; text-transform: lowercase;">${ex.exercise}</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 6px;">
                    <thead>
                        <tr style="color: #64748b; font-size: 0.7rem;">
                            <th>SET</th><th>PREV</th><th>KG</th><th>REPS</th><th>✓</th>
                        </tr>
                    </thead>
                    <tbody>${setRows}</tbody>
                </table>
                <form action="/add-set" method="POST" style="margin-top: 8px;">
                    <input type="hidden" name="exIndex" value="${exIndex}">
                    <button type="submit" style="background: transparent; border: 1px dashed #334155; color: #94a3b8; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">+ Add Set</button>
                </form>
            </div>
        `;
    }).join('');

    res.send(renderClientLayout(req.session.user.name, `
        <div>
            <!-- Mörkt kort vänsterställt som tidigare -->
            <div style="width: 320px; background: #0a0a0a; border: 2px solid #ffffff; padding: 24px 20px; box-sizing: border-box; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #222; padding-bottom: 10px;">
                    <h2 style="margin: 0; color: #ffffff; font-size: 1.4rem; font-weight: bold; text-transform: lowercase;">${clientWorkout.currentName}</h2>
                    <form action="/finish-workout" method="POST" style="margin:0;">
                        <button type="submit" style="background: #ff5500; border: none; color: white; padding: 6px 14px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; cursor: pointer;">Finish</button>
                    </form>
                </div>

                <form action="/select-workout" method="POST" id="workoutForm" style="margin-bottom: 25px; text-align: center;">
                    <select name="template" onchange="document.getElementById('workoutForm').submit()" style="width: 100%; padding: 8px; background: #121212; color: #fff; border: 1px solid #333; font-weight: 600; cursor: pointer; text-align-last: center;">
                        <option value="upper" ${clientWorkout.currentName.includes('upper') ? 'selected' : ''}>upperbody</option>
                        <option value="lower" ${clientWorkout.currentName.includes('lower') ? 'selected' : ''}>lowerbody</option>
                        <option value="full" ${clientWorkout.currentName.includes('full') ? 'selected' : ''}>fullbody</option>
                    </select>
                </form>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${exercisesHtml}
                </div>

            </div>
        </div>
    `, 'workout'));
});

app.get('/profile', requireAuth, (req, res) => {
    const username = req.session.user.username;
    const profile = userProfiles[username] || { notes: '' };

    res.send(renderClientLayout(req.session.user.name, `
        <div style="max-width: 520px; background: #172133; padding: 24px; border-radius: 14px; border: 1px solid #2a364f;">
            <h2 style="margin-top: 0; color: #ff5500;">📓 Min Anteckningsbok</h2>
            <p style="color: #94a3b8; font-size: 0.95rem;">Skriv ner dina framsteg, personbästan och tankar om träningen:</p>
            <form action="/save-profile" method="POST">
                <textarea name="notes" rows="10" style="width: 100%; background: #0d1527; border: 1px solid #2e3a52; color: #fff; padding: 12px; border-radius: 8px; box-sizing: border-box; font-family: inherit;" placeholder="Idag kändes träningen bra...">${profile.notes}</textarea>
                <button type="submit" style="margin-top: 15px; width: 100%; padding: 12px; background: #ff5500; border: none; color: white; font-weight: bold; border-radius: 8px; cursor: pointer;">Spara Anteckningar</button>
            </form>
        </div>
    `, 'profile'));
});

app.post('/save-profile', requireAuth, (req, res) => {
    const username = req.session.user.username;
    userProfiles[username] = { notes: req.body.notes };
    res.redirect('/profile');
});

app.get('/measure', requireAuth, (req, res) => {
    const username = req.session.user.username;
    const m = userMeasurements[username] || { height: '', weight: '' };

    res.send(renderClientLayout(req.session.user.name, `
        <div style="max-width: 520px; background: #172133; padding: 24px; border-radius: 14px; border: 1px solid #2a364f;">
            <h2 style="margin-top: 0; color: #ff5500;">📐 Kroppsmått</h2>
            <form action="/save-measure" method="POST">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; color: #cbd5e1;">Längd (cm)</label>
                    <input type="number" name="height" value="${m.height}" placeholder="t.ex. 175" style="width: 100%; padding: 10px; background: #0d1527; border: 1px solid #2e3a52; color: #fff; border-radius: 8px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 6px; color: #cbd5e1;">Vikt (kg)</label>
                    <input type="number" step="0.1" name="weight" value="${m.weight}" placeholder="t.ex. 72.5" style="width: 100%; padding: 10px; background: #0d1527; border: 1px solid #2e3a52; color: #fff; border-radius: 8px; box-sizing: border-box;">
                </div>
                <button type="submit" style="width: 100%; padding: 12px; background: #ff5500; border: none; color: white; font-weight: bold; border-radius: 8px; cursor: pointer;">Uppdatera Mått</button>
            </form>
        </div>
    `, 'measure'));
});

app.post('/save-measure', requireAuth, (req, res) => {
    const username = req.session.user.username;
    userMeasurements[username] = { height: req.body.height, weight: req.body.weight };
    res.redirect('/measure');
});

app.get('/history', requireAuth, (req, res) => {
    const username = req.session.user.username;
    const historyList = completedWorkouts[username] || [];

    let historyContent = historyList.length === 0
        ? '<p style="color: #94a3b8;">Inga avslutade pass ännu. Slutför ett pass för att se det här!</p>'
        : historyList.map((item) => `
            <div style="background: #0d1527; padding: 16px; border-radius: 10px; border: 1px solid #2e3a52; margin-bottom: 15px;">
                <h4 style="margin: 0 0 8px 0; color: #38bdf8;">${item.currentName} - ${item.date}</h4>
                <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 0.9rem;">
                    ${item.data.map(ex => `<li><strong>${ex.exercise}</strong>: ${ex.sets.filter(s => s.completed).length} set genomförda</li>`).join('')}
                </ul>
            </div>
        `).join('');

    res.send(renderClientLayout(req.session.user.name, `
        <div style="max-width: 520px; background: #172133; padding: 24px; border-radius: 14px; border: 1px solid #2a364f;">
            <h2 style="margin-top: 0; color: #ff5500;">🕒 Träningshistorik</h2>
            ${historyContent}
        </div>
    `, 'history'));
});

app.get('/coaching', requireAuth, (req, res) => {
    res.send(renderClientLayout(req.session.user.name, `
        <div style="max-width: 520px; background: #172133; padding: 24px; border-radius: 14px; border: 1px solid #2a364f;">
            <h2 style="margin-top: 0; color: #38bdf8;">💬 Ansök om 1-on-1 Coaching</h2>
            <p style="color: #cbd5e1; font-size: 0.95rem;">Skicka ett meddelande till din tränare för direkt feedback, teknikgranskning eller anpassade scheman.</p>
            <form action="/apply-coaching" method="POST">
                <textarea name="message" rows="5" style="width: 100%; background: #0d1527; border: 1px solid #2e3a52; color: #fff; padding: 10px; border-radius: 8px; box-sizing: border-box;" placeholder="Beskriv vad du behöver hjälp med..." required></textarea>
                <button type="submit" style="margin-top: 15px; width: 100%; padding: 12px; background: #0284c7; border: none; color: white; font-weight: bold; border-radius: 8px; cursor: pointer;">Skicka Ansökan till Tränaren</button>
            </form>
        </div>
    `, 'coaching'));
});

app.post('/apply-coaching', requireAuth, (req, res) => {
    coachingRequests.unshift({
        clientName: req.session.user.name,
        username: req.session.user.username,
        message: req.body.message,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    res.redirect('/coaching?sent=1');
});

app.post('/toggle-set', requireAuth, (req, res) => {
    const username = req.session.user.username;
    const { exIndex, setIndex } = req.body;
    const clientWorkout = workouts[username];
    if (clientWorkout && clientWorkout.data[exIndex] && clientWorkout.data[exIndex].sets[setIndex]) {
        const set = clientWorkout.data[exIndex].sets[setIndex];
        set.completed = !set.completed;
    }
    res.redirect('/dashboard');
});

app.post('/add-set', requireAuth, (req, res) => {
    const username = req.session.user.username;
    const { exIndex } = req.body;
    const clientWorkout = workouts[username];
    if (clientWorkout && clientWorkout.data[exIndex]) {
        const sets = clientWorkout.data[exIndex].sets;
        const lastSet = sets[sets.length - 1] || { kg: 20, reps: 10 };
        sets.push({ set: (sets.length + 1).toString(), prev: `${lastSet.kg} kg × ${lastSet.reps}`, kg: lastSet.kg, reps: lastSet.reps, completed: false });
    }
    res.redirect('/dashboard');
});

app.post('/select-workout', requireAuth, (req, res) => {
    const username = req.session.user.username;
    const templateKey = req.body.template;
    const names = { upper: 'upperbody', lower: 'lowerbody', full: 'fullbody' };
    if (workoutTemplates[templateKey]) {
        workouts[username] = { currentName: names[templateKey], data: JSON.parse(JSON.stringify(workoutTemplates[templateKey])) };
    }
    res.redirect('/dashboard');
});

app.post('/finish-workout', requireAuth, (req, res) => {
    const username = req.session.user.username;
    const clientWorkout = workouts[username];
    if (clientWorkout) {
        if (!completedWorkouts[username]) completedWorkouts[username] = [];
        completedWorkouts[username].unshift({
            currentName: clientWorkout.currentName,
            data: JSON.parse(JSON.stringify(clientWorkout.data)),
            date: new Date().toLocaleDateString()
        });
    }
    res.redirect('/history');
});

// ADMIN/TRÄNARSIDA
app.get('/admin', requireAuth, (req, res) => {
    if (req.session.user.role !== 'admin') return res.status(403).send('Åtkomst nekad!');

    let requestsHtml = coachingRequests.length === 0
        ? '<p style="color: #94a3b8;">Inga nya 1on1 ansökningar.</p>'
        : coachingRequests.map(r => `
            <div style="background: #0d1527; padding: 14px; border-radius: 8px; border-left: 4px solid #38bdf8; margin-bottom: 12px;">
                <div style="display:flex; justify-content: space-between;">
                    <strong style="color: #38bdf8;">${r.clientName} (@${r.username})</strong>
                    <span style="color: #64748b; font-size: 0.8rem;">${r.date}</span>
                </div>
                <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 0.95rem;">"${r.message}"</p>
            </div>
        `).join('');

    const clientUsers = Object.keys(users).filter(u => users[u].role === 'client');
    let clientsOverviewHtml = clientUsers.length === 0
        ? '<p style="color: #94a3b8;">Inga registrerade klienter ännu.</p>'
        : clientUsers.map(u => {
            const clientObj = users[u];
            const activeW = workouts[u] || { currentName: 'Inget aktivt pass', data: [] };
            const m = userMeasurements[u] || { height: '-', weight: '-' };
            const profile = userProfiles[u] || { notes: '' };
            const history = completedWorkouts[u] || [];

            let liveExercises = activeW.data.map(ex => {
                const totalSets = ex.sets.length;
                const completedSets = ex.sets.filter(s => s.completed).length;
                return `<div style="font-size:0.88rem; color:#cbd5e1; margin-top:4px;">
                    • <strong>${ex.exercise}</strong>: ${completedSets}/${totalSets} set avklarade ${completedSets === totalSets && totalSets > 0 ? '✅' : ''}
                </div>`;
            }).join('');

            return `
                <div class="client-card" data-username="${u}" data-name="${clientObj.name.toLowerCase()}" style="background: #172133; padding: 20px; border-radius: 12px; border: 1px solid #2a364f; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #ff5500;">👤 ${clientObj.name} <span style="color:#64748b; font-size:0.9rem;">(@${u})</span></h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; background: #0d1527; padding: 10px; border-radius: 8px;">
                        <div><strong>Längd:</strong> ${m.height || '-'} cm</div>
                        <div><strong>Vikt:</strong> ${m.weight || '-'} kg</div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <h4 style="margin:0 0 5px 0; color:#38bdf8;">🏋️ Pågående Pass (${activeW.currentName}):</h4>
                        ${liveExercises || '<p style="color:#64748b; font-size:0.85rem;">Inga övningar i passet.</p>'}
                    </div>

                    <div style="margin-bottom: 15px;">
                        <h4 style="margin:0 0 5px 0; color:#f59e0b;">📓 Klientens Anteckningar:</h4>
                        <p style="background: #0d1527; padding: 10px; border-radius: 6px; color: #cbd5e1; font-size: 0.88rem; margin: 0;">${profile.notes || 'Inga anteckningar ännu.'}</p>
                    </div>

                    <div>
                        <h4 style="margin:0 0 5px 0; color:#10b981;">🕒 Slutförda pass (${history.length} st):</h4>
                        <span style="font-size:0.85rem; color:#94a3b8;">Senaste passet: ${history[0] ? history[0].currentName + ' (' + history[0].date + ')' : 'Inget ännu'}</span>
                    </div>
                </div>
            `;
        }).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Elevate Admin</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f8fafc; margin: 0; display: flex; min-height: 100vh; }
                .sidebar { width: 280px; background: #111827; border-right: 1px solid #1f2937; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; }
                .logo-box { border: 2px solid #ff5500; padding: 6px 12px; font-weight: 900; color: #ff5500; letter-spacing: 2px; text-align: center; margin-bottom: 25px; text-decoration: none; display: block; }
                .search-box { margin-bottom: 20px; }
                .search-input { width: 100%; padding: 10px; background: #0d1527; border: 1px solid #2e3a52; color: #fff; border-radius: 8px; box-sizing: border-box; }
                
                .nav-menu { display: flex; flex-direction: column; gap: 8px; flex-grow: 1; }
                .nav-btn { background: transparent; border: none; color: #94a3b8; text-align: left; padding: 12px; font-size: 0.95rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: 0.2s; }
                .nav-btn:hover, .nav-btn.active { background: #1e293b; color: #ff5500; }
                
                .logout-link { color: #ef4444; text-decoration: none; font-weight: bold; padding: 12px; display: block; border-top: 1px solid #1f2937; margin-top: auto; }
                .main-content { flex-grow: 1; padding: 30px; overflow-y: auto; }
                .section { display: none; }
                .section.active { display: block; }
            </style>
        </head>
        <body>
            <div class="sidebar">
                <a href="/about" class="logo-box">ELEVATE ADMIN</a>
                <div class="search-box">
                    <input type="text" id="clientSearch" class="search-input" placeholder="🔍 Sök klient..." onkeyup="filterClients()">
                </div>
                <div class="nav-menu">
                    <button class="nav-btn active" onclick="switchTab('coaching', this)">📥 1on1 Coaching (${coachingRequests.length})</button>
                    <button class="nav-btn" onclick="switchTab('clients', this)">📊 Klienters Träning & Status (${clientUsers.length})</button>
                </div>
                <a href="/logout" class="logout-link">🚪 Logga ut</a>
            </div>

            <div class="main-content">
                <div id="section-coaching" class="section active">
                    <h2 style="margin-top: 0; color: #38bdf8;">📥 1on1 Coaching Förfrågningar</h2>
                    ${requestsHtml}
                </div>
                <div id="section-clients" class="section">
                    <h2 style="margin-top: 0; color: #ff5500;">📊 Klienternas Träning & Status</h2>
                    <div id="clientsList">
                        ${clientsOverviewHtml}
                    </div>
                </div>
            </div>

            <script>
                function switchTab(tabName, btn) {
                    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                    document.getElementById('section-' + tabName).classList.add('active');
                    btn.classList.add('active');
                }

                function filterClients() {
                    const query = document.getElementById('clientSearch').value.toLowerCase();
                    switchTab('clients', document.querySelectorAll('.nav-btn')[1]);
                    const cards = document.querySelectorAll('.client-card');
                    cards.forEach(card => {
                        const name = card.getAttribute('data-name');
                        const username = card.getAttribute('data-username');
                        if (name.includes(query) || username.includes(query)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            </script>
        </body>
        </html>
    `);
});

function renderClientLayout(name, contentHtml, activeTab) {
    return `
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Elevate</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f8fafc; margin: 0; padding-bottom: 80px; }
                .app-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; background: #111827; border-bottom: 1px solid #1f2937; }
                .logo-box { border: 2px solid #ff5500; padding: 4px 10px; font-weight: 900; color: #ff5500; letter-spacing: 2px; font-size: 1.1rem; text-decoration: none; cursor: pointer; transition: transform 0.1s; }
                .logo-box:hover { transform: scale(1.05); }
                
                .page-container { padding: 20px; text-align: left; }

                .coaching-btn { background: #38bdf8; color: #0f172a; font-weight: bold; border: none; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; }
                .coaching-btn:hover { background: #0284c7; color: #fff; }

                .check-btn { background: #1f2937; border: 1px solid #374151; color: white; width: 26px; height: 26px; border-radius: 4px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; margin: auto; font-size: 0.8rem; }
                .check-btn.completed { background: #10b981; border-color: #10b981; color: white; }

                .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #111827; border-top: 1px solid #1f2937; display: flex; justify-content: space-around; padding: 10px 0; }
                .nav-item { text-align: center; color: #94a3b8; text-decoration: none; font-size: 0.75rem; }
                .nav-item.active { color: #ff5500; }
                .nav-icon { font-size: 1.2rem; display: block; margin-bottom: 2px; }
            </style>
        </head>
        <body>
            <div class="app-header">
                <a href="/coaching" class="coaching-btn">💬 1on1 Coaching</a>
                <a href="/about" class="logo-box">ELEVATE</a>
                <a href="/logout" style="color: #cbd5e1; text-decoration: none; font-size: 0.9rem;">Logga ut</a>
            </div>

            <div class="page-container">
                ${contentHtml}
            </div>

            <div class="bottom-nav">
                <a href="/profile" class="nav-item ${activeTab === 'profile' ? 'active' : ''}"><span class="nav-icon">👤</span> Profile</a>
                <a href="/history" class="nav-item ${activeTab === 'history' ? 'active' : ''}"><span class="nav-icon">🕒</span> History</a>
                <a href="/dashboard" class="nav-item ${activeTab === 'workout' ? 'active' : ''}"><span class="nav-icon">➕</span> Workout</a>
                <a href="/measure" class="nav-item ${activeTab === 'measure' ? 'active' : ''}"><span class="nav-icon">📐</span> Measure</a>
            </div>
        </body>
        </html>
    `;
}

app.get('/', (req, res) => res.redirect('/login'));

app.listen(PORT, () => console.log(`Elevate running on port ${PORT}`));
