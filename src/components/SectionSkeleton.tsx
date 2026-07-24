'use client'

import { FC } from 'react'

interface Props {
  style?: 'pulse' | 'shimmer' | 'wave' | 'gradient' | 'cyber' | 'neon' | 'quantum' | 'terminal'
  columns?: 2 | 3
}

const SkeletonBlock: FC<{ className?: string; delay?: number; style?: string }> = ({ className = '', delay = 0, style = 'shimmer' }) => {
  switch (style) {
    case 'pulse':
      return <div className={`animate-pulse rounded bg-[#1a2d4a] ${className}`} />
    case 'shimmer':
      return (
        <div className={`relative overflow-hidden rounded bg-[#1a2d4a] ${className}`}>
          <div className="absolute inset-0 shimmer" />
        </div>
      )
    case 'wave':
      return (
        <div className={`rounded bg-[#1a2d4a] opacity-20 ${className}`} style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: `${delay}s` }} />
      )
    case 'gradient':
      return (
        <div className={`rounded ${className}`} style={{ animation: 'gradientPulse 2s ease-in-out infinite', background: 'linear-gradient(135deg, #1a2d4a 0%, #253a5a 50%, #1a2d4a 100%)', backgroundSize: '200% 200%' }} />
      )
    case 'cyber':
      return (
        <div className={`relative overflow-hidden rounded ${className}`} style={{ background: '#0a1628', border: '1px solid rgba(0, 255, 255, 0.15)' }}>
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
          <div className="absolute inset-0 cyber-scan" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 255, 0.08) 50%, transparent 100%)', animation: 'cyberGlow 2s ease-in-out infinite' }} />
        </div>
      )
    case 'neon':
      return (
        <div className={`relative overflow-hidden rounded ${className}`} style={{ background: '#0d0b1a', border: '1px solid rgba(255, 0, 255, 0.2)' }}>
          <div className="absolute inset-0 neon-scan" />
          <div className="absolute inset-0" style={{ animation: 'neonColorCycle 3s linear infinite' }} />
          <div className="absolute -top-1 -left-1 size-2 rounded-full bg-fuchsia-500" style={{ animation: 'neonParticle 2s ease-in-out infinite' }} />
          <div className="absolute -bottom-1 -right-1 size-1.5 rounded-full bg-cyan-400" style={{ animation: 'neonParticle 2s ease-in-out infinite 0.5s' }} />
          <div className="absolute top-1/2 -right-0 size-1 rounded-full bg-amber-400" style={{ animation: 'neonParticle 1.5s ease-in-out infinite 1s' }} />
        </div>
      )
    case 'quantum':
      return (
        <div className={`relative overflow-hidden rounded ${className}`} style={{ background: '#05031a', border: '1px solid rgba(120, 80, 255, 0.3)' }}>
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
    case 'terminal':
      return (
        <div className={`relative overflow-hidden rounded ${className}`} style={{ background: '#0a0f0a', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
          <div className="absolute inset-0 terminal-scanline" />
          <div className="absolute inset-0 terminal-matrix" />
          <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00ff41]/20" style={{ animation: 'terminalRipple 2s ease-out infinite' }} />
          <div className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00ff41]/10" style={{ animation: 'terminalRipple 2s ease-out infinite 0.5s' }} />
        </div>
      )
    default:
      return <div className={`animate-pulse rounded bg-[#1a2d4a] ${className}`} />
  }
}

const SectionSkeleton: FC<Props> = ({ style = 'shimmer', columns = 3 }) => {
  const common = { style }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%); animation: shimmer 1.5s ease-in-out infinite; }
        @keyframes wave { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
        @keyframes gradientPulse { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
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
        @keyframes quantumTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .quantum-aurora1 {
          background: linear-gradient(135deg, transparent 30%, rgba(80, 200, 255, 0.08) 50%, transparent 70%);
          background-size: 200% 200%;
          animation: quantumAurora1 5s ease-in-out infinite;
        }
        .quantum-aurora2 {
          background: linear-gradient(225deg, transparent 30%, rgba(200, 80, 255, 0.06) 50%, transparent 70%);
          background-size: 200% 200%;
          animation: quantumAurora2 7s ease-in-out infinite;
        }
        @keyframes quantumAurora1 {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
        @keyframes quantumAurora2 {
          0%, 100% { background-position: 100% 0%; }
          50% { background-position: 0% 100%; }
        }
        .quantum-warp {
          background: conic-gradient(from 0deg, transparent, rgba(120, 80, 255, 0.06), transparent, rgba(0, 200, 255, 0.06), transparent);
          animation: quantumWarp 6s linear infinite;
        }
        @keyframes quantumWarp {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .quantum-haze {
          background: radial-gradient(ellipse at 30% 50%, rgba(120, 80, 255, 0.04), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0, 200, 255, 0.04), transparent 60%);
          animation: quantumHaze 4s ease-in-out infinite alternate;
        }
        @keyframes quantumHaze {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes quantumOrbit {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        @keyframes quantumDrift {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-8px) translateX(4px); opacity: 1; }
          50% { transform: translateY(0) translateX(8px); opacity: 0.5; }
          75% { transform: translateY(6px) translateX(2px); opacity: 0.8; }
        }
        @keyframes quantumRing {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.3; border-width: 1px; }
          50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); opacity: 0.6; border-width: 2px; }
        }
        .quantum-card {
          animation: quantumBorderShift 4s linear infinite, quantumBoxGlow 2s ease-in-out infinite;
        }
        @keyframes quantumBorderShift {
          0% { border-color: rgba(120, 80, 255, 0.25); }
          25% { border-color: rgba(0, 200, 255, 0.25); }
          50% { border-color: rgba(200, 80, 255, 0.25); }
          75% { border-color: rgba(0, 255, 200, 0.25); }
          100% { border-color: rgba(120, 80, 255, 0.25); }
        }
        @keyframes quantumBoxGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(120, 80, 255, 0.1), 0 0 30px rgba(0, 200, 255, 0.05); }
          33% { box-shadow: 0 0 25px rgba(0, 200, 255, 0.15), 0 0 50px rgba(200, 80, 255, 0.08); }
          66% { box-shadow: 0 0 20px rgba(200, 80, 255, 0.12), 0 0 40px rgba(0, 255, 200, 0.06); }
        }
        .terminal-scanline {
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px);
          animation: terminalScan 8s linear infinite;
        }
        @keyframes terminalScan { 0% { transform: translateY(0); } 100% { transform: translateY(4px); } }
        .terminal-matrix { background: radial-gradient(ellipse at 30% 20%, rgba(0, 255, 65, 0.04), transparent 70%), radial-gradient(ellipse at 70% 80%, rgba(0, 255, 65, 0.03), transparent 70%); }
        @keyframes terminalType { 0% { opacity: 0; } 100% { opacity: var(--tw-text-opacity); } }
        @keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes terminalRipple { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.4; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } }
        .terminal-card { animation: terminalBorderPulse 2s ease-in-out infinite; }
        @keyframes terminalBorderPulse { 0%, 100% { border-color: rgba(0, 255, 65, 0.15); box-shadow: 0 0 10px rgba(0, 255, 65, 0.05), inset 0 0 10px rgba(0, 255, 65, 0.02); } 50% { border-color: rgba(0, 255, 65, 0.35); box-shadow: 0 0 25px rgba(0, 255, 65, 0.12), inset 0 0 20px rgba(0, 255, 65, 0.05); } }
      `}</style>
      <div className={`grid grid-cols-1 gap-x-8 gap-y-8 ${columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {[1, 2, 3].map((cardIdx) => (
          <div key={cardIdx} className={`relative flex flex-col items-center rounded-[14px] p-5 ${
            style === 'cyber' ? 'border border-cyan-500/20 bg-[#0a1628] cyber-card' :
            style === 'neon' ? 'border border-fuchsia-500/20 bg-[#0d0b1a] neon-card' :
            style === 'quantum' ? 'border border-purple-500/20 bg-[#05031a] quantum-card' :
            style === 'terminal' ? 'border border-green-500/20 bg-[#0a0f0a] terminal-card' :
            'bg-secondary border-border border'
          }`}>
            {style === 'terminal' ? (
              <div className="flex w-full flex-col gap-0.5" style={{ fontFamily: 'monospace' }}>
                <span className="block text-left text-[10px] leading-5 text-[#00ff41]/90" style={{ animation: 'terminalType 0.3s steps(1) 0.1s both' }}>
                  <span className="text-[#00ff41]/50">user@host</span>:<span className="text-[#00ccff]/50">~</span>$ init --module=0{cardIdx}
                </span>
                <span className="block text-left text-[10px] leading-5 text-[#00ff41]/70" style={{ animation: 'terminalType 0.3s steps(1) 0.4s both' }}>
                  {'>'} scanning dependencies... <span className="text-green-400">OK</span>
                </span>
                <span className="block text-left text-[10px] leading-5 text-[#00ff41]/50" style={{ animation: 'terminalType 0.3s steps(1) 0.7s both' }}>
                  {'>'} loading module_0{cardIdx}.bin <span className="text-green-400/80">{cardIdx === 0 ? '███▒▒▒ 60%' : cardIdx === 1 ? '█████ 100%' : '██▒▒▒▒ 40%'}</span>
                </span>
                <span className="block text-left text-[10px] leading-5 text-[#00ff41]/30" style={{ animation: 'terminalType 0.3s steps(1) 1s both' }}>
                  {'>'} {cardIdx === 0 ? 'checksum verified [OK]' : cardIdx === 1 ? 'service started on port 8080' : 'waiting for signal...'}
                  {cardIdx === 2 ? <span className="ml-0.5" style={{ animation: 'terminalBlink 1s step-end infinite' }}>_</span> : null}
                </span>
              </div>
            ) : (
              <>
                <SkeletonBlock className="my-1 size-14 rounded-full" delay={0.1 * cardIdx} {...common} />
                <SkeletonBlock className="mt-2 mb-5 h-5 w-3/4" delay={0.1 * cardIdx + 0.05} {...common} />
                <div className="w-full">
                  <SkeletonBlock className="h-20 w-full rounded-2xl" delay={0.1 * cardIdx + 0.1} {...common} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default SectionSkeleton
