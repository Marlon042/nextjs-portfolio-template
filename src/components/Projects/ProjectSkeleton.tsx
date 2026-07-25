'use client'

import { FC } from 'react'

interface Props {
  style?: 'pulse' | 'shimmer' | 'wave' | 'gradient' | 'cyber' | 'neon' | 'quantum' | 'terminal' | 'powershell'
}

const pulseClass = 'animate-pulse bg-[#1a2d4a]'

const shimmerBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`relative overflow-hidden rounded bg-[#1a2d4a] ${cn}`}>
    <div className="absolute inset-0 shimmer" />
  </div>
)

const waveBlock: FC<{ cn?: string; delay?: number }> = ({ cn = '', delay = 0 }) => (
  <div className={`rounded bg-[#1a2d4a] opacity-20 ${cn}`} style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: `${delay}s` }} />
)

const gradientBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`rounded ${cn}`} style={{ animation: 'gradientPulse 2s ease-in-out infinite', background: 'linear-gradient(135deg, #1a2d4a 0%, #253a5a 50%, #1a2d4a 100%)', backgroundSize: '200% 200%' }} />
)

const cyberBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`relative overflow-hidden rounded ${cn}`} style={{ background: '#0a1628', border: '1px solid rgba(0, 255, 255, 0.15)' }}>
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
    <div className="absolute inset-0 cyber-scan" />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 255, 0.08) 50%, transparent 100%)', animation: 'cyberGlow 2s ease-in-out infinite' }} />
  </div>
)

const neonBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`relative overflow-hidden rounded ${cn}`} style={{ background: '#0d0b1a', border: '1px solid rgba(255, 0, 255, 0.2)' }}>
    <div className="absolute inset-0 neon-scan" />
    <div className="absolute inset-0" style={{ animation: 'neonColorCycle 3s linear infinite' }} />
    <div className="absolute -top-1 -left-1 size-2 rounded-full bg-fuchsia-500" style={{ animation: 'neonParticle 2s ease-in-out infinite' }} />
    <div className="absolute -bottom-1 -right-1 size-1.5 rounded-full bg-cyan-400" style={{ animation: 'neonParticle 2s ease-in-out infinite 0.5s' }} />
    <div className="absolute top-1/2 -right-0 size-1 rounded-full bg-amber-400" style={{ animation: 'neonParticle 1.5s ease-in-out infinite 1s' }} />
  </div>
)

const quantumBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`relative overflow-hidden rounded ${cn}`} style={{ background: '#05031a', border: '1px solid rgba(120, 80, 255, 0.3)' }}>
    <div className="absolute inset-0 quantum-stars" />
    <div className="absolute inset-0 quantum-aurora1" />
    <div className="absolute inset-0 quantum-aurora2" />
    <div className="absolute inset-0 quantum-warp" />
    <div className="absolute inset-0 quantum-haze" />
    <div className="absolute -top-1 left-1/3 size-1 rounded-full bg-cyan-300" style={{ animation: 'quantumOrbit 3s linear infinite' }} />
    <div className="absolute -bottom-1 right-1/4 size-1.5 rounded-full bg-fuchsia-400" style={{ animation: 'quantumOrbit 4s linear infinite 0.5s' }} />
    <div className="absolute top-1/3 -left-0.5 size-1 rounded-full bg-amber-300" style={{ animation: 'quantumDrift 2.5s ease-in-out infinite' }} />
    <div className="absolute bottom-1/3 -right-0.5 size-0.5 rounded-full bg-emerald-400" style={{ animation: 'quantumDrift 3s ease-in-out infinite 1s' }} />
    <div className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/10" style={{ animation: 'quantumRing 3s ease-in-out infinite' }} />
  </div>
)

const terminalBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`relative overflow-hidden rounded ${cn}`} style={{ background: '#0a0f0a', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
    <div className="absolute inset-0 terminal-scanline" />
    <div className="absolute inset-0 terminal-matrix" />
    <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00ff41]/20" style={{ animation: 'terminalRipple 2s ease-out infinite' }} />
    <div className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00ff41]/10" style={{ animation: 'terminalRipple 2s ease-out infinite 0.5s' }} />
  </div>
)

const psBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`relative overflow-hidden rounded ${cn}`} style={{ background: '#0c0d2e', border: '1px solid rgba(0, 120, 255, 0.2)' }}>
    <div className="absolute inset-0 ps-scanline" />
    <div className="absolute inset-0 ps-glow" />
    <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0078ff]/20" style={{ animation: 'psRipple 2s ease-out infinite' }} />
    <div className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0078ff]/10" style={{ animation: 'psRipple 2s ease-out infinite 0.5s' }} />
  </div>
)

const SkeletonBlock: FC<{ className?: string; delay?: number; style?: string }> = ({ className = '', delay = 0, style = 'shimmer' }) => {
  switch (style) {
    case 'pulse':
      return <div className={`${pulseClass} ${className}`} />
    case 'shimmer':
      return <>{shimmerBlock({ cn: className })}</>
    case 'wave':
      return <>{waveBlock({ cn: className, delay })}</>
    case 'gradient':
      return <>{gradientBlock({ cn: className })}</>
    case 'cyber':
      return <>{cyberBlock({ cn: className })}</>
    case 'neon':
      return <>{neonBlock({ cn: className })}</>
    case 'quantum':
      return <>{quantumBlock({ cn: className })}</>
    case 'terminal':
      return <>{terminalBlock({ cn: className })}</>
    case 'powershell':
      return <>{psBlock({ cn: className })}</>
    default:
      return <div className={`${pulseClass} ${className}`} />
  }
}

const ProjectSkeleton: FC<Props> = ({ style = 'shimmer' }) => {
  const common = { style }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes wave {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        @keyframes gradientPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .cyber-scan {
          background: linear-gradient(180deg, transparent 30%, rgba(0, 255, 255, 0.12) 50%, transparent 70%);
          background-size: 100% 200%;
          animation: cyberScan 2s ease-in-out infinite;
        }
        @keyframes cyberScan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes cyberGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .cyber-card {
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.05), inset 0 0 15px rgba(0, 255, 255, 0.02);
          animation: cyberBorderPulse 3s ease-in-out infinite;
        }
        @keyframes cyberBorderPulse {
          0%, 100% { border-color: rgba(0, 255, 255, 0.15); box-shadow: 0 0 15px rgba(0, 255, 255, 0.05); }
          50% { border-color: rgba(0, 255, 255, 0.35); box-shadow: 0 0 25px rgba(0, 255, 255, 0.1); }
        }
        .neon-scan {
          background: linear-gradient(90deg, transparent 0%, rgba(255, 0, 255, 0.15) 25%, rgba(0, 255, 255, 0.15) 50%, rgba(255, 255, 0, 0.15) 75%, transparent 100%);
          background-size: 300% 100%;
          animation: neonSweep 2s linear infinite;
        }
        @keyframes neonSweep {
          0% { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes neonColorCycle {
          0%, 100% { background: linear-gradient(135deg, rgba(255, 0, 255, 0.06), rgba(0, 255, 255, 0.06)); }
          33% { background: linear-gradient(135deg, rgba(0, 255, 255, 0.06), rgba(255, 255, 0, 0.06)); }
          66% { background: linear-gradient(135deg, rgba(255, 255, 0, 0.06), rgba(255, 0, 255, 0.06)); }
        }
        @keyframes neonParticle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .neon-card {
          animation: neonBorderDance 2s linear infinite, neonGlowPulse 1.5s ease-in-out infinite;
        }
        @keyframes neonBorderDance {
          0% { border-color: rgba(255, 0, 255, 0.25); }
          25% { border-color: rgba(0, 255, 255, 0.25); }
          50% { border-color: rgba(255, 255, 0, 0.25); }
          75% { border-color: rgba(0, 255, 128, 0.25); }
          100% { border-color: rgba(255, 0, 255, 0.25); }
        }
        @keyframes neonGlowPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 255, 0.1), 0 0 20px rgba(0, 255, 255, 0.05); }
          50% { box-shadow: 0 0 20px rgba(255, 0, 255, 0.2), 0 0 40px rgba(0, 255, 255, 0.1), 0 0 60px rgba(255, 255, 0, 0.05); }
        }
        .quantum-stars {
          background-image: radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.2), transparent), radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 90% 30%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.15), transparent), radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.25), transparent), radial-gradient(1.5px 1.5px at 80% 15%, rgba(255,255,255,0.3), transparent);
          animation: quantumTwinkle 4s ease-in-out infinite;
        }
        @keyframes quantumTwinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        .quantum-aurora1 { background: linear-gradient(135deg, transparent 30%, rgba(80, 200, 255, 0.08) 50%, transparent 70%); background-size: 200% 200%; animation: quantumAurora1 5s ease-in-out infinite; }
        .quantum-aurora2 { background: linear-gradient(225deg, transparent 30%, rgba(200, 80, 255, 0.06) 50%, transparent 70%); background-size: 200% 200%; animation: quantumAurora2 7s ease-in-out infinite; }
        @keyframes quantumAurora1 { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } }
        @keyframes quantumAurora2 { 0%, 100% { background-position: 100% 0%; } 50% { background-position: 0% 100%; } }
        .quantum-warp { background: conic-gradient(from 0deg, transparent, rgba(120, 80, 255, 0.06), transparent, rgba(0, 200, 255, 0.06), transparent); animation: quantumWarp 6s linear infinite; }
        @keyframes quantumWarp { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg) scale(1); } }
        .quantum-haze { background: radial-gradient(ellipse at 30% 50%, rgba(120, 80, 255, 0.04), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0, 200, 255, 0.04), transparent 60%); animation: quantumHaze 4s ease-in-out infinite alternate; }
        @keyframes quantumHaze { 0% { opacity: 0.3; transform: scale(1); } 100% { opacity: 0.8; transform: scale(1.1); } }
        @keyframes quantumOrbit { 0% { transform: rotate(0deg) translateX(20px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); } }
        @keyframes quantumDrift { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; } 25% { transform: translateY(-8px) translateX(4px); opacity: 1; } 50% { transform: translateY(0) translateX(8px); opacity: 0.5; } 75% { transform: translateY(6px) translateX(2px); opacity: 0.8; } }
        @keyframes quantumRing { 0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.3; border-width: 1px; } 50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); opacity: 0.6; border-width: 2px; } }
        .quantum-card { animation: quantumBorderShift 4s linear infinite, quantumBoxGlow 2s ease-in-out infinite; }
        @keyframes quantumBorderShift { 0% { border-color: rgba(120, 80, 255, 0.25); } 25% { border-color: rgba(0, 200, 255, 0.25); } 50% { border-color: rgba(200, 80, 255, 0.25); } 75% { border-color: rgba(0, 255, 200, 0.25); } 100% { border-color: rgba(120, 80, 255, 0.25); } }
        @keyframes quantumBoxGlow { 0%, 100% { box-shadow: 0 0 15px rgba(120, 80, 255, 0.1), 0 0 30px rgba(0, 200, 255, 0.05); } 33% { box-shadow: 0 0 25px rgba(0, 200, 255, 0.15), 0 0 50px rgba(200, 80, 255, 0.08); } 66% { box-shadow: 0 0 20px rgba(200, 80, 255, 0.12), 0 0 40px rgba(0, 255, 200, 0.06); } }
        .terminal-scanline { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px); animation: terminalScan 8s linear infinite; }
        @keyframes terminalScan { 0% { transform: translateY(0); } 100% { transform: translateY(4px); } }
        .terminal-matrix { background: radial-gradient(ellipse at 30% 20%, rgba(0, 255, 65, 0.04), transparent 70%), radial-gradient(ellipse at 70% 80%, rgba(0, 255, 65, 0.03), transparent 70%); }
        @keyframes terminalRipple { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.4; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } }
        .terminal-card { animation: terminalBorderPulse 2s ease-in-out infinite; }
        @keyframes terminalBorderPulse { 0%, 100% { border-color: rgba(0, 255, 65, 0.15); box-shadow: 0 0 10px rgba(0, 255, 65, 0.05), inset 0 0 10px rgba(0, 255, 65, 0.02); } 50% { border-color: rgba(0, 255, 65, 0.35); box-shadow: 0 0 25px rgba(0, 255, 65, 0.12), inset 0 0 20px rgba(0, 255, 65, 0.05); } }
        @keyframes terminalType { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .ps-scanline { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 120, 255, 0.03) 2px, rgba(0, 120, 255, 0.03) 4px); animation: psScan 8s linear infinite; }
        @keyframes psScan { 0% { transform: translateY(0); } 100% { transform: translateY(4px); } }
        .ps-glow { background: radial-gradient(ellipse at 50% 0%, rgba(0, 120, 255, 0.06), transparent 70%), radial-gradient(ellipse at 50% 100%, rgba(0, 200, 255, 0.03), transparent 70%); }
        @keyframes psRipple { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.4; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } }
        .ps-card { animation: psBorderPulse 2s ease-in-out infinite; }
        @keyframes psBorderPulse { 0%, 100% { border-color: rgba(0, 120, 255, 0.15); box-shadow: 0 0 10px rgba(0, 120, 255, 0.05), inset 0 0 10px rgba(0, 120, 255, 0.02); } 50% { border-color: rgba(0, 180, 255, 0.35); box-shadow: 0 0 25px rgba(0, 120, 255, 0.12), inset 0 0 20px rgba(0, 150, 255, 0.05); } }
        @keyframes psType { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes psBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
      <div className={`flex flex-col justify-between rounded-[14px] p-5 ${
        style === 'cyber' ? 'border border-cyan-500/20 bg-[#0a1628] cyber-card' :
        style === 'neon' ? 'border border-fuchsia-500/20 bg-[#0d0b1a] neon-card' :
        style === 'quantum' ? 'border border-purple-500/20 bg-[#05031a] quantum-card' :
        style === 'terminal' ? 'border border-green-500/20 bg-[#0a0f0a] terminal-card' :
        style === 'powershell' ? 'border border-blue-500/20 bg-[#0c0d2e] ps-card' :
        'bg-secondary border-border border'
      }`}>
        {style === 'terminal' || style === 'powershell' ? (
          <div className="flex w-full flex-col gap-0.5 py-2" style={{ fontFamily: 'monospace' }}>
            {style === 'terminal' ? (
              <>
                <span className="block text-left text-xs leading-5 text-[#00ff41]/90" style={{ animation: 'terminalType 0.3s steps(1) 0.1s both' }}>
                  <span className="text-[#00ff41]/50">admin@root</span>:<span className="text-[#00ccff]/50">~</span>$ deploy --project=portfolio
                </span>
                <span className="block text-left text-xs leading-5 text-[#00ff41]/75" style={{ animation: 'terminalType 0.3s steps(1) 0.4s both' }}>
                  {'>'} building assets... <span className="text-green-400">OK</span>
                </span>
                <span className="block text-left text-xs leading-5 text-[#00ff41]/60" style={{ animation: 'terminalType 0.3s steps(1) 0.7s both' }}>
                  {'>'} optimizing images... <span className="text-yellow-400">12 files</span>
                </span>
                <span className="block text-left text-xs leading-5 text-[#00ff41]/45" style={{ animation: 'terminalType 0.3s steps(1) 1s both' }}>
                  {'>'} running tests... <span className="text-green-400">42 passed</span>
                </span>
                <span className="block text-left text-xs leading-5 text-[#00ff41]/30" style={{ animation: 'terminalType 0.3s steps(1) 1.3s both' }}>
                  {'>'} deploying... <span className="text-cyan-400">███████▒▒ 78%</span>
                </span>
                <span className="block text-left text-xs leading-5 text-[#00ff41]/20" style={{ animation: 'terminalType 0.3s steps(1) 1.6s both' }}>
                  $ <span className="animate-pulse" style={{ animation: 'terminalBlink 1s step-end infinite' }}>_</span>
                </span>
              </>
            ) : (
              <>
                <span className="block text-left text-xs leading-5 text-[#0088ff]/90" style={{ animation: 'psType 0.3s steps(1) 0.1s both' }}>
                  <span className="text-[#0088ff]/50">PS</span> <span className="text-[#00ccff]/50">{'>'}</span> Invoke-Deploy -Target portfolio
                </span>
                <span className="block text-left text-xs leading-5 text-[#0088ff]/75" style={{ animation: 'psType 0.3s steps(1) 0.4s both' }}>
                  {'>>'} compiling modules... <span className="text-blue-300">OK</span>
                </span>
                <span className="block text-left text-xs leading-5 text-[#0088ff]/60" style={{ animation: 'psType 0.3s steps(1) 0.7s both' }}>
                  {'>>'} optimizing bundle... <span className="text-yellow-300">24 assets</span>
                </span>
                <span className="block text-left text-xs leading-5 text-[#0088ff]/45" style={{ animation: 'psType 0.3s steps(1) 1s both' }}>
                  {'>>'} running unit tests... <span className="text-blue-300">56 passed</span>
                </span>
                <span className="block text-left text-xs leading-5 text-[#0088ff]/30" style={{ animation: 'psType 0.3s steps(1) 1.3s both' }}>
                  {'>>'} deploying... <span className="text-cyan-300">███████▒▒ 78%</span>
                </span>
                <span className="block text-left text-xs leading-5 text-[#0088ff]/20" style={{ animation: 'psType 0.3s steps(1) 1.6s both' }}>
                  PS {'>'} <span className="animate-pulse" style={{ animation: 'psBlink 1s step-end infinite' }}>_</span>
                </span>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <SkeletonBlock className="h-5 w-32" delay={0} {...common} />
                  <SkeletonBlock className="h-7 w-20 rounded-md" delay={0.1} {...common} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 sm:gap-4">
                  <SkeletonBlock className="h-4 w-16" delay={0.2} {...common} />
                  <SkeletonBlock className="h-4 w-20" delay={0.3} {...common} />
                  <SkeletonBlock className="h-4 w-14" delay={0.4} {...common} />
                  <SkeletonBlock className="h-4 w-18" delay={0.5} {...common} />
                </div>
              </div>
              <SkeletonBlock className="h-[80px] w-[150px] shrink-0 rounded-md" delay={0.15} {...common} />
            </div>

            <div className="my-4">
              <SkeletonBlock className="h-[100px] w-full rounded-2xl" delay={0.6} {...common} />
            </div>

            <div className="flex gap-5">
              <SkeletonBlock className="h-4 w-28" delay={0.7} {...common} />
              <SkeletonBlock className="h-4 w-28" delay={0.8} {...common} />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ProjectSkeleton
