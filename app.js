const cfg=window.VICTORIA_CONFIG||{};
const palettes=[['#2c3a5d','#8c99aa','#a7bccf','#dabd9d','#fdf7f3'],['#688277','#323c60','#395a79','#82c3e3','#b6d7e8']];
const pages=[
['UNA CARTA PARA LA ALTA SOCIEDAD','Queridos lectores','En esta distinguida temporada, ha llegado el momento de compartir una noticia que merece ser anunciada con especial emoción. Entre encuentros memorables y nuevas ilusiones, una celebración muy esperada está por comenzar.'],
['UNA OCASIÓN EXTRAORDINARIA','Victoria','Con inmensa alegría, Victoria Cambronero se prepara para celebrar sus quince años. Será una ocasión llena de encanto, gratitud y momentos entrañables, que desea compartir con quienes ocupan un lugar especial en su vida.'],
['UNA INVITACIÓN PERSONAL','Con gran honor','Mis padres y yo tenemos el placer de invitarte a acompañarnos en esta celebración tan significativa. Nos haría muy felices contar con tu presencia y compartir juntos una tarde que guardaremos con especial cariño.'],
['LOS DETALLES DEL ENCUENTRO','Una fecha para recordar','La celebración tendrá lugar el sábado 12 de diciembre de 2026, a las 3:00 p. m. Agradecemos tu puntualidad para disfrutar desde el inicio de esta ocasión tan especial.'],
['EL LUGAR DE LA CELEBRACIÓN','Nuestro destino','Hemos elegido un lugar especial para reunirnos y celebrar esta nueva etapa. Para facilitar tu llegada, podrás consultar la ubicación exacta y las indicaciones de camino directamente en Waze.'],
['CÓDIGO DE VESTIMENTA','Elegancia y distinción','Para acompañar la atmósfera de esta celebración, te solicitamos vestir de manera formal y elegante. Los siguientes colores están reservados y NO DEBEN UTILIZARSE en la vestimenta de los invitados. Agradecemos que elijas tonos diferentes.'],
['EL HONOR DE TU COMPAÑÍA','Esperamos contar contigo','Cada presencia hará aún más significativo este encuentro. Te agradeceremos confirmar tu asistencia con anticipación, de modo que podamos preparar cada detalle con la atención y el cariño que merece esta ocasión.'],
['CONFIRMACIÓN DE ASISTENCIA','Tu confirmación','Será un verdadero placer contar con tu presencia. Te agradecemos confirmar tu asistencia escribiendo tu nombre y apellido. Si tu invitación incluye un acompañante, podrás agregar también sus datos.']
];
const $=id=>document.getElementById(id);
let spread=-1,locked=false,capacity=0;
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>$('toast').classList.remove('show'),4000)}
function page(i){if(i>=pages.length)return '<div class="eyebrow">FIN DE ESTE CAPÍTULO</div><h2>Hasta pronto</h2><p>Será un honor compartir este día contigo.</p>';
const [k,t,b]=pages[i];let ext='';

if(i===4)ext='<button class="paper-button" type="button" id="wazeButton">Abrir Waze ↗</button>';
if(i===5)ext='<div class="palette">'+palettes.flat().map(c=>`<span class="swatch" style="--c:${c}" title="${c}"></span>`).join('')+'</div>';
if(i===7)ext=`<form class="rsvp" id="rsvpForm"><label for="guestName">Nombre y apellido</label><input id="guestName" name="guestName" placeholder="Escribí tu nombre completo" autocomplete="name" maxlength="80" required><button type="button" class="companion-toggle" id="addCompanion" aria-expanded="false" aria-controls="companionWrap"><span class="plus" aria-hidden="true">＋</span> ¿Asistirás con acompañante?</button><div id="companionWrap" hidden><label for="companionName">Nombre y apellido del acompañante</label><input id="companionName" name="companionName" placeholder="Nombre completo del acompañante" autocomplete="off" maxlength="80"></div><button class="paper-button" type="submit" id="submitRsvp">Confirmar asistencia</button><small class="rsvp-message" id="rsvpStatus" aria-live="polite"></small></form>`;
return `<span class="eyebrow">${k}</span><div class="flower">❦</div><h2 class="${i===1?'script':''}">${t}</h2><p>${b}</p>${ext}`}

const spreads=[[0,1],[2,3],[4,5],[6,7]];
function renderPair(i){const pair=spreads[i];$('left').innerHTML='<section class="pagecontent">'+page(pair[0])+'</section>';$('right').innerHTML='<section class="pagecontent">'+page(pair[1])+'</section>';wire();}
function navUpdate(){ $('counter').textContent=spread<0?'Portada':`${spread+1} / ${spreads.length}`;$('prev').disabled=locked||spread<0;$('next').disabled=locked||spread>=spreads.length-1;$('next').textContent=spread<0?'Abrir libro ›':'Siguiente ›';}
function turn(dir){if(locked)return;const target=spread+dir;if(target<0||target>=spreads.length)return;
 locked=true;stopNarration();startMusic();navUpdate();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(spread===-1){spread=0;renderPair(0);$('book').classList.remove('closed');$('book').classList.add('opening');requestAnimationFrame(()=>requestAnimationFrame(()=>{$('cover').classList.add('open')}));setTimeout(()=>{$('book').classList.remove('opening');$('book').classList.add('opened');locked=false;navUpdate();startNarrationForCurrentPage()},reduced?70:2400);return}
 const old=spread;const f=$('flip');f.style.display='block';f.className='flip';
 if(dir===1){$('flipfront').innerHTML='<section class="pagecontent">'+page(spreads[old][1])+'</section>';$('flipback').innerHTML='<section class="pagecontent">'+page(spreads[target][0])+'</section>';renderPair(target);void f.offsetWidth;f.classList.add('moving')}
 else{f.classList.add('reverse');$('flipfront').innerHTML='<section class="pagecontent">'+page(spreads[target][1])+'</section>';$('flipback').innerHTML='<section class="pagecontent">'+page(spreads[old][0])+'</section>';renderPair(target);void f.offsetWidth;f.classList.add('moving')}
 spread=target;navUpdate();setTimeout(()=>{f.style.display='none';f.className='flip';locked=false;navUpdate();startNarrationForCurrentPage()},reduced?60:1300)
}
$('prev').onclick=()=>turn(-1);$('next').onclick=()=>turn(1);
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowRight')turn(1);if(e.key==='ArrowLeft')turn(-1)});
let sx=null;$('stage').addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX},{passive:true});$('stage').addEventListener('touchend',e=>{if(sx===null)return;let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)turn(dx<0?1:-1);sx=null},{passive:true});
function wire(){const w=$('wazeButton');if(w)w.onclick=()=>window.open(cfg.wazeUrl,'_blank','noopener,noreferrer');if($('rsvpForm'))setupRsvp()}
function setupRsvp(){
 const form=$('rsvpForm'),name=$('guestName'),status=$('rsvpStatus'),wrap=$('companionWrap'),comp=$('companionName'),toggle=$('addCompanion');
 if(!form||form.dataset.ready)return;form.dataset.ready='1';
 toggle.onclick=()=>{const show=wrap.hidden;wrap.hidden=!show;toggle.setAttribute('aria-expanded',String(show));toggle.querySelector('.plus').textContent=show?'−':'＋';comp.required=show;if(!show)comp.value='';};
 form.onsubmit=async e=>{
  e.preventDefault();const first=name.value.trim().replace(/\s+/g,' '),second=wrap.hidden?'':comp.value.trim().replace(/\s+/g,' ');
  const valid=x=>x.length>=5&&x.length<=80&&x.split(' ').length>=2&&/^[\p{L}\p{M} .'-]+$/u.test(x);
  if(!valid(first)||second&&!valid(second)){status.textContent='Por favor, escribí el nombre y apellido completos.';return;}
  if(second&&first.toLocaleLowerCase('es')===second.toLocaleLowerCase('es')){status.textContent='Los dos asistentes deben tener nombres diferentes.';return;}
  if(!cfg.firebase||!cfg.firebase.apiKey||cfg.firebase.apiKey.startsWith('PEGA_')){status.textContent='La conexión de confirmaciones todavía no está configurada.';return;}
  const btn=$('submitRsvp');btn.disabled=true;status.textContent='Registrando tu confirmación…';
  try{
    if(!window.firebase)throw Error('No se pudo cargar Firebase. Revisá tu conexión a Internet.');
    if(!firebase.apps.length)firebase.initializeApp(cfg.firebase);
    let user=firebase.auth().currentUser;
    if(!user)user=(await firebase.auth().signInAnonymously()).user;
    await firebase.database().ref('confirmaciones/'+user.uid).set({nombre:first,acompanante:second||'',fecha:firebase.database.ServerValue.TIMESTAMP});
    status.textContent='Tu asistencia ha quedado confirmada. ¡Te esperamos!';btn.textContent='Asistencia confirmada';toast('Confirmación registrada');
  }catch(err){
    status.textContent=err.code==='PERMISSION_DENIED'||err.code==='permission_denied'?'Esta invitación ya fue confirmada desde este navegador, o las reglas de Firebase no permiten guardarla.':'No fue posible registrar la confirmación. Revisá Firebase y volvé a intentarlo.';
    console.error('Firebase RSVP:',err);btn.disabled=false;
  }
 };
}
// Audio: el navegador puede bloquear el autoplay sin interacción.
// Se intenta al cargar y se reintenta en la primera interacción permitida.
const music=new Audio(cfg.musicFile||'assets/musica.mp3');
music.loop=true;music.volume=.22;music.preload='auto';
let musicEnabled=true;
const musicButton=$('music');
function updateMusicButton(){
 musicButton.textContent=musicEnabled?'Ⅱ Quitar música':'♫ Activar música';
 musicButton.setAttribute('aria-pressed',String(musicEnabled));
}
async function startMusic(){
 if(!musicEnabled||!music.paused)return;
 try{await music.play()}catch(e){/* Se reintentará en el primer gesto del visitante. */}
}
musicButton.onclick=()=>{
 musicEnabled=!musicEnabled;
 if(musicEnabled)startMusic();else music.pause();
 updateMusicButton();
};
updateMusicButton();
// La narración arranca al abrir el libro y al completar cada cambio de páginas.
```javascript
// NARRACIÓN CORREGIDA — VICTORIA CAMBRONERO

const narrationFiles = cfg.narrationFiles || [
  'assets/narracion-01.mp3?v=3',
  'assets/narracion-02.mp3?v=3',
  'assets/narracion-03.mp3?v=3',
  'assets/narracion-04.mp3?v=3'
];

const voice = new Audio();
voice.preload = 'auto';
voice.volume = 1;

let narrationSpread = -1;
let narrationEnabled = true;
let narrationError = false;
let narrationRequest = 0;

const voiceButton = $('voice');

function updateVoiceButton() {
  if (!narrationEnabled) {
    voiceButton.textContent = '♬ Activar narrador';
  } else if (narrationError) {
    voiceButton.textContent = '▶ Reproducir narración';
  } else {
    voiceButton.textContent = 'Ⅱ Silenciar narrador';
  }

  voiceButton.setAttribute(
    'aria-pressed',
    String(narrationEnabled)
  );
}

function stopNarration() {
  narrationRequest++;

  voice.pause();
  voice.removeAttribute('src');
  voice.load();

  narrationSpread = -1;
  narrationError = false;

  music.volume = .22;
  updateVoiceButton();
}

async function startNarrationForCurrentPage() {
  if (!narrationEnabled || locked || spread < 0) return;

  const currentSpread = spread;
  const path = narrationFiles[currentSpread];

  if (!path) {
    console.error('No existe una ruta de narración para esta página.');
    return;
  }

  const request = ++narrationRequest;

  if (narrationSpread !== currentSpread || narrationError) {
    voice.pause();
    voice.src = path;
    voice.load();

    narrationSpread = currentSpread;
  }

  narrationError = false;
  updateVoiceButton();

  try {
    await voice.play();

    if (request !== narrationRequest) return;

    music.volume = .09;

    console.log(
      'Narración reproduciéndose:',
      currentSpread + 1,
      path
    );

  } catch (error) {
    if (request !== narrationRequest) return;

    narrationError = true;
    music.volume = .22;

    console.error(
      'Error al reproducir narración:',
      path,
      error
    );

    updateVoiceButton();
  }
}

voiceButton.onclick = () => {
  if (narrationError && narrationEnabled) {
    startNarrationForCurrentPage();
    return;
  }

  narrationEnabled = !narrationEnabled;

  if (narrationEnabled) {
    startNarrationForCurrentPage();
  } else {
    stopNarration();
  }

  updateVoiceButton();
};

voice.onended = () => {
  music.volume = .22;
};

voice.addEventListener('pause', () => {
  music.volume = .22;
});

voice.addEventListener('play', () => {
  music.volume = .09;
});

voice.addEventListener('error', () => {
  console.error(
    'Error cargando el audio:',
    voice.currentSrc,
    voice.error
  );
});

updateVoiceButton();
```
// El primer clic/tap puede habilitar la música incluso si no fue en «Abrir libro».
document.addEventListener('pointerdown',()=>{startMusic()}, {once:true,capture:true});
document.addEventListener('keydown',()=>{startMusic()}, {once:true,capture:true});
startMusic();
navUpdate();
