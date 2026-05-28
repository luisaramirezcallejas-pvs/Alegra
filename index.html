import React, { useState, useRef, useEffect } from 'react';
import {
  Eye, AlertTriangle, BookOpen, ArrowRight, Building2, Activity,
  ChevronRight, ShieldAlert, Layers, CheckCircle2, ListChecks,
  CircleDollarSign, X, Calculator, Percent
} from 'lucide-react';

// =====================================================================
// HELPERS
// =====================================================================
const formatCOP = (n) => {
  if (n === null || n === undefined) return '$0';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
};
const ARL_TASAS = { I: 0.00522, II: 0.01044, III: 0.02436, IV: 0.04350, V: 0.06960 };

// =====================================================================
// DATOS
// =====================================================================
const empleadosARL = [
  { nombre: 'Carlos Andrés Patiño', cargo: 'Oficial de obra', salario: 1900000, claseActual: 'I', claseCorrecta: 'V', operativo: true },
  { nombre: 'Wilson Gómez Ríos', cargo: 'Ayudante de construcción', salario: 1423500, claseActual: 'I', claseCorrecta: 'V', operativo: true },
  { nombre: 'José Luis Cardona', cargo: 'Maestro de obra', salario: 2400000, claseActual: 'I', claseCorrecta: 'V', operativo: true },
  { nombre: 'Edwin Mauricio Ruiz', cargo: 'Operario de mezcla', salario: 1600000, claseActual: 'I', claseCorrecta: 'V', operativo: true },
  { nombre: 'Héctor Fabián Mora', cargo: 'Armador de hierro', salario: 1800000, claseActual: 'I', claseCorrecta: 'V', operativo: true },
  { nombre: 'Diana Carolina Vega', cargo: 'Auxiliar administrativa', salario: 1700000, claseActual: 'I', claseCorrecta: 'I', operativo: false },
  { nombre: 'Laura Restrepo Díaz', cargo: 'Contadora', salario: 3200000, claseActual: 'I', claseCorrecta: 'I', operativo: false },
];

// Caso comisión > 40% (Ley 1393/2010 Art. 30)
const LIQ = {
  empleado: 'Jorge Iván Hernández',
  cargo: 'Asesor Comercial',
  periodo: 'Mayo 2026',
  basicoSalarial: 2000000,
  comisionNoSalarial: 3000000,
};
const liqTotal = LIQ.basicoSalarial + LIQ.comisionNoSalarial;
const liqLimite40 = liqTotal * 0.4;
const liqExcedente = Math.max(0, LIQ.comisionNoSalarial - liqLimite40);
const liqIBCSinAjuste = LIQ.basicoSalarial;
const liqIBCConAjuste = LIQ.basicoSalarial + liqExcedente;
const liqAportesMes = Math.round(liqExcedente * 0.285); // salud 12.5% + pensión 16%
const liqPctNoSalarial = Math.round(LIQ.comisionNoSalarial / liqTotal * 100);

const CASOS = {
  e1: { nav: 'ARL vs. actividad', pantalla: 'empresa', breadcrumb: ['Configuración', 'Riesgos laborales'] },
  c40: { nav: 'Comisión > 40%', pantalla: 'liquidacion', breadcrumb: ['Liquidación', LIQ.periodo, LIQ.empleado] },
};

const ALERTAS = [
  { escenario: 'e1', titulo: '5 empleados de obra cotizan ARL en la clase mínima', ubicacion: 'Configuración · Riesgos laborales' },
  { escenario: 'c40', titulo: 'Un pago no salarial supera el 40% y afecta el IBC', ubicacion: `Liquidación · ${LIQ.periodo}` },
];

// =====================================================================
// PANEL "OJO CON ESTO" (fondo rojo, resalta)
// =====================================================================
function OjoConEsto({ children, highlight }) {
  return (
    <aside className={`bg-red-50 border-2 rounded-xl overflow-hidden sticky top-20 transition ${highlight ? 'border-red-400 ring-4 ring-red-300 animate-pulse' : 'border-red-200'}`}>
      <div className="px-4 py-3.5 bg-red-600 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Eye className="w-4 h-4 text-white" strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-sm font-bold leading-none">Ojo con esto</div>
            <div className="text-[11px] text-red-100 leading-tight mt-1">Aprende lo que hemos aprendido en 3 años de hacer nómina</div>
          </div>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </aside>
  );
}

function SeveridadBadge() {
  return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">Riesgo alto</span>;
}

function BloqueImpacto({ titulo, items }) {
  return (
    <div className="bg-white border border-red-100 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
        <CircleDollarSign className="w-3 h-3" />{titulo}
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs text-slate-600">{it.label}</span>
            <span className={`text-sm font-bold tabular-nums ${it.destacar ? 'text-red-600' : 'text-slate-900'}`}>{it.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PorQueImporta({ children }) {
  return (
    <div className="bg-white border border-red-200 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">
        <ShieldAlert className="w-3 h-3" />Por qué importa
      </div>
      <p className="text-xs text-slate-700 leading-relaxed">{children}</p>
    </div>
  );
}

function VistoVeces({ veces }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/70 px-2.5 py-2 rounded-lg">
      <Layers className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      <span>Hemos visto este caso <strong className="text-slate-900">{veces} veces</strong> en tickets de soporte. Casi siempre nadie lo nota hasta que es tarde.</span>
    </div>
  );
}

function CTAPrimario({ label, onClick, aplicado }) {
  if (aplicado) {
    return (
      <div className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-800 font-bold text-sm">
        <CheckCircle2 className="w-5 h-5" />Corrección aplicada
      </div>
    );
  }
  return (
    <button onClick={onClick}
      className="group w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/30 transition active:scale-[0.98]">
      {label}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
    </button>
  );
}

function NormaLink({ texto, onOpen }) {
  return (
    <button onClick={onOpen} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition mx-auto">
      <BookOpen className="w-3.5 h-3.5" />{texto}
    </button>
  );
}

// =====================================================================
// PANTALLA: CONFIGURACIÓN DE EMPRESA (E1)
// =====================================================================
function PantallaEmpresa({ aplicado, onAplicar, onVerNorma, highlight }) {
  const operativos = empleadosARL.filter(e => e.operativo);
  const subcotizacionMes = operativos.reduce((acc, e) => acc + e.salario * (ARL_TASAS.V - ARL_TASAS.I), 0);

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Datos de la empresa</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><div className="text-xs text-slate-500 mb-0.5">Razón social</div><div className="font-medium text-slate-900">Constructora Andina SAS</div></div>
            <div><div className="text-xs text-slate-500 mb-0.5">Actividad económica (CIIU)</div><div className="font-medium text-slate-900">4111 · Construcción de edificios residenciales</div></div>
            <div><div className="text-xs text-slate-500 mb-0.5">Clase de riesgo de la actividad</div><div className="font-bold text-red-600">Clase V — Riesgo máximo (6.960%)</div></div>
            <div><div className="text-xs text-slate-500 mb-0.5">Clase aplicada por defecto</div><div className="font-bold text-slate-900">Clase I — Riesgo mínimo (0.522%)</div></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Empleados y su clase de riesgo ARL</h3>
            <span className="text-xs text-slate-500">{empleadosARL.length} empleados</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr><th className="px-5 py-2.5 text-left">Empleado</th><th className="px-5 py-2.5 text-left">Cargo</th><th className="px-5 py-2.5 text-right">Salario</th><th className="px-5 py-2.5 text-center">Clase actual</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empleadosARL.map((e, i) => {
                const inconsistente = e.claseActual !== e.claseCorrecta;
                return (
                  <tr key={i} className={inconsistente && !aplicado ? 'bg-red-50/60' : ''}>
                    <td className="px-5 py-2.5 font-medium text-slate-900">{e.nombre}</td>
                    <td className="px-5 py-2.5 text-slate-600">{e.cargo}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums text-slate-700">{formatCOP(e.salario)}</td>
                    <td className="px-5 py-2.5 text-center">
                      {inconsistente && !aplicado ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold"><AlertTriangle className="w-3 h-3" />Clase I</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">Clase {aplicado && e.operativo ? 'V' : e.claseActual}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-span-1">
        <OjoConEsto highlight={highlight}>
          <div className="space-y-3.5">
            <SeveridadBadge />
            <h4 className="text-sm font-bold text-slate-900 leading-snug">Tu empresa es de construcción, pero {operativos.length} empleados de obra cotizan en la clase de riesgo más baja</h4>
            <p className="text-xs text-slate-600 leading-relaxed">La clase de riesgo no la elige la empresa: la determina la actividad y el cargo. Tus oficiales, ayudantes y maestros de obra deberían estar en <strong>Clase V</strong>. Hoy están en Clase I porque ese es el valor que el sistema trae por defecto y nadie lo cambió al crearlos.</p>
            <BloqueImpacto titulo="Lo que está en juego" items={[
              { label: 'Subcotización a la ARL / mes', valor: formatCOP(subcotizacionMes), destacar: true },
              { label: 'Acumulado en 12 meses', valor: formatCOP(subcotizacionMes * 12), destacar: true },
            ]} />
            <PorQueImporta>Si uno de estos trabajadores se accidenta en obra, la ARL puede objetar la cobertura por subcotización y la empresa termina asumiendo la prestación completa: incapacidades, indemnización o pensión de invalidez.</PorQueImporta>
            <VistoVeces veces={14} />
            <div className="pt-1 space-y-3">
              <CTAPrimario label={`Reclasificar ${operativos.length} empleados a Clase V`} onClick={onAplicar} aplicado={aplicado} />
              <NormaLink texto="Decreto 1295 de 1994 · Clases de riesgo" onOpen={() => onVerNorma('e1')} />
            </div>
          </div>
        </OjoConEsto>
      </div>
    </div>
  );
}

// =====================================================================
// PANTALLA: LIQUIDACIÓN DE NÓMINA (C40 — comisión > 40% afecta IBC)
// =====================================================================
function PantallaLiquidacion({ aplicado, onAplicar, onVerNorma, highlight }) {
  const ibcActual = aplicado ? liqIBCConAjuste : liqIBCSinAjuste;

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5">
        {/* Encabezado liquidación */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calculator className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Liquidación de nómina · {LIQ.periodo}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{LIQ.empleado}</h3>
              <p className="text-xs text-slate-500">{LIQ.cargo}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Total devengado</div>
              <div className="text-lg font-bold text-slate-900">{formatCOP(liqTotal)}</div>
            </div>
          </div>
        </div>

        {/* Conceptos cargados */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Conceptos de esta liquidación</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">Salario básico</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-700">Constitutivo de salario</span>
              </div>
              <span className="text-sm font-bold tabular-nums text-slate-900">{formatCOP(LIQ.basicoSalarial)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">Comisión por ventas</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">NO constitutivo de salario</span>
              </div>
              <span className="text-sm font-bold tabular-nums text-slate-900">{formatCOP(LIQ.comisionNoSalarial)}</span>
            </div>
          </div>

          {/* Barra composición 40% */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-600">Composición de la remuneración</span>
              <span className="text-slate-600">Pago no salarial: <strong className="text-red-600">{liqPctNoSalarial}%</strong> del total</span>
            </div>
            <div className="flex h-7 rounded-lg overflow-hidden text-[10px] font-bold text-white">
              <div className="bg-teal-500 flex items-center justify-center" style={{ width: '40%' }}>Salarial 40%</div>
              <div className="bg-amber-400 flex items-center justify-center text-amber-900" style={{ width: '40%' }}>Exento 40%</div>
              <div className="bg-red-500 flex items-center justify-center" style={{ width: '20%' }}>Excede</div>
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
              <span>Límite legal no salarial: 40% del total ({formatCOP(liqLimite40)})</span>
              <span className="text-red-600 font-bold">Excedente: {formatCOP(liqExcedente)}</span>
            </div>
          </div>
        </div>

        {/* Cálculo del IBC */}
        <div className={`rounded-xl p-5 border-2 transition ${aplicado ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Ingreso Base de Cotización (IBC)</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-lg p-4 ${!aplicado ? 'bg-white border border-red-200' : 'bg-white/60'}`}>
              <div className="text-xs text-slate-500 mb-1">IBC sin ajuste {!aplicado && '(actual)'}</div>
              <div className="text-xl font-bold text-slate-900 tabular-nums">{formatCOP(liqIBCSinAjuste)}</div>
              <div className="text-[11px] text-slate-500 mt-1">Solo el salario básico</div>
            </div>
            <div className={`rounded-lg p-4 ${aplicado ? 'bg-white border border-emerald-300' : 'bg-white border border-slate-200'}`}>
              <div className="text-xs text-slate-500 mb-1">IBC ajustado por ley {aplicado && '(aplicado)'}</div>
              <div className="text-xl font-bold text-teal-700 tabular-nums">{formatCOP(liqIBCConAjuste)}</div>
              <div className="text-[11px] text-slate-500 mt-1">Básico + excedente del 40%</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            IBC de pago en esta liquidación: <strong className="text-slate-900 tabular-nums">{formatCOP(ibcActual)}</strong>
            {!aplicado && <span className="text-red-600 font-medium"> — subreportado en {formatCOP(liqExcedente)}</span>}
          </div>
        </div>
      </div>

      <div className="col-span-1">
        <OjoConEsto highlight={highlight}>
          <div className="space-y-3.5">
            <SeveridadBadge />
            <h4 className="text-sm font-bold text-slate-900 leading-snug">Este pago no salarial supera el 40% del total. El excedente tiene que entrar al IBC.</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los pagos no salariales no pueden representar más del <strong>40% del total de la remuneración</strong> para efectos de cotización. Aquí la comisión es el <strong>{liqPctNoSalarial}%</strong>, así que el excedente de <strong>{formatCOP(liqExcedente)}</strong> debe sumarse al IBC, aunque siga siendo no salarial para las prestaciones.
            </p>
            <BloqueImpacto titulo="Impacto en aportes" items={[
              { label: 'Excedente que entra al IBC', valor: formatCOP(liqExcedente), destacar: false },
              { label: 'Aportes adicionales / mes', valor: formatCOP(liqAportesMes), destacar: false },
              { label: 'Acumulado 12 meses', valor: formatCOP(liqAportesMes * 12), destacar: true },
            ]} />
            <PorQueImporta>
              Si liquidas con el IBC sin ajustar, estás subreportando aportes a salud y pensión. La UGPP fiscaliza exactamente esto: puede liquidar los aportes omitidos de varios años hacia atrás más sanción por inexactitud.
            </PorQueImporta>
            <VistoVeces veces={11} />
            <div className="pt-1 space-y-3">
              <CTAPrimario label="Ajustar el IBC según la regla del 40%" onClick={onAplicar} aplicado={aplicado} />
              <NormaLink texto="Ley 1393 de 2010 · Art. 30" onOpen={() => onVerNorma('c40')} />
            </div>
          </div>
        </OjoConEsto>
      </div>
    </div>
  );
}

// =====================================================================
// MODAL DE NORMA
// =====================================================================
const NORMAS = {
  e1: {
    titulo: 'Clases de riesgo ARL',
    norma: 'Decreto 1295 de 1994, Art. 26-28 — La clasificación del riesgo se determina según la actividad económica de la empresa y el cargo del trabajador. La construcción corresponde a Clase V (riesgo máximo), con cotización del 6.960% sobre el IBC.',
    practica: 'La empresa no elige libremente su clase de riesgo: la define la actividad. Cotizar por debajo de la clase real deja a la ARL la posibilidad de objetar el reconocimiento de prestaciones en caso de accidente, trasladando el costo a la empresa.',
  },
  c40: {
    titulo: 'Límite del 40% para pagos no salariales',
    norma: 'Ley 1393 de 2010, Art. 30 — Para efectos del Ingreso Base de Cotización (Art. 18 y 204 de la Ley 100 de 1993), los pagos laborales no constitutivos de salario no pueden superar el 40% del total de la remuneración. El excedente sobre ese 40% se incorpora a la base de cotización.',
    practica: 'Un pago puede seguir siendo no salarial para prestaciones, pero si supera el 40% del total, la parte excedente sí cotiza a seguridad social. Ignorar esta regla es la causa más común de glosas de la UGPP, que puede reliquidar aportes de varios años y aplicar sanción por inexactitud.',
  },
};

function ModalNorma({ casoId, onClose }) {
  if (!casoId) return null;
  const n = NORMAS[casoId];
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center"><BookOpen className="w-5 h-5 text-slate-700" /></div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Centro de ayuda · Norma laboral</div>
              <h3 className="text-lg font-bold text-slate-900">{n.titulo}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qué dice la norma</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 leading-relaxed">{n.norma}</div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qué significa en la práctica</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{n.practica}</p>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition">Entendido</button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// CAMPANA DE NOTIFICACIONES (ícono de ojo)
// =====================================================================
function CampanaOjo({ alertas, onIr }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
        <Eye className="w-5 h-5 text-slate-700" strokeWidth={2.2} />
        {alertas.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">{alertas.length}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 bg-red-600 text-white flex items-center gap-2">
            <Eye className="w-4 h-4" strokeWidth={2.4} />
            <span className="text-sm font-bold">Ojo con esto</span>
            <span className="ml-auto text-[11px] text-red-100">{alertas.length} {alertas.length === 1 ? 'alerta' : 'alertas'}</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alertas.length === 0 && (
              <div className="px-4 py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No hay alertas pendientes</p>
              </div>
            )}
            {alertas.map((a, i) => (
              <button key={i} onClick={() => { onIr(a.escenario); setOpen(false); }}
                className="w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-red-50 transition flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 leading-snug">{a.titulo}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{a.ubicacion}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// HEADER
// =====================================================================
function Header({ breadcrumb, alertas, onIr }) {
  const seccionActiva = breadcrumb[0];
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center"><Activity className="w-5 h-5 text-white" strokeWidth={2.5} /></div>
            <div>
              <div className="font-bold text-slate-900 text-lg leading-none">NóminaClara</div>
              <div className="text-[10px] text-slate-500 leading-none mt-0.5">Software de Nómina</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {['Inicio', 'Empleados', 'Liquidación', 'Configuración', 'Reportes DIAN'].map((item, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-md font-medium ${item === seccionActiva ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>{item}</span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <CampanaOjo alertas={alertas} onIr={onIr} />
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">LM</div>
        </div>
      </div>
    </header>
  );
}

// =====================================================================
// BARRA INFERIOR DE ESCENARIOS (modo demo, discreta)
// =====================================================================
function BarraEscenarios({ activo, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-40">
      <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5" />Escenarios</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(CASOS).map(([key, caso]) => (
            <button key={key} onClick={() => onChange(key)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${activo === key ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>{caso.nav}</button>
          ))}
        </div>
        <span className="ml-auto text-[10px] text-slate-600 hidden sm:block">Prototipo · NóminaClara</span>
      </div>
    </div>
  );
}

// =====================================================================
// APP
// =====================================================================
export default function App() {
  const [escenario, setEscenario] = useState('e1');
  const [aplicados, setAplicados] = useState({});
  const [modalNorma, setModalNorma] = useState(null);
  const [highlight, setHighlight] = useState(false);

  const caso = CASOS[escenario];
  const aplicado = !!aplicados[escenario];
  const alertasActivas = ALERTAS.filter(a => !aplicados[a.escenario]);

  const handleAplicar = () => setAplicados(prev => ({ ...prev, [escenario]: true }));

  const irAAlerta = (esc) => {
    setEscenario(esc);
    setHighlight(true);
    setTimeout(() => setHighlight(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-14">
      <Header breadcrumb={caso.breadcrumb} alertas={alertasActivas} onIr={irAAlerta} />

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
          {caso.breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
              <span className={i === caso.breadcrumb.length - 1 ? 'text-slate-900 font-medium' : ''}>{b}</span>
            </React.Fragment>
          ))}
        </div>

        {caso.pantalla === 'empresa' && (
          <PantallaEmpresa aplicado={aplicado} onAplicar={handleAplicar} onVerNorma={setModalNorma} highlight={highlight} />
        )}
        {caso.pantalla === 'liquidacion' && (
          <PantallaLiquidacion aplicado={aplicado} onAplicar={handleAplicar} onVerNorma={setModalNorma} highlight={highlight} />
        )}
      </main>

      <ModalNorma casoId={modalNorma} onClose={() => setModalNorma(null)} />
      <BarraEscenarios activo={escenario} onChange={setEscenario} />
    </div>
  );
}
