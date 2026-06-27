/* ============================================================
   Scanline — ATS Resume Builder  |  app.js
   ============================================================ */
/* ============================================================
   AUTH & USER SYSTEM (localStorage)
   ============================================================ */
const AUTH_KEY   = 'scanline_users';
const SESSION_KEY= 'scanline_session';
const RESUMES_KEY= 'scanline_resumes';

let authState = {
  user: null,          // {id, name, email, createdAt}
    if(session){
    try{
      const s = JSON.parse(session);
      const users = getUsers();
      const user = users.find(u=>u.id===s.userId);
      if(user){
        authState.user = user;
        authState.apiKey = null;
      }
function saveUsers(users){ localStorage.setItem(AUTH_KEY, JSON.stringify(users)); }

function authSignup(name, email, password){
  if(!name.trim()||!email.trim()||!password) return 'All fields are required.';
  if(password.length<6) return 'Password must be at least 6 characters.';
  const users = getUsers();
  if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())) return 'An account with that email already exists.';
  const user = {
    id: 'u_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
    name: name.trim(), email: email.trim().toLowerCase(),
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
    resumeCount: 0, }

function authLogout(){
  authState.user = null;
  authState.  state.screen = 'welcome';
  renderApp();
}

function simpleHash(str){
  // Simple deterministic hash (not cryptographic — fine for a local demo)
  let hash = 5381;
  for(let i=0;i<str.length;i++) hash = ((hash<<5)+hash)^str.charCodeAt(i);
  return (hash>>>0).toString(16);
}

/* ---------- Resume Storage ---------- */
function getUserResumes(){
  if(!authState.user) return [];
  try{
    const all = JSON.parse(localStorage.getItem(RESUMES_KEY)||'{}');
    return all[authState.user.id] || [];
  }catch(e){ return []; }
}

function saveCurrentResume(){
  if(!authState.user) return;
  const resumes = getUserResumes();
  const name = state.data.personal.fullName || 'Untitled Resume';
  const now = new Date().toISOString();
  if(state.currentResumeId){
    const idx = resumes.findIndex(r=>r.id===state.currentResumeId);
    if(idx>-1){
      resumes[idx] = {...resumes[idx], name, data:state.data, templateId:state.templateId, updatedAt:now};
    } else {
      resumes.push({id:state.currentResumeId, name, data:state.data, templateId:state.templateId, createdAt:now, updatedAt:now});
    }
  } else {
    const id = 'r_'+Date.now();
    state.currentResumeId = id;
    resumes.push({id, name, data:state.data, templateId:state.templateId, createdAt:now, updatedAt:now});
  }
  const all = JSON.parse(localStorage.getItem(RESUMES_KEY)||'{}');
  all[authState.user.id] = resumes;
  localStorage.setItem(RESUMES_KEY, JSON.stringify(all));
  // Update user resume count
  const users = getUsers();
  const ui = users.findIndex(u=>u.id===authState.user.id);
  if(ui>-1){ users[ui].resumeCount = resumes.length; saveUsers(users); authState.user = users[ui]; }
  showToast('Resume saved to your account.', 'ok');
}

function loadResume(resume){
  state.data = resume.data;
  state.templateId = resume.templateId || 'classic';
  state.currentResumeId = resume.id;
  state.screen = 'wizard';
  state.stepIndex = 0;
  renderApp();
}

function deleteResume(resumeId){
  if(!confirm('Delete this resume? This cannot be undone.')) return;
  const all = JSON.parse(localStorage.getItem(RESUMES_KEY)||'{}');
  all[authState.user.id] = (all[authState.user.id]||[]).filter(r=>r.id!==resumeId);
  localStorage.setItem(RESUMES_KEY, JSON.stringify(all));
  const users = getUsers();
  const ui = users.findIndex(u=>u.id===authState.user.id);
  if(ui>-1){ users[ui].resumeCount = all[authState.user.id].length; saveUsers(users); authState.user = users[ui]; }
  renderApp();
}

function saveApiKey(key){
  authState.apiKey = key.trim();
  const users = getUsers();
  const ui = users.findIndex(u=>u.id===authState.user.id);
  if(ui>-1){ users[ui].apiKey = key.trim(); saveUsers(users); authState.user = users[ui]; }
  showToast('API key saved.', 'ok');
}

/* ---------- Auth Modal handlers ---------- */
function openAuthModal(mode){
  authState.showModal = true;
  authState.modalMode = mode||'login';
  authState.modalError = '';
  authState.showDropdown = false;
  renderApp();
}
function closeAuthModal(){
  authState.showModal = false;
  authState.modalError = '';
  renderApp();
}
function switchAuthMode(mode){
  authState.modalMode = mode;
  authState.modalError = '';
  renderApp();
}

function handleAuthSubmit(){
  const mode = authState.modalMode;
  if(mode==='signup'){
    const name  = document.getElementById('authName')?.value||'';
    const email = document.getElementById('authEmail')?.value||'';
    const pass  = document.getElementById('authPass')?.value||'';
    const err = authSignup(name, email, pass);
    if(err){ authState.modalError=err; renderApp(); return; }
  } else {
    const email = document.getElementById('authEmail')?.value||'';
    const pass  = document.getElementById('authPass')?.value||'';
    const err = authLogin(email, pass);
    if(err){ authState.modalError=err; renderApp(); return; }
  }
  authState.showModal = false;
  authState.modalError = '';
  renderApp();
  showToast('Welcome, '+authState.user.name+'!', 'ok');
}

function toggleDropdown(){
  authState.showDropdown = !authState.showDropdown;
  renderApp();
}

/* ---------- Auth Modal HTML ---------- */
function authModalHTML(){
  if(!authState.showModal) return '';
  const isSignup = authState.modalMode==='signup';
  return '<div class="auth-overlay" onclick="closeAuthModal()">'
    +'<div class="auth-modal" onclick="event.stopPropagation()">'
    +'<button class="auth-close" onclick="closeAuthModal()">×</button>'
    +'<h2>'+(isSignup?'Create account':'Welcome back')+'</h2>'
    +'<p>'+(isSignup?'Sign up to save resumes and track your progress.':'Log in to access your saved resumes.')+'</p>'
    +(authState.modalError?'<div class="auth-error">'+esc(authState.modalError)+'</div>':'')
    +(isSignup?'<div class="auth-field"><label>Full name</label><input id="authName" type="text" placeholder="Jordan Avery" autocomplete="name"></div>':'')
    +'<div class="auth-field"><label>Email</label><input id="authEmail" type="email" placeholder="you@email.com" autocomplete="email"></div>'
    +'<div class="auth-field"><label>Password</label><input id="authPass" type="password" placeholder="'+(isSignup?'Min 6 characters':'Your password')+'" autocomplete="'+(isSignup?'new-password':'current-password')+'"></div>'
    +'<button class="btn-primary" style="width:100%;margin-top:4px;" onclick="handleAuthSubmit()">'+(isSignup?'Create account':'Log in')+'</button>'
    +'<div class="auth-switch">'+(isSignup?'Already have an account? <button onclick="switchAuthMode(\'login\')" class="btn-text">Log in</button>':'No account? <button onclick="switchAuthMode(\'signup\')" class="btn-text">Sign up free</button>')+'</div>'
    +'</div></div>';
}

/* ---------- Topbar user area HTML ---------- */
function topbarUserHTML(){
  if(!authState.user){
    return '<div class="topbar-user">'
      +'<button class="btn-secondary" style="padding:7px 14px;font-size:13px;" onclick="openAuthModal(\'login\')">Log in</button>'
      +'<button class="btn-primary" style="padding:7px 14px;font-size:13px;" onclick="openAuthModal(\'signup\')">Sign up</button>'
      +'</div>';
  }
  const initials = authState.user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const resumes = getUserResumes();
  const dropdown = authState.showDropdown
    ? '<div class="user-dropdown">'
      +'<div class="user-dropdown-head"><div class="user-dropdown-name">'+esc(authState.user.name)+'</div><div class="user-dropdown-email">'+esc(authState.user.email)+'</div></div>'
      +'<button class="user-dropdown-item" onclick="authState.showDropdown=false;state.screen="dashboard";renderApp()">📊 Dashboard ('+resumes.length+' resumes)</button>'
      +'<button class="user-dropdown-item" onclick="saveCurrentResume();authState.showDropdown=false;renderApp()">💾 Save current resume</button>'
      +'<button class="user-dropdown-item" onclick="authState.showDropdown=false;state.screen="dashboard";renderApp()">⚙️ API key settings</button>'
      +'<button class="user-dropdown-item danger" onclick="authLogout()">← Log out</button>'
      +'</div>'
    : '';
  return '<div class="topbar-user"><div class="user-menu"><div class="user-avatar" onclick="toggleDropdown()" title="'+esc(authState.user.name)+'">'+initials+'</div>'+dropdown+'</div></div>';
}

/* ---------- Dashboard screen ---------- */
function dashboardTemplate(){
  const user = authState.user;
  const resumes = getUserResumes();
  const joined = new Date(user.createdAt).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'});
  const lastEdit = resumes.length ? new Date(Math.max(...resumes.map(r=>new Date(r.updatedAt)))).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}) : '—';

  let resumeRows = resumes.length
    ? resumes.slice().reverse().map(r=>{
        const updated = new Date(r.updatedAt).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'});
        return '<div class="dash-resume-row" onclick="loadResume('+JSON.stringify(r).replace(/"/g,'&quot;')+')">'
          +'<div class="dash-resume-icon">📄</div>'
          +'<div class="dash-resume-info"><div class="dash-resume-name">'+esc(r.name||'Untitled')+'</div><div class="dash-resume-meta">Template: '+esc(r.templateId||'classic')+' · Last edited '+updated+'</div></div>'
          +'<div class="dash-resume-actions">'
          +'<button class="btn-primary" style="padding:7px 14px;font-size:12px;" onclick="event.stopPropagation();loadResume('+JSON.stringify(r).replace(/"/g,'&quot;')+')">Edit</button>'
          +'<button class="btn-secondary" style="padding:7px 12px;font-size:12px;color:var(--danger);border-color:var(--danger);" onclick="event.stopPropagation();deleteResume("+r.id+")">Delete</button>'
          +'</div></div>';
      }).join('')
    : '<div class="dash-empty">No resumes saved yet. Build one and hit 💾 Save!</div>';

  const apiKeyField = '<div class="apikey-section">'
    +'';

  return '<section class="dashboard">'
    +'<div class="welcome-meta">MY ACCOUNT</div>'
    +'<h1>Welcome back, '+esc(user.name.split(' ')[0])+'</h1>'
    +'<p style="color:var(--ink-soft);font-size:14px;">Member since '+joined+'</p>'
    +'<div class="dash-stats">'
    +'<div class="dash-stat"><div class="dash-stat-num">'+resumes.length+'</div><div class="dash-stat-label">Resumes saved</div></div>'
    +'<div class="dash-stat"><div class="dash-stat-num">'+lastEdit+'</div><div class="dash-stat-label">Last edited</div></div>'
    +'<div class="dash-stat"><div class="dash-stat-num">'+(authState.apiKey?'✓':'—')+'</div><div class="dash-stat-label">API key set</div></div>'
    +'</div>'
    +'<div class="dash-resumes"><h3>Your Resumes</h3>'+resumeRows+'</div>'
    +'<div style="margin-top:16px;"><button class="btn-primary" onclick="state.screen="welcome";state.currentResumeId=null;state.data=defaultData();renderApp()">+ Build new resume</button>'
    +' <button class="btn-secondary" style="margin-left:12px;" onclick="state.screen="welcome";renderApp()">← Back</button></div>'
    + apiKeyField
    +'</section>';
}

/* ---------- Init auth on load ---------- */
authInit();

/* ============================================================
   STATE
   ============================================================ */
const STEPS = [
  {key:'personal', label:'Personal Info'},
  {key:'summary', label:'Summary'},
  {key:'education', label:'Education'},
  {key:'experience', label:'Experience'},
  {key:'projects', label:'Projects'},
  {key:'certifications', label:'Certifications'},
  {key:'skills', label:'Skills'},
  {key:'additional', label:'Additional'},
  {key:'review', label:'Review & Export'}
];

function defaultData(){
  return {
    personal:{fullName:'',email:'',phone:'',address:'',linkedin:'',portfolio:'',targetRole:''},
    summary:'',
    education:[{degree:'',institution:'',location:'',startDate:'',endDate:'',gpa:''}],
    experience:[{title:'',company:'',location:'',startDate:'',endDate:'',current:false,bullets:['']}],
    projects:[],
    certifications:[],
    skills:'',
    additional:{languages:'',other:'',awards:[],volunteer:[]},
    additionalEnabled:{languages:false,awards:false,volunteer:false,other:false}
  };
}

let state = {
  screen:'welcome',       // 'welcome' | 'import' | 'wizard'
  mobileView:'edit',      // 'edit' | 'preview'
  stepIndex:0,
  data: defaultData(),
  importText:'',
  importError:'',
  importTab:'upload',
  uploadedFileName:'',
  templateId:'classic',

};

/* ============================================================
   HELPERS
   ============================================================ */
function esc(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function getPath(obj, path){
  return path.split('.').reduce((o,k)=> (o==null? undefined : o[k]), obj);
}
function setPath(obj, path, value){
  const keys = path.split('.');
  let o = obj;
  for(let i=0;i<keys.length-1;i++){ o = o[keys[i]]; }
  o[keys[keys.length-1]] = value;
}


function showToast(msg, type){
  const root = document.getElementById('toastRoot');
  const div = document.createElement('div');
  div.className = 'toast ' + (type||'');
  div.textContent = msg;
  root.appendChild(div);
  setTimeout(()=>{ div.classList.add('out'); setTimeout(()=>div.remove(), 300); }, 3400);
}

/* ============================================================
   DATA MUTATORS (called from inline handlers)
   ============================================================ */
function setVal(path, value){ setPath(state.data, path, value); renderPreview(); }
function setBullets(idx, text){ state.data.experience[idx].bullets = text.split('\n'); renderPreview(); }
function toggleCurrent(idx, checked){
  state.data.experience[idx].current = checked;
  if(checked){ state.data.experience[idx].endDate = 'Present'; }
  else if(state.data.experience[idx].endDate === 'Present'){ state.data.experience[idx].endDate = ''; }
  renderApp();
}
function toggleAdditional(key, val){ state.data.additionalEnabled[key] = val; renderApp(); }

const ENTRY_TEMPLATES = {
  education: ()=>({degree:'',institution:'',location:'',startDate:'',endDate:'',gpa:''}),
  experience: ()=>({title:'',company:'',location:'',startDate:'',endDate:'',current:false,bullets:['']}),
  projects: ()=>({name:'',description:'',tech:'',link:''}),
  certifications: ()=>({name:'',issuer:'',date:''}),
  'additional.awards': ()=>({title:'',date:''}),
  'additional.volunteer': ()=>({role:'',organization:'',date:'',description:''})
};
function addEntry(section){
  const arr = getPath(state.data, section);
  arr.push(ENTRY_TEMPLATES[section]());
  renderApp();
}
function removeEntry(section, idx){
  const arr = getPath(state.data, section);
  arr.splice(idx,1);
  renderApp();
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function validatePersonal(){
  return !!(state.data.personal.fullName.trim() && state.data.personal.email.trim());
}
function scrollFormTop(){
  const el = document.querySelector('.form-pane-body');
  if(el) el.scrollTop = 0;
  window.scrollTo(0,0);
}
function nextStep(){
  if(state.stepIndex===0 && !validatePersonal()){
    showToast('Add at least your name and email to continue.', 'warn');
    return;
  }
  if(state.stepIndex < STEPS.length-1){ state.stepIndex+renderApp(); scrollFormTop(); }
}
function prevStep(){ if(state.stepIndex>0){ state.stepIndex--; renderApp(); scrollFormTop(); } }
function goToStep(i){ state.stepIndex=i; renderApp(); scrollFormTop(); }
function setMobileView(v){ state.mobileView=v; renderApp(); }
/* ============================================================
   FILE UPLOAD HELPERS
   ============================================================ */
function setImportTab(tab){
  state.importTab = tab;
  state.importError = '';
  renderApp();
}

function handleDragOver(e){
  e.preventDefault();
  const z = document.getElementById('uploadZone');
  if(z) z.classList.add('drag-over');
}
function handleDragLeave(e){
  const z = document.getElementById('uploadZone');
  if(z) z.classList.remove('drag-over');
}
function handleFileDrop(e){
  e.preventDefault();
  const z = document.getElementById('uploadZone');
  if(z) z.classList.remove('drag-over');
  const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if(file) processFile(file);
}
function handleFileSelect(e){
  const file = e.target.files && e.target.files[0];
  if(file) processFile(file);
}

async function processFile(file){
  const name = file.name;
  const ext = name.split('.').pop().toLowerCase();
  state.importError = '';
  state.uploadedFileName = name;
  state.aiBusy.fileread = true;
  renderApp();
  try{
    let text = '';
    if(ext === 'txt' || ext === 'rtf'){
      text = await readAsText(file);
    } else if(ext === 'pdf'){
      text = await extractTextFromPDF(file);
    } else if(ext === 'docx' || ext === 'doc'){
      text = await extractTextFromDocx(file);
    } else {
      throw new Error('Unsupported file type. Please use PDF, DOCX, or TXT.');
    }
    state.importText = text.trim();
    state.aiBusy.fileread = false;
    renderApp();
    showToast('File read — hit "Extract my details" to continue.', 'ok');
  } catch(err){
    state.aiBusy.fileread = false;
    state.importError = err.message || 'Could not read the file. Try copying and pasting the text instead.';
    renderApp();
  }
}

function readAsText(file){
  return new Promise((res, rej)=>{
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = () => rej(new Error('Could not read file.'));
    r.readAsText(file);
  });
}

async function extractTextFromPDF(file){
  // Load pdf.js from CDN
  if(!window.pdfjsLib){
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({data: arrayBuffer}).promise;
  let fullText = '';
  for(let i = 1; i <= pdf.numPages; i++){
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n';
  }
  if(!fullText.trim()) throw new Error('Could not extract text from this PDF. It may be image-based (scanned). Try copying text from it manually.');
  return fullText;
}

async function extractTextFromDocx(file){
  // Load mammoth.js from CDN
  if(!window.mammoth){
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
  }
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({arrayBuffer});
  if(!result.value.trim()) throw new Error('Could not extract text from this Word file.');
  return result.value;
}

function loadScript(src){
  return new Promise((res, rej)=>{
    if(document.querySelector('script[src="'+src+'"]')){ res(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = res;
    s.onerror = ()=>rej(new Error('Failed to load '+src));
    document.head.appendChild(s);
  });
}

function goImport(){ state.screen="import"; renderApp(); }
function goBlank(){ state.data=defaultData(); state.screen="wizard"; state.stepIndex=0; renderApp(); }
function confirmStartOver(){
  if(confirm("Start over? This clears everything you've entered.")){
    state = {screen:'welcome', mobileView:'edit', stepIndex:0, data:defaultData(), importText:'', importError:'', importTab:'upload', uploadedFileName:'', templateId:'classic'};
    renderApp();
  }
}


function extractJson(text){
  let t = text.trim().replace(/^```json/i,'').replace(/^```/,'').replace(/```$/,'').trim();
  try{ return JSON.parse(t); }catch(e){}
  const first = t.indexOf('{'); const last = t.lastIndexOf('}');
  if(first!==-1 && last!==-1){
    try{ return JSON.parse(t.slice(first, last+1)); }catch(e){}
  }
  throw new Error('Could not parse AI response');
}


function mergeParsed(parsed){
  const d = defaultData();
  const p = parsed.personal || {};
  Object.assign(d.personal, {
    fullName:p.fullName||'', email:p.email||'', phone:p.phone||'', address:p.address||'',
    linkedin:p.linkedin||'', portfolio:p.portfolio||'', targetRole:p.targetRole||''
  });
  d.summary = parsed.summary || '';
  if(Array.isArray(parsed.education) && parsed.education.length){
    d.education = parsed.education.map(e=>({degree:e.degree||'',institution:e.institution||'',location:e.location||'',startDate:e.startDate||'',endDate:e.endDate||'',gpa:e.gpa||''}));
  }
  if(Array.isArray(parsed.experience) && parsed.experience.length){
    d.experience = parsed.experience.map(e=>({
      title:e.title||'', company:e.company||'', location:e.location||'', startDate:e.startDate||'', endDate:e.endDate||'',
      current: !!e.current, bullets:(Array.isArray(e.bullets) && e.bullets.filter(Boolean).length) ? e.bullets.filter(Boolean) : ['']
    }));
  }
  if(Array.isArray(parsed.projects) && parsed.projects.length){
    d.projects = parsed.projects.map(x=>({name:x.name||'',description:x.description||'',tech:x.tech||'',link:x.link||''}));
  }
  if(Array.isArray(parsed.certifications) && parsed.certifications.length){
    d.certifications = parsed.certifications.map(x=>({name:x.name||'',issuer:x.issuer||'',date:x.date||''}));
  }
  d.skills = Array.isArray(parsed.skills) ? parsed.skills.filter(Boolean).join(', ') : (parsed.skills||'');
  const a = parsed.additional || {};
  d.additional.languages = Array.isArray(a.languages) ? a.languages.filter(Boolean).join(', ') : (a.languages||'');
  d.additional.other = a.other || '';
  d.additional.awards = (Array.isArray(a.awards) && a.awards.length) ? a.awards.map(x=>({title:x.title||'',date:x.date||''})) : [];
  d.additional.volunteer = (Array.isArray(a.volunteer) && a.volunteer.length) ? a.volunteer.map(x=>({role:x.role||'',organization:x.organization||'',date:x.date||'',description:x.description||''})) : [];
  d.additionalEnabled = {
    languages: !!d.additional.languages,
    awards: d.additional.awards.length>0,
    volunteer: d.additional.volunteer.length>0,
    other: !!d.additional.other
  };
  return d;
}

function handleImportSubmit(){
  const ta = document.getElementById('importTextarea');
  const text = ta ? ta.value.trim() : (state.importText || '');
  if(!text){
    state.importError = state.importTab === 'upload'
      ? 'Upload a file first — or switch to "Paste Text" to paste manually.'
      : 'Paste some resume text first — or skip to fill it in manually.';
    renderApp();
    return;
  }
  // Store raw text in summary field so user can edit it manually
  state.data.summary = text.substring(0, 800);
  showToast('Text loaded! Fill in your details in each section.', 'ok');
  state.screen = 'wizard';
  state.stepIndex = 0;
  renderApp();
}


/* ============================================================
   FIELD TEMPLATE HELPERS
   ============================================================ */
function textField(opts){
  const {label, path, value, placeholder='', type='text', required=false, help=''} = opts;
  return '<label class="field">'
    + '<span class="field-label">'+esc(label)+(required?' <span class="req">*</span>':'')+'</span>'
    + '<input type="'+type+'" value="'+esc(value)+'" placeholder="'+esc(placeholder)+'" oninput="setVal(\''+path+'\', this.value)" />'
    + (help? '<span class="field-help">'+esc(help)+'</span>' : '')
    + '</label>';
}
function textareaField(opts){
  const {label, value, rows=4, placeholder='', help='', oninputFn, path} = opts;
  const handler = oninputFn || ("setVal('"+path+"', this.value)");
  return '<label class="field">'
    + '<span class="field-label">'+esc(label)+'</span>'
    + '<textarea rows="'+rows+'" placeholder="'+esc(placeholder)+'" oninput="'+handler+'">'+esc(value)+'</textarea>'
    + (help? '<span class="field-help">'+esc(help)+'</span>' : '')
    + '</label>';
}
function removeBtn(section, idx){
  return '<button class="btn-remove" onclick="removeEntry(\''+section+'\', '+idx+')">Remove</button>';
}

/* ============================================================
   STEP TEMPLATES
   ============================================================ */
function stepPersonal(){
  const p = state.data.personal;
  return '<div class="step-head"><h2>Personal info</h2><p>The basics every ATS and recruiter looks for first.</p></div>'
    + '<div class="field-grid">'
    + textField({label:'Full name', path:'personal.fullName', value:p.fullName, placeholder:'Jordan Avery', required:true})
    + textField({label:'Email', path:'personal.email', value:p.email, placeholder:'jordan@email.com', type:'email', required:true})
    + textField({label:'Phone', path:'personal.phone', value:p.phone, placeholder:'(555) 012-3344', type:'tel'})
    + textField({label:'Location', path:'personal.address', value:p.address, placeholder:'Dehradun, Uttarakhand'})
    + textField({label:'LinkedIn', path:'personal.linkedin', value:p.linkedin, placeholder:'linkedin.com/in/jordanavery'})
    + textField({label:'Portfolio / website', path:'personal.portfolio', value:p.portfolio, placeholder:'jordanavery.dev'})
    + '</div>'
    + textField({label:'Target job title (optional)', path:'personal.targetRole', value:p.targetRole, placeholder:'e.g. Backend Engineer', help:"Used only to tailor the AI suggestions later. Leave blank if you're not sure."});
}

function stepSummary(){
  const d = state.data;
  return '<div class="step-head"><h2>Professional summary</h2><p>2–3 sentences that frame who you are and the impact you bring. Optional, but recommended.</p></div>'
    + textareaField({label:'Summary', value:d.summary, rows:6, placeholder:'Results-driven product manager with 5+ years…', oninputFn:"setVal('summary', this.value)"})
}

function eduCard(e, idx){
  const many = state.data.education.length>1;
  return '<div class="entry-card">'
    + '<div class="entry-card-head"><span class="entry-num">EDU '+String(idx+1).padStart(2,'0')+'</span>'+(many?removeBtn('education',idx):'')+'</div>'
    + '<div class="field-grid">'
    + textField({label:'Degree & field', path:'education.'+idx+'.degree', value:e.degree, placeholder:'B.S. Computer Science'})
    + textField({label:'Institution', path:'education.'+idx+'.institution', value:e.institution, placeholder:'University of Delhi'})
    + textField({label:'Location', path:'education.'+idx+'.location', value:e.location, placeholder:'Delhi, India'})
    + textField({label:'GPA (optional)', path:'education.'+idx+'.gpa', value:e.gpa, placeholder:'8.7 / 10'})
    + textField({label:'Start date', path:'education.'+idx+'.startDate', value:e.startDate, placeholder:'Aug 2018'})
    + textField({label:'End date', path:'education.'+idx+'.endDate', value:e.endDate, placeholder:'May 2022'})
    + '</div></div>';
}
function stepEducation(){
  const d = state.data;
  return '<div class="step-head"><h2>Education</h2><p>Most recent first.</p></div>'
    + d.education.map((e,i)=>eduCard(e,i)).join('')
    + '<button class="btn-secondary btn-add" onclick="addEntry(\'education\')">+ Add education</button>';
}

function expCard(e, idx){
  const many = state.data.experience.length>1;
  return '<div class="entry-card">'
    + '<div class="entry-card-head"><span class="entry-num">ROLE '+(idx+1)+'</span>'+(many?removeBtn('experience',idx):'')+'</div>'
    + '<div class="field-grid">'
    + textField({label:'Job title', path:'experience.'+idx+'.title', value:e.title, placeholder:'Senior Software Engineer'})
    + textField({label:'Company', path:'experience.'+idx+'.company', value:e.company, placeholder:'Acme Corp'})
    + textField({label:'Location', path:'experience.'+idx+'.location', value:e.location, placeholder:'Remote'})
    + textField({label:'Start date', path:'experience.'+idx+'.startDate', value:e.startDate, placeholder:'Jan 2021'})
    + '<label class="field"><span class="field-label">End date</span>'
      + '<input type="text" value="'+esc(e.endDate)+'" placeholder="Present" '+(e.current?'disabled':'')+' oninput="setVal(\'experience.'+idx+'.endDate\', this.value)" /></label>'
    + '<label class="field checkbox-field"><input type="checkbox" '+(e.current?'checked':'')+' onchange="toggleCurrent('+idx+', this.checked)" /><span>I currently work here</span></label>'
    + '</div>'
    + textareaField({label:'Key achievements (one per line)', value:e.bullets.join('\n'), rows:5, placeholder:'Led migration to microservices, cutting deploy time 40%', oninputFn:"setBullets("+idx+", this.value)"})
    + '</div>';
}
function stepExperience(){
  const d = state.data;
  return '<div class="step-head"><h2>Experience</h2><p>Most recent role first. Focus on outcomes, not just duties.</p></div>'
    + d.experience.map((e,i)=>expCard(e,i)).join('')
    + '<button class="btn-secondary btn-add" onclick="addEntry(\'experience\')">+ Add role</button>';
}

function projectCard(p, idx){
  return '<div class="entry-card">'
    + '<div class="entry-card-head"><span class="entry-num">PROJECT '+(idx+1)+'</span>'+removeBtn('projects',idx)+'</div>'
    + textField({label:'Project name', path:'projects.'+idx+'.name', value:p.name, placeholder:'Inventory tracker'})
    + textareaField({label:'Description', value:p.description, rows:3, placeholder:'What it does and the impact it had', oninputFn:"setVal('projects."+idx+".description', this.value)"})
    + '<div class="field-grid">'
    + textField({label:'Tools / tech used', path:'projects.'+idx+'.tech', value:p.tech, placeholder:'React, Node.js, PostgreSQL'})
    + textField({label:'Link (optional)', path:'projects.'+idx+'.link', value:p.link, placeholder:'github.com/you/project'})
    + '</div></div>';
}
function stepProjects(){
  const d = state.data;
  const cards = d.projects.length ? d.projects.map((p,i)=>projectCard(p,i)).join('') : '<p class="empty-hint">No projects yet — add one if it strengthens your story, or skip ahead.</p>';
  return '<div class="step-head"><h2>Projects</h2><p>Optional. Great for students, career-changers, or freelance work.</p></div>'
    + cards
    + '<button class="btn-secondary btn-add" onclick="addEntry(\'projects\')">+ Add project</button>';
}

function certCard(c, idx){
  return '<div class="entry-card">'
    + '<div class="entry-card-head"><span class="entry-num">CERT '+(idx+1)+'</span>'+removeBtn('certifications',idx)+'</div>'
    + '<div class="field-grid">'
    + textField({label:'Name', path:'certifications.'+idx+'.name', value:c.name, placeholder:'AWS Certified Solutions Architect'})
    + textField({label:'Issuer', path:'certifications.'+idx+'.issuer', value:c.issuer, placeholder:'Amazon Web Services'})
    + textField({label:'Date', path:'certifications.'+idx+'.date', value:c.date, placeholder:'Jun 2024'})
    + '</div></div>';
}
function stepCertifications(){
  const d = state.data;
  const cards = d.certifications.length ? d.certifications.map((c,i)=>certCard(c,i)).join('') : '<p class="empty-hint">No certifications yet — add one if relevant, or skip ahead.</p>';
  return '<div class="step-head"><h2>Certifications</h2><p>Optional.</p></div>'
    + cards
    + '<button class="btn-secondary btn-add" onclick="addEntry(\'certifications\')">+ Add certification</button>';
}

function stepSkills(){
  const d = state.data;
  return '<div class="step-head"><h2>Skills</h2><p>List the tools, technologies, and strengths relevant to your target role.</p></div>'
    + textareaField({label:'Skills (comma-separated)', value:d.skills, rows:4, placeholder:'Python, SQL, Stakeholder management, Figma', oninputFn:"setVal('skills', this.value)"})
}

function awardsBlock(){
  const arr = state.data.additional.awards;
  const cards = arr.map((a,i)=>'<div class="entry-card small">'
    + '<div class="entry-card-head"><span class="entry-num">AWARD '+(i+1)+'</span>'+removeBtn('additional.awards', i)+'</div>'
    + '<div class="field-grid">'
    + textField({label:'Title', path:'additional.awards.'+i+'.title', value:a.title, placeholder:'Employee of the year'})
    + textField({label:'Date', path:'additional.awards.'+i+'.date', value:a.date, placeholder:'2023'})
    + '</div></div>').join('');
  return '<div class="sub-block"><h4>Awards &amp; honors</h4>'+cards+'<button class="btn-secondary btn-add" onclick="addEntry(\'additional.awards\')">+ Add award</button></div>';
}
function volunteerBlock(){
  const arr = state.data.additional.volunteer;
  const cards = arr.map((v,i)=>'<div class="entry-card small">'
    + '<div class="entry-card-head"><span class="entry-num">VOLUNTEER '+(i+1)+'</span>'+removeBtn('additional.volunteer', i)+'</div>'
    + '<div class="field-grid">'
    + textField({label:'Role', path:'additional.volunteer.'+i+'.role', value:v.role, placeholder:'Event Coordinator'})
    + textField({label:'Organization', path:'additional.volunteer.'+i+'.organization', value:v.organization, placeholder:'Local food bank'})
    + textField({label:'Date', path:'additional.volunteer.'+i+'.date', value:v.date, placeholder:'2022 – Present'})
    + '</div>'
    + textareaField({label:'Description', value:v.description, rows:2, placeholder:'What you did and the impact', oninputFn:"setVal('additional.volunteer."+i+".description', this.value)"})
    + '</div>').join('');
  return '<div class="sub-block"><h4>Volunteer experience</h4>'+cards+'<button class="btn-secondary btn-add" onclick="addEntry(\'additional.volunteer\')">+ Add volunteer role</button></div>';
}
function stepAdditional(){
  const d = state.data; const ae = d.additionalEnabled;
  return '<div class="step-head"><h2>Additional sections</h2><p>Optional — include only what strengthens your story.</p></div>'
    + '<div class="toggle-row">'
    + '<label class="toggle"><input type="checkbox" '+(ae.languages?'checked':'')+' onchange="toggleAdditional(\'languages\', this.checked)" /> Languages</label>'
    + '<label class="toggle"><input type="checkbox" '+(ae.awards?'checked':'')+' onchange="toggleAdditional(\'awards\', this.checked)" /> Awards &amp; honors</label>'
    + '<label class="toggle"><input type="checkbox" '+(ae.volunteer?'checked':'')+' onchange="toggleAdditional(\'volunteer\', this.checked)" /> Volunteer experience</label>'
    + '<label class="toggle"><input type="checkbox" '+(ae.other?'checked':'')+' onchange="toggleAdditional(\'other\', this.checked)" /> Other</label>'
    + '</div>'
    + (ae.languages ? textField({label:'Languages (comma-separated)', path:'additional.languages', value:d.additional.languages, placeholder:'English (fluent), Hindi (native)'}) : '')
    + (ae.awards ? awardsBlock() : '')
    + (ae.volunteer ? volunteerBlock() : '')
    + (ae.other ? textareaField({label:'Other', path:'additional.other', value:d.additional.other, rows:4, placeholder:'Publications, speaking, leadership — anything else worth including'}) : '');
}

function reviewRow(label, stepIdx, done){
  return '<button class="review-row '+(done?'done':'todo')+'" onclick="goToStep('+stepIdx+')"><span class="dot"></span>'
    + esc(label) + '<span class="status">'+(done?'Complete':'Add details')+'</span></button>';
}
function stepReview(){
  const d = state.data;
  return '<div class="step-head"><h2>Review &amp; export</h2><p>Here\'s the full picture. Polish it, then download.</p></div>'
    + '<button class="btn-secondary" onclick="goTemplates()">🎨 Change template</button>'
    + '<button class="btn-text" onclick="confirmStartOver()">Start over</button>'
    + '</div>';
}

function stepContent(){
  const key = STEPS[state.stepIndex].key;
  switch(key){
    case 'personal': return stepPersonal();
    case 'summary': return stepSummary();
    case 'education': return stepEducation();
    case 'experience': return stepExperience();
    case 'projects': return stepProjects();
    case 'certifications': return stepCertifications();
    case 'skills': return stepSkills();
    case 'additional': return stepAdditional();
    case 'review': return stepReview();
    default: return '';
  }
}

/* ============================================================
   RESUME PREVIEW / EXPORT BUILDERS
   ============================================================ */
function resumeSection(title, body){
  return '<div class="r-section"><div class="r-heading">'+esc(title)+'</div>'+body+'</div>';
}
function buildPreviewHTML(d){
  const sections = [];
  sections.push('<div class="r-name">'+esc(d.personal.fullName||'Your Name')+'</div>');
  const contactBits = [d.personal.address, d.personal.phone, d.personal.email, d.personal.linkedin, d.personal.portfolio].filter(Boolean).map(esc);
  sections.push('<div class="r-contact">'+contactBits.join(' &nbsp;|&nbsp; ')+'</div>');

  if(d.summary.trim()){
    sections.push(resumeSection('Summary', '<p class="r-summary">'+esc(d.summary)+'</p>'));
  }
  if(d.experience.some(e=>e.title||e.company)){
    const body = d.experience.filter(e=>e.title||e.company).map(e=>{
      const title = esc(e.title)+(e.company?' — '+esc(e.company):'');
      const date = esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate);
      const bullets = e.bullets.filter(b=>b.trim()).map(b=>'<li>'+esc(b)+'</li>').join('');
      return '<div class="r-entry"><div class="r-entry-top"><span class="r-entry-title">'+title+'</span><span class="r-entry-date">'+date+'</span></div>'
        + (e.location? '<div class="r-entry-sub">'+esc(e.location)+'</div>':'')
        + (bullets? '<ul class="r-bullets">'+bullets+'</ul>':'')
        + '</div>';
    }).join('');
    sections.push(resumeSection('Experience', body));
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body = d.education.filter(e=>e.degree||e.institution).map(e=>{
      const title = esc(e.degree)+(e.institution? ' — '+esc(e.institution):'');
      const date = esc(e.startDate)+' – '+esc(e.endDate);
      const subBits = [e.location, e.gpa? ('GPA '+e.gpa) : ''].filter(Boolean).map(esc).join(' · ');
      return '<div class="r-entry"><div class="r-entry-top"><span class="r-entry-title">'+title+'</span><span class="r-entry-date">'+date+'</span></div>'
        + (subBits? '<div class="r-entry-sub">'+subBits+'</div>':'') + '</div>';
    }).join('');
    sections.push(resumeSection('Education', body));
  }
  if(d.projects.some(p=>p.name)){
    const body = d.projects.filter(p=>p.name).map(p=>{
      return '<div class="r-entry"><div class="r-entry-top"><span class="r-entry-title">'+esc(p.name)+'</span>'
        + (p.link? '<span class="r-entry-date">'+esc(p.link)+'</span>':'') + '</div>'
        + (p.description? '<p class="r-summary">'+esc(p.description)+'</p>':'')
        + (p.tech? '<div class="r-entry-sub">'+esc(p.tech)+'</div>':'') + '</div>';
    }).join('');
    sections.push(resumeSection('Projects', body));
  }
  if(d.certifications.some(c=>c.name)){
    const body = '<ul class="r-bullets">'+d.certifications.filter(c=>c.name).map(c=>{
      return '<li>'+esc(c.name)+(c.issuer? ' — '+esc(c.issuer):'')+(c.date? ' ('+esc(c.date)+')':'')+'</li>';
    }).join('')+'</ul>';
    sections.push(resumeSection('Certifications', body));
  }
  if(d.skills.trim()){
    sections.push(resumeSection('Skills', '<p class="r-summary">'+esc(d.skills)+'</p>'));
  }
  const addBits = [];
  if(d.additionalEnabled.languages && d.additional.languages.trim()){
    addBits.push('<div class="r-entry-sub"><strong>Languages:</strong> '+esc(d.additional.languages)+'</div>');
  }
  if(d.additionalEnabled.awards && d.additional.awards.some(a=>a.title)){
    addBits.push('<ul class="r-bullets">'+d.additional.awards.filter(a=>a.title).map(a=>'<li>'+esc(a.title)+(a.date? ' ('+esc(a.date)+')':'')+'</li>').join('')+'</ul>');
  }
  if(d.additionalEnabled.volunteer && d.additional.volunteer.some(v=>v.role||v.organization)){
    addBits.push(d.additional.volunteer.filter(v=>v.role||v.organization).map(v=>{
      const title = esc(v.role)+(v.organization? ' — '+esc(v.organization):'');
      return '<div class="r-entry"><div class="r-entry-top"><span class="r-entry-title">'+title+'</span><span class="r-entry-date">'+esc(v.date)+'</span></div>'
        + (v.description? '<p class="r-summary">'+esc(v.description)+'</p>':'') + '</div>';
    }).join(''));
  }
  if(d.additionalEnabled.other && d.additional.other.trim()){
    addBits.push('<p class="r-summary">'+esc(d.additional.other)+'</p>');
  }
  if(addBits.length){ sections.push(resumeSection('Additional', addBits.join(''))); }

  return sections.join('');
}

function computeChecklist(d){
  const hasDigit = d.experience.some(e=>e.bullets.some(b=>/\d/.test(b)));
  return [
    {label:'Single column layout', pass:true},
    {label:'Standard section headings', pass:true},
    {label:'No tables, images, or icons', pass:true},
    {label:'Contact info complete', pass: !!(d.personal.fullName && d.personal.email && d.personal.phone)},
    {label:'Reverse-chronological dates', pass: d.experience.some(e=>e.startDate)},
    {label:'Quantified achievements', pass: hasDigit}
  ];
}
function checklistHTML(){
  return computeChecklist(state.data).map(c=>'<div class="check-item '+(c.pass?'pass':'pending')+'"><span class="check-mark">'+(c.pass?'✓':'·')+'</span>'+esc(c.label)+'</div>').join('');
}
function renderPreview(){
  const el = document.getElementById('previewPaper');
  if(el) el.innerHTML = buildTemplateHTML(state.data);
  const cl = document.getElementById('checklist');
  if(cl) cl.innerHTML = checklistHTML();
}

function buildPlainText(d){
  const lines = [];
  lines.push((d.personal.fullName||'YOUR NAME').toUpperCase());
  lines.push([d.personal.address,d.personal.phone,d.personal.email,d.personal.linkedin,d.personal.portfolio].filter(Boolean).join(' | '));
  lines.push('');
  if(d.summary.trim()){ lines.push('SUMMARY'); lines.push(d.summary.trim()); lines.push(''); }
  if(d.experience.some(e=>e.title||e.company)){
    lines.push('EXPERIENCE');
    d.experience.filter(e=>e.title||e.company).forEach(e=>{
      lines.push((e.title||'')+(e.company? ' — '+e.company:'')+' ('+(e.startDate||'')+' – '+(e.current?'Present':(e.endDate||''))+')');
      if(e.location) lines.push(e.location);
      e.bullets.filter(b=>b.trim()).forEach(b=>lines.push('- '+b.trim()));
      lines.push('');
    });
  }
  if(d.education.some(e=>e.degree||e.institution)){
    lines.push('EDUCATION');
    d.education.filter(e=>e.degree||e.institution).forEach(e=>{
      lines.push((e.degree||'')+(e.institution? ' — '+e.institution:'')+' ('+(e.startDate||'')+' – '+(e.endDate||'')+')');
      const sub=[e.location, e.gpa? ('GPA '+e.gpa):''].filter(Boolean).join(' · ');
      if(sub) lines.push(sub);
      lines.push('');
    });
  }
  if(d.projects.some(p=>p.name)){
    lines.push('PROJECTS');
    d.projects.filter(p=>p.name).forEach(p=>{
      lines.push(p.name+(p.link? ' — '+p.link:''));
      if(p.description) lines.push(p.description);
      if(p.tech) lines.push('Tech: '+p.tech);
      lines.push('');
    });
  }
  if(d.certifications.some(c=>c.name)){
    lines.push('CERTIFICATIONS');
    d.certifications.filter(c=>c.name).forEach(c=>{
      lines.push('- '+c.name+(c.issuer? ' — '+c.issuer:'')+(c.date? ' ('+c.date+')':''));
    });
    lines.push('');
  }
  if(d.skills.trim()){ lines.push('SKILLS'); lines.push(d.skills.trim()); lines.push(''); }
  if(d.additionalEnabled.languages && d.additional.languages.trim()){
    lines.push('LANGUAGES'); lines.push(d.additional.languages.trim()); lines.push('');
  }
  if(d.additionalEnabled.awards && d.additional.awards.some(a=>a.title)){
    lines.push('AWARDS & HONORS');
    d.additional.awards.filter(a=>a.title).forEach(a=>lines.push('- '+a.title+(a.date? ' ('+a.date+')':'')));
    lines.push('');
  }
  if(d.additionalEnabled.volunteer && d.additional.volunteer.some(v=>v.role||v.organization)){
    lines.push('VOLUNTEER EXPERIENCE');
    d.additional.volunteer.filter(v=>v.role||v.organization).forEach(v=>{
      lines.push((v.role||'')+(v.organization? ' — '+v.organization:'')+(v.date? ' ('+v.date+')':''));
      if(v.description) lines.push(v.description);
    });
    lines.push('');
  }
  if(d.additionalEnabled.other && d.additional.other.trim()){
    lines.push('ADDITIONAL'); lines.push(d.additional.other.trim());
  }
  return lines.join('\n').trim()+'\n';
}

function downloadTxt(){
  const text = buildPlainText(state.data);
  const blob = new Blob([text], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (state.data.personal.fullName || 'resume').trim().replace(/\s+/g,'_') + '_resume.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded as plain text.', 'ok');
}
function copyResume(){
  const text = buildPlainText(state.data);
  navigator.clipboard.writeText(text)
    .then(()=>showToast('Copied to clipboard.', 'ok'))
    .catch(()=>showToast('Could not copy — your browser may be blocking clipboard access.', 'error'));
}
async function downloadPDF(){
  const btn = document.getElementById('btnPDF');
  if(btn){ btn.disabled = true; btn.textContent = 'Generating PDF…'; }
  try{
    if(!window.html2pdf){
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    }
    const paper = document.getElementById('previewPaper');
    if(!paper){ showToast('Open the resume preview first.', 'error'); return; }
    const name = (state.data.personal.fullName || 'resume').trim().replace(/\s+/g,'_');
    const opt = {
      margin:       [10, 12, 10, 12],
      filename:     name + '_resume.pdf',
      image:        {type:'jpeg', quality:0.98},
      html2canvas:  {scale:2, useCORS:true, letterRendering:true},
      jsPDF:        {unit:'mm', format:'a4', orientation:'portrait'}
    };
    await html2pdf().set(opt).from(paper).save();
    showToast('PDF downloaded.', 'ok');
  } catch(err){
    console.error(err);
    showToast('PDF export failed — try "Print" and save as PDF from there.', 'error');
  }
  if(btn){ btn.disabled = false; btn.textContent = '⬇ Save as PDF'; }
}
function printResume(){ window.print(); }


/* ============================================================
   TEMPLATES DEFINITION
   ============================================================ */
const TEMPLATES = [
  {id:'classic',     name:'Classic',        badge:'classic',  desc:'Clean single-column, ATS-safe. The gold standard for corporate & finance.'},
  {id:'executive',   name:'Executive',      badge:'popular',  desc:'Bold name banner with a dark header stripe. Ideal for senior roles & C-suite.'},
  {id:'modern',      name:'Modern',         badge:'modern',   desc:'Left sidebar with accent colour. Popular in tech, product, and design.'},
  {id:'minimal',     name:'Minimal',        badge:'modern',   desc:'Ultra-clean whitespace-driven layout. Great for creative roles and agencies.'},
  {id:'navy',        name:'Navy Pro',       badge:'classic',  desc:'Deep navy accent bar with serif headings. Strong for consulting & law.'},
  {id:'twocol',      name:'Two-Column',     badge:'popular',  desc:'Skills & info in a sidebar, experience on the right. Space-efficient.'},
  {id:'academic',    name:'Academic / CV',  badge:'classic',  desc:'Dense publication-ready style for academia, research, and medicine.'},
  {id:'startup',     name:'Startup',        badge:'modern',   desc:'Colourful header with icon-style contact strip. Great for startups & SaaS.'},
  {id:'chronos',     name:'Chronos',        badge:'popular',  desc:'Timeline-accent lines on experience. Striking for engineers & architects.'},
  {id:'elegant',     name:'Elegant',        badge:'modern',   desc:'Thin serif typography with centered header. Perfect for marketing & PR.'},
];

function selectTemplate(id){
  state.templateId = id;
  renderApp();
  showToast('Template applied — check the live preview.', 'ok');
}

function goTemplates(){
  state.screen = 'templates';
  renderApp();
}

function tplThumbHTML(id, d){
  return buildTemplateHTML(d || state.data, id);
}

function templatesTemplate(){
  const d = state.data;
  return '<section class="tpl-screen">'
    + '<div class="welcome-meta">CHOOSE TEMPLATE</div>'
    + '<h1>Pick your resume style</h1>'
    + '<p class="welcome-sub">All 10 templates are ATS-safe. Select one — your data carries over instantly.</p>'
    + '<div class="tpl-grid">'
    + TEMPLATES.map(t=>{
        const sel = state.templateId===t.id;
        return '<div class="tpl-card'+(sel?' selected':'')+'" onclick="selectTemplate(\''+t.id+'\')">'
          + '<div class="tpl-thumb"><iframe srcdoc="'+escAttr(buildTemplateHTML(d, t.id))+'"></iframe></div>'
          + '<div class="tpl-info"><div class="tpl-name">'+(sel?'✓ ':'')+esc(t.name)+'</div>'
          + '<div class="tpl-desc">'+esc(t.desc)+'</div>'
          + '<span class="tpl-badge '+t.badge+'">'+t.badge.toUpperCase()+'</span>'
          + '</div></div>';
      }).join('')
    + '</div>'
    + '<div class="tpl-actions">'
    + '<button class="btn-primary" onclick="state.screen=\'wizard\'; renderApp();">Use this template →</button>'
    + '<span class="tpl-selected-label">Selected: '+ esc(TEMPLATES.find(t=>t.id===state.templateId).name) +'</span>'
    + '</div></section>';
}

function escAttr(s){
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;');
}

/* Master template dispatcher */
function buildTemplateHTML(d, tplId){
  switch(tplId || state.templateId){
    case 'executive': return tplExecutive(d);
    case 'modern':    return tplModern(d);
    case 'minimal':   return tplMinimal(d);
    case 'navy':      return tplNavy(d);
    case 'twocol':    return tplTwoCol(d);
    case 'academic':  return tplAcademic(d);
    case 'startup':   return tplStartup(d);
    case 'chronos':   return tplChronos(d);
    case 'elegant':   return tplElegant(d);
    default:          return tplClassic(d);
  }
}

/* Shared helpers */
function tplContact(d){
  return [d.personal.address, d.personal.phone, d.personal.email, d.personal.linkedin, d.personal.portfolio].filter(Boolean).map(esc).join(' | ');
}
function tplBullets(bullets, style){
  const items = bullets.filter(b=>b.trim());
  if(!items.length) return '';
  return '<ul style="'+style+'">'+items.map(b=>'<li>'+esc(b)+'</li>').join('')+'</ul>';
}

/* ---- TEMPLATE 1: Classic ---- */
function tplClassic(d){
  let html = '<div style="font-family:Georgia,serif;color:#1a1a1a;padding:0;">';
  html += '<div style="margin-bottom:18px;"><div style="font-size:26px;font-weight:700;letter-spacing:0.3px;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  html += '<div style="font-family:monospace;font-size:10px;color:#444;margin-top:4px;">'+tplContact(d)+'</div></div>';
  html += tplClassicSections(d);
  html += '</div>';
  return wrapPaper(html, 'font-family:Georgia,serif;background:#fff;padding:40px 48px;');
}
function tplClassicSec(title, body){
  return '<div style="margin-bottom:18px;"><div style="font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;border-bottom:1.5px solid #888;padding-bottom:3px;margin-bottom:8px;">'+title+'</div>'+body+'</div>';
}
function tplClassicSections(d){
  let s='';
  if(d.summary.trim()) s+=tplClassicSec('Summary','<p style="font-size:13px;line-height:1.6;margin:0;">'+esc(d.summary)+'</p>');
  if(d.experience.some(e=>e.title||e.company)){
    const body=d.experience.filter(e=>e.title||e.company).map(e=>'<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:700;"><span>'+esc(e.title)+(e.company?' — '+esc(e.company):'')+'</span><span style="font-size:11px;font-weight:400;color:#555;white-space:nowrap;">'+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate)+'</span></div>'+(e.location?'<div style="font-size:11.5px;color:#666;">'+esc(e.location)+'</div>':'')+tplBullets(e.bullets,'margin:4px 0 0 16px;padding:0;font-size:12.5px;line-height:1.5;')+'</div>').join('');
    s+=tplClassicSec('Experience',body);
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body=d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:13px;font-weight:600;">'+esc(e.degree)+(e.institution?' — '+esc(e.institution):'')+'</span><span style="font-size:11px;color:#555;">'+esc(e.startDate)+' – '+esc(e.endDate)+'</span></div>').join('');
    s+=tplClassicSec('Education',body);
  }
  if(d.skills.trim()) s+=tplClassicSec('Skills','<p style="font-size:12.5px;margin:0;line-height:1.6;">'+esc(d.skills)+'</p>');
  if(d.projects.some(p=>p.name)){
    const body=d.projects.filter(p=>p.name).map(p=>'<div style="margin-bottom:8px;"><span style="font-size:13px;font-weight:600;">'+esc(p.name)+'</span>'+(p.tech?'<span style="font-size:11px;color:#666;"> · '+esc(p.tech)+'</span>':'')+(p.description?'<p style="font-size:12px;margin:2px 0 0;line-height:1.5;">'+esc(p.description)+'</p>':'')+'</div>').join('');
    s+=tplClassicSec('Projects',body);
  }
  if(d.certifications.some(c=>c.name)){
    const body='<ul style="margin:0 0 0 14px;padding:0;font-size:12.5px;line-height:1.7;">'+d.certifications.filter(c=>c.name).map(c=>'<li>'+esc(c.name)+(c.issuer?' — '+esc(c.issuer):'')+(c.date?' ('+esc(c.date)+')':'')+'</li>').join('')+'</ul>';
    s+=tplClassicSec('Certifications',body);
  }
  return s;
}

/* ---- TEMPLATE 2: Executive ---- */
function tplExecutive(d){
  let html = '<div style="background:#1a2744;padding:32px 44px 24px;margin:-40px -48px 24px;">';
  html += '<div style="font-size:30px;font-weight:700;color:#fff;font-family:Georgia,serif;letter-spacing:0.4px;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  if(d.personal.targetRole) html += '<div style="font-size:13px;color:#a8bbd4;margin-top:4px;letter-spacing:0.5px;text-transform:uppercase;">'+esc(d.personal.targetRole)+'</div>';
  html += '<div style="font-family:monospace;font-size:10px;color:#8aa4c0;margin-top:8px;">'+tplContact(d)+'</div>';
  html += '</div>';
  html += tplClassicSections(d);
  return wrapPaper(html, 'font-family:Georgia,serif;background:#fff;padding:40px 48px;');
}

/* ---- TEMPLATE 3: Modern (sidebar) ---- */
function tplModern(d){
  const sidebar = '<div style="background:#2f4d7e;color:#fff;padding:28px 20px;min-height:100%;box-sizing:border-box;">'
    + '<div style="font-size:20px;font-weight:700;font-family:Georgia,serif;line-height:1.2;margin-bottom:4px;">'+esc(d.personal.fullName||'Your Name')+'</div>'
    + (d.personal.targetRole?'<div style="font-size:11px;color:#a8c0e8;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.5px;">'+esc(d.personal.targetRole)+'</div>':'<div style="height:16px;"></div>')
    + modSideSection('Contact', [d.personal.email,d.personal.phone,d.personal.address,d.personal.linkedin].filter(Boolean).map(x=>'<div style="font-size:11px;word-break:break-all;margin-bottom:3px;">'+esc(x)+'</div>').join(''))
    + (d.skills.trim()?modSideSection('Skills','<div style="font-size:11.5px;line-height:1.7;">'+esc(d.skills)+'</div>'):'')
    + (d.certifications.some(c=>c.name)?modSideSection('Certifications','<ul style="margin:0 0 0 12px;padding:0;font-size:11px;line-height:1.6;">'+d.certifications.filter(c=>c.name).map(c=>'<li>'+esc(c.name)+'</li>').join('')+'</ul>'):'')
    + '</div>';
  let main = '<div style="padding:28px 28px;flex:1;">';
  if(d.summary.trim()) main += modMainSec('Summary','<p style="font-size:12.5px;line-height:1.6;margin:0;">'+esc(d.summary)+'</p>');
  if(d.experience.some(e=>e.title||e.company)){
    const body=d.experience.filter(e=>e.title||e.company).map(e=>'<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;"><span>'+esc(e.title)+(e.company?' · '+esc(e.company):'')+'</span><span style="font-size:10.5px;font-weight:400;color:#666;white-space:nowrap;">'+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate)+'</span></div>'+tplBullets(e.bullets,'margin:4px 0 0 14px;padding:0;font-size:12px;line-height:1.5;')+'</div>').join('');
    main+=modMainSec('Experience',body);
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body=d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="margin-bottom:6px;font-size:12.5px;"><strong>'+esc(e.degree)+'</strong>'+(e.institution?' — '+esc(e.institution):'')+'<span style="float:right;font-size:11px;color:#777;">'+esc(e.startDate)+' – '+esc(e.endDate)+'</span></div>').join('');
    main+=modMainSec('Education',body);
  }
  if(d.projects.some(p=>p.name)){
    const body=d.projects.filter(p=>p.name).map(p=>'<div style="margin-bottom:7px;"><strong style="font-size:12.5px;">'+esc(p.name)+'</strong>'+(p.tech?'<span style="font-size:11px;color:#666;"> · '+esc(p.tech)+'</span>':'')+(p.description?'<p style="font-size:11.5px;margin:2px 0 0;line-height:1.4;">'+esc(p.description)+'</p>':'')+'</div>').join('');
    main+=modMainSec('Projects',body);
  }
  main += '</div>';
  const layout = '<div style="display:flex;min-height:780px;">'+sidebar+main+'</div>';
  return wrapPaper(layout, 'font-family:Inter,Arial,sans-serif;background:#fff;padding:0;overflow:hidden;');
}
function modSideSection(title,body){ return '<div style="margin-bottom:18px;"><div style="font-size:9.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#a8c0e8;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:3px;margin-bottom:6px;">'+title+'</div>'+body+'</div>'; }
function modMainSec(title,body){ return '<div style="margin-bottom:16px;"><div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#2f4d7e;border-bottom:2px solid #2f4d7e;padding-bottom:3px;margin-bottom:8px;">'+title+'</div>'+body+'</div>'; }

/* ---- TEMPLATE 4: Minimal ---- */
function tplMinimal(d){
  let html = '<div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid #e0e0e0;">';
  html += '<div style="font-size:28px;font-weight:300;letter-spacing:3px;text-transform:uppercase;font-family:Georgia,serif;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  if(d.personal.targetRole) html += '<div style="font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">'+esc(d.personal.targetRole)+'</div>';
  html += '<div style="font-size:10.5px;color:#aaa;margin-top:8px;letter-spacing:0.5px;">'+tplContact(d)+'</div>';
  html += '</div>';
  const sec=(title,body)=>'<div style="margin-bottom:20px;"><div style="font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#aaa;margin-bottom:8px;">'+title+'</div>'+body+'</div>';
  if(d.summary.trim()) html+=sec('Profile','<p style="font-size:13px;line-height:1.7;margin:0;color:#333;">'+esc(d.summary)+'</p>');
  if(d.experience.some(e=>e.title||e.company)){
    const body=d.experience.filter(e=>e.title||e.company).map(e=>'<div style="margin-bottom:12px;"><div style="font-size:13.5px;font-weight:600;">'+esc(e.title)+'</div><div style="font-size:12px;color:#888;margin-bottom:2px;">'+esc(e.company)+(e.startDate?' · '+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate):'')+'</div>'+tplBullets(e.bullets,'margin:4px 0 0 14px;padding:0;font-size:12.5px;line-height:1.55;color:#333;')+'</div>').join('');
    html+=sec('Experience',body);
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body=d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="margin-bottom:6px;"><span style="font-size:13px;font-weight:600;">'+esc(e.degree)+'</span><span style="font-size:12px;color:#888;"> — '+esc(e.institution)+'</span><span style="font-size:11px;color:#aaa;float:right;">'+esc(e.startDate)+' – '+esc(e.endDate)+'</span></div>').join('');
    html+=sec('Education',body);
  }
  if(d.skills.trim()) html+=sec('Skills','<p style="font-size:12.5px;margin:0;line-height:1.7;color:#444;">'+esc(d.skills)+'</p>');
  return wrapPaper(html, 'font-family:Helvetica Neue,Arial,sans-serif;background:#fff;padding:48px 56px;');
}

/* ---- TEMPLATE 5: Navy Pro ---- */
function tplNavy(d){
  let html = '<div style="border-left:5px solid #0a2d5e;padding-left:20px;margin-bottom:22px;">';
  html += '<div style="font-size:26px;font-weight:700;font-family:Georgia,serif;color:#0a2d5e;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  if(d.personal.targetRole) html += '<div style="font-size:12px;color:#4a6fa5;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">'+esc(d.personal.targetRole)+'</div>';
  html += '<div style="font-family:monospace;font-size:10px;color:#555;margin-top:6px;">'+tplContact(d)+'</div>';
  html += '</div>';
  const sec=(title,body)=>'<div style="margin-bottom:18px;"><div style="background:#0a2d5e;color:#fff;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;margin-bottom:8px;">'+title+'</div>'+body+'</div>';
  if(d.summary.trim()) html+=sec('Summary','<p style="font-size:13px;line-height:1.6;margin:0 0 0 10px;">'+esc(d.summary)+'</p>');
  if(d.experience.some(e=>e.title||e.company)){
    const body=d.experience.filter(e=>e.title||e.company).map(e=>'<div style="margin:0 0 10px 10px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:13.5px;">'+esc(e.title)+(e.company?' — '+esc(e.company):'')+'</strong><span style="font-size:11px;color:#666;white-space:nowrap;">'+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate)+'</span></div>'+tplBullets(e.bullets,'margin:4px 0 0 14px;padding:0;font-size:12.5px;line-height:1.5;')+'</div>').join('');
    html+=sec('Experience',body);
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body=d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="margin:0 0 6px 10px;display:flex;justify-content:space-between;"><strong style="font-size:13px;">'+esc(e.degree)+(e.institution?' — '+esc(e.institution):'')+'</strong><span style="font-size:11px;color:#666;">'+esc(e.startDate)+' – '+esc(e.endDate)+'</span></div>').join('');
    html+=sec('Education',body);
  }
  if(d.skills.trim()) html+=sec('Skills','<p style="font-size:12.5px;margin:0 0 0 10px;line-height:1.6;">'+esc(d.skills)+'</p>');
  if(d.certifications.some(c=>c.name)){
    const body='<ul style="margin:0 0 0 24px;padding:0;font-size:12.5px;line-height:1.7;">'+d.certifications.filter(c=>c.name).map(c=>'<li>'+esc(c.name)+(c.issuer?' — '+esc(c.issuer):'')+'</li>').join('')+'</ul>';
    html+=sec('Certifications',body);
  }
  return wrapPaper(html, 'font-family:Georgia,serif;background:#fff;padding:40px 48px;');
}

/* ---- TEMPLATE 6: Two Column ---- */
function tplTwoCol(d){
  const right = '<div style="flex:1.65;padding:28px 28px 28px 24px;">';
  let rightHtml = right;
  const rsec=(title,body)=>'<div style="margin-bottom:15px;"><div style="font-size:10.5px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:#2c3e6e;border-bottom:1.5px solid #2c3e6e;padding-bottom:2px;margin-bottom:7px;">'+title+'</div>'+body+'</div>';
  if(d.experience.some(e=>e.title||e.company)){
    const body=d.experience.filter(e=>e.title||e.company).map(e=>'<div style="margin-bottom:9px;"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;"><span>'+esc(e.title)+(e.company?' · '+esc(e.company):'')+'</span><span style="font-size:10.5px;font-weight:400;color:#777;white-space:nowrap;">'+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate)+'</span></div>'+tplBullets(e.bullets,'margin:3px 0 0 13px;padding:0;font-size:12px;line-height:1.5;')+'</div>').join('');
    rightHtml+=rsec('Experience',body);
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body=d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="margin-bottom:5px;font-size:12.5px;"><strong>'+esc(e.degree)+'</strong><br><span style="font-size:11.5px;color:#555;">'+esc(e.institution)+' · '+esc(e.startDate)+' – '+esc(e.endDate)+'</span></div>').join('');
    rightHtml+=rsec('Education',body);
  }
  if(d.projects.some(p=>p.name)){
    const body=d.projects.filter(p=>p.name).map(p=>'<div style="margin-bottom:7px;"><strong style="font-size:12.5px;">'+esc(p.name)+'</strong>'+(p.description?'<p style="font-size:11.5px;margin:2px 0 0;line-height:1.4;">'+esc(p.description)+'</p>':'')+'</div>').join('');
    rightHtml+=rsec('Projects',body);
  }
  rightHtml+='</div>';

  const lsec=(title,body)=>'<div style="margin-bottom:16px;"><div style="font-size:9.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#a8c0e8;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:2px;margin-bottom:6px;">'+title+'</div>'+body+'</div>';
  let leftHtml = '<div style="background:#2c3e6e;color:#fff;padding:24px 18px;width:195px;min-height:100%;box-sizing:border-box;flex-shrink:0;">';
  leftHtml += '<div style="font-size:18px;font-weight:700;font-family:Georgia,serif;line-height:1.2;margin-bottom:3px;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  if(d.personal.targetRole) leftHtml += '<div style="font-size:10px;color:#a8c0e8;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:14px;">'+esc(d.personal.targetRole)+'</div>';
  else leftHtml += '<div style="height:14px;"></div>';
  leftHtml += lsec('Contact',[d.personal.email,d.personal.phone,d.personal.address,d.personal.linkedin].filter(Boolean).map(x=>'<div style="font-size:10.5px;word-break:break-all;margin-bottom:3px;">'+esc(x)+'</div>').join(''));
  if(d.skills.trim()) leftHtml += lsec('Skills','<div style="font-size:11px;line-height:1.7;">'+esc(d.skills)+'</div>');
  if(d.summary.trim()) leftHtml += lsec('About','<p style="font-size:11px;line-height:1.6;margin:0;">'+esc(d.summary)+'</p>');
  leftHtml += '</div>';

  const layout = '<div style="display:flex;min-height:780px;">'+leftHtml+rightHtml+'</div>';
  return wrapPaper(layout, 'font-family:Inter,Arial,sans-serif;background:#fff;padding:0;overflow:hidden;');
}

/* ---- TEMPLATE 7: Academic ---- */
function tplAcademic(d){
  let html = '<div style="text-align:center;border-bottom:2px solid #222;padding-bottom:12px;margin-bottom:16px;">';
  html += '<div style="font-size:24px;font-weight:700;font-family:Georgia,serif;letter-spacing:0.5px;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  if(d.personal.targetRole) html += '<div style="font-size:12px;color:#444;margin-top:2px;font-style:italic;">'+esc(d.personal.targetRole)+'</div>';
  html += '<div style="font-family:monospace;font-size:10px;color:#555;margin-top:6px;">'+tplContact(d)+'</div></div>';
  const sec=(title,body)=>'<div style="margin-bottom:14px;"><div style="font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #555;padding-bottom:2px;margin-bottom:7px;font-family:Georgia,serif;">'+title+'</div>'+body+'</div>';
  if(d.summary.trim()) html+=sec('Research Interests / Summary','<p style="font-size:12.5px;line-height:1.65;margin:0;">'+esc(d.summary)+'</p>');
  if(d.education.some(e=>e.degree||e.institution)){
    const body=d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:13px;">'+esc(e.degree)+'</strong><span style="font-size:11px;color:#555;">'+esc(e.startDate)+' – '+esc(e.endDate)+'</span></div><div style="font-size:12px;color:#555;">'+esc(e.institution)+(e.gpa?' · GPA: '+esc(e.gpa):'')+'</div></div>').join('');
    html+=sec('Education',body);
  }
  if(d.experience.some(e=>e.title||e.company)){
    const body=d.experience.filter(e=>e.title||e.company).map(e=>'<div style="margin-bottom:9px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:13px;">'+esc(e.title)+'</strong><span style="font-size:11px;color:#555;">'+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate)+'</span></div><div style="font-size:12px;color:#555;">'+esc(e.company)+' '+esc(e.location)+'</div>'+tplBullets(e.bullets,'margin:3px 0 0 14px;padding:0;font-size:12px;line-height:1.5;')+'</div>').join('');
    html+=sec('Academic & Professional Experience',body);
  }
  if(d.skills.trim()) html+=sec('Technical Skills','<p style="font-size:12.5px;margin:0;line-height:1.6;">'+esc(d.skills)+'</p>');
  if(d.certifications.some(c=>c.name)){
    const body='<ul style="margin:0 0 0 14px;padding:0;font-size:12.5px;line-height:1.7;">'+d.certifications.filter(c=>c.name).map(c=>'<li>'+esc(c.name)+(c.issuer?' ('+esc(c.issuer)+')':'')+' '+(c.date?'('+esc(c.date)+')':'')+'</li>').join('')+'</ul>';
    html+=sec('Certifications & Awards',body);
  }
  return wrapPaper(html, 'font-family:Georgia,serif;background:#fff;padding:36px 48px;');
}

/* ---- TEMPLATE 8: Startup ---- */
function tplStartup(d){
  let html = '<div style="background:linear-gradient(135deg,#6c3fc5,#3b82f6);padding:28px 36px 20px;margin:-40px -48px 24px;">';
  html += '<div style="font-size:28px;font-weight:800;color:#fff;font-family:Arial,sans-serif;letter-spacing:-0.5px;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  if(d.personal.targetRole) html += '<div style="font-size:12px;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:1.5px;margin-top:3px;">'+esc(d.personal.targetRole)+'</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:10px;">';
  [d.personal.email,d.personal.phone,d.personal.linkedin,d.personal.address].filter(Boolean).forEach(x=>{ html+='<span style="font-size:10.5px;color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.15);padding:3px 8px;border-radius:20px;">'+esc(x)+'</span>'; });
  html += '</div></div>';
  const sec=(title,body,accent='#6c3fc5')=>'<div style="margin-bottom:17px;"><div style="font-size:10.5px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:'+accent+';margin-bottom:8px;">'+title+'</div>'+body+'</div>';
  if(d.summary.trim()) html+=sec('About','<p style="font-size:13px;line-height:1.65;margin:0;color:#333;">'+esc(d.summary)+'</p>');
  if(d.experience.some(e=>e.title||e.company)){
    const body=d.experience.filter(e=>e.title||e.company).map(e=>'<div style="margin-bottom:10px;border-left:3px solid #6c3fc5;padding-left:10px;"><div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:700;"><span>'+esc(e.title)+'</span><span style="font-size:11px;font-weight:400;color:#888;">'+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate)+'</span></div><div style="font-size:12px;color:#6c3fc5;margin-bottom:2px;">'+esc(e.company)+'</div>'+tplBullets(e.bullets,'margin:4px 0 0 14px;padding:0;font-size:12.5px;line-height:1.5;color:#333;')+'</div>').join('');
    html+=sec('Experience',body);
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body=d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="margin-bottom:6px;font-size:12.5px;"><strong>'+esc(e.degree)+'</strong> — '+esc(e.institution)+'<span style="float:right;font-size:11px;color:#888;">'+esc(e.startDate)+' – '+esc(e.endDate)+'</span></div>').join('');
    html+=sec('Education',body,'#3b82f6');
  }
  if(d.skills.trim()) html+=sec('Skills','<p style="font-size:12.5px;margin:0;line-height:1.7;">'+esc(d.skills)+'</p>','#3b82f6');
  return wrapPaper(html, 'font-family:Inter,Arial,sans-serif;background:#fff;padding:40px 48px;');
}

/* ---- TEMPLATE 9: Chronos (timeline) ---- */
function tplChronos(d){
  let html = '<div style="margin-bottom:22px;">';
  html += '<div style="font-size:28px;font-weight:700;color:#1a1a1a;font-family:Georgia,serif;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  if(d.personal.targetRole) html += '<div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1.2px;margin-top:2px;">'+esc(d.personal.targetRole)+'</div>';
  html += '<div style="font-family:monospace;font-size:10px;color:#666;margin-top:6px;border-top:2px solid #1a1a1a;padding-top:6px;">'+tplContact(d)+'</div></div>';
  const sec=(title,body)=>'<div style="margin-bottom:20px;"><div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1a1a1a;margin-bottom:10px;">'+title+'</div>'+body+'</div>';
  if(d.summary.trim()) html+=sec('Profile','<p style="font-size:13px;line-height:1.65;margin:0;color:#333;">'+esc(d.summary)+'</p>');
  if(d.experience.some(e=>e.title||e.company)){
    const body='<div style="border-left:2px solid #ccc;padding-left:16px;">'+d.experience.filter(e=>e.title||e.company).map(e=>'<div style="position:relative;margin-bottom:14px;"><div style="position:absolute;left:-21px;top:4px;width:9px;height:9px;border-radius:50%;background:#1a1a1a;"></div><div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:700;"><span>'+esc(e.title)+(e.company?' · '+esc(e.company):'')+'</span><span style="font-size:11px;font-weight:400;color:#777;white-space:nowrap;">'+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate)+'</span></div>'+tplBullets(e.bullets,'margin:4px 0 0 14px;padding:0;font-size:12.5px;line-height:1.5;')+'</div>').join('')+'</div>';
    html+=sec('Experience',body);
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body='<div style="border-left:2px solid #ccc;padding-left:16px;">'+d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="position:relative;margin-bottom:8px;"><div style="position:absolute;left:-21px;top:4px;width:9px;height:9px;border-radius:50%;background:#888;"></div><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;"><span>'+esc(e.degree)+(e.institution?' — '+esc(e.institution):'')+'</span><span style="font-size:11px;font-weight:400;color:#777;">'+esc(e.startDate)+' – '+esc(e.endDate)+'</span></div></div>').join('')+'</div>';
    html+=sec('Education',body);
  }
  if(d.skills.trim()) html+=sec('Skills','<p style="font-size:12.5px;margin:0;line-height:1.7;color:#333;">'+esc(d.skills)+'</p>');
  if(d.projects.some(p=>p.name)){
    const body='<div style="border-left:2px solid #ccc;padding-left:16px;">'+d.projects.filter(p=>p.name).map(p=>'<div style="position:relative;margin-bottom:8px;"><div style="position:absolute;left:-21px;top:4px;width:9px;height:9px;border-radius:50%;background:#aaa;"></div><strong style="font-size:12.5px;">'+esc(p.name)+'</strong>'+(p.description?'<p style="font-size:12px;margin:2px 0 0;line-height:1.4;">'+esc(p.description)+'</p>':'')+'</div>').join('')+'</div>';
    html+=sec('Projects',body);
  }
  return wrapPaper(html, 'font-family:Inter,Arial,sans-serif;background:#fff;padding:40px 48px;');
}

/* ---- TEMPLATE 10: Elegant ---- */
function tplElegant(d){
  let html = '<div style="text-align:center;margin-bottom:24px;">';
  html += '<div style="font-size:30px;font-weight:400;font-family:Georgia,serif;letter-spacing:2px;color:#1a1a1a;">'+esc(d.personal.fullName||'Your Name')+'</div>';
  if(d.personal.targetRole) html += '<div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:3px;margin-top:4px;">'+esc(d.personal.targetRole)+'</div>';
  html += '<div style="width:60px;height:1px;background:#c9a84c;margin:10px auto;"></div>';
  html += '<div style="font-size:10.5px;color:#888;letter-spacing:0.5px;">'+tplContact(d)+'</div></div>';
  const sec=(title,body)=>'<div style="margin-bottom:18px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;"><div style="height:1px;flex:1;background:#e0c97f;"></div><div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;white-space:nowrap;">'+title+'</div><div style="height:1px;flex:1;background:#e0c97f;"></div></div>'+body+'</div>';
  if(d.summary.trim()) html+=sec('Profile','<p style="font-size:13px;line-height:1.7;margin:0;text-align:center;color:#333;font-style:italic;">'+esc(d.summary)+'</p>');
  if(d.experience.some(e=>e.title||e.company)){
    const body=d.experience.filter(e=>e.title||e.company).map(e=>'<div style="margin-bottom:11px;"><div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:600;font-family:Georgia,serif;"><span>'+esc(e.title)+(e.company?' — '+esc(e.company):'')+'</span><span style="font-size:11px;font-weight:400;color:#888;font-family:Arial,sans-serif;white-space:nowrap;">'+esc(e.startDate)+' – '+esc(e.current?'Present':e.endDate)+'</span></div>'+tplBullets(e.bullets,'margin:4px 0 0 16px;padding:0;font-size:12.5px;line-height:1.55;color:#333;')+'</div>').join('');
    html+=sec('Experience',body);
  }
  if(d.education.some(e=>e.degree||e.institution)){
    const body=d.education.filter(e=>e.degree||e.institution).map(e=>'<div style="text-align:center;margin-bottom:6px;"><div style="font-size:13px;font-weight:600;font-family:Georgia,serif;">'+esc(e.degree)+'</div><div style="font-size:12px;color:#666;">'+esc(e.institution)+' · '+esc(e.startDate)+' – '+esc(e.endDate)+'</div></div>').join('');
    html+=sec('Education',body);
  }
  if(d.skills.trim()) html+=sec('Skills','<p style="font-size:12.5px;margin:0;line-height:1.7;text-align:center;color:#444;">'+esc(d.skills)+'</p>');
  return wrapPaper(html, 'font-family:Georgia,serif;background:#fff;padding:44px 52px;');
}

function wrapPaper(inner, style){
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box;}body{margin:0;padding:0;}ul{list-style:disc;}li{padding:0;}</style></head><body><div style="'+style+'min-height:780px;">'+inner+'</div></body></html>';
}

/* ============================================================
   SCREEN TEMPLATES
   ============================================================ */
function welcomeTemplate(){
  return '<section class="welcome">'
    + '<div class="welcome-meta">SCANLINE · ATS RESUME BUILDER</div>'
    + '<h1>Build a resume the bots will pass — and a human will remember.</h1>'
    + '<p class="welcome-sub">Answer a few questions, or hand over your old resume. Either way, you\'ll get a clean, single-column, ATS-formatted resume you can edit section by section.</p>'
    + '<div class="fork">'
    + '<button class="fork-card" onclick="goImport()">'
      + '<div class="fork-visual existing"><span></span><span></span><span></span><span class="short"></span></div>'
      + '<h3>I already have a resume</h3>'
      + '<p>Paste in your existing text. We\'ll pull out your details so you can review and sharpen them.</p>'
      + '<span class="fork-cta">Use my resume →</span>'
    + '</button>'
    + '<button class="fork-card" onclick="goBlank()">'
      + '<div class="fork-visual blank"></div>'
      + '<h3>Starting from a blank sheet</h3>'
      + '<p>Answer a short series of questions, one at a time, and we\'ll format everything for you.</p>'
      + '<span class="fork-cta">Start fresh →</span>'
    + '</button>'
    + '</div></section>';
}

function importTemplate(){
  const isUpload = state.importTab === 'upload';
  const isPaste  = state.importTab === 'paste';
  return '<section class="import-screen">'
    + '<div class="welcome-meta">STEP 0 · IMPORT</div>'
    + '<h1>Import your resume</h1>'
    + '<p class="welcome-sub">Upload a file or paste text — we\'ll extract your details automatically.</p>'
    + '<div class="import-tabs">'
      + '<button class="import-tab'+(isUpload?' active':'')+'" onclick="setImportTab(\'upload\')">📄 Upload File</button>'
      + '<button class="import-tab'+(isPaste?' active':'')+'" onclick="setImportTab(\'paste\')">📋 Paste Text</button>'
    + '</div>'
    + (isUpload
      ? '<div class="upload-zone" id="uploadZone" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleFileDrop(event)">'
          + '<input type="file" id="fileInput" accept=".pdf,.docx,.doc,.txt,.rtf" onchange="handleFileSelect(event)">'
          + '<div class="upload-icon">📂</div>'
          + '<p><strong>Click to browse</strong> or drag & drop your resume</p>'
          + '<p style="margin-top:6px;font-size:12px;">Supports PDF, Word (.docx), and plain text (.txt)</p>'
          + (state.uploadedFileName ? '<div class="upload-badge">✓ ' + esc(state.uploadedFileName) + '</div>' : '')
        + '</div>'
      : '')
    + (isPaste
      ? '<textarea id="importTextarea" class="import-textarea" placeholder="Paste your resume text here…">' + esc(state.importText) + '</textarea>'
      : '')
    + (state.importError? '<p class="import-error">'+esc(state.importError)+'</p>' : '')
    + '<div class="import-actions">'
    + '<button class="btn-primary" onclick="handleImportSubmit()" '+'>'
      +'Extract my details →</button>'
    + '<button class="btn-text" onclick="goBlank()">Skip — I\'ll fill it in manually</button>'
    + '</div></section>';
}

function wizardTemplate(){
  const railSteps = STEPS.map((s,i)=>{
    const cls = 'rail-step'+(i===state.stepIndex?' current':'')+(i<state.stepIndex?' past':'');
    return '<button class="'+cls+'" onclick="goToStep('+i+')"><span class="rail-num">'+String(i+1).padStart(2,'0')+'</span><span class="rail-label">'+esc(s.label)+'</span></button>';
  }).join('');
  return '<div class="workspace" data-mobile-view="'+state.mobileView+'">'
    + '<div class="mobile-toggle">'
      + '<button class="'+(state.mobileView==='edit'?'active':'')+'" onclick="setMobileView(\'edit\')">Edit</button>'
      + '<button class="'+(state.mobileView==='preview'?'active':'')+'" onclick="setMobileView(\'preview\')">Preview</button>'
    + '</div>'
    + '<aside class="steps-rail">'+railSteps+'</aside>'
    + '<section class="form-pane">'
      + '<div class="form-pane-meta">STEP '+(state.stepIndex+1)+' / '+STEPS.length+' — '+esc(STEPS[state.stepIndex].label.toUpperCase())+'</div>'
      + '<div class="form-pane-body">'+stepContent()+'</div>'
      + '<div class="form-nav">'
        + '<button class="btn-secondary" '+(state.stepIndex===0?'disabled':'')+' onclick="prevStep()">← Back</button>'
        + (state.stepIndex<STEPS.length-1 ? '<button class="btn-primary" onclick="nextStep()">Continue →</button>' : '')
      + '</div>'
    + '</section>'
    + '<section class="preview-pane">'
      + '<div class="preview-header"><span class="preview-label">LIVE PREVIEW</span><div style="display:flex;align-items:center;gap:14px;"><button onclick="goTemplates()" style="font-family:inherit;font-size:12px;font-weight:600;background:transparent;border:1px solid var(--indigo);color:var(--indigo);padding:6px 12px;border-radius:6px;cursor:pointer;">🎨 Templates</button><div class="checklist" id="checklist">'+checklistHTML()+'</div></div></div>'
      + '<div class="paper-wrap"><div class="scan-sweep" id="scanSweep"></div><div class="paper" id="previewPaper">'+buildPreviewHTML(state.data)+'</div></div>'
    + '</section>'
    + '</div>';
}

/* ============================================================
   MASTER RENDER
   ============================================================ */
function renderApp(){
  const app = document.getElementById('app');
  if(state.screen==='welcome') app.innerHTML = welcomeTemplate();
  else if(state.screen==='import') app.innerHTML = importTemplate();
  else if(state.screen==='templates') app.innerHTML = templatesTemplate();
  else app.innerHTML = wizardTemplate();
  afterRender();
}
function afterRender(){
  if(state.screen==='wizard'){
    const el = document.getElementById('scanSweep');
    if(el){ el.classList.remove('sweep'); requestAnimationFrame(()=>el.classList.add('sweep')); }
  }
}

renderApp();
