/* Chronological story / execution workspace. Originals and return storage remain intact. */
const timelineBeats=studioTimeline.scenes.flatMap(s=>s.beats);
const timelineStorageKey='caelus-timeline-v1-approvals';
let timelineApprovals={},timelineStorageAvailable=true,timelineScene='all',timelineSelected='S01-01';
try {const saved=JSON.parse(localStorage.getItem(timelineStorageKey)||'{}');if(saved && typeof saved==='object' && !Array.isArray(saved))timelineApprovals=saved;}catch(_){timelineStorageAvailable=false;}
const timelineEsc=sketchEscape;
function timelineSignature(b){return (b.candidate_frames||[]).map(f=>f.sha256).join(':');}
function timelineApproved(b){return !!(b.candidate_frames?.length && timelineApprovals[b.id]?.signature===timelineSignature(b));}
function saveTimelineApproval(){try{localStorage.setItem(timelineStorageKey,JSON.stringify(timelineApprovals));}catch(_){timelineStorageAvailable=false;toast('本次确认仅保留在当前页面；本机存储不可用。');}}
function timelinePanel(f,label){
 const c=f.crop||{x:0,y:0,width:f.width,height:f.height};
 return `<svg viewBox="${c.x} ${c.y} ${c.width} ${c.height}" role="img" aria-label="${timelineEsc(label)}"><image href="${timelineEsc(f.src)}" width="${f.sheet_width||f.width}" height="${f.sheet_height||f.height}"/></svg>`;
}
const timelineDialog=document.createElement('dialog');timelineDialog.id='timelineDialog';document.body.append(timelineDialog);
function timelinePreview(id,index,kind){
 const b=timelineBeats.find(x=>x.id===id);const f=kind==='candidate'?b.candidate_frames[index]:b.frames[index];
 timelineDialog.innerHTML=`<div class="tl-dialog-head"><strong>${timelineEsc(id+' · '+f.caption)}</strong><button onclick="timelineDialog.close()">关闭 ✕</button></div><div class="tl-preview">${timelinePanel(f,f.caption)}</div><p>${kind==='candidate'?'写实候选 · 查看不等于允许替换':'导演草图 · 表达构图和动作，不锁定材质及精确姿态'}</p>`;timelineDialog.showModal();
}
function timelineReviewCandidates(id){
 const b=timelineBeats.find(x=>x.id===id);if(!b?.candidate_frames?.length)return;
 timelineDialog.innerHTML=`<div class="tl-dialog-head"><strong>${timelineEsc(id)} · 审阅具体写实候选</strong><button onclick="timelineDialog.close()">关闭 ✕</button></div><p>以下 ${b.candidate_frames.length} 张图将替换本段 Canvas 草图。Storyboard 保留简笔画，历史草图与文件保留。确认只适用于这组图像。</p><div class="tl-candidate-grid">${b.candidate_frames.map(f=>`<figure>${timelinePanel(f,f.caption)}<figcaption>${timelineEsc(f.caption)}</figcaption></figure>`).join('')}</div><div class="tl-dialog-actions"><button onclick="timelineDialog.close()">保留草图</button><button class="primary" onclick="timelineApprove('${id}')">我同意用这组写实帧替换本段 Canvas</button></div>`;
 timelineDialog.showModal();
}
function timelineApprove(id){const b=timelineBeats.find(x=>x.id===id);if(!b?.candidate_frames?.length)return;timelineApprovals[id]={signature:timelineSignature(b),at:new Date().toISOString(),method:'explicit_user_button',count:b.candidate_frames.length};saveTimelineApproval();timelineDialog.close();render();toast('已按你的确认替换 '+id+'；可随时恢复草图。');}
function timelineRevoke(id){delete timelineApprovals[id];saveTimelineApproval();render();toast('已恢复本段执行草图，写实候选仍保留。');}
function timelineSelect(id){timelineSelected=id;document.querySelectorAll('.tl-row').forEach(el=>el.classList.toggle('is-selected',el.dataset.beat===id));}
function timelineFilter(value){timelineScene=value;render();}
function timelineCandidateLink(b){return b.candidate_frames?.length?`<button onclick="timelineReviewCandidates('${b.id}')">审阅 ${b.candidate_frames.length} 张写实候选</button>`:`<span class="tl-muted">${timelineEsc(b.candidate_status_note||'写实帧尚未制作 · 替换需你确认')}</span>`;}
function timelinePackageLinks(b){
 const ts=b.candidate_tasks;
 if(ts?.length)return ts.map(t=>`<a class="tl-download" href="${timelineEsc(t.package)}" download>${timelineEsc(t.title)} · ${t.duration_seconds} 秒 ↓</a>`).join(' · ');
 return b.candidate_handoff?.package?`<a class="tl-download" href="${timelineEsc(b.candidate_handoff.package)}" download>下载关键帧＋提示词 ↓</a>`:'';
}
function timelineReturn(v){return `<section class="returned-version"><strong>${timelineEsc(v.name)}</strong><p>${v.persisted?'已存本机':'本次会话'}</p><video controls preload="none" src="${timelineEsc(v.url)}"></video><label>来源平台 <input value="${timelineEsc(v.provider||'')}" onchange="updateClipInfo('${v.id}','provider',this.value)"></label><label>审阅备注 <textarea onchange="updateClipInfo('${v.id}','notes',this.value)">${timelineEsc(v.notes||'')}</textarea></label><label>版本状态 <select onchange="setClipReview('${v.id}',this.value)">${[['pending','待审阅'],['adopted','采用此版本'],['revise','需调整']].map(([key,label])=>`<option value="${key}" ${v.review===key?'selected':''}>${label}</option>`).join('')}</select></label><a href="${timelineEsc(v.url)}" download="${timelineEsc(v.name)}">下载原视频 ↓</a></section>`;}
function timelineExecution(b){
 const approved=timelineApproved(b),fs=approved?b.candidate_frames:b.frames;
 const frameHtml=fs.map((f,i)=>`<figure class="tl-frame"><div class="tl-frame-meta"><b>${String(i+1).padStart(2,'0')}</b><span>${i===0?'起始':i===fs.length-1?'结束': '中间'} · ${approved?'已确认写实帧':'执行草图'}</span></div><button class="tl-image" onclick="timelinePreview('${b.id}',${i},'${approved?'candidate':'sketch'}')">${timelinePanel(f,f.caption)}</button><figcaption>${f.task_label?`<small class="tl-task">${timelineEsc(f.task_label)}</small>`:''}${timelineEsc(f.caption)}</figcaption>${i>0?`<span class="tl-relation">${timelineEsc(approved?(b.candidate_relations?.[i]||b.relations[i]||'连续变化'):(b.relations[i]||'连续变化'))}</span>`:''}</figure>`).join('');
 let returns='';const legacyIndex=shots.findIndex(s=>s.id===b.id);
 if(legacyIndex>=0){const returned=clipsFor(legacyIndex); if(b.adopted_take||returned.length) returns=`<details class="tl-history"><summary>已有视频与回传记录</summary>${b.adopted_take?`<p>历史已采用视频 · ${b.adopted_take.duration_seconds} 秒 · 不作为新关键帧生成输入</p><video controls preload="none" src="${timelineEsc(b.adopted_take.video)}"></video>`:''}${returned.map(timelineReturn).join('')}</details>`;}
 return `<div class="tl-execution"><div class="tl-exec-head"><span class="tl-stage ${approved?'ready':''}">${approved?'写实帧 · 已获替换许可':'草图规划'}</span><span>${fs.length} 帧 · ${timelineEsc(b.task_note||'1 个生成任务')}</span></div><p class="tl-camera">${timelineEsc(b.camera)}</p><div class="tl-frames">${frameHtml}</div>${b.lighting_note?`<p class="tl-lighting"><b>灯光</b> ${timelineEsc(b.lighting_note)}</p>`:''}<p class="tl-continuity"><b>衔接</b> ${timelineEsc(b.continuity)}</p><div class="tl-exec-footer"><span>${b.candidate_tasks?.length>1?b.candidate_tasks.map(t=>t.title+' '+t.duration_seconds+' 秒').join(' · '):(b.duration_seconds?'建议生成 '+b.duration_seconds+' 秒':'生成时长待执行方案确认')}${b.edit_duration?' · 计划剪辑 '+b.edit_duration+' 秒':''}</span><div>${approved?`<button onclick="timelineRevoke('${b.id}')">恢复草图</button>`:timelineCandidateLink(b)}</div></div>${b.candidate_handoff?`<div class="tl-delivery"><p>${timelinePackageLinks(b)}</p><small>下载试拍包不自动采用写实图。${timelineEsc(b.edit_note||'')}</small></div>`:''}${legacyIndex>=0?`<button class="tl-return" onclick="importResult(${legacyIndex})">导入本段视频回传 ↑</button>`:''}${returns}</div>`;
}
function timelineStory(b){
 const f=b.frames[b.story_frame||0];
 return `<article class="tl-story"><div class="tl-story-top"><span>${b.id}</span><small>Storyboard · 叙事草图</small></div><button class="tl-image tl-story-image" onclick="timelinePreview('${b.id}',${b.story_frame||0},'sketch')">${timelinePanel(f,b.title)}</button><div class="tl-story-copy"><h3>${timelineEsc(b.title)}</h3><p class="tl-purpose">${timelineEsc(b.purpose)}</p><dl><dt>地点</dt><dd>${timelineEsc(b.location)}</dd><dt>动作</dt><dd>${timelineEsc(b.action)}</dd><dt>镜头</dt><dd>${timelineEsc(b.camera)}</dd>${b.lighting_note?`<dt>灯光</dt><dd>${timelineEsc(b.lighting_note)}</dd>`:''}${b.dialogue.length?`<dt>对白</dt><dd>${b.dialogue.map(([who,line])=>`<p><b>${timelineEsc(who)}</b>「${timelineEsc(line)}」</p>`).join('')}</dd>`:''}${b.ar.length?`<dt>后期</dt><dd>${b.ar.map(t=>timelineEsc(t)).join('<br>')}</dd>`:''}</dl>${b.note?`<p class="tl-note">${timelineEsc(b.note)}</p>`:''}</div></article>`;
}
render=function renderChronologicalStudio(){
 const board=document.getElementById('board');board.className='timeline-workspace';board.style.gridTemplateColumns='';
 const scenes=studioTimeline.scenes.filter(s=>timelineScene==='all'||s.id===timelineScene);
 board.innerHTML=`<div class="tl-toolbar"><label>浏览范围 <select aria-label="浏览场景" onchange="timelineFilter(this.value)"><option value="all">全部 · ${studioTimeline.scenes.length} 场景</option>${studioTimeline.scenes.map(s=>`<option value="${s.id}" ${timelineScene===s.id?'selected':''}>${s.id} · ${timelineEsc(s.title)}</option>`).join('')}</select></label><span>草图先规划 · 写实替换需你确认</span><a href="timeline-v1/storyboard-review.html">全片草图总览 ↗</a></div><div class="tl-column-head"><span>故事时间 ↓</span><div><b>Storyboard</b><small>讲什么 · 故事、情绪与对白</small></div><div><b>Canvas</b><small>怎么生成 · 有顺序的执行帧，每任务最多 10 张</small></div></div>${scenes.map(s=>`<section class="tl-scene" id="tl-scene-${s.id}"><div class="tl-scene-heading"><span>SCENE ${s.id}</span><h2>${timelineEsc(s.title)}</h2><p>${timelineEsc(s.location)}</p></div>${s.beats.map(b=>`<div class="tl-row ${timelineSelected===b.id?'is-selected':''}" data-beat="${b.id}" onclick="timelineSelect('${b.id}')"><aside class="tl-time"><span class="tl-dot"></span><strong>${timelineEsc(b.time)}</strong><span class="time-chip ${b.mode.includes('子弹')?'bullet':b.mode==='时间加速'?'fast':'normal'}">${timelineEsc(b.mode)}</span><small>${timelineEsc(b.transition)}</small></aside>${timelineStory(b)}${timelineExecution(b)}</div>`).join('')}</section>`).join('')}<p class="tl-end">${timelineBeats.length?"故事结束":"尚无故事段；先明确影片目标，再准备 Storyboard。"}</p>`;
 refreshProductionSummary();
};
refreshProductionSummary=function(){document.getElementById('productionSummary').textContent=`${studioTimeline.scenes.length} 场景 · ${timelineBeats.length} 叙事段 · ${timelineBeats.filter(timelineApproved).length} 段已获写实替换许可`;document.getElementById('productionStorage').textContent=studioStorageNote || (timelineStorageAvailable?'Canvas 默认草图；确认绑定具体候选图。本机确认与历史视频各自保留。':'本机存储不可用；确认仅保留在本次会话。');};
productionBanner.querySelector('strong').textContent='同一条时间线 · 叙事与执行横向对齐';
productionBanner.querySelector('.production-links').innerHTML=studioTimeline.scenes.length===0?'<button onclick="exportStudioReview()">导出审阅记录 ↓</button>':'<a href="timeline-v1/storyboard-review.html">全片分镜总览 ↗</a><a href="blender-review-r8/index.html">卧室写实候选 ↗</a><a href="morning-reveal-r12/index.html">05 晨光揭示 · 10秒更新 ↗</a><a href="day-keyframes-r10/index.html">其余场景关键帧与制作包 ↗</a><button onclick="exportStudioReview()">历史视频审阅记录 ↓</button>';
document.querySelector('header .badge').textContent='全片分镜 · 执行帧规划';
document.querySelector('.scenehead .small').textContent='全片制作 / '+(studioTimeline.title||'新影片');
document.querySelector('.scenehead h1').textContent=studioTimeline.title||'新影片';
document.querySelector('.scenehead p').textContent=`纵向读故事，横向看执行 · ${studioTimeline.scenes.length} 场景 · ${timelineBeats.length} 个叙事段`;
document.querySelector('.scenehead .badge').textContent='导演简笔草图 · 待审阅';
document.getElementById('scene').textContent='全片草图总览 ↗';document.getElementById('scene').onclick=()=>{location.href='timeline-v1/storyboard-review.html';};
creationRules.splice(0,creationRules.length,...studioTimeline.rules);
ruleTab.onclick=()=>{
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b===ruleTab));document.getElementById('board').style.display='none';const other=document.getElementById('other');other.style.display='block';
 other.innerHTML=`<div class="rulebook"><div class="eyebrow muted">拍摄工作室 · 当前创作约定</div><h2>讲清故事，再准备执行帧</h2><p class="intro">Storyboard 是叙事层，Canvas 是执行层。二者按同一条纵向时间线对齐；草图先沟通，写实关键帧经 Frank 确认后替换。</p><span class="badge">${timelineEsc(studioTimeline.contract_version)}</span><table class="tl-rule-table"><thead><tr><th>层次</th><th>负责什么</th><th>交付</th></tr></thead><tbody><tr><td>Storyboard</td><td>故事意图、动作、机位、对白、后期</td><td>导演简笔草图＋配字</td></tr><tr><td>Canvas</td><td>具体生成任务、帧顺序、切镜与连续性</td><td>草图规划 → 明确许可 → 写实关键帧</td></tr><tr><td>素材母体</td><td>产品、人物、家具外观与结构</td><td>Codex 做静态帧时使用</td></tr><tr><td>视频制作包</td><td>外部模型独立理解本次生成</td><td>关键帧＋一个简短英文 prompt.txt</td></tr></tbody></table>${timelineVisualBaseline()}<div class="rule-list">${creationRules.map((r,i)=>`<article class="creation-rule"><h3><span class="rule-number">${String(i+1).padStart(2,'0')}</span>${timelineEsc(r[0])}</h3><p>${timelineEsc(r[1])}</p></article>`).join('')}</div><p class="rule-note">旧版单首帧／三类素材混合包保留作历史参考，不再作为当前关键帧工作流的默认导出方式。草图、写实候选、替换许可、视频采用是不同状态。</p></div>`;
};
const tlBoardTab=document.querySelector('nav button[data-tab="制作看板"]');tlBoardTab.onclick=()=>{document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b===tlBoardTab));document.getElementById('other').style.display='none';document.getElementById('board').style.display='';render();};
const tlSceneTab=document.querySelector('nav button[data-tab="场景"]');
tlSceneTab.onclick=()=>{document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b===tlSceneTab));document.getElementById('board').style.display='none';const other=document.getElementById('other');other.style.display='block';other.innerHTML=`<div class="rulebook"><h2>一天的故事空间</h2><p class="intro">${studioTimeline.scenes.length} 个场景按故事顺序展开。草图只建立叙事与空间关系，写实空间随关键帧单独审阅。</p><div class="tl-scene-grid">${studioTimeline.scenes.map(s=>`<article><h3>${s.id} · ${timelineEsc(s.title)}</h3>${timelinePanel(s.beats[0].frames[0],s.title)}<p>${timelineEsc(s.location)} · ${s.beats.length} 个叙事段</p><p>${timelineEsc(s.beats[0].time)} → ${timelineEsc(s.beats.at(-1).time)}</p><button onclick="timelineScene='${s.id}';tlBoardTab.click();productionBanner.style.display=''">查看这一段故事与执行帧 →</button></article>`).join('')}</div></div>`;};
// Keep approved screenplay and asset/history tabs; hide the production banner on other pages.
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>{productionBanner.style.display=b.dataset.tab==='制作看板'?'':'none';}));
render();
function timelineVisualBaseline(){
 const p=studioTimeline.visual_policy; if(!p?.style_reference)return "";
 return `<section class="tl-baseline"><h3>共同视觉基准</h3><p class="tl-lighting"><b>只有正面平整圆形磨砂扩散片发光。</b> 灯头外壳不透明、不自发光；无可见灯泡、空腔或独立亮点。Scene 01 保持 1–2 档状态呼吸。</p><div class="tl-baseline-grid"><figure><img src="${p.style_reference}" alt="Frank 认可的写实卧室风格参考"><figcaption>摄影质感参考 · 忽略摆锤；构图与动作服从当前分镜</figcaption></figure><figure><img src="fresh-keyframes-r7/sources/07_four_brightness_levels_numbered.png" alt="灯面亮度四档参考"><figcaption>Scene 01 只取 1–2 档低亮呼吸 · 3–4 档不用于本场景</figcaption></figure></div><p>每次含灯关键帧均须调用 caelus-blender 复核；缺少匹配参考或复核失败时，必须先用 <b>caelus-blender</b> 从真实模型补出静态图，查看通过后再输入关键帧生成。通用产品图不等于姿态已有依据。<a href="blender-review-r8/index.html#references">查看卧室姿态／视角与低亮对照</a>。<a href="day-keyframes-r10/index.html#references">查看后续场景新增静态参考</a>。pre-R7 旧关键帧已退役；外部提示词统一用 <b>the lamp</b>。</p></section>`;
}
scriptTab.onclick=()=>{
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b===scriptTab));document.getElementById('board').style.display='none';const el=document.getElementById('other');el.style.display='block';
 el.innerHTML=`<div class="rulebook"><h2>一天的陪伴 · 当前剧本</h2><p>与 Storyboard 同源 · ${timelineEsc(studioTimeline.contract_version)}</p>${studioTimeline.scenes.map(s=>`<section><h3>${s.id} · ${timelineEsc(s.title)}</h3>${s.beats.map(b=>`<article class="script-beat"><div class="time-heading"><b>${timelineEsc(b.mode)}</b><span>${timelineEsc(b.time)}</span></div><h4>${timelineEsc(b.title)}</h4><p>${timelineEsc(b.action)}</p>${b.lighting_note?`<p class="tl-lighting">${timelineEsc(b.lighting_note)}</p>`:''}${b.dialogue.map(([who,t])=>`<p><b>${timelineEsc(who)}</b>「${timelineEsc(t)}」</p>`).join('')}${b.ar.length?`<p class="script-direction">后期：${b.ar.map(timelineEsc).join(' / ')}</p>`:''}</article>`).join('')}</section>`).join('')}</div>`;
};
const timelineAssetsTab=document.querySelector('nav button[data-tab="角色与素材"]');
timelineAssetsTab.onclick=()=>{
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b===timelineAssetsTab));document.getElementById('board').style.display='none';const el=document.getElementById('other');el.style.display='block';
 el.innerHTML=`<div class="rulebook"><h2>角色与素材 · 做帧的来源</h2>${timelineVisualBaseline()}<p>产品结构：Blender 母体。构图、动作与节奏：Storyboard＋配字。具体空间与姿态：新批次关键帧。以下母体用于 Codex 制作静态帧，外部视频包只交关键帧与一个提示词。</p><div class="tl-baseline-grid">${(studioTimeline.visual_policy?.hero_sources||[]).map(s=>`<figure><img src="${timelineEsc(s.preview)}" alt="${timelineEsc(s.path.split('/').pop())}"><figcaption>${timelineEsc(s.path.split('/').pop())}</figcaption><small>${timelineEsc(s.path)}</small></figure>`).join('')}</div><p>pre-R7 旧图、旧包和历史视频保留恢复；本轮已查看的候选只提供连续性，每次含灯生成仍附原始 hero 与匹配姿态。</p></div>`;
};
// Prevent the legacy mixed-asset exporter from serving obsolete packages.
openPackage=function(i){const b=timelineBeats.find(b=>b.id===shots[i]?.id);if(!b)return;if(!b.candidate_frames?.length){toast('本段正在按当前分镜与母体重建，旧包已退役。');return;}timelineReviewCandidates(b.id);};
