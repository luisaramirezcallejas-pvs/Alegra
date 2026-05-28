import React, { useState, useMemo } from 'react';
import {
  Eye, Database, LayoutDashboard, RefreshCw, RotateCcw, TrendingUp,
  TrendingDown, Minus, Sparkles, AlertTriangle, CheckCircle2, Wrench,
  Clock, Layers, ArrowUpRight, Building2, Activity, Target
} from 'lucide-react';

// =====================================================================
// CATÁLOGO DE CASOS DETECTABLES
// border = true  → no se resuelve con una validación de formulario (candidato a "Ojo con esto")
// border = false → alto volumen pero se resuelve mejorando el formulario / con capacitación
// =====================================================================
const CASOS = {
  arl:       { nombre: 'ARL mal clasificada por actividad', pantalla: 'Configuración de empresa', border: true,  complejidad: 5, produccion: true,  tipoBorder: 'Contexto de empresa' },
  ibc40:     { nombre: 'Pago no salarial supera el 40% del IBC', pantalla: 'Liquidación de nómina', border: true,  complejidad: 5, produccion: true,  tipoBorder: 'Cruce salarial / no salarial' },
  incap180:  { nombre: 'Incapacidad > 180 días (cambio de pagador)', pantalla: 'Novedades · Incapacidades', border: true,  complejidad: 5, produccion: false, tipoBorder: 'Patrón temporal' },
  horasext:  { nombre: 'Horas extra a salario integral / dirección', pantalla: 'Liquidación de nómina', border: true,  complejidad: 4, produccion: false, tipoBorder: 'Cruce de módulos' },
  embargo:   { nombre: 'Embargo judicial excede el tope legal', pantalla: 'Liquidación de nómina', border: true,  complejidad: 5, produccion: false, tipoBorder: 'Cálculo multi-concepto' },
  nosal_hab: { nombre: 'Bono no salarial por habitualidad', pantalla: 'Conceptos del empleado', border: true,  complejidad: 4, produccion: false, tipoBorder: 'Patrón temporal' },
  retencion: { nombre: 'Retención en la fuente / beneficio AFC', pantalla: 'Liquidación de nómina', border: true,  complejidad: 3, produccion: false, tipoBorder: 'Configuración persistente' },
  contrato:  { nombre: 'Tipo de contrato mal asignado', pantalla: 'Ficha del empleado', border: false, complejidad: 2, produccion: false, tipoBorder: '—' },
  auxtrans:  { nombre: 'Auxilio de transporte mal aplicado', pantalla: 'Ficha del empleado', border: false, complejidad: 2, produccion: false, tipoBorder: '—' },
  vacaciones:{ nombre: 'Vacaciones: días hábiles vs. corridos', pantalla: 'Novedades · Vacaciones', border: false, complejidad: 2, produccion: false, tipoBorder: '—' },
};

const UMBRAL = 0.15;

// Conteos semana 0 (50 tickets) y lotes semanales
const BASE_COUNTS = { arl: 9, ibc40: 8, contrato: 7, incap180: 6, horasext: 6, auxtrans: 5, vacaciones: 4, nosal_hab: 3, retencion: 2 };
const WEEK_BATCHES = [
  null, // semana 0 = base
  { incap180: 7, horasext: 2, contrato: 2, arl: 1 },          // +12
  { embargo: 13, horasext: 2, contrato: 1 },                  // +16  (patrón NUEVO)
  { horasext: 9, contrato: 6, arl: 1, ibc40: 1, vacaciones: 1 }, // +18
];
const WEEK_LABELS = [
  'Semana 0 · Análisis inicial', 'Semana 1', 'Semana 2', 'Semana 3',
];
const MAX_WEEK = WEEK_BATCHES.length - 1;

// Plantillas de descripción (voz del usuario) y empresas
const DESC = {
  arl: ['Mis empleados de obra cotizan ARL clase I y deberían ser clase V', 'La ARL me cobra como oficina pero somos constructora'],
  ibc40: ['La comisión no salarial del vendedor supera el 40%, ¿afecta el IBC?', 'La UGPP me observó el IBC por pagos no salariales altos'],
  incap180: ['Mi empleado lleva más de 180 días incapacitado y sigue cobrando la EPS', 'La EPS me rechazó el pago de una incapacidad larga'],
  horasext: ['Las horas extra de un empleado con salario integral se pagan doble', 'Le cargué horas extra a un cargo de dirección y no sé si aplica'],
  embargo: ['Un empleado tiene dos embargos y la suma supera lo permitido', 'El embargo judicial dejó el salario por debajo del mínimo embargable'],
  nosal_hab: ['Tengo un bono no salarial que pago igual hace meses, ¿está bien?', 'Un auxilio fijo mensual, ¿debería ser salario?'],
  retencion: ['La retención en la fuente no aplica el beneficio de AFC', 'La retención del empleado sale más alta de lo esperado'],
  contrato: ['Mi empleado por OPS está generando prestaciones', 'Configuré mal el tipo de contrato y la liquidación quedó mala'],
  auxtrans: ['Le sale auxilio de transporte a alguien que gana más de 2 SMMLV', 'No me aparece el auxilio de transporte de un empleado'],
  vacaciones: ['El sistema me cuenta domingos dentro de las vacaciones', 'Las vacaciones no descuentan del saldo acumulado'],
};
const EMPRESAS = [
  ['Distribuidora La Esperanza SAS', 'Colombia'], ['Constructora Andina SAS', 'Colombia'],
  ['Confecciones El Roble SAS', 'Colombia'], ['Café del Valle SAS', 'Colombia'],
  ['Logística Express Bogotá SAS', 'Colombia'], ['Ferretería Don Carlos SAS', 'Colombia'],
  ['Inversiones Montecarlo SAS', 'Colombia'], ['Transportes del Caribe SAS', 'Colombia'],
  ['Clínica Sonrisas SAS', 'Colombia'], ['Comercializadora Aztlán', 'México'],
  ['Restaurante La Casona', 'México'], ['Editorial Letras del Sur SAS', 'Colombia'],
];

// RNG determinístico
function makeRng(seed) {
  let s = seed;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

// Generar TODO el corpus (semanas 0..MAX_WEEK), cada ticket con su semana
function generarCorpus() {
  const rng = makeRng(42);
  const tickets = [];
  let id = 1000;
  const emitir = (counts, semana) => {
    Object.entries(counts).forEach(([casoId, n]) => {
      for (let k = 0; k < n; k++) {
        const emp = EMPRESAS[Math.floor(rng() * EMPRESAS.length)];
        const descArr = DESC[casoId];
        const desc = descArr[Math.floor(rng() * descArr.length)];
        id += 1;
        tickets.push({
          id: `TCK-${id}`, semana, casoId,
          empresa: emp[0], pais: emp[1],
          descripcion: desc, pantalla: CASOS[casoId].pantalla,
        });
      }
    });
  };
  emitir(BASE_COUNTS, 0);
  for (let w = 1; w <= MAX_WEEK; w++) emitir(WEEK_BATCHES[w], w);
  return tickets;
}
const CORPUS = generarCorpus();

// =====================================================================
// CÁLCULOS DE PRIORIZACIÓN
// =====================================================================
function countsAt(week) {
  const c = {};
  Object.keys(CASOS).forEach(k => c[k] = 0);
  CORPUS.forEach(t => { if (t.semana <= week) c[t.casoId] += 1; });
  return c;
}
function totalAt(week) { return CORPUS.filter(t => t.semana <= week).length; }
function volumeAt(casoId, week) {
  const tot = totalAt(week); if (!tot) return 0;
  return countsAt(week)[casoId] / tot;
}
function existeEn(casoId, week) { return CORPUS.some(t => t.casoId === casoId && t.semana <= week); }
function cruzoAlgunaVez(casoId, week) {
  for (let w = 0; w <= week; w++) if (volumeAt(casoId, w) > UMBRAL) return true;
  return false;
}
function statusDe(casoId, week) {
  const c = CASOS[casoId];
  if (c.produccion) return 'produccion';
  const cruzo = cruzoAlgunaVez(casoId, week);
  if (c.border && cruzo) return 'roadmap';
  if (!c.border && (cruzo || volumeAt(casoId, week) > UMBRAL)) return 'formulario';
  if (c.border && !cruzo) return 'backlog';
  return 'bajo';
}
function scoreDe(casoId, week) {
  const c = CASOS[casoId];
  return volumeAt(casoId, week) * 100 * c.complejidad * (c.border ? 1.5 : 0.6);
}
function tendencia(casoId, week) {
  if (!existeEn(casoId, week - 1)) return 'nuevo';
  const a = volumeAt(casoId, week), b = volumeAt(casoId, week - 1);
  if (a > b + 0.005) return 'up';
  if (a < b - 0.005) return 'down';
  return 'flat';
}
// casos que cruzaron el umbral POR PRIMERA VEZ en esta semana
function nuevosCruces(week) {
  return Object.keys(CASOS).filter(k =>
    !CASOS[k].produccion && cruzoAlgunaVez(k, week) && (week === 0 || !cruzoAlgunaVez(k, week - 1))
  );
}
function crucesProduccionSem0(week) {
  if (week !== 0) return [];
  return Object.keys(CASOS).filter(k => CASOS[k].produccion && volumeAt(k, 0) > UMBRAL);
}

// =====================================================================
// UI
// =====================================================================
const ESTADO_META = {
  produccion: { label: 'En producción', cls: 'bg-teal-100 text-teal-700', icon: CheckCircle2 },
  roadmap:    { label: 'Roadmap · Ojo con esto', cls: 'bg-amber-100 text-amber-800', icon: Sparkles },
  formulario: { label: 'Mejorar formulario', cls: 'bg-blue-100 text-blue-700', icon: Wrench },
  backlog:    { label: 'Backlog · monitorear', cls: 'bg-slate-200 text-slate-600', icon: Clock },
  bajo:       { label: 'Bajo umbral', cls: 'bg-slate-100 text-slate-500', icon: Minus },
};

function KpiCard({ label, valor, sub, accent }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-2xl font-bold text-slate-900 tabular-nums">{valor}</div>
      <div className="text-xs text-slate-600 mt-0.5 leading-snug">{label}</div>
      {sub && <div className={`text-[11px] font-medium mt-1 ${accent || 'text-slate-400'}`}>{sub}</div>}
    </div>
  );
}

function TendIcon({ t }) {
  if (t === 'nuevo') return <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">Nuevo</span>;
  if (t === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />;
  if (t === 'down') return <TrendingDown className="w-4 h-4 text-emerald-500" />;
  return <Minus className="w-4 h-4 text-slate-300" />;
}

function VolumeBar({ pct }) {
  const over = pct > UMBRAL;
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${over ? 'bg-red-400' : 'bg-slate-400'}`} style={{ width: `${Math.min(100, pct * 100 / 0.30 * 100 / 100 * 3.33)}%` }} />
        <div className="absolute inset-y-0 border-l-2 border-slate-900 border-dashed" style={{ left: `${UMBRAL * 100 / 0.30 * 100 / 100 * 3.33}%` }} />
      </div>
      <span className={`text-xs font-bold tabular-nums w-12 text-right ${over ? 'text-red-600' : 'text-slate-700'}`}>{(pct * 100).toFixed(1)}%</span>
    </div>
  );
}

function HeadlineAlert({ week }) {
  const prod = crucesProduccionSem0(week);
  const nuevos = nuevosCruces(week);

  if (week === 0) {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"><Target className="w-5 h-5" /></div>
        <div>
          <div className="font-bold text-sm">Análisis inicial · 50 tickets</div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Dos casos cruzan el umbral del 15% <strong>y</strong> son <em>border cases</em> (no se resuelven con una validación de formulario): <strong className="text-white">{prod.map(k => CASOS[k].nombre).join(' · ')}</strong>. Por eso son los dos primeros que ya están en producción dentro de "Ojo con esto".
          </p>
        </div>
      </div>
    );
  }

  if (nuevos.length === 0) {
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
        Esta semana no hubo cambios de umbral. El roadmap se mantiene; las prioridades se reordenan por volumen.
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
      <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
        <Sparkles className="w-4 h-4" />Cambios de esta semana
      </div>
      <div className="space-y-2">
        {nuevos.map(k => {
          const esForm = !CASOS[k].border;
          const esNuevoPatron = !existeEn(k, week - 1);
          return (
            <div key={k} className="flex items-start gap-2 text-xs">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-amber-900">
                {esNuevoPatron && <strong>Patrón nuevo detectado: </strong>}
                <strong>{CASOS[k].nombre}</strong> cruzó el 15% ({(volumeAt(k, week) * 100).toFixed(1)}%).{' '}
                {esForm
                  ? 'Alto volumen, pero se resuelve mejorando el formulario — NO entra a "Ojo con esto".'
                  : `Es border case (${CASOS[k].tipoBorder}) → se suma al roadmap de "Ojo con esto".`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Matriz({ week }) {
  // x: volumen 0-30%, y: complejidad 1-5
  const W = 100, H = 100;
  const xFor = v => Math.min(98, (v / 0.30) * 100);
  const yFor = c => 100 - ((c - 1) / 4) * 92 - 4;
  const colorFor = (st) => ({
    produccion: '#0d9488', roadmap: '#d97706', formulario: '#2563eb', backlog: '#94a3b8', bajo: '#cbd5e1',
  }[st]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-1">Matriz de decisión</h3>
      <p className="text-xs text-slate-500 mb-4">Volumen de tickets vs. complejidad. Solo el cuadrante superior derecho (alto volumen + border case) entra a "Ojo con esto".</p>
      <div className="relative" style={{ paddingLeft: 28, paddingBottom: 24 }}>
        <div className="relative bg-slate-50 rounded-lg border border-slate-200" style={{ height: 240 }}>
          {/* líneas de cuadrante */}
          <div className="absolute inset-y-0 border-l-2 border-dashed border-slate-300" style={{ left: `${xFor(UMBRAL)}%` }}>
            <span className="absolute -top-0 left-1 text-[9px] text-slate-400">15%</span>
          </div>
          <div className="absolute inset-x-0 border-t-2 border-dashed border-slate-300" style={{ top: '50%' }} />
          {/* etiqueta cuadrante objetivo */}
          <div className="absolute text-[9px] font-bold text-amber-600 uppercase tracking-wide" style={{ right: 8, top: 8 }}>Construir</div>
          <div className="absolute text-[9px] font-bold text-blue-500 uppercase tracking-wide" style={{ right: 8, bottom: 8 }}>Mejorar form.</div>
          {/* puntos */}
          {Object.keys(CASOS).map(k => {
            const v = volumeAt(k, week); if (v === 0) return null;
            const st = statusDe(k, week);
            return (
              <div key={k} className="absolute group" style={{ left: `${xFor(v)}%`, top: `${yFor(CASOS[k].complejidad)}%`, transform: 'translate(-50%,-50%)' }}>
                <div className="w-3 h-3 rounded-full ring-2 ring-white" style={{ background: colorFor(st) }} />
                <div className="absolute left-4 -top-1 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">{CASOS[k].nombre}</div>
              </div>
            );
          })}
        </div>
        <div className="absolute left-0 top-0 bottom-6 flex items-center"><span className="text-[10px] text-slate-400 -rotate-90 whitespace-nowrap">Complejidad →</span></div>
        <div className="text-center text-[10px] text-slate-400 mt-1">Volumen de tickets →</div>
      </div>
    </div>
  );
}

function CasosTable({ week }) {
  const filas = useMemo(() => {
    return Object.keys(CASOS)
      .map(k => ({ k, vol: volumeAt(k, week), st: statusDe(k, week), score: scoreDe(k, week), tend: tendencia(k, week), exists: existeEn(k, week) }))
      .filter(r => r.exists)
      .sort((a, b) => b.score - a.score);
  }, [week]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">Clasificación de casos</h3>
        <p className="text-xs text-slate-500 mt-0.5">Ordenados por prioridad. Umbral de roadmap: 15% de los tickets + ser border case.</p>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="px-5 py-2.5 text-left">Caso</th>
            <th className="px-4 py-2.5 text-left">Pantalla / flujo</th>
            <th className="px-4 py-2.5 text-left w-48">Volumen</th>
            <th className="px-4 py-2.5 text-center">Tend.</th>
            <th className="px-4 py-2.5 text-left">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filas.map(({ k, vol, st, tend }) => {
            const meta = ESTADO_META[st];
            const Icon = meta.icon;
            return (
              <tr key={k} className={st === 'roadmap' ? 'bg-amber-50/40' : (st === 'produccion' ? 'bg-teal-50/40' : '')}>
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900 leading-snug">{CASOS[k].nombre}</div>
                  {CASOS[k].border && <div className="text-[11px] text-slate-500 mt-0.5">Border case · {CASOS[k].tipoBorder}</div>}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{CASOS[k].pantalla}</td>
                <td className="px-4 py-3"><VolumeBar pct={vol} /></td>
                <td className="px-4 py-3 text-center"><div className="flex justify-center"><TendIcon t={tend} /></div></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.cls}`}>
                    <Icon className="w-3 h-3" />{meta.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Roadmap({ week }) {
  const items = useMemo(() => {
    const enProd = Object.keys(CASOS).filter(k => CASOS[k].produccion);
    const enRoad = Object.keys(CASOS)
      .filter(k => statusDe(k, week) === 'roadmap')
      .sort((a, b) => scoreDe(b, week) - scoreDe(a, week));
    return { enProd, enRoad };
  }, [week]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-1">Roadmap de "Ojo con esto"</h3>
      <p className="text-xs text-slate-500 mb-4">La brújula de implementación: qué está en producción y qué sigue, según el flujo de tickets.</p>

      <div className="mb-4">
        <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-2">En producción</div>
        <div className="space-y-2">
          {items.enProd.map(k => (
            <div key={k} className="flex items-center gap-2.5 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span className="text-sm text-slate-800">{CASOS[k].nombre}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">Siguiente — por prioridad</div>
        {items.enRoad.length === 0 ? (
          <div className="px-3 py-4 text-xs text-slate-400 text-center bg-slate-50 rounded-lg">Aún no hay nuevos casos sobre el umbral. Pulsa "Actualizar" para ingerir la siguiente semana.</div>
        ) : (
          <div className="space-y-2">
            {items.enRoad.map((k, i) => (
              <div key={k} className="flex items-center gap-3 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">{CASOS[k].nombre}</div>
                  <div className="text-[11px] text-slate-500">{CASOS[k].pantalla} · {CASOS[k].tipoBorder} · {(volumeAt(k, week) * 100).toFixed(1)}% de tickets</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RawTable({ week }) {
  const filas = useMemo(() => CORPUS.filter(t => t.semana <= week), [week]);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Base de datos de tickets</h3>
          <p className="text-xs text-slate-500 mt-0.5">Export crudo del sistema de soporte. Crece con cada semana ingerida.</p>
        </div>
        <span className="text-xs text-slate-500">{filas.length} tickets</span>
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0">
            <tr>
              <th className="px-5 py-2.5 text-left">Ticket</th>
              <th className="px-4 py-2.5 text-center">Semana</th>
              <th className="px-4 py-2.5 text-left">Empresa</th>
              <th className="px-4 py-2.5 text-left">Descripción</th>
              <th className="px-4 py-2.5 text-left">Caso detectado</th>
              <th className="px-4 py-2.5 text-left">Pantalla / flujo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filas.map(t => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-5 py-2.5 font-mono text-xs text-slate-500">{t.id}</td>
                <td className="px-4 py-2.5 text-center text-xs text-slate-600">{t.semana}</td>
                <td className="px-4 py-2.5 text-slate-700">{t.empresa}</td>
                <td className="px-4 py-2.5 text-slate-600 text-xs">{t.descripcion}</td>
                <td className="px-4 py-2.5"><span className="text-xs font-medium text-slate-800">{CASOS[t.casoId].nombre}</span></td>
                <td className="px-4 py-2.5 text-xs text-slate-500">{t.pantalla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =====================================================================
// APP
// =====================================================================
export default function App() {
  const [week, setWeek] = useState(0);
  const [tab, setTab] = useState('dashboard');

  const total = totalAt(week);
  const enProd = Object.keys(CASOS).filter(k => CASOS[k].produccion).length;
  const enRoad = Object.keys(CASOS).filter(k => statusDe(k, week) === 'roadmap').length;
  const enForm = Object.keys(CASOS).filter(k => statusDe(k, week) === 'formulario').length;
  const nuevos = nuevosCruces(week).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center"><Eye className="w-5 h-5 text-white" strokeWidth={2.4} /></div>
            <div>
              <div className="font-bold text-slate-900 text-base leading-none">Ojo con esto · Motor de priorización</div>
              <div className="text-[11px] text-slate-500 leading-none mt-1">Radar de implementación alimentado por el soporte · NóminaClara</div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button onClick={() => setTab('dashboard')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${tab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}><LayoutDashboard className="w-4 h-4" />Dashboard</button>
            <button onClick={() => setTab('raw')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${tab === 'raw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}><Database className="w-4 h-4" />Base de datos</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">
        {/* Control bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold tabular-nums">{week}</div>
            <div>
              <div className="text-sm font-bold text-slate-900">{WEEK_LABELS[week]}</div>
              <div className="text-xs text-slate-500">{total} tickets acumulados {week > 0 && `· +${WEEK_BATCHES[week] ? Object.values(WEEK_BATCHES[week]).reduce((a, b) => a + b, 0) : 0} esta semana`}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {week > 0 && (
              <button onClick={() => setWeek(0)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                <RotateCcw className="w-4 h-4" />Reiniciar
              </button>
            )}
            <button onClick={() => setWeek(w => Math.min(MAX_WEEK, w + 1))} disabled={week >= MAX_WEEK}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition ${week >= MAX_WEEK ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/30 active:scale-95'}`}>
              <RefreshCw className="w-4 h-4" />{week >= MAX_WEEK ? 'Sin más semanas' : 'Actualizar (ingerir semana ' + (week + 1) + ')'}
            </button>
          </div>
        </div>

        {tab === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <KpiCard label="Tickets analizados" valor={total} />
              <KpiCard label="Semana de ingesta" valor={week} sub={WEEK_LABELS[week].split('·')[0]} />
              <KpiCard label="Casos en producción" valor={enProd} accent="text-teal-600" sub="Ojo con esto activo" />
              <KpiCard label="Casos en roadmap" valor={enRoad} accent="text-amber-600" sub="Border + sobre umbral" />
              <KpiCard label="Para mejorar formulario" valor={enForm} accent="text-blue-600" sub="No requieren asistente" />
            </div>

            <HeadlineAlert week={week} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2"><CasosTable week={week} /></div>
              <div className="space-y-5">
                <Roadmap week={week} />
              </div>
            </div>

            <Matriz week={week} />
          </>
        )}

        {tab === 'raw' && <RawTable week={week} />}
      </main>
    </div>
  );
}
