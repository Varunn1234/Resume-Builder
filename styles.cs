/* ============================================================
   Scanline — ATS Resume Builder  |  styles.css
   ============================================================ */
:root{
    --paper:#F7F5F0;
    --paper-soft:#FFFFFF;
    --ink:#16202B;
    --ink-soft:#5B6B7A;
    --indigo:#2F4D7E;
    --indigo-deep:#1F3559;
    --mist:#DCE3EA;
    --line:#CCD5DE;
    --scan-green:#3F7A5C;
    --scan-green-bg:rgba(63,122,92,0.08);
    --amber:#B9790A;
    --danger:#B3432B;
    --radius:10px;
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;}
  body{
    background:var(--paper);
    color:var(--ink);
    font-family:'Inter',sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  h1,h2,h3{font-family:'Source Serif 4',serif; margin:0; color:var(--ink);}
  p{margin:0;}
  button{font-family:inherit;}
  *:focus-visible{outline:2px solid var(--indigo); outline-offset:2px;}

  /* ---------- Header ---------- */
  .topbar{
    position:sticky; top:0; z-index:20;
    display:flex; align-items:baseline; justify-content:space-between;
    padding:16px 28px;
    background:var(--paper);
    border-bottom:1px solid var(--line);
  }
  .wordmark{font-family:'Source Serif 4',serif; font-weight:700; font-size:20px; letter-spacing:0.2px;}
  .wordmark::after{content:'.'; color:var(--scan-green);}
  .topbar-meta{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:1.2px; color:var(--ink-soft);}

  /* ---------- Welcome ---------- */
  .welcome{max-width:760px; margin:0 auto; padding:64px 24px 80px;}
  .welcome-meta{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:1.6px; color:var(--scan-green); margin-bottom:18px;}
  .welcome h1{font-size:38px; line-height:1.2; font-weight:600; max-width:620px;}
  .welcome-sub{margin-top:18px; color:var(--ink-soft); font-size:16px; line-height:1.6; max-width:560px;}
  .fork{display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:40px;}
  .fork-card{
    text-align:left; background:var(--paper-soft); border:1px solid var(--line); border-radius:var(--radius);
    padding:24px; cursor:pointer; transition:border-color .15s, transform .15s; display:flex; flex-direction:column;
  }
  .fork-card:hover{border-color:var(--indigo); transform:translateY(-2px);}
  .fork-visual{height:110px; border:1px solid var(--line); border-radius:6px; background:#fff; margin-bottom:18px; padding:16px; display:flex; flex-direction:column; gap:8px; justify-content:center; position:relative; overflow:hidden;}
  .fork-visual.existing span{display:block; height:6px; border-radius:3px; background:var(--mist);}
  .fork-visual.existing span.short{width:55%;}
  .fork-visual.blank::after{
    content:''; position:absolute; top:0; right:0; width:0; height:0;
    border-style:solid; border-width:0 22px 22px 0; border-color:transparent var(--mist) transparent transparent;
  }
  .fork-card h3{font-size:18px; margin-bottom:8px;}
  .fork-card p{color:var(--ink-soft); font-size:14px; line-height:1.5; flex:1;}
  .fork-cta{font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:0.4px; color:var(--indigo); margin-top:14px;}
  @media (max-width:680px){ .fork{grid-template-columns:1fr;} .welcome h1{font-size:30px;} }

  /* ---------- Import screen ---------- */
  .import-screen{max-width:680px; margin:0 auto; padding:56px 24px 80px;}
  .import-screen h1{font-size:30px; margin-top:14px;}
  .import-textarea{
    width:100%; min-height:200px; margin-top:0; padding:16px; border-radius:var(--radius);
    border:1px solid var(--line); background:var(--paper-soft); font-family:'IBM Plex Mono',monospace; font-size:13px; line-height:1.6; resize:vertical;
  }
  .import-error{color:var(--danger); font-size:13px; margin-top:10px;}
  .import-actions{display:flex; align-items:center; gap:18px; margin-top:18px; flex-wrap:wrap;}
  .upload-zone{
    border:2px dashed var(--line); border-radius:var(--radius); padding:28px 20px;
    text-align:center; cursor:pointer; transition:border-color .15s, background .15s;
    background:var(--paper-soft); margin-bottom:16px; position:relative;
  }
  .upload-zone:hover,.upload-zone.drag-over{border-color:var(--indigo); background:rgba(47,77,126,0.04);}
  .upload-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
  .upload-icon{font-size:28px; margin-bottom:8px;}
  .upload-zone p{color:var(--ink-soft); font-size:14px; margin:0; line-height:1.5;}
  .upload-zone strong{color:var(--indigo);}
  .upload-badge{display:inline-flex;align-items:center;gap:6px;background:var(--scan-green-bg);border:1px solid var(--scan-green);color:var(--scan-green);border-radius:6px;padding:6px 12px;font-size:13px;margin-top:10px;}
  .or-divider{display:flex;align-items:center;gap:12px;margin:16px 0 12px;color:var(--ink-soft);font-size:13px;}
  .or-divider::before,.or-divider::after{content:'';flex:1;height:1px;background:var(--line);}
  .import-tabs{display:flex;gap:0;margin-bottom:20px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
  .import-tab{flex:1;padding:10px;background:var(--paper-soft);border:none;font-family:inherit;font-size:13.5px;cursor:pointer;color:var(--ink-soft);font-weight:500;}
  .import-tab.active{background:var(--indigo);color:#fff;}

  /* ---------- Buttons ---------- */
  .btn-primary{
    background:var(--indigo); color:#fff; border:none; padding:12px 22px; border-radius:8px;
    font-weight:600; font-size:14px; cursor:pointer; transition:background .15s;
  }
  .btn-primary:hover{background:var(--indigo-deep);}
  .btn-primary:disabled{opacity:.55; cursor:default;}
  .btn-secondary{
    background:transparent; color:var(--indigo); border:1px solid var(--indigo); padding:11px 20px; border-radius:8px;
    font-weight:600; font-size:14px; cursor:pointer; transition:background .15s;
  }
  .btn-secondary:hover{background:rgba(47,77,126,0.08);}
  .btn-secondary:disabled{opacity:.5; cursor:default;}
  .btn-text{background:none; border:none; color:var(--ink-soft); text-decoration:underline; font-size:14px; cursor:pointer; padding:0;}
  .btn-remove{background:none; border:none; color:var(--danger); text-decoration:underline; font-size:12px; cursor:pointer;}
  .btn-add{margin-top:4px;}

  /* ---------- Workspace (wizard) ---------- */
  .workspace{display:grid; grid-template-columns:208px 1fr 1fr; height:calc(100vh - 65px);}
  .mobile-toggle{display:none;}
  .mobile-toggle button{flex:1; padding:12px; background:var(--paper-soft); border:1px solid var(--line); font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:0.6px; cursor:pointer; color:var(--ink-soft);}
  .mobile-toggle button.active{background:var(--indigo); color:#fff; border-color:var(--indigo);}

  .steps-rail{border-right:1px solid var(--line); padding:18px 0; overflow-y:auto;}
  .rail-step{
    display:flex; align-items:center; gap:10px; width:100%; text-align:left; background:none; border:none;
    padding:10px 18px; cursor:pointer; color:var(--ink-soft); border-left:2px solid transparent;
  }
  .rail-num{font-family:'IBM Plex Mono',monospace; font-size:11px;}
  .rail-label{font-size:13px;}
  .rail-step.current{color:var(--ink); border-left-color:var(--indigo); background:rgba(47,77,126,0.06); font-weight:600;}
  .rail-step.past .rail-num::after{content:' ✓'; color:var(--scan-green);}

  .form-pane{border-right:1px solid var(--line); overflow-y:auto; display:flex; flex-direction:column;}
  .form-pane-meta{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:1px; color:var(--ink-soft); padding:20px 28px 0;}
  .form-pane-body{padding:14px 28px 28px; flex:1;}
  .form-nav{display:flex; justify-content:space-between; padding:18px 28px; border-top:1px solid var(--line); background:var(--paper-soft);}

  .step-head{margin-bottom:22px;}
  .step-head h2{font-size:24px; margin-bottom:6px;}
  .step-head p{color:var(--ink-soft); font-size:14px; line-height:1.5;}

  .field-grid{display:grid; grid-template-columns:1fr 1fr; gap:16px 20px; margin-bottom:6px;}
  @media (max-width:560px){ .field-grid{grid-template-columns:1fr;} }
  .field{display:flex; flex-direction:column; gap:6px; margin-bottom:16px;}
  .field-label{font-size:12.5px; font-weight:600; color:var(--ink);}
  .req{color:var(--danger);}
  .field input[type="text"],
  .field input[type="email"],
  .field input[type="tel"],
  .field textarea{
    border:1px solid var(--line); border-radius:7px; padding:10px 12px; font-size:14px; font-family:'Inter',sans-serif;
    background:var(--paper-soft); color:var(--ink);
  }
  .field textarea{resize:vertical; line-height:1.5;}
  .field-help{font-size:11.5px; color:var(--ink-soft);}
  .checkbox-field{flex-direction:row; align-items:center; gap:8px; margin-top:4px;}
  .checkbox-field input{width:16px; height:16px;}
  .checkbox-field span{font-size:13px; color:var(--ink-soft);}

  .entry-card{background:var(--paper-soft); border:1px solid var(--line); border-radius:var(--radius); padding:20px; margin-bottom:18px;}
  .entry-card-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .entry-num{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.8px; color:var(--scan-green);}
  .empty-hint{color:var(--ink-soft); font-style:italic; font-size:13.5px; margin-bottom:14px;}
  .sub-block{margin-top:18px; padding-top:14px; border-top:1px solid var(--line);}
  .sub-block h4{font-family:'Inter',sans-serif; font-size:14px; margin-bottom:12px; color:var(--ink);}
  .entry-card.small{padding:16px;}

  .toggle-row{display:flex; flex-wrap:wrap; gap:14px; margin-bottom:20px;}
  .toggle{display:flex; align-items:center; gap:8px; font-size:14px; background:var(--paper-soft); border:1px solid var(--line); padding:9px 14px; border-radius:7px; cursor:pointer;}
  .toggle input{width:15px; height:15px;}

  .review-grid{display:flex; flex-direction:column; gap:8px; margin:22px 0;}
  .review-row{
    display:flex; align-items:center; gap:10px; text-align:left; width:100%; background:var(--paper-soft);
    border:1px solid var(--line); border-radius:8px; padding:12px 16px; cursor:pointer; font-size:14px; color:var(--ink);
  }
  .review-row .dot{width:8px; height:8px; border-radius:50%; background:var(--mist); flex-shrink:0;}
  .review-row.done .dot{background:var(--scan-green);}
  .review-row .status{margin-left:auto; font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--ink-soft);}
  .review-row.done .status{color:var(--scan-green);}
  .export-actions{display:flex; flex-wrap:wrap; gap:12px; margin:10px 0 20px;}

  /* ---------- Preview pane ---------- */
  .preview-pane{overflow-y:auto; background:#EFEAE2; display:flex; flex-direction:column;}
  .preview-header{display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid var(--line); flex-wrap:wrap; gap:10px;}
  .preview-label{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:1.2px; color:var(--ink-soft);}
  .checklist{display:flex; flex-wrap:wrap; gap:10px;}
  .check-item{font-family:'IBM Plex Mono',monospace; font-size:10.5px; display:flex; align-items:center; gap:4px; color:var(--ink-soft);}
  .check-item.pass{color:var(--scan-green);}
  .check-mark{font-weight:600;}

  .paper-wrap{position:relative; padding:30px; flex:1; display:flex; justify-content:center;}
  .scan-sweep{position:absolute; inset:0; pointer-events:none; overflow:hidden;}
  .scan-sweep::before{
    content:''; position:absolute; left:30px; right:30px; top:-10%; height:10%;
    background:linear-gradient(180deg, rgba(63,122,92,0) 0%, rgba(63,122,92,0.22) 50%, rgba(63,122,92,0) 100%);
    opacity:0;
  }
  .scan-sweep.sweep::before{ animation:sweepMove 1000ms ease-in-out; }
  @keyframes sweepMove{ 0%{top:-10%; opacity:0;} 12%{opacity:1;} 88%{opacity:.6;} 100%{top:104%; opacity:0;} }
  @media (prefers-reduced-motion: reduce){ .scan-sweep.sweep::before{ animation:none !important; opacity:0 !important; } }

  .paper{
    background:#fff; width:100%; max-width:640px; min-height:780px; padding:48px 52px;
    box-shadow:0 4px 18px rgba(20,30,40,0.12); font-family:'Inter',sans-serif; color:#1A1A1A;
  }
  .r-name{font-family:'Source Serif 4',serif; font-size:28px; font-weight:600;}
  .r-contact{font-family:'IBM Plex Mono',monospace; font-size:11px; color:#444; margin-top:6px; margin-bottom:22px;}
  .r-section{margin-bottom:20px;}
  .r-heading{font-size:12.5px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; border-bottom:1px solid #999; padding-bottom:4px; margin-bottom:10px;}
  .r-entry{margin-bottom:12px;}
  .r-entry-top{display:flex; justify-content:space-between; gap:12px; font-size:14px; font-weight:600;}
  .r-entry-date{font-family:'IBM Plex Mono',monospace; font-weight:400; font-size:11.5px; color:#555; white-space:nowrap;}
  .r-entry-sub{font-size:12.5px; color:#555; margin-top:1px;}
  .r-bullets{margin:6px 0 0 18px; padding:0; font-size:13.5px; line-height:1.55;}
  .r-bullets li{margin-bottom:3px;}
  .r-summary{font-size:13.5px; line-height:1.6; margin-top:2px;}

  @media (max-width:1100px){ .steps-rail{display:none;} .workspace{grid-template-columns:1fr 1fr;} }
  @media (max-width:900px){
    .workspace{grid-template-columns:1fr; height:auto;}
    .form-pane,.preview-pane{overflow:visible;}
    .mobile-toggle{display:flex;}
    .workspace[data-mobile-view="edit"] .preview-pane{display:none;}
    .workspace[data-mobile-view="preview"] .form-pane{display:none;}
  }

  /* ---------- Toasts ---------- */
  .toast-root{position:fixed; bottom:22px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; gap:8px; z-index:50; align-items:center;}
  .toast{
    background:var(--ink); color:#fff; padding:11px 18px; border-radius:8px; font-size:13.5px; max-width:420px;
    box-shadow:0 4px 14px rgba(0,0,0,0.2); opacity:1; transition:opacity .3s, transform .3s;
  }
  .toast.ok{background:var(--scan-green);}
  .toast.error{background:var(--danger);}
  .toast.warn{background:var(--amber);}
  .toast.out{opacity:0; transform:translateY(6px);}


  /* ---------- Auth Modal ---------- */
  .auth-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;}
  .auth-modal{background:#fff;border-radius:16px;padding:36px 40px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.25);position:relative;}
  .auth-modal h2{font-size:22px;margin-bottom:6px;}
  .auth-modal p{color:var(--ink-soft);font-size:14px;margin-bottom:24px;}
  .auth-field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
  .auth-field label{font-size:12.5px;font-weight:600;color:var(--ink);}
  .auth-field input{border:1px solid var(--line);border-radius:7px;padding:11px 13px;font-size:14px;font-family:inherit;background:var(--paper-soft);}
  .auth-field input:focus{outline:2px solid var(--indigo);outline-offset:1px;}
  .auth-error{color:var(--danger);font-size:13px;margin-bottom:12px;background:rgba(179,67,43,0.07);padding:8px 12px;border-radius:6px;}
  .auth-switch{font-size:13px;color:var(--ink-soft);margin-top:16px;text-align:center;}
  .auth-switch button{background:none;border:none;color:var(--indigo);font-weight:600;cursor:pointer;font-size:13px;font-family:inherit;}
  .auth-close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--ink-soft);line-height:1;}
  .auth-divider{display:flex;align-items:center;gap:10px;margin:16px 0;color:var(--ink-soft);font-size:12px;}
  .auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--line);}

  /* ---------- Topbar user area ---------- */
  .topbar-user{display:flex;align-items:center;gap:10px;}
  .user-avatar{width:32px;height:32px;border-radius:50%;background:var(--indigo);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}
  .user-menu{position:relative;}
  .user-dropdown{position:absolute;right:0;top:42px;background:#fff;border:1px solid var(--line);border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,0.12);min-width:220px;z-index:50;overflow:hidden;}
  .user-dropdown-head{padding:14px 16px;border-bottom:1px solid var(--line);}
  .user-dropdown-name{font-weight:700;font-size:14px;}
  .user-dropdown-email{font-size:12px;color:var(--ink-soft);}
  .user-dropdown-item{display:flex;align-items:center;gap:10px;padding:11px 16px;font-size:13.5px;cursor:pointer;border:none;background:none;width:100%;text-align:left;font-family:inherit;color:var(--ink);}
  .user-dropdown-item:hover{background:var(--scan-green-bg);}
  .user-dropdown-item.danger{color:var(--danger);}
  .user-dropdown-item.danger:hover{background:rgba(179,67,43,0.06);}

  /* ---------- Dashboard ---------- */
  .dashboard{max-width:860px;margin:0 auto;padding:52px 24px 80px;}
  .dashboard h1{font-size:30px;margin-bottom:4px;}
  .dash-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:28px 0;}
  .dash-stat{background:var(--paper-soft);border:1px solid var(--line);border-radius:10px;padding:20px 22px;}
  .dash-stat-num{font-size:28px;font-weight:700;color:var(--indigo);}
  .dash-stat-label{font-size:12.5px;color:var(--ink-soft);margin-top:2px;}
  .dash-resumes{margin-top:28px;}
  .dash-resumes h3{font-size:17px;margin-bottom:14px;}
  .dash-resume-row{display:flex;align-items:center;gap:14px;background:var(--paper-soft);border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin-bottom:10px;cursor:pointer;transition:border-color .15s;}
  .dash-resume-row:hover{border-color:var(--indigo);}
  .dash-resume-icon{font-size:22px;}
  .dash-resume-info{flex:1;}
  .dash-resume-name{font-size:14px;font-weight:600;}
  .dash-resume-meta{font-size:12px;color:var(--ink-soft);margin-top:2px;}
  .dash-resume-actions{display:flex;gap:8px;}
  .dash-empty{color:var(--ink-soft);font-size:14px;padding:24px;text-align:center;border:2px dashed var(--line);border-radius:10px;}
  .apikey-section{margin-top:28px;padding:20px 22px;background:var(--paper-soft);border:1px solid var(--line);border-radius:10px;}
  .apikey-section h3{font-size:15px;margin-bottom:8px;}
  .apikey-row{display:flex;gap:10px;margin-top:10px;}
  .apikey-row input{flex:1;border:1px solid var(--line);border-radius:7px;padding:9px 12px;font-size:13px;font-family:monospace;background:#fff;}
  @media(max-width:600px){.dash-stats{grid-template-columns:1fr 1fr;}}

  /* ---------- Template Picker ---------- */
  .tpl-screen{max-width:1100px; margin:0 auto; padding:52px 24px 80px;}
  .tpl-screen h1{font-size:32px; margin-top:12px; margin-bottom:6px;}
  .tpl-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:22px; margin-top:32px;}
  .tpl-card{background:var(--paper-soft); border:2px solid var(--line); border-radius:12px; padding:0; cursor:pointer; transition:border-color .15s, transform .15s; overflow:hidden; display:flex; flex-direction:column;}
  .tpl-card:hover{border-color:var(--indigo); transform:translateY(-3px); box-shadow:0 6px 20px rgba(47,77,126,0.12);}
  .tpl-card.selected{border-color:var(--indigo); box-shadow:0 0 0 3px rgba(47,77,126,0.18);}
  .tpl-thumb{height:200px; overflow:hidden; position:relative;}
  .tpl-thumb iframe{width:200%; height:200%; transform:scale(0.5); transform-origin:top left; pointer-events:none; border:none; background:#fff;}
  .tpl-info{padding:14px 16px 16px;}
  .tpl-name{font-size:14px; font-weight:700; margin-bottom:3px;}
  .tpl-desc{font-size:12px; color:var(--ink-soft); line-height:1.4;}
  .tpl-badge{display:inline-block; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.5px; padding:3px 7px; border-radius:4px; margin-top:6px;}
  .tpl-badge.popular{background:rgba(185,121,10,0.12); color:var(--amber);}
  .tpl-badge.modern{background:var(--scan-green-bg); color:var(--scan-green);}
  .tpl-badge.classic{background:rgba(47,77,126,0.1); color:var(--indigo);}
  .tpl-actions{display:flex; gap:14px; margin-top:28px; align-items:center; flex-wrap:wrap;}
  .tpl-selected-label{font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--ink-soft);}
  @media(max-width:600px){.tpl-grid{grid-template-columns:1fr 1fr;}}

  /* ---------- Print ---------- */
  @media print{
    body *{visibility:hidden;}
    .paper, .paper *{visibility:visible;}
    .paper{position:absolute; top:0; left:0; width:100%; box-shadow:none; padding:0;}
  }
